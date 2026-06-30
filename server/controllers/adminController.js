const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// ─── HELPER: Transform user row to frontend format ───
const transformUser = (u) => ({
  _id: u.id,
  fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.full_name || 'N/A',
  firstName: u.first_name,
  lastName: u.last_name,
  email: u.email,
  mobile: u.mobile,
  gender: u.gender,
  age: u.age || null,
  religion: u.religion || null,
  caste: u.caste || null,
  education: u.education || null,
  occupation: u.occupation || null,
  city: u.city || null,
  state: u.state || null,
  country: u.country || null,
  profilePhoto: u.profile_photo || null,
  subscription_type: u.subscription_type || 'free',
  profileCompleted: u.profile_completed === 1 || u.profile_completed === true,
  isVerified: u.is_verified === 1 || u.is_verified === true,
  isSuspended: u.is_suspended === 1 || u.is_suspended === true,
  isAdmin: u.is_admin === 1 || u.is_admin === true,
  approvalStatus: u.approval_status || null,
  maritalStatus: u.marital_status || null,
  createdAt: u.created_at || null,
  updatedAt: u.updated_at || null,
});

// ─── DASHBOARD ───

const getDashboardStats = async (req, res) => {
  try {
    const [[totalUsers]] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [[activeProfiles]] = await pool.query("SELECT COUNT(*) as total FROM profiles WHERE profile_completed = 1 AND approval_status = 'approved'");
    const [[pendingApprovals]] = await pool.query("SELECT COUNT(*) as total FROM profiles WHERE approval_status = 'pending'");
    const [[verifiedProfiles]] = await pool.query('SELECT COUNT(*) as total FROM users WHERE is_verified = 1');
    const [[premiumMembers]] = await pool.query("SELECT COUNT(*) as total FROM users WHERE subscription_type = 'premium'");
    const [[totalMatches]] = await pool.query('SELECT COUNT(*) as total FROM matches');
    const [[totalRevenue]] = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM subscriptions WHERE status = 'active'");
    const [[reportedProfiles]] = await pool.query("SELECT COUNT(*) as total FROM reports WHERE status = 'pending'");

    const [recentRegistrations] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.gender, u.created_at,
              COALESCE(p.profile_completed, 0) as profile_completed
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ORDER BY u.created_at DESC LIMIT 10`
    );

    const [monthlyRegistrations] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
       FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY month ORDER BY month`
    );

    const [genderDist] = await pool.query(
      `SELECT gender, COUNT(*) as count FROM users GROUP BY gender`
    );

    const genderDistribution = { male: 0, female: 0 };
    genderDist.forEach((g) => {
      if (g.gender && g.gender.toLowerCase() === 'male') genderDistribution.male = g.count;
      else if (g.gender && g.gender.toLowerCase() === 'female') genderDistribution.female = g.count;
    });

    return res.status(200).json({
      stats: {
        totalUsers: totalUsers.total,
        activeProfiles: activeProfiles.total,
        pendingApprovals: pendingApprovals.total,
        verifiedProfiles: verifiedProfiles.total,
        premiumMembers: premiumMembers.total,
        totalMatches: totalMatches.total,
        revenue: parseFloat(totalRevenue.total),
        reportedProfiles: reportedProfiles.total,
      },
      recentRegistrations: recentRegistrations.map((u) => ({
        _id: u.id,
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'N/A',
        email: u.email,
        gender: u.gender,
        profileStatus: u.profile_completed ? 'completed' : 'incomplete',
        joinedDate: u.created_at,
      })),
      monthlyRegistrations: monthlyRegistrations.map((m) => ({
        month: m.month,
        count: m.count,
      })),
      genderDistribution,
    });
  } catch (error) {
    console.error('--- ADMIN DASHBOARD STATS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
};

// ─── USERS MANAGEMENT ───

const getUsers = async (req, res) => {
  try {
    const {
      search = '',
      gender = '',
      ageMin = '',
      ageMax = '',
      religion = '',
      membership = '',
      profileStatus = '',
      verification = '',
      page = 1,
      limit = 15,
      sort = 'created_at',
      order = 'desc',
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sortFieldMap = {
      name: 'u.first_name',
      email: 'u.email',
      age: 'p.age',
      created_at: 'u.created_at',
    };
    const dbSortField = sortFieldMap[sort] || 'u.created_at';
    const dbSortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let whereClauses = [];
    let params = [];

    whereClauses.push('u.is_admin = 0');

    if (search) {
      whereClauses.push('(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.mobile LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    if (gender) {
      whereClauses.push('LOWER(u.gender) = ?');
      params.push(gender.toLowerCase());
    }
    if (ageMin) {
      whereClauses.push('p.age >= ?');
      params.push(parseInt(ageMin));
    }
    if (ageMax) {
      whereClauses.push('p.age <= ?');
      params.push(parseInt(ageMax));
    }
    if (religion) {
      whereClauses.push('p.religion = ?');
      params.push(religion);
    }
    if (membership) {
      whereClauses.push('u.subscription_type = ?');
      params.push(membership);
    }
    if (profileStatus) {
      if (profileStatus === 'completed') {
        whereClauses.push('p.profile_completed = 1');
      } else {
        whereClauses.push('(p.profile_completed = 0 OR p.profile_completed IS NULL)');
      }
    }
    if (verification) {
      if (verification === 'verified') {
        whereClauses.push('u.is_verified = 1');
      } else {
        whereClauses.push('(u.is_verified = 0 OR u.is_verified IS NULL)');
      }
    }

    const whereStr = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM users u LEFT JOIN profiles p ON u.id = p.user_id ${whereStr}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile, u.gender,
              u.subscription_type, u.is_admin, u.is_suspended, u.is_verified,
              u.created_at, u.viewed_profiles,
              COALESCE(p.profile_completed, 0) as profile_completed,
              p.full_name, p.age, p.religion, p.caste, p.education, p.occupation,
              p.city, p.state, p.country, p.profile_photo,
              p.approval_status, p.marital_status
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ${whereStr}
       ORDER BY ${dbSortField} ${dbSortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const users = rows.map(transformUser);

    return res.status(200).json({
      users,
      stats: {
        total,
        active: rows.filter((r) => r.profile_completed === 1).length,
        suspended: rows.filter((r) => r.is_suspended === 1).length,
        verified: rows.filter((r) => r.is_verified === 1).length,
      },
      pagination: {
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      },
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('--- GET USERS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT u.*, p.*
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user: transformUser(rows[0]) });
  } catch (error) {
    console.error('--- GET USER DETAIL ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch user details.' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, mobile, gender, membership } = req.body;
    const nameParts = (fullName || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    await pool.query(
      `UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ?, gender = ?, subscription_type = ? WHERE id = ?`,
      [firstName, lastName, email, mobile, gender, membership || 'free', id]
    );
    return res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('--- UPDATE USER ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to update user.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('--- DELETE USER ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
};

const toggleVerifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT is_verified FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const newStatus = rows[0].is_verified ? 0 : 1;
    await pool.query('UPDATE users SET is_verified = ? WHERE id = ?', [newStatus, id]);
    return res.status(200).json({ message: `User ${newStatus ? 'verified' : 'unverified'} successfully.`, isVerified: !!newStatus });
  } catch (error) {
    console.error('--- TOGGLE VERIFY USER ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to toggle verification.' });
  }
};

const toggleSuspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT is_suspended FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const newStatus = rows[0].is_suspended ? 0 : 1;
    await pool.query('UPDATE users SET is_suspended = ? WHERE id = ?', [newStatus, id]);
    return res.status(200).json({ message: `User ${newStatus ? 'suspended' : 'activated'} successfully.`, isSuspended: !!newStatus });
  } catch (error) {
    console.error('--- TOGGLE SUSPEND USER ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to toggle suspension.' });
  }
};

// ─── PROFILE APPROVAL ───

const getProfileStats = async (req, res) => {
  try {
    const [[pending]] = await pool.query("SELECT COUNT(*) as total FROM profiles WHERE approval_status = 'pending'");
    const [[approved]] = await pool.query("SELECT COUNT(*) as total FROM profiles WHERE approval_status = 'approved'");
    const [[rejected]] = await pool.query("SELECT COUNT(*) as total FROM profiles WHERE approval_status = 'rejected'");
    const [[revision]] = await pool.query("SELECT COUNT(*) as total FROM profiles WHERE approval_status = 'revision'");
    const [[approvedToday]] = await pool.query(
      "SELECT COUNT(*) as total FROM profiles WHERE approval_status = 'approved' AND (DATE(updated_at) = CURDATE() OR DATE(created_at) = CURDATE())"
    );
    const [[rejectedToday]] = await pool.query(
      "SELECT COUNT(*) as total FROM profiles WHERE approval_status = 'rejected' AND (DATE(updated_at) = CURDATE() OR DATE(created_at) = CURDATE())"
    );
    const totalProfiles = pending.total + approved.total + rejected.total + revision.total;
    return res.status(200).json({
      pending: pending.total,
      approved: approved.total,
      rejected: rejected.total,
      revision: revision.total,
      approvedToday: approvedToday.total,
      rejectedToday: rejectedToday.total,
      total: totalProfiles,
    });
  } catch (error) {
    console.error('--- PROFILE STATS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch profile stats.' });
  }
};

const getPendingProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClauses = [];
    let params = [];

    if (status) {
      whereClauses.push('p.approval_status = ?');
      params.push(status);
    }

    const whereStr = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM profiles p ${whereStr}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT u.id as user_id, u.first_name, u.last_name, u.email, u.mobile, u.gender, u.created_at,
              p.id as profile_id, p.full_name, p.age, p.height, p.date_of_birth as dob,
              p.marital_status, p.religion, p.caste, p.sub_caste, p.mother_tongue,
              p.education, p.occupation, p.company_name, p.annual_income,
              p.father_name, p.mother_name, p.siblings,
              p.country, p.state, p.city,
              p.profile_photo, p.approval_status, p.rejection_reason, p.rasi, p.nakshatra,
              p.created_at as profile_created_at, p.updated_at as profile_updated_at
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       ${whereStr}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const profiles = rows.map((p) => ({
      _id: p.profile_id,
      userId: p.user_id,
      name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
      email: p.email,
      phone: p.mobile,
      gender: p.gender,
      age: p.age,
      dob: p.dob,
      height: p.height,
      maritalStatus: p.marital_status,
      religion: p.religion,
      caste: p.caste,
      subCaste: p.sub_caste,
      motherTongue: p.mother_tongue,
      education: p.education,
      occupation: p.occupation,
      annualIncome: p.annual_income,
      fatherName: p.father_name,
      motherName: p.mother_name,
      siblings: p.siblings,
      city: p.city,
      state: p.state,
      country: p.country,
      rasi: p.rasi,
      nakshatra: p.nakshatra,
      profilePhoto: p.profile_photo,
      status: p.approval_status || 'pending',
      rejectionReason: p.rejection_reason,
      profileId: p.profile_id,
      createdAt: p.profile_created_at,
      updatedAt: p.profile_updated_at,
    }));

    return res.status(200).json({
      profiles,
      totalPages: Math.ceil(total / parseInt(limit)),
      total,
      pages: Math.ceil(total / parseInt(limit)),
      pagination: { total, page: parseInt(page), limit: parseInt(limit), total_pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('--- GET PENDING PROFILES ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch profiles.' });
  }
};

const getProfileDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT u.*, p.*
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Profile not found.' });
    return res.status(200).json({ profile: rows[0] });
  } catch (error) {
    console.error('--- GET PROFILE DETAIL ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch profile details.' });
  }
};

