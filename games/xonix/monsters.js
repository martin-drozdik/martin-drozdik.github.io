"use strict";

var Monster = function (position, speed, game)
{
    this.game = game;
    this.position = position;
    this.speed = speed;
    this.color = "white";
};

Monster.prototype =
{
    move : function()
    {
        var thisX = this.position.roundedX;
        var thisY = this.position.roundedY;
        var extrapolatedPos = geometry.vectorSum(this.position, this.speed);
        var nextX = extrapolatedPos.roundedX;
        var nextY = extrapolatedPos.roundedY;

        if (this.game.field[thisX][nextY] === this.game.FIELD.FULL)
        {
            this.speed.y = -this.speed.y;
        }
        if (this.game.field[nextX][thisY] === this.game.FIELD.FULL)
        {
            this.speed.x = -this.speed.x;
        }
        this.position.addVector(this.speed);
    }
};