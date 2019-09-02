$(function() {
	var WH = $(window).height();
	$(".main").height(WH - 40);
	$(".rightCon").height(WH - 100);
	$("#rightIframe").height(WH - 140);
	param.communityName = "";
	param.serviceList = [];
	param.serviceIndex = 0;
	param.timestamp = "";
	param.username = accountInfo.name;
	loadVue(param);
	loadData();
	loadTime($(".icon-time"));
})

//切换小区
function changeCommunity() {
	window.localStorage.setItem("communityInfo", "");
	top.window.location.reload();
}

//加载菜单数据
function loadData() {
	var timestamp = new Date().getTime();
	if(communityInfo == "" || communityInfo == null) {
		layer.open({
			type: 2,
			title: false,
			shadeClose: true,
			closeBtn: 0,
			shade: 1,
			area: ["100%", "100%"],
			content: "part/selectCommunity.html?timestamp=" + timestamp,
			success: function(layero, index) {
				var layerDom = $("#layui-layer-iframe" + index).contents().find("body");
			},
		});
	} else {
		getService(function(res) {
			var serviceList = res;
			var privillege = accountInfo.privillege;
			for(var i = 0; i < serviceList.length; i++) {
				serviceList[i].csub = [];
				for(var j = 0; j < privillege.length; j++) {
					if(serviceList[i].id == privillege[j].serviceType) {
						serviceList[i].csub.push(privillege[j]);
					}
				}
			}
			setData.serviceList = serviceList;
			setData.communityName = communityInfo.name;
			setData.timestamp = timestamp;
			resetDataList();
		});
	}
}

function resetDataList() {
	var serviceList = setData.serviceList;
	var serviceIndex = setData.serviceIndex;
	setData.dataList = serviceList[serviceIndex].csub;
	nextTick(function() {
		setnav();
		$(".layui-nav").find("dd").removeClass("layui-this");
		$(".layui-nav").find("li").addClass("layui-nav-itemed");
	})
}

function tabService(index) {
	setData.serviceIndex = index;
	resetDataList();
}

//加载当前时间
function loadTime(dom) {
	var loadTime = setInterval(function() {
		var checkI = judeToken();
		if(checkI == true) {
			var date = new Date();
			dom.text(resetTime(date, 0));
		}
	}, 1000);
}

function showMenu() {
	if($(".mainLeft").hasClass("hide-box") == true) {
		$(".mainLeft").removeClass("hide-box");
	} else {
		$(".mainLeft").addClass("hide-box");
	}
}

//关闭展开菜单
function menuSwitch(t) {
	if($(t).text() == "收起菜单") {
		$(t).addClass("icon-right").removeClass("icon-left");
		$(t).text("展开菜单");
		$(".mainRight").animate({
			width: '100%'
		}, 200);
		$(".mainLeft").css({
			'position': 'absolute',
			'zIndex': '9999'
		}).addClass("hide-box").removeClass("f_l");
		$(".icon-menu").removeClass("hide-box");
	} else {
		$(t).addClass("icon-left").removeClass("icon-right");
		$(t).text("收起菜单");
		$(".mainRight").animate({
			width: '85%'
		}, 100, function() {
			$(".mainLeft").css({
				'position': 'relative',
				'zIndex': '0'
			}).removeClass("hide-box").addClass("f_l");
			$(".icon-menu").addClass("hide-box");
		});
	}
}