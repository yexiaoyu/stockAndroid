
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
function onDeviceReady(){
	var connection = checkConnection();
	if(connection == "None"){
		window.localStorage.setItem('mode',2);   //设置成离线状态
		toast("您浏览的是离线信息");
	}
	newsList(80);
	loaded_refresh();
	loaded_banner();
	document.addEventListener("backbutton", back_pre, false);
}
