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

function polygonAddPoint() {
  handleAddPointFirstClick();
  canvas.onmousedown = handleAddPoint;
  canvas.onmousemove = handleAddMove;
  canvas.onmouseleave = handleAddLeave;
}

function handleAddPointFirstClick() {
  if (selectStatus && shapes[selectedIndex].constructor.name == "Polygon") {
    const vertexDatas = shapes[selectedIndex].copyVertexData();
    const baseColor = shapes[selectedIndex].getBaseColor();
    const pointCount = shapes[selectedIndex].getPointCount();

    tempPolygon = new Polygon(gl, vertexDatas, baseColor, pointCount);
    clickedModes.addPolygon = true;
  }
}

function handleAddPoint(event) {
  if (
    clickedModes.addPolygon &&
    selectStatus &&
    shapes[selectedIndex].constructor.name == "Polygon"
  ) {
    const coordinate = util.getCanvasCoord(event);
    shapes[selectedIndex].addCoordinate(coordinate);
    resetSelectedPoints();
    handleAddPointFirstClick();
  }
}

function handleAddMove(event) {
  if (
    clickedModes.addPolygon &&
    selectStatus &&
    shapes[selectedIndex].constructor.name == "Polygon"
  ) {
    const coordinate = util.getCanvasCoord(event);
    shapes.splice(selectedIndex, 1);
    const vertexDatas = tempPolygon.copyVertexData();
    const baseColor = tempPolygon.getBaseColor();
    const pointCount = tempPolygon.getPointCount();

    var newPolygon = new Polygon(gl, vertexDatas, baseColor, pointCount);
    shapes.push(newPolygon);
    selectedIndex = shapes.length - 1;
    shapes[selectedIndex].addCoordinate(coordinate);

    resetSelectedPoints();
  }
}

function handleAddLeave(event) {
  if (
    clickedModes.addPolygon &&
    selectStatus &&
    shapes[selectedIndex].constructor.name == "Polygon"
  ) {
    shapes.splice(selectedIndex, 1);
    shapes.push(tempPolygon);
    resetSelectedPoints();
    clickedModes.addPolygon = false;
  }
}

function saveModel() {
  var json = JSON.stringify(shapes);
  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.download = "model.json";
  a.href = url;
  a.textContent = "Download model.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function loadModelContent(content) {
  shapes = [];
  var tempShapes = JSON.parse(content);
  var idx = 0;

  tempShapes.forEach((s) => {
    if (s.kind === "line") {
      shapes.push(
        new Line(
          gl,
          [s.vertexData[0], s.vertexData[1]],
          [s.vertexData[2], s.vertexData[3], s.vertexData[4], s.vertexData[5]]
        )
      );
      shapes[idx].appendVertex(
        [s.vertexData[6], s.vertexData[7]],
        [s.vertexData[8], s.vertexData[9], s.vertexData[10], s.vertexData[11]]
      );
    }

    if (s.kind === "square") {
      shapes.push(
        new Square(
          gl,
          [s.vertexData[0], s.vertexData[1]],
          [s.vertexData[2], s.vertexData[3], s.vertexData[4], s.vertexData[5]]
        )
      );
      for (let i = 1; i < 4; i++) {
        shapes[idx].appendVertex(
          [s.vertexData[i * 6], s.vertexData[i * 6 + 1]],
          [
            s.vertexData[i * 6 + 2],
            s.vertexData[i * 6 + 3],
            s.vertexData[i * 6 + 4],
            s.vertexData[i * 6 + 5],
          ]
        );
      }
    }

    if (s.kind === "rectangle") {
      shapes.push(
        new Rectangle(
          gl,
          [s.vertexData[0], s.vertexData[1]],
          [s.vertexData[2], s.vertexData[3], s.vertexData[4], s.vertexData[5]]
        )
      );
      for (let i = 1; i < 4; i++) {
        shapes[idx].appendVertex(
          [s.vertexData[i * 6], s.vertexData[i * 6 + 1]],
          [
            s.vertexData[i * 6 + 2],
            s.vertexData[i * 6 + 3],
            s.vertexData[i * 6 + 4],
            s.vertexData[i * 6 + 5],
          ]
        );
      }
    }

    if (s.kind === "polygon") {
      shapes.push(
        new Polygon(
          gl,
          [s.vertexData[0], s.vertexData[1]],
          [s.vertexData[2], s.vertexData[3], s.vertexData[4], s.vertexData[5]]
        )
      );
      for (let i = 1; i < s.vertexData.length / 6; i++) {
        shapes[idx].appendVertex(
          [s.vertexData[i * 6], s.vertexData[i * 6 + 1]],
          [
            s.vertexData[i * 6 + 2],
            s.vertexData[i * 6 + 3],
            s.vertexData[i * 6 + 4],
            s.vertexData[i * 6 + 5],
          ]
        );
        shapes[idx].shaderCount++;
      }
    }
    idx++;
  });
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
  if (selectStatus) {
    const [selectedShape] = shapes.splice(selectedIndex, 1);
    shapes.unshift(selectedShape);

    selectedIndex = 0;
  }
}

function goToFront() {
  if (selectStatus) {
    const [selectedShape] = shapes.splice(selectedIndex, 1);
    shapes.push(selectedShape);

    selectedIndex = shapes.length - 1;
  }
}
