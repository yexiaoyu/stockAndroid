// JavaScript Document
document.addEventListener('DOMContentLoaded', loaded, false);
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
function onDeviceReady(){
	autoselect();
	document.addEventListener("backbutton", back_pre, false);
}
function autoselect(){
	viewClass = window.localStorage.getItem("viewClass");
	if(viewClass==94){
		newsList(94);
	}else{
		newsList(150);
	}
}
function newsList(classId) {
    viewClass = classId;	
	$(".nav li span").removeClass("selbo");
	if(viewClass==94){
		$("#94 span").addClass("selbo");
		$("#regtable").show();
		$("#publish").hide();
		[].slice.call(document.querySelectorAll('input, select, button')).forEach(function(el){
		el.addEventListener(('ontouchstart' in window)?'touchstart':'mousedown', function(e){
		e.stopPropagation();});});
	}else if(viewClass==150){
		$("#regtable").hide();
		$("#publish").show();
		$("#150 span").addClass("selbo");
		window.localStorage.setItem("viewClass",viewClass);
		document.getElementById('thelist').innerHTML = "<div id='nowloading'><img src='style/style1/imgs/loading.gif'></div>";	
		obtainData();
	}	
}
function obtainData(){
	viewMode = window.localStorage.getItem('mode');
	viewClass=window.localStorage.getItem("viewClass");
    if(viewMode == 1){
        var parameter = {enews: 'content', category: viewClass};
        sentAllArticlesRequest(PHPURL, 'onLineJsonp', parameter);
    }else{
		showContent();
	}
}
function onLineJsonp(dataJson){
	console.log("onLineJsonp每次都重新获取吗？--"+dataJson);
    if (dataJson.articles){
        for (var i in dataJson.articles) {   //插入数据库信息
            ap.dbInsert(DBNAME, dataJson.articles[i],"");
        }
    } else {
        navigator.notification.alert("暂时没有更新信息", "", "提示", "");
    }  
	showContent();
}
function showContent(){	
	viewClass=window.localStorage.getItem("viewClass");
	ap.dbFindAll(DBNAME,conShow,' * ',' where id=' + viewClass);
	
}
function conShow(str){	
    var rst = pushJson(str);
     $$('thelist').innerHTML = 
            '<h3 class="conTit">'+ rst[0].title + '</h3>' +
            '<div class="conInfo">时间:' + rst[0].newstime + '</div>' +
			'<hr />'+
            '<div class="conText">' + rst[0].newstext + '</div>';
	//分享按钮填充
	$$('shareDiv').innerHTML = 
        	'<ul>' + 
            	'<li><a href="sinaweibo.html">新浪微博分享</li>' +
				'<li><a href="tengxunweibo.html">腾讯微博分享</a></li>' + 
                '<li><a href="sms:?body=好文分享： 来自 MillwardBrown 的文章' + rst[0].title  + rst[0].classpaths +'">短信分享</a></li>' +  
                '<li><a href="mailto:?subject=' + rst[0].title + '&body=好文分享：来自 MillwardBrown 的文章' + rst[0].title +  rst[0].classpaths + '">E-mail分享</a></li>' + 
                '<li onclick="copypaste();">复制链接</li>' + 
				'<li class="closeLi"><div class="closeShare" onclick="closeShare();">取消</div></li>'+ 
            '</ul>';	
	window.localStorage.setItem('con_id',rst[0].classpaths); 
	window.localStorage.setItem('con_text',rst[0].title + rst[0].classpaths); 
	setTimeout(loaded, 200);
	clearA();
}

//处理内容显示部分，现包括链接的处理和图片的显示两部分
function clearA(){
	var inhtml=$("#thelist a").html();
	$("#thelist a").replaceWith(inhtml);
	var imgs=$("#thelist img");
	var fullsrc;
	for(var i=0;i<=imgs.length;i++){
		var imgsrc=$(imgs[i]).attr("src");
		var imgsrcString=imgsrc.toString();
		var imgsrclength=imgsrcString.length-1;
		srcend=imgsrc.substring(1,imgsrclength);
		fullsrc="http://brandnews.chinamillwardbrown.cn"+srcend;
		$(imgs[i]).attr("src",fullsrc);
		$(imgs[i]).attr("width","100%");
		$("#thelist img").bind('click',function(){
			window.localStorage.setItem("imgsrc",this.src);
			window.location="imgshow.html";
		});
		$("#thelist img").bind('load',function(){
			myScroll.refresh();
		});
	}
}

//分享表单的显示和隐藏
function shareThis(){
	$(".layer").fadeIn("slow");
}
function closeShare(){
	$(".layer").fadeOut("slow");
}

//复制链接插件部分
function copypaste(){
	var con_id = window.localStorage.getItem('con_id');
	ClipboardManager.copy(
		con_id,
		function(r){
			ClipboardManager.paste(
					function(r){toast("复制成功")},
					function(e){alert(e)}
				)	
		},
		function(e){alert(e)}
	);
}

//评论表单的清空和自动填充
function clearValue(){
	$("#pltext").val("");
}
function invalue(){
	var plText=$("#pltext").val();
	if(plText==""){
		$("#pltext").val("轻点此处发表您的评论");
	}
}
//发表提交
function plCreate(){
	var connection=checkConnection();
	if(connection == "None"||connection == "Unknown connection"||connection == "Cell 2G connection"){
		window.localStorage.setItem('mode',2);   //设置成离线状态
		toast("您处于离线状态，不能发表评论");
	}else{
		if(!window.localStorage.getItem("userid")){
			toast("请先登录再发表评论");
		}
		var pltext = $$("pltext").value;
		if(pltext == ''){
			toast("请输入评论内容");
		} else {
			var parameter = new Object();
			parameter.enews = 'plCreate';
			parameter.userid = window.localStorage.getItem('userid');
			parameter.username = window.localStorage.getItem('username');
			parameter.classid = window.localStorage.getItem('viewClass');
			parameter.id = window.localStorage.getItem('id');
			parameter.pltext = pltext;
			sentAllArticlesRequest(PHPURL, 'plCallback', parameter);
		}
	}
}

function plCallback(result){
	if(result.articles[0].status == 1){
		toast("评论成功");
		setInterval(function(){
			window.location = 'pllist.html';
		},1000);
	} else {
		toast("评论失败");
	}
}
function subreg(){
	var firstname=$("#firstname").val();
	var lastname=$("#lastname").val();
	var company=$("#company").val();
	var email=$("#email").val();
	var parameter = {enews: 'signup', bid:SIGNUPID, firstname: firstname, lastname: lastname, company: company, email: email};
        sentAllArticlesRequest(PHPURL, 'signupsuc', parameter);
}
function signupsuc(result){
	alert("报名成功");
}