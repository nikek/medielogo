"use strict";

var Medielogo = Medielogo || function(size){

  // Methods
  var _mouseXY = function() {
    var p1 = d3.mouse(this);
    pointer.px = p1[0];
    pointer.py = p1[1];
    force.resume();
  };

  var _touchXY = function(e) {
    if (!e)
      var e = event;
    e.preventDefault();
    pointer.px = e.targetTouches[0].pageX - can.offsetLeft;
    pointer.py = e.targetTouches[0].pageY - can.offsetTop;
    force.resume();
  };

  var _removePointer = function(){
    pointer.px = -999;
    pointer.py = -999;
    force.resume();
  };

  var _update = function(e) {
    k = 0.1 * e.alpha * size/10;

    context.clearRect(0, 0, size, size);
    context.drawImage(logo, size*0.192, size*0.13, size/1.304347826, size/1.304347826);

    for (var i = 0, len = nodes.length-1; i < len; i++) {
      xC = xCoords[i%5];
      yC = yCoords[Math.floor(i/5)];

      d = nodes[i];
      d.x += xC * k;
      d.y += yC * k;
      context.fillRect(d.x, d.y, d.side, d.side);
    }
  };


  // Variables
  var size = size || 300;
  var d, k, xC, yC;
  var xCoords = [-4, -2, 0, 2, 4];  //((i%5)-2)*2;
  var yCoords = [-3, -1, 1, 3];     //yC > 1 ? ((yC-2)*2)+1 : ((yC-1)*2)-1; 


  // Logo background
  var logo = d3.select("body").append("img")
    .attr("style", "display:none")
    .attr("src", "img/medielogo_bg.png")
    .node();


  // Canvas
  var canvas = d3.select("body").append("canvas")
    .attr("width", size)
    .attr("height", size);

  var context = canvas.node().getContext("2d");
  context.fillStyle = "#e1ca25";


  // Generate nodes
  var nodes = d3.range(20).map(function(i) {
    return {
      side: size/21.428571429,
      x:(i%5)*(size/5)+(size/10),
      y:Math.floor(i/5)*(size/4)+(size/8)
    };
  });


  // Add mouse node
  nodes.push({ side: 1, fixed: true, x:-size, y:-size });
  var pointer = nodes[nodes.length-1];


  // Setup force
  var force = d3.layout.force()
    .gravity(0.34)
    .friction(0.89)
    .charge(function(d, i) { return i !== nodes.length-1 ? 0 : size/2; })
    .nodes(nodes)
    .size([size, size]);

  force.on("tick", _update);
  force.start();


  // User Events
  canvas.on("mousemove", _mouseXY);
  canvas.on("mouseout", _removePointer);

  var can = canvas.node();
  can.addEventListener("touchstart", _touchXY);
  can.addEventListener("touchmove", _touchXY, true);
  can.addEventListener("touchend", _removePointer);

};