class Line extends Shape {
  constructor(gl, coordinates, color) {
    super(gl.LINES, 0, 2, color, coordinates, "line");
  }

  isInside(coordinate) {
    const [x, y] = coordinate;
    const [x1, y1] = this.getVertexCoordinates(0);
    const [x2, y2] = this.getVertexCoordinates(1);

    const distanceToFirstPoint = Math.hypot(x - x1, y - y1);
    const distanceToSecondPoint = Math.hypot(x - x2, y - y2);
    const lineLength = Math.hypot(x1 - x2, y1 - y2);

    const sumOfDistances = distanceToFirstPoint + distanceToSecondPoint;
    const errorMargin = 0.1;

    return (
      sumOfDistances < lineLength + errorMargin &&
      sumOfDistances > lineLength - errorMargin
    );
  }

  getMiddle() {
    const [x1, y1] = this.getVertexCoordinates(0);
    const [x2, y2] = this.getVertexCoordinates(1);

    return [(x1 + x2) / 2, (y1 + y2) / 2];
  }

  movePoint(index, newCoordinates) {
    this.updateVertexCoordinates(newCoordinates, index);
  }

  resize(idx, newCoor) {
    const idx2 = idx === 0 ? 1 : 0; // Determine the fixed point's index

    // Get the original vector components
    const deltaX = this.vertexData[idx * 6] - this.vertexData[idx2 * 6];
    const deltaY = this.vertexData[idx * 6 + 1] - this.vertexData[idx2 * 6 + 1];

    // Calculate the new vector components relative to the fixed point
    const newDeltaX = newCoor[0] - this.vertexData[idx2 * 6];
    const newDeltaY = newCoor[1] - this.vertexData[idx2 * 6 + 1];

    // Normalize both the original and new vectors
    const magnitude = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const newMag = Math.sqrt(newDeltaX ** 2 + newDeltaY ** 2);
    const normX = deltaX / magnitude;
    const normY = deltaY / magnitude;
    const normNewX = newDeltaX / newMag;
    const normNewY = newDeltaY / newMag;

    // Calculate the dot product to determine the alignment direction
    const dotProduct = normX * normNewX + normY * normNewY;

    // Use the dot product to determine if the new point extends or retracts the line
    // A positive dot product means the new point extends in the same direction
    const adjustedMag = dotProduct > 0 ? newMag : -newMag;

    // Calculate the exact new coordinates using the original angle and the adjusted magnitude
    const newX = this.vertexData[idx2 * 6] + normX * adjustedMag;
    const newY = this.vertexData[idx2 * 6 + 1] + normY * adjustedMag;

    // Update the vertex coordinates to resize the line
    if (
      newX !== this.vertexData[idx2 * 6] ||
      newY !== this.vertexData[idx2 * 6 + 1]
    ) {
      this.updateVertexCoordinates([newX, newY], idx);
    }
  }
}
