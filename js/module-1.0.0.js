/**
 * 模块驱动架构
 * 依赖
 * [base64.js, canvas2image.js]
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
				 mc: `分享人：${mc}`,
				 title: title,
				 subTitle: subTitle,
				 schedule: schedule,
				 address: address,
				 cover: `/images/${data}.jpg`
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
		},
		getOffsetLeft: function(e){
				var offset=e.offsetLeft;
				if(e.offsetParent!=null) offset+=this.getOffsetLeft(e.offsetParent);
				return offset;
		},
		getOffsetTop: function(e){
				var offset=e.offsetTop;
				if(e.offsetParent!=null) offset+=this.getOffsetTop(e.offsetParent);
				return offset;
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
			 title: {
				 type: 'text',
				 fillStyle: '#405aa5',
				 font: '33px Microsoft YaHei',
				 position: [50, 420]
			 },
		 }
	 };
	 var __CONFIG__ = $.extend({}, defaultConfig, config)

	 // 初始化
	 var savepngbtn = document.getElementById("savepngbtn");
	 var savebmpbtn = document.getElementById("savebmpbtn");
	 var savejpegbtn = document.getElementById("savejpegbtn");
 
	 // 画图的状态
	 var bMouseIsDown = false;

	 // 初始化canvas的状态
		 var oCanvas = document.getElementById("mycanvas");
	 var oCtx = oCanvas.getContext("2d");
	 
	 return {
		 init: function(data) {
			 var self = this;
			 this.data = data;
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
			 // 使用async、await实现

			 // 初始化自定义画板
			 this.initPaintBoard();
		 },
		 initPaintBoard: function() {
			 const self = this;
			 // 在画布上画操作
				 oCanvas.onmousedown = function(e) {
					 bMouseIsDown = true;
					 iLastX = self.getCanvasXY(e).x;
					 iLastY = self.getCanvasXY(e).y;
				 }
				 oCanvas.onmousemove = function(e) {
					 if (bMouseIsDown) {
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
				 savepngbtn.onclick = function() {
					 self.saveCanvas(oCanvas, "PNG");
				 }
				 savebmpbtn.onclick = function() {
					 self.saveCanvas(oCanvas, "BMP");
				 }
				 savejpegbtn.onclick = function() {
					 self.saveCanvas(oCanvas, "JPEG");
				 }
		 },
		 recursionAsync: function(count, config, data) {
			 const self = this;
			 console.log(count)
			 if (count === 0) {
				 console.log('All is Done!');
			 } else {
				 count -= 1;
				 const configData = common.objectKeys(config);
				 const configDataCount = configData.length;
				 const key = configData[configDataCount - 1 - count];
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
		 getCanvasXY: function(e) {
			 var clientLeft = -30;
			 var clientTop = -30;
			 return {
				 x: clientLeft + e.clientX - common.getOffsetLeft(oCanvas) + document.body.scrollLeft,
				 y: clientTop + e.clientY - common.getOffsetTop(oCanvas) + $(window).scrollTop(),
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
			 var iX = this.getCanvasXY(e).x;
			 var iY = this.getCanvasXY(e).y;
			 //先清除之前的然后重新绘制
			 oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);
			 this.moveCanvas(iX, iY);
		 },
		 moveCanvas: function(x, y) {
			 console.log(x, y)
		 },
		 saveCanvas: function(pCanvas, strType) {
			 var bRes = false;
			 if (strType == "PNG")
				 bRes = Canvas2Image.saveAsPNG(oCanvas, false, this.data.title);
			 if (strType == "BMP")
				 bRes = Canvas2Image.saveAsBMP(oCanvas, false, this.data.title);
			 if (strType == "JPEG")
				 bRes = Canvas2Image.saveAsJPEG(oCanvas, false, this.data.title);
	 
			 if (!bRes) {
				 alert("Sorry, this browser is not capable of saving " + strType + " files!");
				 return false;
			 }
		 }
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
			 this.meta = $.extend({}, this.meta, data);
		 this.load();
	 },
	 // 对外直接暴露修改canvas的接口
	 initCanves: function(data) {
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
				__DRIVER__.initCanves(this.data)
			}
		},
		"list": {
			"view": $("#shareList"),
			"data": undefined,
			"refresh": function() {
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
					 __DRIVER__.initCanves(detail)
				 });
			}
		},
	};

	return this[f];
}, "ModuleDriver")