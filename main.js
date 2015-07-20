(function() {

/**
* SETUP
**/
var app = app || {};

/**
* MODELS
**/
app.Message = Backbone.Model.extend({  
  url: 'http://api.openweathermap.org/data/2.5/weather?q=Suzhou',
  defaults: {
    main: {
        temp: -1,
        humidity: -1
    }
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
        this.model.fetch();
        //this.render();
    },
    render: function() {
        var html = this.template(this.model.attributes);
        this.$el.html(html);

        $('.title').updateTitle();
    },
});

/**
* BOOTUP
**/
$(document).ready(function() {
	app.messageView = new app.MessageView();
});

}) ();

