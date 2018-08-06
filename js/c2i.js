/**
 * c2i 1.0.0-alpha
 * Copyright (c) 2018 Beth
 * ModuleDriver
 * depend on [base64.js, canvas2image.js]
 */

/**
 * 问题点：
 * 1.如何组织模块驱动架构代码
 * 2.如何抽离业务，提炼抽象层代码
 * 3.如何处理不同环境调用的问题
 * 4.如何处理深copy和浅copy的问题
 * 5.如何暴露接口
 * 6.如何将任意的html导出图片
 */

 // webpack通用模块定义
 (function webpackUniversalModuleDefinition(global, factory, framework) {
	// 除了浏览器环境，其他环境都不允许使用document等window对象
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
    console.log('window', factory());
		global[framework] = factory();
	}

 })(this, function() {

	var logger = console.log

	var getProto = Object.getPrototypeOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call( Object );

	function isPlainObject(obj) {
			var proto, Ctor;

			// Detect obvious negatives
			// 检测到明显的否定
			// Use toString instead of jQuery.type to catch host objects
			// 使用toString代替jQuery。类型来捕获宿主对象
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}

			proto = getProto( obj );

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	}

	var _deepExtends = function() {
			var options, name, src, copy, copyIsArray, clone,
					target = arguments[ 0 ] || {},
					i = 1,
					length = arguments.length,
					deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
					deep = target;

					// Skip the boolean and the target
					target = arguments[ i ] || {};
					i++;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !isFunction( target ) ) {
					target = {};
			}

			// Extend jQuery itself if only one argument is passed
			if ( i === length ) {
					target = this;
					i--;
			}

			for ( ; i < length; i++ ) {
					// Only deal with non-null/undefined values
					if ( ( options = arguments[ i ] ) != null ) {

							// Extend the base object
							for ( name in options ) {
									src = target[ name ];
									copy = options[ name ];

									// Prevent never-ending loop
									if ( target === copy ) {
											continue;
									}

									// Recurse if we're merging plain objects or arrays
									if ( deep && copy && ( isPlainObject( copy ) ||
											( copyIsArray = Array.isArray( copy ) ) ) ) {

											if ( copyIsArray ) {
													copyIsArray = false;
													clone = src && Array.isArray( src ) ? src : [];

											} else {
													clone = src && isPlainObject( src ) ? src : {};
											}

											// Never move original objects, clone them
											target[ name ] = jQuery.extend( deep, clone, copy );

									// Don't bring in undefined values
									} else if ( copy !== undefined ) {
											target[ name ] = copy;
									}
							}
					}
			}

			// Return the modified object
			return target;
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
	
	var _isFunction = function(value) {
		return typeof value === 'function' &&
					value instanceof Function
	};

	var _objectKeys = function(objs) {
		var ary = [];
		for (var key in objs) {
		ary.push(key);
		}
		return ary;
	}

	var common = {
		extend: _extends,
		deepExtend: _deepExtends,
	};
	
	// 定义画布函数
	var canvas = function(ele, config) {
		var defaultConfig = {
			width: 500,
			height: 610,
			backgroundColor: '#fff',
			position: [0, 0],
			data: {
				logo: {
					type: 'image',
					src: '/images/logo.png',
					position: [50, 30],
					size: [110, 40],
				},
				bg: {
					type: 'rect',
					fillStyle: '#f2f2f2',
					position: [48, 88],
					size: [404, 274],
				},
				title: {
					type: 'text',
					fillStyle: '#405aa5',
					font: '33px Microsoft YaHei',
					position: [50, 420]
				},
			}
		};
		var __CONFIG__ = _extends({}, defaultConfig, config)

		// 画图的状态
		var bMouseIsDown = false;

		// 初始化canvas的状态
		var oCanvas = ele;
		if (!oCanvas) {
			return new Error('必须传入获取canvasId的元素对象');
		}
		var oCtx = oCanvas.getContext("2d");
		
		return {
			init: function(data) {
				this.data = data;
				oCanvas.width = __CONFIG__.width;
				oCanvas.height = __CONFIG__.height;
				var iWidth = oCanvas.width;
				var iHeight = oCanvas.height;
				oCtx.fillStyle = __CONFIG__.backgroundColor;
				oCtx.fillRect(...__CONFIG__.position,iWidth,iHeight);

				// 递归调用解决同步问题
				var configData = _objectKeys(__CONFIG__.data);
				var configDataCount = configData.length;
				this.recursionAsync(configDataCount, __CONFIG__.data, data)
				// 使用async、await实现

				// TODO:初始化自定义画板
				// this.initPaintBoard();
			},

			initPaintBoard: function() {
				var self = this;
				// 在画布上画操作
				oCanvas.onmousedown = function(e) {
					bMouseIsDown = true;
					iLastX = self.getCanvasXY(e).x;
					iLastY = self.getCanvasXY(e).y;
				}
				oCanvas.onmousemove = function(e) {
					if (bMouseIsDown) {
						// TODO: 支持画图和内容移动
						self.onmousemoveLine(e);
						switch (changeCanvasBtn.value) {
							case "Line":
								self.onmousemoveLine(e);
								break;
							case "Move":
								self.onmousemoveMove(e);
								break;
						}
					}
				}
				oCanvas.onmouseup = function() {
					bMouseIsDown = false;
					iLastX = -1;
					iLastY = -1;
				}
			},

			recursionAsync: function(count, config, data) {
				var self = this;
				logger(count)
				if (count === 0) {
					logger('All is Done!');
					if (__CONFIG__.auto) {
						this.downloadImg();
					}
				}	else {
					count -= 1;
					var configData = _objectKeys(config);
					var configDataCount = configData.length;
					var key = configData[configDataCount - 1 - count];
					logger(key, '---:key:');
					this.initTemplate(config[key], data[key], function() {
						self.recursionAsync(count, config, data);
					})
				}
			},

			initTemplate: function(config, data, callback) {
				logger(config.type);
				switch(config.type) {
					case 'html':
					  this.drawHtml(config, data, callback)
						break;
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

			drawHtml: function(config, data, callback) {
				// 可以在这里实现一个小模板
				var app = document.getElementById(config.id);
				var style = getComputedStyle(app);
				var ratio = window.devicePixelRatio
				app.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

				var htmlWidth = Math.ceil(style.width.slice(0, -2));
				var htmlHeight = Math.ceil(style.height.slice(0, -2)) + 15;
				oCanvas.width = htmlWidth * ratio;
				oCanvas.height = htmlHeight * ratio;
				oCtx.scale(ratio, ratio);

				// data:image/svg+xml 必须有
				var svg = `data:image/svg+xml,
					<svg xmlns="http://www.w3.org/2000/svg" width="${htmlWidth}" height="${htmlHeight}">
						<foreignObject width="100%" height="100%">
							${app.outerHTML} 
						</foreignObject>
					</svg>
				`;
				config = _extends({}, config, {
					src: URL.createObjectURL(new Blob([svg], {
						type: 'image/svg+xml'
					})),
					size: [htmlWidth, htmlHeight]
				})
				this.drawImage(config, data, callback);
			},

			drawImage: function(config, data, callback) {
				var image = new Image();
				// 图片必须的相同域名，如果是非本地的不能保存成功
				image.src = data || config.src;
				// 解决图片跨域问题
				image.setAttribute('crossOrigin', 'anonymous');
				logger(image.src, '====img====');
				image.onload = function() {
					oCtx.drawImage(image, ...config.position, ...config.size);
					if (_isFunction(callback)) {
						callback()
					}
				}
				logger(image.complete, '图片加载完成')
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

			downloadImg: function(type) {
				var imgType = type || __CONFIG__.type;
				if (['PNG', 'BMP', 'JPEG', 'PNGHTML'].indexOf(imgType) !== -1) {
					this.saveCanvas(oCanvas, imgType);
				}
			},

			getCanvasXY: function(e) {
        var clientLeft = -30;
				var clientTop = -30;
        return {
          x: clientLeft + e.clientX,
          y: clientTop + e.clientY,
        }
			},
			
      onmousemoveLine: function(e) {
        var iX = this.getCanvasXY(e).x;
        var iY = this.getCanvasXY(e).y;
        oCtx.moveTo(iLastX, iLastY);
        oCtx.lineTo(iX, iY); 
        oCtx.stroke();
        iLastX = iX;
        iLastY = iY;
			},
			
      onmousemoveMove: function(e) {
				// 有问题，需要修复
        var iX = this.getCanvasXY(e).x;
        var iY = this.getCanvasXY(e).y;
        //先清除之前的然后重新绘制
        oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);
        this.moveCanvas(iX, iY);
			},
			
      moveCanvas: function(x, y) {
        logger(x, y)
			},
			
      saveCanvas: function(pCanvas, strType) {
				var bRes = false;
        if (strType == "PNG")
          bRes = Canvas2Image.saveAsPNG(oCanvas, false, this.data.title);
        if (strType == "BMP")
          bRes = Canvas2Image.saveAsBMP(oCanvas, false, this.data.title);
        if (strType == "JPEG")
          bRes = Canvas2Image.saveAsJPEG(oCanvas, false, this.data.title);
				if (strType == 'PNGHTML')
					bRes = Canvas2Image.saveAsImg(oCanvas, false, this.data.title);
        if (!bRes) {
          alert("Sorry, this browser is not capable of saving " + strType + " files!");
          return false;
        }
			},
		}
	}

  // 模块驱动的对象
  var driver = {};
 	var __DRIVER__ = driver = {
 		init: function({ element, download, data, config, template }) {
			// 初始化
			// canvas的元素
			this.element = element;
			// 数据内容
			this.meta = data;
			// 模板引擎配置
			this.config = config;
			// 图片模板配置
			this.template = template;
			// 其他配置
			this.download = {
				type: download.type,
				auto: download.auto,
			};

 			// 加载数据
			this._load();
		},
		 
 		_load: function() {
			// 重组数据
			this.config = _deepExtends({}, __MODULE__, this.config);
 			// 分析填充数据
 			this._fetch();
 			// 驱动模块更新视图
 			this._refresh();
		},
		 
 		_fetch: function() {
 			for (var module in this.config) {
				this.config[module].data = this.meta[module];
 			}
		},
		 
 		_refresh: function() {
 			for (var module in this.config) {
				// 利用数据劫持去优化，数据没有修改的对象不进行view渲染
				if (_isFunction(this.config[module].refresh)) {
					this.config[module].refresh(); // 渲染模块
				}
 			}
		},

		// 更新store数据
		update(data) {
			logger(this.meta, this.config, data, '000')
			this.meta = _extends({}, this.meta, data);
			this.load();
		},

		// 对外直接暴露修改canvas的接口
		initCanves: function(data) {
			this.canvas = canvas(this.element, this.template);
			logger(this.template, '===', this)
			this.template = _extends({}, this.template, this.download);
			this.canvas.init(data, this.template);
		},

		// 下载图片
	  downloadImg: function(type) {
			if (this.canvas) {
				this.canvas.downloadImg(type);
			} else {
				new Error('No picture can download');
			}
		}
	};

 	// 模块引擎
 	var __MODULE__ = {
 		"detail": {
 			"view": undefined,
 			"data": undefined,
 			"refresh": function() {
				 logger('detail', this.data)
				 __DRIVER__.initCanves(this.data)
 			}
 		},
 	};

 	return _extends(driver, common);
 }, 'c2i')
