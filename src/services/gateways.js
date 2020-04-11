import { fetchPlus, sortByName } from '../utils';

export default (() => {
  const basePath = process.env.VUE_APP_NETWORK_ASSETS_URL.concat('/networkAsset/airfinder') || '';
  const clientedge = process.env.VUE_APP_CLIENT_EDGE_URL.concat('/clientEdge') || '';

  async function list(siteid, areaid) {
    let url = basePath.concat('/gateways?siteId=', siteid);
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
      "type": "gateway",
      "point": d.point,
      "lastProvisioned": d.assetInfo.metadata.props.lastProvisioned,
    }
  }

  async function bulkUpload(siteid, file) {
    let url = '/gateways/bulk'.concat('?siteId=', siteid)
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

  async function create(gateway) {
    let url = basePath.concat('/gateways');
    let body = {
      name: gateway.name,
      nodeAddress: gateway.id,
      siteId: gateway.siteId,
      properties: {
        areaId: gateway.areaId,
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

  async function remove(gateway) {
    let url = basePath.concat('/gateway/', gateway.id);
    let r = await fetchPlus({
      url: url,
      method: 'DELETE'
    });
    let d = await r.json();
    return d
  }

  async function updateMany(gateways) {
    //TODO: hookup to bulk update API
    let results = await Promise.all(gateways.map((l) => {
      return this.update(l);
    }))
    return results;
  }

  async function update(gateway) {
    let url = basePath.concat('/gateway/', gateway.id);
    let body = {}
    if ('name' in gateway) {
      body.name = gateway.name
    }
    if ('siteId' in gateway) {
      body.siteId = gateway.siteId
    }
    if ('point' in gateway) {
      body.mapPoint = gateway.point ? gateway.point.join(',') : ''
    }
    if ('areaId' in gateway) {
      body.areaId = gateway.areaId
    }
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'PUT'
    });
    let d = await r.json();

    return convertData(d)
  }

  async function get(id, extend) {
    let url = basePath.concat('/gateway/', id);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d = await r.json();
    return convertData(d)
  }

  async function deleteMany(siteid, gateways) {
    let url = basePath.concat('/gateways');
    let ids = gateways.map(l => l.id)
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

  async function restart(gateway) {
    let url = clientedge.concat('/issueCommand');
    let hexnow = ("000000000000000" + Date.now().toString(16)).substr(-16);
    let body = {
      commandRoutes: {
        linkAddresses: [`${gateway.id}!FFD!${gateway.id}`]
      },
      commandProperties: {
        payloadHex: `7F${hexnow}`, commReqs: {
          requiredAckRatio: 1, requiredSuccessfulAckRatio: 1, priority: 10, ttlMSecs: 60000, portNumber: 0
        }
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