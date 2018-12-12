var ruleObj = {
	host: '',
	ruleData: [],
	alreadyDiv: $("#already"),
	msg: '操作成功！',
	init: function() {
		var that = this;
		chrome.tabs.getSelected(null, function (tab) {
			var u = new URL(tab.url);
			that.host = u.hostname;// 获取host
			// 因为是异步 所以要放这里边。
			chrome.storage.sync.get(that.host, function(data) {
			     if (data[that.host] != undefined) {
			     	var eleArr = data[that.host]; // 获取要删除的元素数组
					that.ruleData = eleArr;
			     	that.render(); // 渲染数据
			     }
			});
		});
	},
	saveData: function() {
		var that = this;
		var obj = {};
		obj[that.host] = that.ruleData;
		chrome.storage.sync.set(obj, function() {
			var statusSpan = $("#status");
			statusSpan.html(that.msg);
			setTimeout(() => {statusSpan.html('');}, 800);
			pageObj.refresh();
		});
	},
	reloadRender: function() {
		this.alreadyDiv.empty();
		this.render();
	},
	render: function() {
		var that = this;
		this.ruleData.forEach(function(v,k) {
			var statusDesc = v.is_enable == 0 ? "启用": "禁用";
			that.alreadyDiv.append("<p><input type='text' id='rule"+k+"' value='"+v.rule+"' /><button class='update' data-index='"+k+"'>更新</button><button class='delete' data-index='"+k+"'>删除</button><button class='is_enable' data-index='"+k+"'>"+statusDesc+"</button></p>");
		})
	}
};
var pageObj = {
	refresh: function() {
		chrome.tabs.getSelected(null, function(tab) {
		  var code = 'window.location.reload();';
		  chrome.tabs.executeScript(tab.id, {code: code});
		});
	}
}

ruleObj.init();
ruleObj.render();

$("#already").on("click", ".update", e => {
	var index = $(e.target).data("index");
	var rule = $("#rule"+index).val();
	if (rule.length == 0) {
		return false;
	}
	ruleObj.ruleData[index].rule = rule;
	ruleObj.saveData(); 

})
$("#already").on("click", ".delete", e => {
	var index = $(e.target).data("index");
	ruleObj.ruleData.splice(index, 1);
	ruleObj.reloadRender()
	ruleObj.saveData();
})

$("#already").on("click", ".is_enable", e => {
	var index = $(e.target).data("index");
	var rule = $("#rule"+index).val();
	if (rule.length == 0) {
		return false;
	}
	ruleObj.ruleData[index].is_enable = ruleObj.ruleData[index].is_enable ? 0 : 1;
	ruleObj.saveData(); 
})

$("#add").click(e => {
	var rule = $("#rule").val();
	if (rule.length == 0) {
		return false;
	}
	$("#rule").val('');
	var ruleJson = {
		rule: rule,
		is_enable: 1
	}
	ruleObj.ruleData.push(ruleJson);
	ruleObj.reloadRender();
	ruleObj.saveData()
});
