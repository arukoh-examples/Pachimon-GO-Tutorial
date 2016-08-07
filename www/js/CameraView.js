CameraView = function(element, onEnterFrame) {
    var self = this;
    
    element.parentNode.style.overflow = "hidden";
    this.canvas = document.createElement('canvas');
    this.canvas.width  = element.offsetWidth;
    this.canvas.height = element.offsetHeight;
    element.appendChild(this.canvas);
    
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = 'rgb(0,0,0)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.onEnterFrame = onEnterFrame;
    this.stream;

    this.video = document.createElement('video');
    this.video.style.display = "none";
    this.video.autoplay = "true";
    element.appendChild(this.video);
    
    function tick() {
        requestAnimationFrame(tick);
        if (self.video.readyState === self.video.HAVE_ENOUGH_DATA) {
            self.context.drawImage(self.video, 0, 0, self.canvas.width, self.canvas.height);
            if (self.onEnterFrame) {
                imageData = self.context.getImageData(0, 0, self.canvas.width, self.canvas.height);
                self.onEnterFrame(self.context, imageData);
            }
        }
    };

    var getUserMedia = function(videoSource) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia) {
            function successCallback(stream) {
                self.stream = stream;
                if (window.URL) {
                    self.video.src = window.URL.createObjectURL(stream);
                } else if (window.webkitURL) {
                    self.video.src = window.webkitURL.createObjectURL(stream);
                } else if (video.mozSrcObject !== undefined) {
                    self.video.mozSrcObject = stream;
                } else {
                    self.video.src = stream;
                }
            }
            function errorCallback(error) {
                alert("The following error occured: " + err);
            }
            
            var constraints = {video: true};
            if (videoSource !== null) {
                constraints = { video: { optional: [{sourceId: videoSource}] } };
            }
            navigator.getUserMedia(constraints, successCallback, errorCallback);
            requestAnimationFrame(tick);
        }
        else {
            alert("getUserMedia is not supported.");
        }    
    };
    
    MediaStreamTrack.getSources(function(sourceInfos) {
        var id = null;
        for (var i = 0; i != sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'video' && sourceInfo.facing === 'environment') {
                id = sourceInfo.id;
            } else {
                console.log('Some other kind of source: ' + sourceInfo.kind + ", " + sourceInfo.id);
            }
        }
        if (id !== null) {
            getUserMedia(id);
        } else {
            alert("Active camera is not found.");
        }
    });
}

CameraView.prototype.stop = function() {
    if (this.video !== undefined) {
        this.video.pause();
    }
    if (this.stream !== undefined) {
        this.stream.stop();
    }
    if (this.video !== undefined) {
        this.video.src = null;
    }
}