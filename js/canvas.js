var shap = 99; //0 is circle; 1 is rectangle
var orignalX, orignalY; //the coordinate of mouse down
var lastX, lastY; //the coordinate of last mouse position
var isMouseDown = false; // flag of mouse pressing down
var myCanvas = document.getElementById("myCanvas");
var context = myCanvas.getContext('2d');
var width = myCanvas.width,
  height = myCanvas.height;
var data; //storing last canvas' content
context.strokeStyle = "black";
context.strokeWidth = 1;
context.lineWidth = 1;


document.getElementById('color').onchange = function () {
  context.strokeStyle = this.value
};

function doEraser() {
  context.strokeStyle = "white";
  shap = 2;
}

function sizeChange() {
  context.lineWidth = parseInt(document.getElementById('size').value);
}

function shapeChange() {
  context.strokeStyle = "black";
  var myselect = document.getElementById("shape");
  var index = myselect.selectedIndex;
  var myvalue = myselect.options[index].value;
  var mytext = myselect.options[index].text;
  shap = parseInt(myvalue);

}

function myCanvasMouseDown(event) {
  //event.preventDefault();

  if (event.button == 0) {
    orignalX = event.offsetX;
    orignalY = event.offsetY;
    context.moveTo(orignalX, orignalY);
    data = context.getImageData(0, 0, width, height);
    isMouseDown = true;

  }
}

function myCanvasMouseMove(event) {
  if (isMouseDown) {
    //event.preventDefault();

    switch (shap) {
      case 0:
        context.clearRect(0, 0, width, height);
        context.putImageData(data, 0, 0);
        lastX = event.offsetX;
        lastY = event.offsetY;
        context.beginPath();
        context.arc(orignalX + (lastX - orignalX) / 2, orignalY + (lastY - orignalY) / 2, Math.abs(lastX - orignalX) / 2, 0, Math.PI * 2, true);
        context.stroke();
        context.closePath();
        break;
      case 1:
        context.clearRect(0, 0, width, height);
        context.putImageData(data, 0, 0);
        lastX = event.offsetX;
        lastY = event.offsetY;
        context.strokeRect(orignalX, orignalY, lastX - orignalX, lastY - orignalY);
        break;
      case 2:
        lastX = event.offsetX;
        lastY = event.offsetY;
        context.lineTo(lastX, lastY); //根据鼠标路径绘画 
        context.stroke(); //立即渲染 
        break;

    }
  }
}

function myCanvasMouseUp(event) {
  if (isMouseDown) {
    //event.preventDefault();

    context.clearRect(0, 0, width, height);
    context.putImageData(data, 0, 0);
    lastX = event.offsetX;
    lastY = event.offsetY;
    switch (shap) {
      case 0:
        context.beginPath();
        context.arc(orignalX + (lastX - orignalX) / 2, orignalY + (lastY - orignalY) / 2, Math.abs(lastX - orignalX) / 2, 0, Math.PI * 2, true);
        context.stroke();
        context.closePath();
        break;
      case 1:
        context.beginPath();
        context.strokeRect(orignalX, orignalY, lastX - orignalX, lastY - orignalY);
        context.closePath();
        break;
      case 2:

        context.lineTo(lastX, lastY); //根据鼠标路径绘画 
        context.stroke(); //立即渲染 

        break;
    }
    isMouseDown = false;
    lastX = null;
    lastY = null;
    orignalX = null;
    orignalY = null;
    data = context.getImageData(0, 0, width, height);
    context.beginPath();
    context.clearRect(0, 0, width, height);
    context.putImageData(data, 0, 0);
    context.closePath();
  }
}
myCanvas.addEventListener("mousedown", myCanvasMouseDown, false);
myCanvas.addEventListener("mousemove", myCanvasMouseMove, false);
myCanvas.addEventListener("mouseup", myCanvasMouseUp, false);