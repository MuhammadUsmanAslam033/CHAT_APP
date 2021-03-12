<template>
  <div class="chat-window">
    <div class="messages">
      <div
        class="message"
        v-for="message in messages"
        v-bind:key="message.index"
      >
        <div class="username">{{ message.username }}</div>
        <div class="message-text">{{ message.msg }}</div>
      </div>
    </div>
    <input type="text" v-model="msg" />
    <button v-on:click="sendMessage" v-bind:disabled="!msg">Send</button>
  </div>
</template>
<script>
export default {
  name: "Chat room",
  props: ["messages"],
  data: function() {
    return {
      msg: "",
    };
  },
  methods: {
    sendMessage: function() {
      if (!this.msg) {
        alert("please enter a message");
        return;
      }
      this.$emit("sendMessage", this.msg);
      this.msg = "";
    },
  },
  mounted() {
    console.log("this.$emit", this.$emit);
  },
};
</script>
<style lang="scss" scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  box-shadow: 1px 1px 6px 0px rbga(0, 0, 0, 0.15);
}
.messages {
  flex: 1;
  overflow: scroll;
  .message {
    display: flex;
    border-bottom: 1px solid;
    padding: 10px;
    &:last-of-tupe {
      border-bottom: none;
    }
    .username {
      width: 100px;
      margin-right: 15px;
    }
    .message-text {
      flex: 1;
    }
  }
  .input-container {
    display: flex;
  }
  forminput {
    flex: 1;
    height: 35px;
    font-size: 18px;
    box-sizing: border-box;
  }
  button {
    width: 75px;
    height: 35px;
    box-sizing: border-box;
  }
}
</style>
