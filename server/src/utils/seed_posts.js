const Post = require('../models/Post');

// Refined seed posts - observational, vulnerable, relatable
// Categories: Work & Burnout, Money & Life Pressure, Relationship (light)
const SEED_POSTS = [
    // Work & Burnout
    {
        content: "Capek bukan karena kerjaannya, tapi karena harus pura-pura baik-baik aja.",
        city: "Jakarta",
        occupation: "Karyawan",
        gender: null
    },
    {
        content: "Ada yang ngerasa makin senior malah makin takut salah?",
        city: "Bandung",
        occupation: "Pimpinan",
        gender: "M"
    },
    {
        content: "Kerja keras tapi kok rasanya jalan di tempat ya.",
        city: "Surabaya",
        occupation: "Karyawan",
        gender: "F"
    },
    {
        content: "Meeting bisa di-email, tapi tetep aja harus meeting.",
        city: "Jakarta",
        occupation: "Karyawan",
        gender: null
    },
    {
        content: "Ngerasa produktif tapi kok nggak ada yang berubah.",
        city: "Yogyakarta",
        occupation: "Freelance",
        gender: "NB"
    },

    // Money & Life Pressure
    {
        content: "Gaji naik dikit tapi tanggung jawab naik banyak.",
        city: "Jakarta",
        occupation: "Karyawan",
        gender: "M"
    },
    {
        content: "Ada yang udah kerja bertahun-tahun tapi masih ngerasa nggak aman?",
        city: "Surabaya",
        occupation: "Karyawan",
        gender: "F"
    },
    {
        content: "Ngomong soal uang tuh selalu bikin nggak enak.",
        city: "Bali",
        occupation: "Freelance",
        gender: null
    },
    {
        content: "Nabung susah, tapi beli kopi tiap hari jalan terus.",
        city: "Bandung",
        occupation: "Mahasiswa",
        gender: "F"
    },
    {
        content: "Takut check saldo akhir bulan.",
        city: "Jakarta",
        occupation: "Karyawan",
        gender: null
    },

    // Life / Relationship (light)
    {
        content: "Kadang pengen cerita, tapi nggak tau ke siapa.",
        city: "Jakarta",
        occupation: null,
        gender: "F"
    },
    {
        content: "Ngerasa sendiri padahal nggak sendirian.",
        city: "Yogyakarta",
        occupation: "Mahasiswa",
        gender: null
    },
    {
        content: "Ada yang lagi capek jadi orang dewasa?",
        city: "Bandung",
        occupation: "Karyawan",
        gender: "M"
    },
    {
        content: "Temen-temen pada sibuk, gue juga sibuk, tapi kok nggak pernah ketemu.",
        city: "Jakarta",
        occupation: "Karyawan",
        gender: null
    },
    {
        content: "Pengen istirahat tapi nggak tau istirahat dari apa.",
        city: "Surabaya",
        occupation: "Karyawan",
        gender: "NB"
    },

    // Additional sample posts
    {
        content: "Weekend tapi masih mikirin kerjaan Senin.",
        city: "Jakarta",
        occupation: "Karyawan",
        gender: null
    },
    {
        content: "Rasanya udah lama nggak ketawa lepas.",
        city: "Bandung",
        occupation: null,
        gender: "F"
    },
    {
        content: "Kadang capek jadi yang paling ngerti di keluarga.",
        city: "Surabaya",
        occupation: "Karyawan",
        gender: "M"
    },
    {
        content: "Pengen resign tapi tanggung kredit motor.",
        city: "Jakarta",
        occupation: "Karyawan",
        gender: null
    },
    {
        content: "Ada yang ngerasa hidup lagi di autopilot?",
        city: "Yogyakarta",
        occupation: "Mahasiswa",
        gender: "NB"
    }
];

async function seedPosts() {
    try {
        const existingCount = await Post.countDocuments({ is_seed: true });

        if (existingCount > 0) {
            console.log(`✓ Seed posts already exist (${existingCount} posts)`);
            return;
        }

        const now = Date.now();

        // Spread timestamps over 30-60min intervals
        const seedData = SEED_POSTS.map((post, idx) => {
            const minutesAgo = Math.floor(Math.random() * 30) + (idx * 30); // 30-60min spread
            const timestamp = now - (minutesAgo * 60 * 1000);

            return {
                ...post,
                anon_id: 'SYSTEM_BOT',
                is_seed: true,
                likes: Math.floor(Math.random() * 13) + 3, // 3-15 likes
                created_at: new Date(timestamp),
                expires_at: new Date(now + 48 * 60 * 60 * 1000), // 48h from now
                status: 'active',
                institution: null // No institution for seeds
            };
        });

        await Post.insertMany(seedData);
        console.log(`✓ Seeded ${seedData.length} posts successfully`);
    } catch (error) {
        console.error('✗ Error seeding posts:', error);
    }
}

module.exports = seedPosts;
