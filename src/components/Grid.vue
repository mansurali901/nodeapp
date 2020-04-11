<template>
  <div>
    <div class="ag-grid-status">
      <div class="grid-header">
        <div class="reportStatus">
          <div v-if="typeof header === 'string'">
            <strong>{{ header }}</strong>
          </div>
          <template v-else>
            <div v-for="item in header" :key="item">
              <strong>{{ item }}</strong>
            </div>
          </template>
        </div>
        <div v-if="defModalId">
          <div class="p-2">
            <img
              class="help-icon"
              src="../assets/help-icon.svg"
              @click="showModal = true"
            />
          </div>
        </div>
      </div>
      <ag-grid-vue :style="{height:this.gridHeight}"
        class="ag-theme-balham"
          :columnDefs="columns"
          :gridOptions="gridOptions"
          :rowData="rows"
          :defaultColDef ="defaultColDef"
          :suppressMovableColumns="true"
          :overlayLoadingTemplate="overlayTemplate"
          @grid-ready="onGridReady($event)">
      </ag-grid-vue>
    </div>
    <div v-if="defModalId" class="container">
      <div :id="defModalId" class="modal" :class="{'is-active': showModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Parameter Definition</p>
            <img class="help-icon" src="../assets/cross.svg" @click="showModal = false">
          </header>
          <section class="modal-card-body">
            <table style="width:100%">
              <tr>
                <th>Parameter</th>
                <th class="table-header-defintion">Definition</th>
              </tr>
              <tbody>
                <tr>
                  <td>HBER</td>
                  <td>
                    <strong>Heartbeat Error Rate:</strong>
                    <br />
                    <br />
                    <span style="display:inline-block;">
                      0% means 0 of the last 4 messages from the device were
                      missed. An error rate of 25% indicates 1 of the last 4
                      heartbeat messages was not received. A HBER with an
                      &quot;*&quot; next to it indicates the device has never
                      sent a heartbeat to the system.
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>RSRQ</td>
                  <td>
                    <strong>Reference Signal Received Quality:</strong>
                    <br />
                    <br />
                    <span style="display:inline-block;">
                      RSRQ = (N * RSRP) / RSSI measured over the same
                      bandwidth. RSRQ is a C/I type of measurement and it
                      indicates the quality of the received reference signal.
                      The RSRQ measurement provides additional information
                      when RSRP is not sufficient to make a reliable handover
                      or cell re-selection decision.
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>RSRP</td>
                  <td>
                    <strong>Reference Signal Received Power:</strong>
                    <br />
                    <br />
                    <span style="display:inline-block;">
                      RSRP is the power of the LTE Reference Signals spread
                      over the full bandwidth and narrowband. A minimum of -20
                      dB SINR (of the S-Synch channel) is needed to detect
                      RSRP/RSRQ.
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>RSSI</td>
                  <td>
                    <strong>Received Signal Strength Indicator:</strong>
                    <br />
                    <br />
                    <span style="display:inline-block;">
                      For Location Beacons and Access Points, RSSI is an
                      estimated measure of power level that a device is
                      receiving from an Access Point or Gateway, respectively.
                      At low values (larger negative value) signal wireless
                      data rates get slower and/or transmissions cannot get
                      through.
                    </span>
                    <br />
                    <br />
                    <span style="display:inline-block;">
                      For Gateways, the carrier RSSI measures the average
                      total received power observed only in OFDM symbols
                      containing reference symbols for antenna port 0. The
                      total received power of the carrier RSSI includes the
                      power from co-channel serving &amp; non-serving cells,
                      adjacent channel interference, thermal noise, etc.
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>DPT</td>
                  <td>
                    <strong>Device Provisioning Tool:</strong>
                    <br />
                    <br />
                    <span style="display:inline-block;">
                      AT&amp;T’s ‘Device Provisioning Tool’ created to assist
                      with installation, monitoring, and debug.
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import {DefaultColDef} from '../constants';

export default {
	components:{
    AgGridVue
  },
  props:['columns','height','rows','header','isLoading','defModalId'],
  data: function(){
    return {
      gridApi:null,
      gridHeight:this.height || '250px',
      defaultColDef:DefaultColDef,
      gridOptions: {},
      showModal: false,
      overlayTemplate:"<div class='overlay-grid'><span class='has-text-centered'><i class='fas fa-spinner fa-pulse fa-3x'/></span></div>"
    }
  },
  mounted: function() {
    window.addEventListener("resize", this.onPageResize);
  },
  methods:{
    onGridReady(params) {
      this.gridApi = params.api;
      this.resizeGrid();
      // To show loader after grid is created
      this.isLoadingHandler();

      // todo : move to parent
      this.gridOptions.getRowClass = function(params) {
        if (params.node.data.health) {
          let colorClass =
            params.node.data.health.toLowerCase() === "red"
              ? "red-node"
              : "green-node";
          return colorClass;
        }
      };
    },
    resizeGrid() {
      this.$nextTick(function() {
        this.gridApi &&
          this.gridApi.sizeColumnsToFit &&
          this.gridApi.sizeColumnsToFit();
      });
    },
    onPageResize() {
      this.resizeGrid();
    },
    isLoadingHandler() {
      if(!this.gridApi) 
        return; 
      if(this.isLoading){
        this.gridApi.showLoadingOverlay();
      } else{
         this.gridApi.hideOverlay();
      }
    }
  },
  watch:{
    isLoading: function() {
      this.isLoadingHandler();
    },
    rows: function() {
      this.resizeGrid();
    }
  },
  destroyed: function() {
    window.removeEventListener("resize", this.onPageResize);
  }
}
</script>

<style lang="scss">
.ag-theme-balham .red-node {
  background-color: #ffcccc;
}
.ag-theme-balham .green-node {
  background-color: #d6f5d6;
}
</style>

<style lang="scss" scoped>
.cross {
  height: 20px;
  width: 20px;
}
.ag-grid-status {
  .grid-header {
    display: flex;
    justify-content: space-between;
  }
}
.reportStatus {
  display: flex;
  flex-direction: column;
}
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding: 5px;
}
th {
  text-align: left;
}
.help-icon {
  width: 40px;
  cursor: pointer;
}
.table-header-defintion {
  text-align: center;
}
.help-icon {
  width: 20px;
  cursor: pointer;
}
</style>