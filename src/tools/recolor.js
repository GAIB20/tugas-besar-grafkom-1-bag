function initializeRecolorMode() {
  canvas.onmousedown = handleRecolor;
}

function handleRecolor(event) {
  if (!selectStatus) return;

  const coordinate = util.getCanvasCoord(event);
  const countPoint = shapes[selectedIndex].getPointCount();
  const color = util.hexToRgba(document.getElementById("color-picker").value);

  for (let i = 0; i < countPoint; i++) {
    var pointStatus = shapes[selectedIndex].isPointWithinMargin(coordinate);
    if (pointStatus.isEndPoint) {
      selectedPoint = pointStatus.pointIndex;

      shapes[selectedIndex].setVertexColor(selectedPoint, color);
      break;
    }
  }
}
