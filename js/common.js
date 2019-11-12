//登录返回的accessToken令牌
var localHost = window.localStorage.getItem("localHost");
var accessToken = window.localStorage.getItem("accessToken");
var accountInfo = window.localStorage.getItem("accountInfo") ? JSON.parse(window.localStorage.getItem("accountInfo")) : getQueryString("accountInfo");
var communityInfo = window.localStorage.getItem("communityInfo") ? JSON.parse(window.localStorage.getItem("communityInfo")) : getQueryString("communityInfo");

//	数字正则表达式
var regular_num = /^[0-9.-]*$/;

//	手机正则表达式
var regular_phone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

//	密码号正则表达式
var regular_password = /^[A-Za-z0-9]{4,16}$/;

//	邮箱正则表达式
var regular_email = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

//	身份证正则表达式
var regular_idNumber = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;

//	房屋地址
var regular_roomAddress = /^[0-9-]{7,11}$/;

//	code正则表达式
var regular_code = /^[A-Za-z0-9]*$/;

$(function() {
	if($(".kjy-box").hasClass("kjy-flex-box")) {
		var searchTextChild = $(".search-text").find(".search");
		var searchTextChildHeight = searchTextChild.outerHeight(true);
		var searchTimeChild = $(".search-time").find(".search");
		var searchTimeChildHeight = searchTimeChild.outerHeight(true);
		var searchTextChildRow = Math.ceil(searchTextChild.length / 4);
		var searchTimeChildRow = Math.ceil(searchTimeChild.length / 3);
		$(".search-text").height(searchTextChildRow * searchTextChildHeight);
		$(".search-time").height(searchTimeChildRow * searchTimeChildHeight);
	}
})

//刷新页面
function reloadPage() {
	window.location.reload();
}

var setData;
var index = parent.layer.getFrameIndex(window.name);

//初始化vue
var param = {
	parentData: "",
	dataList: [],
	allisActive: false,
	totalPage: 0,
	pageSize: 0,
	currentPage: 0,
	count: 0,
	dataLength: 0,
	su: accountInfo.su
}

function nextTick(callback) {
	Vue.nextTick(function() {
		callback();
	});
}

//格式化时间
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//判断时间是否为字符串
function judeDate(date) {
	if(typeof(date) == "string") {
		date = date.substring(0, 19);
		date = date.replace(/-/g, '/');
	}
	date = new Date(date);
	return date;
}

//转换yy-mm-dd hh-mm-ss，0精确到秒，1精确到分，2精确到时，3精确到日，4精确到月，5精确到年
function resetTime(date, flag) {
	if(date) {
		date = judeDate(date);
		if(flag == 0) {
			return date.Format("yyyy-MM-dd hh:mm:ss");
		} else if(flag == 1) {
			return date.Format("yyyy-MM-dd hh:mm");
		} else if(flag == 2) {
			return date.Format("yyyy-MM-dd hh");
		} else if(flag == 3) {
			return date.Format("yyyy-MM-dd");
		} else if(flag == 4) {
			return date.Format("yyyy-MM");
		} else if(flag == 5) {
			return date.Format("yyyy");
		} else if(flag == 6) {
			return date.Format("yyyy年MM月dd日 hh时mm分ss");
		} else if(flag == 7) {
			return date.Format("yyyy年MM月dd日 hh时mm分");
		} else if(flag == 8) {
			return date.Format("yyyy年MM月dd日 hh时");
		} else if(flag == 9) {
			return date.Format("yyyy年MM月dd日");
		} else if(flag == 10) {
			return date.Format("yyyy年MM月");
		} else if(flag == 11) {
			return date.Format("yyyy年");
		} else if(flag == 12) {
			return date.Format("MM-dd");
		} else if(flag == 13) {
			return date.Format("hh:mm:ss");
		} else if(flag == 14) {
			return date.Format("yyyyMMddhhmmss");
		} else if(flag == 15) {
			return date.Format("yyyyMMdd");
		} else if(flag == 16) {
			return date.Format("hh:mm");
		}
	} else {
		return "";
	}
}

function resetTimeStamp(date) {
	date = judeDate(date);
	date = new Date(date).getTime();
	return date;
}

function resetEndTime(newDate, type) {
	newDate = resetTimeStamp(newDate);
	var date;
	if(type == 0) {
		date = newDate + 24 * 60 * 60 * 1000;
	} else if(type == 1) {
		date = newDate + 24 * 60 * 60 * 1000 - 1;
	}
	return date;
}

