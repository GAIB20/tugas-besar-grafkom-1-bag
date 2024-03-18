class Line extends Shape {
    constructor(gl, coordinates, color) {
        super(gl.LINES, 0, 2, color, coordinates);
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
    
        return sumOfDistances < lineLength + errorMargin && sumOfDistances > lineLength - errorMargin;
    }
  
    getMiddle() {
        const [x1, y1] = this.getVertexCoordinates(0);
        const [x2, y2] = this.getVertexCoordinates(1);
        
        return [(x1 + x2) / 2, (y1 + y2) / 2];
    }
  
    movePoint(index, newCoordinates) {
        this.updateVertexCoordinates(newCoordinates, index);
    }
  
    translate(newCoord, baseDistance) {
        const middle = this.getMiddle();
        const [dx, dy] = [newCoord[0] - middle[0], newCoord[1] - middle[1]];
        const [newDistanceX, newDistanceY] = [dx - baseDistance[0], dy - baseDistance[1]];
    
        this.vertexData[0] += newDistanceX;
        this.vertexData[1] += newDistanceY;
        this.vertexData[6] += newDistanceX;
        this.vertexData[7] += newDistanceY;
    }
  
    rotate(coord, middle) {
        const angle = this.calculateAngleBetweenPoints(coord, middle);
    
        const [x1, y1] = this.getVertexCoordinates(0);
        const [x2, y2] = this.getVertexCoordinates(1);
    
        const rotatePoint = (x, y) => [
            middle[0] + (x - middle[0]) * Math.cos(angle) - (y - middle[1]) * Math.sin(angle),
            middle[1] + (x - middle[0]) * Math.sin(angle) + (y - middle[1]) * Math.cos(angle),
        ];
    
        const [x1n, y1n] = rotatePoint(x1, y1);
        const [x2n, y2n] = rotatePoint(x2, y2);
    
        this.updateVertexCoordinates([x1n, y1n], 0);
        this.updateVertexCoordinates([x2n, y2n], 1);
    }
  
    dilate(scale, middle) {
        const scalePoint = (x, y) => [
            middle[0] + (x - middle[0]) * scale,
            middle[1] + (y - middle[1]) * scale,
        ];
    
        const [x1, y1] = this.getVertexCoordinates(0);
        const [x2, y2] = this.getVertexCoordinates(1);
    
        const [x1n, y1n] = scalePoint(x1, y1);
        const [x2n, y2n] = scalePoint(x2, y2);
    
        this.updateVertexCoordinates([x1n, y1n], 0);
        this.updateVertexCoordinates([x2n, y2n], 1);
    }
}
  