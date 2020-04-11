import constants from '@/constants'

export default (() => {
  const baseURL = 'https://maps.googleapis.com/maps/api/geocode'


  // https://geocoder.api.here.com/6.2/geocode.json?app_id={YOUR_APP_ID}&app_code={YOUR_APP_CODE}&searchtext=425+W+Randolph+Chicago

  const key = process.env.VUE_APP_GOOGLE_API_KEY
  // const appid = process.env.

  async function convert(address) {
    let encoded = encodeURIComponent(address)
    let url = baseURL.concat('/json?address=', encoded, '&key=', key);

    let r = await fetch(url, {
      method: 'GET'
    });
    if (r.status >= 200 && r.status < 300) {
      let data = await r.json();
      if (data.status === "OK") {
        if (data.results[0]) {
          return data.results[0].geometry.location
        }
        return null
      }
      throw (data.status, { message: data.error_message })
    } else {
      let e = await r.json()
      let msg = e && e.message ? e.message : 'Google API Error '.concat(r.status)
      throw (constants.INVALID_RESPONSE, { message: msg })
    }
  }

  return {
    convert
  }
})()