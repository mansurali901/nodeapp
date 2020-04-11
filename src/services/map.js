import { fetchPlus } from '../utils';

//sites stuff
export default (() => {
  const TOKEN = process.env.VUE_APP_MAPBOX_TOKEN;
  const sitesPath = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/';

  //GET
  // /styles/v1/{username}/{style_id}/static/{overlay}/{lon},{lat},{zoom},{bearing},{pitch}{auto}/{width}x{height}{@2x}
  async function static(polygon) {

  }

  return {
    static
  }
})()