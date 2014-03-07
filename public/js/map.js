var map;
require([
  "esri/map",
  "esri/dijit/BasemapToggle",
  "dojo/domReady!"
], function(
  Map, BasemapToggle
) {

  map = new Map("map", {
    center: [-70.6508, 43.1452],
    zoom: 16,
    basemap: "topo"
  });

  var toggle = new BasemapToggle({
    map: map,
    basemap: "satellite"
  }, "BasemapToggle");
  toggle.startup();

});