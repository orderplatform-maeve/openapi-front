<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 14.125 14.783">
    <path d="M11.932 5.855 7.187 10.6a1.549 1.549 0 0 0 2.19 2.19l4.745-4.745a3.1 3.1 0 1 0-4.38-4.38L5 8.41a4.646 4.646 0 0 0 6.57 6.57l4.745-4.745" transform="translate(-3.036 -2.157)" style="fill:none;stroke:#666;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.2px"/>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '1.3828125vw'
    },
    height: {
      type: String,
      default: '1.484375vw',
    }
  }
};
</script>