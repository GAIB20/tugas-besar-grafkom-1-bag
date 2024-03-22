class Square extends Shape {
  constructor(gl, coordinates, color) {
    super(gl.TRIANGLE_FAN, 0, 4, color, coordinates);
  }

  changeLastCoord(coord) {
    for (let i = 0; i < 3; i++) {
      this.removeVertex(this.getPointCount() - 1);
    }
    this.firstHoverCoord(coord);
  }

  firstHoverCoord(currentCoord) {
    const xDistance = Math.abs(currentCoord[0] - this.vertexData[0]);
    const yDistance = Math.abs(currentCoord[1] - this.vertexData[1]);
    const sideLength = Math.max(xDistance, yDistance);

    const xDirection = currentCoord[0] > this.vertexData[0] ? 1 : -1;
    const yDirection = currentCoord[1] > this.vertexData[1] ? 1 : -1;

    const newX = this.vertexData[0] + xDirection * sideLength;
    const newY = this.vertexData[1] + yDirection * sideLength;

    this.appendVertex([newX, this.vertexData[1]]);
    this.appendVertex([newX, newY]);
    this.appendVertex([this.vertexData[0], newY]);
  }

  movePoint(index, newCoord) {
    const center = this.getMiddle();

    this.vertexData[index * 6] = newCoord[0];
    this.vertexData[index * 6 + 1] = newCoord[1];

    // Calculate the offset from the center to the new point
    let offsetX = newCoord[0] - center[0];
    let offsetY = newCoord[1] - center[1];

    // Define rotation angles (90, 180, and 270 degrees in radians)
    const rotationAngles = [Math.PI / 2, Math.PI, (Math.PI * 3) / 2];

    // Rotate the next three points around the center
    for (let i = 0; i < 3; i++) {
      const angle = rotationAngles[i];
      const rotatedX = offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
      const rotatedY = offsetX * Math.sin(angle) + offsetY * Math.cos(angle);

      // Calculate the new position of the point and update it
      const newIndex = (index + i + 1) % 4; // Assuming a shape with 4 points
      this.vertexData[newIndex * 6] = rotatedX + center[0];
      this.vertexData[newIndex * 6 + 1] = rotatedY + center[1];
    }
  }

  resize(index, newCoord) {
    const center = this.getMiddle();

    const deltaX = this.vertexData[index * 6] - center[0];
    const deltaY = this.vertexData[index * 6 + 1] - center[1];

    const newDeltaX = newCoord[0] - center[0];
    const newDeltaY = newCoord[1] - center[1];

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
    const exactNewX = center[0] + normX * adjustedMag;
    const exactNewY = center[1] + normY * adjustedMag;

    this.movePoint(index, [exactNewX, exactNewY]);
  }
}
