"use strict";

var scale = 10;
var KEYS = {LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40};
var Vector2d = geometry.Vector2d;
var winningPercentage = 75;

var generateDifficulty = function (level)
{
    var diff = {nMonsters: Math.round(1 + level/5), nCrawlers: 1, monsterSpeed: Math.sqrt(level/20)};
    return diff;
};

var randomInt = function(up, down)
{
    return Math.round(down + Math.random() * (up - down));
};
var flip = function()
{
    return Math.random() < 0.5;
};

var Level = function (canvasId, gameState)
{
    this.height = 64;
    this.width = 96;
    this.margin = 3;
    this.gameState = gameState;
    this.running = true;
    var canvas = document.getElementById(canvasId);
    this.c = canvas.getContext("2d");
    canvas.width  = this.width * scale;
    canvas.height = this.height * scale + scale*5;
    this.canvasHeight = canvas.height;
    this.canvasWidth = canvas.width;
    this.keyBoard = new KeyboardController;
    this.FIELD = {EMPTY : 0, FULL : 1, INCONSTRUCTION : 2, RIGHT_EVALUATED : 3, LEFT_EVALUATED : 4};
    this.COLORS = ["black", "green", "yellow", "magenta", "blue"];

    this.initialize(generateDifficulty(gameState.level));
};

