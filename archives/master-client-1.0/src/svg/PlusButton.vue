<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 42 42" @click="clickEvent">
    <defs>
      <svg:style>
        .cls-1-plus-v2{fill:none;stroke:#fff;stroke-linecap:round;stroke-width:3px}
      </svg:style>
    </defs>
    <g id="그룹_2381" transform="translate(-954 -193)">
      <rect id="사각형_662" width="42" height="42" rx="10" transform="translate(954 193)"/>
      <path id="선_46" d="M0 0L0 20" class="cls-1-plus-v2" transform="translate(975 204)"/>
      <path id="선_47" d="M20 0L0 0" class="cls-1-plus-v2" transform="translate(965 214)"/>
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
