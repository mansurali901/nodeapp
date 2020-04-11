<template>
  <nav-layout>
    <nav class="breadcrumb spaced" aria-label="breadcrumbs">
      <ul>
        <li>
           <router-link :to="{name:'setup-sites',params:{orgid: orgid}}">Sites</router-link>
        </li>
        <li>
          <router-link :to="{name:'setup-areas',params:{orgid,id}}">{{site.name}}</router-link>
        </li>
        <li class="is-active">
          <a href="#" aria-current="page">{{area.name}}</a>
        </li>
      </ul>
    </nav>
    <saving-mask :show="savingLocations"/>
    <div class="main">
      <h2 class="title">{{areaName}}</h2>
      <div class="section">
        <p
          class="help is-info"
          v-if="area.areaLocation == AREA_OUTDOOR">Here you can edit the area polygon, add/edit/delete zones</p>
        <p
          class="help is-info"
          v-if="area.areaLocation == AREA_INDOOR">Here you can add/edit/delete zones, locations, gateways, access points</p>
      </div>
      <div class="section">
        <h2
          class="subtitle has-text-primary has-text-centered"
          v-if="(area && !area.polygon && area.areaLocation == AREA_OUTDOOR)">Draw a polygon to complete the area setup</h2>
      </div>
      <div class="level">
        <div class="list zones">
          <div class="title-bar">Zones</div>
          <div class="tool-bar" v-if="zonechecked > 0">
            <button
              class="button is-link is-small"
              v-if="zonechecked === 1"
              @click="actionZoneEditHandler">Edit</button>
            <button class="button is-danger is-small" @click="actionZoneDeleteHandler">Delete</button>
          </div>
          <div class="tool-bar" v-if="zonechecked === 0">
            <p class="is-size-7">To add a zone use the polygon tool</p>
          </div>
          <zones-list
            :zones="zones"
            @selected="zoneChecked"
            @clicked="zoneClicked"
            @selectAll="selectAllZones"
          />
        </div>
        <map-base
          :mapopts="mapopts"
          :selected="selected"
          @drop="(d)=>{d.areaId=this.areaid;handleDrop(d)}"
          @dragover="handleDragover"
          @create="handleCreate"
          @update="handleUpdate"
          @delete="handleDelete"
          @selected="handleSelected"
        />
        <div class="area-map-legend" v-if="area && area.indoor">
          <ul>
            <li class="legend-item">
              <span class="location-item"></span>Location
            </li>
            <li class="legend-item">
              <span class="gateway-item"></span>Gateway
            </li>
            <li class="legend-item">
              <span class="ap-item"></span>Access Point
            </li>
          </ul>
        </div>
        <div class="list" v-if="area && area.indoor">
           <button class="button is-info is-small" @click="handlePlacedToggle">{{toggletext}}</button>
          <div class="tabs">
            <ul>
              <li :class="{'is-active' : currentTab===LOCATION_TAB}">
                <a @click="setTab(LOCATION_TAB)">Locations</a>
              </li>
              <li :class="{'is-active' : currentTab===ACCESS_POINT_TAB}">
                <a @click="setTab(ACCESS_POINT_TAB)">Access Points</a>
              </li>
              <li :class="{'is-active' : currentTab===GATEWAY_TAB}">
                <a @click="setTab(GATEWAY_TAB)">Gateways</a>
              </li>
            </ul>
          </div>
          <div class="tool-bar" v-if="area && area.indoor && currentTab==LOCATION_TAB">
            <button
              v-if="!checked"
              class="button is-primary is-small"
              @click="actionHandler">Bulk Upload</button>
            <button v-if="!checked" class="button is-link is-small" @click="actionAddHandler">Add</button>
            <button
              v-if="checked===1"
              class="button is-link is-small"
              @click="actionEditHandler">Edit</button>
            <button
              v-if="checked"
              class="button is-danger is-small"
              @click="actionDeleteHandler">Delete</button>
            <button
              v-if="checked"
              class="button is-warning is-small"
              @click="actionWipeHandler">Wipe</button>
            <button :disabled="locations.length ==0"
              class="button is-small"
              @click="actionLBExport">Export</button>
          </div>
          <div class="tool-bar" v-if="area && area.indoor && currentTab==ACCESS_POINT_TAB">
            <button
              v-if="!apchecked"
              class="button is-primary is-small"
              @click="actionAPFileHandler">Bulk Upload</button>
            <button
              v-if="!apchecked"
              class="button is-link is-small"
              @click="actionAPAddHandler">Add</button>
            <button
              v-if="apchecked===1"
              class="button is-link is-small"
              @click="actionAPEditHandler">Edit</button>
            <button
              v-if="apchecked"
              class="button is-danger is-small"
              @click="actionAPDeleteHandler">Delete</button>
            <button
              v-if="apchecked"
              class="button is-warning is-small"
              @click="actionAPWipeHandler">Wipe</button>
            <button :disabled="accesspoints.length == 0"
              class="button is-small"
              @click="actionAPExport">Export</button>
          </div>
          <div class="tool-bar" v-if="area && area.indoor && currentTab==GATEWAY_TAB">
            <button
              v-if="!gwchecked"
              class="button is-primary is-small"
              @click="actionGWFileHandler">Bulk Upload</button>
            <button
              v-if="!gwchecked"
              class="button is-link is-small"
              @click="actionGWAddHandler">Add</button>
            <button
              v-if="gwchecked===1"
              class="button is-link is-small"
              @click="actionGWEditHandler">Edit</button>
            <button
              v-if="gwchecked"
              class="button is-danger is-small"
              @click="actionGWDeleteHandler">Delete</button>
            <button
              v-if="gwchecked"
              class="button is-warning is-small"
              @click="actionGWWipeHandler">Wipe</button>
            <button :disabled="accesspoints.length == 0"
              class="button is-small"
              @click="actionGWExport">Export</button>
          </div>
          <div class="scrollable">
            <locations-list
              v-if="currentTab === LOCATION_TAB && area && area.indoor"
              :locations="locations"
              @dragstart="handleDragstart"
              @dragend="handleDragend"
              @selectAll="selectAllLocations"
              @click="locationClicked"
              @selected="locationChecked"/>
            <gateways-list
              v-if="currentTab === GATEWAY_TAB && area && area.indoor"
              :gateways="gateways"
              @dragstart="handleDragstart"
              @dragend="handleDragend"
              @selectAll="selectAllGateways"
              @click="gatewayClicked"
              @selected="gatewayChecked">Gateway list here</gateways-list>
            <accesspoints-list
              v-if="currentTab === ACCESS_POINT_TAB && area && area.indoor"
              :accesspoints="accesspoints"
              @dragstart="handleDragstart"
              @dragend="handleDragend"
              @selectAll="selectAllAccesspoints"
              @click="accesspointClicked"
              @selected="accesspointChecked">Accesspoint list here</accesspoints-list>
          </div>
        </div>
      </div>
    </div>
    <zone-modal
      class="zone-modal"
      :vzone="checkedZones[0] || {}"
      :show="showZoneModal"
      @save="handleZoneSave"
      @cancel="handleZoneCancel"></zone-modal>
    <confirm-modal
      :title="confirmTitle"
      :primary="confirmPrimary"
      :show="showConfirm"
      :msg="confirmMsg"
      @save="handleConfirmSave"
      @cancel="handleConfirmCancel"></confirm-modal>
    <upload-modal
      :show="showFileModal"
      title="Upload Locations"
      @save="handleFileSave"
      @cancel="handleFileCancel">
      <div class="content">
        <p>CSV format, include following header row</p>
        <p>name, mac_address</p>
      </div>
    </upload-modal>
    <upload-modal
      :show="showGWFileModal"
      title="Upload Gateways"
      @save="handleGWFileSave"
      @cancel="handleGWFileCancel">
      <div class="content">
        <p>CSV format, include following header row</p>
        <p>name, node_address</p>
      </div>
    </upload-modal>
    <upload-modal
      :show="showAPFileModal"
      title="Upload Access Points"
      @save="handleAPFileSave"
      @cancel="handleAPFileCancel">
      <div class="content">
        <p>CSV format, include following header row</p>
        <p>name, mac_address</p>
      </div>
    </upload-modal>
    <location-modal
      class="location-modal"
      :vlocation="checkedLocations[0] || {}"
      :show="showLocationModal"
      @save="handleLocationSave"
      @cancel="handleLocationCancel"></location-modal>
    <gateway-modal
      class="location-modal"
      :vgateway="checkedGateways[0] || {}"
      :show="showGatewayModal"
      @save="handleGatewaySave"
      @cancel="handleGatewayCancel"></gateway-modal>
    <accesspoint-modal
      class="location-modal"
      :vaccesspoint="checkedAccesspoints[0] || {}"
      :show="showAccesspointModal"
      @save="handleAccesspointSave"
      @cancel="handleAccesspointCancel"></accesspoint-modal>
  </nav-layout>