const approveProfile = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE profiles SET approval_status = 'approved', rejection_reason = NULL WHERE id = ?", [id]);
    return res.status(200).json({ message: 'Profile approved successfully.' });
  } catch (error) {
    console.error('--- APPROVE PROFILE ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to approve profile.' });
  }
};

const rejectProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await pool.query("UPDATE profiles SET approval_status = 'rejected', rejection_reason = ? WHERE id = ?", [reason || 'Profile does not meet guidelines', id]);
    return res.status(200).json({ message: 'Profile rejected.' });
  } catch (error) {
    console.error('--- REJECT PROFILE ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to reject profile.' });
  }
};

const requestProfileUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await pool.query("UPDATE profiles SET approval_status = 'revision', rejection_reason = ? WHERE id = ?", [reason || 'Please update your profile information.', id]);
    return res.status(200).json({ message: 'Profile update requested.' });
  } catch (error) {
    console.error('--- REQUEST PROFILE UPDATE ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to request profile update.' });
  }
};

// ─── COMMUNITY MANAGEMENT ───

const getCommunities = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(p.id) as member_count
       FROM communities c
       LEFT JOIN profiles p ON p.religion = c.name AND p.profile_completed = 1
       GROUP BY c.id
       ORDER BY c.name`
    );
    const communities = rows.map((c) => ({
      _id: c.id,
      name: c.name,
      description: c.description || '',
      isEnabled: c.is_enabled === 1 || c.is_enabled === true,
      memberCount: c.member_count || 0,
      totalMembers: c.member_count || 0,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));
    return res.status(200).json({ data: communities, communities });
  } catch (error) {
    console.error('--- GET COMMUNITIES ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch communities.' });
  }
};

const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Community name is required.' });
    await pool.query('INSERT INTO communities (name, description) VALUES (?, ?)', [name, description || '']);
    return res.status(201).json({ message: 'Community created successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Community already exists.' });
    }
    console.error('--- CREATE COMMUNITY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to create community.' });
  }
};

const updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await pool.query('UPDATE communities SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    return res.status(200).json({ message: 'Community updated successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Community name already exists.' });
    }
    console.error('--- UPDATE COMMUNITY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to update community.' });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM communities WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Community deleted successfully.' });
  } catch (error) {
    console.error('--- DELETE COMMUNITY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to delete community.' });
  }
};

const toggleCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT is_enabled FROM communities WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Community not found.' });
    const newStatus = rows[0].is_enabled ? 0 : 1;
    await pool.query('UPDATE communities SET is_enabled = ? WHERE id = ?', [newStatus, id]);
    return res.status(200).json({
      message: `Community ${newStatus ? 'enabled' : 'disabled'} successfully.`,
      data: { isEnabled: !!newStatus },
      community: { isEnabled: !!newStatus },
      is_enabled: newStatus,
    });
  } catch (error) {
    console.error('--- TOGGLE COMMUNITY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to toggle community.' });
  }
};

// ─── SUBSCRIPTION MANAGEMENT ───

const getAdminSubscriptionsList = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM subscriptions');

    const [rows] = await pool.query(
      `SELECT s.id, s.user_id, s.plan, s.start_date, s.end_date, s.amount, s.status, s.created_at,
              u.first_name, u.last_name, u.email, u.is_verified, u.is_suspended
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );

    const subscriptions = rows.map((s) => ({
      _id: s.id,
      plan: s.plan,
      startDate: s.start_date,
      endDate: s.end_date,
      amount: s.amount,
      status: s.status,
      createdAt: s.created_at,
      userId: {
        _id: s.user_id,
        fullName: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'N/A',
        email: s.email,
        profilePhoto: null,
        isVerified: !!s.is_verified,
        isSuspended: !!s.is_suspended,
      },
    }));

    const activeSubs = subscriptions.filter((s) => s.status === 'active');
    const totalAmount = activeSubs.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);

    return res.status(200).json({
      subscriptions,
      stats: {
        activeSubscriptions: activeSubs.length,
        premiumUsers: activeSubs.length,
        freeUsers: 0,
        monthlyRevenue: totalAmount,
      },
      pagination: { totalPages: Math.ceil(total / parseInt(limit)), total, page: parseInt(page), limit: parseInt(limit) },
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('--- ADMIN SUBSCRIPTIONS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch subscriptions.' });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 15, dateFrom = '', dateTo = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let whereClauses = ["s.amount > 0"];
    let params = [];

    if (dateFrom) {
      whereClauses.push('s.created_at >= ?');
      params.push(dateFrom + '-01');
    }
    if (dateTo) {
      whereClauses.push('s.created_at <= ?');
      params.push(dateTo + '-31');
    }

    const whereStr = 'WHERE ' + whereClauses.join(' AND ');

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM subscriptions s ${whereStr}`, params);

    const [rows] = await pool.query(
      `SELECT s.id, s.user_id, s.plan, s.start_date, s.end_date, s.amount, s.status, s.created_at,
              u.first_name, u.last_name, u.email
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       ${whereStr}
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const payments = rows.map((s) => ({
      _id: s.id,
      plan: s.plan,
      amount: s.amount,
      date: s.created_at,
      createdAt: s.created_at,
      status: s.status === 'active' ? 'completed' : s.status,
      userId: {
        _id: s.user_id,
        fullName: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'N/A',
        email: s.email,
        profilePhoto: null,
      },
    }));

    const amounts = payments.map((p) => parseFloat(p.amount || 0));
    const totalRevenue = amounts.reduce((sum, a) => sum + a, 0);

    return res.status(200).json({
      payments,
      stats: {
        totalRevenue,
        totalPayments: payments.length,
        averagePayment: payments.length ? totalRevenue / payments.length : 0,
        highestPayment: amounts.length ? Math.max(...amounts) : 0,
      },
      pagination: { totalPages: Math.ceil(total / parseInt(limit)), total, page: parseInt(page), limit: parseInt(limit) },
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('--- PAYMENT HISTORY ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch payment history.' });
  }
};

const toggleSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT status, user_id FROM subscriptions WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Subscription not found.' });
    const newStatus = rows[0].status === 'active' ? 'expired' : 'active';
    await pool.query('UPDATE subscriptions SET status = ? WHERE id = ?', [newStatus, id]);

    if (newStatus === 'expired') {
      await pool.query("UPDATE users SET subscription_type = 'free' WHERE id = ?", [rows[0].user_id]);
    } else {
      await pool.query("UPDATE users SET subscription_type = 'premium' WHERE id = ?", [rows[0].user_id]);
    }

    return res.status(200).json({ message: `Subscription ${newStatus}.`, status: newStatus });
  } catch (error) {
    console.error('--- TOGGLE SUBSCRIPTION ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to toggle subscription.' });
  }
};

// ─── MATCHES MANAGEMENT ───

const getMatchesList = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM matches');

    const [rows] = await pool.query(
      `SELECT m.id as match_id, m.created_at as matched_at,
              u1.id as u1_id, u1.first_name as u1_first, u1.last_name as u1_last, u1.email as u1_email, u1.gender as u1_gender,
              u2.id as u2_id, u2.first_name as u2_first, u2.last_name as u2_last, u2.email as u2_email, u2.gender as u2_gender,
              p1.profile_photo as u1_photo, p2.profile_photo as u2_photo,
              p1.age as u1_age, p2.age as u2_age,
              p1.city as u1_city, p2.city as u2_city,
              p1.state as u1_state, p2.state as u2_state
       FROM matches m
       JOIN users u1 ON m.user1_id = u1.id
       JOIN users u2 ON m.user2_id = u2.id
       LEFT JOIN profiles p1 ON u1.id = p1.user_id
       LEFT JOIN profiles p2 ON u2.id = p2.user_id
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );

    const matches = rows.map((m) => ({
      _id: m.match_id,
      matchedAt: m.matched_at,
      createdAt: m.matched_at,
      date: m.matched_at,
      partner1: {
        _id: m.u1_id,
        fullName: `${m.u1_first || ''} ${m.u1_last || ''}`.trim() || 'N/A',
        email: m.u1_email,
        gender: m.u1_gender,
        age: m.u1_age,
        city: m.u1_city,
        state: m.u1_state,
        profilePhoto: m.u1_photo,
      },
      partner2: {
        _id: m.u2_id,
        fullName: `${m.u2_first || ''} ${m.u2_last || ''}`.trim() || 'N/A',
        email: m.u2_email,
        gender: m.u2_gender,
        age: m.u2_age,
        city: m.u2_city,
        state: m.u2_state,
        profilePhoto: m.u2_photo,
      },
      user1: {
        _id: m.u1_id,
        fullName: `${m.u1_first || ''} ${m.u1_last || ''}`.trim() || 'N/A',
        email: m.u1_email,
        age: m.u1_age,
        city: m.u1_city,
      },
      user2: {
        _id: m.u2_id,
        fullName: `${m.u2_first || ''} ${m.u2_last || ''}`.trim() || 'N/A',
        email: m.u2_email,
        age: m.u2_age,
        city: m.u2_city,
      },
    }));

    const totalMatches = matches.length;
    const thisMonth = matches.filter((m) => {
      if (!m.matchedAt) return false;
      const d = new Date(m.matchedAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return res.status(200).json({
      matches,
      data: matches,
      stats: { total, thisMonth, active: total, matchRate: 0 },
      total,
      pagination: { totalPages: Math.ceil(total / parseInt(limit)), total, page: parseInt(page), limit: parseInt(limit) },
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('--- GET MATCHES LIST ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch matches.' });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM matches WHERE id = ?', [id]);
    return res.status(200).json({ message: 'Match removed successfully.' });
  } catch (error) {
    console.error('--- DELETE MATCH ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to remove match.' });
  }
};

// ─── REPORTS & SUPPORT ───

const getReportStats = async (req, res) => {
  try {
    const [[totalReports]] = await pool.query('SELECT COUNT(*) as total FROM reports');
    const [[pendingReports]] = await pool.query("SELECT COUNT(*) as total FROM reports WHERE status = 'pending'");
    const [[resolvedToday]] = await pool.query("SELECT COUNT(*) as total FROM reports WHERE status = 'resolved' AND DATE(resolved_at) = CURDATE()");
    const [[totalMessages]] = await pool.query('SELECT COUNT(*) as total FROM contact_messages');
    return res.status(200).json({ totalReports: totalReports.total, pendingReports: pendingReports.total, resolvedToday: resolvedToday.total, totalMessages: totalMessages.total });
  } catch (error) {
    console.error('--- REPORT STATS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch report stats.' });
  }
};

const getReports = async (req, res) => {
  try {
    const { type = '', status = '', page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let whereClauses = [];
    let params = [];

    if (type) {
      whereClauses.push('r.type = ?');
      params.push(type);
    }
    if (status) {
      whereClauses.push('r.status = ?');
      params.push(status);
    }
    const whereStr = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM reports r ${whereStr}`, params);

    const [rows] = await pool.query(
      `SELECT r.*, rb.first_name as reporter_first, rb.last_name as reporter_last,
              ru.first_name as reported_first, ru.last_name as reported_last
       FROM reports r
       JOIN users rb ON r.reported_by = rb.id
       LEFT JOIN users ru ON r.reported_user_id = ru.id
       ${whereStr}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const reports = rows.map((r) => ({
      _id: r.id,
      type: r.type,
      description: r.description,
      status: r.status,
      createdAt: r.created_at,
      reporterName: `${r.reporter_first || ''} ${r.reporter_last || ''}`.trim() || 'N/A',
      reporterEmail: '',
      reportedUserName: `${r.reported_first || ''} ${r.reported_last || ''}`.trim() || 'N/A',
      reportedUserId: r.reported_user_id,
    }));

    return res.status(200).json({
      reports,
      data: reports,
      totalPages: Math.ceil(total / parseInt(limit)),
      pages: Math.ceil(total / parseInt(limit)),
      pagination: { total, page: parseInt(page), limit: parseInt(limit), total_pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('--- GET REPORTS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch reports.' });
  }
};

const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (action === 'dismiss') {
      await pool.query("UPDATE reports SET status = 'dismissed', resolved_by = ?, resolved_at = NOW() WHERE id = ?", [req.user?.id || null, id]);
      return res.status(200).json({ message: 'Report dismissed.' });
    }

    const [rows] = await pool.query('SELECT reported_user_id FROM reports WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Report not found.' });

    if (rows[0].reported_user_id) {
      await pool.query('UPDATE users SET is_suspended = 1 WHERE id = ?', [rows[0].reported_user_id]);
    }
    await pool.query("UPDATE reports SET status = 'resolved', resolved_by = ?, resolved_at = NOW() WHERE id = ?", [req.user?.id || null, id]);
    return res.status(200).json({ message: 'Report resolved. User has been suspended.' });
  } catch (error) {
    console.error('--- RESOLVE REPORT ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to resolve report.' });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const { status = '', page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let whereClauses = [];
    let params = [];

    if (status) {
      whereClauses.push('status = ?');
      params.push(status);
    }
    const whereStr = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM contact_messages ${whereStr}`, params);

    const [rows] = await pool.query(
      `SELECT * FROM contact_messages ${whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const messages = rows.map((m) => ({
      _id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject || '—',
      message: m.message || '—',
      status: m.status || 'unread',
      createdAt: m.created_at,
    }));

    return res.status(200).json({
      messages,
      data: messages,
      totalPages: Math.ceil(total / parseInt(limit)),
      pages: Math.ceil(total / parseInt(limit)),
      pagination: { total, page: parseInt(page), limit: parseInt(limit), total_pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('--- GET CONTACT MESSAGES ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch contact messages.' });
  }
};

const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    return res.status(200).json({ message: 'Message status updated.' });
  } catch (error) {
    console.error('--- UPDATE CONTACT MESSAGE ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to update message status.' });
  }
};

// ─── SETTINGS ───

const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM website_settings');
    const settings = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });
    return res.status(200).json({ settings, data: settings });
  } catch (error) {
    console.error('--- GET SETTINGS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch settings.' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO website_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    return res.status(200).json({ message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('--- UPDATE SETTINGS ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to update settings.' });
  }
};

// ─── ADMIN PROFILE ───

const getAdminProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, first_name, last_name, email, mobile, gender, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Admin not found.' });
    const admin = {
      _id: rows[0].id,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
      email: rows[0].email,
      mobile: rows[0].mobile,
      phone: rows[0].mobile,
      gender: rows[0].gender,
      createdAt: rows[0].created_at,
    };
    return res.status(200).json({ admin, user: admin, data: admin });
  } catch (error) {
    console.error('--- GET ADMIN PROFILE ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to fetch admin profile.' });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, mobile } = req.body;
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile = ? WHERE id = ?',
      [first_name, last_name, email, mobile, req.user.id]
    );
    return res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('--- UPDATE ADMIN PROFILE ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
};

const changeAdminPassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(current_password, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('--- CHANGE PASSWORD ERROR ---', error.message);
    return res.status(500).json({ message: 'Failed to change password.' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserDetail,
  updateUser,
  deleteUser,
  toggleVerifyUser,
  toggleSuspendUser,
  getProfileStats,
  getPendingProfiles,
  getProfileDetail,
  approveProfile,
  rejectProfile,
  requestProfileUpdate,
  getCommunities,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  toggleCommunity,
  getAdminSubscriptionsList,
  getPaymentHistory,
  toggleSubscriptionStatus,
  getMatchesList,
  deleteMatch,
  getReportStats,
  getReports,
  resolveReport,
  getContactMessages,
  updateContactMessageStatus,
  getSettings,
  updateSettings,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
};
