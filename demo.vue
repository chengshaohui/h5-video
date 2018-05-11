<template>
  <div>
    <!--进入时的跳转页面-->
    <div class="guide-page" id="guidePage" v-if="windowDetail.guideImg !== ''">
      <div id="setOuttimes">跳过 <span>{{windowDetail.guideTimes}}</span></div>
      <img :src="windowDetail.guideImg"/>
    </div>
    <div class="modal" id="passwordModal" v-if="windowDetail.authType === 2">
      <div class="win">
        <div class="win-tit">欢迎观看本直播</div>
        <div class="win-body">
          <input type="text" placeholder="请输入邀请码" id="password"/>
          <div v-if="windowDetail.auth && windowDetail.auth.authUrl && windowDetail.auth.authUrl !== ''"
               style="padding-top: 10px;text-align: right">
            <a href="windowDetail.auth.authUrl" style="font-size: 14px;color: blue;">(点击获取邀请码)</a>
          </div>
          <div class="btn" id="authPasswordBtn">立即观看</div>
        </div>
      </div>
    </div>
    <div class="modal" id="watchPayModal" v-if="false">
      <div class="win">
        <img src="../../static/img/window/money.png" alt="" style="">
        <p>客官需要先付费才能观看哦。</p>
        <h1 style="">{{1}}</h1>
        <button id="watchPayBtn" style="">付费观看</button>
      </div>
    </div>

    <!--主体页面-->
    <div class="container">
      <!--播放器-->
      <v-video/>
      <!--菜单内容-->
      <div class="menu">
        <div class="menu-header">互动聊天</div>
        <div class="menu-content">
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
                  <span class="reply" @click="clickReply(item.comment.userName)">
                    <img width="18" height="18" src="../../static/img/chat-toReplay-gray.png" alt="">
                  </span>
                </div>
                <ul class="secondary-comment-list" v-if="item.replies.length">
                  <li class="secondary-comment" v-for="val in item.replies">
                    <span class="userName">{{val.userName}}：</span><!--
                 --><span>{{val.msg}}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <!--打赏榜单-->
        <div id="content2" class="content" style="display:none">
          <div class="clearfix scroll" id="rewardBoardBox"></div>
        </div>
        <!--图文直播-->
        <div id="content3" class="content" style="display:none">
          <div id="gaphicLiveBox" class="">
            <div class="more" id="graphicLiveMore"></div>
          </div>
        </div>
      </div>
      <!--奖品-->
      <div class="reward-layer" id="rewardLayer"
           v-if="!noLogin && windowDetail.doReward === 1 && windowDetail.windowReward" style="display: none;">
        <div class="close-box" id="rewardLayerClose">
          <img src="../../static/img/window/close.png"/>
        </div>
        <div v-if="windowDetail.windowReward.rewardType === 1" id="rewardType1" class="scroll">
          <div v-if="windowDetail.windowReward.requireTel === 1" class="reward-form-row">
            <span v-if="windowDetail.windowReward.telephoneTip && windowDetail.windowReward.telephoneTip !== ''">{{windowDetail.windowReward.telephoneTip}}</span>
            <span v-else>手机号:</span>
            <input type="text" value="" class="tel rewardTel" placeholder="请输入手机号"/>
          </div>
          <div class="reward-list">
            <!--todo-->
            <div class="reward" :class="{active: index === 0}"
                 v-for="(item, index) in windowDetail.windowReward.propsList"
                 data-cash="item.cash" :data-id="item.id" :key="item.id">
              <img :src="item.propsImage"/>
              <div class="reward-name">{{item.propsName}}</div>
            </div>
          </div>
          <div class="reward-form">
            <span>数量</span>
            <input type="text" value="1" id="rewardNum" style="height: 26px;line-height: 26px;"/>
            <span>合计</span>
            <!--todo-->
            <span class="money" id="moneyShow">￥{{firstCash}}</span>
            <a href="javascript:;" class="pay-btn fr payBtn" data-type="1">确认支付</a>
          </div>
        </div>
        <div v-else-if="windowDetail.windowReward.rewardType === 2" id="rewardType2" class="scroll">
          <div class="reward-form2">
            <div class="reward-form-row" v-if="windowDetail.windowReward.requireTel === 1">
              <span>{{windowDetail.windowReward.telephoneTip || "手机号"}}</span>
              <input type="text" value="" class="tel rewardTel" placeholder="请输入手机号"/>
            </div>
            <div class="reward-form-row">
              <span>打赏金额:</span>
              <input type="text" value="" class="cash" id="rewardCash"/>
              <a href="javascript:;" class="pay-btn payBtn" data-type="2">确认支付</a>
            </div>
          </div>
        </div>
      </div>
      <!--投票-->
      <div class="vote-layer" id="voteLayer" style="display: none;">
        <div class="close-box" id="voteLayerClose">
          <img src="../../static/img/window/close.png"/>
        </div>
        <div id="voteBox">
        </div>
      </div>
    </div>
    <!--返回顶部-->
    <div class="scrollTop" v-show="false">
      <img src="../../static/img/window/scrollTop.png" alt="">
    </div>
    <!--底部发送评论框-->
    <div class="option">
      <div class="opt-input">
        <input type="text" class="commentVal" ref="bottomInput" :placeholder="bottomPlaceholder" v-model="commentVal"
               v-isFocus="isFocus"
               @focus="isFocus = true"
               @blur="inputBlur"/>
      </div>
      <div class="opt-Btn">
        <div v-if="isFocus" class="commentSubmit" @click="sendComment">{{bottomButton}}</div>
        <template v-else>
          <div class="icon-submit zan" v-show="true" @touchstart="isZanTouch=true" @touchend="isZanTouch=false"
               @click="like">
            <img width="30" height="30" src="../../static/img/window/zan-icon.png"/>
            <span class="praiseNum">{{$_numberTrans(likeNum)}}</span>
            <div class="mask" :class="{active: isZanTouch}"></div>
          </div>
          <div class="icon-submit reward" v-show="false">
            <img width="30" height="30" src="../../static/img/window/reward-icon.png"/>
          </div>
          <div class="icon-submit vote" v-show="false">
            <img width="30" height="30" src="../../static/img/window/vote-icon.png"/>
          </div>
        </template>
      </div>
    </div>
    <!--回复-->
    <div class="option" id="replayOption" style="display: none;">
      <div class="opt-item opt-input">
        <input type="text" id="replayVal" placeholder="回复"/>
      </div>
      <div class="opt-item replaysendBtn sendBtn">
        <span id="replaySubmit">回复</span>
      </div>
    </div>
    <!--遮罩层-->
    <div class="modal imgModal" id="graphicLiveImgModal" style="display: none;">
      <div class="imgModalbg" id="graphicLiveImgModalbg"></div>
    </div>
    <!--红包-->
    <div class="modal imgModal" id="redPacketModal" style="display: none;">
      <div id="redPacketModalbg">
        <img id="redPacketbg" src="../../static/img/window/redPacketBg.png" alt=""
             style="visibility: hidden;">
        <div class="redPacketInfo"></div>
        <img class="redPacketClose" src="../../static/img/window/redPacketClose.png" alt="">
      </div>
    </div>
    <!--弹出临时链接-->
    <temp-tips/>
  </div>
