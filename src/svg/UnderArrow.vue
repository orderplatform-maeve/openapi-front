<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1.09375vw" height="0.6321875vw" viewBox="0 0 14 8.092">
    <path data-name="under-arrow-sum 1" d="m-2784 0 5.922 6.092zm12 0-6 6.03z" transform="translate(2785 1)" style="fill:transparent;stroke:#999;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px" :class="{strokeColor: black}"/>
  </svg>
</template>

<script>
export default {
  props: {
    black: {
      type: Boolean,
      default: false,
    }
  }
};
</script>

<style scoped>
.strokeColor {
  stroke: #000 !important;
}

</style>