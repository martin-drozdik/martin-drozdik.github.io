"use strict";

var orderCrossover = function (left, right, start, end)
{
    var size = left.length;
    var child = new Array(size);
    for (var i = start; i < end; ++i)
    {
        child[i] = left[i];
    }
    var c = end;
    var r = end;
    c = c % size;
    r = r % size;
    while (c != start)
    {
        if (child.indexOf(right[r]) === -1)
        {
            child[c] = right[r];
            ++c;
            c %= size;
        }
        ++r;
        r %= size;
    }
    return child;
};
