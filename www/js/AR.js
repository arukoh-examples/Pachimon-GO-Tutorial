var detector = new AR.Detector();

var ar = function(context, imageData) {
    var markers = detector.detect(imageData);
    drawCorners(context, markers);
    drawId(context, markers);
}

function drawCorners(context, markers) {
    var corners, corner, i, j;
    
    context.lineWidth = 3;
    for (i = 0; i !== markers.length; ++ i) {
        corners = markers[i].corners;
        
        context.strokeStyle = "red";
        context.beginPath();
        for (j = 0; j !== corners.length; ++ j) {
            corner = corners[j];
            context.moveTo(corner.x, corner.y);
            corner = corners[(j + 1) % corners.length];
            context.lineTo(corner.x, corner.y);
        }
        context.stroke();
        context.closePath();
        
        context.strokeStyle = "green";
        context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
    }
}

function drawId(context, markers) {
    var corners, corner, x, y, i, j;
    
    context.strokeStyle = "blue";
    context.lineWidth = 1;

    for (i = 0; i !== markers.length; ++ i) {
        corners = markers[i].corners;
        
        x = Infinity;
        y = Infinity;
        for (j = 0; j !== corners.length; ++ j) {
            corner = corners[j];
            x = Math.min(x, corner.x);
            y = Math.min(y, corner.y);
        }
        context.strokeText(markers[i].id, x, y);
    }
}