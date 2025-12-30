const Chat = require('./models/Chat');

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join a room for personal notifications (using anon_id if available, but socket.id is ephemeral)
        // Client should emit 'join:self' with anon_id
        socket.on('join:self', (anon_id) => {
            socket.join(anon_id);
        });

        // Create Chat Request
        socket.on('chat:request', async (data) => {
            // data: { post_id, from_anon_id, post_owner_anon_id } -- assuming client knows owner or we fetch
            // For MVP, simplistic approach:
            try {
                const { post_id, from_anon_id } = data;

                // Find existing or create new chat? 
                // Blueprint: "Chat Request" -> "Accept Chat"

                // 1. Notify the post owner (we need to know who owns the post)
                // Ideally, fetch post inside here

                // Emitting back for client to handle logic for now or broadcast
                // Real impl: Look up post in DB to find owner, emit to owner's room
            } catch (e) {
                console.error(e);
            }
        });

        // Easier alternative for MVP: Client joins room by chat_id

        // chat:join
        socket.on('chat:join', (chat_id) => {
            socket.join(chat_id);
            console.log(`Socket ${socket.id} joined chat ${chat_id}`);
        });

        // chat:message
        socket.on('chat:message', async (payload) => {
            // payload: { chat_id, content, sender }
            const { chat_id, content, sender } = payload;

            // Save to temporary store if needed, or just relay for ephemeral
            // Blueprint says Chat Message model exists, so save it?
            // "3.4 Chat Message"
            // But purely ephemeral might skip DB for messages if ultra-light. 
            // Blueprint implies DB model exists.

            io.to(chat_id).emit('chat:message', payload);
        });

        // chat:typing
        socket.on('chat:typing', (chat_id) => {
            socket.to(chat_id).emit('chat:typing');
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
