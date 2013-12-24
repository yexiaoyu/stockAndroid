
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
	if(viewClass==87){
		newsList(87);
	}else if(viewClass==88){
		newsList(88);
	}else{
		newsList(86);
	}
}


