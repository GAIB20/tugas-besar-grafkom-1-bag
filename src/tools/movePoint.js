function initMoveMode() {
  canvas.onmousedown = handleSelectPoint;
  canvas.onmousemove = handleMovePoint;
}

function handleSelectPoint(event) {
  if (!selectStatus) return;

  const coordinate = util.getCanvasCoord(event);
  const isFirstClick = !clickedModes.movePoint;
  const isPolygon = shapes[selectedIndex].constructor.name == "Polygon";

  if (isFirstClick) {
    const countPoint = shapes[selectedIndex].getPointCount();

    for (let i = 0; i < countPoint; i++) {
      var pointStatus = shapes[selectedIndex].isPointWithinMargin(coordinate);
      if (pointStatus.isEndPoint) {
        selectedPoint = pointStatus.pointIndex;
        clickedModes.movePoint = true;

        if (isPolygon) {
          const vertexDatas = shapes[selectedIndex].copyVertexData();
          const baseColor = shapes[selectedIndex].getBaseColor();
          const pointCount = shapes[selectedIndex].getPointCount();

          tempPolygon = new Polygon(gl, vertexDatas, baseColor, pointCount);
        }

        break;
      }
    }
  } else {
    tempPolygon = null;
    resetSelectedPoints();
    clickedModes.movePoint = false;
  }
}

function handleMovePoint(event) {
  if (!selectStatus) return;

  const coordinate = util.getCanvasCoord(event);
  const isPolygon = shapes[selectedIndex].constructor.name == "Polygon";
  if (clickedModes.movePoint) {
    if (isPolygon) {
      shapes.splice(selectedIndex, 1);
      const vertexDatas = tempPolygon.copyVertexData();
      const baseColor = tempPolygon.getBaseColor();
      const pointCount = tempPolygon.getPointCount();

      var newPolygon = new Polygon(gl, vertexDatas, baseColor, pointCount);
      shapes.push(newPolygon);
      selectedIndex = shapes.length - 1;
    }
    shapes[selectedIndex].movePoint(selectedPoint, coordinate);
    resetSelectedPoints();
  }
}
