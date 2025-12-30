// Mock ad configuration for MVP
// In production, this would fetch from an ad network API

const MOCK_ADS = [
    {
        id: 'ad_001',
        type: 'feed_inline',
        title: 'Cari Kerja Remote?',
        description: 'Platform terpercaya untuk freelancer Indonesia',
        cta: 'Lihat Peluang',
        url: 'https://example.com/jobs',
        image_url: null
    },
    {
        id: 'ad_002',
        type: 'feed_inline',
        title: 'Belajar Coding Gratis',
        description: 'Kursus online dari dasar sampai mahir',
        cta: 'Mulai Belajar',
        url: 'https://example.com/courses',
        image_url: null
    },
    {
        id: 'ad_003',
        type: 'feed_inline',
        title: 'Konsultasi Psikolog Online',
        description: 'Curhat aman & rahasia dengan profesional',
        cta: 'Chat Sekarang',
        url: 'https://example.com/therapy',
        image_url: null
    },
    {
        id: 'ad_004',
        type: 'feed_inline',
        title: 'Investasi Mulai 10rb',
        description: 'Reksadana & saham untuk pemula',
        cta: 'Pelajari Lebih Lanjut',
        url: 'https://example.com/invest',
        image_url: null
    }
];

// Placement rules
const AD_PLACEMENT_RULES = {
    feed_inline: {
        frequency: 7, // Every 7 posts
        max_per_session: 10
    }
};

// Get random ad
function getRandomAd(type = 'feed_inline') {
    const ads = MOCK_ADS.filter(ad => ad.type === type);
    return ads[Math.floor(Math.random() * ads.length)];
}

module.exports = {
    MOCK_ADS,
    AD_PLACEMENT_RULES,
    getRandomAd
};
