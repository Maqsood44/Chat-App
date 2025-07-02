export const users = {}; // Stores userId -> socket.id
export const initialSocketEvent = (io) => {

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // 🔐 Register user
    socket.on("register", (userId) => {
      if (!userId) {
        console.warn("❗ No userId provided for registration");
        return;
      }

      users[userId] = socket.id;
      console.log(`🆔 User registered: ${userId} -> ${socket.id}`);
    });

    // 💬 Chatroom message
    socket.on("chat-message", (message) => {
      console.log("📨 Chat message received:", message);
      socket.broadcast.emit("chat-message", message);
    });

    // 🔐 Private message
    socket.on("private-message", ({ toUserId, message }) => {
      if (!toUserId || !message) {
        console.warn("❗ Missing toUserId or message in private-message");
        return;
      }

      const receiverSocketId = users[toUserId];

      if (receiverSocketId) {
        console.log(`📩 Sending private message from ${socket.id} to ${receiverSocketId}`);
        io.to(receiverSocketId).emit("private-message", {
          from: socket.id,
          message,
        },
      );

        // Optional: notify sender for confirmation
        socket.emit("private-message", {
          from: "me",
          message,
        });
      } else {
        console.warn(`⚠️ Receiver ${toUserId} not connected.`);
        socket.emit("error", `User ${toUserId} is not online.`);
      }
    });

    // 🔌 Disconnect
    socket.on("disconnect", () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          delete users[userId];
          break;
        }
      }

      console.log(`❌ Socket disconnected: ${socket.id}`);
      if (disconnectedUserId) {
        console.log(`🗑️ User unregistered: ${disconnectedUserId}`);
      }
    });
  });
};


