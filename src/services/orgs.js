import { fetchPlus } from '../utils';

export default (() => {
  const basePath = process.env.VUE_APP_NETWORK_ASSETS_URL || '';
  const orgsPath = '/networkAsset/airfinder/';

  async function create(org) {
    let url = basePath.concat(orgsPath, 'organizations');
    let body = {
      ...org,
      properties: {
        description: org.description,
      }
    };
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'POST'
    });
    let d = await r.json();
    let props = d.assetInfo.metadata.props;
    return {
      "id": d.id,
      "name": d.value,
      "description": props.description,
      "address1": props.address1,
      "address2": props.address2,
      "city": props.city,
      "state": props.state,
      "zipcode": props.zipcode,
      "country": props.country,
      "primaryContact": props.primaryContact,
      "primaryPhone": props.primaryPhone,
      "primaryEmail": props.primaryEmail,
      "techContact": props.techContact,
      "techPhone": props.techPhone,
      "techEmail": props.techEmail,
      "status": d.assetInfo.enabled ? "Enabled" : "Disabled"
    }
  }

  async function remove(org) {
    let url = basePath.concat(orgsPath, 'organization/', org.id);
    let r = await fetchPlus({
      url: url,
      method: 'DELETE'
    });
    return r
  }

  async function update(org) {
    let url = basePath.concat(orgsPath, 'organization/', org.id);
    let body = {
      name: org.name,
      description: org.description,
      address1: org.address1,
      address2: org.address2,
      city: org.city,
      state: org.state,
      zipcode: org.zipcode,
      country: org.country,
      primaryContact: org.primaryContact,
      primaryPhone: org.primaryPhone,
      primaryEmail: org.primaryEmail,
      techContact: org.techContact,
      techPhone: org.techPhone,
      techEmail: org.techEmail
    };
    let r = await fetchPlus({
      url: url,
      body: body,
      method: 'PUT'
    });
    let d = await r.json();
    let props = d.assetInfo.metadata.props;
    return {
      "id": d.id,
      "name": d.value,
      "description": props.description,
      "address1": props.address1,
      "address2": props.address2,
      "city": props.city,
      "state": props.state,
      "zipcode": props.zipcode,
      "country": props.country,
      "primaryContact": props.primaryContact,
      "primaryPhone": props.primaryPhone,
      "primaryEmail": props.primaryEmail,
      "techContact": props.techContact,
      "techPhone": props.techPhone,
      "techEmail": props.techEmail,
      "status": d.assetInfo.enabled ? "Enabled" : "Disabled"
    }
  }

  async function list() {
    let url = basePath.concat(orgsPath, 'organizations');
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let data = await r.json();
    let simple = data.map(d => {
      let props = d.assetInfo.metadata.props;
      return {
        "id": d.id,
        "name": d.value,
        "description": props.description,
        "address1": props.address1,
        "address2": props.address2,
        "city": props.city,
        "state": props.state,
        "zipcode": props.zipcode,
        "country": props.country,
        "primaryContact": props.primaryContact,
        "primaryPhone": props.primaryPhone,
        "primaryEmail": props.primaryEmail,
        "techContact": props.techContact,
        "techPhone": props.techPhone,
        "techEmail": props.techEmail,
        "status": d.assetInfo.enabled ? "Enabled" : "Disabled"
      }
    });
    return simple
  }

  // Get an individual organization by id
  async function getOrg(id) {
    let url = basePath.concat(orgsPath, 'organization/', id)
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    })
    let d = await r.json()
    let props = d.assetInfo.metadata.props;
    return {
      "id": d.id,
      "name": d.value,
      "description": props.description,
      "address1": props.address1,
      "address2": props.address2,
      "city": props.city,
      "state": props.state,
      "zipcode": props.zipcode,
      "country": props.country,
      "primaryContact": props.primaryContact,
      "primaryPhone": props.primaryPhone,
      "primaryEmail": props.primaryEmail,
      "techContact": props.techContact,
      "techPhone": props.techPhone,
      "techEmail": props.techEmail,
      "status": d.assetInfo.enabled ? "Enabled" : "Disabled"
    }
  }
  
  const ACCOUNT_PATH = '/fooDomain/fooServlet/paths/'

  function convertSite(data) {
    let aid = data.account.href && data.account.href.split(ACCOUNT_PATH)[1]
    return {
      "id": data.id,
      "name": data.value,
      "account": data.account.href,
      "accountId": aid,
      "organizationId": data.properties
    }
  }
  async function listOrgSites(id) {
    let url = basePath.concat(orgsPath, 'organization/', id, '/sites/')
    let r = await fetchPlus({
      url: url,
      method: 'GET'
    })
    let d = await r.json()
    return d.map(s=>convertSite(s));
  }

  // Get all super admin role users associated with organization id (parameter)
  async function listOrgAdmins(id) {
    let url = basePath.concat(orgsPath, 'organization/', id, "/users")
    let body = await fetchPlus({
      url: url,
      method: 'GET'
    });
    let data = await body.json();
    let filter = data.filter(d =>
      d.assetInfo.metadata.props.role === "Admin" || "SuperAdmin"
    )
    let map = filter.map(d => {
      let props = d.assetInfo.metadata.props;
      return {
        "email": props.email,
        "organizationId": props.organizationId,
        "role": props.role.toLowerCase(),
        "userId": props.userId
      }
    })
    return map;
  }

  // Add an organization admin
  async function putOrgAdmin(admin) {
    let url = basePath.concat(orgsPath, 'organization/', admin.organizationId, '/users');
    let body = await fetchPlus({
      url: url,
      body: {
        userId: admin.userId,
        username: admin.email,
        role: admin.role,
        siteAdminIds: [""]
      },
      method: 'PUT'
    });
    return body;
  }

  // Remove an organization admin
  async function removeOrgAdmin(admin) {
    let url = basePath.concat(orgsPath, 'organization/', admin.organizationId, '/users/', admin.email);
    let body = await fetchPlus({
      url: url,
      method: 'DELETE'
    })
    return body;
  }

  return {
    create,
    remove,
    update,
    list,
    getOrg,
    listOrgAdmins,
    putOrgAdmin,
    removeOrgAdmin,
    listOrgSites
  }
})();
