var tempLine = null;
var tempRectangle = null;
var tempSquare = null;
var tempPolygon = null;
var tempCoordinate = [-1, -1];

/**
 * Initializes line drawing mode by setting event handlers for mouse actions on the canvas.
 */
function initializeLineDrawingMode() {
  clearSelectedPoints();
  canvas.onmousedown = handleLineDrawClick;
  canvas.onmousemove = handleLineDrawHover;
  canvas.onmouseleave = resetLineDrawingState;
}

/**
 * Handles mouse click events on the canvas during line drawing mode.
 *
 * @param {MouseEvent} event - The mouse event.
 */
function handleLineDrawClick(event) {
  const coordinates = util.getCanvasCoord(event);
  const isFirstClick = !clickedModes.line.click;

  if (isFirstClick) {
    var color = util.hexToRgba(document.getElementById("color-picker").value);
    tempLine = new Line(gl, coordinates, color);
    clickedModes.line.click = true;
  } else {
    resetLineDrawingState();
  }
}

/**
 * Handles mouse move events on the canvas during line drawing mode, after a click.
 *
 * @param {MouseEvent} event - The mouse event.
 */
function handleLineDrawHover(event) {
  const coordinates = util.getCanvasCoord(event);

  if (clickedModes.line.click) {
    if (clickedModes.line.hover) {
      // Update the endpoint of the last line drawn
      // const lastLineIndex = shapes.lines.length - 1;
      // shapes.lines[lastLineIndex].updateVertexCoordinates(coordinates, 1);
      const lastIndex = shapes.length - 1;
      shapes[lastIndex].updateVertexCoordinates(coordinates, 1);
    } else {
      // Start a new line segment from the last clicked point
      tempLine.appendVertex(coordinates);
      shapes.push(tempLine);
      // shapes.lines.push(tempLine);
      clickedModes.line.hover = true;
    }
  }
}

/**
 * Resets the drawing state when the mouse leaves the canvas during line drawing.
 */
function resetLineDrawingState() {
  if (clickedModes.line.click && clickedModes.line.hover) {
    clickedModes.line.click = false;
    clickedModes.line.hover = false;

    console.log(shapes);
  }
}

/**
 * Initializes rectangle drawing mode by setting event handlers for mouse actions on the canvas.
 */
function initializeRectangleDrawingMode() {
  clearSelectedPoints();
  canvas.onmousedown = handleRectangleDrawClick;
  canvas.onmousemove = handleRectangleDrawHover;
  canvas.onmouseleave = resetRectangleDrawingState;
}

/**
 * Handles mouse click events on the canvas during rectangle drawing mode.
 *
 * @param {MouseEvent} event - The mouse event.
 */
function handleRectangleDrawClick(event) {
  const coordinates = util.getCanvasCoord(event);
  const isFirstClick = !clickedModes.rectangle.click;

  if (isFirstClick) {
    var color = util.hexToRgba(document.getElementById("color-picker").value);
    tempRectangle = new Rectangle(gl, coordinates, color);
    clickedModes.rectangle.click = true;
  } else {
    resetRectangleDrawingState();
  }
}

/**
 * Handles mouse move events on the canvas during rectangle drawing mode, after a click.
 *
 * @param {MouseEvent} event - The mouse event.
 */
function handleRectangleDrawHover(event) {
  const coordinates = util.getCanvasCoord(event);

  if (clickedModes.rectangle.click) {
    if (clickedModes.rectangle.hover) {
      // Update the endpoint of the last rectangle drawn
      // const lastRectangleIndex = shapes.rectangles.length - 1;
      // shapes.rectangles[lastRectangleIndex].changeLastCoord(coordinates);
      const lastIndex = shapes.length - 1;
      shapes[lastIndex].changeLastCoord(coordinates);
    } else {
      // Start a new rectangle segment from the last clicked point
      tempRectangle.firstHoverCoord(coordinates);
      shapes.push(tempRectangle);
      // shapes.rectangles.push(tempRectangle);
      clickedModes.rectangle.hover = true;
    }
  }
}

/**
 * Resets the drawing state when the mouse leaves the canvas during rectangle drawing.
 */
function resetRectangleDrawingState() {
  if (clickedModes.rectangle.click && clickedModes.rectangle.hover) {
    clickedModes.rectangle.click = false;
    clickedModes.rectangle.hover = false;

    console.log(shapes);
  }
}

