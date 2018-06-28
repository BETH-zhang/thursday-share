$(document).ready(function(){
  var savepngbtn = document.getElementById("savepngbtn");
  var savebmpbtn = document.getElementById("savebmpbtn");
  var savejpegbtn = document.getElementById("savejpegbtn");
  var changeCanvasBtn = document.getElementById("changeCanvas");
  var lineTool = document.getElementById("lineTool");
  var moveTool = document.getElementById("moveTool");
  var logoImg = document.getElementById('logo');
  var nameImg = document.getElementById('name');
  var shareImg = document.getElementById('share');
  var iconImg = document.getElementById('icon');

  /**
   * todo
   * 1.生成的图片没有后缀 done
   * 2.不能进行图片切换 done
   * 3.代码不优雅
   * 4.封装成可以手动输入，或者自动匹配的方式
   * 5.可以随意画
   * 6.可以随意移动图片
   * 7.可以修改文案
   */
  var shareData = [
    '杨鹏|CDN架构|带你了解CDN厂商的那些事|2018年5月28日@周四@15:00-17:00',
    '彭良维|小程序流程一条龙|从入门到放弃，嘿嘿|2018年5月28日@周四@15:00-17:00',
    '刘菲|Webpack4|Smart项目中的应用实战|2018年6月21日@周四@13:00-17:00',
    '董超|验证码解密|验证码的十万个为什么|2018年6月21日@周四@13:00-17:00',
    '贾雨峰|博客系统|带你从零建个人博客|2018年6月14日@周四@14:00-17:00',
    '王贤|GraphGL 简介|GraphGL 在教育云的实践|2018年6月14日@周四@14:00-17:00',
    '张百鸽|解码MVVM|带你了解Vue的双向数据绑定|2018年6月7日@周四@15:00-16:30',
    '董超|HTTP协议详解|没有主题的主题分享|2018年5月31日@周四@16:00-17:00',
    '董超|借小程序的幌子|带你了解文件服务和HTTP协议|2018年5月24日@周四@16:00-17:00',
    '张百鸽|微信小程序的深入探索|带你领略小程序的设计之美|2018年5月17日@周四@14:00-16:00',
    '孙敬云|程序员修炼之道|带你学习如来神掌|2018年4月11日@周三@15:00-18:00',
    '杨鹏|自动化运维实践|智课运维的实践之路|2018年4月11日@周三@17:30-19:00',
    '厂商分享|体感 未来已来|极致体验|2018年4月12日@周四@15:00-17:00',
    'U3D团队|让孩子练习更生动|U3D那些对接进度成果展示|2018年4月19日@周四@10:00-12:00',
    '课前团队|让孩子预习更有趣|一切为了孩子|2018年4月19日@周四@10:00-12:00'
  ];
  var nameData = function(key) {
    var data = {
      '孙敬云': 'sunjingyun',
      '杨鹏': 'default',
      // '董超': 'dongchao',
      '赵珊珊': 'zhaoshanshan'
    };
    return data[key];
  };
  // console.log(shareData, nameData['董超']);
 
  var currentShareAddress = '海淀区大柳树富海大厦2号楼1102  Tad会议室';

  function init() {
    updateCanvas(0);
    var eleUi = document.getElementById('shareList');
    var eleDiv = [];
    shareData.forEach(function(item, index) {
      eleDiv.push('<li>' + item + '<button class="btn" key="' + index + '">生成图片</button></li>');
    });
    eleUi.innerHTML = eleDiv.join('');
    var $btn = $('.btn');
    $btn.bind('click', function() {
      var btnIndex = $(this).attr('key');

      updateCanvas(btnIndex);
    });
  }

  init();

  function getOffsetLeft(e){
     var offset=e.offsetLeft;
     if(e.offsetParent!=null) offset+=getOffsetLeft(e.offsetParent);
     return offset;
  }
  
  function getOffsetTop(e){
     var offset=e.offsetTop;
     if(e.offsetParent!=null) offset+=getOffsetTop(e.offsetParent);
     return offset;
  }
  
  function updateCanvas(currentIndex) {
    var currentShare = shareData[currentIndex];
    var currentShareTmp = currentShare.split('|');
    var currentSharePeople = currentShareTmp[0];
    var currentName = nameData(currentSharePeople);
    var currentShareTitle = currentShareTmp[1];
    var currentShareSubTitle = currentShareTmp[2];
    var currentShareTime = currentShareTmp[3];
  
    var bMouseIsDown = false;
    var oCanvas = document.getElementById("thecanvas");
    var oCtx = oCanvas.getContext("2d");

    initCanvas();

    function initCanvas() {
      oCanvas.width = 500;
      oCanvas.height = 610;
      var iWidth = oCanvas.width;
      var iHeight = oCanvas.height;
      oCtx.fillStyle = "#fff";
      oCtx.fillRect(0,0,iWidth,iHeight);

      loadLogo();
      loadBg();
      loadShare();
      loadTitle();
      loadSubTitle();
      loadPeople();
      loadIcon();
      loadTime();
      loadAddress();
    }

    function moveCanvas(x, y) {
      oCtx.drawImage(logoImg, x || 50, y || 30, 110, 40);
      oCtx.drawImage(shareImg, 50, 90, 400, 270);
      oCtx.drawImage(nameImg, 300, 140, 150, 50);
      loadTitle();
      loadSubTitle();
      loadPeople();
      oCtx.drawImage(iconImg, 50, 520, 20, 35);
      loadTime();
      loadAddress();
    }

    function loadLogo(x, y) {
      // logo
      logoImg = new Image();
      // 图片必须的相同域名，如果是非本地的不能保存成功
      logoImg.src = 'http://127.0.0.1:8080/images/logo.png';
      logoImg.onload = function() {
        oCtx.drawImage(logoImg, x || 50, y || 30, 110, 40);
      }
    }

    function loadBg() {
      oCtx.fillStyle = "#f2f2f2";
      oCtx.fillRect(48,88,404,274);
    }

    function loadShare() {
      // name
      nameImg = new Image();
    
      // share
      shareImg = new Image();
      shareImg.src = 'http://127.0.0.1:8080/images/' + currentShare + '.jpg';
      shareImg.onload = function() {
        oCtx.drawImage(shareImg, 50, 90, 400, 270);
        nameImg.src = 'http://127.0.0.1:8080/images/' + currentName + '.png';
        nameImg.onload = function() {
          oCtx.drawImage(nameImg, 300, 140, 150, 50);
        }
      }
    }

    function loadTitle() {
      // title
      oCtx.fillStyle = '#405aa5';
      oCtx.font = '33px Microsoft YaHei';
      oCtx.fillText(currentShareTitle, 50, 420);
    }

    function loadSubTitle() {
      // subTitle
      oCtx.fillStyle = '#000';
      oCtx.font = '24px Microsoft YaHei';
      oCtx.fillText(currentShareSubTitle, 50, 460);
    }

    function loadPeople() {
      // people
      oCtx.fillStyle = '#000';
      oCtx.font = '16px Microsoft YaHei';
      oCtx.fillText('分享人：' + currentSharePeople, 50, 500);
    }

    function loadIcon() {
      // icon
      iconImg = new Image();
      iconImg.src = 'http://127.0.0.1:8080/images/icon.png';
      iconImg.onload = function() {
        oCtx.drawImage(iconImg, 50, 520, 20, 35);
      }
    }

    function loadTime() {
      // time
      oCtx.fillStyle = '#000';
      oCtx.font = '14px Microsoft YaHei';
      oCtx.fillText(currentShareTime.split('@').join(' '), 80, 533);
    }

    function loadAddress() {
      // address
      oCtx.fillStyle = '#000';
      oCtx.font = '14px Microsoft YaHei';
      oCtx.fillText(currentShareAddress, 80, 554);
    }
    
    function getCanvasXY(e) {
      var clientLeft = -30;
      var clientTop = -30;
      return {
        x: clientLeft + e.clientX - getOffsetLeft(oCanvas) + document.body.scrollLeft,
        y: clientTop + e.clientY - getOffsetTop(oCanvas) + jQuery(window).scrollTop(),
      }
    }

    function onmousemoveLine(e) {
      var iX = getCanvasXY(e).x;
      var iY = getCanvasXY(e).y;
      oCtx.moveTo(iLastX, iLastY);
      oCtx.lineTo(iX, iY); 
      oCtx.stroke();
      iLastX = iX;
      iLastY = iY;
    }

    function onmousemoveMove(e) {
      var iX = getCanvasXY(e).x;
      var iY = getCanvasXY(e).y;
      //先清除之前的然后重新绘制
      oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);
      moveCanvas(iX, iY);
    }
    
    // 在画布上画操作
    oCanvas.onmousedown = function(e) {
      bMouseIsDown = true;
      iLastX = getCanvasXY(e).x;
      iLastY = getCanvasXY(e).y;
    }
    oCanvas.onmousemove = function(e) {
      if (bMouseIsDown) {
        switch (changeCanvasBtn.value) {
          case 'Line':
            onmousemoveLine(e);
            break;
          case 'Move':
            onmousemoveMove(e);
            break;
        }
      }
    }
    oCanvas.onmouseup = function() {
      bMouseIsDown = false;
      iLastX = -1;
      iLastY = -1;
    }
  
    // function convertCanvas(strType) {
    //   if (strType == "PNG")
    //     var oImg = Canvas2Image.saveAsPNG(oCanvas, true);
    //   if (strType == "BMP")
    //     var oImg = Canvas2Image.saveAsBMP(oCanvas, true);
    //   if (strType == "JPEG")
    //     var oImg = Canvas2Image.saveAsJPEG(oCanvas, true);
  
    //   if (!oImg) {
    //     alert("Sorry, this browser is not capable of saving " + strType + " files!");
    //     return false;
    //   }
  
    //   oImg.id = "canvasimage";
  
    //   oImg.style.border = oCanvas.style.border;
    //   document.body.replaceChild(oImg, oCanvas);
  
    //   // showDownloadText();
    // }
  
    function saveCanvas(pCanvas, strType) {
      var bRes = false;
      if (strType == "PNG")
        bRes = Canvas2Image.saveAsPNG(oCanvas, false, currentShare);
      if (strType == "BMP")
        bRes = Canvas2Image.saveAsBMP(oCanvas, false, currentShare);
      if (strType == "JPEG")
        bRes = Canvas2Image.saveAsJPEG(oCanvas, false, currentShare);
  
      if (!bRes) {
        alert("Sorry, this browser is not capable of saving " + strType + " files!");
        return false;
      }
    }

    savepngbtn.onclick = function() {
      saveCanvas(oCanvas, "PNG");
    }
    savebmpbtn.onclick = function() {
      saveCanvas(oCanvas, "BMP");
    }
    savejpegbtn.onclick = function() {
      saveCanvas(oCanvas, "JPEG");
    }
    changeCanvasBtn.onclick = function() {
      if (this.value === 'Line') {
        this.value = 'Move';
        lineTool.style.display = 'none';
        moveTool.style.display = 'block';
      } else {
        this.value = 'Line';
        lineTool.style.display = 'block';
        moveTool.style.display = 'none';
      }
    }
  }
});
