<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1.40625vw" height="1.1484375vw" viewBox="0 0 20.827 16.749">
    <defs>
    </defs>
    <g id="refresh-icon-group_490" data-name="refresh-icon-group 490" transform="translate(-51.586 -666.114)">
      <path id="refresh-icon-path_7" data-name="refresh-icon-path 7" class="refresh-icon-cls-1" d="M21.909 4v4.909H17" transform="translate(49.091 663.955)"/>
      <path id="refresh-icon-path_8" data-name="refresh-icon-path 8" class="refresh-icon-cls-1" d="M1 18.909V14h4.909" transform="translate(52 662.137)"/>
      <path id="refresh-icon-path_9" data-name="refresh-icon-path 9" class="refresh-icon-cls-1" d="M3.054 7.909A7.364 7.364 0 0 1 15.2 5.16L19 8.727M1 12l3.8 3.567a7.364 7.364 0 0 0 12.15-2.749" transform="translate(52 664.137)"/>
    </g>
  </svg>
</template>
<script>
export default {
  name:"RefreshIcon",
  props: {
    width: {
      type: String,
      default: '1.40625vw',
    },
    height: {
      type: String,
      default: '1.1484375vw'
    }
  }
};
</script>

<style scoped>
.refresh-icon-cls-1 {
  fill:none;
  stroke:#fff;
  stroke-linecap:round;
  stroke-linejoin:round;
  stroke-width:2px
}
</style>