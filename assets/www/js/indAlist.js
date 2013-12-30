// JavaScript Document

var selectNum = Array();    //当前类查询次数

/* 
 * 查看单独类别,列表页和内容页功能有差别
 * @classId {String} 查看的类别
 */
function newsList(classId) {
    viewClass = classId;	
	$(".nav li span").removeClass("selbo");
	if(viewClass==7){
		//$("#82 span").addClass("selbo");
		$("#7 span").addClass("selbo");
	}else if(viewClass==8){
		//$("#83 span").addClass("selbo");
		$("#8 span").addClass("selbo");
	}else if(viewClass==9){
		//$("#84 span").addClass("selbo");
		$("#9 span").addClass("selbo");
	}//else if(viewClass==85){
	//	$("#85 span").addClass("selbo");
	//}
	else if(viewClass==86){
		$("#86 span").addClass("selbo");
	}else if(viewClass==87){
		$("#87 span").addClass("selbo");
	}else if(viewClass==88){
		$("#88 span").addClass("selbo");
	}else if(viewClass==89){
		$("#89 span").addClass("selbo");
	}else if(viewClass==90){
		$("#90 span").addClass("selbo");
	}else if(viewClass==91){
		$("#91 span").addClass("selbo");
	}else if(viewClass==92){
		$("#92 span").addClass("selbo");
	}
	window.localStorage.setItem("viewClass",viewClass);
    document.getElementById('thelist').innerHTML = "<div id='nowloading'><img src='style/style1/imgs/loading.gif'></div>";
	$("#more").css("display","none");
	document.getElementById('more').className = classId;
	selectNum["vm" + window.localStorage.getItem('mode') + "vc" + viewClass] = 1;	
    obtainData();
}
/* 载入数据 step1 */
function obtainData(){
    var viewMode = window.localStorage.getItem('mode');
	var viewClass = window.localStorage.getItem('viewClass');
    if(viewMode == 1){
		var startnum = firstRowFun(viewClass);
        //var parameter = {enews: 'list', category: viewClass, start: startnum, length: listRows};
        var parameter = {reqtype: viewClass, start: startnum, length: listRows};
        sentAllArticlesRequest(PHPURL,'onLineJsonp',parameter);
    } else {
        var classIdstr = '';
        if(viewClass == 7){
            classIdstr = "8,10";
        }else if(viewClass == 2){
            classIdstr = "3,4,5,6,29,39";
        }else if(viewClass == 12){
            classIdstr = "13,14,15,26,40,42";
        }else if(viewClass == 16){
            classIdstr = "17,18,19,28,32,33";
        }else{
			classIdstr = viewClass;
		}
        var sqlWhere = " where classid in("+ classIdstr +") order by newstime desc limit "+ firstRowFun(viewClass) +","+ listRows;
        ap.dbFindAll(DBNAME, findAllCB, '*', sqlWhere);
    }
}

/* step1-1
 * @dataJson {Object} json格式的数据
 */
function onLineJsonp(dataJson) {
    if (dataJson.articles) {
        showDataList(dataJson.articles);     //显示信息
        for (var i in dataJson.articles) {   //插入数据库信息
            ap.dbInsert(DBNAME, dataJson.articles[i],"");
        }
    } else {
        navigator.notification.alert("该栏目暂时没有信息", "", "提示", "");
    }  
}
/*
 * 显示数据列表 step2
 * @result {Object} 需要显示的结果
 * @isJson {Integer} 0: Json数据 1: SQLResultSet数据
 */
function showDataList(result,isJson) {
    var isJson = isJson || 0; //0 是json格式 ,1 不是
    if(isJson == 1){
        var result = pushJson(result);
    }
    var mainUlHtml = '';
    for (var i = 0; i < result.length; i++) {
        mainUlHtml +=
                '<li><a href="content.html" onclick="mainLiClick(' + result[i].id + ')">' +
                '<h4>' + result[i].title + '</h4>' +
                '<p class="main-smalltext">' + result[i].shortContent.substr(0,50) + '</p>' +
                '<p class="main-time">时间:' + result[i].modifyTime + '</p>' +
				//'<p class="main-time" style="display:none">' + result[i].newstimeNum + '</p>' +
                "</a></li>";
    }
	$('#nowloading').remove();
	$("#more").css("display","block"); 
    document.getElementById('thelist').innerHTML += mainUlHtml;
    selectNum['vm' + window.localStorage.getItem('mode') + "vc" + viewClass]++;
	setTimeout(function (){myScroll.refresh();},500);
}

/*
 * 查询本地数据库的返回函数 step1-2
 * @result {Object} 查询结果
 */
function findAllCB(result){
    if (result.rows.length == 0) {
		navigator.notification.alert("暂时缺少离线信息", "", "提示", "");
    } else {
        showDataList(result,1);
    }
}

//refresh增加更新信息
function addDataList(result,isJson) {
    var isJson = isJson || 0; //0 是json格式 ,1 不是
    if(isJson == 1){
        var result = pushJson(result);
    }
    var mainUlHtml = '';
    for (var i = 0; i < result.length; i++) {
        mainUlHtml +=
                '<li><a href="content.html" onclick="mainLiClick(' + result[i].id + ')">' +
                '<h4>' + result[i].title + '</h4>' +
                '<p class="main-smalltext">' + result[i].smalltext + '</p>' +
                '<p class="main-time">时间:' + result[i].newstime + '</p>' +
				'<p class="main-time" style="display:none">' + result[i].newstimeNum + '</p>' +
                "</a></li>";
    }
	$('#nowloading').remove();
	$("#more").css("display","block"); 
    document.getElementById('thelist').innerHTML = mainUlHtml+document.getElementById('thelist').innerHTML;
    if(contAction == 1){
        selectNum['vm' + window.localStorage.getItem('mode') + "vc" + viewClass]++;
    }
	setTimeout(function (){myScroll.refresh();},500);
}
/*--------------------------------------以下是功能函数，不参与预加载-------------------------------------------------*/
/*
 * 计算从多少条开始
 * @vClass {String} 当前查看的栏目类别 例: 'index'、'20'、'21' 、'22' 、'23'  
 */
function firstRowFun(vClass){
    firstRow = listRows * (selectNum["vm" + window.localStorage.getItem('mode') + "vc" + vClass] - 1);
    return firstRow;
}

/*
 * 查看更多
 */
function obtainMore(obj){
    viewClass = obj.className;
    obtainData();
}

//记录本条文章ID
function mainLiClick(id) {
    window.localStorage.setItem("id", id);
}

//更新信息到页面的上边
function refreshJsonp(dataJson) {
	if (dataJson.articles!=''){
		addDataList(dataJson.articles);      //先显示出来信息
		for (var i in dataJson.articles) {   //在插入数据库信息
			ap.dbInsert(DBNAME, dataJson.articles[i],msg);
		}
	}
}
