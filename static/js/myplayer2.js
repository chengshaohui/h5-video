var u = navigator.userAgent, app = navigator.appVersion, ua = navigator.userAgent.toLowerCase();
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);               //ios终端
var isWeixin = ua.match(/MicroMessenger/i) == "micromessenger";       //是否微信
var isqq = u.match(/\sQQ/i) == " QQ";                                 //是否qq
var html;
function playerRun(url, poster, auto){
	var postHtml = '';
	if(poster != ""){
		postHtml = 'poster="'+poster+'"';
	}
    html='<video id="video" controls playsinline="true" x5-playsinline="true" x-webkit-airplay="true" webkit-playsinline="true" x5-video-orientation="landscape|portrait"'+
    'src="'+url+'" preload="auto" style="width:100%;height:100%;"'+
    'style="background-size: cover;" '+postHtml+'></video>';
    var videoBox = document.getElementById("videoBox");
	if(videoBox == undefined || videoBox == null){
		return;
	}
	videoBox.innerHTML = html;
    var	 Media = document.getElementById("video");
	if(videoRefresh()){
		if(poster != ""){
			$("#videoBox").css("background","url("+poster+") 50% 50% / cover no-repeat rgb(0, 0, 0);");
		}
	}
	if(auto){
		Media.play();
	}
	window.Media = Media;

    var setVideoH = setInterval(function(){//设置视频高度
        var Media = document.getElementById("video");
        if(!videoRefresh() || !$("#videoBox").length) clearInterval(setVideoH);
        else if(videoRefresh() && Media.videoWidth && Media.videoHeight){
            $("#videoBox").css("background-image","url()");
            var playBoxHeight = screenW * Media.videoHeight / Media.videoWidth
            if (playBoxHeight > screenW) {
                playBoxHeight = screenW*3/4;
            }
            $("#playBox").height(playBoxHeight);
            refreshFunc();
            clearInterval(setVideoH);
        }
    }, 500)
}
function videoRefresh(){
	if(isAndroid && (isqq || isWeixin)) return true;
}