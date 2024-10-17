<template lang="pug">
.flash-message(v-bind:class="{cart: isCart}")
  transition-group(name="showFlashMessage")
    .message-ani(v-for='message in messages' v-bind:key='message.key')
      .message(v-html="message.message")
</template>

<script>
export default {
  data() {
    return {
      interval: undefined,
      show: false,
      isCart: false,
    };
  },
  computed: {
    messages() {
      return this.$store.state.flashMessages.slice(0).sort(function(a,b) {
        return b.key - a.key;
      });
    },
  },
  watch: {
    '$route' (to) {
      if (to.path == '/cart') {
        this.isCart = true;
      } else {
        this.isCart = false;
      }
    },
    messages() {
    },
  },
  mounted() {
    window.torderOpenFlashMessage = this.open;
  },
  methods: {
    open(message) {
      this.$store.commit('pushFlashMessage', message);
    },
    close() {
    },
  },
};
</script>

<style lang="scss">
@keyframes showFlashMessage {
  0% {
    opacity:0;
    transform: scale( 2.0 );
  }
  20% {
    opacity:0.9;
    transform: scale( 1.0 );
  }
  80% {
    opacity:0.9;
    transform: scale( 1.0 );
  }
  100% {
    opacity:0;
    transform: scale( 1.0 );
  }
}

.showFlashMessage-enter-active{
  animation: showFlashMessage 3s;
}

.flash-message {
  z-index:9999;
  position:fixed;
  top:140px;
  flex-direction:column;
  display:flex;
  align-items: center;
  justify-content: flex-start;
  pointer-events : none;
  left:0;
  right:0;
  bottom:0px;

  .message-ani {
    opacity:0;
    display:flex;
    justify-content: center;
    align-items: center;

    .message {
      white-space: nowrap;
      display:flex;
      align-items: center;
      justify-content: center;
      border-radius: 100vh;
      flex-shrink:0;
      padding: 0.9375vw 2.5vw !important;
      background-color:#ff0000;
      color:#ffffff;
      box-shadow: 0 0 1.25vw -0.3125vw #000000;
      font-size: 2.1875vw;
      font-weight:900;
      white-space: normal;
      text-align:center;
      line-height:1.2em;
      animation: slidein-flash-message 3s;
      box-sizing: border-box;
      max-width: 62.5vw;
    }
  }

}
.flash-message.cart {
  right:50%;
  align-items: flex-end;

  .message-ani {
    justify-content: flex-end;
  }
}

</style>
