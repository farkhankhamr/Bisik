require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const path = require('path');
const connectDB = require('./db');

// CORS — whitelist production + local dev
fastify.register(require('@fastify/cors'), {
    origin: (origin, cb) => {
        const allowed = [
            'https://gogon.space',
            'https://www.gogon.space',
        ];
        if (process.env.NODE_ENV !== 'production') {
            allowed.push('http://localhost:5173', 'http://localhost:3000');
        }
        // Allow same-origin requests (no origin header) and curl
        if (!origin) return cb(null, true);
        if (allowed.includes(origin)) return cb(null, true);
        return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Rate limiting — global off, applied per-route
fastify.register(require('@fastify/rate-limit'), {
    global: false,
    keyGenerator: (req) => {
        const anonId = req.headers['x-anon-id'] || req.body?.anon_id || '';
        return `${req.ip}:${anonId}`;
    },
    errorResponseBuilder: () => ({
        error: 'rate_limited',
        message: 'Pelan-pelan dulu ya 🤫'
    })
});

fastify.register(require('fastify-socket.io'), {
    cors: {
        origin: process.env.NODE_ENV !== 'production'
            ? ['http://localhost:5173', 'https://gogon.space', 'https://www.gogon.space']
            : ['https://gogon.space', 'https://www.gogon.space'],
    }
});

// Serve static files (Frontend)
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/',
});

// Database
connectDB();

// Routes
// 1. Root level for backward compatibility
fastify.register(require('./routes/posts'));
fastify.register(require('./routes/comments'));
fastify.register(require('./routes/intel'));
fastify.register(require('./routes/reports'));
fastify.register(require('./routes/config'));

// 2. /api prefix
fastify.register(require('./routes/posts'), { prefix: '/api' });
fastify.register(require('./routes/comments'), { prefix: '/api' });
fastify.register(require('./routes/intel'), { prefix: '/api' });
fastify.register(require('./routes/reports'), { prefix: '/api' });
fastify.register(require('./routes/admin'), { prefix: '/api' });
fastify.register(require('./routes/config'), { prefix: '/api' });

// SPA Fallback
fastify.setNotFoundHandler((request, reply) => {
    if (request.raw.url.startsWith('/api')) {
        reply.code(404).send({ error: 'API route not found' });
    } else {
        reply.sendFile('index.html');
    }
});

// Socket.IO Logic
fastify.ready(err => {
    if (err) throw err;
    require('./socket')(fastify.io);
});

const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
        console.log(`Server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
