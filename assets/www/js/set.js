// JavaScript Document
document.addEventListener("deviceready", onDeviceReady, false);
function userInfo() {
	var userId = window.localStorage.getItem('userid');
	if (userId) {
		$$("list-login").innerHTML = window.localStorage.getItem('username');
		$$("list-login").href = "index.html";
		$("#out-btn").css("display","block");
	}
}	
function onDeviceReady(){
	userInfo();
	document.addEventListener("backbutton", back_pre, false);
}