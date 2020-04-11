import { fetchPlus, sortByName } from '../utils';

export default (() => {
  const basePath = process.env.VUE_APP_NETWORK_ASSETS_URL.concat('/networkAsset/airfinder') || '';
  const clientedge = process.env.VUE_APP_CLIENT_EDGE_URL.concat('/clientEdge') || '';

  async function list(siteid, areaid) {
    let url = basePath.concat('/accesspoints?siteId=', siteid);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let data = await r.json();
    let simple = [];
    for (let i = 0; i < data.length; i++) {
      let d = data[i]
      let g = convertData(d)
      if (d.assetInfo.metadata.props.mapPoint) {
        let point = d.assetInfo.metadata.props.mapPoint.split(',').map(n => Number.parseFloat(n))
        g.point = point
      }
      if (areaid && (!g.areaId || g.areaId == areaid)) {
        simple.push(g)
      } else if (!areaid) {
        simple.push(g)
      }
    }
    return sortByName(simple)
  }
  function convertData(d) {
    if (d.assetInfo.metadata.props.mapPoint) {
      let point = d.assetInfo.metadata.props.mapPoint.split(',').map(n => Number.parseFloat(n))
      d.point = point
    }
    return {
      "id": d.nodeAddress,
      "siteId": d.assetInfo.metadata.props.siteId,
      "areaId": d.assetInfo.metadata.props.areaId,
      "name": d.nodeName || 'empty',
      "nodeAddress": d.nodeAddress,
      "macAddress": d.assetInfo.metadata.props.macAddress,
      "type": "accesspoint",
      "apType": d.assetInfo.metadata.props.type,
      "point": d.point,
      "lastProvisioned": d.assetInfo.metadata.props.lastProvisioned,
    }
  }

  async function bulkUpload(siteid, file) {
    let url = '/accesspoints/bulk'.concat('?siteId=', siteid)
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

  async function create(accesspoint) {
    let url = basePath.concat('/accesspoints');
    let body = {
      name: accesspoint.name,
      macAddress: accesspoint.macAddress,
      siteId: accesspoint.siteId,
      type: accesspoint.apType,
      properties: {
        areaId: accesspoint.areaId,
      }
    };
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'POST'
    });
    let data = await r.json()

    return convertData(data)
  }

  async function remove(accesspoint) {
    let url = basePath.concat('/accesspoint/', accesspoint.id);
    let r = await fetchPlus({
      url: url,
      method: 'DELETE'
    });
    let d = await r.json();
    return d
  }

  async function updateMany(accesspoint) {
    //TODO: hookup to bulk update API
    let results = await Promise.all(accesspoint.map((l) => {
      return this.update(l);
    }))
    return results;
  }

  async function update(accesspoint) {
    let url = basePath.concat('/accesspoint/', accesspoint.id);
    let body = {}
    if ('name' in accesspoint) {
      body.name = accesspoint.name
    }
    if ('siteId' in accesspoint) {
      body.siteId = accesspoint.siteId
    }
    if ('apType' in accesspoint) {
      body.type = accesspoint.apType
    }
    if ('point' in accesspoint) {
      body.mapPoint = accesspoint.point ? accesspoint.point.join(',') : ''
    }
    if ('areaId' in accesspoint) {
      body.areaId = accesspoint.areaId
    }
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'PUT'
    });
    let d = await r.json();

    return convertData(d)
  }

  async function get(id) {
    let url = basePath.concat('/accesspoint/', id);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d = await r.json();
    return convertData(d)
  }

  async function deleteMany(siteid, accesspoint) {
    let url = basePath.concat('/accesspoints');
    let ids = accesspoint.map(l => l.id)
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

  async function restart(ap) {
    let url = clientedge.concat('/issueCommand');

    let body = {
      "commandProperties": {
        "payloadHex": "a0020500",
        "commReqs": {
          "requiredAckRatio": 1.0,
          "requiredSuccessfulAckRatio": 1.0,
          "priority": 10,
          "ttlMSecs": 60000,
          "portNumber": 0
        }
      },
      "commandTargets": {
        "targetNodeAddresses": [
          ap.id
        ]
      }
    }

    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'POST'
    });
    let data = await r.json()
    return data
  }

  return {
    list,
    bulkUpload,
    deleteMany,
    get,
    create,
    remove,
    update,
    updateMany,
    restart,
  }
})();