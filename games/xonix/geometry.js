"use strict";

var geometry = {};

geometry.Vector2d = function(x, y)
{
    this.x = x;
    this.y = y;
};

geometry.Vector2d.prototype =
{
    get roundedX ()
    {
        return Math.round(this.x);
    },

    get roundedY ()
    {
        return Math.round(this.y);
    },

    addVector : function(v)
    {
        this.x += v.x;
        this.y += v.y;
    },

    scale : function(s)
    {
        this.x *= s;
        this.y *= s;
    },

    copy : function()
    {
        return new geometry.Vector2d(this.x, this.y);
    }
};

geometry.vectorSum = function(left, right)
{
    return new geometry.Vector2d(left.x + right.x, left.y + right.y);
};