"use strict";

;(function()
{
    var gameState = {score: 0, lives: 3, level: 1, percentage: 0};

    window.onload = function()
    {
        var level = new Level("canvas", gameState);
        level.start();
    };
})();
