const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const stories = [
  {
    userId: 8,
    groomName: 'Arun Kumar',
    brideName: 'Priya Sharma',
    weddingDate: '2025-12-15',
    weddingLocation: 'Chennai, Tamil Nadu',
    community: 'Iyer',
    storyTitle: 'A Match Made in Heaven',
    shortDescription: 'After months of searching, we found each other on JOD Matrimony. Our families connected through the platform and the rest is history.',
    fullStory: `It all started when my parents created my profile on JOD Matrimony. I was a bit hesitant at first, but little did I know that this would change my life forever.

One evening, I received a interest request from Priya's profile. Her smile in the photo caught my attention instantly. I decided to send a response, and we started chatting through the platform.

Our first conversation flowed so naturally — we discovered we shared a love for travel, books, and South Indian filter coffee. After a few weeks of talking, we decided to meet.

The first meeting was at a small café in Chennai. We talked for hours about our dreams, families, and what we were looking for in life. It felt like I had known her for years.

Our families got involved, and to our delight, they got along wonderfully. Everything fell into place seamlessly, as if it was destined.

We got married on December 15th, 2025, surrounded by our loved ones. JOD Matrimony didn't just help me find a life partner — it helped me find my best friend.

Thank you, JOD Matrimony, for bringing us together. ❤️`,
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    status: 'approved',
    approvedAt: '2026-01-10 10:30:00',
    reviewedBy: 19,
  },
  {
    userId: 9,
    groomName: 'Rahul Verma',
    brideName: 'Ananya Reddy',
    weddingDate: '2026-02-20',
    weddingLocation: 'Hyderabad, Telangana',
    community: 'Reddy',
    storyTitle: 'From Two Different Worlds, One Heart',
    shortDescription: 'We were from different states and different cultures, but JOD Matrimony showed us that love needs no boundaries.',
    fullStory: `Rahul is a CA from Mumbai, and I am a doctor from Hyderabad. Our worlds couldn't have been more different. But as they say, opposites attract!

My sister found Rahul's profile on JOD Matrimony and insisted I check it out. I wasn't too sure about a long-distance match, but I decided to give it a try.

We started with a simple "Hi" on the platform, and soon we were talking every single day. Late-night calls, sharing photos of our days, and gradually falling in love without even realizing it.

The first time Rahul visited Hyderabad to meet me, he brought a box of Mumbai's famous kebabs. That was the moment I knew he was special — he paid attention to the little things I mentioned.

Our wedding was a beautiful blend of Maharashtrian and Telugu traditions. It was a celebration of two cultures coming together as one.

We are forever grateful to JOD Matrimony for helping us find love beyond borders.`,
    status: 'approved',
    approvedAt: '2026-03-05 14:00:00',
    reviewedBy: 19,
  },
  {
    userId: 11,
    groomName: 'Vikram Singh',
    brideName: 'Neha Patel',
    weddingDate: '2025-10-08',
    weddingLocation: 'Ahmedabad, Gujarat',
    community: 'Patel',
    storyTitle: 'Love at First Interest',
    shortDescription: 'A simple interest request led to a lifetime of togetherness. Our journey from the first message to the wedding day was nothing short of magical.',
    fullStory: `I had been on JOD Matrimony for about two months when I came across Neha's profile. There was something about her smile that made me stop scrolling.

I sent an interest request, not expecting much. But when she accepted and sent a message back, I was over the moon.

We talked for hours every day. Neha is a fashion designer with a creative soul, and I am an investment banker with a logical mind. We balanced each other perfectly.

Our first meeting was at a cafe in Ahmedabad. I reached early, nervous and excited. When she walked in, all my nervousness disappeared. We spent the entire afternoon talking, laughing, and sharing stories.

The proposal happened during a trip to Udaipur. I had planned it for weeks. She said yes without a moment's hesitation.

JOD Matrimony brought two strangers together and made them family. We will always be thankful for this beautiful platform.`,
    status: 'approved',
    approvedAt: '2025-11-20 09:00:00',
    reviewedBy: 19,
  },
  {
    userId: 12,
    groomName: 'Aditya Joshi',
    brideName: 'Sara Khan',
    weddingDate: '2026-04-12',
    weddingLocation: 'Pune, Maharashtra',
    community: 'Joshi',
    storyTitle: 'When Families Said Yes',
    shortDescription: 'Our love story is also a story of two families coming together. JOD Matrimony helped us find each other and our families found peace in the match.',
    fullStory: `Aditya and I first connected on JOD Matrimony in early 2025. He was an architect from Pune, and I was working as a professional in Bangalore.

The distance didn't matter because every conversation brought us closer. We shared our dreams, our fears, and our hopes for the future.

The biggest challenge was bringing our families together, as we come from different backgrounds. But JOD Matrimony's detailed profiles helped our parents see how compatible we were on values, education, and life goals.

After multiple family meetings and discussions, both families gave their blessings. The day our parents met and hugged each other was one of the happiest moments of our lives.

Our wedding was a beautiful ceremony in Pune, filled with love, laughter, and the blessings of everyone who supported us.

To anyone searching for their perfect match — trust the process, trust JOD Matrimony, and most importantly, trust your heart.`,
    status: 'approved',
    approvedAt: '2026-04-28 11:00:00',
    reviewedBy: 19,
  },
  {
    userId: 13,
    groomName: 'Karthik Nair',
    brideName: 'Deepa Banerjee',
    weddingDate: '2025-08-25',
    weddingLocation: 'Kochi, Kerala',
    community: 'Nair',
    storyTitle: 'Bound by Tradition, United by Love',
    shortDescription: 'We were both traditional at heart and wanted a partner who shared our values. JOD Matrimony helped us find exactly what we were looking for.',
    fullStory: `Both Karthik and I were looking for someone who respected tradition while having a modern outlook. Our profiles on JOD Matrimony reflected this clearly.

When I first saw Karthik's profile, what stood out was his respect for family values and his career as a data scientist. He seemed like the perfect blend of old and new.

Our conversations started with discussing our favorite books and quickly moved to deeper topics — life, spirituality, and our vision for the future.

The first meeting was at a traditional Kerala restaurant in Kochi. He ordered my favorite dishes without me telling him — he had remembered from our conversations.

Our wedding was a beautiful Kerala-style ceremony with all the traditional rituals. It was everything we had dreamed of.

JOD Matrimony made it easy to find someone who shares not just interests, but core values. We are blessed to have found each other.`,
    status: 'approved',
    approvedAt: '2025-09-15 16:00:00',
    reviewedBy: 19,
  },
  {
    userId: 14,
    groomName: 'Rohit Mehta',
    brideName: 'Isha Deshmukh',
    weddingDate: '2026-06-18',
    weddingLocation: 'Jaipur, Rajasthan',
    community: 'Mehta',
    storyTitle: 'The Perfect Match We Almost Missed',
    shortDescription: 'We almost swiped past each other, but fate (and JOD Matrimony) had other plans. Here is how we found our happily ever after.',
    fullStory: `It's funny how life works. Rohit's profile was suggested to me three times before I finally decided to send an interest request. Looking back, I can't believe I almost missed my soulmate.

When we first connected on JOD Matrimony, the conversation started casually. But soon we realized we had so much in common — from our love for Rajasthani cuisine to our passion for traveling.

Rohit proposed during a hot air balloon ride in Jaipur — it was straight out of a movie! I said yes before he could even finish his sentence.

Our wedding in Jaipur was a grand affair, blending Mehta and Deshmukh traditions beautifully.

Thank you, JOD Matrimony, for bringing us together. If you are reading this and still searching, don't give up. Your perfect match might just be one profile away.`,
    status: 'pending',
    reviewedBy: null,
  },
  {
    userId: 15,
    groomName: 'Manish Agarwal',
    brideName: 'Kavya Nambiar',
    weddingDate: '2026-07-10',
    weddingLocation: 'Kolkata, West Bengal',
    community: 'Agarwal',
    storyTitle: 'Finding Love in the City of Joy',
    shortDescription: 'Two souls from different cities found each other on JOD Matrimony and discovered that home is not a place, it is a person.',
    fullStory: `I was working in Kolkata when my parents suggested I create a profile on JOD Matrimony. Manish was also on the platform, looking for someone who shared his values.

When I saw Manish's profile, what caught my attention was his thoughtful answers to the compatibility questions. He had put genuine effort into describing what he was looking for.

We talked for a month before meeting. The first meeting was at a park in Kolkata, and we walked for hours, talking about everything under the sun.

Manish is an investment analyst with a calm demeanor, and I am a software consultant who is more outgoing. We complement each other perfectly.

Our wedding will be in Kolkata, and we are planning a beautiful fusion ceremony that celebrates both our cultures.

JOD Matrimony has been a blessing in our lives. We can't wait to start our journey together!`,
    status: 'pending',
    reviewedBy: null,
  },
  {
    userId: 16,
    groomName: 'Siddharth Chowdhury',
    brideName: 'Pooja Rajput',
    weddingDate: '2026-09-05',
    weddingLocation: 'Guwahati, Assam',
    community: 'Chowdhury',
    storyTitle: 'A Love Story Written in the Stars',
    shortDescription: 'We both believe in destiny, and JOD Matrimony proved that what is meant for you will find its way, no matter what.',
    fullStory: `Siddharth and I both believe in the power of destiny. When our profiles matched on JOD Matrimony with a compatibility score of 95%, we knew it was meant to be.

He is a civil engineer from Guwahati, and I am a teacher from Indore. On paper, we had little in common. But in reality, we were two halves of the same soul.

Our first conversation on the platform lasted four hours. We talked about our dreams, our families, and our shared love for nature and simplicity.

Meeting in person confirmed what we already knew — we were made for each other. Our families met and instantly connected.

We are planning our wedding for September, and both families are already deeply involved in the preparations.

To everyone on JOD Matrimony — keep faith. Your story is being written too.`,
    status: 'pending',
    reviewedBy: null,
  },
  {
    userId: 17,
    groomName: 'Gaurav Thakur',
    brideName: 'Lakshmi Rao',
    weddingDate: '2026-11-20',
    weddingLocation: 'Shimla, Himachal Pradesh',
    community: 'Thakur',
    storyTitle: 'From the Mountains to the Heart',
    shortDescription: 'A chance connection on JOD Matrimony brought together a government officer and a psychologist in the most beautiful love story.',
    fullStory: `Gaurav is an IAS officer posted in Shimla, and I am a clinical psychologist from Mysore. We connected on JOD Matrimony through a family reference.

Our first conversation was about our shared passion for public service and making a difference in people's lives. I knew then that he was someone special.

The long-distance relationship was challenging but JOD Matrimony made it easy with their messaging features. We talked every day, sharing our experiences and supporting each other.

When we finally met in Shimla, surrounded by the snow-capped mountains, we both knew this was the beginning of something beautiful.

Gaurav proposed at the Mall Road in Shimla, with the mountains as our witness. It was the most romantic moment of my life.

We are grateful to JOD Matrimony for connecting two people who were meant to be together.`,
    status: 'rejected',
    rejectionRemark: 'Please provide more details about how you met and the role JOD Matrimony played in your journey. The story currently focuses more on your professions than the platform experience.',
    reviewedBy: 19,
  },
  {
    userId: 18,
    groomName: 'Nitin Bose',
    brideName: 'Divya Chandran',
    weddingDate: '2027-01-15',
    weddingLocation: 'New Delhi',
    community: 'Bose',
    storyTitle: 'A New Beginning',
    shortDescription: 'After my previous marriage ended, I never thought I would find love again. JOD Matrimony gave me a second chance at happiness.',
    fullStory: `After my divorce, I had given up on finding love again. But my sister convinced me to create a profile on JOD Matrimony, and I am so glad she did.

Divya's profile stood out because of her honesty and warmth. She had been through a similar journey and understood what I was going through.

We connected on the platform and took things slow. There was no pressure, just two people getting to know each other and healing together.

Our first meeting was at a quiet restaurant in Delhi. We talked for five hours without realizing how time flew. For the first time in years, I felt hopeful.

Divya and I are getting married in January 2027, and we are building a life based on trust, understanding, and love.

JOD Matrimony didn't just help me find a life partner — it helped me find myself again. To anyone who has been through difficulties — don't lose hope. Love finds you when you least expect it.`,
    status: 'rejected',
    rejectionRemark: 'The story needs to include more specific details about how JOD Matrimony\'s features helped in the matching process. Please revise and resubmit.',
    reviewedBy: 19,
  },
];

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'matrimony',
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS success_stories (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      user_id           INT NOT NULL,
      groom_name        VARCHAR(150) NOT NULL,
      bride_name        VARCHAR(150) NOT NULL,
      couple_photo      VARCHAR(500),
      wedding_gallery   TEXT,
      wedding_date      DATE,
      wedding_location  VARCHAR(255),
      community         VARCHAR(100),
      story_title       VARCHAR(255) NOT NULL,
      short_description TEXT NOT NULL,
      full_story        TEXT NOT NULL,
      video_url         VARCHAR(500),
      consent           TINYINT(1) DEFAULT 0,
      status            ENUM('pending','approved','rejected') DEFAULT 'pending',
      rejection_remark  TEXT,
      reviewed_by       INT,
      submitted_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      approved_at       TIMESTAMP NULL,
      updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log('✓ Table "success_stories" ready');

  let created = 0;
  let skipped = 0;

  for (const s of stories) {
    try {
      const storyTitle = s.storyTitle;
      const [existing] = await conn.query(
        'SELECT id FROM success_stories WHERE story_title = ?',
        [storyTitle]
      );
      if (existing.length > 0) {
        console.log(`→ Skipped (exists): "${storyTitle}"`);
        skipped++;
        continue;
      }

      const [result] = await conn.query(
        `INSERT INTO success_stories
         (user_id, groom_name, bride_name, wedding_date, wedding_location, community,
          story_title, short_description, full_story, video_url, consent, status, approved_at, reviewed_by, rejection_remark)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)`,
        [
          s.userId,
          s.groomName,
          s.brideName,
          s.weddingDate,
          s.weddingLocation,
          s.community,
          s.storyTitle,
          s.shortDescription,
          s.fullStory,
          s.videoUrl || null,
          s.status,
          s.status === 'approved' ? s.approvedAt : null,
          s.reviewedBy || null,
          s.rejectionRemark || null,
        ]
      );

      console.log(`✓ Created: "${s.storyTitle}" (${s.groomName} & ${s.brideName}) — ${s.status}`);
      created++;
    } catch (err) {
      console.error(`✗ Error creating "${s.storyTitle}": ${err.message}`);
    }
  }

  console.log(`\nDone! ${created} created, ${skipped} skipped.`);
  await conn.end();
}

seed();
