class Shape {
    constructor(type, offset, shaderCount, color, coordinates) {
        this.type = type;
        this.offset = offset;
        this.shaderCount = shaderCount;
        this.vertexData = [...coordinates, ...color]; // Combine coordinates and color into a single array.
        this.baseColor = color; // Assign the base color directly.
    }
  
    draw(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexData), gl.STATIC_DRAW);
        gl.drawArrays(this.type, this.offset, this.shaderCount);
    }
  
    getVertexData() {
        return this.vertexData;
    }
  
    getPointCount() {
        return this.vertexData.length / 6; // Assuming 6 values per point (x, y, r, g, b, a)
    }
  
    setVertexData(newVertexData) {
        this.vertexData = newVertexData;
    }
  
    calculateAngleBetweenPoints(coord, middlePoint) {
        const angle = Math.atan2(coord[1] - middlePoint[1], coord[0] - middlePoint[0]);
        return angle;
    }
  
    getVertexColor(index) {
        const colorStartIndex = index * 6 + 2;
        return this.vertexData.slice(colorStartIndex, colorStartIndex + 4);
    }
  
    updateGLColor(gl, colorUniformLocation) {
        gl.uniform4f(colorUniformLocation, ...this.baseColor);
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

    
    isPointWithinErrorMargin(coord) {
        const errorMargin = 5;
        const pointCount = this.getPointCount();
        for (let i = 0; i < pointCount; i++) {
            if (
                Math.abs(this.vertexData[i * 6] - coord[0]) <= errorMargin &&
                Math.abs(this.vertexData[i * 6 + 1] - coord[1]) <= errorMargin
            ) {
                return { isEndpoint: true, pointIndex: i };
            }
        }
        return { 
            isEndpoint: false, pointIndex: -1 
        };
    }
}
  