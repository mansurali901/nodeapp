export default ()=>{
  let fetch =async (url,options)=>{
    function json(){
      return {
        a: 1
      }
    }
    return {url, options, json, status: 200, headers: options.headers }
  }
  global.fetch = fetch
}