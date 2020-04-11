import constants from './constants';
import moment from "moment";

const ls = window.localStorage;

function tokenInfo() {
  try {
    let ti = ls.getItem('conductor_auth_token') || '{}';
    return JSON.parse(ti);
  } catch (e) {
    console.error(e, 'unable to get token info');
  }
  return {}
}

export { tokenInfo }


async function fetchPlus(opts) {
  let t = tokenInfo();

  let hdefault = { 'authorization': 'Bearer '.concat(t.access_token) }
  if ((!opts.headers || !opts.headers['Content-type']) && !opts.form && !opts.file) {
    hdefault['Content-Type'] = 'application/json'
  }
  if (opts.form) {
    hdefault['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  let url = opts.url;
  if (!url) {
    throw ('need url')
  }
  let headers = Object.assign(opts.headers || {}, hdefault)
  let fopts = {
    headers: headers,
    method: opts.method || 'GET'
  }
  if (opts.body) {
    fopts.body = opts.body
  }
  if (headers['Content-Type'] === 'application/json' && fopts.body) {
    fopts.body = JSON.stringify(fopts.body);
  }
  let r = await fetch(url, fopts)
  if (r.status === 401) {
    throw (constants.NEED_AUTH)
  } else if (r.status === 403) {
    throw (constants.FORBIDDEN, { message: "You are not authorized" })
  } else if (r.status >= 200 && r.status < 300) {
    return r
  } else {
    let e = await r.json()
    let msg = e && e.message ? e.message : 'API Error '.concat(r.status)
    throw (constants.INVALID_RESPONSE, { message: msg })
  }

}

export { fetchPlus }


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

export { sortByName }

function isTokenTimeValid(tokenTimeInMinutes, expiresInMilliSeconds) {

  let now = Date.now();
  let diff = now - tokenTimeInMinutes;
  return (diff < expiresInMilliSeconds);
}

export { isTokenTimeValid }

function convertToTitleCase(input) {
  if (typeof input === "string") {
    return input.replace(/[a-zA-Z]+/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  return input;
}

export { convertToTitleCase }


function timeSince(dateTime) {
  return moment(dateTime).fromNow();
}

export { timeSince }

function daysDifference(dateTime) {
  return moment().diff(dateTime, 'days');
}

export { daysDifference }