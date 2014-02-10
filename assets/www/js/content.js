
//等待设备准备
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
document.addEventListener("deviceready", onDeviceReady, false);	
document.addEventListener("DOMContentLoaded", contentOnLoad, false);
function onDeviceReady(){
	document.addEventListener("backbutton", back_pre, false);
}
//文档初始化	
function contentOnLoad(){
	setTimeout(loaded, 200);	
	var id = window.localStorage.getItem("id");
  	autoselect();
    ap.dbFindAll(DBNAME, conShow,'*',' where id=' + id);	
}

//内容显示
function conShow(str){
    var rst = pushJson(str);
    alert("详情：" +rst[0].content);
    $$('thelist').innerHTML = 
            '<h3 class="conTit">'+ rst[0].title + '</h3>' +
            '<div class="conInfo">时间:' + rst[0].modifyTime + '</div>' +
			'<hr />'+
            '<div class="conText">' + rst[0].content + '</div>';
	//分享按钮填充
	/*$$('shareDiv').innerHTML = 
        	'<ul>' + 
            	'<li><a href="sinaweibo.html">新浪微博分享</li>' +
				'<li><a href="tengxunweibo.html">腾讯微博分享</a></li>' + 
                '<li><a href="sms:?body=好文分享： 来自 MillwardBrown 的文章' + rst[0].title  + rst[0].classpaths +'">短信分享</a></li>' +  
                '<li><a href="mailto:?subject=' + rst[0].title + '&body=好文分享：来自 MillwardBrown 的文章' + rst[0].title +  rst[0].classpaths + '">E-mail分享</a></li>' + 
                '<li onclick="copypaste();">复制链接</li>' + 
				'<li class="closeLi"><div class="closeShare" onclick="closeShare();">取消</div></li>'+ 
            '</ul>';*/	
	window.localStorage.setItem('con_id',rst[0].classpaths);
	window.localStorage.setItem('con_text',rst[0].title + rst[0].classpaths);  
	clearA();	
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

function goComment(){
	window.location="comment.html";
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

//处理内容显示部分，现包括链接的处理和图片的显示两部分
function clearA(){
	var inhtml=$("#thelist a").html();
	$("#thelist a").replaceWith(inhtml);
	var imgs=$("#thelist img");
	var fullsrc;
	for(var i=0;i<=imgs.length;i++){
		var imgsrc=$(imgs[i]).attr("src");
		if(imgsrc != null && imgsrc != undefined){
//			var imgsrcString=imgsrc.toString();
//			var imgsrclength=imgsrcString.length-1;
//			srcend=imgsrc.substring(1,imgsrclength);
//			fullsrc="http://brandnews.chinamillwardbrown.cn"+srcend;
			fullsrc=STOCKURL+imgsrc;
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
 	 