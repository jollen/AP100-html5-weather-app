var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var moment = require('moment');

/**
* SETUP
**/
var app = app || {};

/**
* MODELS
**/
app.Message = Backbone.Model.extend({  
  url: function() {
    return 'http://api.openweathermap.org/data/2.5/weather?q=' + this.city + '&APPID=2ab10d1d7c261f5cb373916cc1cf107f';
  },
  city: '',
  defaults: {
    main: {
        temp: -1,
        humidity: -1
    },
    wind: {
        speed: -1
    },
    name: ''
  }
});

/**
* VIEWS
**/
app.MessageView = Backbone.View.extend({
    el: '#app',
    events: {
    },
    // constructor
    initialize: function() {
        this.model = new app.Message();
        this.template = _.template($('#weather-tmpl').html());

        this.model.bind('change', this.render, this);
        this.model.city = this.$el.data('city');

        this.model.fetch();
        //this.render();
    },
    render: function() {
        // Celsius
        var temp = this.model.get('main').temp;
        var celsius = parseInt(temp - 273.15);
        this.model.set('celsius', celsius);

        // Date
        var date = moment().format('LL');
        this.model.set('date', date);
        
        var html = this.template(this.model.attributes);
        this.$el.html(html);

        // Wind Scale
        var wind = this.model.get('wind').speed;
        var target = this.$el.find('.wi-icon');

        target.addClass('wi-beafort-' + wind);
    },
    reload: function(city) {
        this.model.city = city;
        this.model.fetch();
    }
});

/**
* BOOTUP
**/
$(document).ready(function() {
    app.messageView = new app.MessageView();

    $('.btn').each(function() {
        var self = $(this);
        self.click(function() {
            var city = self.html();
            app.messageView.reload(city);
            console.log('Switching to ' + city);
        });
    });
});
