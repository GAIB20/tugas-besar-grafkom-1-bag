
/**
 * Initializes line drawing mode by setting event handlers for mouse actions on the canvas.
 */
function initializeLineDrawingMode() {
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
            const lastLineIndex = shapes.lines.length - 1;
            shapes.lines[lastLineIndex].updateVertexCoordinates(coordinates, 1);
        } else {
            // Start a new line segment from the last clicked point
            tempLine.appendVertex(coordinates);
            shapes.lines.push(tempLine);
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
        
        console.log(shapes.lines);
    }
}