Level.prototype =
{
    initialize : function(difficulty)
    {
        this.gameState.previousFull = 0;
        this.gameState.percentage = 0;
        this.player = new Player(this.width / 2, 0, this);
        this.field = new Array(this.width);
        this.monsters = [];

        for (var i = 0; i < this.width; ++i)
        {
            this.field[i] = new Array(this.height);
        }


        for (var i = 0; i < this.field.length; ++i)
        {
            for (var j = 0; j < this.field[i].length; ++j)
            {
                var margin = this.margin;
                if (i < margin || j < margin || i >= this.width - margin || j >= this.height - margin)
                {
                    this.field[i][j] = this.FIELD.FULL;
                }
                else
                {
                    this.field[i][j] = this.FIELD.EMPTY;
                }
            }
        }

        for (var i = 0; i < difficulty.nMonsters; ++i)
        {
            var min = this.margin * 2;
            var position = new geometry.Vector2d(randomInt(min, this.width  - min),
                                                 randomInt(min, this.height - min));
            var speed = new geometry.Vector2d(flip() ? -0.5 : 0.5,
                                              flip() ? -0.5 : 0.5);
            speed.scale(difficulty.monsterSpeed);
            this.monsters.push(new Monster(position, speed, this));
        }
    },

    tick : function()
    {
        if (!this.running)
        {
            return;
        }
        this.update();
        this.render();
        requestAnimationFrame(this.tick.bind(this));
    },

    start: function()
    {
        this.running = true;
        this.tick();
    },

    update: function ()
    {
        switch (this.keyBoard.lastKey)
        {
            case  KEYS.DOWN:
                if (this.keyBoard.keysPressed[KEYS.DOWN]  || this.player.running)
                {
                    this.player.moveDown();
                }
                break;
            case  KEYS.RIGHT:
                if (this.keyBoard.keysPressed[KEYS.RIGHT] || this.player.running)
                {
                    this.player.moveRight();
                }
                break;
            case  KEYS.UP:
                if (this.keyBoard.keysPressed[KEYS.UP]    || this.player.running)
                {
                    this.player.moveUp();
                }
                break;
            case  KEYS.LEFT:
                if (this.keyBoard.keysPressed[KEYS.LEFT]  || this.player.running)
                {
                    this.player.moveLeft();
                }
                break;
        }

        var i = Math.round(this.player.x);
        var j = Math.round(this.player.y);
        if (this.field[i][j] === this.FIELD.INCONSTRUCTION || this.hitByMonsters())
        {
            this.lose();
            return;
        }
        if (this.gameState.percentage >= winningPercentage)
        {
            this.win();
            return;
        }

        if (this.field[i][j] === this.FIELD.EMPTY)
        {
            this.player.running = true;
            switch (this.keyBoard.lastKey)
            {
                case KEYS.DOWN:
                    this.player.leftPoints.push({x: i + 1, y: j});
                    this.player.rightPoints.push({x: i - 1, y: j});
                    break;
                case KEYS.UP:
                    this.player.leftPoints.push({x: i - 1, y: j});
                    this.player.rightPoints.push({x: i + 1, y: j});
                    break;
                case KEYS.RIGHT:
                    this.player.leftPoints.push({x: i, y: j - 1});
                    this.player.rightPoints.push({x: i, y: j + 1});
                    break;
                case KEYS.LEFT:
                    this.player.leftPoints.push({x: i, y: j + 1});
                    this.player.rightPoints.push({x: i, y: j - 1});
                    break;
            }

            this.field[i][j] = this.FIELD.INCONSTRUCTION;
        }
        if (this.field[i][j] === this.FIELD.FULL)
        {
            if (this.player.running)
            {
                this.computeFill();
                this.player.leftPoints.length = 0;
                this.player.rightPoints.length = 0;
            }
            this.player.running = false;
        }

        for (var i = 0; i < this.monsters.length; ++i)
        {
            this.monsters[i].move();
        }
    },

    getField : function(coordinates)
    {
        return this.field[coordinates.roundedX][coordinates.roundedY];
    },

    setField : function(coordinates, field)
    {
        this.field[coordinates.roundedX][coordinates.roundedY] = field;
    },

    render: function ()
    {
        this.c.clearRect ( 0 , 0 , this.canvasWidth, this.canvasHeight );
        for (var i = 0; i < this.field.length; ++i)
        {
            for (var j = 0; j < this.field[i].length; ++j)
            {
                if (this.field[i][j] !== this.FIELD.EMPTY)
                {
                    this.fillField(i, j, this.COLORS[this.field[i][j]]);
                }
            }
        }
        this.fillField(this.player.x, this.player.y, this.player.color);
        for (var i = 0; i < this.monsters.length; ++i)
        {
            this.fillField(this.monsters[i].position.x,
                           this.monsters[i].position.y, this.monsters[i].color);
        }

        this.c.fillStyle = "white";
        this.c.font = "bold 28px Arial";
        this.c.textBaseline = this.c.textBaseline.bottom;
        this.c.fillText("SCORE", scale, this.canvasHeight - scale);
        this.c.fillText(this.gameState.score, 120, this.canvasHeight - scale);

        this.c.fillText("LIVES", 300, this.canvasHeight - scale);
        this.c.fillText(this.gameState.lives, 400, this.canvasHeight - scale);

        this.c.fillText("LEVEL", 500, this.canvasHeight - scale);
        this.c.fillText(this.gameState.level, 600, this.canvasHeight - scale);

        this.c.fillText("PERCENTAGE", 650, this.canvasHeight - scale);
        this.c.fillText(this.gameState.percentage, 870, this.canvasHeight - scale);
        this.c.fillText("/75", 900, this.canvasHeight - scale);
    },

    fillField: function (x, y, color)
    {
        this.c.fillStyle = color;
        this.c.fillRect(x * scale, y * scale, scale, scale);
    },

    replaceField: function (before, after)
    {
        for (var i = 0; i < this.field.length; ++i)
        {
            for (var j = 0; j < this.field[i].length; ++j)
            {
                if (this.field[i][j] === before)
                {
                    this.field[i][j] = after;
                }
            }
        }
    },

    floodFill : function(x, y, startingField, targetField)
    {
        var vec = new Vector2d(x,y);
        var self = this;
        var getter = function(c) {return self.getField(c);};
        var setter = function(c,f){return self.setField(c,f);};

        return floodFill(getter, setter, vec, startingField, targetField);
    },


    hitByMonsters : function()
    {
        return !this.noMonstersIn(this.FIELD.INCONSTRUCTION);
    },

    noMonstersIn : function(fieldType)
    {
        for (var i = 0; i < this.monsters.length; ++i)
        {
            if (this.getField(this.monsters[i].position) === fieldType)
            {
                return false;
            }
        }
        return true;
    },

    lose : function ()
    {
        if (this.gameState.lives <= 0)
        {
            this.running = false;
            return;
        }
        --this.gameState.lives;
        var newDifficulty = generateDifficulty(this.gameState.level);
        this.initialize(newDifficulty);
    },

    win : function ()
    {
        ++this.gameState.level;
        var newDifficulty = generateDifficulty(this.gameState.level);
        this.initialize(newDifficulty);
    },

    computeFullFields : function()
    {
        var full = 0;
        for (var i = this.margin; i < this.field.length - this.margin; ++i)
        {
            for (var j = this.margin; j < this.field[i].length - this.margin; ++j)
            {
                if (this.field[i][j] === this.FIELD.FULL)
                {
                    ++full;
                }
            }
        }
        var all = (this.height - this.margin)*(this.width - this.margin);
        return {nFields : full, percentage : Math.round(100*full / all)};
    },

    computeFill : function()
    {
        this.replaceField(this.FIELD.INCONSTRUCTION, this.FIELD.FULL);

        var leftStartingPoint = null;
        for (var i = 0; i < this.player.leftPoints.length; ++i)
        {
            if (this.field[this.player.leftPoints[i].x][this.player.leftPoints[i].y] === this.FIELD.EMPTY)
            {
                leftStartingPoint = this.player.leftPoints[i];
                break;
            }
        }
        var leftSize = leftStartingPoint ? this.floodFill(leftStartingPoint.x,
            leftStartingPoint.y,
            this.FIELD.EMPTY,
            this.FIELD.LEFT_EVALUATED) : 0;

        var rightStartingPoint = null;
        for (var i = 0; i < this.player.rightPoints.length; ++i)
        {
            if (this.field[this.player.rightPoints[i].x][this.player.rightPoints[i].y] === this.FIELD.EMPTY)
            {
                rightStartingPoint = this.player.rightPoints[i];
                break;
            }
        }
        var rightSize = rightStartingPoint ? this.floodFill(rightStartingPoint.x,
            rightStartingPoint.y,
            this.FIELD.EMPTY,
            this.FIELD.RIGHT_EVALUATED) : 0;

        rightSize = this.noMonstersIn(this.FIELD.RIGHT_EVALUATED) ? rightSize : Infinity;
        leftSize  = this.noMonstersIn(this.FIELD.LEFT_EVALUATED)  ? leftSize  : Infinity;

        if (rightSize === Infinity && leftSize === Infinity)
        {
            this.replaceField(this.FIELD.RIGHT_EVALUATED, this.FIELD.EMPTY);
            this.replaceField(this.FIELD.LEFT_EVALUATED,  this.FIELD.EMPTY);
        }
        else if (rightSize > leftSize)
        {
            this.replaceField(this.FIELD.LEFT_EVALUATED,  this.FIELD.FULL);
            this.replaceField(this.FIELD.RIGHT_EVALUATED, this.FIELD.EMPTY);
        }
        else
        {
            this.replaceField(this.FIELD.LEFT_EVALUATED,  this.FIELD.EMPTY);
            this.replaceField(this.FIELD.RIGHT_EVALUATED, this.FIELD.FULL);
        }


        var full = this.computeFullFields();
        var delta =  full.nFields - this.gameState.previousFull;
        this.gameState.previousFull = full.nFields;
        this.gameState.percentage = full.percentage;
        this.gameState.score += delta;
    }
};


var KeyboardController = function()
{
    this.keysPressed = {};
    this.lastKey = null;
    var self = this;
    window.onkeydown = function(e)
    {
        self.keysPressed[e.keyCode] = true;
        self.lastKey = e.keyCode;
    };
    window.onkeyup = function(e)
    {
        self.keysPressed[e.keyCode] = false;
    };
};