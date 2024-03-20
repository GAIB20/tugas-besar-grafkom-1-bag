function deleteObject() {
    if (selectStatus) {
        shapes.splice(selectedIndex, 1);
        selectStatus = false;
        clearSelectedPoints();
    }
}

function clearCanvas() {
    shapes = [];
    
    selectStatus = false;
    clearSelectedPoints();
}