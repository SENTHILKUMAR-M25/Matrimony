const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const sections = [
  {
    section_key: 'hero',
    content: {
      heading: 'Find Your Perfect Life Partner',
      subtitle: 'Join thousands of verified members and start your journey towards a happy marriage.',
      buttonText: 'Register Free',
      buttonLink: '/signup',
    },
  },
  {
    section_key: 'promises',
    content: [
      {
        icon: 'Heart',
        title: 'Best Matches',
        desc: 'Smart matchmaking based on your preferences and compatibility.',
      },
      {
        icon: 'Users',
        title: 'Max Responses',
        desc: 'Connect with genuine profiles and increase response rates.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Fully Secured',
        desc: 'Privacy protection and verified profiles for safe matchmaking.',
      },
    ],
  },
  {
    section_key: 'membership',
    content: {
      plans: [
        {
          name: 'Free',
          price: '₹0',
          duration: 'Forever',
          description: 'Get started and explore basic features at no cost.',
          features: [
            { text: 'Create Your Profile', included: true },
            { text: 'Search & Browse Profiles', included: true },
            { text: 'View Contact Details', included: false },
            { text: 'Unlimited Interests', included: false },
            { text: 'Priority Listing', included: false },
            { text: 'Profile Boost', included: false },
          ],
          buttonText: 'Get Started Free',
          highlight: false,
          popular: false,
        },
        {
          name: 'Premium',
          price: '₹499',
          duration: '/month',
          description: 'Unlock full access and find your perfect match faster.',
          features: [
            { text: 'Create Your Profile', included: true },
            { text: 'Search & Browse Profiles', included: true },
            { text: 'View Contact Details', included: true },
            { text: 'Unlimited Interests', included: true },
            { text: 'Priority Listing', included: true },
            { text: 'Profile Boost', included: true },
          ],
          buttonText: 'Upgrade to Premium',
          highlight: true,
          popular: true,
        },
      ],
    },
  },
  {
    section_key: 'cta',
    content: {
      heading: 'Your Perfect Match Is Waiting',
      buttonText: 'Register Free Today',
      buttonLink: '/signup',
    },
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
    CREATE TABLE IF NOT EXISTS landing_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_key VARCHAR(100) NOT NULL UNIQUE,
      content JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ Table "landing_content" ready');

  let created = 0;
  for (const s of sections) {
    await conn.query(
      'INSERT INTO landing_content (section_key, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
      [s.section_key, JSON.stringify(s.content)]
    );
    console.log(`✓ "${s.section_key}" seeded`);
    created++;
  }

  console.log(`\nDone! ${created} sections seeded.`);
  await conn.end();
}

seed();
