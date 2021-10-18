<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 42 42" @click="clickEvent">
    <g transform="translate(-954 -193)">
      <rect width="42" height="42" rx="10" transform="translate(954 193)"/>
      <path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="3px" d="M20 0L0 0" transform="translate(965 214)"/>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '2.8125vw'
    },
    height: {
      type: String,
      default: '2.8125vw'
    },
    clickEvent: {
      type: Function,
    }
  }
};
</script>
