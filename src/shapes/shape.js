class Shape {
  constructor(type, offset, shaderCount, color, coordinates, kind, copy) {
    if (arguments.length === 7) {
      this.type = type;
      this.offset = offset;
      this.shaderCount = shaderCount;
      this.vertexData = coordinates;
      this.baseColor = color;
      this.kind = kind;
    } else {
      this.type = type;
      this.offset = offset;
      this.shaderCount = shaderCount;
      this.vertexData = [...coordinates, ...color];
      this.baseColor = color;
      this.kind = kind;
    }
  }

  draw(gl) {
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.vertexData),
      gl.STATIC_DRAW
    );
    gl.drawArrays(this.type, this.offset, this.shaderCount);
  }

  isInside(coord) {
    const [pointX, pointY] = coord;
    const pointCount = this.getPointCount();
    let isInside = false;

    for (let i = 0; i < pointCount; i++) {
      const x1 = this.vertexData[i * 6];
      const y1 = this.vertexData[i * 6 + 1];

      const nextIndex = (i + 1) % pointCount;
      const x2 = this.vertexData[nextIndex * 6];
      const y2 = this.vertexData[nextIndex * 6 + 1];

      const isPointBetweenYs = y1 > pointY !== y2 > pointY;

      const edgeAtPointY = ((x2 - x1) * (pointY - y1)) / (y2 - y1) + x1;

      if (isPointBetweenYs && pointX < edgeAtPointY) {
        isInside = !isInside;
      }
    }

    return isInside;
  }

  movePoint(index, newCoordinates) {}

  translate(newCoord, baseDistance) {
    const middle = this.getMiddle();
    const [dx, dy] = [newCoord[0] - middle[0], newCoord[1] - middle[1]];
    const [newDistanceX, newDistanceY] = [
      dx - baseDistance[0],
      dy - baseDistance[1],
    ];

    for (let i = 0; i < this.getPointCount(); i++) {
      this.vertexData[i * 6] += newDistanceX;
      this.vertexData[i * 6 + 1] += newDistanceY;
    }
  }

  translate(newCoord, baseDistance) {
    const middle = this.getMiddle();
    const [dx, dy] = [newCoord[0] - middle[0], newCoord[1] - middle[1]];
    const [newDistanceX, newDistanceY] = [
      dx - baseDistance[0],
      dy - baseDistance[1],
    ];

    for (let i = 0; i < this.getPointCount(); i++) {
      this.vertexData[i * 6] += newDistanceX;
      this.vertexData[i * 6 + 1] += newDistanceY;
    }
  }

  getMiddle() {
    let totalX = 0;
    let totalY = 0;
    const pointCount = this.getPointCount();

    for (let i = 0; i < pointCount; i++) {
      totalX += this.vertexData[i * 6];
      totalY += this.vertexData[i * 6 + 1];
    }

    const midX = totalX / pointCount;
    const midY = totalY / pointCount;

    return [midX, midY];
  }

  copyVertexData() {
    return [...this.vertexData];
  }

  getPointCount() {
    return this.vertexData.length / 6;
  }

  getBaseColor() {
    return this.baseColor;
  }

  setVertexColor(index, color) {
    this.vertexData[index * 6 + 2] = color[0];
    this.vertexData[index * 6 + 3] = color[1];
    this.vertexData[index * 6 + 4] = color[2];
    this.vertexData[index * 6 + 5] = color[3];
  }

  updateVertexCoordinates(coord, index) {
    const vertexStartIndex = index * 6;
    this.vertexData[vertexStartIndex] = coord[0];
    this.vertexData[vertexStartIndex + 1] = coord[1];
  }

  getVertexCoordinates(index) {
    const vertexStartIndex = index * 6;
    return this.vertexData.slice(vertexStartIndex, vertexStartIndex + 2);
  }

  appendVertex(coord, color = this.baseColor) {
    this.vertexData.push(coord[0], coord[1], ...color);
  }

  removeVertex(index) {
    this.vertexData.splice(index * 6, 6);
  }

  isPointWithinMargin(coord) {
    const errorMargin = 5;
    const pointCount = this.getPointCount();
    for (let i = 0; i < pointCount; i++) {
      if (
        Math.abs(this.vertexData[i * 6] - coord[0]) <= errorMargin &&
        Math.abs(this.vertexData[i * 6 + 1] - coord[1]) <= errorMargin
      ) {
        return { isEndPoint: true, pointIndex: i };
      }
    }
    return {
      isEndPoint: false,
      pointIndex: -1,
    };
  }

  rotate(initialVertex, baseCoord, coord, middle) {
    // Calculate initial and current angles
    let initialAngle = Math.atan2(
      baseCoord[1] - middle[1],
      baseCoord[0] - middle[0]
    );
    let currentAngle = Math.atan2(coord[1] - middle[1], coord[0] - middle[0]);

    // Determine the angle of rotation needed
    let angleDifference = currentAngle - initialAngle;

    let n = this.getPointCount();

    for (let i = 0; i < n; i += 1) {
      let x = initialVertex[i * 6] - middle[0];
      let y = initialVertex[i * 6 + 1] - middle[1];

      // Apply rotation based on the angle difference
      let newX = x * Math.cos(angleDifference) - y * Math.sin(angleDifference);
      let newY = x * Math.sin(angleDifference) + y * Math.cos(angleDifference);

      // Update vertex positions
      this.vertexData[i * 6] = newX + middle[0];
      this.vertexData[i * 6 + 1] = newY + middle[1];
    }
  }
}