</template>


<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import constants from "@/constants";
import ZonesList from "@/components/ZonesList";
import LocationsList from "@/components/LocationsList";
import GatewaysList from "@/components/GatewaysList";
import ActionButton from "@/components/ActionButton";
import ActionButtons from "@/components/ActionButtons";
import SearchBox from "@/components/SearchBox";
import NavLayout from "@/components/NavLayout";
import MapBase from "@/components/MapBase";
import ZoneModal from "@/components/ZoneModal";
import ConfirmModal from "@/components/ConfirmModal";
import UploadModal from "@/components/UploadModal";
import SavingMask from "@/components/SavingMask";
import LocationModal from "@/components/LocationModal";
import GatewayModal from "@/components/GatewayModal";
import AccesspointModal from "@/components/AccesspointModal";
import AccesspointsList from "@/components/AccesspointsList";

//zones
const ADD_ZONE_ACTION = 0;
const UPDATE_ZONE_ACTION = 1;
const DELETE_ZONE_ACTION = 2;
const UPDATE_ZONE_ONLY_ACTION = 16;
//locations
const ADD_LOCATION_ACTION = 3;
const DELETE_LOCATION_ACTION = 4;
const UPDATE_LOCATION_ACTION = 5;
const WIPE_LOCATION_POINT_ACTION = 6;
//area
const UPDATE_AREA_POLYGON = 7;
//gateways
const ADD_GATEWAY_ACTION = 8;
const UPDATE_GATEWAY_ACTION = 9;
const DELETE_GATEWAY_ACTION = 10;
const WIPE_GATEWAY_POINT_ACTION = 11;
//accesspoints
const ADD_ACCESSPOINT_ACTION = 12;
const UPDATE_ACCESSPOINT_ACTION = 13;
const DELETE_ACCESSPOINT_ACTION = 14;
const WIPE_ACCESSPOINT_POINT_ACTION = 15;

