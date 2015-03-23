"use strict";

var City = function(position, name)
{
    this.position = position;
    this.name = name;
};

City.prototype =
{
    radius : 8,
    status : "NORMAL",

    render : function(context)
    {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = City.colors[this.status];
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();
    //    this.writeText(context);
    },

    writeText : function(context)
    {
        context.fillStyle = "white";
        context.font = "bold 18px Arial";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillText(this.name, this.position.x, this.position.y);
    },

    distanceTo : function(position)
    {
        return geometry.euclideanDistance(this.position, position);
    }
};

City.colors =
{
    NORMAL : '#28536C' ,
    FIRST : '#AA8C39',
    LAST : '#AA5439'
};
