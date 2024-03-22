class Rectangle extends Shape {
  constructor(gl, coordinates, color) {
    super(gl.TRIANGLE_FAN, 0, 4, color, coordinates, "rectangle");
  }

  changeLastCoord(coord) {
    for (let i = 0; i < 3; i++) {
      this.removeVertex(this.getPointCount() - 1);
    }
    this.firstHoverCoord(coord);
  }

  firstHoverCoord(coord) {
    this.appendVertex([coord[0], this.vertexData[1]]);
    this.appendVertex([coord[0], coord[1]]);
    this.appendVertex([this.vertexData[0], coord[1]]);
  }

  movePoint(index, newCoord) {
    const center = this.getMiddle();

    const nextIndex = (index + 1) % 4; // Assuming a shape with 4 points
    const initialAngle =
      Math.atan2(
        this.vertexData[nextIndex * 6 + 1] - center[1],
        this.vertexData[nextIndex * 6] - center[0]
      ) -
      Math.atan2(
        this.vertexData[index * 6 + 1] - center[1],
        this.vertexData[index * 6] - center[0]
      );

    // Normalize the angle to be within the range [0, 2π]
    const normalizedAngle =
      initialAngle >= 0 ? initialAngle : initialAngle + 2 * Math.PI;

    // Define angles for rotation based on the initial adjustment and subsequent rotations
    const rotationAngles = [
      normalizedAngle,
      Math.PI,
      normalizedAngle + Math.PI,
    ];

    // Set the moved point to the new coordinates
    this.vertexData[index * 6] = newCoord[0];
    this.vertexData[index * 6 + 1] = newCoord[1];

    // Calculate displacement from center to new point
    const displacementX = newCoord[0] - center[0];
    const displacementY = newCoord[1] - center[1];

    // Rotate and position the next three points based on calculated angles
    for (let i = 0; i < 3; i++) {
      const angle = rotationAngles[i];
      const rotatedX =
        displacementX * Math.cos(angle) - displacementY * Math.sin(angle);
      const rotatedY =
        displacementX * Math.sin(angle) + displacementY * Math.cos(angle);

      // Update the position of the next point
      const rotatedIndex = (index + i + 1) % 4; // Loop through the next three points
      this.vertexData[rotatedIndex * 6] = rotatedX + center[0];
      this.vertexData[rotatedIndex * 6 + 1] = rotatedY + center[1];
    }
  }

  resize(idx, newCoord) {
    // Calculate the index of the next vertex in the rectangle.
    const nextIdx = (idx + 1) % 4;
    const prevIdx = (idx + 3) % 4;

    // Get the coordinates of the current and next vertices.
    const currentX = this.vertexData[idx * 6];
    const currentY = this.vertexData[idx * 6 + 1];
    const prevX = this.vertexData[prevIdx * 6];
    const prevY = this.vertexData[prevIdx * 6 + 1];

    // Determine the direction vector from current to next vertex.
    let directionX = prevX - currentX;
    let directionY = prevY - currentY;

    // Normalize the direction vector.
    const length = Math.sqrt(directionX ** 2 + directionY ** 2);
    directionX /= length;
    directionY /= length;

    // Calculate the movement distance for the current vertex.
    const movementX = newCoord[0] - currentX;
    const movementY = newCoord[1] - currentY;
    const movementDistance = directionX * movementX + directionY * movementY;

    // Apply the movement to the current and next vertices.
    // Calculate the target positions
    const targetX = this.vertexData[idx * 6] + directionX * movementDistance;
    const targetY =
      this.vertexData[idx * 6 + 1] + directionY * movementDistance;

    // Check if the target position does not match the previous vertex's position
    if (
      !(
        this.vertexData[prevIdx * 6] === targetX &&
        this.vertexData[prevIdx * 6 + 1] === targetY
      )
    ) {
      this.vertexData[idx * 6] = targetX;
      this.vertexData[idx * 6 + 1] = targetY;
      this.vertexData[nextIdx * 6] += directionX * movementDistance;
      this.vertexData[nextIdx * 6 + 1] += directionY * movementDistance;
    }
  }
}
