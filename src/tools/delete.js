function deleteObject() {
    if (selectStatus) {
        shapes.splice(shapes.length - 1, 1);
        selectStatus = false;
        clearSelectedPoints();
    }
}

function clearCanvas() {
    shapes = [];
    
    selectStatus = false;
    clearSelectedPoints();
}