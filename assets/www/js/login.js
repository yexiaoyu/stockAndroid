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
			parameter.password = $$("password").value;
//			sentAllArticlesRequest(LONGINURL,'loginCallback',parameter);
			sentLoginRequest(LONGINURL,'loginCallback',parameter);
		} 
	}  
}

function loginCallback(jsonData){
    if(jsonData.articles.username ==''){
        alert("您输入的帐号不存在");
        $$("lg-bttn").innerHTML = '登录';
//    } else if(hex_md5($$("password").value) == jsonData.articles[0].password){
    } else if(jsonData.articles.state == 1){
        window.localStorage.setItem('userid',jsonData.articles.userid);
        window.localStorage.setItem('username',jsonData.articles.username);
        window.localStorage.setItem('grade',jsonData.articles.grade);
        window.localStorage.setItem('loginTime',Date.parse(new Date()));
        window.localStorage.setItem("email",jsonData.articles.email);
		window.localStorage.setItem("phone",jsonData.articles.phone);
        toast("登录成功");
//      setInterval(function(){window.location.href = "set.html";},1000);
        setInterval(function(){window.location.href = "index.html";},1000);
    } else {
        alert("您输入的密码不正确,请重新输入");
        $$("lg-bttn").innerHTML = '登录';
    }
}
function checkOut() {
	window.localStorage.setItem("userid","");
	window.localStorage.setItem("username","");
	window.localStorage.setItem("grade","");
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
		var phone=$("#phone").val();
		var userpass=$("#password").val();
		var passcheck=$("#passcheck").val();
		var patterUserName = /^([a-z]|[A-Z]|[0-9]|_)+$/;
		var patterEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		var patterPhone = /^0{0,1}(13[0-9]|145|147|15[0-3]|15[5-9]|18[0-9])[0-9]{8}$/;
		if(!patterUserName.test(username)){
			toast("用户名不合法");
			return ;
		}else{
			$.get(CHECKUSERNAMEURL + "?userName=" + username, function(data) {
				data = $.parseJSON(data);
				if(data.pass != 1){
					toast("用户名已注册");
					return ;
				}else{
					if(phone == null || phone == "" || !patterPhone.test(phone)){
						toast("手机号码格式不正确");
						return ;
					}
					if(userpass == null || userpass == "" || userpass.length < 6){
						toast("密码至少六位");
						return ;
					}
					if(email == null || email == "" || !patterEmail.test(email)){
						toast("邮箱格式不正确");
						return ;
					}
					if(passcheck == null || passcheck == "" || userpass!=passcheck){
						toast("两次输入密码不同");
						return ;
					}
					var parameter = {username:username, password:userpass, phone:phone, email:email};
//					sentAllArticlesRequest(REGISTURL, 'registSuccess', parameter);
					sentLoginRequest(REGISTURL, 'registSuccess', parameter);
				}
			});
		}
//		if(username==""||phone==""||userpass==""){
//			toast("信息必须填写完整");
//		}else{
//			if(userpass!=passcheck){
//				toast("两次输入密码不同");
//			}else{
//				var emailtag1=email.indexOf("@");
//				var emailtag2=email.indexOf(".")-1;
//				var emaillength=email.length-2;
//				if(emailtag1>0 && emailtag2>0 && emailtag2>emailtag1 && emailtag2<emaillength){
//					var parameter = {enews: 'register', username:username, userpass:userpass, email:email};
//					sentAllArticlesRequest(PHPURL, 'registSuccess', parameter);
//				}else{
//					toast("邮箱格式不正确");
//				}
//			}
//		}
	}
}	
function registSuccess(registResult){
	if (registResult.articles !=null && registResult.articles != "") {
		var username=registResult.articles.username;
		var userid=registResult.articles.userid;
		window.localStorage.setItem("userid",registResult.articles.userid);
		window.localStorage.setItem("username",registResult.articles.username);
		window.localStorage.setItem("grade",registResult.articles.grade);
		window.localStorage.setItem("email",registResult.articles.email);
		window.localStorage.setItem("phone",registResult.articles.phone);
		navigator.notification.alert("注册成功",backLogin, "提示", "");
	} else {
		toast("用户名已经存在");
	} 
}
function backLogin(){
	window.location="login.html";
}
function reset(){
	var connection=checkConnection();
	if(connection == "None"||connection == "Unknown connection"||connection == "Cell 2G connection"){
		window.localStorage.setItem('mode',2);   //设置成离线状态
		toast("您处于离线状态，不能完成重置");
	}else{
		var username=window.localStorage.getItem('username');
		var userid=window.localStorage.getItem('userid');
		var oldpassword=$("#oldpassword").val();
		var userpass=$("#passwordnew").val();
		var passcheck=$("#passnewcheck").val();
		$.get(LONGINAJAXURL + "?userid=" + userid+"&password="+oldpassword, function(data) {
			if(data.state == 1){
				if(userpass == null || userpass == "" || userpass.length < 6){
					toast("密码至少六位");
					return ;
				}
				if(passcheck == null || passcheck == "" || userpass!=passcheck){
					toast("两次输入密码不同");
					return ;
				}
				var parameter = {userid:userid, password:userpass};
				sentLoginRequest(RESETURL, 'resetSuccess', parameter);
			}else{
				alert("原密码输入错误");
				return ;
			}
		},"json");
	}
}
function resetSuccess(data){
	if (data.articles !=null && data.articles != "" && data.articles.state == 1) {
		navigator.notification.alert("密码更新成功",backLogin, "提示", "");
	} else {
		navigator.notification.alert("服务器异常,请稍后重试",backLogin, "提示", "");
	} 
}