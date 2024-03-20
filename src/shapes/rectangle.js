class Rectangle extends Shape {
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

    firstHoverCoord(coord) {
        this.appendVertex([coord[0], this.vertexData[1]]);
        this.appendVertex([coord[0], coord[1]]);
        this.appendVertex([this.vertexData[0], coord[1]]);
    }
}