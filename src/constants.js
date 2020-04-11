import { timeSince, daysDifference } from './utils';
import moment from 'moment';

export default {
  NEED_AUTH: 'need-auth',
  NEED_LOGIN: 'need-login',
  FORBIDDEN: 'forbidden',
  AREA_INDOOR: 'indoor',
  AREA_OUTDOOR: 'outdoor',
  AREA_BASIC: 'basic',
  INVALID_AUTH: 'Invalid email address or password',
  INVALID_EMAIL: 'Invalid email address',
  UNKNOWN_ERROR: 'Unknown Error',
  inactivityTimeoutDuration: 30 * 60 * 1000, // 30 mins in milliseconds
}

export const DefaultColDef= {
  sortable: true,
  resizable: true,
  suppressDragLeaveHidesColumns: true,
  headerHeight: 50,
  tooltip:(params) => params.value
}

export const SiteStatus = [
	{ headerName: 'Device Type', field: 'assetType',},
	{ headerName: 'Total', field: 'totalCount'},
	{
    headerName: "Green",
    field: "healthStatusCount.greenAssets",
    comparator: (a, b) => {
      return a.localeCompare(b, "en-US", {
        numeric: true,
        sensitivity: "base"
      });
    }
  },
  {
    headerName: "Red",
    field: "healthStatusCount.redAssets",
    comparator: (a, b) => {
      return a.localeCompare(b, "en-US", {
        numeric: true,
        sensitivity: "base"
      });
    }
  }
];

export const BeaconStatus = [
  { headerName: "Status", field: "properties.health" },
  { headerName: "Label", field: "properties.name" },
  { headerName: "Device ID", field: "properties.macAddress" },
  { headerName: 'Last Hearbeat', field: 'properties.lastHeartbeat', valueFormatter: timeValueFormattor },
  { headerName: 'HBER', field: 'properties.hber'},
	{ headerName: 'Last RSSI', field: 'properties.lastRssiStatus'},
	{ headerName: 'Avg RSSI', field: 'properties.averageRssiStatus'}
];

export const APStatus = [
  { headerName: "Status", field: "properties.health" },
  { headerName: "Label", field: "properties.name" },
  { headerName: "Device ID", field: "properties.macAddress" },
	{ headerName: 'Last Hearbeat', valueFormatter: timeValueFormattor, field: 'properties.lastHeartbeat'},
	{ headerName: 'HBER', field: 'properties.hber'},
	{ headerName: 'Last RSSI', field: 'properties.lastRssiStatus'},
	{ headerName: 'Avg RSSI', field: 'properties.averageRssiStatus'}
];

export const GatewayStatus = [
  { headerName: "DPT Status", field: "properties.health" },
  { headerName: "Label", field: "properties.name" },
  { headerName: "Device ID", field: "properties.macAddress" },
	{ headerName: 'Last Message', field: 'properties.lastMessage', valueFormatter: timeValueFormattor},
	{ headerName: 'RSRP', field: 'properties.lastRsrpStatus'},
	{ headerName: 'RSRQ', field: 'properties.lastRsrqStatus'},
	{ headerName: 'RSSI', field: 'properties.lastRssiStatus'}
];

export const TagStatus = [
  { headerName: "Status", field: "properties.health" },
  { headerName: "Label", field: "properties.name" },
  { headerName: "Device ID", field: "properties.macAddress" },
  { headerName: "Battery Status", field: "properties.batteryStatus" },
  {
    headerName: "Last Message",
    field: "properties.lastEventTime",
    valueFormatter: timeValueFormattor
  }
];

function timeValueFormattor(params) {
  /// format: <hour>:<minute> <PM/AM> on mm/dd/yyyy, move to helper class
  if (params.value) {
    let apiDateTimeValue = params.value;
    apiDateTimeValue = moment.utc(params.value)

    if (daysDifference(apiDateTimeValue) < 7) {
      return timeSince(apiDateTimeValue);
    }
    return apiDateTimeValue.local().format("MM/DD/YYYY hh:mm:ss A");
  }
  return null;
}
