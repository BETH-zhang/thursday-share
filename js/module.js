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
					fillText: '',
					position: [50, 420]
				},
				subTitle: {
					type: 'text',
					fillStyle: '#000',
					font: '24px Microsoft YaHei',
					fillText: '',
					position: [50, 460]
				},
				mc: {
					type: 'text',
					fillStyle: '#000',
					font: '16px Microsoft YaHei',
					text: '',
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
					text: '',
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
		var __CONFIG__ = $.extend({}, defaultConfig, config)

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
				console.log(oCanvas, oCtx, data, '===', __CONFIG__)
				oCanvas.width = __CONFIG__.width;
				oCanvas.height = __CONFIG__.height;
				var iWidth = oCanvas.width;
				var iHeight = oCanvas.height;
				oCtx.fillStyle = __CONFIG__.backgroundColor;
				oCtx.fillRect(...__CONFIG__.position,iWidth,iHeight);

				for (var item in __CONFIG__.data) {
					this.initTemplate(__CONFIG__.data[item], data[item]);
				}	
			},
			initTemplate: function(config, data) {
				console.log(config, data)
				switch(config.type) {
					case 'image':
						this.drawImage(config, data)
						break;
					case 'rect':
						this.drawRect(config, data)
						break;
					case 'text':
						this.drawText(config, data)
						break;
					default:
						break;
				}
			},
			drawImage: function(config, data) {
				var image = new Image();
				// 图片必须的相同域名，如果是非本地的不能保存成功
				image.src = data || config.src;
				image.onload = function() {
					oCtx.drawImage(image, ...config.position, ...config.size);
				}
			},
			drawRect: function(config, data) {
				oCtx.fillStyle = config.fillStyle;
				oCtx.fillRect(...config.position, ...config.size);
			},
			drawText: function(config, data) {
				oCtx.fillStyle = config.fillStyle;
				oCtx.font = config.font;
				oCtx.fillText(data || config.text, ...config.position);
			},
		}
	}

 	// 模块驱动的对象
 	var __DRIVER__ = this[f] = {
 		init: function(meta, config) {
 			// 初始化
			this.meta = meta;
			this.config = config;
			console.log(2, meta, config)
 			// 加载数据
			this.load();
 		},
 		load: function() {
			console.log(3, this.meta, this.config)
			// 重组数据
			this.config = $.extend({}, __MODULE__, this.config);
 			// 分析填充数据
 			this.fetch();
 			// 驱动模块更新视图
 			this.refresh();
 		},
 		fetch: function() {
			console.log(this)
 			for (var module in this.config) {
				console.log(this)
				this.config[module].data = this.meta[module];
 			}
 		},
 		refresh: function() {
			console.log("refresh", this.config);
 			for (var module in this.config) {
				// 利用数据劫持去优化，数据没有修改的对象不进行view渲染
				if (
					typeof this.config[module].refresh === 'function' &&
					this.config[module].refresh instanceof Function
				) {
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
			 canvas().init(data);
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