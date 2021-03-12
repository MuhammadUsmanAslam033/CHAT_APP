<template>
  <div id="app">
    <div class="header">
      <h1>Chat-App</h1>
      <p class="username">Username: {{ username }}</p>
      <p class="online">Online: {{ users.length }}</p>
    </div>
    <ChatRoom v-bind:messages="messages" v-on:sendMessage="sendMessage" />
  </div>
</template>
<script>
import io from "socket.io-client";
import ChatRoom from "./components/ChatRoom";
export default {
  name: "app",
  components: {
    ChatRoom,
  },
  data: function() {
    return {
      username: "",
      socket: "",
      conn: "",
      messages: [],
      users: [],
    };
  },
  methods: {
    joinServer: function() {
      this.socket = io("http://localhost:3000");
      console.log("io", io);
      console.log("conn", this.conn);
      console.log("socket", this.socket);
      this.socket.on("loggedIn", (data) => {
        this.messages = data.messages;
        this.users = data.users;
        this.socket.emit("newuser", this.username);
      });
      this.listen();
    },
    listen: function() {
      console.log("now listening");
      this.socket.on("userOnline", (user) => {
        this.users.push(user);
      });
      this.socket.on("userLeft", (user) => {
        this.users.splice(this.users.indexOf(user), 1);
      });
      this.socket.on("msg", (message) => {
        console.log('received event "msg', message);
        this.messages.push(message);
      });
    },
    sendMessage: function(message) {
      console.log("sending msg via socket");
      try {
        this.socket.emit("msg", message);
      } catch (err) {
        console.log("got error emitting", err);
      }
    },
  },
  mounted: function() {
    this.username = prompt("What is your Username?", "Anonymous");

    if (!this.username) {
      this.username = "Anonymous";
    }
    this.joinServer();
  },
};
</script>
<style lang="scss">
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
}
</style>
