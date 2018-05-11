// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import util from './assets/js/util.js'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import VueResource from 'vue-resource'
import IScrollView from 'vue-iscroll-view'
import IScroll from 'iscroll'

Vue.use(VueResource)
Vue.use(VueVideoPlayer)
Vue.use(util)
Vue.use(IScrollView, IScroll)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {App},
  template: '<App/>'
})
