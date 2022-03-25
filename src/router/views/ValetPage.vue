<template lang="pug">
	.valet-page-container
		button.close-icon(@click="close()")
			valet-close-button
		iframe(id="valetIframe" :src="getValetSrc" frameborder="0" width="100%" height="100%")
</template>

<script>
import {
  ValetCloseButton
} from '@svg';

export default {
  components: {
    ValetCloseButton,
  },
  data() {
    return {

    };
  },
  computed: {
    storeCode() {
      return this.$store.state.auth.store.store_code;
    },
    tableCode() {
      return this.$route.params.tableCode;
    },
    tableName() {
      return this.$route.params.tableName;
    },
    getValetSrc() {
      return `https://web.myvaletbiz.com/ak-20180730/pplace/pc.html?storeCode=${this.storeCode}&tableCode=${this.tableCode}&tableName=${this.tableName}`;
    },
  },
  methods: {
    close() {
      this.$router.push({
        name: 'valetTableList',
      });
    },
  },
  mounted() {
    if (!this.tableCode) {
      this.$router.push({
        name: 'valetTableList',
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.valet-page-container {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;

	.close-icon {
		z-index: 101;
		position: fixed;
		right: 1vw;
		top: 1vw;
		background-color: unset;
		border: none;
	}
}

</style>