function getAppointDate(number, type) {
	var dateArray = [],
		curreDate = new Date().getTime(),
		constant = 24 * 60 * 60 * 1000;
	for(var i = 0; i < number; i++) {
		if(type == 0) {
			var time = resetTime(curreDate - (constant * (i + 1)), 12);
			dateArray.unshift(time);
		} else if(type == 1) {
			var time = resetTime(curreDate + (constant * (i + 1)), 12);
			dateArray.push(time);
		}
	}
	return dateArray
}

function loadVue(param) {
	setData = new Vue({
		el: '.VDOM',
		data: param,
		filters: {
			resetTime: function(time, flag) {
				if(time == null) {
					return "";
				} else {
					return resetTime(time, flag);
				}
			}
		}
	})
}

//公共请求方法
//method 请求方式
//requestUrl 请求地址
//isPage 请求是否设置翻页
//param 参数
//okCallback 成功回调
//noCallback 失败回调
function request(method, requestUrl, param, showLoading, okCallback, noCallback) {
	if(param.page) {
		var isPage = true;
	} else {
		var isPage = false;
	}
	if(method == "POST") {
		param.accessToken = accessToken;
		if(accountInfo) {
			var pmcId = getQueryString("pmcId");
			if(pmcId) {
				param.pmcId = pmcId;
			} else {
				param.pmcId = accountInfo.pmcId;
			}
		}
		if(communityInfo) {
			param.communityId = communityInfo.id;
			param.communityName = communityInfo.name
		}
		param = JSON.stringify(param);
	}
	var timestamp = new Date().getTime();
	if(showLoading == true) {
		var loadding = layer.load(1, {
			shade: [0.2, '#fafafa'],
			area: ['37px', '37px']
		});
	}
	if(requestUrl.indexOf("?") > 0) {
		requestUrl = requestUrl + "&timestamp=" + timestamp;
	} else {
		requestUrl = requestUrl + "?timestamp=" + timestamp;
	}
	$.ajax({
		type: method,
		url: url + requestUrl,
		contentType: "application/json;charset=UTF-8",
		data: param,
		dataType: 'json',
		success: function(res) {
			if(res.code == "0000") {
				okCallback(res);
			} else if(res.code == "0007" || res.code == "0006") {
				window.localStorage.setItem("accessToken", "");
				top.location.href = host + "/linklive/login.html";
			} else if(res.code == "0008") {
				layer.msg("服务器内部错误");
			} else if(res.code == "0400") {
				layer.msg("服务达到上限，如想创建请联系闪向");
			} else if(res.code == "0500") {
				layer.msg("第三方关联楼宇房屋错误，请联系闪向");
			} else if(res.code == "0501") {
				layer.msg("第三方关联楼宇单元错误，请联系闪向");
			} else if(res.code == "0502") {
				layer.msg("第三方关联小区错误，请联系闪向");
			} else {
				noCallback(res);
			}
			if(isPage == true) {
				idList = [];
				setData.dataLength = res.data.length;
				setData.totalPage = res.totalPage;
				setData.pageSize = res.pageSize;
				setData.currentPage = res.currentPage;
				setData.count = res.count;
			}
			if(showLoading == true) {
				layer.closeAll('loading');
			}
		},
		error: function(res) {
			if(res.status == '401' || res.status == '402' || res.status == '403' || res.status == '404' || res.status == '405' || res.status == '407' || res.status == '413' || res.status == '414' || res.status == '415' || res.status == '500' || res.status == '502' || res.status == '503' || res.status == '504' || res.status == '505') {
				window.location.href = host + '/linklive/part/err.html';
			}
		}
	});
}

function hikRequest(method, requestUrl, param, showLoading, okCallback, noCallback) {
	if(param.pageNo) {
		var isPage = true;
	} else {
		var isPage = false;
	}
	if(method == "POST") {
		param = JSON.stringify(param);
	}
	var timestamp = new Date().getTime();
	if(showLoading == true) {
		var loadding = layer.load(1, {
			shade: [0.2, '#fafafa'],
			area: ['37px', '37px']
		});
	}
	$.ajax({
		type: method,
		url: requestUrl + "?timestamp=" + timestamp,
		contentType: "application/json;charset=UTF-8",
		data: param,
		dataType: 'json',
		success: function(res) {
			if(res.code == "0") {
				okCallback(res);
			} else {
				noCallback(res);
			}
			if(isPage == true) {
				idList = [];
				var dataInfo = res.data;
				setData.dataLength = dataInfo.list.length;
				if(dataInfo.totalPage) {
					setData.totalPage = dataInfo.totalPage;
				}
				setData.pageSize = dataInfo.pageSize;
				setData.currentPage = dataInfo.pageNo;
				setData.count = dataInfo.total;
			}
			if(showLoading == true) {
				layer.closeAll('loading');
			}
		},
		error: function(res) {
			if(res.status == '401' || res.status == '402' || res.status == '403' || res.status == '404' || res.status == '405' || res.status == '407' || res.status == '413' || res.status == '414' || res.status == '415' || res.status == '500' || res.status == '502' || res.status == '503' || res.status == '504' || res.status == '505') {
				window.location.href = host + '/linklive/part/err.html';
			}
		}
	});
}

