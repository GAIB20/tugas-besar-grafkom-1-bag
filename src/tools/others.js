function polygonRemovePoint() {
  canvas.onmousedown = handleRemovePoint;
}

function handleRemovePoint(event) {
  if (selectStatus && shapes[selectedIndex].constructor.name == "Polygon") {
    const coordinate = util.getCanvasCoord(event);
    const countPoint = shapes[selectedIndex].getPointCount();

    if (countPoint <= 3) return;

    for (let i = 0; i < countPoint; i++) {
      var pointStatus = shapes[selectedIndex].isPointWithinMargin(coordinate);
      if (pointStatus.isEndPoint) {
        shapes[selectedIndex].removeCoordinate(pointStatus.pointIndex);
        resetSelectedPoints();
      }
    }
  }
}

function sendBackward() {
  if (selectStatus && selectedIndex > 0 && selectedIndex < shapes.length) {
    [shapes[selectedIndex], shapes[selectedIndex - 1]] = [
      shapes[selectedIndex - 1],
      shapes[selectedIndex],
    ];

    selectedIndex--;
  }
}

function sendForward() {
  if (selectStatus && selectedIndex >= 0 && selectedIndex < shapes.length - 1) {
    [shapes[selectedIndex], shapes[selectedIndex + 1]] = [
      shapes[selectedIndex + 1],
      shapes[selectedIndex],
    ];

    selectedIndex++;
  }
}

function goToBack() {
  if (selectStatus && selectedIndex > 0 && selectedIndex < shapes.length) {
    const [selectedShape] = shapes.splice(selectedIndex, 1);
    shapes.unshift(selectedShape);

    selectedIndex = 0;
  }
}
