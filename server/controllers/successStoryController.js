const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const transformStory = (s) => ({
  _id: s.id,
  userId: s.user_id,
  groomName: s.groom_name,
  brideName: s.bride_name,
  couplePhoto: s.couple_photo,
  weddingGallery: s.wedding_gallery ? (() => { try { return JSON.parse(s.wedding_gallery); } catch { return []; } })() : [],
  weddingDate: s.wedding_date,
  weddingLocation: s.wedding_location,
  community: s.community,
  storyTitle: s.story_title,
  shortDescription: s.short_description,
  fullStory: s.full_story,
  videoUrl: s.video_url,
  consent: !!s.consent,
  status: s.status,
  rejectionRemark: s.rejection_remark,
  reviewedBy: s.reviewed_by,
  reviewedByName: s.reviewed_by_name || null,
  submittedAt: s.submitted_at,
  approvedAt: s.approved_at,
  updatedAt: s.updated_at,
});

// ─── USER: Submit a success story ───

const submitStory = async (req, res) => {
  try {
    const {
      groomName, brideName, weddingDate, weddingLocation, community,
      storyTitle, shortDescription, fullStory, videoUrl, consent,
    } = req.body;

    if (!groomName || !brideName || !storyTitle || !shortDescription || !fullStory) {
      return res.status(400).json({ message: 'Groom name, bride name, title, short description, and full story are required.' });
    }
    if (!consent) {
      return res.status(400).json({ message: 'You must consent to share your story.' });
    }

    const couplePhoto = req.files?.couplePhoto ? req.files.couplePhoto[0].filename : null;
    let gallery = [];
    if (req.files?.weddingGallery) {
      gallery = req.files.weddingGallery.map((f) => f.filename);
    }

    const [result] = await pool.query(
      `INSERT INTO success_stories
       (user_id, groom_name, bride_name, couple_photo, wedding_gallery, wedding_date, wedding_location,
        community, story_title, short_description, full_story, video_url, consent, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        req.user.id, groomName, brideName, couplePhoto,
        gallery.length ? JSON.stringify(gallery) : null,
        weddingDate || null, weddingLocation || null,
        community || null, storyTitle, shortDescription, fullStory,
        videoUrl || null, consent ? 1 : 0,
      ]
    );

    const story = await getStoryById(result.insertId);
    return res.status(201).json({ message: 'Success story submitted for review.', story });
  } catch (error) {
    console.error('--- SUBMIT STORY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to submit success story.' });
  }
};

// ─── USER: Get my stories ───

const getMyStories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, u.first_name as reviewer_first, u.last_name as reviewer_last
       FROM success_stories s
       LEFT JOIN users u ON s.reviewed_by = u.id
       WHERE s.user_id = ?
       ORDER BY s.submitted_at DESC`,
      [req.user.id]
    );
    const stories = rows.map((s) => {
      const story = transformStory(s);
      if (s.reviewer_first) {
        story.reviewedByName = `${s.reviewer_first} ${s.reviewer_last}`.trim();
      }
      return story;
    });
    return res.status(200).json({ stories });
  } catch (error) {
    console.error('--- GET MY STORIES ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch your stories.' });
  }
};

// ─── USER: Update a pending story ───

