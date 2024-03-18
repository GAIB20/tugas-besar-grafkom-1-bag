class Utility {
    constructor() {}
    /*
     *   Compiles a shader from source code.
     *
     *   @param webGLContext → The WebGL context.
     *   @param shaderSource → The source code for the shader.
     *   @param shaderType → The type of shader (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER).
     *   @return Compiled shader object.
     */
    compileShader(webGLContext, shaderSource, shaderType) {
        const shader = webGLContext.createShader(shaderType);
        webGLContext.shaderSource(shader, shaderSource);
        webGLContext.compileShader(shader);
    
        if (!webGLContext.getShaderParameter(shader, webGLContext.COMPILE_STATUS)) {
            const errorInfo = webGLContext.getShaderInfoLog(shader);
            webGLContext.deleteShader(shader);
            throw new Error(`Shader compilation failed: ${errorInfo}`);
        }
        return shader;
    }
  
    /*
     *  Links vertex and fragment shaders into a WebGL program.
     *
     *  @param webGLContext → The WebGL context.
     *  @param vtxShaderSourceId → ID of the DOM element containing the vertex shader source.
     *  @param fragShaderSourceId → ID of the DOM element containing the fragment shader source.
     *  @return Linked WebGL program.
     */
    async linkShadersIntoProgram(webGLContext, vtxShaderSourceId, fragShaderSourceId) {
        const program = webGLContext.createProgram();
        const fragShaderSource = document.getElementById(fragShaderSourceId).text;
        const vtxShaderSource = document.getElementById(vtxShaderSourceId).text;
    
        const fragmentShader = this.compileShader(webGLContext, fragShaderSource, webGLContext.FRAGMENT_SHADER);
        const vertexShader = this.compileShader(webGLContext, vtxShaderSource, webGLContext.VERTEX_SHADER);
    
        webGLContext.attachShader(program, vertexShader);
        webGLContext.attachShader(program, fragmentShader);
        webGLContext.linkProgram(program);
    
        if (!webGLContext.getProgramParameter(program, webGLContext.LINK_STATUS)) {
            const errorInfo = webGLContext.getProgramInfoLog(program);
            webGLContext.deleteProgram(program);
            throw new Error(`Program linking failed: ${errorInfo}`);
        }
        return program;
    }
  
    /*
     *  Create a default shader program.
     *
     *  @param webGLContext → The WebGL context.
     *  @return A default linked WebGL program.
     */
    async createDefaultShaderProgram(webGLContext) {
        const defaultProgram = await this.linkShadersIntoProgram(webGLContext, "vertexShader", "fragmentShader");
        return defaultProgram;
    }

    /**
     * Resizes a canvas element to match its display size.
     * 
     * This is useful for ensuring the canvas renders sharply by matching its
     * internal resolution to its size on the screen, which might be affected
     * by CSS styles or window resizing.
     *
     * @param {HTMLCanvasElement} canvas - The canvas element to resize.
     * @return {boolean} True if the canvas was resized, false otherwise.
     */
    resizeCanvasToDisplaySize(canvas) {
        // Determine the canvas's display size.
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        // Check if canvas's internal size matches its display size.
        const needsResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

        if (needsResize) {
            // Adjust canvas's internal size to match its display size.
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        return needsResize;
    }

    /**
     * Converts a hex color code to an RGB array.
     * 
     * @param {string} hex - The hex color code.
     * @return {Array<number>|null} The RGB representation as an array if successful, or null if invalid input.
     */
    hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const expandedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

        // Match the full hex form
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);
        return result ? [
            parseInt(result[1], 16), // Convert R component to decimal
            parseInt(result[2], 16), // Convert G component to decimal
            parseInt(result[3], 16)  // Convert B component to decimal
        ] : null;
    }
    
    /**
     * Converts a hex color code to an RGBA array with the alpha value set to 1.
     * 
     * @param {string} hex - The hex color code.
     * @return {Array<number>} The RGBA representation as an array.
     */
    hexToRgba(hex) {
        const rgb = this.hexToRgb(hex);
        if (rgb) {
            return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1]; // Normalize RGB values and add alpha
        } else {
            throw new Error('Invalid hex color code.');
        }
    }

    getCanvasCoord(e) {
        var x = e.clientX;
        var y = e.clientY;
        var rect = e.target.getBoundingClientRect();

        return [x - rect.left, y - rect.top];
    }
}
  