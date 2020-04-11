import {
  fetchPlus
} from '../utils';
import constants from '../constants';

export default (() => {
  const rawURL = process.env.VUE_APP_NETWORK_ASSETS_URL
  const baseURL = process.env.VUE_APP_NETWORK_ASSETS_URL.concat('/networkAsset/airfinder')

  const BOUND_COORDINATES = {
    WEST: -0.08,
    EAST: 0.08,
    NORTH: 0.04,
    SOUTH: -0.04
  };

  function convertArea(d) {
    let points = d.assetInfo.metadata.props.points
    if (points) {
      points = points.split(';')
        .map(point => point.split(',').map(n => +n))
    }
    let p = d.assetInfo.metadata.props.point
    let point
    if (p) {
      point = p.split(',')
    }
    return {
      "id": d.id,
      "name": d.value,
      "address": d.assetInfo.metadata.props.address,
      "account": d.account.href,
      "areaLocation": d.assetInfo.metadata.props.areaLocation.toLowerCase(),
      "geoReferenced": d.assetInfo.metadata.props.geoReferenced,
      "indoorMapping": d.assetInfo.metadata.props.indoorMapping,
      "locationCount": d.assetInfo.metadata.props.locationCount || 0,
      "polygon": points,
      "point": point,
      "zoneCount": d.assetInfo.metadata.props.zoneCount || 0,
      "accountId": d.assetInfo.metadata.props.accountId
    }
  }

  async function get(id) {
    let url = baseURL.concat('/area/', id);
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let d = await r.json();
    let a = convertArea(d)
    if (a.indoorMapping) {
      //get indoormapping
      let im = await indoor(a.indoorMapping)
      //get file
      let mf = await mapfile(im.fileUrl)
      a.indoor = im;
      a.mapfile = mf;
    }
    return a;
  }

  function convertImage(file) {
    let i = new Image();
    return new Promise((r, rej) => {
      i.onload = () => {
        let ratio = i.height / i.width;
        let height =
          (BOUND_COORDINATES.EAST - BOUND_COORDINATES.WEST) * ratio;
        let south = BOUND_COORDINATES.NORTH - height;
        let nwCorner = {
          lat: BOUND_COORDINATES.WEST,
          lng: BOUND_COORDINATES.NORTH
        };
        let seCorner = {
          lat: BOUND_COORDINATES.EAST,
          lng: south
        };
        r({
          nwCorner,
          seCorner
        })
      }
      i.src = file.preview
    })
  }
  async function create(area) {
    let geo = 'true'
    if (area.type === constants.AREA_INDOOR) {
      geo = 'false'
    }
    let points = ''
    if (area.polygon) {
      points = area.polygon.map(point => point.join(',')).join(';')
    }
    let s = {
      configValue: area.name,
      properties: {
        siteId: area.siteId,
        areaLocation: area.type,
        geoReferenced: geo,
        points: points
      }
    }
    if (area.address) {
      s.properties.address = area.address
    }
    if (area.point) {
      s.properties.point = [area.point.lng, area.point.lat].join(',')
    }
    if (area.file) { // part 1 of 2 steps
      area.file.account = area.account
      let coords = await convertImage(area.file)
      let f = await createMapfile(area.file)
      //now create indoor map properites //
      let im = {
        fileUrl: f.self.href,
        name: area.name,
        account: area.account,
        nwCorner: coords.nwCorner,
        seCorner: coords.seCorner,
        siteId: area.siteId
      }
      let indoor = await createIndoor(im) //step 2 of 2
      s.properties.indoorMapping = indoor.id
    }

    let url = baseURL.concat('/areas');
    let r = await fetchPlus({
      url: url,
      body: s,
      method: 'POST'
    });
    let d = await r.json()
    let ca = convertArea(d)
    if (ca.point) {
      ca.point = ca.point.join(',')
    }
    
    return ca
  }
    
  async function update(area) {
    let s = {
      name: area.name
    }
    if (area.polygon) {
      s.points = area.polygon.map(point => point.join(';')).join('')
    }
    
    let url = baseURL.concat('/area/', area.id);
    let r = await fetchPlus({
      url: url,
      body: s,
      method: 'PUT'
    });
    let d = await r.json();
    return convertArea(d)
  }

  async function remove(area) {
    let url = baseURL.concat('/area/', area.id);
    let r = await fetchPlus({
      url: url,
      method: 'DELETE'
    });
    return r
  }

  async function indoor(id) {
    const path = `/indoorMapping/${id}`
    let o = {
      url: baseURL.concat(path),
      method: 'GET'
    }
    let r = await fetchPlus(o)
    let data = await r.json()
    let d = data.assetInfo.metadata.props;
    return {
      name: d.name,
      account: data.account.href,
      siteId: d.siteId,
      fileUrl: d.fileUrl,
      nwCorner: d.nwCorner.split(',').map(i => Number.parseFloat(i)),
      seCorner: d.seCorner.split(',').map(i => Number.parseFloat(i))
    };
  }

  async function createIndoor(data) {
    let url = baseURL.concat('/indoorMappings')
    let body = {
      name: data.name,
      account: {
        href: data.account
      },
      siteId: data.siteId,
      fileUrl: data.fileUrl,
      nwCorner: {
        latitude: data.nwCorner.lat,
        longitude: data.nwCorner.lng
      },
      seCorner: {
        latitude: data.seCorner.lat,
        longitude: data.seCorner.lng
      }
    }
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'POST'
    })
    return await r.json()
  }

  async function mapfile(url) {
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    })
    let d = await r.json()
    return {
      id: d.id,
      account: d.account.href,
      name: d.name,
      preview: `data:image/png;base64,${d.data}`
    };
  }

  async function createMapfile(file) {
    let data = new FormData();
    data.append('file', file, file.name);
    let fileDef = {
      account: file.account,
      name: file.name,
      properties: {}
    };
    data.append(
      'fileDef',
      new Blob([JSON.stringify(fileDef)], {
        type: 'application/json'
      })
    );
    let url = rawURL.concat('/networkAsset/files')
    let r = await fetchPlus({
      url: url,
      method: 'POST',
      body: data,
      file: true
    })
    return await r.json()
  }


  return {
    get,
    create,
    update,
    remove,
    indoor,
    mapfile,
    createMapfile,
    createIndoor
  }
})()