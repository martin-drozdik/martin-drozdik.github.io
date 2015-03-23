"use strict";

var width = 900;
var height = 636;

;(function()
{
    var canvas = document.getElementById("canvas");
    var clearButton = document.getElementById("clear");
    var c = canvas.getContext("2d");
    var backGroundImage = new Image();
    backGroundImage.src = "tsp/images/USA.png";

    canvas.width  = width;
    canvas.height = height;
    resetCities();
    var path = new Path(cities);

    var getCanvasCoordinates = function(event)
    {
        var bb = canvas.getBoundingClientRect();
        var x = (event.clientX-bb.left)*(canvas.width /bb.width);
        var y = (event.clientY-bb.top )*(canvas.height/bb.height);
        return {"x" : x, "y" : y};
    };

    var clear = function()
    {
        c.clearRect ( 0 , 0 , canvas.width, canvas.height);
    };

    var drawBackground = function()
    {
        var scale =  width / backGroundImage.width;
        c.drawImage(backGroundImage, 0, 0, backGroundImage.width * scale, backGroundImage.height * scale);
    };

    var render = function()
    {
        clear();
        drawBackground();
      /*  for (var i = 0; i < 33; ++i)
        {
            path.indices.push(i);
        }
        path.indices.push(0);
        path.updateValue();
      //  var string = JSON.stringify(path.indices);
      //  window.open().document.write(string);

        var a=  [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33];
        var b=  [1, 12, 9, 2, 8, 3, 6, 7, 5, 4, 10, 11, 18, 19, 20, 27, 28, 30, 31, 29, 32, 33, 23, 22, 24, 25, 26, 21, 15, 16, 17, 13, 14];


        var child = orderCrossover(a, b, 0, 10);
       // child.push(5);
        var string = JSON.stringify(child);
        window.open().document.write(string);
        for (var i = 0; i < child.length; ++i)
        {
            --child[i];
        }


        path.indices = child;
        path.updateValue();*/

        path.draw(c);
        for (var i = 0; i < cities.length; ++i)
        {
            cities[i].render(c);
        }
        c.fillStyle = City.colors.NORMAL;
        c.font = "bold 28px Arial";
        c.textBaseline = "bottom";
        c.textAlign = "start";
        var rounded = Math.round(path.value * 100) / 100;
        c.fillText("Length: " + rounded.toString() + "  miles", 10, height - 10);
    };

    var getClickedCity = function(coordinates)
    {
        for (var i = 0; i < cities.length; ++i)
        {
            if (cities[i].distanceTo(coordinates) < 2*City.prototype.radius)
            {
                return i;
            }
        }
        return -1;
    };

    canvas.onclick = function(e)
    {
        var coordinates = getCanvasCoordinates(e);
        var clicked = getClickedCity(coordinates);


        if (clicked != -1)
        {
            path.cityClicked(clicked);
        }
        render();
    };

    clearButton.onclick = function()
    {
        resetCities();
        path = new Path(cities);
        render();
    };



    window.onload = function()
    {
        render();
    };
})();
