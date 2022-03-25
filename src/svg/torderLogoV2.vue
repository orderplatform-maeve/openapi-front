<template functional>
  <svg xmlns="http://www.w3.org/2000/svg" :width="props.width" :height="props.height" viewBox="0 0 80.88 37.368">
    <defs>
      <svg:style>
        .cls-2-newtorder-v2{fill:#fff}
      </svg:style>
    </defs>
    <g id="torder_logo_20" transform="translate(-897 -972)">
      <path id="패스_23" :fill="props.fillColor" d="M929.717 988.359a16.359 16.359 0 1 0-17.853 16.29v3.805a.913.913 0 0 0 1.167.878 27.156 27.156 0 0 0 8.251-4.391 20.609 20.609 0 0 0 7.9-12.409 16.391 16.391 0 0 0 .535-4.173z"/>
      <g id="torder_logo_17" transform="translate(903.754 976.537)">
        <path id="패스_24" d="M935.868 1008.79a3.142 3.142 0 0 1-3.139-3.138v-11.179c0-.052 0-.1-.007-.153a6.09 6.09 0 0 0 .059-.842v-2.125a1.989 1.989 0 0 0-3.978 0v2.125a2.078 2.078 0 0 1-2.076 2.076h-1.894a1.989 1.989 0 1 0 0 3.978h1.894a6.031 6.031 0 0 0 2.024-.348v6.468a7.124 7.124 0 0 0 7.116 7.116 1.989 1.989 0 1 0 0-3.978z" :fill="props.fillColorSecond" transform="translate(-922.845 -989.364)"/>
        <circle id="타원_2" cx="1.989" cy="1.989" r="1.989" :fill="props.fillColorSecond" transform="translate(11.24 6.19)"/>
      </g>
      <g id="torder_logo_19" transform="translate(937.038 979.086)">
        <g id="torder_logo_18">
          <path id="패스_25" d="M1132.906 1003.986a1.949 1.949 0 0 0 0-3.9h-9.192a1.949 1.949 0 0 0-1.949 1.949v10.3a1.949 1.949 0 0 0 1.949 1.949h9.192a1.949 1.949 0 0 0 0-3.9h-7.243v-6.4z" class="cls-2-newtorder-v2" transform="translate(-1103.069 -999.834)"/>
          <path id="패스_26" d="M1064.836 1017.788h-4.961v-3.635a7.65 7.65 0 1 0-3.9.031v5.553a1.949 1.949 0 0 0 1.949 1.949h6.91a1.949 1.949 0 1 0 0-3.9zm-10.72-11.019a3.754 3.754 0 1 1 3.755 3.754 3.759 3.759 0 0 1-3.755-3.753z" class="cls-2-newtorder-v2" transform="translate(-1050.218 -999.117)"/>
          <path id="패스_27" d="M1177.268 1020.346h-5.759a1.949 1.949 0 0 0 0 3.9h3.81v5.227a1.949 1.949 0 0 0 3.9 0v-7.173a1.949 1.949 0 0 0-1.951-1.954z" class="cls-2-newtorder-v2" transform="translate(-1138.375 -1014.799)"/>
        </g>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    fillColor: {
      type: String,
      default: '#fc0000',
    },
    fillColorSecond: {
      type: String,
      default: '#fff',
    },
    width: {
      type : String,
      default: '6.3187vw'
    },
    height: {
      type: String,
      default: '2.9194vw'
    }
  }
};
</script>
