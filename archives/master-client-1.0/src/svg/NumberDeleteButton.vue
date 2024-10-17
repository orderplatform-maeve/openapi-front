<template functional>
  <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 51.369 34.913">
    <defs>
    </defs>
    <g id="numberDeleteButton_bt" transform="translate(1 1)">
      <path id="numberDeleteButton_Path_184" data-name="numberDeleteButton_Path 184" class="numberDeleteButton_cls-1" d="M47.4 9.155v23.6a4.653 4.653 0 0 1-4.65 4.657h-.007l-28.256.016L-1.969 20.97 14.487 4.514h28.272A4.653 4.653 0 0 1 47.4 9.155z" transform="translate(1.969 -4.514)"/>
      <path id="numberDeleteButton_Union_2" data-name="numberDeleteButton_Union 2" class="numberDeleteButton_cls-1" d="M7.1 7.1 0 14.192 7.1 7.1 0 0l7.1 7.1L14.2 0 7.1 7.1l7.1 7.1z" transform="translate(22.705 9.224)"/>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '2vw',
    },
    height: {
      type: String,
      default: '1.36vw',
    }
  }
};
</script>

<style scoped>
  .numberDeleteButton_cls-1{
    fill:none;
    stroke:#000;
    stroke-linecap:round;
    stroke-linejoin:round;
    stroke-width:2px
  }
</style>