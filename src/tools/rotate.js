var initialVertex = null;
var middle = null;
var baseCoord = null;

function initRotate() {
  canvas.onmousedown = handleStartRotate;
  canvas.onmousemove = handleRotateObject;
}

function handleStartRotate(event) {
  if (!selectStatus) return;

  var coordinate = util.getCanvasCoord(event);
  var isFirstClick = !clickedModes.rotate;

  if (isFirstClick) {
    clickedModes.rotate = true;
    baseCoord = coordinate;
    initialVertex = [...shapes[selectedIndex].vertexData];
    middle = shapes[selectedIndex].getMiddle();
  } else {
    clickedModes.rotate = false;
    shapes[selectedIndex].rotate(initialVertex, baseCoord, coordinate, middle);
    resetSelectedPoints();
  }
}

function handleRotateObject(event) {
  if (!selectStatus) return;

  var coordinate = util.getCanvasCoord(event);
  if (clickedModes.rotate) {
    shapes[selectedIndex].rotate(initialVertex, baseCoord, coordinate, middle);
    resetSelectedPoints();
  }
}
