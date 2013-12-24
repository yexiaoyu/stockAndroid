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
	if(viewClass==83){
		newsList(83);
	}else if(viewClass==84){
		newsList(84);
	}else if(viewClass==85){
		newsList(85);
	}else{
		newsList(82);
	}
}


