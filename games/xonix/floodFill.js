"use strict";

var floodFill = function(getField, setField, startingPoint, startingColor, finalColor)
{
    if (getField(startingPoint) !== startingColor)
    {
        return 0;
    }

    var filled = 0;
    var stack = [];

    stack.push(startingPoint.copy());
    while (stack.length != 0)
    {
        var current = stack.pop();
        var west = current.copy();
        var east = current.copy();
        --west.x;
        ++east.x;
        while (getField(west) === startingColor)
        {
            --west.x;
        }
        while (getField(east) === startingColor)
        {
            ++east.x;
        }

        var iterator = west.copy();
        ++iterator.x;
        while(iterator.x < east.x)
        {
            setField(iterator, finalColor);
            ++filled;
            var north = iterator.copy();
            --north.y;
            var south = iterator.copy();
            ++south.y;
            if (getField(north) === startingColor)
            {
                stack.push(north);
            }
            if (getField(south) === startingColor)
            {
                stack.push(south);
            }
            ++iterator.x;
        }
    }

    return filled;
};