function hikLogin(callback) {
	var param = {
		username: "admin",
		password: $.md5("admin")
	}
	hikRequest("GET", "/api/v1/login", param, true, function(res) {
		callback();
	}, function(res) {
		layer.msg("获取外网token失败");
	});
}

//加载全屏模板
function loadPart(url, dom, callback) {
	var timestamp = new Date().getTime();
	$.ajax({
		type: "GET",
		url: url + '.html?timestamp=' + timestamp,
		dataType: "html",
		contentType: "application/json",
		success: function(res) {
			$(dom).append(res);
			callback(res);
		}
	});
}

function loadPage(type, callback) {
	if(type == 0) {
		var pageUrl = "../part/page";
	} else if(type == 1) {
		var pageUrl = "../part/smallPage";
	}
	loadPart(pageUrl, ".page-box", function(res) {
		loadVue(param);
		if(callback) {
			callback();
		}
	})
}

//判断是新建，编辑，查看，新建0，编辑1，查看2
function judeEdit(flag, layerDom) {
	if(flag == 0 || flag == 1) {
		layerDom.find(".mask-btn-box").show();
	} else if(flag == 2) {
		layerDom.find("input").attr("disabled", "disabled");
		layerDom.find("select").attr("disabled", "disabled");
		layerDom.find("textarea").attr("disabled", "disabled");
		layerDom.find(".mask-btn-box").hide();
		layerDom.find(".main-mask").removeClass("main-mask-bottom");
	}
}

//打开操作记录
function openLog(logType, title) {
	openMask(logType, "../pages/logMag", title, "100%", "100%", function(layerDom, layerIframe) {
		layerDom.find(".kjy-title-box").hide();
	})
}

//判断token过期跳转登录
function judeToken() {
	var accessToken = window.localStorage.getItem("accessToken");
	var localHost = window.localStorage.getItem("localHost");
	var accountInfo = JSON.parse(window.localStorage.getItem("accountInfo"));
	if(accessToken == "" || accessToken == null || accountInfo.pmcId == -1 || host != localHost) {
		quit();
		return false;
	}
	return true;
}

//批量删除
var idList = [];

//全选
function selectAllData() {
	if(setData.allisActive == true) {
		setData.allisActive = false;
		for(var i = 0; i < setData.dataList.length; i++) {
			setData.dataList[i].isActive = false;
		}
		idList = [];
	} else {
		setData.allisActive = true;
		for(var i = 0; i < setData.dataList.length; i++) {
			if(setData.dataList[i].isActive == false) {
				setData.dataList[i].isActive = true;
				idList.push(setData.dataList[i].id);
			}
		}
	}
}

//选择单条数据
function selectOneData(obj) {
	if(obj.isActive == true) {
		obj.isActive = false;
		idList.splice($.inArray(obj.id, idList), 1);
	} else {
		obj.isActive = true;
		idList.push(obj.id);
	}
	for(var i = 0; i < setData.dataList.length; i++) {
		if(setData.dataList[i].isActive == true) {
			setData.allisActive = true;
		} else {
			setData.allisActive = false;
			break;
		}
	}
}

//勾选checkbox选项
function setCheckBox(obj) {
	obj.checked = !obj.checked;
}

//弹框单选
var sInfo = "";

function tabData(obj) {
	for(var i = 0; i < setData.dataList.length; i++) {
		setData.dataList[i].isActive = false;
	}
	if(obj.isActive == true) {
		obj.isActive = false;
		sInfo = "";
	} else {
		obj.isActive = true;
		sInfo = obj;
	}
	if(window.setParentData) {
		setParentData();
	} else if(window.setOwnData) {
		setOwnData();
	}
}

