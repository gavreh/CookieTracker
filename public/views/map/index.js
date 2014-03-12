/* global _, Backbone, app:true */

(function() {
  'use strict';

  require([
    'esri/map',
    'esri/dijit/BasemapToggle',
    "esri/InfoTemplate",
    "esri/layers/FeatureLayer"
  ], function(
    Map, BasemapToggle, InfoTemplate, FeatureLayer) {

    app = app || {};

    app.MapView = Backbone.View.extend({
      el: '#mapContainer',


      initialize: function() {
        console.log("here1");
        console.log("initiliaze");
        this.initMap();
      },
      initMap: function() {
        console.log("initMap");
        var map = new Map("map", {
          center: [-90.274658203125, 38.61694335],
          zoom: 3,
          basemap: "topo"
        });

        var toggle = new BasemapToggle({
          map: map,
          basemap: "satellite"
        }, "BasemapToggle");
        toggle.startup();


        var infoTemplate = new InfoTemplate("Attributes", "${*}");
        var featureLayer = new FeatureLayer("http://localhost:3000/arcgis/Cookies/FeatureServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,
          infoTemplate: infoTemplate,
          outFields: ["*"]
        });
        map.addLayer(featureLayer);
      }
    });

    $(document).ready(function() {
      app.mapView = new app.MapView();
    });
  });
}());