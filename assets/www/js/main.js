//应用配置信息

var ap = new app();            //实例化数据库类
var listRows = 10;             //每页显示数目
var viewClass;                 //记录当前信息分类
var myScroll,scroll_banner,pullDownEl, pullDownOffset,generatedCount = 0;
var VERSION=2.5;               //记录当前app的版本
var DBCONNECT = ap.dbConnect('ROYO_DB','1.0','ROYO_DB for User Mobile',2 * 1024 * 1024); //本地数据库链接
var DBNAME="mbnews";             //本地数据库名称
var PHPURL="http://brandnews.chinamillwardbrown.cn/e/phone/index.php";  //远程服务器php文件地址
var SIGNUPID=6;

/*创建数据库*/
function createDatabase(){   
    if (DBCONNECT === true) {
        ap.dbDefineTable(DBNAME, {
            id: "INTEGER PRIMARY KEY NOT NULL",
            classid: "INTEGER",
            title: "VARCHAR",
            smalltext: "TEXT",
            newstext: "TEXT",
            newstime: "DATE",
			newstimeNum: "INTEGER",
            lastdotime: "TIME",
			classpaths: "VARCHAR"
        });
    } else {
        navigator.notification.alert("数据库连接失败","", "提示","");
    }
}
/*  
 * 取得指定ID属性值 得到对象
 * @id {String} 指定的ID
 */
function $$(id) {
    return document.getElementById(id);
}
 
/* Jsonp
 * @url {String} 远程地址
 * @callback {String} 回调函数名
 * @parameter {Object}参数 例:{category:"20,21,22,23",length:10,start:0}
 */
function sentAllArticlesRequest(url, callback, parameter) {
    var paraStr = '';
    if (parameter) {
        for (i in parameter) {
            paraStr += '&' + i + '=' + parameter[i];
        }
    }
    var url = url + '?callback=' + callback + paraStr;
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}

/*
 * 转换成类似JSON格式
 * @result {Object} phonegap查询本地数据库得到的结果
 */
function pushJson(result) {
    var i,currentRow,stories = [];
    for (i=0;i<result.rows.length;i++) {
        currentRow = result.rows.item(i);
        stories.push(currentRow);
    }
    return stories;
}

/*
 * 循环显示对象的属性 
 * @o {Object} 需要循环的对象
 */
function forIn(o) {
    for (i in o) {
        document.write("<strong>" + i + "</strong>" + o[i] + "<br />");
    }
}

//检查网络状态
function checkConnection() {
//	var networkState = navigator.network.connection.type;	
	var networkState = navigator.connection.type;	
	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.NONE]     = 'None';
	return states[networkState];	
}
function connectStatus(){
	var connection=checkConnection();
	if(connection == "None"||connection == "Unknown connection"||connection == "Cell 2G connection"){
		window.localStorage.setItem('mode',2);   //设置成离线状态
		toast("您浏览的是离线信息");
	}else{
		window.localStorage.setItem('mode',1);   //设置成在线状态
	}
}
//重定义返回键
function quit(){
	window.localStorage.setItem("runnow","");
	navigator.notification.confirm("是否要退出程序", quitinfo , "提示", "否,是");	
}
function back_pre(){
	navigator.app.backHistory();
}
function back_home(){
	window.location="index.html";
}
//退出
function quitinfo(result){
	if(result==2){
		window.localStorage.setItem("runnow","");
		navigator.app.exitApp();
	}
}

//自动消失信息提示框接口 String msg
var toastime;
function toast(msg){
	var toastMsg="<div></div>";
	$toastDiv=$(toastMsg);
	$toastDiv.html(msg);
	$toastDiv.addClass("toast");
	$toastDiv.appendTo("body");
	var ScreenWidth=($(window).width()-$toastDiv.width())/2-15+"px";	
	var ScreenHeight=($(window).height()-$toastDiv.height())/2+"px";
	$toastDiv.css("top",ScreenHeight);
	$toastDiv.css("left",ScreenWidth);
	toastime=setInterval("toastFade()",1000);
}
function toastFade(){
	$(".toast").fadeOut("slow",function(){
		clearInterval(toastime);
		$(".toast").remove();		
	});
}
//每个页面的刷新功能
function refreshThis(){
	document.location.reload();
}

//iScroll初始化
//第一种默认加载
function loaded() {
	myScroll = new iScroll('wrapper',{hideScrollbar: true});
}
//第二种增加顶部刷新按钮功能的初始化
function loaded_refresh() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;	
	myScroll = new iScroll('wrapper', { //这是scroll的初始化
		useTransition: true,
		hideScrollbar: true,    //在没有用户交互时隐藏滚动条 默认为true
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉可以更新最新消息';
			}
		},
		onScrollMove: function () {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开查看最新消息';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉可以更新最新消息';
				this.minScrollY = -pullDownOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '正在为您加载…';				
				pullDownAction();   // Execute custom function (ajax call?)
			}
		}
	});
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}
//集成的刷新功能
function pullDownAction () {
	setTimeout(function () {// Simulate network congestion, remove setTimeout from production!
		var el, li, i;
		el = document.getElementById('thelist');
		viewMode=1;
		if(viewMode == 1){
			var startnum = firstRowFun(viewClass);
			var timeTrue=$("#thelist li:first p:last").html();
			var parameter = {enews: 'list', category: viewClass, start: startnum, length:listRows, timeNum:timeTrue};
			sentAllArticlesRequest(PHPURL, 'refreshJsonp', parameter);
		}
		myScroll.refresh();	// Remember to refresh when contents are loaded (ie: on ajax completion)
	}, 1000);				//Simulate network congestion, remove setTimeout from production!
}
//banner的横向滚动
function loaded_banner() {
	scroll_banner = new iScroll('banner', {
		snap: true,
		momentum: false,
		hScrollbar: false,
		onScrollEnd: function () {
			document.querySelector('#indicator > li.active').className = '';
			document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
		}
	 });
}