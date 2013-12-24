// JavaScript Document
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener("deviceready", onDeviceReady, false);	
function onDeviceReady(){	
	var connection=checkConnection();
	if(connection == "None"||connection == "Unknown connection"||connection == "Cell 2G connection"){
		window.localStorage.setItem('mode',2);   //设置成离线状态
		toast("您处于离线状态，无法查看评论内容");
	}else{
		plselect();
	}
	loaded_refresh();	
	document.addEventListener("backbutton",back_pre, false);
}
function plselect() {
	var id = window.localStorage.getItem('id');
	var parameter = {enews: 'pllist', id: id, start: 0, length: 10};
	sentAllArticlesRequest(PHPURL, 'plListcb', parameter);
	autoselect();
}
function plListcb(result) {
	result = result.articles;
	var mainUlHtml = '';
	if(result.length==0){
		mainUlHtml+="<div style='margin-top:6em; font-size:1.5em; color:#666; text-align:center;'>暂时没有评论内容</div>"
	}
	for (var i = 0; i < result.length; i++) {
		mainUlHtml +=
				'<li><a><h4>' + result[i].username + '</h4>' +
				'<p class="main-smalltext">' + result[i].saytext + '</p>' +
				'<p class="main-time">时间:' + result[i].saytime + '</p>' +
				"</a></li>";
	}
	$('#nowloading').remove();
	$$("thelist").innerHTML = mainUlHtml;
	setTimeout(function (){myScroll.refresh();},500);
}
function autoselect(){
	viewClass = window.localStorage.getItem("viewClass");
	$(".nav li span").removeClass("selbo");
	if(viewClass==82||viewClass==83||viewClass==84||viewClass==85){
		$("#head-nav").css("display","-webkit-box");
		$("#head-nav1").css("display","none");
		$("#head-nav2").css("display","none");
		$("#indexbot").addClass("ft-home");
		$("#insightbot").addClass("ft-menued");
		$("#solutionbot").addClass("ft-info");
		if(viewClass==82){
			$("#82 span").addClass("selbo");
		}else if(viewClass==83){
			$("#83 span").addClass("selbo");
		}else if(viewClass==84){
			$("#84 span").addClass("selbo");
		}else if(viewClass==85){
			$("#85 span").addClass("selbo");
		}
	}else if(viewClass==86||viewClass==87||viewClass==88){
		$("#head-nav").css("display","none");
		$("#head-nav1").css("display","-webkit-box");
		$("#head-nav2").css("display","none");
		$("#indexbot").addClass("ft-home");
		$("#insightbot").addClass("ft-menu");
		$("#solutionbot").addClass("ft-infoed");
		if(viewClass==86){
			$("#86 span").addClass("selbo");
		}else if(viewClass==87){
			$("#87 span").addClass("selbo");
		}else if(viewClass==88){
			$("#88 span").addClass("selbo");
		}
	}else if(viewClass==89||viewClass==90||viewClass==91||viewClass==92){
		$("#head-nav").css("display","none");
		$("#head-nav1").css("display","none");
		$("#head-nav2").css("display","-webkit-box");
		$("#indexbot").addClass("ft-homeed");
		$("#insightbot").addClass("ft-menu");
		$("#solutionbot").addClass("ft-info");
		if(viewClass==89){
			$("#89 span").addClass("selbo");
		}else if(viewClass==90){
			$("#90 span").addClass("selbo");
		}else if(viewClass==91){
			$("#91 span").addClass("selbo");
		}else if(viewClass==92){
			$("#92 span").addClass("selbo");
		}
	}else{
		$("#head-nav").css("display","none");
		$("#head-nav1").css("display","none");
		$("#head-nav2").css("display","none");
		$("#wrapper").css("top","2.5em");
		$("#indexbot").addClass("ft-homeed");
		$("#insightbot").addClass("ft-menu");
		$("#solutionbot").addClass("ft-info");
	}
}
function newsList(classId){
	viewClass = classId;
	window.localStorage.setItem("viewClass",viewClass);
	if(viewClass==82||viewClass==83||viewClass==84||viewClass==85){
		window.location="insight.html";
	}else if(viewClass==86||viewClass==87||viewClass==88){
		window.location="solutions.html";
	}else{
		window.location="brandz.html";
	}
}