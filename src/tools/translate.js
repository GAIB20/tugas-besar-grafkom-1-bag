function initializeTranslateMode() {
  canvas.onmousedown = handleStartTranslate;
  canvas.onmousemove = handleTranslateObject;
}

function handleStartTranslate(event) {
  if (!selectStatus) return;

  var coordinate = util.getCanvasCoord(event);
  var isFirstClick = !clickedModes.translate;
  var center = shapes[selectedIndex].getMiddle();

  if (isFirstClick) {
    clickedModes.translate = true;
    baseDistance = [coordinate[0] - center[0], coordinate[1] - center[1]];
  } else {
    clickedModes.translate = false;
    shapes[selectedIndex].translate(coordinate, baseDistance);
    resetSelectedPoints();
  }
}

function handleTranslateObject(event) {
  if (!selectStatus) return;

  var coordinate = util.getCanvasCoord(event);
  if (clickedModes.translate) {
    shapes[selectedIndex].translate(coordinate, baseDistance);
    resetSelectedPoints();
  }
}
