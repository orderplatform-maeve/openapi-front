<template lang="pug">
</template>
<script>
export default {
  created() {
    this.$eventBus.$emit('logout');
  },
}
</script>
<style lang="scss">
</style>
