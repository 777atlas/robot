
function Robot () {
	this.img = new Image();   
	this.img.onload = function(){
	};

	this.punto_colision= new CollisionPoint(this, 270, 5);
	this.getCenter= function(){
		return {
			x: this.x,
			y: this.y
		};
	}
	this.girar=function(grados){
		if (!wait)
		{		
			this.inclinacion+=grados;
			set_wait();
		}
	}
	
}

var wait_timer;
var wait=false;

function set_wait() {
  clearTimeout(wait_timer);
  wait=true;
  wait_timer = setTimeout(function(){ wait=false }, 50);
}


// Keyboard event listeners
$(window).keydown(function(e){
	if (keys[e.keyCode] !== 'undefined'){
		keys[e.keyCode] = true;
		// e.preventDefault();
	}
});
$(window).keyup(function(e){
	if (keys[e.keyCode] !== 'undefined'){
		keys[e.keyCode] = false;
		// e.preventDefault();
	}
});

// Keyboard Variables
var key = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39
};

var keys = {
	38: false,
	40: false,
	37: false,
	39: false
};


function speedXY (rotation, speed) {
	return {
		x: Math.sin(rotation * TO_RADIANS) * speed,
		y: Math.cos(rotation * TO_RADIANS) * speed * -1,
	};
}

var x=10,y=10;

function step(robot) {

		var speedAxis = speedXY(robot.inclinacion, robot.velocidad);
		robot.x += speedAxis.x;
		robot.y += speedAxis.y;

		if (robot.punto_colision.isHit(sensor)){
			sensor_activo();
		}
}
function draw (robot) {
	context.clearRect(0,0,ctxW,ctxH);
	context.drawImage(mapa, 0, 0);
	drawRotatedImage(robot.img, robot.x, robot.y, robot.inclinacion);
}

function inicio() {
	step(robot);
	draw(robot);
	window.requestAnimationFrame(inicio);
}


var canvas   = document.getElementById('canvas'),
	context  = canvas.getContext('2d'),
	ctxW     = canvas.width,
	ctxH     = canvas.height
;





function HitMap(img){
	var self = this;
	this.img = img;

	// only do the drawing once the
	// image has downloaded
	if (img.complete){
		this.draw();
	} else {
		img.onload = function(){
			self.draw();
		};
	}
}
HitMap.prototype = {
	draw: function(){
		// first create the canvas
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.img.width;
		this.canvas.height = this.img.height;
		this.context = this.canvas.getContext('2d');
		// draw the image on it
		this.context.drawImage(this.img, 0, 0);
	},
	isHit: function(x, y){
        if (this.context){
            // get the pixel RGBA values
            var pixel = this.context.getImageData(x, y, 1, 1);
            if (pixel){
                // we consider a hit if the Red
                // value is 0
                return pixel.data[0] === 0;
            } else {
                return false;
            }
        } else {
            return false;
        }
	}
};

function CollisionPoint (robot, rotation, distance) {
	this.robot = robot;
	this.rotation = rotation;
	this.distance = distance || this.distance;
}
CollisionPoint.prototype = {
	robot: null,
	rotation: 0,
	distance: 20,
	getXY: function(){
		return rotatePoint(
					this.robot.getCenter(),
					this.robot.inclinacion + this.rotation,
					this.distance
				);
	},
    isHit: function(hitMap){
        var xy = this.getXY();
        return hitMap.isHit(xy.x, xy.y);
    }
};

function CollisionRadius () {
}
CollisionRadius.prototype = {
	x: 0,
	y: 0,
	radius: 10,
	check: function(coords){
	}
};


var TO_RADIANS = Math.PI/180;
function drawRotatedImage(image, x, y, angle) {
 
	// save the current co-ordinate system
	// before we screw with it
	context.save();
 
	// move to the middle of where we want to draw our image
	context.translate(x, y);
 
	// rotate around that point, converting our
	// angle from degrees to radians
	context.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image
	context.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	context.restore();
}

function rotatePoint (coords, angle, distance) {
	return {
		x: Math.sin(angle * TO_RADIANS) * distance + coords.x,
		y: Math.cos(angle * TO_RADIANS) * distance * -1 + coords.y,
	};
}

function drawPoint (xy) {
	context.fillRect(xy.x,xy.y,1,1);
}

function distance (from, to) {
	var a = from.x > to.x ? from.x - to.x : to.x - from.x,
		b = from.y > to.y ? from.y - to.y : to.y - from.y
		;
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {

    window.requestAnimationFrame = ( function() {

        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
        };

    }());

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}