class Polygon extends Shape {
  constructor(gl, coordinates, color, shaderCount) {
    if (arguments.length === 4) {
      super(gl.TRIANGLE_FAN, 0, shaderCount, color, coordinates, "copy");
    } else {
      super(gl.TRIANGLE_FAN, 0, 1, color, coordinates);
    }
  }

  /**
   * Determines the orientation of ordered triplet (p, q, r).
   * The function returns the following values:
   * 0  --> p, q, and r are collinear
   * 1  --> Clockwise
   * -1 --> Counterclockwise
   */
  orientation(p, q, r) {
    let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    return val == 0 ? 0 : val > 0 ? 1 : -1;
  }

  /**
   * Constructs the convex hull using the Jarvis March algorithm.
   * Updates the vertex array to only include vertices that are part of the convex hull.
   */
  convexHull() {
    let pointsCount = this.getPointCount();
    if (pointsCount < 3) return;

    let hull = [];
    // Find the leftmost point
    let leftIndex = 0;
    for (let i = 1; i < pointsCount; i++) {
      if (this.vertexData[i * 6] < this.vertexData[leftIndex * 6]) {
        leftIndex = i;
      }
    }

    // Start from leftmost point, keep moving counterclockwise until reach the start point again
    let startIndex = leftIndex,
      endIndex;
    do {
      // Add current point to hull
      hull.push(
        this.vertexData[startIndex * 6],
        this.vertexData[startIndex * 6 + 1],
        this.vertexData[startIndex * 6 + 2],
        this.vertexData[startIndex * 6 + 3],
        this.vertexData[startIndex * 6 + 4],
        this.vertexData[startIndex * 6 + 5]
      );

      endIndex = (startIndex + 1) % pointsCount;
      for (let i = 0; i < pointsCount; i++) {
        // If the point i is more counterclockwise than the current endPoint, then update endPoint
        if (
          this.orientation(
            [
              this.vertexData[startIndex * 6],
              this.vertexData[startIndex * 6 + 1],
            ],
            [this.vertexData[i * 6], this.vertexData[i * 6 + 1]],
            [this.vertexData[endIndex * 6], this.vertexData[endIndex * 6 + 1]]
          ) === -1
        ) {
          endIndex = i;
        }
      }
      startIndex = endIndex;
    } while (startIndex !== leftIndex); // While we don't come to the first point

    this.vertexData = [...hull]; // Update the polygon vertices to the hull vertices
    this.shaderCount = this.vertexData.length / 6;
  }

  addCoordinate(coordinate) {
    this.appendVertex(coordinate);
    this.shaderCount++;
    this.convexHull();
  }

  removeCoordinate(index) {
    this.removeVertex(index);
    this.shaderCount--;
  }

  movePoint(index, coordinate) {
    this.removeVertex(index);
    this.appendVertex(coordinate);
    this.convexHull();
  }

  resize(index, newCoord) {
    const [centerX, centerY] = this.getMiddle();
    const pointCount = this.getPointCount();

    // Get the original coordinates of the selected point
    const originalX = this.vertexData[index * 6];
    const originalY = this.vertexData[index * 6 + 1];

    // Calculate the original and new distances from the selected point to the center
    const originalDistance = Math.sqrt(
      Math.pow(originalX - centerX, 2) + Math.pow(originalY - centerY, 2)
    );
    const newDistance = Math.sqrt(
      Math.pow(newCoord[0] - centerX, 2) + Math.pow(newCoord[1] - centerY, 2)
    );

    // Determine the scale factor
    const scaleFactor = newDistance / originalDistance;

    // Calculate original and new angles from the center to the point
    const originalAngle = Math.atan2(originalY - centerY, originalX - centerX);
    const newAngle = Math.atan2(newCoord[1] - centerY, newCoord[0] - centerX);

    // Determine the angle difference
    let angleDifference = newAngle - originalAngle;

    // Apply the scale factor and rotation to all points in the polygon
    for (let i = 0; i < pointCount; i++) {
      const x = this.vertexData[i * 6];
      const y = this.vertexData[i * 6 + 1];
      const distanceToCenter = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      const scaledDistance = distanceToCenter * scaleFactor;

      // Preserve the angle to the center and apply the angle difference
      const angleToCenter =
        Math.atan2(y - centerY, x - centerX) + angleDifference;

      // Calculate the new position with rotation
      this.vertexData[i * 6] =
        centerX + Math.cos(angleToCenter) * scaledDistance;
      this.vertexData[i * 6 + 1] =
        centerY + Math.sin(angleToCenter) * scaledDistance;
    }

    // Explicitly set the selected point to the new coordinates to avoid rounding errors
    this.vertexData[index * 6] = newCoord[0];
    this.vertexData[index * 6 + 1] = newCoord[1];
  }
}
