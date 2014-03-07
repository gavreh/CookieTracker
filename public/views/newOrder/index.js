/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.NewOrder = Backbone.Model.extend({
    url: '/newOrder/',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      email: '',
      address: '',
      phone: '',
      paid: '',
      cookieorder: ''
    }
  });

  app.OrderView = Backbone.View.extend({
    el: '#newOrder',
    template: _.template($('#tmpl-neworder').html()),
    events: {
      'submit form': 'preventSubmit',
      'click .btn-contact': 'contact',
      'click .btn-geolocate': 'geolocate'
    },
    initialize: function() {
      this.model = new app.NewOrder();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.$el.find('[name="name"]').focus();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    contact: function() {
      this.$el.find('.btn-contact').attr('disabled', true);

      this.model.save({
        name: this.$el.find('[name="name"]').val(),
        email: this.$el.find('[name="email"]').val(),
        address: this.$el.find('[name="address"]').val(),
        phone: this.$el.find('[name="phone"]').val(),
        paid: this.$el.find('[name="paid"]').val(),
        location: this.$el.find('[name="location"]').val(),
        cookieorder: this.$el.find('[name="cookieorder"]').val()
      });
    },
    geolocate: function() {
      console.log("get current location!!");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log("cur position:", position.coords.latitude, position.coords.longitude);
          this.$el.find('[name="location"]').val(position.coords.latitude +","+ position.coords.longitude);
        }.bind(this));
      }
    }
  });

  $(document).ready(function() {
    app.OrderView = new app.OrderView();
  });
}());