<template lang="pug">
  router-view
</template>

<script>
export default {
  mounted() {
    console.log('app mounted');

    window.addEventListener('message', (event) => {
      try {
        const msg = event?.data;
        const methodName = msg?.methodName;

        if (methodName === 'callBackPayment') {
          console.log(event);
          if (msg?.result) {
            const vanData = JSON.parse(msg.result);

            if (vanData?.responseCode === "0000") {
              // 결제 취소 페이지 고고링
              console.log('결제 취소 완료', vanData);
            }
          }
        }

      } catch (error) {
        // console.log(error);
      }
    });
  },
};
</script>
