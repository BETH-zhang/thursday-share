/**
 * 模块驱动架构
 */

 (function (global, factory, framework) {
 	return factory.call(global, global.jQuery, framework)
 })(this, function($, f) {
 	var common = {
 		formateDetail: function(data) {
 			var currentDataTmp = data.split("|");
		    var mc = currentDataTmp[0];
		    var title = currentDataTmp[1];
		    var subTitle = currentDataTmp[2];
		    var schedule = currentDataTmp[3];
		    var address = "海淀区大柳树富海大厦2号楼1102  Tad会议室";
		    return {
		    	mc: mc,
		    	title: title,
		    	subTitle: subTitle,
		    	schedule: schedule,
		    	address: address
		    }
 		}
 	};

 	// 模块驱动的对象
 	var __DRIVER__ = this[f] = {
 		init: function(meta) {
 			// 初始化
 			console.log(2, meta)
 			// 加载数据
 			this.load(meta);
 		},
 		load: function(meta) {
 			console.log(3, meta)
 			// 分析填充数据
 			this.fetch(meta);
 			// 驱动模块更新视图
 			this.refresh();
 		},
 		fetch: function(meta) {
 			for (var module in __MODULE__) {
 				__MODULE__[module].data = meta[module];
 			}
 		},
 		refresh: function() {
 			console.log("refresh", __MODULE__);
 			for (var module in __MODULE__) {
 				__MODULE__[module].refresh(); // 渲染模块
 			}
 		},
 		args: function() {
 			return $(this.form).serialize();
 		}
 	};

 	// 模块引擎
 	var __MODULE__ = {
 		"detail": {
 			"view": undefined,
 			"data": undefined,
 			"refresh": function() {
 				console.log('detail', this.data)
 			}
 		},
 		"list": {
 			"view": $("#shareList"),
 			"data": undefined,
 			"refresh": function() {
 				var self = this;
				var eleDiv = [];
			    this.data.forEach(function(item, index) {
			      eleDiv.push(`<li>${item}<button class='btn' key='${index}'>生成图片</button></li>`);
			    });
			    this.view.html(eleDiv.join(""));
			    var $btn = $(".btn");
			    $btn.bind("click", function() {
			      var btnIndex = $(this).attr("key");
			      var detail = {};
			      if (self.data[btnIndex]) {
				      detail = common.formateDetail(self.data[btnIndex]);
			      } else {
			      	  var inputs = $('.form-control');
			      	  Object.keys(inputs).forEach(function (item) {
			      	  	var input = inputs[item];
			      	  	if (typeof input === 'object' && $(input).attr('id')) {
			      	  		detail[$(input).attr('id')] = $(input).val();
			      	  	}
			      	  })
			      }
			      console.log('current-detail', detail)
			      // updateCanvas(btnIndex);
			    });
 			}
 		},
 	};

 	return this[f];
 }, "ModuleDriver")