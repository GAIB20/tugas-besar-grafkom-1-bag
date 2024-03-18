var util = new Utility();
var canvas = document.querySelector("#canvas");
var gl = canvas.getContext("webgl");

var shapes = {
    lines: [],
    squares: [],
    rectangles: [],
    polygons: [],
}

var clickedModes = {
    line: { click: false, hover: false },
    square: { click: false, hover: false },
    rectangle: { click: false, hover: false },
    polygon: { click: false },
};

async function main() {
    if (!gl) {
        window.alert("Error initializing WebGL");
        return;
    }

    var program = await util.createDefaultShaderProgram(gl);
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorUniformLocation = gl.getAttribLocation(program, "a_color");
    var vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    // enabling the attribute so that we can take data from the buffer
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorUniformLocation);

    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(colorUniformLocation, 4, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    drawScene();

    function drawScene() {
        util.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Using the default program
        gl.useProgram(program);

        // Setting the resolution
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        try {
            shapes.lines.forEach((l) => {
                l.draw(gl);
            });
        } catch (e) {
            console.log(e.message);
        }
        window.requestAnimationFrame(drawScene);
    }
}

main();
