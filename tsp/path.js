"use strict";

var Path = function(cities)
{
    this.cities = cities;
    this.indices = [];
    this.value = 0;
    this.first = 0;
    this.last = 0;
};

Path.prototype =
{
    getLength : function()
    {
        return this.indices.length;
    },

    getCity : function(i)
    {
        if (this.getLength() < i)
        {
            return null;
        }
        return this.cities[this.indices[i]];
    },

    colorCities : function()
    {
        for (var i = 0; i < this.cities.length; ++i)
        {
            this.cities[i].status = "NORMAL";
        }

        var firstCity = this.getCity(this.first);
        var lastCity  = this.getCity(this.last);
        if (firstCity)
        {
            firstCity.status = "FIRST";
        }
        if (lastCity)
        {
            lastCity.status = "LAST";
        }
    },

    draw : function(context)
    {
        if (this.indices.length === 0)
        {
            return;
        }

        var firstCity = this.getCity(0);
        context.moveTo(firstCity.position.x, firstCity.position.y);
        for (var i = 1; i < this.indices.length; ++i)
        {
            var nextCity = this.getCity(i);
            context.lineTo(nextCity.position.x, nextCity.position.y)
        }
        context.strokeStyle = "grey";
        context.lineWidth = 5;
        context.stroke();
    },

    updateValue: function()
    {
        this.value = 0;
        for (var i = 1; i < this.indices.length; ++i)
        {
            this.value += geometry.euclideanDistance(this.getCity(i-1).position,
                                                     this.getCity(i).position);
        }
        this.value *= 4.34; // Magic number to convert to miles.
    },

    isLastMove: function(i)
    {
        var connectingToLast = this.indices[0] === i;
        var allCitiesConnected = this.getLength() === this.cities.length;
        return  connectingToLast && allCitiesConnected;
    },

    containsCity: function(i)
    {
        return this.indices.indexOf(i) !== -1;
    },


    cityClicked: function(i)
    {
        if (this.indices.indexOf(i) === this.first && !this.isLastMove(i) && this.getLength() !== 1)
        {
            this.indices.splice(this.first, 1);
            --this.last;
        }
        else
        {
            if (!this.containsCity(i) || this.isLastMove(i))
            {
                this.insertCity(i);
            }
            else
            {
                this.removeCity(i);
            }
        }

        this.updateValue();
        this.colorCities();
    },

    insertCity : function(i)
    {
        if (this.getLength() === 0)
        {
            this.indices.push(i);
        }
        else
        {
            this.indices.splice(this.last+1, 0, i);
            ++this.last;
        }
    },

    removeCity : function(i)
    {
        var index = this.indices.indexOf(i);
        this.indices.splice(index, 1);
        this.last = index - 1;
        if (this.last < 0)
        {
            this.last = 0;
        }
    }
};
