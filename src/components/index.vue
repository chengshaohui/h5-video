<template>
  <div class="container" ref="container">
    <!--弹出临时链接-->
    <temp-tips/>
    <!--<iscroll-view class="scroll-view" ref="wrapper">-->
    <!--播放器-->
    <v-video @canPlay="getVideoH"/>
    <!--菜单内容-->
    <div class="menu">
      <div class="menu-header">互动聊天</div>
      <div class="menu-content" ref="menuWrapper">
        <div class="menu-content-empty" v-if="commentList.length === 0">
          交流是一种信仰，态度就在你身上
        </div>
        <ul class="commentList">
          <li class="comment" v-for="(item, index) in commentList" :key="index">
            <div class="left-img">
              <img width="40" height="40" :src="item.comment.userLogo" alt="">
            </div>
            <div class="right-content">
              <div class="comment-name">{{item.comment.userName}}</div>
              <div class="comment-content">{{item.comment.msg}}</div>
              <div class="comment-time">
                <span class="time">{{item.comment.createTime | time}}</span>
                <span class="reply" @touchstart="clickReply(item.comment.userName, item.comment.id)"
                      @click="clickReply(item.comment.userName, item.comment.id)">
                    <img class="reply-img" src="../../static/img/chat-toReplay-gray.png" alt="">
                  </span>
              </div>
              <ul class="secondary-comment-list" v-if="item.replies.length">
                <li class="secondary-comment" v-for="val in item.replies" :key="val.id">
                  <span class="userName">{{val.userName}}：</span><!--
                 --><span>{{val.msg}}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--</iscroll-view>-->
    <!--底部发送评论框-->
    <div class="option">
      <div class="opt-input">
        <input type="text" class="commentVal" ref="bottomInput" :placeholder="bottomPlaceholder" v-model="commentVal"
               v-isFocus="isFocus"
               @click="bottomButton = '发送'"
               @focus="inputFocus()"
               @blur.prevent.stop="inputBlur"/>
      </div>
      <div class="opt-Btn">
        <div v-if="isFocus" class="commentSubmit" @click="sendComment(bottomButton)">{{bottomButton}}</div>
        <template v-else>
          <div class="icon-submit zan" v-show="true" @touchstart="isZanTouch=true" @touchend="isZanTouch=false"
               @click="like">
            <img class="zan-img" width="30" height="30" src="../../static/img/window/zan-icon.png"/>
            <span class="praiseNum">{{$_numberTrans(likeNum)}}</span>
          </div>
        </template>
      </div>
      <div class="mask" v-if="isFocus"></div>
    </div>
  </div>
</template>

