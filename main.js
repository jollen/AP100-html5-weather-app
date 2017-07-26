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
    },
    wind: {
        speed: -1
    },
    date: '',
    celsius: 0
  }
});

app.Post = Backbone.Model.extend({ 
  id: null,
  url: function() {
        return (this.id === null) ? 'http://localhost:3000/1/post' : 'http://localhost:3000/1/post/' + this.id;
  },
  defaults: {
    posts: []
  }
});

/**
* VIEWS
**/
app.PostView = Backbone.View.extend({
    el: '#post',
    events: {
        'click .btn-delete': 'delete'
    },
    initialize: function() {
        this.model = new app.Post();
        this.template = _.template($('#post-tmpl').html());

        this.model.bind('change', this.render, this);
        this.model.fetch({
            success: function(model, response, options) {
            }
        });
    },
    render: function() {
        var html = this.template(this.model.attributes);
        this.$el.html(html);
    },
    delete: function(e) {
        var me = this.$el.find(e.target);
        var id = me.data('post-id');
        
        this.model.id = id;
        this.model.destroy({
            success: function(model, response, options) {
                model.id = null;
            }
        });
    }
});

app.ActionView = Backbone.View.extend({
    el: '#action',
    events: {
        'click .btn-save': 'save'
    },
    initialize: function() {
        this.model = new app.Post();
    },
    save: function(e) {
        e.preventDefault();

        var title = this.$el.find('#subject').val();
        var content = this.$el.find('#content').val();

        this.model.save({
            title: title,
            content: content
        }, {
            success: function(model, response, options) {
                app.postView.model.fetch();
            }
        });
    }
});

app.MessageView = Backbone.View.extend({
	el: '#app',
	events: {
	},
    // constructor
    initialize: function() {
        this.model = new app.Message();
        this.template = _.template($('#weather-tmpl').html());

        this.model.bind('change', this.render, this);
        this.model.fetch({
            success: function(model, response, options) {
                // Celsius
                var temp = model.get('main').temp;
                var celsius = parseInt(temp - 273.15);
                model.set('celsius', celsius);

                // Date
                var date = moment().format('LL');
                model.set('date', date);
            }
        });
    },
    render: function() {
        var html = this.template(this.model.attributes);
        this.$el.html(html);

        // Wind Scale
        var wind = this.model.get('wind').speed;
        var target = this.$el.find('.wi-icon');

        target.addClass('wi-beafort-' + wind);
    },
});

/**
* BOOTUP
**/
$(document).ready(function() {
	//app.messageView = new app.MessageView();
    app.postView = new app.PostView();
    app.actionView = new app.ActionView();
});

}) ();

