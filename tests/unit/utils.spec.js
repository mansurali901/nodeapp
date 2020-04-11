import {expect, use} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import mockStorage from '../utils/localStorage'
import mockFetch from '../utils/fetch'


import {fetchPlus} from '@/utils'


use(sinonChai)

describe('utils', () => {

  before(()=>{
    mockStorage()
    mockFetch()
  })
  after(()=>{
    window.localStorage.removeItem('conductor_auth_token')
  })

  it('has the access token in a request', async () => {
    
    let url = 'http://bogus.com/tests'
    let data = {a: 1}
    let opts = {
      url: url,
      body: data
    }
    
    let r = await fetchPlus(opts)
    expect(r.headers).to.include({'authorization': 'Bearer 23r3-asdasdf'})
  })

  it('should stringify the body for json', async () => {
    
    let url = 'http://bogus.com/tests'
    let data = {a: 1}
    let opts = {
      url: url,
      body: data
    }
    let spy = sinon.spy(global,'fetch')
    await fetchPlus(opts)
    expect(spy).to.have.been.calledWith(url, {
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", authorization: "Bearer 23r3-asdasdf" },
      method: "GET"
    })
    global.fetch.restore()
  })


  it('prepares a body for a form post', async () => {
    
    let url = 'http://bogus.com/tests'
    let data = new FormData();
    data.append('email', 'user@example.com')
    data.append('name', 'first last')
    let spy = sinon.spy(global,'fetch')
    let opts = {
      url: url,
      form: true,
      body: data
    }
    
    try {
      await fetchPlus(opts)
    } catch (error) {
      console.log(error)
    }
    expect(spy).to.have.been.calledWith(url, {
      body: data,
      headers: { authorization: "Bearer 23r3-asdasdf" },
      method: "GET"
    })
    global.fetch.restore()
  })
})