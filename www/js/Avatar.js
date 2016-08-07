Avatar = function(canvas, skin) {
    var self = this;
    
    this.canvas = canvas;
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;

    var world = tQuery.createWorld().boilerplate({stats: false, cameraControls: false}).start();
    world.appendTo(canvas);
    world.tCamera().position.z = 1.8;
    
    world.tRenderer().setClearColor(0xffffff, 0);
    world.tRenderer().setSize(this.width, this.height);
    
    this.avatar = new tQuery.MinecraftChar({ skinUrl: skin});
    this.avatar.model.addTo(world);
    
    world.loop().hook(function(delta, now) {
        var angle = 1/2 * now*Math.PI*2;
        self.avatar.parts.armR.rotation.x = 1.4 * Math.cos(angle + Math.PI);
        self.avatar.parts.armL.rotation.x = 1.4 * Math.cos(angle);
        self.avatar.parts.legR.rotation.x = 1.4 * Math.cos(angle);
        self.avatar.parts.legL.rotation.x = 1.4 * Math.cos(angle + Math.PI);
    });
    
    world.loop().hook(function(delta, now) {
        self.avatar.parts.headGroup.rotation.x = Math.sin(now*1.5)/3;
        self.avatar.parts.headGroup.rotation.y = Math.sin(now)/3;
    });
}

Avatar.prototype.move = function(x, y) {
    this.canvas.style.top = (y - this.height/2).toString() + "px";
    this.canvas.style.left = (x - this.width/2).toString() + "px";
}

Avatar.prototype.rotate = function(x, y, z) {
    this.avatar.model.rotation(x, y, z);
}

Avatar.prototype.changeSkin = function(skin) {
    this.avatar.loadSkin(skin);
}
