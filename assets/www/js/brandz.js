// JavaScript Document

document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
function onDeviceReady(){
	var connection = checkConnection();
	if(connection == "None"){
		window.localStorage.setItem('mode',2);   //设置成离线状态
		toast("您浏览的是离线信息");
	}
	autoselect();
	loaded();
	document.addEventListener("backbutton", back_pre, false);
}
function autoselect(){
	viewClass = window.localStorage.getItem("viewClass");
	if(viewClass==90){
		newsList(90);
	}else if(viewClass==91){
		newsList(91);
	}else if(viewClass==92){
		newsList(92);
	}else{
		newsList(89);
	}
}