export default {
  props: ["id", "areaid","orgid"],
  data() {
    return {
      AREA_OUTDOOR: constants.AREA_OUTDOOR,
      AREA_INDOOR: constants.AREA_INDOOR,
      LOCATION_TAB: 0,
      GATEWAY_TAB: 1,
      ACCESS_POINT_TAB: 2,
      dragging: false,
      checked: 0,
      gwchecked: 0,
      apchecked: 0,
      zonechecked: 0,
      zonelist: [],
      showZoneModal: false,
      showConfirm: false,
      confirmMsg: false,
      confirmTitle: "",
      confirmAction: false,
      confirmPrimary: "Save",
      showFileModal: false,
      showDeleteConfirm: false,
      showLocationModal: false,
      showGatewayModal: false,
      showGWFileModal: false,
      showAPFileModal: false,
      showAccesspointModal: false,
      inited: false,
      currentTab: 0,
      selected: {},
      locationsToggled: false
    };
  },
  components: {
    ZonesList,
    LocationsList,
    GatewaysList,
    ActionButtons,
    ActionButton,
    SearchBox,
    NavLayout,
    MapBase,
    ZoneModal,
    ConfirmModal,
    UploadModal,
    SavingMask,
    LocationModal,
    GatewayModal,
    AccesspointModal,
    AccesspointsList
  },
  mounted() {
    this.reset();
    this.getArea(this.areaid);
    this.getSite(this.id);
    this.listGateways({ siteid: this.id, areaid: this.areaid });
    this.listZones({ siteid: this.id, areaid: this.areaid });
    this.listLocations({ siteid: this.id, areaid: this.areaid });
    this.listAccesspoints({ siteid: this.id, areaid: this.areaid });
  },
  beforeDestroy() {
    let n = document.getElementById("dragging");
    if (n) {
      n.remove();
    }
    this.clearArea();
  },
  methods: {
    ...mapMutations(["select","selectAll"]),
    ...mapMutations("setup", [
      "reset",
      "setMapopts",
      "selectZone",
      "currentZone",
      "currentGateway",
      "selectGateway",
      "gatewayDragged",
      "currentLocation",
      "selectLocation",
      "locationDragged",
      "currentAccesspoint",
      "selectAccesspoint",
      "currentArea",
      "toggleAllProperty"
    ]),
    ...mapActions("setup", [
      "addZone",
      "getSite",
      "listZones",
      "creatZone",
      "deleteZone",
      "updateZone",
      "updateZoneOnly",
      "deleteLocation",
      "deleteLocations",
      "addLocation",
      "bulkSaveLocations",
      "listLocations",
      "updateLocations",
      "updateLocation",
      "wipeLocations",
      "exportLocations",
      "clearArea",
      "getArea",
      "updateArea",
      "listGateways",
      "addGateway",
      "updateGateway",
      "updateGateways",
      "deleteGateways",
      "deleteGateway",
      "bulkSaveGateways",
      "wipeGateways",
      "exportGateways",
      "listAccesspoints",
      "addAccesspoint",
      "updateAccesspoint",
      "updateAccesspoints",
      "deleteAccesspoints",
      "deleteAccesspoint",
      "bulkSaveAccesspoints",
      "wipeAccesspoints",
      "exportAccesspoints"
    ]),

    setTab(tab) {
      this.currentTab = tab;
    },
    handleDragstart(e, data) {
      let dt = e.dataTransfer;
      dt.setData("text/plain", data.name);
      dt.setData("application/json", JSON.stringify(data));

      dt.effectAllowed = "move";
      let canvas = document.getElementById("dragging");
      if (!canvas) {
        canvas = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "canvas"
        );
        canvas.id = "dragging";
        canvas.width = canvas.height = 20;

        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 4;
        ctx.fillStyle = "#23d160";
        ctx.strokeStyle = "#22c65b";
        ctx.beginPath();
        ctx.arc(10, 10, 5, 0, Math.PI * 2, false); // Outer circle
        ctx.fill();
        ctx.stroke();

        document.body.append(canvas);
      }

      dt.setDragImage(canvas, 10, 10);
    },
    handleDragend(e, data) {
      if (data.type == "gateway") {
        this.gatewayDragged(data);
      } else if (data.type == "accesspoint") {
        //TODO
      } else {
        this.locationDragged(data);
      }
    },
    handleDrop(data) {
      if (data.type == "gateway") {
        let gw = data;
        this.updateGateway(gw);
      } else if (data.type == "accesspoint") {
        this.updateAccesspoint(data);
      } else {
        let location = data;
        if (location.inside) {
          location.zoneId = location.inside.id;
        }
        this.updateLocation(location);
      }
    },
    handleDragover() {},
    handleCreate(data) {
      if (!this.area.indoor && !this.area.polygon) {
        //need area polygon first get that going
        this.confirmAction = UPDATE_AREA_POLYGON;
        this.confirmTitle = "Save Area Polygon";
        this.confirmMsg = "Save changes to area polygon?";
        this.currentArea(this.makeArea(data));
        this.showConfirm = true;
        return;
      }
      this.confirmAction = ADD_ZONE_ACTION;
      this.showZoneModal = true;
      this.currentZone(this.makeZone(data));
    },
    actionHandler() {
      this.showFileModal = true;
    },
    actionDeleteHandler() {
      let checked = this.locations.filter(l => l.checked);
      let numloc = checked.length;
      this.confirmMsg = `Delete ${numloc} location(s)?`;
      this.confirmTitle = "Delete Locations";
      this.confirmAction = DELETE_LOCATION_ACTION;
      this.confirmPrimary = "Delete";
      this.showConfirm = true;
    },
    actionAddHandler() {
      this.showLocationModal = true;
    },
    actionEditHandler() {
      this.showLocationModal = true;
    },
    actionWipeHandler() {
      let checked = this.locations.filter(l => l.checked);
      let numloc = checked.length;
      this.confirmTitle = "Wipe Location Points";
      this.confirmMsg = `Wipe ${numloc} location point(s)?`;
      this.confirmAction = WIPE_LOCATION_POINT_ACTION;
      this.showConfirm = true;
    },
    // Table interaction handler
    handleSave() {
      if (this.confirmAction === DELETE_LOCATION_ACTION) {
        let selected = this.locations.filter(l => l.checked);
        this.deleteLocations({ siteid: this.id, locations: selected });
        this.checked = 0;
      } else if (this.confirmAction === UPDATE_ZONE_ACTION) {
        this.updateZone(this.zone);
      } else if (this.confirmAction === UPDATE_ZONE_ONLY_ACTION) {
        this.updateZoneOnly(this.zone);
      } else if (this.confirmAction === DELETE_ZONE_ACTION) {
        let zone = this.zones.filter(z => z.checked)
        if (zone) {
          zone.forEach(z=>{
            this.deleteZone(z);
          })
        }
        this.zonechecked = 0;
      } else if (this.confirmAction === ADD_ZONE_ACTION) {
        this.addZone(this.zone);
      } else if (this.confirmAction === WIPE_LOCATION_POINT_ACTION) {
        let selected = [];
        this.locations.forEach(s => {
          if (s.checked) {
            s.areaId = null;
            s.point = null;
            s.zoneId = null;
            selected.push(s);
          }
        });
        this.inited = false;
        this.wipeLocations(selected);
      } else if (this.confirmAction === UPDATE_AREA_POLYGON) {
        this.updateArea(this.area);
      } else if (this.confirmAction === ADD_LOCATION_ACTION) {
        this.addLocation(this.location);
      } else if (this.confirmAction === UPDATE_LOCATION_ACTION) {
        this.updateLocation(this.location);
      } else if (this.confirmAction == ADD_GATEWAY_ACTION) {
        this.addGateway(this.gateway);
      } else if (this.confirmAction == UPDATE_GATEWAY_ACTION) {
        this.updateGateway(this.gateway);
      } else if (this.confirmAction === DELETE_GATEWAY_ACTION) {
        let selected = this.gateways.filter(g => g.checked);
        this.deleteGateways({ siteid: this.id, gateways: selected });
        this.gwchecked = 0;
      } else if (this.confirmAction == WIPE_GATEWAY_POINT_ACTION) {
        let selected = [];
        this.gateways.forEach(s => {
          if (s.checked) {
            s.point = null;
            s.areaId = null;
            selected.push(s);
          }
        });
        this.inited = false;
        this.wipeGateways(selected);
      } else if (this.confirmAction == ADD_ACCESSPOINT_ACTION) {
        this.addAccesspoint(this.accesspoint);
      } else if (this.confirmAction == UPDATE_ACCESSPOINT_ACTION) {
        this.updateAccesspoint(this.accesspoint);
      } else if (this.confirmAction === DELETE_ACCESSPOINT_ACTION) {
        let selected = this.accesspoints.filter(g => g.checked);
        this.deleteAccesspoints({ siteid: this.id, accesspoints: selected });
        this.gwchecked = 0;
      } else if (this.confirmAction == WIPE_ACCESSPOINT_POINT_ACTION) {
        let selected = [];
        this.accesspoints.forEach(s => {
          if (s.checked) {
            s.point = null;
            s.areaId = null;
            selected.push(s);
          }
        });
        this.inited = false;
        this.wipeAccesspoints(selected);
      }
    },
    makeArea(maparea) {
      let a = { ...this.area };
      a.polygon = maparea.geometry.coordinates;
      return a;
    },
    makeZone(mapzone) {
      //id, name, polygon, need areaid, siteid
      let zone = {
        areaId: this.areaid,
        siteId: this.id,
        name: mapzone.properties.name,
        polygon: mapzone.geometry.coordinates[0]
      };
      if (mapzone.properties.id) {
        zone.id = mapzone.properties.id;
      }
      if (mapzone.properties.inside) {
        zone.locations = mapzone.properties.inside;
      }
      return zone;
    },
    makeLocation(mappoint) {
      let l = {
        id: mappoint.properties.id,
        areaId: this.areaid,
        siteId: this.id,
        zoneId: mappoint.properties.inside
          ? mappoint.properties.inside.id
          : null,
        name: mappoint.properties.name,
        point: mappoint.geometry.coordinates
      };
      return l;
    },
    makeGateway(mappoint) {
      let l = {
        id: mappoint.properties.id,
        areaId: this.areaid,
        siteId: this.id,
        name: mappoint.properties.name,
        point: mappoint.geometry.coordinates
      };
      return l;
    },
    makeAccesspoint(mappoint) {
      let l = {
        id: mappoint.properties.id,
        areaId: this.areaid,
        siteId: this.id,
        name: mappoint.properties.name,
        point: mappoint.geometry.coordinates
      };
      return l;
    },
    handleFileSave(file) {
      this.bulkSaveLocations({ siteid: this.id, file: file });
      this.showFileModal = false;
    },
    handleFileCancel() {
      this.showFileModal = false;
    },
    handleConfirmSave() {
      this.handleSave();
      this.showConfirm = false;
    },
    handleConfirmCancel() {
      this.showConfirm = false;
      if (this.zone && this.zone.id) {
        console.log("need to do undo");
      }
    },
    handleLocationSave(data) {
      let l = data;
      if (!data.id) {
        l = {
          name: data.name,
          macAddress: data.macAddress,
          areaId: this.areaid,
          siteId: this.id
        };
      }
      this.currentLocation(l);
      this.confirmAction = l.id ? UPDATE_LOCATION_ACTION : ADD_LOCATION_ACTION;
      this.handleSave();
      this.showLocationModal = false;
    },
    handleLocationCancel() {
      this.showLocationModal = false;
    },
    zoneClicked(zone) {
      this.selectZone(zone);
      this.selected = zone;
    },
    zoneChecked(zone, checked) {
      if (checked) {
        this.zonechecked += 1;
      } else {
        this.zonechecked -= 1;
      }
      this.zoneClicked(zone)
      this.select({ namespace: "setup", type: "zones", data: zone, checked });
    },
    actionZoneDeleteHandler() {
      let checked = this.zones.filter(z => z.checked);
      let numloc = checked.length;
      this.confirmMsg = `Delete ${numloc} zone(s)?`;
      this.confirmTitle = "Delete Zones";
      this.confirmAction = DELETE_ZONE_ACTION;
      this.confirmPrimary = "Delete";
      this.showConfirm = true;
    },
    actionZoneAddHandler() {
      this.confirmAction = ADD_ZONE_ACTION;
      this.showZoneModal = true;
    },
    actionZoneEditHandler() {
      this.confirmAction = UPDATE_ZONE_ONLY_ACTION;
      this.showZoneModal = true;
    },
    // Map interaction handler
    handleZoneSave(data) {
      if (this.confirmAction == ADD_ZONE_ACTION) {
        this.zone.name = data.name;
        this.currentZone(this.zone);
      } else {
        this.currentZone(data);
      }
      this.handleSave();
      this.showZoneModal = false;
    },
    handleZoneCancel() {
      this.showZoneModal = false;
      if (this.zone && this.zone.id) {
        console.log("need to do undo");
      }
    },
    handleUpdate(data) {
      let t = data.properties.type;
      if (t == "zone") {
        this.currentZone(this.makeZone(data));
        this.confirmTitle = "Save Zone";
        this.confirmMsg = "Save changes to Zone?";
        this.showConfirm = true;
        this.confirmPrimary = "Save";
        this.confirmAction = this.zone.id
          ? UPDATE_ZONE_ACTION
          : ADD_ZONE_ACTION;
      } else if (t == "area") {
        this.currentArea(this.makeArea(data));
        this.confirmTitle = "Save Area Polygon";
        this.confirmMsg = "Save changes to Area polygon?";
        this.showConfirm = true;
        this.confirmPrimary = "Save";
        this.confirmAction = UPDATE_AREA_POLYGON;
      } else if (t == "location") {
        let l = this.makeLocation(data);
        this.updateLocation(l);
      } else if (t == "gateway") {
        let g = this.makeGateway(data);
        this.updateGateway(g);
      } else if (t == "accesspoint") {
        let ap = this.makeAccesspoint(data);
        this.updateAccesspoint(ap);
      }
    },
    // Map interaction handler
    handleDelete(data) {
      if (!data.properties.id) {
        return;
      }
      let t = data.properties.type;
      let g = data.geometry.type;
      if (t === "zone") {
        this.currentZone(this.makeZone(data));
        this.confirmTitle = "Delete Zone";
        this.confirmMsg = "Delete this zone?";
        this.confirmPrimary = "Delete";
        this.showConfirm = true;
        this.confirmAction = DELETE_ZONE_ACTION;
      } else if (t === "area") {
        data.geometry.coordinates = null;
        this.currentArea(this.makeArea(data));
        this.confirmTitle = "Save Area Polygon";
        this.confirmMsg = "Save changes to area polygon?";
        this.showConfirm = true;
        this.confirmAction = UPDATE_AREA_POLYGON;
      } else if (t === "location" || (t === "location" && g === "Point")) {
        let l = this.makeLocation(data);
        l.point = null;
        l.zoneId = null;
        this.updateLocation(l);
      } else if (t === "gateway" || (t === "gateway" && g === "Point")) {
        let l = this.makeGateway(data);
        l.point = null;
        l.zoneId = null;
        this.updateGateway(l);
      }
    },
    handleSelected(data) {
      if (!data) {
        this.selectGateway({ id: false });
        this.selectLocation({ id: false });
        this.selectZone({ id: false });
        return;
      }
      if (!data.properties.id) {
        return;
      }

      let t = data.properties.type;
      let g = data.geometry.type;
      if (t == "location") {
        this.setTab(this.LOCATION_TAB);
      } else if (t == "gateway") {
        this.setTab(this.GATEWAY_TAB);
      } else if (t == "accesspoint") {
        this.setTab(this.ACCESS_POINT_TAB);
      }
      if (t === "zone") {
        if (this.zone.selected) {
          return;
        }
        this.selectZone(this.makeZone(data));
        this.currentZone(this.makeZone(data));
        this.selectLocation({ id: false });
        this.selectGateway({ id: false });
        this.selectAccesspoint({ id: false });
      } else if (
        t === "location" ||
        (g === "Point" && this.currentTab == this.LOCATION_TAB)
      ) {
        if (this.location.id === data.properties.id) {
          return;
        }
        let l = this.makeLocation(data);
        this.selectLocation(l);
        this.selectZone({ id: false });
        this.selectGateway({ id: false });
        this.selectAccesspoint({ id: false });
      } else if (
        t === "gateway" ||
        (g === "Point" && this.currentTab == this.GATEWAY_TAB)
      ) {
        if (this.gateway.id === data.properties.id) {
          return;
        }
        let gw = this.makeGateway(data);
        this.selectGateway(gw);
        this.selectLocation({ id: false });
        this.selectZone({ id: false });
        this.selectAccesspoint({ id: false });
      } else if (
        t === "accesspoint" ||
        (g === "Point" && this.currentTab == this.ACCESS_POINT_TAB)
      ) {
        if (this.accesspoint.id === data.properties.id) {
          return;
        }
        let ap = this.makeAccesspoint(data);
        this.selectGateway({ id: false });
        this.selectLocation({ id: false });
        this.selectZone({ id: false });
        this.selectAccesspoint(ap);
      }
      this.scrollToSelected(data);
    },
    scrollToSelected(data) {
      let el = document.getElementById(data.id);
      if (!el) {
        return;
      }
      if ("scrollIntoView" in el) {
        el.scrollIntoView(false);
      }
    },
    selectAllLocations(checked) {
      this.checked = checked ? this.locations.length : 0;
      this.selectAll({ namespace: "setup", type: "locations", checked: !!checked });
    },
    selectAllGateways(checked) {
      this.gwchecked = checked ? this.gateways.length : 0;
      this.selectAll({ namespace: "setup", type: "gateways", checked: !!checked });
    },
    selectAllAccesspoints(checked) {
      this.apchecked = checked ? this.accesspoints.length : 0;
      this.selectAll({ namespace: "setup", type: "accesspoints", checked: !!checked });
    },
    selectAllZones(checked) {
      this.zonechecked = checked ? this.zones.length : 0;
      this.selectAll({ namespace: "setup", type: "zones", checked: !!checked });
    },
    locationClicked(location) {
      this.selectLocation(location);
      this.selected = location;
    },
    locationChecked(location, checked) {
      if (checked) {
        this.checked += 1;
      } else {
        this.checked -= 1;
      }
      this.select({ namespace: "setup", type: "locations", data: location, checked });
    },
    actionLBExport(){
      this.exportLocations()
    },
    gatewayClicked(gateway) {
      this.selectGateway(gateway);
      this.selected = gateway;
    },
    gatewayChecked(gateway, checked) {
      if (checked) {
        this.gwchecked += 1;
      } else {
        this.gwchecked -= 1;
      }

      this.select({ namespace: "setup", type: "gateways", data: gateway, checked });
    },
    handleGWFileSave(file) {
      this.bulkSaveGateways({ siteid: this.id, file: file });
      this.showGWFileModal = false;
    },
    handleGWFileCancel() {
      this.showGWFileModal = false;
    },
    handleGatewaySave(data) {
      let g = data;
      if (this.confirmAction == ADD_GATEWAY_ACTION) {
        g = {
          name: data.name,
          id: data.id,
          areaId: this.areaid,
          siteId: this.id
        };
      }
      this.currentGateway(g);
      this.handleSave();
      this.showGatewayModal = false;
    },
    handleGatewayCancel() {
      this.showGatewayModal = false;
    },
    actionGWFileHandler() {
      this.showGWFileModal = true;
    },
    actionGWDeleteHandler() {
      let checked = this.gateways.filter(g => g.checked);
      let numloc = checked.length;
      this.confirmMsg = `Delete ${numloc} gateways(s)?`;
      this.confirmTitle = "Delete Gateways";
      this.confirmAction = DELETE_GATEWAY_ACTION;
      this.confirmPrimary = "Delete";
      this.showConfirm = true;
    },
    actionGWAddHandler() {
      this.confirmAction = ADD_GATEWAY_ACTION;
      this.showGatewayModal = true;
    },
    actionGWEditHandler() {
      this.confirmAction = UPDATE_GATEWAY_ACTION;
      this.showGatewayModal = true;
    },
    actionGWWipeHandler() {
      let checked = this.gateways.filter(l => l.checked);
      let numloc = checked.length;
      this.confirmTitle = "Wipe Gateway Points";
      this.confirmMsg = `Wipe ${numloc} gateway point(s)?`;
      this.confirmAction = WIPE_GATEWAY_POINT_ACTION;
      this.showConfirm = true;
    },
    actionGWExport(){
      this.exportGateways()
    },
    accesspointClicked(accesspoint) {
      this.selectAccesspoint(accesspoint);
      this.selected = accesspoint;
    },
    accesspointChecked(accesspoint, checked) {
      if (checked) {
        this.apchecked += 1;
      } else {
        this.apchecked -= 1;
      }

      this.select({ namespace: "setup", type: "accesspoints", data: accesspoint, checked });
    },
    handleAPFileSave(file) {
      this.bulkSaveAccesspoints({ siteid: this.id, file: file });
      this.showAPFileModal = false;
    },
    handleAPFileCancel() {
      this.showAPFileModal = false;
    },
    handleAccesspointSave(data) {
      let g = data;
      if (this.confirmAction == ADD_ACCESSPOINT_ACTION) {
        g = {
          name: data.name,
          macAddress: data.macAddress,
          areaId: this.areaid,
          apType: data.apType,
          siteId: this.id
        };
      }
      this.currentAccesspoint(g);
      this.handleSave();
      this.showAccesspointModal = false;
    },
    handleAccesspointCancel() {
      this.showAccesspointModal = false;
    },
    actionAPFileHandler() {
      this.showAPFileModal = true;
    },
    actionAPDeleteHandler() {
      let checked = this.accesspoints.filter(g => g.checked);
      let numloc = checked.length;
      this.confirmMsg = `Delete ${numloc} accesspoints(s)?`;
      this.confirmTitle = "Delete Accesspoints?";
      this.confirmAction = DELETE_ACCESSPOINT_ACTION;
      this.confirmPrimary = "Delete";
      this.showConfirm = true;
    },
    actionAPAddHandler() {
      this.confirmAction = ADD_ACCESSPOINT_ACTION;
      this.showAccesspointModal = true;
    },
    actionAPEditHandler() {
      this.confirmAction = UPDATE_ACCESSPOINT_ACTION;
      this.showAccesspointModal = true;
    },
    actionAPWipeHandler() {
      let checked = this.accesspoints.filter(l => l.checked);
      let numloc = checked.length;
      this.confirmTitle = "Wipe Accesspoints Points";
      this.confirmMsg = `Wipe ${numloc} accesspoint point(s)?`;
      this.confirmAction = WIPE_ACCESSPOINT_POINT_ACTION;
      this.showConfirm = true;
    },
    actionAPExport(){
      this.exportAccesspoints()
    },
    handlePlacedToggle(){
      if(!this.locationsToggled){
        this.toggleAllProperty({key: 'point', toggle: false})
      }else{
        this.toggleAllProperty()
      }
      this.locationsToggled = !this.locationsToggled;
    }
  },
  computed: {
    ...mapGetters("setup", [
      "mapopts",
      "area",
      "locations",
      "location",
      "savingLocations",
      "accesspoint",
      "accesspoints",
      "checkedAccesspoints",
      "gateway",
      "gateways",
      "checkedGateways",
      "checkedLocations",
      "zones",
      "zone",
      "checkedZones",
      "site"
    ]),
    ...mapState("setup", {
      areaName(state) {
        if (state.loadingZones) {
          this.inited = true;
        }
        if (state.area && state.area.id) {
          if (!state.loadingZones && !state.loadingLocations && this.inited) {
            this.inited = false;
            this.setMapopts();
          }
          return "Area: ".concat(state.area.name);
        }
        return "Loading...";
      }
    }),
    toggletext(){
      if(this.locationsToggled){
        return 'Show All'
      }
      return 'Show not placed'
    }
  }
};
</script>

<style lang="scss" scoped>
.title-bar {
  border-bottom: 1px solid;
  border-color: $border;
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 0.5em 1em;
}
.level {
  flex: 1;
}
.section {
  margin-bottom: 10px;
}
.scrollable {
  width: 400px;
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  align-self: flex-start;
}
.area-map-legend {
  position: absolute;
  bottom: 20px;
  left: 250px;
  background-color: #ffffff;
  padding: 5px;
  border-radius: 3px 3px;
  border: 2px solid $dark-blue;
  ul {
    font-size: $size-7;
    .legend-item > span {
      display: inline-block;
      vertical-align: middle;
      padding: 5px;
      margin: 5px;
      border-radius: 5px 5px;
    }
    .location-item {
      background-color: #3dabff;
    }
    .gateway-item {
      background-color: #7cc427;
    }
    .ap-item {
      background-color: #600080;
    }
  }
}
.list {
  align-self: flex-start;
}
</style>
