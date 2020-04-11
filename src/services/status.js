import { fetchPlus, convertToTitleCase } from '../utils';

export default (()=>{
  const basePath=process.env.VUE_APP_NETWORK_ASSETS_URL || '';
  const statusPath='/networkAsset/airfinder/v2/status';

  async function getDeviceStatus(siteId){
    let url = basePath.concat(statusPath, '?siteId=',siteId);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    
    let d=await r.json();
    return d.map((deviceStatus) => {
      // Calculate percentage of RED and GREEN devices
      const totalAssets = deviceStatus.totalCount;
      const redCount = deviceStatus.healthStatusCount.RED;
      const redPercentage = totalAssets
        ? Math.round((redCount / totalAssets) * 100)
        : 0;
      const greenCount = deviceStatus.healthStatusCount.GREEN;
      const greenPercentage = totalAssets
        ? Math.round((greenCount / totalAssets) * 100)
        : 0;
  
      // Convert assetType string to title case, ex. ACCESS_POINT to Access Point
      let assetType = convertToTitleCase(deviceStatus.assetType);
      if (assetType && assetType.indexOf("_") !== -1) {
        assetType = assetType.split("_").join(" ");
      }
  
      return {
        ...deviceStatus,
        assetType,
        healthStatusCount: {
          ...deviceStatus.healthStatusCount,
          redAssets: `${redCount} (${redPercentage}%)`,
          greenAssets: `${greenCount} (${greenPercentage}%)`
        }
      };
    });
  }

  async function getBeaconStatus(siteId){
    let url = basePath.concat(statusPath,'/locations?siteId=', siteId);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });

    let d=await r.json();
    return d.map((beacon) => {
      if (beacon.properties) {
        if (beacon.properties.health) {
          beacon.properties.health = convertToTitleCase(beacon.properties.health);
        }
        if (beacon.properties.lastRssiStatus) {
          beacon.properties.lastRssiStatus = convertToTitleCase(
            beacon.properties.lastRssiStatus
          );
        }
        if (beacon.properties.averageRssiStatus) {
          beacon.properties.averageRssiStatus = convertToTitleCase(
            beacon.properties.averageRssiStatus
          );
        }
      }
      return beacon;
    });
  }

  async function getAPStatus(siteId){
    let url = basePath.concat(statusPath,'/accessPoints?siteId=', siteId);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d=await r.json();
    return d.map((accessPoint) => {
      if (accessPoint.properties) {
        if (accessPoint.properties.health) {
          accessPoint.properties.health = convertToTitleCase(
            accessPoint.properties.health
          );
        }
        if (accessPoint.properties.lastRssiStatus) {
          accessPoint.properties.lastRssiStatus = convertToTitleCase(
            accessPoint.properties.lastRssiStatus
          );
        }
        if (accessPoint.properties.averageRssiStatus) {
          accessPoint.properties.averageRssiStatus = convertToTitleCase(
            accessPoint.properties.averageRssiStatus
          );
        }
      }
      return accessPoint;
    });
  }

  async function getGatewayStatus(siteId){
    let url = basePath.concat(statusPath,'/gateways?siteId=', siteId);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d=await r.json();
    return d.map((gateway) => {
      if (gateway.properties) {
        if (gateway.properties.health) {
          gateway.properties.health = convertToTitleCase(
            gateway.properties.health
          );
        }
        if (gateway.properties.lastRsrpStatus) {
          gateway.properties.lastRsrpStatus = convertToTitleCase(
            gateway.properties.lastRsrpStatus
          );
        }
        if (gateway.properties.lastRsrqStatus) {
          gateway.properties.lastRsrqStatus = convertToTitleCase(
            gateway.properties.lastRsrqStatus
          );
        }
        if (gateway.properties.lastRssiStatus) {
          gateway.properties.lastRssiStatus = convertToTitleCase(
            gateway.properties.lastRssiStatus
          );
        }
      }
      return gateway;
    });
  }

  async function getTagStatus(siteId){
    let url = basePath.concat(statusPath,'/tags?siteId=', siteId);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d=await r.json();
    return d.map((tag) => {
      if (tag.properties) {
        if (tag.properties.health) {
          tag.properties.health = convertToTitleCase(tag.properties.health);
        }
        if (tag.properties.batteryStatus) {
          tag.properties.batteryStatus = convertToTitleCase(
            tag.properties.batteryStatus
          );
        }
      }
      return tag;
    });
  }

  return {
    getDeviceStatus,
    getBeaconStatus,
    getAPStatus,
    getGatewayStatus,
    getTagStatus
  }
})();