<script>
  import vVideo from './v-video'
  import tempTips from './temp-tips'
  // import IScroll from 'iscroll'

  const sendBtn = '发送'
  const commentBtn = '回复'
  const bPlaceholder = '一起来互动吧'
  let newTime = new Date()
  export default {
    components: {vVideo, tempTips},
    name: 'index',
    data() {
      return {
        isZanTouch: false,
        isFocus: false,
        noLogin: true,
        isLive: false,
        prepareUrl: null,
        scroll: null,
        demoId: 1,
        likeNum: 0,
        firstCash: 0,
        countDownSec: 0,
        vodUrl: '',
        commentVal: '',
        bottomPlaceholder: bPlaceholder,
        bottomButton: sendBtn,
        commentList: [],
        memberLives: [],
        praiseObj: {
          count: 0, // 数字
          img: 7, // 图片
          number: 0, // 页面上点赞数
          autoCount: 0 // 自动点赞次数
        },
        windowDetail: {
          voteId: 0,
          publish: 0,
          guideImg: '',
          doCountDown: 0,
          countDownTitle: null,
          menuList: ['互动聊天']
        },
        activity: {
          id: null,
          screenshot: null,
          urlGroup: {
            hlsUrl: null
          }
        },
        vodPublishInfo: {
          videoId: null,
          capture: null
        },
        commentObj: {
          name: null,
          id: 0
        }
      }
    },
    computed: {
      dataId() {
        if (this.activity) {
          return this.activity.id
        } else {
          return this.vodPublishInfo.videoId
        }
      },
      capture() {
        let capture = null
        if (this.windowDetail.capture && this.windowDetail.capture !== '') {
          capture = this.windowDetail.capture
        } else if (this.activity) {
          if (this.activity.capture && this.activity.capture !== '') {
            capture = this.activity.capture || ''
          } else if (this.countDownSec && this.countDownSec > 0) {
            capture = ''
          } else {
            capture = this.activity.screenshot || ''
          }
        } else {
          capture = this.vodPublishInfo.capture || ''
        }
        return capture
      },
      hasComment() {
        let flag = false
        this.windowDetail.menuList.forEach(item => {
          // todo
          if (item === 1) {
            flag = true
          }
        })
        return flag
      }
    },
    methods: {
      // 点赞
      like() {
        this.likeNum++
      },
      // 发送评论
      sendComment(bottomButton) {
        if (bottomButton === sendBtn) {
          // todo ajax
          this.commentList.unshift({
            comment: {
              id: this.demoId,
              userName: '少辉',
              userLogo: 'http://thirdwx.qlogo.cn/mmopen/vi_32/zMzW71vYSqwFoYo0liaCNpa9aPedCRBlvYrmeCp4BJfrRMIwo87BCTNoegRItic7d4ybdBqL5hEflzwad6GfES8A/132',
              msg: this.commentVal,
              createTime: newTime.getTime()
            },
            replies: []
          })
          this.demoId++
          this.commentVal = ''
        } else if (bottomButton === commentBtn) {
          // todo ajax
          this.commentList.forEach(item => {
            if (item.comment.id === this.commentObj.id) {
              item.replies.push({
                id: this.demoId,
                userName: '程少辉',
                msg: this.commentVal
              })
            }
          })
          this.demoId++
          this.commentVal = ''
        }
      },
      // 点击回复评论
      clickReply(name, id) {
        this.commentObj.name = name
        this.commentObj.id = id
        this.bottomPlaceholder = commentBtn + name + ':'
        this.isFocus = true
        this.bottomButton = commentBtn
      },
      // 底部框失去焦点
      inputBlur() {
        this.isFocus = false
        this.bottomPlaceholder = bPlaceholder
      },
      inputFocus() {
        this.isFocus = true
      },
      // 计算菜单部分的高度
      getVideoH(videoH) {
        // let clientH = document.body.clientHeight
        // 有兼容性问题
        // this.$refs.menuWrapper.style.height = clientH - videoH + 'px'
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      getCommentData() {
        this.$http.get('/api/value').then(res => {
          res = res.body
          this.commentList = res.data.chatList
        })
      }
    },
    mounted() {
      this.timer = setTimeout(() => {
        // this.scroll = new IScroll(this.$refs.wrapper.$el, {
        //   click: true,
        //   // 是否监听Scroll ，如果true， 则iscroll 使用probeType: 3 来进行初始化；
        //   probeType: 3,
        //   preventDefault: true,
        //   HWCompositing: true,
        //   disablePointer: true,
        //   bounce: true,
        //   elastic: true
        // })
      }, 20)
      // let bottomInput = this.$refs.bottomInput
    },
    watch: {
      data(value) {
        // 必须使用setTimeout 由于refresh 也是异步的
        this.timer = setTimeout(() => {
          this.scroll && this.scroll.refresh()
        }, 20)
      },
      refreshTrigger() {
        this.refresh()
      }
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    created() {
      this.getCommentData()
    }
  }
</script>

<style scoped lang="scss">
  .container {
    &:after {
      content: '';
      display: flex;
      width: 100%;
      height: 4.8rem;
    }
  }

  .scroll-view {
    /* -- Attention: This line is extremely important in chrome 55+! -- */
    touch-action: none;
    height: 100%;
  }

  .menu {
    .menu-header {
      width: 100%;
      height: 35px;
      line-height: 35px;
      border-bottom: 2px solid #ff6222;
      text-align: center;
      font-size: 1.6rem;
      color: #ff6222;
      margin-bottom: 1.4rem;
    }
    .menu-content {
      text-align: center;
      overflow: scroll;
      .menu-content-empty {
        margin-top: 40px;
        color: #666;
      }
    }
    .commentList {
      box-sizing: border-box;
      .comment {
        display: flex;
        margin: 6px;
        font-size: 0;
        .left-img {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          border-radius: 50%;
          margin: 0 5px;
          overflow: hidden;
        }
        .right-content {
          flex: auto;
          padding: 0 6px 10px;
          border-bottom: 1px solid #e6e6e6;
          text-align: left;
          font-size: 1.4rem;
          color: #595959;
          .comment-name {
            color: #a0a0a0;
          }
          .comment-content {
            margin: 6px 0;
          }
          .comment-time {
            display: flex;
            justify-content: space-between;
            font-size: 1.2rem;
            color: #bababa;
            .reply {
              margin-right: 10px;
              .reply-img {
                display: inline-block;
                width: 1.8rem;
                height: 1.8rem;
              }
            }
          }
          .secondary-comment-list {
            background-color: #eee;
            padding: 5px;
            .userName {
              color: #576faa;
            }
          }
        }
      }
    }
  }

  /*评论框 点赞*/
  .option {
    position: fixed;
    z-index: 1000;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 4.8rem;
    color: #666;
    background-color: #f6f6f6;
    .opt-input {
      flex: auto;
      padding: 2%;
      .commentVal {
        width: 100%;
        height: 3rem;
        border: none;
        border-radius: 4px;
        text-indent: 10px;
        font-size: 1.4rem;
      }
    }
    .opt-Btn {
      margin-right: 6px;
      flex: 0 0 4.8rem;
      width: 4.8rem;
      text-align: center;
      color: #fff;
      .commentSubmit {
        height: 3rem;
        line-height: 3rem;
        padding: 0 5px;
        border-radius: 2px;
        background-color: #ff6222;
        font-size: 1.4rem;
      }
      .icon-submit {
        position: relative;
        display: flex;
        justify-content: center;
        .praiseNum {
          position: absolute;
          bottom: -2px;
          font-size: 1rem;
        }
        .zan-img {
          width: 3rem;
          height: 3rem;
        }
        .mask {
          position: absolute;
          top: 0;
          left: 9px;
          width: 3rem;
          height: 100%;
          border-radius: 50%;
          &.active {
            background-color: rgba(0, 0, 0, .2);
          }
        }
      }
    }
    .mask {
      position: absolute;
      z-index: 1001;
      background-color: transparent;
      width: 100%;
      height: 50%;
      bottom: 4.8rem;
    }
  }
</style>
