require("dotenv").config();
const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // frontend ke liye allow
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});


// ================= USERS =================
let users = [];

const addUser = (userId, socketId) => {
  const idx = users.findIndex((user) => user.userId === userId);
  if (idx !== -1) {
    users[idx].socketId = socketId;
  } else {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};


// ================= MESSAGES =================
const messages = {}; // global store

const createMessage = ({ senderId, reciverId, text, images }) => ({
  id: Date.now(), // unique id
  senderId,
  reciverId,
  text,
  images,
  seen: false,
});


// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // ADD USER
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // SEND MESSAGE
  socket.on("sendMessage", ({ senderId, reciverId, text, images }) => {
    const message = createMessage({ senderId, reciverId, text, images });
    const user = getUser(reciverId);

    // store message
    if (!messages[reciverId]) {
      messages[reciverId] = [message];
    } else {
      messages[reciverId].push(message);
    }

    // send to receiver
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  // MESSAGE SEEN
  socket.on("messageSeen", ({ senderId, reciverId, messageId }) => {
    const sender = getUser(senderId);

    if (messages[reciverId]) {
      const message = messages[reciverId].find(
        (msg) => msg.id === messageId
      );

      if (message) {
        message.seen = true;

        // notify sender
        if (sender) {
          io.to(sender.socketId).emit("messageSeen", {
            senderId,
            reciverId,
            messageId,
          });
        }
      }
    }
  });

  // UPDATE LAST MESSAGE
  socket.on("updateLastMessage", ({ lastMessage, LastMessageId }) => {
    io.emit("getLastMessage", {
      lastMessage,
      LastMessageId,
    });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});


// ================= SERVER =================
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});