</template>

<script>
  import vVideo from './v-video'
  import tempTips from './temp-tips'

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
        likeNum: 0,
        firstCash: 0,
        countDownSec: 0,
        vodUrl: '',
        commentVal: '',
        bottomPlaceholder: '一起来互动吧',
        bottomButton: '发送',
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
      memberVideoImg(memberLive) {
        if (this.memberLive.capture !== '') {
          return this.memberLive.capture
        } else {
          return this.memberLive.screenshot
        }
      },
      // 点赞
      like() {
        this.likeNum++
      },
      // 发送评论
      sendComment() {
      },
      // 点击回复评论
      clickReply(name) {
        this.bottomPlaceholder = '回复' + name + ':'
        this.isFocus = true
        this.bottomButton = '回复'
      },
      // 底部框失去焦点
      inputBlur() {
        this.isFocus = false
        this.bottomPlaceholder = '一起来互动吧'
        this.bottomButton = '发送'
      },
      getCommentData() {
        this.$http.get('/api/value').then(res => {
          res = res.body
          this.commentList = res.data.chatList
        })
      }
    },
    mounted() {
    },
    created() {
      this.getCommentData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container {
    height: calc(100% - 48px);
  }

  .menu {
    .menu-header {
      width: 100%;
      height: 35px;
      line-height: 35px;
      border-bottom: 2px solid #ff6222;
      text-align: center;
      font-size: 16px;
      color: #ff6222;
      margin-bottom: 14px;
    }
    .menu-content {
      text-align: center;
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
          font-size: 14px;
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
            font-size: 12px;
            color: #bababa;
            .reply {
              margin-right: 10px;
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
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 48px;
    color: #666;
    background-color: #f6f6f6;
    .opt-input {
      flex: auto;
      padding: 2%;
      .commentVal {
        width: 100%;
        height: 30px;
        border: none;
        border-radius: 4px;
        text-indent: 10px;
      }
    }
    .opt-Btn {
      margin-right: 6px;
      flex: 0 0 48px;
      width: 48px;
      text-align: center;
      color: #fff;
      .commentSubmit {
        height: 30px;
        line-height: 30px;
        padding: 0 5px;
        border-radius: 2px;
        background-color: #ff6222;
      }
      .icon-submit {
        position: relative;
        display: flex;
        justify-content: center;
        .praiseNum {
          position: absolute;
          bottom: -2px;
          font-size: 10px;
        }
        .mask {
          position: absolute;
          width: 30px;
          height: 100%;
          border-radius: 50%;
          &.active {
            background-color: rgba(0, 0, 0, .2);
          }
        }
      }
    }
  }
</style>
