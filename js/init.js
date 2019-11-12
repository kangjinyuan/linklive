var windowWidth, windowHeight;
$(function() {
	param.communityName = "";
	param.timestamp = "";
	param.currentTime = "";
	param.accountName = accountInfo.name;
	param.menuSwitch = true;
	loadVue(param);
	loadData();
	loadTime();
	resetSize();
})

window.onresize = function() {
	resetSize();
}

function resetSize() {
	windowWidth = $(document).width();
	windowHeight = $(document).height();
	var menuSwitch = setData.menuSwitch;
	if(menuSwitch) {
		$(".kjy-left-box").width(250);
		$(".kjy-right-box").width(windowWidth - 250);
	} else {
		$(".kjy-left-box").width(80);
		$(".kjy-right-box").width(windowWidth - 80);
	}
	$(".layui-tab-content").height(windowHeight - 100);
	$(".nav-box").height(windowHeight - 80);
}

function closeAllNav() {
	$(".layui-nav-tree li").removeClass("layui-nav-itemed");
	$("layui-nav-tree .layui-nav-child").hide();
}

function showChildMenu(event) {
	var ev = event.currentTarget;
	closeAllNav();
	$(ev).siblings("a").eq(0).click();
}

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
			var dataList = res;
			var privillege = accountInfo.privillege;
			for(var i = 0; i < dataList.length; i++) {
				dataList[i].csub = [];
				for(var j = 0; j < privillege.length; j++) {
					if(dataList[i].id == privillege[j].serviceType) {
						dataList[i].csub.push(privillege[j]);
					}
				}
			}
			setData.dataList = dataList;
			setData.communityName = communityInfo.name;
			setData.timestamp = timestamp;
			nextTick(function() {
				setnav();
			})
		});
	}
}

//加载当前时间
function loadTime() {
	var loadTime = setInterval(function() {
		var checkI = judeToken();
		if(checkI == true) {
			var date = new Date();
			setData.currentTime = resetTime(date, 0);
		}
	}, 1000);
}

//关闭展开菜单
function menuSwitch(t) {
	var menuSwitch = setData.menuSwitch;
	setData.menuSwitch = !menuSwitch;
	closeAllNav();
	resetSize();
}