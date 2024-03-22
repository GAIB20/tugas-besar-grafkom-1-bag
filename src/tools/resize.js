function initResizeMode() {
  canvas.onmousedown = handleResizeClick;
  canvas.onmousemove = handleResizeMove;
}

function handleResizeClick(event) {
  if (!selectStatus) return;

  const coordinate = util.getCanvasCoord(event);
  const isFirstClick = !clickedModes.resize;

  if (isFirstClick) {
    const countPoint = shapes[selectedIndex].getPointCount();

    for (let i = 0; i < countPoint; i++) {
      var pointStatus = shapes[selectedIndex].isPointWithinMargin(coordinate);
      if (pointStatus.isEndPoint) {
        selectedPoint = pointStatus.pointIndex;
        clickedModes.resize = true;
        break;
      }
    }
  } else {
    resetSelectedPoints();
    clickedModes.resize = false;
  }
}

function handleResizeMove(event) {
  if (!selectStatus) return;

  const coordinate = util.getCanvasCoord(event);
  if (clickedModes.resize) {
    shapes[selectedIndex].resize(selectedPoint, coordinate);
    resetSelectedPoints();
  }
}