//删除数据
function delData(confirmtext, callback) {
	if(idList.length == 0) {
		layer.msg("请选择要删除的数据");
	} else {
		layer.confirm(confirmtext, {
			btn: ['确定', '取消']
		}, function() {
			var param = {
				idList: idList
			}
			callback(param);
		}, function() {

		});
	}
}

//删除数据
function delOneData(id, confirmtext, callback) {
	layer.confirm(confirmtext, {
		btn: ['确定', '取消']
	}, function() {
		var idList = new Array();
		idList.push(id);
		var param = {
			idList: idList
		}
		callback(param);
	}, function() {

	});
}

//弹出框展示
function openMask(id, url, title, Wh, Hh, callback) {
	var timestamp = new Date().getTime();
	layer.open({
		type: 2,
		title: [title, 'font-weight:bold;font-size:16px;'],
		shadeClose: true,
		shade: 0.3,
		shift: 1,
		area: [Wh, Hh],
		content: url + ".html?timestamp=" + timestamp,
		success: function(layero, index) {
			var layerDom = $("#layui-layer-iframe" + index).contents().find("body");
			var layerIframe = $("#layui-layer-iframe" + index);
			layerDom.find(".main-mask").attr("data-id", id);
			layerDom.find(".main-mask input").val("");
			layerDom.find(".main-mask select").val("");
			layerDom.find(".main-mask textarea").val("");
			callback(layerDom, layerIframe);
		},
		end: function() {
			if(window.loadData) {
				if(setData.parentData) {
					loadData(setData.parentData);
				} else {
					loadData();
				}
			}
		}
	});
}

//置空新建
function resetValue() {
	$(".main-mask input").val("");
	$(".main-mask select").val("");
	$(".main-mask textarea").val("");
}

//退出
function quit() {
	var param = {};
	request("POST", "/account/administrator/logout.do", param, true, function(res) {
		window.location.href = "login.html?pmcId=" + accountInfo.pmcId;
	}, function(res) {
		layer.msg("退出失败");
	})
}

//获取地址栏参数
function getQueryString(key) {
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
}

//翻页
var page = 1;
var pageStart = 1;

//检索
function sreach() {
	page = 1;
	if(setData.parentData) {
		loadData(setData.parentData);
	} else {
		loadData();
	}
}

//首页
function firstPage() {
	page = 1;
	if(setData.totalPage <= 1) {
		layer.msg("页数已到最小");
		return false;
	}
	if(setData.parentData) {
		loadData(setData.parentData);
	} else {
		loadData();
	}
}

//末页
function lastPage() {
	page = setData.totalPage;
	if(page == setData.currentPage) {
		layer.msg("页数已到最大");
		return false;
	}
	if(setData.parentData) {
		loadData(setData.parentData);
	} else {
		loadData();
	}
}

//下一页
function nextPage() {
	page = setData.currentPage;
	page++;
	if(page > setData.totalPage) {
		page = setData.totalPage;
		layer.msg("页数已到最大");
		return false;
	}
	if(setData.parentData) {
		loadData(setData.parentData);
	} else {
		loadData();
	}
}

//上一页
function beforePage() {
	page = setData.currentPage;
	page--;
	if(page < 1) {
		page = 1;
		layer.msg("页数已到最小");
		return false;
	}
	if(setData.parentData) {
		loadData(setData.parentData);
	} else {
		loadData();
	}
}

//跳转页面
function jumpPage() {
	page = $(".page .page-input input").val();
	if(page == "") {
		layer.msg("请输入页数");
		return false;
	}
	if(page < 1) {
		layer.msg("页数不能小于1");
		return false;
	}
	if(page == 1) {
		layer.msg("页数已到最小");
		return false;
	}
	if(page > setData.totalPage) {
		layer.msg("页数不能大于总页数");
		return false;
	}
	if(setData.parentData) {
		loadData(setData.parentData);
	} else {
		loadData();
	}
}

//点击轮播点跳转页面
function clickJumpPage(pageNumber) {
	page = pageNumber;
	if(setData.parentData) {
		loadData(setData.parentData);
	} else {
		loadData();
	}
}

//时间控件
function setTime(dom, type) {
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: dom,
			type: type,
			trigger: 'click',
		});
	});
}

function setSlider(dom, step, callback) {
	layui.use('slider', function() {
		var $ = layui.$,
			slider = layui.slider;
		slider.render({
			elem: dom,
			step: step,
			showstep: true,
			theme: '#333',
			change: function(res) {
				if(callback) {
					callback(res);
				}
			}
		});
	})
}

//发送验证码
var tokentimer
var tt = 60;

