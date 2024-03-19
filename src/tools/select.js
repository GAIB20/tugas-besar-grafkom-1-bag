function initializeSelectMode() {
  canvas.onmousedown = handleSelectClick;
}

function handleSelectClick(event) {
  const coordinate = util.getCanvasCoord(event);
  selectStatus = false;

  for (let i = shapes.length - 1; i >= 0; i--) {
    var s = shapes[i];
    selectStatus = s.isInside(coordinate);
    if (selectStatus) {
      clickedModes.select = true;
      console.log("shape " + i + ": " + s.constructor.name + " selected");

      shapes.splice(i, 1);
      shapes.push(s);

      break;
    }
  }
  resetSelectedPoints();
  // if (selectStatus) {

  // }
}

function resetSelectedPoints() {
  points = [];
  if (selectStatus) {
    const selectedShape = shapes[shapes.length - 1];
    for (let i = 0; i < selectedShape.getPointCount(); i++) {
      points.push(
        new Point(gl, selectedShape.getVertexCoordinates(i), [0, 0, 1, 1])
      );
    }
  }
}

function clearSelectedPoints() {
  clickedModes.select = false;
  selectStatus = false;
  resetSelectedPoints();
}
