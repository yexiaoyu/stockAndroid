//记录当前导航栏目
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
window.onload=function(){loaded_banner();loaded();}
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	document.addEventListener("backbutton", quit, false);
	createDatabase();
	connectStatus();
	newsinfo();//要闻资讯
	updowninfo();//涨停板掘金
	//checkUpdate();
}
function newsinfo(){
	var viewMode = window.localStorage.getItem('mode');
	//alert("mode="+viewMode);
	if(viewMode == 1){
        var parameter = {reqtype: 93, start: 0, length: 5};//股市直播 = 93
        sentAllArticlesRequest(PHPURL,'indexnews',parameter);
    }else{
		var sqlWhere = " where type = 93 order by modifyTime desc limit 0,5";
        ap.dbFindAll(DBNAME, findAllCB, '*', sqlWhere);
	}
}
function indexnews(dataJson){
    if (dataJson.articles) {
        showindexnews(dataJson.articles);     //显示信息
        for (var i in dataJson.articles) {   //插入数据库信息
            ap.dbInsert(DBNAME, dataJson.articles[i],"");
        }
    } else {
        navigator.notification.alert("该栏目暂时没有信息", "", "提示", "");
    }  
}
//要闻资讯
function showindexnews(result,isJson) {
	var isJson = isJson || 0; //0 是json格式 ,1 不是
    if(isJson == 1){
        var result = pushJson(result);
    }
    var mainUlHtml = '';
    for (var i = 0; i < result.length; i++) {
        mainUlHtml +=
                '<li><a href="content.html" onclick="mainLiClick(' + result[i].id + ')">' +
                '· ' +result[i].title.substr(0,10)+'…'+
                '</a></li>';
    }
    document.getElementById('newsul').innerHTML += mainUlHtml;
}
function updowninfo(){
	var viewMode = window.localStorage.getItem('mode');
	if(viewMode == 1){
        var parameter = {reqtype: 94, start: 0, length: 5};//涨停板= 94
        sentAllArticlesRequest(PHPURL,'indexupdown',parameter);
    }else{
		var sqlWhere = " where type = 94 order by modifyTime desc limit 0,5";
        ap.dbFindAll(DBNAME, findAllCB, '*', sqlWhere);
	}
}
function indexupdown(dataJson){
    if (dataJson.articles) {
        showindexupdown(dataJson.articles);     //显示信息
        for (var i in dataJson.articles) {   //插入数据库信息
            ap.dbInsert(DBNAME, dataJson.articles[i],"");
        }
    } else {
        navigator.notification.alert("该栏目暂时没有信息", "", "提示", "");
    }  
}
//涨停板
function showindexupdown(result,isJson) {
	var isJson = isJson || 0; //0 是json格式 ,1 不是
    if(isJson == 1){
        var result = pushJson(result);
    }
    var mainUlHtml = '';
    for (var i = 0; i < result.length; i++) {
        mainUlHtml +=
                '<li><a href="content.html" onclick="mainLiClick(' + result[i].id + ')">' +
                '· ' +result[i].title.substr(0,10)+'…'+
                '</a></li>';
    }
    document.getElementById('updownul').innerHTML += mainUlHtml;
}
function findAllCB(result){
    if (result.rows.length == 0) {
		navigator.notification.alert("暂时缺少离线信息", "", "提示", "");
    } else {
        showindexnews(result,1);
    }
}
//记录本条文章ID
function mainLiClick(id) {
    window.localStorage.setItem("id", id);
    window.localStorage.setItem("viewClass",93)
}
//一键下载功能
var downtime;
function buttonShow(){	
	$("#downall").animate({
		right:0
	},600);
	$("#arr").css("-webkit-transform","rotate(-90deg)");
	downtime=setInterval("downhide()",3000);
}
function downhide(){
	$("#downall").animate({right:"-7em"},600);
	$("#arr").css("-webkit-transform","rotate(0deg)");
	clearInterval(downtime);
}
var proTime;
function downBegin(){
	$("#shadow").fadeIn(500);
	var parameter = {enews: 'alllist'};
	sentAllArticlesRequest(PHPURL, 'downLoadSuccess', parameter);
	proTime=setInterval("proccessing()",150);
}
var probarWidth=0;
function proccessing(){
	if(probarWidth<230){
	probarWidth+=2;
	$("#proin").css("width",probarWidth);
	}else{
		clearInterval(proTime);
	}
}
function downLoadSuccess(dataJson){
	if (dataJson.articles.length!=0) {
		$("#proin").css("width",230);
        for (var i=0;i<dataJson.articles.length;i++) {   //插入数据库信息
            ap.dbInsert(DBNAME, dataJson.articles[i],"");
			var probarWidth=24*(i/dataJson.articles.length)+230;
			$("#proin").css("width",probarWidth);
        }
		$("#shadow").fadeOut(500);
		navigator.notification.confirm("是否开启离线模式阅读", offLine, "下载完毕", "否,是");
    } else {
        navigator.notification.alert("暂时没有更新信息", "", "提示", "");
    }  
}
function offLine(){//开启离线浏览功能,这个功能要丰富
	if(result==2){
		window.localStorage.setItem('mode',2);
		obtainData();
	}
}

