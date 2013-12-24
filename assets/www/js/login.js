document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){	
	document.addEventListener("backbutton", back_pre, false);
}		
function login(){
	var connection=checkConnection();
	if(connection == "None"||connection == "Unknown connection"||connection == "Cell 2G connection"){
		window.localStorage.setItem('mode',2);   //设置成离线状态
		toast("您处于离线状态，不能登录");
	}else{
		if($$("username").vaule == '' ||$$("password").value == ''){
			alert("请输入用户名或密码");
		} else {
			$(".rebttn").innerHTML = '正在登录<img src="style/style1/imgs/load.gif"/>';
			var parameter = new Object();
			parameter.username = $$("username").value;
			parameter.lifetime = 0;
			parameter.enews = 'phoneLogin';
			sentAllArticlesRequest(PHPURL,'loginCallback',parameter);
		} 
	}  
}

function loginCallback(jsonData){
    if(jsonData.articles[0].userid ==''){
        alert("您输入的帐号不存在");
        $$("lg-bttn").innerHTML = '登录';
    } else if(hex_md5($$("password").value) == jsonData.articles[0].password){
        window.localStorage.setItem('userid',jsonData.articles[0].userid);
        window.localStorage.setItem('username',jsonData.articles[0].username);
        window.localStorage.setItem('loginTime',Date.parse(new Date()));
        toast("登录成功");
        setInterval(function(){window.location.href = "set.html";},1000);
    } else {
        alert("您输入的密码不正确,请重新输入");
        $$("lg-bttn").innerHTML = '登录';
    }
}
function checkOut() {
	window.localStorage.setItem("userid","");
	window.localStorage.setItem("username","");
	toast("退出成功");
	setInterval(function(){document.location.reload();},1000);
}	
function Alink(num){
	switch(num){
		case 1: window.location="index.html";break;
		case 2: window.location="insight.html";break;
		case 3: window.location="solutions.html";break;
		case 4: window.location="login.html";break;
		case 5: window.location="set.html";break;
	}
}
function regist(){
	var connection=checkConnection();
	if(connection == "None"||connection == "Unknown connection"||connection == "Cell 2G connection"){
		window.localStorage.setItem('mode',2);   //设置成离线状态
		toast("您处于离线状态，不能完成注册");
	}else{
		var username=$("#username").val();
		var email=$("#email").val();
		var userpass=$("#password").val();
		var passcheck=$("#passcheck").val();
		if(username==""||email==""||userpass==""){
			toast("信息必须填写完整");
		}else{
			if(userpass!=passcheck){
				toast("两次输入密码不同");
			}else{
				var emailtag1=email.indexOf("@");
				var emailtag2=email.indexOf(".")-1;
				var emaillength=email.length-2;
				if(emailtag1>0 && emailtag2>0 && emailtag2>emailtag1 && emailtag2<emaillength){
					var parameter = {enews: 'register', username:username, userpass:userpass, email:email};
					sentAllArticlesRequest(PHPURL, 'registSuccess', parameter);
				}else{
					toast("邮箱格式不正确");
				}
			}
		}
	}
}	
function registSuccess(registResult){
	if (registResult.articles.length!=0) {
		var username=registResult.articles[0].username;
		var userid=registResult.articles[0].userid;
		navigator.notification.alert("注册成功",backLogin, "提示", "");
	} else {
		toast("用户名已经存在");
	} 
}
function backLogin(){
	window.location="login.html";
}	