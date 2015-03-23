

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width  = width;
canvas.height = height;

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

var cities = [];

var render = function()
{
    clear();
    for (var i = 0; i < cities.length; ++i)
    {
        cities[i].render(c);
    }

};

var counter = 1;

canvas.onclick = function(e)
{
    var coordinates = getCanvasCoordinates(e);
    c.fillRect(coordinates.x, coordinates.y, 10, 10);
    c.fillStyle = "white";
    c.font = "bold 28px Arial";
    c.textBaseline = "top";
    c.fillText(coordinates.x + "  " + coordinates.y , 10, 10);
    cities.push(new City(coordinates.x, coordinates.y, "City " + counter++));
    render();
};

var saveButton = document.getElementById("save");

saveButton.onclick = function()
{
    var string = JSON.stringify(cities);
    window.open().document.write(string);
}