const updateMyStory = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM success_stories WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Story not found.' });
    if (existing[0].status !== 'pending') return res.status(400).json({ message: 'Only pending stories can be edited.' });

    const {
      groomName, brideName, weddingDate, weddingLocation, community,
      storyTitle, shortDescription, fullStory, videoUrl, consent,
    } = req.body;

    let couplePhoto = existing[0].couple_photo;
    if (req.files?.couplePhoto) {
      if (couplePhoto) deleteUploadedFile(couplePhoto);
      couplePhoto = req.files.couplePhoto[0].filename;
    }

    let gallery = existing[0].wedding_gallery ? (() => { try { return JSON.parse(existing[0].wedding_gallery); } catch { return []; } })() : [];
    if (req.files?.weddingGallery) {
      gallery.forEach((f) => deleteUploadedFile(f));
      gallery = req.files.weddingGallery.map((f) => f.filename);
    }

    await pool.query(
      `UPDATE success_stories SET
        groom_name = ?, bride_name = ?, couple_photo = ?, wedding_gallery = ?,
        wedding_date = ?, wedding_location = ?, community = ?,
        story_title = ?, short_description = ?, full_story = ?, video_url = ?, consent = ?
       WHERE id = ? AND user_id = ?`,
      [
        groomName || existing[0].groom_name, brideName || existing[0].bride_name,
        couplePhoto, gallery.length ? JSON.stringify(gallery) : null,
        weddingDate || existing[0].wedding_date, weddingLocation || existing[0].wedding_location,
        community || existing[0].community,
        storyTitle || existing[0].story_title, shortDescription || existing[0].short_description,
        fullStory || existing[0].full_story, videoUrl || existing[0].video_url,
        consent !== undefined ? (consent ? 1 : 0) : existing[0].consent,
        id, req.user.id,
      ]
    );

    const story = await getStoryById(id);
    return res.status(200).json({ message: 'Story updated.', story });
  } catch (error) {
    console.error('--- UPDATE MY STORY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to update story.' });
  }
};

// ─── PUBLIC: Get approved stories (paginated) ───

const getApprovedStories = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '', community = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = ["s.status = 'approved'"];

    if (search) {
      conditions.push('(s.groom_name LIKE ? OR s.bride_name LIKE ? OR s.story_title LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (community) {
      conditions.push('s.community = ?');
      params.push(community);
    }

    const whereStr = 'WHERE ' + conditions.join(' AND ');
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM success_stories s ${whereStr}`, params);

    const [rows] = await pool.query(
      `SELECT s.* FROM success_stories s ${whereStr} ORDER BY s.approved_at DESC, s.submitted_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const stories = rows.map(transformStory);
    return res.status(200).json({
      stories,
      totalPages: Math.ceil(total / parseInt(limit)),
      total,
      page: parseInt(page),
    });
  } catch (error) {
    console.error('--- GET APPROVED STORIES ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch stories.' });
  }
};

// ─── PUBLIC: Get single story ───

const getStoryById = async (id) => {
  const [rows] = await pool.query(
    `SELECT s.*, u.first_name as reviewer_first, u.last_name as reviewer_last
     FROM success_stories s
     LEFT JOIN users u ON s.reviewed_by = u.id
     WHERE s.id = ?`,
    [id]
  );
  if (rows.length === 0) return null;
  const story = transformStory(rows[0]);
  if (rows[0].reviewer_first) {
    story.reviewedByName = `${rows[0].reviewer_first} ${rows[0].reviewer_last}`.trim();
  }
  return story;
};

