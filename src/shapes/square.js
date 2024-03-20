class Square extends Shape {
    constructor(gl, coordinates, color) {
        super(gl.TRIANGLE_FAN, 0, 4, color, coordinates);
    }

    isInside(coordinate) {
        const [x, y] = coordinate;
        const [x1, y1] = this.getVertexCoordinates(0);
        const [x2, y2] = this.getVertexCoordinates(2);

        const xInside = (x > x1 && x < x2) || (x < x1 && x > x2);
        const yInside = (y > y1 && y < y2) || (y < y1 && y > y2);

        return xInside && yInside;
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
}