function singlelist(num,viewClass){
	if(num==1){
		window.location="activity.html";
	}else if(num==2){
		window.location="newslist.html";
	}else if(num==3){
		window.location="brandz.html";
		if(viewClass == null || "" == viewClass){
			viewClass = 89;
		}
		window.localStorage.setItem("viewClass",viewClass)
	}
}
//检查更新
function checkUpdate(){
var runtime=window.localStorage.getItem("runnow");
if(runtime!=1){
	//alert("asdfasdf");
	$.get("http://www.ipuapp.com/mobile-apps/www-millwardbrown-com/version_android.php", function(data){
		if(VERSION<data){
			window.localStorage.setItem("runnow",1);
			navigator.notification.confirm("发现应用有新版本", downApp, "是否下载", "否,是");
		}
		function downApp(result){
			if(result==2){
				var mainVersion=data.substr(0,1);
				var Minorversion=data.substr(2,1);
				var sourcedir1="mb";//下载一级目录
				var sourcedir2="update";//下载二级目录
				source="www-millwardbrown-com-v"+mainVersion+"-"+Minorversion+".apk";
				url="http://www.ipuapp.com/mobile-apps/www-millwardbrown-com/www-millwardbrown-com-v"+mainVersion+"-"+Minorversion+".apk";
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){     
					fileSystem.root.getDirectory(
						sourcedir,
						{create:true,exclusive:false},
						function(entrydir){ 
							entrydir.getDirectory(
								sourcedir2,
								{create:true,exclusive:false},
								function(entrydir){
									entrydir.getFile(
										source,
										{create:true,exclusive:false}, 
										function(parent){
											var fileTransfer = new FileTransfer(); 
											var uri = encodeURI(url);
											fileTransfer.onprogress = function(progressEvent) {								
												if (progressEvent.lengthComputable) {
													var percentLoaded = Math.round(100 * (progressEvent.loaded / progressEvent.total));
													var progressbarWidth=percentLoaded + "%";
													if(percentLoaded>=99){
														$("#shadow").hide();
													}else{
														$("#shadow").fadeIn(500);
													}
													$("#proin").css("width",progressbarWidth);
												} else {
													loadingStatus.increment();
												}
											};
											fileTransfer.download(
												uri,
												parent.fullPath,
												function(entry){ 
													//alert(entry.fullPath);
													window.plugins.update.openFile(entry.fullPath,null,null);
												},
												function(error) {alert("下载失败")}
											);
										},
										function(){alert("文件下载失败")}
									);
								},
								function(){alert("创建二级栏目失败")}
							);
						},
						function(){alert("创建一级目录失败");}
					); 
				}, function(evt){  
					console.log("加载文件系统出现错误");  
				});
			}
		}
	});
}
}