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
		 },
		 isFunction: function(value) {
			 return typeof value === 'function' &&
			        value instanceof Function
		 },
		 objectKeys: function(obj) {
			 const ary = [];
			 for (var key in obj) {
				ary.push(key);
			 }
			 return ary;
		 }
	};
	
	// 定义画布函数
	var canvas = function(config) {
		var defaultConfig = {
			width: 500,
			height: 610,
			backgroundColor: '#fff',
			position: [0, 0],
			data: {
				logo: {
					type: 'image',
					src: `${window.location.origin}/images/logo.png`,
					position: [50, 30],
					size: [110, 40],
				},
				bg: {
					type: 'rect',
					fillStyle: '#f2f2f2',
					position: [48, 88],
					size: [404, 274],
				},
				cover: {
					type: 'image',
					position: [50, 90],
					size: [400, 270],	
				},
				title: {
					type: 'text',
					fillStyle: '#405aa5',
					font: '33px Microsoft YaHei',
					position: [50, 420]
				},
				subTitle: {
					type: 'text',
					fillStyle: '#000',
					font: '24px Microsoft YaHei',
					position: [50, 460]
				},
				mc: {
					type: 'text',
					fillStyle: '#000',
					font: '16px Microsoft YaHei',
					position: [50, 500]
				},
				icon: {
					type: 'image',
					src: `${window.location.origin}/images/icon.png`,
					position: [50, 520],
					size: [20, 35],
				},
				schedule: {
					type: 'text',
					fillStyle: '#000',
					font: '14px Microsoft YaHei',
					position: [80, 533]
				},
				address: {
					type: 'text',
					fillStyle: '#000',
					font: '14px Microsoft YaHei',
					text: '海淀区大柳树富海大厦2号楼1102  Tad会议室',
					position: [80, 554]
				}	
			}
		};
		console.log(config, $.extend({}, { name: 1, age: 2 }, { age: 3 }))
		var __CONFIG__ = $.extend({}, defaultConfig, config)
		console.log(__CONFIG__, '00')

		// 初始化
		var savepngbtn = document.getElementById("savepngbtn");
		var savebmpbtn = document.getElementById("savebmpbtn");
		var savejpegbtn = document.getElementById("savejpegbtn");
		var changeCanvasBtn = document.getElementById("changeCanvas");
		var lineTool = document.getElementById("lineTool");
		var moveTool = document.getElementById("moveTool");
	
		// 画图的状态
		var bMouseIsDown = false;

		// 初始化canvas的状态
    var oCanvas = document.getElementById("mycanvas");
		var oCtx = oCanvas.getContext("2d");
		
		return {
			init: function(data) {
				var self = this;
				oCanvas.width = __CONFIG__.width;
				oCanvas.height = __CONFIG__.height;
				var iWidth = oCanvas.width;
				var iHeight = oCanvas.height;
				oCtx.fillStyle = __CONFIG__.backgroundColor;
				oCtx.fillRect(...__CONFIG__.position,iWidth,iHeight);

				// 递归调用解决同步问题
				const configData = common.objectKeys(__CONFIG__.data);
				const configDataCount = configData.length;
				this.recursionAsync(configDataCount, __CONFIG__.data, data)
				function showTime(count) {
					console.log("count is : ", count);
					if (count == 0) {
							console.log("All is Done!");
					} else {
							count -= 1;
							setTimeout(function() {
									showTime(count);
							}, 1000);
					}
				}
				// 使用async、await实现
			},
			recursionAsync: function(count, config, data) {
				const self = this;
				console.log(count)
				if (count === 0) {
					console.log('All is Done!');
				}	else {
					count -= 1;
					const configData = common.objectKeys(config);
					const configDataCount = configData.length;
					const key = configData[configDataCount - 1 - count];
					console.log(key, '---:key:');
					this.initTemplate(config[key], data[key], function() {
						self.recursionAsync(count, config, data);
					})
				}
			},
			initTemplate: function(config, data, callback) {
				switch(config.type) {
					case 'image':
						this.drawImage(config, data, callback)
						break;
					case 'rect':
						this.drawRect(config, data, callback)
						break;
					case 'text':
						this.drawText(config, data, callback)
						break;
					default:
						if (common.isFunction(callback)) {
							callback()
						}	
						break;
				}
			},
			drawImage: function(config, data, callback) {
				var image = new Image();
				// 图片必须的相同域名，如果是非本地的不能保存成功
				image.src = data || config.src;
				console.log(image.src, '====img====');
				image.onload = function() {
					oCtx.drawImage(image, ...config.position, ...config.size);
					if (common.isFunction(callback)) {
						callback()
					}
				}
				console.log(image.complete, '图片加载完成')
			},
			drawRect: function(config, data, callback) {
				oCtx.fillStyle = config.fillStyle;
				oCtx.fillRect(...config.position, ...config.size);
				if (common.isFunction(callback)) {
					callback()
				}
			},
			drawText: function(config, data, callback) {
				oCtx.fillStyle = config.fillStyle;
				oCtx.font = config.font;
				oCtx.fillText(data || config.text, ...config.position);
				if (common.isFunction(callback)) {
					callback()
				}
			},
		}
	}

 	// 模块驱动的对象
 	var __DRIVER__ = this[f] = {
 		init: function({ data, config, template }) {
 			// 初始化
			this.meta = data;
			this.config = config;
			this.template = template;
 			// 加载数据
			this.load();
 		},
 		load: function() {
			// 重组数据
			this.config = $.extend({}, __MODULE__, this.config);
 			// 分析填充数据
 			this.fetch();
 			// 驱动模块更新视图
 			this.refresh();
 		},
 		fetch: function() {
 			for (var module in this.config) {
				this.config[module].data = this.meta[module];
 			}
 		},
 		refresh: function() {
 			for (var module in this.config) {
				// 利用数据劫持去优化，数据没有修改的对象不进行view渲染
				if (common.isFunction(this.config[module].refresh)) {
					this.config[module].refresh(); // 渲染模块
				}
 			}
		 },
		 // 更新store数据
		 update(data) {
				console.log(this.meta, this.config, data, '000')
				this.meta = $.extend({}, this.meta, data);
				this.load();
		 },
		 // 对外直接暴露修改canvas的接口
		 initCanves: function(data) {
			 console.log(this.template, '===', this)
			 canvas(this.template).init(data);
		 },
	 };
	 $.extend(__DRIVER__, common);

 	// 模块引擎
 	var __MODULE__ = {
 		"detail": {
 			"view": undefined,
 			"data": undefined,
 			"refresh": function() {
				 console.log('detail', this.data)
				 __DRIVER__.initCanves(this.data)
 			}
 		},
 		"list": {
 			"view": $("#shareList"),
 			"data": undefined,
 			"refresh": function() {
				console.log('---list渲染---')
 				var self = this;
				var eleDiv = [];
			    this.data.forEach(function(item, index) {
			      eleDiv.push(`<li>${item}<button class='btn btn-primary createImg' key='${index}'>生成图片</button></li>`);
			    });
			    this.view.html(eleDiv.join(""));
			    var $btn = $(".createImg");
			    $btn.bind("click", function() {
			      var btnIndex = $(this).attr("key");
			      var detail = {};
			      if (self.data[btnIndex]) {
				      detail = __DRIVER__.formateDetail(self.data[btnIndex]);
			      }
			      console.log('current-detail', detail)
			      __DRIVER__.initCanves(detail)
			    });
 			}
 		},
 	};

 	return this[f];
 }, "ModuleDriver")