var DM = {watchingIntervalId:0};//观看通知定时器ID
DM.getAgent = function(){
    var parser = new UAParser();
    var browser = parser.getBrowser();
    var os = parser.getOS();
    var device = parser.getDevice();
    return isundefined(device.vendor,device.model)+"_"+isundefined(os.name,os.version)+"_"+isundefined(browser.name,"")+"_"+isundefined(browser.version,"");
    function isundefined(info1,info2){
        if(info1 == undefined){
            info1 = "none";
            info2 = '';
        }
        return info1+info2;
    }
};
DM.getIdentity = function (){
    if(!(document.cookie || navigator.cookieEnabled))
    {
        return "cookie_disable"
    }
    var identityVal = getCookie("identity");
    if(identityVal.length < 12){
        var exp = new Date();
        exp.setTime(exp.getTime() + 365*24*60*60*1000);
        var uuid = generateUUID();
        document.cookie = "identity" + "="+ uuid + ";expires=" + exp.toGMTString();
        if(window.localStorage){
            localStorage.setItem("identity",uuid);
        }
        identityVal = getCookie("identity");
        return identityVal;
    }else {
        return identityVal;
    }
    function getCookie(c_name) {
        if (document.cookie.length>0) {
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1) {
                c_start=c_start + c_name.length+1;
                var c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return document.cookie.substring(c_start,c_end);
            }else {
                if(window.localStorage){
                    var tmp = localStorage.getItem(c_name);
                    if(tmp && tmp != ""){
                        return tmp
                    }
                }
            }
        }
        return "nocookie"
    }
    function generateUUID(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
};
DM.visit = function(live_id,url,type) {
    if(DM.visit.loaded)return;
    DM.visit.loaded = true;
    var img = new Image();
    img.src = "http://qk-data.cn-hangzhou.log.aliyuncs.com/logstores/qk-client-watch/track.gif?APIVersion=0.6.0&identity="+DM.getIdentity()+"&live_id="+live_id+"&url="+url+"&agent="+DM.getAgent()+"&type="+type;
};
DM.watching = function(live_id,url,type) {
    if(DM.watchingIntervalId != 0){
        return;
    }
    var img = new Image();
    img.src = "http://qk-data.cn-hangzhou.log.aliyuncs.com/logstores/qk-client-in-watching/track.gif?APIVersion=0.6.0&identity="+DM.getIdentity()+"&live_id="+live_id+"&url="+url+"&type="+type;

    DM.watchingIntervalId = setInterval(function(){
        var img = new Image();
        img.src = "http://qk-data.cn-hangzhou.log.aliyuncs.com/logstores/qk-client-in-watching/track.gif?APIVersion=0.6.0&identity="+DM.getIdentity()+"&live_id="+live_id+"&url="+url+"&type="+type;
    }, 60*1000);
};
DM.stopWatching = function(){
    if(DM.watchingIntervalId != 0){
        clearInterval(DM.watchingIntervalId);
    }
};
DM.visitColumn = function(id) {//栏目访问埋点
    if(DM.visit.loaded)return;
    DM.visit.loaded = true;
    var img = new Image();
    img.src = "http://qk-data.cn-hangzhou.log.aliyuncs.com/logstores/qk-column-visit/track.gif?APIVersion=0.6.0&identity="+DM.getIdentity()+"&id="+id+"&agent="+DM.getAgent();
};
//function BuriedPoint(live_id,url,type)
