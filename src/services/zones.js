import { fetchPlus } from '../utils';

export default (() => {
  const basePath = process.env.VUE_APP_NETWORK_ASSETS_URL || '';
  const sitesPath = '/networkAsset/airfinder/';

  async function create(zone) {
    let url = basePath.concat(sitesPath, 'zones');
    let pointsJoin = zone.polygon ? zone.polygon.map(point => point.join(',')).join(';') : '';
    let body = {
      configValue: zone.name,
      properties: {
        areaId: zone.areaId,
        siteId: zone.siteId,
        points: pointsJoin
      }
    };
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'POST'
    });
    let d = await r.json();
    let points = d.assetInfo.metadata.props.points
    if (points) {
      points = points.split(';')
        .map(point => point.split(',').map(n => +n))
    }
    return {
      "id": d.id,
      "name": d.value,
      "account": d.account.href,
      "areaId": d.assetInfo.metadata.props.areaId,
      "siteId": d.assetInfo.metadata.props.siteID,
      "polygon": points,
      "locationCount": d.assetInfo.metadata.props.locationCount,
      "accountId": d.assetInfo.metadata.props.accountId
    }
  }

  async function remove(zone) {
    let url = basePath.concat(sitesPath, 'zone/', zone.id);
    let r = await fetchPlus({
      url: url,
      method: 'DELETE'
    });
    return r
  }

  async function update(zone) {
    let url = basePath.concat(sitesPath, 'zone/', zone.id);
    let pointsJoin = zone.polygon ? zone.polygon.map(point => point.join(',')).join(';') : '';
    let body = {
      name: zone.name,
      points: pointsJoin
    };
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'PUT'
    });
    let d = await r.json();
    let points = d.assetInfo.metadata.props.points
    if (points) {
      points = points.split(';').map(point => point.split(',').map(n => +n))
    }
    return {
      "id": d.id,
      "name": d.value,
      "account": d.account.href,
      "areaLocation": d.assetInfo.metadata.props.areaLocation,
      "geoReferenced": d.assetInfo.metadata.props.geoReferenced,
      "indoorMapping": d.assetInfo.metadata.props.indoorMapping,
      "locationCount": d.assetInfo.metadata.props.locationCount,
      "polygon": points,
      "zoneCount": d.assetInfo.metadata.props.zoneCount,
      "accountId": d.assetInfo.metadata.props.accountId
    }
  }

  async function get(zoneid) {
    let url = basePath.concat(sitesPath, 'zone/', zoneid);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d = await r.json();
    return {
      "id": d.id,
      "name": d.value,
      "account": d.account.href,
      "areaId": d.assetInfo.metadata.props.areaId,
      "siteId": d.assetInfo.metadata.props.siteId,
      "polygon": d.assetInfo.metadata.props.points,
      "locationCount": d.assetInfo.metadata.props.locationCount,
      "zoneCount": d.assetInfo.metadata.props.zoneCount,
      "accountId": d.assetInfo.metadata.props.accountId
    }
  }

  return {
    get,
    create,
    remove,
    update
  }
})();