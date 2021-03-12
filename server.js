const mongoose = require("mongoose");
const app = require("express")();
const http = require("http").Server(app);
const cors = require("cors");
const { stringify } = require("querystring");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});
let users = [];
let messages = [];
app.use(cors());
mongoose.connect("mongodb://localhost:27017/chatapp");
const Schema = mongoose.Schema;
const ChatSchema = mongoose.Schema({
  //username: String,
  msg: String,
  date: {
    type: Date,
    default: Date.now}
});
const UserSchema = mongoose.Schema({
  username: { type: String, lowercase: true, unique: true },
  chatName: String,

});

const UserModel = mongoose.model("user", UserSchema);
module.exports = mongoose.model("user", UserSchema);
const ChatModel = mongoose.model("chat", ChatSchema);

ChatModel.find((err, result) => {
  if (err) throw err;
  messages = result;
});

UserModel.find((err, result) => {
  if (err) throw err;
  username = result;
});

io.on("connection", (socket) => {
  console.log("connection established");
  socket.emit("loggedIn", {
    users: users.map((s) => s.username),
    messages: messages,
  });
  socket.on("newuser", (username) => {
    console.log(`${username} has arrived the party.`);
    socket.username = username;
    users.push(socket);
    io.emit("userOnline", socket.username);
  });
  socket.on("msg", (msg) => {
    let message = new ChatModel({
      username: socket.username,
      msg: msg,
    });
   
  
    message.save((err, result) => {
      messages.push(result);
      io.emit("msg", result);
    });
  });
  socket.on("disconnect", () => {
    console.log(`${socket.username}has left the party`);
    io.emit("userLeft", socket.username);
    users.splice(users.indexOf(socket), 1);
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port %s", process.env.PORT || 3000);
});
