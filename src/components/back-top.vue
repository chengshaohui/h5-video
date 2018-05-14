<template>
  <div class="scrollTop" ref="btn" v-show="showBackTop" @click="backTop">
    <img class="img" src="../assets/img/scrollTop.png" alt="">
  </div>
</template>

<script>
  export default {
    name: 'back-top',
    props: {
      screenH: {
        type: Number
      },
      $_refs: {
        type: Object
      }
    },
    data() {
      return {
        showBackTop: false,
        container: null,
        scrollTop: 0
      }
    },
    methods: {
      backTop() {
        let goTop = () => {
          let currentPosition = this.scrollTop - (this.scrollTop / 5)
          if (currentPosition > 0) {
            this.container.scrollTop = currentPosition
          } else {
            this.container.scrollTo = 0
            clearInterval(timer)
            timer = null
          }
        }
        let timer = setInterval(goTop, 20)
      }
    },
    mounted() {
      this.container = this.$_refs.container
      this.container.addEventListener('scroll', () => {
        this.scrollTop = this.container.scrollTop
        if (this.scrollTop > (this.screenH / 2)) {
          this.showBackTop = true
        } else {
          this.showBackTop = false
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .scrollTop {
    position: fixed;
    z-index: 100;
    bottom: 6rem;
    right: 1rem;
    font-size: 0;
    .img {
      width: 3.5rem;
      height: 3.5rem;
    }
  }
</style>