/**
 * Initializes square drawing mode by setting event handlers for mouse actions on the canvas.
 */
function initializeSquareDrawingMode() {
  clearSelectedPoints();
  canvas.onmousedown = handleSquareDrawClick;
  canvas.onmousemove = handleSquareDrawHover;
  canvas.onmouseleave = resetSquareDrawingState;
}

/**
 * Handles mouse click events on the canvas during square drawing mode.
 *
 * @param {MouseEvent} event - The mouse event.
 */
function handleSquareDrawClick(event) {
  const coordinates = util.getCanvasCoord(event);
  const isFirstClick = !clickedModes.square.click;

  if (isFirstClick) {
    var color = util.hexToRgba(document.getElementById("color-picker").value);
    tempSquare = new Square(gl, coordinates, color);
    clickedModes.square.click = true;
  } else {
    resetSquareDrawingState();
  }
}

/**
 * Handles mouse move events on the canvas during square drawing mode, after a click.
 *
 * @param {MouseEvent} event - The mouse event.
 */
function handleSquareDrawHover(event) {
  const coordinates = util.getCanvasCoord(event);

  if (clickedModes.square.click) {
    if (clickedModes.square.hover) {
      // Update the endpoint of the last rectangle drawn
      // const lastRectangleIndex = shapes.rectangles.length - 1;
      // shapes.rectangles[lastRectangleIndex].changeLastCoord(coordinates);
      const lastIndex = shapes.length - 1;
      shapes[lastIndex].changeLastCoord(coordinates);
    } else {
      // Start a new rectangle segment from the last clicked point
      tempSquare.firstHoverCoord(coordinates);
      shapes.push(tempSquare);
      // shapes.rectangles.push(tempRectangle);
      clickedModes.square.hover = true;
    }
  }
}

/**
 * Resets the drawing state when the mouse leaves the canvas during square drawing.
 */
function resetSquareDrawingState() {
  if (clickedModes.square.click && clickedModes.square.hover) {
    clickedModes.square.click = false;
    clickedModes.square.hover = false;

    console.log(shapes);
  }
}

function initializePolygonDrawingMode() {
  clearSelectedPoints();
  canvas.onmousedown = handlePolygonMouseDown;
  canvas.onmousemove = handlePolygonMouseMove;
  canvas.ondblclick = finalizePolygonDrawing;
  canvas.onmouseleave = finalizePolygonDrawing;
}

function handlePolygonMouseDown(event) {
  const coordinates = util.getCanvasCoord(event);
  const color = util.hexToRgba(document.getElementById("color-picker").value);

  if (!clickedModes.polygon.click) {
    // Start a new polygon drawing
    tempPolygon = new Polygon(gl, coordinates, color);
    clickedModes.polygon.click = true;
  } else if (event.button === 0) {
    handlePolygonClick(coordinates);
  }
}

function handlePolygonClick(coordinates) {
  const pointCount = tempPolygon.getPointCount();
  polygonPlaceHolder = null;

  // Add coordinates to the polygon based on the number of points it already has
  if (
    pointCount >= 1 &&
    tempCoordinate &&
    !(
      coordinates[0] == tempCoordinate[0] && coordinates[1] == tempCoordinate[1]
    )
  ) {
    tempPolygon.addCoordinate(coordinates);
    if (pointCount === 2) {
      shapes.push(tempPolygon);
    }
  }

  tempCoordinate = coordinates;
}

function handlePolygonMouseMove(event) {
  const coordinates = util.getCanvasCoord(event);

  if (clickedModes.polygon.click) {
    const vertexDatas = tempPolygon.copyVertexData();
    const baseColor = tempPolygon.getBaseColor();
    const pointCount = tempPolygon.getPointCount();

    polygonPlaceHolder = new Polygon(gl, vertexDatas, baseColor, pointCount);
    polygonPlaceHolder.addCoordinate(coordinates);
    clickedModes.polygon.hover = true;
  }
}

function finalizePolygonDrawing() {
  if (clickedModes.polygon.click && clickedModes.polygon.hover) {
    polygonPlaceHolder = null;

    clickedModes.polygon.click = false;
    clickedModes.polygon.hover = false;

    console.log(shapes);
  }
}
