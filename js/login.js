$(function() {
	//确定按钮点击登录
	$("#login_btn").click(function() {
		login();
	});
})

//键盘enter键敲击登录
window.onkeydown = function(ev) {
	var ev = ev || window.event;
	if(ev.keyCode == 13) {
		login();
	};
}

//验证码登录
function createCode() {
	code = new Array();
	var codeLength = 4; //验证码的长度
	var checkCode = document.getElementById("checkCode");
	var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
	for(var i = 0; i < codeLength; i++) {
		var charIndex = Math.floor(Math.random() * 32);
		code += selectChar[charIndex];
	}
	if(code.length != codeLength) {
		createCode();
	}
	checkCode.innerHTML = code;
	$("#validate").val("");
}

var code; //在全局 定义验证码
//登录方法
function login() {
	var timestamp = new Date().getTime();
	var inputCode = $("#validate").val().toUpperCase();
	if(inputCode.length <= 0) {
		layer.msg("请输入验证码！");
		return false;
	}
	if(inputCode != code) {
		layer.msg("验证码输入错误！");
		createCode();
		return false;
	}
	var param = {
		account: $('#username').val(),
		password: $("#password").val()
	}
	request('POST', '/account/administrator/login.do', param, true, function(res) {
		window.localStorage.setItem("accessToken", res.accessToken);
		if(res.data.privillege == "") {
			layer.msg("登录失败，请检查网络或重试");
			return false;
		}
		var p = JSON.parse(res.data.privillege);
		p.sort(resetSort("sort", 1));
		for(var i = 0; i < p.length; i++) {
			if(p[i].checked == false) {
				p.splice(i--, 1);
			} else {
				var pcsub = p[i].csub;
				pcsub = pcsub.sort(resetSort("sort", 1));
				for(var a = 0; a < pcsub.length; a++) {
					if(pcsub[a].checked == false) {
						pcsub.splice(a--, 1);
					} else {
						if(res.data.su == 0) {
							if(pcsub[a].title == "角色管理" && pcsub.length > 1) {
								pcsub.splice(a--, 1);
							} else if(pcsub[a].title == "角色管理" && pcsub.length <= 1) {
								p.splice(i--, 1);
							}
						}
					}
					if(pcsub.length == 0) {
						p.splice(i--, 1);
					}
				}
			}
		}
		res.data.privillege = p;
		if(accountInfo) {
			if($('#username').val() != accountInfo.account || host != localHost) {
				window.localStorage.setItem("communityInfo", "");
			}
		}
		window.localStorage.setItem("accountInfo", JSON.stringify(res.data));
		window.localStorage.setItem("localHost", host);
		window.location.href = "main.html?timestamp=" + timestamp;
	}, function(res) {
		if(res.code == "0005") {
			layer.msg("您的用户名或密码不正确");
		} else {
			layer.msg("登录失败，请检查网络或重试");
		}
	})
}