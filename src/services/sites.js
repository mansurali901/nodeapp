import { fetchPlus } from '../utils';

//sites stuff
export default (() => {
  const basePath = process.env.VUE_APP_NETWORK_ASSETS_URL || '';
  const sitesPath = '/networkAsset/airfinder/';
  const ACCOUNT_PATH = '/fooDomain/fooServlet/paths/'

  function convertSite(data) {
    let aid = data.account.href && data.account.href.split(ACCOUNT_PATH)[1]
    return {
      "id": data.id,
      "name": data.value,
      "account": data.account.href,
      "accountId": aid,
      "organizationId": data
        && data.assetInfo
        && data.assetInfo.metadata
        && data.assetInfo.metadata.props
        && data.assetInfo.metadata.props.organizationId
    }
  }

  async function create(site) {
    let url = basePath.concat(sitesPath, 'sites');
    let body = {
      accountId: site.accountId,
      configValue: site.name,
    };
    if(site.organizationId){
      body.properties = {organizationId: site.organizationId}
    }
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'POST'
    });
    let d = await r.json();
    return convertSite(d);
  }

  async function update(site) {
    let url = basePath.concat(sitesPath, 'site/', site.id);
    let body = {
      accountId: site.accountId,
      name: site.name,
      organizationId: site.organizationId
    };
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'PUT'
    });
    let d = await r.json();
    return convertSite(d);
  }

  async function remove(site) {
    let url = basePath.concat(sitesPath, 'site/', site.id);
    let r = await fetchPlus({
      url: url,
      method: 'DELETE'
    });
    return await r;
  }

  function sortByName(list) {
    return list.sort((a, b) => {
      let an = a.name.toLowerCase();
      let bn = b.name.toLowerCase();
      if (an > bn) {
        return 1
      }
      if (an < bn) {
        return -1
      }
      if (an === bn) {
        return 0
      }
    })
  }

  async function list() {
    let url = basePath.concat(sitesPath, 'sites');
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let data = await r.json();
    //mutation instead?
    let simple = data.map(d => {
      return {
        "id": d.id,
        "name": d.value,
        "account": d.account.href,
        "areaCount": d.assetInfo.metadata.props.areaCount,
        "accountId": d.assetInfo.metadata.props.accountId,
        "organizationId": d.assetInfo.metadata.props.organizationId
      }
    });
    return sortByName(simple)
  }

  async function listbyorg(orgid) {
    let url = basePath.concat(sitesPath, `organization/${orgid}/sites`);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let data = await r.json();
    //mutation instead?
    let simple = data.map(d => {
      return {
        "id": d.id,
        "name": d.value,
        "account": d.account.href,
        "areaCount": d.assetInfo.metadata.props.areaCount,
        "accountId": d.assetInfo.metadata.props.accountId,
        "organizationId": d.assetInfo.metadata.props.organizationId
      }
    });
    return sortByName(simple)
  }

  async function site(siteid) {
    let url = basePath.concat(sitesPath, 'site/', siteid);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d = await r.json();
    let s = convertSite(d);
    s.areaCount = d.assetInfo.metadata.props.areaCount;
    return s
  }

  async function areas(siteid) {
    let url = basePath.concat(sitesPath, 'areas', '?siteId=', siteid);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let data = await r.json();
    let simple = data.map(d => {
      return {
        "id": d.id,
        "name": d.value,
        "account": d.account.href,
        "areaLocation": d.assetInfo.metadata.props.areaLocation.toLowerCase(),
        "geoReferenced": d.assetInfo.metadata.props.geoReferenced,
        "indoorMapping": d.assetInfo.metadata.props.indoorMapping,
        "locationCount": d.assetInfo.metadata.props.locationCount,
        "polygon": d.assetInfo.metadata.props.points,
        "zoneCount": d.assetInfo.metadata.props.zoneCount,
        "accountId": d.assetInfo.metadata.props.accountId,
        "address": d.assetInfo.metadata.props.address,
        "point": d.assetInfo.metadata.props.point
      }
    });
    return sortByName(simple)
  }
  async function area(areaid) {
    let url = basePath.concat(sitesPath, 'area/', areaid);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d = await r.json();
    let points = d.assetInfo.metadata.props.points
    if (points) {
      points = points.split(';')
        .map(point => point.split(',').map(n => +n))
    }
    let a = {
      "id": d.id,
      "name": d.value,
      "account": d.account.href,
      "areaLocation": d.assetInfo.metadata.props.areaLocation.toLowerCase(),
      "geoReferenced": d.assetInfo.metadata.props.geoReferenced,
      "indoorMapping": d.assetInfo.metadata.props.indoorMapping,
      "locationCount": d.assetInfo.metadata.props.locationCount,
      "polygon": points,
      "zoneCount": d.assetInfo.metadata.props.zoneCount,
      "accountId": d.assetInfo.metadata.props.accountId
    }
    return a;
  }

  async function zones(siteid, areaid) {
    let url = basePath.concat(sitesPath, 'zones', '?siteId=', siteid, '&areaId=', areaid);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let data = await r.json();
    let simple = data.map(d => {
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
    });
    return sortByName(simple)
  }
  async function zone(zoneid) {
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
      "siteId": d.assetInfo.metadata.props.siteID,
      "polygon": d.assetInfo.metadata.props.points,
      "locationCount": d.assetInfo.metadata.props.locationCount,
      "accountId": d.assetInfo.metadata.props.accountId
    }
  }
  async function locations(siteid, areaid) {
    let url = basePath.concat(sitesPath, 'locations', '?siteId=', siteid);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let data = await r.json();
    let simple = [];
    for (let i = 0; i < data.length; i++) {
      let d = data[i]
      let l = {
        "id": d.nodeAddress,
        "siteId": d.assetInfo.metadata.props.siteId,
        "areaId": d.assetInfo.metadata.props.areaId,
        "zoneId": d.assetInfo.metadata.props.zoneId,
        "type": "location",
        "name": d.nodeName,
        "nodeAddress": d.nodeAddress,
        "macAddress": d.assetInfo.metadata.props.macAddress,
        "lastProvisioned": d.assetInfo.metadata.props.lastProvisioned,
      }
      if (d.assetInfo.metadata.props.mapPoint) {
        let point = d.assetInfo.metadata.props.mapPoint.split(',').map(n => Number.parseFloat(n))
        l.point = point
      }
      if (areaid && (!l.areaId || l.areaId == areaid)) {
        simple.push(l)
      } else if (!areaid) {
        simple.push(l)
      }
    }
    return sortByName(simple)
  }

  return {
    create,
    remove,
    update,
    list,
    site,
    areas,
    area,
    zones,
    zone,
    locations,
    listbyorg,
  }
})();