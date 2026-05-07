const jwt = require('jsonwebtoken');

module.exports = async (req, reply) => {
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return reply.code(401).send({ error: 'no_token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return reply.code(403).send({ error: 'forbidden' });
        req.admin = decoded;
    } catch {
        return reply.code(401).send({ error: 'invalid_jwt' });
    }
};
