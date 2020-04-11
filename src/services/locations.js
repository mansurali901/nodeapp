import { fetchPlus } from '../utils';

export default (() => {
  const basePath = process.env.VUE_APP_NETWORK_ASSETS_URL.concat('/networkAsset/airfinder') || '';


  function convertData(d) {
    if (d.assetInfo.metadata.props.mapPoint) {
      let point = d.assetInfo.metadata.props.mapPoint.split(',').map(n => Number.parseFloat(n))
      d.point = point
    }
    return {
      "id": d.nodeAddress,
      "siteId": d.assetInfo.metadata.props.siteId,
      "areaId": d.assetInfo.metadata.props.areaId,
      "zoneId": d.assetInfo.metadata.props.zoneId,
      "name": d.nodeName || 'empty',
      "nodeAddress": d.nodeAddress,
      "macAddress": d.assetInfo.metadata.props.macAddress,
      "point": d.point,
      "lastProvisioned": d.assetInfo.metadata.props.lastProvisioned,
    }
  }

  async function bulkUpload(siteid, file) {
    let url = '/locations/bulk'.concat('?siteId=', siteid)
    let data = new FormData();

    data.append('file', file);

    let r = await fetchPlus({
      url: basePath.concat(url),
      file: true,
      method: 'POST',
      body: data
    })

    let d = await r.json()
    let rows = Object.values(d.results) // not sure how this is with big returns, probably best to just return an array as number is meaningless
    return rows.map(r => convertData(r))
  }

  async function create(location) {
    let url = basePath.concat('/locations');
    let body = {
      name: location.name,
      macAddress: location.macAddress,
      areaId: location.areaId,
      siteId: location.siteId
    }
    if (location.polygon) {
      body.properties = {
        points: location.polygon.map(point => point.join(';')).join('')
      }
    }

    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'POST'
    });
    let data = await r.json();

    return data
  }

  async function remove(location) {
    let url = basePath.concat('/location/', location.id);
    let r = await fetchPlus({
      url: url,
      method: 'DELETE'
    });
    let d = await r.json();
    return d
  }

  async function updateMany(locations) {
    //TODO: hookup to bulk update API
    let results = await Promise.all(locations.map((l) => {
      return this.update(l);
    }))
    return results;
  }

  async function update(location) {
    let url = basePath.concat('/location/', location.id);
    let body = {}
    if ('name' in location) {
      body.name = location.name
    }
    if ('siteId' in location) {
      body.siteId = location.siteId
    }
    if ('point' in location) {
      body.mapPoint = location.point ? location.point.join(',') : ''
    }
    if ('areaId' in location) {
      body.areaId = location.areaId
    }
    if ('zoneId' in location) {
      body.zoneId = location.zoneId
    }
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'PUT'
    });
    let d = await r.json();

    return convertData(d)
  }

  async function get(locid) {
    let url = basePath.concat('/location/', locid);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d = await r.json();
    return convertData(d)
  }

  async function deleteMany(siteid, locations) {
    let url = basePath.concat('/locations');
    let ids = locations.map(l => l.id)
    let data = {
      nodeAddresses: ids,
      siteId: siteid
    }
    let r = await fetchPlus({
      url: url,
      method: 'DELETE',
      body: data
    })
    return r
  }


  return {
    bulkUpload,
    deleteMany,
    get,
    create,
    remove,
    update,
    updateMany
  }
})();