function getTokentime(t) {
	var tokentimer = setInterval(function() {
		tt--;
		if(tt == 0) {
			tt = 60;
			$(t).html("重新发送");
			clearInterval(tokentimer);
		} else {
			$(t).html(tt + "S重新发送");
		}
	}, 1000);
}

//导出
function exportExcel(dom, columns, fileName) {
	dom.table2excel({
		exclude: ".noExl",
		name: "Excel Document Name",
		columns: columns,
		filename: fileName,
		exclude_img: true,
		exclude_links: true,
		exclude_inputs: true
	});
}

//系统通知
function sendInform(type, content) {
	layer.open({
		title: '系统通知',
		type: type,
		id: 'inform',
		area: ['300px', '300px'],
		offset: 'rb',
		content: content,
		shade: 0,
		shift: 2,
		yes: function() {}
	});
}

//关闭菜单栏
function closePage(li) {
	var tabId = self.frameElement.getAttribute('data-id');
	for(var i = 0; i < li.length; i++) {
		var liId = li.eq(i).attr("lay-id");
		var dom = li.eq(i).find(".layui-tab-close");
		if(tabId == liId) {
			dom.click();
		} else {
			parent.layer.close(index);
		}
	}
}

//打开菜单栏
function tabPage(id) {
	var a = $(".mainLeft", top.document).find("dd a");
	var li = $("#rightNav", top.document).find("li");
	var aids = [];
	for(var i = 0; i < a.length; i++) {
		var aid = a.eq(i).attr("data-id");
		aids.push(aid);
	}
	if($.inArray(id, aids) == -1) {
		layer.msg("关联功能权限未打开，此功能无法操作，请联系管理员", {
			time: 2000
		}, function() {
			closePage(li);
		});
	} else {
		for(var i = 0; i < a.length; i++) {
			var aid = a.eq(i).attr("data-id");
			if(id == aid) {
				a[i].click();
			}
		}
		closePage(li);
	}
}

//获取一个月多少天
function getCountDays() {
	var curDate = new Date();
	var curMonth = curDate.getMonth();
	curDate.setMonth(curMonth + 1);
	curDate.setDate(0);
	return curDate.getDate();
}

function judeImg(callback) {
	for(var i = 0; i < $("img").length; i++) {
		var imgDom = $("img").eq(i);
		if(imgDom.attr("src") == "../img/common/no-img.png") {
			imgDom.attr("src", "");
		}
	}
	callback();
}

//打印
function print(dom) {
	$.print("#" + dom);
}

//删除范围
function delRange(i) {
	setData.dataList.splice(i--, 1);
}

//排序
function resetSort(property, flag) {
	return function(a, b) {
		if(flag == 0) {
			// 越小越靠前
			return a[property] - b[property];
		} else if(flag == 1) {
			// 越大越靠前
			return b[property] - a[property];
		}
	}
}

//列表生成二维码
function makeScanCode(obj, text) {
	$(".scanCode" + obj.id + " a").empty();
	$(".scanCode" + obj.id + " a").qrcode({
		render: "canvas",
		text: text,
		width: "100", //二维码的宽度
		height: "100", //二维码的高度
		background: "#ffffff", //二维码的后景色
		foreground: "#000000", //二维码的前景色
	});
}

//下载二维码
function downloadScanCode(canvasDom, downloadDom) {
	var canvasDom = $('.' + canvasDom).find("canvas").get(0);
	var saveurl = canvasDom.toDataURL('image/png');
	$('.' + downloadDom).attr('href', saveurl);
	return false;
}

//无缝滚动
var seamlessRollingTimer = null;

function seamlessRolling(dom, maxLength) {
	var dataLength = dom.children().length;
	var H = dom.children().height();
	var i = 0;
	if(dataLength > maxLength) {
		dom.css("top", "0");
		clearInterval(seamlessRollingTimer);
		seamlessRollingTimer = setInterval(function() {
			i++;
			if(i > dataLength - maxLength) {
				i = 0;
				dom.css("top", "0");
			}
			dom.stop().animate({
				top: -H * i
			}, 2000);
		}, 4000);
	}
}

function bindWindowChange(callback) {
	$(window).resize(function() {
		callback();
	})
	$(window).ready(function() {
		callback();
	})
}

function getIndexArray(dataList, index, slotType) {
	var resArray = [];
	for(var i = 0; i < dataList.length; i++) {
		if(slotType == true) {
			resArray.push(dataList[i][index]);
		} else {
			resArray.unshift(dataList[i][index]);
		}
	}
	return resArray;
}

