import { tokenInfo } from '../utils'
import constants from '../constants'

const TOKEN_STRING = 'conductor_auth_token';

//users stuff
export default (() => {
  const clientId = process.env.VUE_APP_CONDUCTOR_CLIENT_ID || '';
  const clientSecret = process.env.VUE_APP_CONDUCTOR_SECRET || '';
  const basePath = process.env.VUE_APP_AUTH_SERVER || '';
  const networkAssetURL = process.env.VUE_APP_NETWORK_ASSETS_URL || '';
  const tokenPath = '/oauth/token';
  const airfinderPath = '/networkAsset/airfinder';

  let refreshTokenInProgress;
  let refreshTokenPromise;

  async function authenticate(username, password) {
    let body = `grant_type=password&username=${username}&password=${password}&` +
      `client_id=${clientId}&client_secret=${clientSecret}`

    let url = basePath.concat(tokenPath);
    let r = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body
    })
    if (r.status >= 200 && r.status < 300) {
      const data = await r.json();
      return saveToken(data);
    }
    if (r.status >= 400) {
      throw (constants.INVALID_AUTH)
    }
  }

  async function forgotPassword(username) {
    let params = 'email='.concat(encodeURIComponent(username));
    let path = `${airfinderPath}/users/forgotPassword?${params}`;
    let url = networkAssetURL.concat(path);

    let r = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (r.status >= 200 && r.status < 300) {
      return;
    }
    if (r.status >= 400 && r.status < 500) {
      throw (constants.INVALID_EMAIL);
    }
    if (r.status >= 500) {
      throw (constants.UNKNOWN_ERROR);
    }
  }

  async function logout() {
    await revokeToken();
    localStorage.removeItem(TOKEN_STRING);
  }

  /**
   * Refreshes the Access and Refresh Tokens
   * 
   * This function only uses only concurrent api call, it reuses a pending api call if it is in progress
   */
  async function refreshToken() {
    if (!refreshTokenInProgress) {
      refreshTokenInProgress = true;
      refreshTokenPromise = new Promise(async (resolve, reject) => {
        try {
          resolve(await refreshTokenCall());
        } catch (e) {
          reject(e);
        } finally {
          refreshTokenInProgress = false;
        }
      })
    }
    return refreshTokenPromise;
  }

  async function revokeToken() {
    let url = basePath.concat('/oauth2/revoke');
    let access_token = tokenInfo().access_token;
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', Authorization: `Bearer ${access_token}` },
        responseType: 'text'
      });
    } catch (error) {
      console.log('unable to call revoke, ignoring')
    }
   
  }
  async function currentUser() {

  }

  function saveToken(data) {
    let token = Object.assign({ last_refresh: Date.now() }, data);
    token.expires_in = token.expires_in * 1000 //was in seconds need ms for timestamp in js
    localStorage.setItem(TOKEN_STRING, JSON.stringify(token)); //same auth as in airfinder... mhmmm maybe not do this
    return token;
  }

  async function refreshTokenCall() {
    const token = tokenInfo().refresh_token
    let url = `${basePath}${tokenPath}`
    let r = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        `grant_type=refresh_token&refresh_token=${token}&` +
        `client_id=${clientId}&client_secret=${clientSecret}`
    })
    if (r.status >= 200 && r.status < 300) {
      const data = await r.json();
      return saveToken(data);
    }
    if (r.status >= 400) {
      throw (constants.NEED_LOGIN)
    }
  }

  return {
    authenticate: authenticate,
    refreshToken: refreshToken,
    currentUser: currentUser,
    logout: logout,
    forgotPassword: forgotPassword
  }
})();