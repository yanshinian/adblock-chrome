$(function() {
	var u = new URL(location.href);
	host = u.hostname;// 获取host
	// 加载设置
	chrome.storage.sync.get(host, function(data) {
		console.log(JSON.stringify(data))
		var eleArr = data[host]; // 获取要删除的元素数组
		if (data[host] != undefined) {
			eleArr.forEach(function(v,k) {
					console.log(v);
				if (v.is_enable === 1) {
					$(v.rule).remove();
				}
	  		})
		}
  	});
});