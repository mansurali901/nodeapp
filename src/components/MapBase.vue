<template>
  <div class="map" ref="map" id="map-container" @drop="handleDrop" @dragover="handleDragover">
    <div class="is-hidden">{{mapopts}}</div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import polylabel from "polylabel";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

import bbox from "@turf/bbox";
import center from "@turf/center";

const WINDOW_FUDGE_FACTOR = 20;

export default {
  props: ["mapopts", "dragging", "selected"],
  beforeUpdate() {
    console.log("beforeUpdate", this.selected);
  },
  updated: function() {
    if (this.map && this.map.isStyleLoaded()) {
      this.updateMap(this.mapopts);
    } else {
      this.map = this.setupMap(this.mapopts);
    }
  },
  mounted: function() {
    window.addEventListener("resize", this.resize);
    this.resize();
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.resize);
  },
  watch: {
    selected(v) {
      if (this.map && this.map.isStyleLoaded()) {
        let s = this.map.draw;
        if (v.id) {
          s.changeMode("simple_select", { featureIds: [v.id] });
        } else {
          s.changeMode("simple_select", { featureIds: [] });
        }
      }
    }
  },
  methods: {
    pointInPolygon(pt) {
      let s = this.map.getSource("zones");
      let data = s.serialize().data;
      let z = data.features.find(f => {
        if (f.geometry.type == "Polygon") {
          return booleanPointInPolygon(pt, f);
        }
        return false;
      });
      return z;
    },
    pointsInPolygon(poly) {
      let s = this.map.getSource("zones");
      let data = s.serialize().data;
      let pts = data.features.filter(f => {
        if (f.geometry.type == "Point") {
          return booleanPointInPolygon(f, poly);
        }
        return false;
      });
      return pts;
    },
    handleDrop(e) {
      e.preventDefault();
      let data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (this.checkExisitingPoint(data)) {
        return;
      }
      let p = this.placePoint(e, data);

      let z = this.pointInPolygon(p);
      data.point = p.geometry.coordinates;
      if (z) {
        data.inside = z.properties;
      }
      this.$emit("drop", data);
    },
    handleDragover: function(e) {
      e.preventDefault();
      this.$emit("dragover", e);
    },
    checkExisitingPoint(data) {
      let d = this.map.getLayer(data.id);
      return !!d;
    },
    placePoint(e, data) {
      let p = new mapboxgl.Point(e.layerX, e.layerY);
      let latlng = this.map.unproject(p);
      let geo = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: latlng.toArray()
        },
        properties: {
          id: data.id,
          type: data.type,
          name: data.name
        }
      };
      this.map.draw.add(geo);
      return geo;
    },
    resize: function() {
      let p = this.$refs.map.parentNode;
      let box = p.getBoundingClientRect();
      this.$refs.map.style.height = box.height - WINDOW_FUDGE_FACTOR + "px";
    },
    fitPolygon: function(polygon) {
      let b = bbox(polygon);
      this.map.fitBounds(b, {
        linear: true,
        padding: { top: 25, bottom: 25, right: 25, left: 25 }
      });
    },
    pointsFromPolygons: function(geojson) {
      let pp = [];
      geojson.forEach(item => {
        if (item.geometry.type === "Polygon") {
          pp.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: polylabel(item.geometry.coordinates, 1.0)
            },
            properties: {
              name: item.properties.name,
              id: item.properties.id
            }
          });
        }
      });
      return pp;
    },
    handleAdd: function(e) {
      let f = e.features[0];
      if (f.geometry.type == "Polygon") {
        let features = this.pointsInPolygon(f);
        f.properties.inside = features.map(f => f.properties);
      }
      this.$emit("create", e.features[0]);
    },
    updateLabels(feature) {
      let d = this.map.getSource("labels");
      if (d && feature.geometry.type == "Polygon") {
        let points = feature.geometry.coordinates;
        let p = polylabel(points);
        let id = feature.properties.id;
        let newd = d.serialize().data;
        newd.features.forEach(item => {
          if (id === item.properties.id) {
            item.geometry.coordinates = p;
          }
        });
        d.setData(newd);
      }
    },
    handleUpdate(e) {
      let f = e.features[0];
      this.updateLabels(f);
      if (f.geometry.type == "Polygon") {
        let features = this.pointsInPolygon(f);
        f.properties.inside = features.map(f => f.properties);
      }
      if (f.geometry.type == "Point") {
        let z = this.pointInPolygon(f);
        if (z) {
          f.properties.inside = z.properties;
        }
      }
      this.$emit("update", f);
    },
    handleDelete(e) {
      let geo = e.features[0];
      if (geo.geometry.type === "Polygon") {
        //get points inside
        let features = this.pointsInPolygon(geo);
        geo.properties.inside = features.map(f => f.properties);
      }
      this.$emit("delete", geo);
    },
    handleSelection(e) {
      let geo = e.features[0];
      this.$emit("selected", geo);
    },
    updateMap(options) {
      let { indoor, opts, style, geojson, fitFeature, readonly } = options;
      let map = this.map;
      if (geojson) {
        let ds = map.getSource("zones");
        ds.setData({
          type: "FeatureCollection",
          features: geojson
        });
        let labelFeatures = this.pointsFromPolygons(geojson);
        let ls = map.getSource("labels");
        ls.setData({
          type: "FeatureCollection",
          features: labelFeatures
        });
        map.draw.set({
          type: "FeatureCollection",
          features: geojson
        });
      }
    },
    setupMap(options) {
      let {
        indoor,
        opts,
        style,
        geojson,
        fitFeature,
        readonly,
        pointsColor,
        pointsColorDraw,
        legend
      } = options;
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;

      let draw = new MapboxDraw({
        displayControlsDefault: false,
        userProperties: true,
        controls: {
          polygon: true,
          trash: true
        },
        styles: [
          {
            id: "highlight-active-points",
            type: "circle",
            filter: [
              "all",
              ["==", "$type", "Point"],
              ["==", "meta", "feature"],
              ["==", "active", "true"]
            ],
            paint: {
              "circle-radius": 6,
              "circle-color": "#f48f42"
            }
          },
          {
            id: "points-are-inactive",
            type: "circle",
            filter: [
              "all",
              ["==", "$type", "Point"],
              ["==", "meta", "feature"],
              ["==", "active", "false"]
            ],
            paint: {
              "circle-radius": 5,
              "circle-color": pointsColorDraw || "#4966b1"
            }
          },
          {
            id: "gl-draw-line",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "LineString"],
              ["==", "active", "false"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#4966b1",
              // "line-dasharray": [0.2, 2],
              "line-width": 2
            }
          },
          // polygon fill
          {
            id: "gl-draw-polygon-fill",
            type: "fill",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["!=", "mode", "static"]
            ],
            paint: {
              "fill-color": "#D20C0C",
              "fill-outline-color": "#D20C0C",
              "fill-opacity": 0.1
            }
          },
          // polygon outline stroke
          // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
          {
            id: "gl-draw-polygon-stroke-active",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["==", "active", "true"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#f48f42",
              "line-dasharray": [0.2, 2],
              "line-width": 2
            }
          },
          // vertex point halos
          {
            id: "gl-draw-polygon-and-line-vertex-halo-active",
            type: "circle",
            filter: [
              "all",
              ["==", "meta", "vertex"],
              ["==", "$type", "Point"],
              ["!=", "mode", "static"]
            ],
            paint: {
              "circle-radius": 5,
              "circle-color": "#f97f7f"
            }
          },
          // vertex points
          {
            id: "gl-draw-polygon-and-line-vertex-active",
            type: "circle",
            filter: [
              "all",
              ["==", "meta", "vertex"],
              ["==", "$type", "Point"],
              ["!=", "mode", "static"]
            ],
            paint: {
              "circle-radius": 3,
              "circle-color": "#f48f42"
            }
          },

          // INACTIVE (static, already drawn)
          // line stroke
          {
            id: "gl-draw-line-static",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "LineString"],
              ["==", "mode", "static"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#000",
              "line-width": 3
            }
          },
          // polygon fill
          {
            id: "gl-draw-polygon-fill-static",
            type: "fill",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["==", "mode", "static"]
            ],
            paint: {
              "fill-color": "#000",
              "fill-outline-color": "#000",
              "fill-opacity": 0.1
            }
          },
          // polygon outline
          {
            id: "gl-draw-polygon-stroke-static",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["==", "mode", "static"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#000",
              "line-width": 3
            }
          }
        ]
      });
      let mapopts = {
        container: "map-container",
        ...opts
      };
      if (style) {
        style.glyphs = "mapbox://fonts/mapbox/{fontstack}/{range}.pbf";
        mapopts.style = style;
      } else {
        mapopts.style = "mapbox://styles/mapbox/basic-v9";
        mapopts.glyphs = "mapbox://fonts/mapbox/{fontstack}/{range}.pbf";
      }
      let map = new mapboxgl.Map(mapopts);
      map.addControl(draw, "top-left");
      map.draw = draw;

      map.on("load", () => {
        if (readonly) {
          map.addSource("data", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: readonly.data
            }
          });
          if (readonly.points) {
            let pl = {
              id: "ro-points",
              source: "data",
              type: "symbol",
              layout: {
                "icon-image": "marker-15"
              },
              paint: {
                "icon-color": pointsColor || "#ffff00"
              },
              filter: ["==", "$type", "Point"]
            };
            map.addLayer(pl);
          }
          if (readonly.polygons) {
            map.addLayer({
              id: "ro-polygons",
              source: "data",
              type: "line",
              paint: {
                "line-color": "#4966b1"
              },
              filter: ["==", "$type", "Polygon"]
            });
          }
        }
        if (geojson) {
          map.addSource("zones", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: geojson
            }
          });
          let labelFeatures = this.pointsFromPolygons(geojson);
          map.addSource("labels", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: labelFeatures
            }
          });

          map.addLayer({
            id: "labels",
            source: "labels",
            type: "symbol",
            style: {
              glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
            },
            layout: {
              "symbol-placement": "point",
              "text-font": ["Open Sans Regular"],
              "text-field": "{name}"
            },
            paint: {
              "text-color": "navy",
              "text-opacity": 0.9
            }
          });

          let dids = draw.set({
            type: "FeatureCollection",
            features: geojson
          });
          if (fitFeature) {
            this.fitPolygon(fitFeature);
          }
        }
        map.on("draw.create", this.handleAdd);
        map.on("draw.update", this.handleUpdate);
        map.on("draw.delete", this.handleDelete);
        map.on("draw.selectionchange", this.handleSelection);
      });

      return map;
    }
  }
};
</script>

<style>
.map {
  flex: 1;
  min-height: 300px;
}
</style>


