<template>
  <div class="tips" v-show="showAlertDiv" @click="showAlertDiv = false">
    <i class="icon-tip"></i>
    <span>此为临时链接，仅用于页面预览</span>
    <i class="icon-close"></i>
  </div>
</template>

<script>
  export default {
    name: 'temp-tips',
    data() {
      return {
        showAlertDiv: false
      }
    }
  }
</script>

<style scoped lang="scss">
  .tips {
    position: fixed;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 4rem;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 1.4rem;
    background-color: #D8DEEC;
    color: #333;
    .icon-tip {
      width: 4rem;
      height: 100%;
      background: url("../assets/img/alert-tip.png") no-repeat center;
    }
    .icon-close {
      width: 4rem;
      height: 100%;
      background: url("../assets/img/alert-close.png") no-repeat center;
    }
  }
</style>
