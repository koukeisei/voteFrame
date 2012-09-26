function drawSingleChart(canvasId, maxValue, currentValue, framePosition, fillColor) {
    // return value: '-1'->wrong, '0'->not finished, '1'->done
    var canvas = document.getElementById(canvasId);
    if (canvas == null) {
        
        return '-1';
    }
    var context = canvas.getContext('2d');
    context.fillStyle = fillColor;
    
    var isDone = false;
    if (framePosition >= currentValue) {
        
        framePosition = currentValue;
        isDone = true;
    }
    var chartWidth = (framePosition * 1.0 / maxValue) * canvas.width;
    var chartHeight = canvas.height;
    context.fillRect(0, 0, chartWidth, chartHeight);
                
    if (isDone) {
        
        return '1';
    } else {
        
        return '0';
    }
}

function drawMultiCharts(finishState, canvasIds, maxValue, currentValueGroup, framePosition) {
    
    var allFinished = true;
    for (var i = 0; i < canvasIds.length; i++) {
        
        if (!finishState[i]) {
            
            allFinished = false;
            var isDone = drawSingleChart(canvasIds[i], maxValue, currentValueGroup[i], framePosition, '#FF0000');
            if (isDone == '1' || isDone == '-1') {
                // isDone value: '-1'->wrong, '0'->not finished, '1'->done
                // Of course if something wrong occured, we never cope with it
                finishState[i] = true;
            }
        }
    }
    
    if (allFinished) {
        
        return '1';
    } else {
        
        return '0';
    }
}

function startDrawingCharts(canvasIds, labelIds, currentValueGroup) {
    
    var maxValue = 0;
    
    for (var i = 0; i < canvasIds.length; i++) {
        // Fill backgroud of canvas
        var canvas = document.getElementById(canvasIds[i]);
        var context = canvas.getContext('2d');
        context.fillStyle = 'rgb(200, 200, 200)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Calculate maxValue
        maxValue += currentValueGroup[i];
        // Show labels with values
        var obj = document.getElementById(labelIds[i]);
        obj.innerHTML = currentValueGroup[i] + '•[';
    }
    
    var finishState = new Array();
    // Init finishState
    for (var i = 0; i < canvasIds.length; i++) {
        
        finishState.push(false);
    }
    
    var stepLength = maxValue * 1.0 / 100;
    var framePosition = 0;
    // Animate drawing process
    var id = setInterval(function() {
               
            framePosition += stepLength;
            var result = drawMultiCharts(finishState, canvasIds, maxValue, currentValueGroup, framePosition);
            if (result == '1') {
                // Done, stop 'setInterval'
                clearInterval(id);
            }
        },
    40);
}

function passData() {
    
    var canvasIds = new Array('canvas1', 'canvas2', 'canvas3', 'canvas4', 'canvas5',
                              'canvas6', 'canvas7', 'canvas8', 'canvas9');
    var currentValueGroup = new Array(6554, 5223, 1537, 2136, 1148, 1702, 1215, 137, 116);
    var labelIds = new Array('label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9');
    startDrawingCharts(canvasIds, labelIds, currentValueGroup);
}