const getPublicStory = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT s.*, u.first_name as reviewer_first, u.last_name as reviewer_last
       FROM success_stories s
       LEFT JOIN users u ON s.reviewed_by = u.id
       WHERE s.id = ? AND s.status = 'approved'`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Story not found.' });

    const story = transformStory(rows[0]);
    if (rows[0].reviewer_first) {
      story.reviewedByName = `${rows[0].reviewer_first} ${rows[0].reviewer_last}`.trim();
    }

    const [related] = await pool.query(
      `SELECT id, groom_name, bride_name, couple_photo, wedding_date, community, short_description
       FROM success_stories WHERE status = 'approved' AND id != ? ORDER BY RAND() LIMIT 4`,
      [id]
    );
    story.relatedStories = related.map((r) => ({
      _id: r.id,
      groomName: r.groom_name,
      brideName: r.bride_name,
      couplePhoto: r.couple_photo,
      weddingDate: r.wedding_date,
      community: r.community,
      shortDescription: r.short_description,
    }));

    return res.status(200).json({ story });
  } catch (error) {
    console.error('--- GET PUBLIC STORY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch story.' });
  }
};

// ─── ADMIN: Get all stories ───

const adminGetStories = async (req, res) => {
  try {
    const { page = 1, limit = 15, status = '', search = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('s.status = ?');
      params.push(status);
    }
    if (search) {
      conditions.push('(s.groom_name LIKE ? OR s.bride_name LIKE ? OR s.story_title LIKE ? OR s.community LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const whereStr = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM success_stories s ${whereStr}`, params);

    const [rows] = await pool.query(
      `SELECT s.*, u.first_name as reviewer_first, u.last_name as reviewer_last
       FROM success_stories s
       LEFT JOIN users u ON s.reviewed_by = u.id
       ${whereStr}
       ORDER BY s.submitted_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const stories = rows.map((s) => {
      const story = transformStory(s);
      if (s.reviewer_first) story.reviewedByName = `${s.reviewer_first} ${s.reviewer_last}`.trim();
      return story;
    });

    return res.status(200).json({
      stories,
      totalPages: Math.ceil(total / parseInt(limit)),
      total,
      page: parseInt(page),
    });
  } catch (error) {
    console.error('--- ADMIN GET STORIES ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch stories.' });
  }
};

// ─── ADMIN: Approve story ───

const adminApproveStory = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM success_stories WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Story not found.' });

    await pool.query(
      "UPDATE success_stories SET status = 'approved', rejection_remark = NULL, reviewed_by = ?, approved_at = NOW() WHERE id = ?",
      [req.user.id, id]
    );
    const story = await getStoryById(id);
    return res.status(200).json({ message: 'Story approved.', story });
  } catch (error) {
    console.error('--- APPROVE STORY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to approve story.' });
  }
};

// ─── ADMIN: Reject story ───

const adminRejectStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;
    const [existing] = await pool.query('SELECT * FROM success_stories WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Story not found.' });

    await pool.query(
      "UPDATE success_stories SET status = 'rejected', rejection_remark = ?, reviewed_by = ? WHERE id = ?",
      [remark || 'Does not meet guidelines', req.user.id, id]
    );
    const story = await getStoryById(id);
    return res.status(200).json({ message: 'Story rejected.', story });
  } catch (error) {
    console.error('--- REJECT STORY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to reject story.' });
  }
};

// ─── ADMIN: Edit story ───

const adminEditStory = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM success_stories WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Story not found.' });

    const fields = [
      'groom_name', 'bride_name', 'wedding_date', 'wedding_location',
      'community', 'story_title', 'short_description', 'full_story', 'video_url',
    ];
    const updates = [];
    const params = [];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        params.push(req.body[f]);
      }
    });

    if (updates.length) {
      params.push(id);
      await pool.query(`UPDATE success_stories SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const story = await getStoryById(id);
    return res.status(200).json({ message: 'Story updated.', story });
  } catch (error) {
    console.error('--- ADMIN EDIT STORY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to update story.' });
  }
};

// ─── ADMIN: Delete story ───

const adminDeleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT couple_photo, wedding_gallery FROM success_stories WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Story not found.' });

    if (existing[0].couple_photo) deleteUploadedFile(existing[0].couple_photo);
    if (existing[0].wedding_gallery) {
      try {
        JSON.parse(existing[0].wedding_gallery).forEach((f) => deleteUploadedFile(f));
      } catch {}
    }

    await pool.query('DELETE FROM success_stories WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Story deleted.' });
  } catch (error) {
    console.error('--- DELETE STORY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to delete story.' });
  }
};

// ─── ADMIN: Get story stats ───

const adminGetStoryStats = async (req, res) => {
  try {
    const [[pending]] = await pool.query("SELECT COUNT(*) as total FROM success_stories WHERE status = 'pending'");
    const [[approved]] = await pool.query("SELECT COUNT(*) as total FROM success_stories WHERE status = 'approved'");
    const [[rejected]] = await pool.query("SELECT COUNT(*) as total FROM success_stories WHERE status = 'rejected'");
    const [[approvedToday]] = await pool.query("SELECT COUNT(*) as total FROM success_stories WHERE status = 'approved' AND DATE(approved_at) = CURDATE()");
    return res.status(200).json({
      pending: pending.total,
      approved: approved.total,
      rejected: rejected.total,
      approvedToday: approvedToday.total,
    });
  } catch (error) {
    console.error('--- STORY STATS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch story stats.' });
  }
};

const deleteUploadedFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  fs.unlink(filePath, () => {});
};

module.exports = {
  submitStory,
  getMyStories,
  updateMyStory,
  getApprovedStories,
  getPublicStory,
  adminGetStories,
  adminApproveStory,
  adminRejectStory,
  adminEditStory,
  adminDeleteStory,
  adminGetStoryStats,
};
