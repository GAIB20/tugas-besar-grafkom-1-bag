class Point extends Shape {
  constructor(gl, coordinates, color) {
    super(gl.POINTS, 0, 1, color, coordinates, "point");
  }
}
