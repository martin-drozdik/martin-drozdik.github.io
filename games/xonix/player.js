"use strict";

var Player = function (x, y, game)
{
    this.maxX = game.width  - 1;
    this.maxY = game.height - 1;
    this.x = x;
    this.y = y;
    this.running = false;
    this.color = "red";
    this.leftPoints  = [];
    this.rightPoints = [];
};

Player.prototype =
{
    moveLeft : function()
    {
        if (this.xPos > 0)
        {
            --this.x;
        }
    },
    moveRight : function()
    {
        if (this.xPos < this.maxX)
        {
            ++this.x;
        }
    },
    moveUp : function()
    {
        if (this.yPos > 0)
        {
            --this.y;
        }
    },
    moveDown : function()
    {
        if (this.yPos < this.maxY)
        {
            ++this.y;
        }
    },

    get xPos () {return Math.round(this.x);},
    get yPos () {return Math.round(this.y);}
};