function getTotalFee(dataList) {
	var feeList = ["物业费", "水费", "电费", "车位管理费", "固定停车费", "临时停车费", "生活垃圾处理费", "储藏间管理费", "房租", "供暖费", "其他"];
	var feeName = [];
	var totalValue = [];
	for(var i = 0; i < feeList.length; i++) {
		for(var j = 0; j < dataList.length; j++) {
			if(dataList[j].feeName.indexOf(feeList[i]) > -1) {
				if($.inArray(feeList[i], feeName) == -1) {
					feeName.push(feeList[i]);
				}
			}
		}
	}

	for(var i = 0; i < feeName.length; i++) {
		var totalFee = 0;
		for(var j = 0; j < dataList.length; j++) {
			if(dataList[j].feeName.indexOf(feeName[i]) > -1) {
				totalFee += dataList[j].totalValue;
			}
		}
		totalValue.push(parseFloat(totalFee).toFixed(2));
	}

	var res = {
		feeName: feeName,
		totalValue: totalValue
	}
	return res;
}

//获取服务JSON
function getService(callback) {
	var timestamp = new Date().getTime();
	var requestUrl = host + "/linklive/json/service.json?timestamp=" + timestamp
	$.getJSON(requestUrl, function(res) {
		var serviceList = res;
		serviceList.sort(resetSort("sort", 1));
		callback(res);
	})
}

//正则验证
function checkInput() {
	//	必填
	for(var i = 0; i < $(".required").length; i++) {
		if($(".required").eq(i).val() == "") {
			var required = $(".required").eq(i).parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 为必填项 请核对");
			return false;
		}
	}

	//	图片必填
	for(var i = 0; i < $(".required-img").length; i++) {
		if($(".required-img").eq(i).attr("src") == "" || $(".required-img").eq(i).attr("src") == "../img/common/no-img.png") {
			var required = $(".required-img").eq(i).parent().parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 为必填项 请核对");
			return false;
		}
	}

	//	长度不超过15
	for(var i = 0; i < $(".len15").length; i++) {
		if($(".len15").eq(i).val().length > 15) {
			var required = $(".len15").eq(i).parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + "长度不能超过15");
			return false;
		}
	}

	//	长度不超过6
	for(var i = 0; i < $(".len6").length; i++) {
		if($(".len6").eq(i).val().length > 6) {
			var required = $(".len6").eq(i).parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + "长度不能超过6");
			return false;
		}
	}

	//	长度不超过30
	for(var i = 0; i < $(".len30").length; i++) {
		if($(".len30").eq(i).val().length > 30) {
			var required = $(".len30").eq(i).parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + "长度不能超过30");
			return false;
		}
	}

	//	长度不超过200
	for(var i = 0; i < $(".len200").length; i++) {
		if($(".len200").eq(i).val().length > 200) {
			var required = $(".len200").eq(i).parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + "长度不能超过200");
			return false;
		}
	}

	//	密码号为6位
	for(var i = 0; i < $(".pwd6").length; i++) {
		if($(".pwd6").eq(i).val().length != 6) {
			var required = $(".pwd6").eq(i).parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 长度为6位 请核对");
			return false;
		}
	}

	for(var i = 0; i < $(".num").length; i++) {
		if(!regular_num.test($(".num").eq(i).val())) {
			var required = $(".num").eq(i).parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	if($(".phone").val() != "" && $(".phone").val() != undefined) {
		if(!regular_phone.test($(".phone").val())) {
			var required = $(".phone").parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	for(var i = 0; i < $(".password").length; i++) {
		if(!regular_password.test($(".password").eq(i).val())) {
			var required = $(".password").eq(i).parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	if($(".email").val() != "" && $(".email").val() != undefined) {
		if(!regular_email.test($(".email").val())) {
			var required = $(".email").parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	if($(".id-number").val() != "" && $(".id-number").val() != undefined) {
		if(!regular_idNumber.test($(".id-number").val())) {
			var required = $(".id-number").parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	if($(".room-address").val() != "" && $(".room-address").val() != undefined) {
		if(!regular_roomAddress.test($(".room-address").val())) {
			var required = $(".room-address").parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}

	if($(".regular-code").val() != "" && $(".regular-code").val() != undefined) {
		if(!regular_code.test($(".regular-code").val())) {
			var required = $(".regular-code").parent().siblings(".mask-list-name").find(".text").text();
			layer.msg(required + " 格式错误 请核对");
			return false;
		}
	}
	return true;
}