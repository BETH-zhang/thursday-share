/**
 * c2i 1.0.0-alpha
 * Copyright (c) 2018 Beth
 * ModuleDriver
 * depend on canvas2image.js
 */

 // webpack通用模块定义
 (function webpackUniversalModuleDefinition(global, factory, framework) {
	if (typeof exports === 'object' && typeof module === 'object') {
		// CMD
		console.log('cmd');
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		// AMD
		console.log('amd');
		define([], factory);
	} else if (typeof exports === 'object') {
		// Commonjs
		console.log('commonjs');
		exports[framework] = factory();
	} else {
		// Window
		console.log('window');
		global[framework] = factory.call(global, framework);
	}
 })(this, function(f) {
	var _logger = function(value) {
		console.log(value);
	}
	var _extends = Object.assign || function (target) {
		for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
								target[key] = source[key];
						}
				}
		}
		return target;
	};
	var _formateDetail = function(data) {
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
	};
	var _isFunction = function(value) {
		return typeof value === 'function' &&
					value instanceof Function
	};
	var _objectKeys = function(objs) {
		const ary = [];
		for (var key in objs) {
		ary.push(key);
		}
		return ary;
	}
	
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
		var __CONFIG__ = _extends({}, defaultConfig, config)

		// 初始化
		var savepngbtn = document.getElementById("savepngbtn");
		var savebmpbtn = document.getElementById("savebmpbtn");
		var savejpegbtn = document.getElementById("savejpegbtn");
	
		// 画图的状态
		// var bMouseIsDown = false;

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
				const configData = _objectKeys(__CONFIG__.data);
				const configDataCount = configData.length;
				this.recursionAsync(configDataCount, __CONFIG__.data, data)
				// 使用async、await实现

				// 初始化下载状态
				this.initSave();
			},
			initSave: function() {
				savepngbtn.onclick = function() {
					saveCanvas(oCanvas, "PNG");
				}
				savebmpbtn.onclick = function() {
					saveCanvas(oCanvas, "BMP");
				}
				savejpegbtn.onclick = function() {
					saveCanvas(oCanvas, "JPEG");
				}
			},
			recursionAsync: function(count, config, data) {
				const self = this;
				_logger(count)
				if (count === 0) {
					_logger('All is Done!');
				}	else {
					count -= 1;
					const configData = _objectKeys(config);
					const configDataCount = configData.length;
					const key = configData[configDataCount - 1 - count];
					_logger(key, '---:key:');
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
						if (_isFunction(callback)) {
							callback()
						}	
						break;
				}
			},
			drawImage: function(config, data, callback) {
				var image = new Image();
				// 图片必须的相同域名，如果是非本地的不能保存成功
				image.src = data || config.src;
				_logger(image.src, '====img====');
				image.onload = function() {
					oCtx.drawImage(image, ...config.position, ...config.size);
					if (_isFunction(callback)) {
						callback()
					}
				}
				_logger(image.complete, '图片加载完成')
			},
			drawRect: function(config, data, callback) {
				oCtx.fillStyle = config.fillStyle;
				oCtx.fillRect(...config.position, ...config.size);
				if (_isFunction(callback)) {
					callback()
				}
			},
			drawText: function(config, data, callback) {
				oCtx.fillStyle = config.fillStyle;
				oCtx.font = config.font;
				oCtx.fillText(data || config.text, ...config.position);
				if (_isFunction(callback)) {
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
			this.config = _extends({}, __MODULE__, this.config);
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
				if (_isFunction(this.config[module].refresh)) {
					this.config[module].refresh(); // 渲染模块
				}
 			}
		 },
		 // 更新store数据
		 update(data) {
				_logger(this.meta, this.config, data, '000')
				this.meta = _extends({}, this.meta, data);
				this.load();
		 },
		 // 对外直接暴露修改canvas的接口
		 initCanves: function(data) {
			 _logger(this.template, '===', this)
			 canvas(this.template).init(data);
		 },
	};

 	// 模块引擎
 	var __MODULE__ = {
 		"detail": {
 			"view": undefined,
 			"data": undefined,
 			"refresh": function() {
				 _logger('detail', this.data)
				 __DRIVER__.initCanves(this.data)
 			}
 		},
 		"list": {
 			"view": document.getElementById('shareList'),
 			"data": undefined,
 			"refresh": function() {
				_logger('---list渲染---')
 				var self = this;
				var eleDiv = [];
				this.data.forEach(function(item, index) {
					eleDiv.push(`<li>${item}<button class='btn btn-primary createImg' key='${index}'>生成图片</button></li>`);
				});
				this.view.innerHTML = eleDiv.join("");
				var btns = document.getElementsByClassName('createImg');
				for (var i = 0; i < btns.length; i++) {
					btns[i].onclick = function() {
						var btnIndex = this.getAttribute('key');
						var detail = {};
						if (self.data[btnIndex]) {
							detail = _formateDetail(self.data[btnIndex]);
						}
						_logger('current-detail', detail)
						__DRIVER__.initCanves(detail)
					}
				}
 			}
 		},
 	};

 	return this[f];
 }, 'c2i')
