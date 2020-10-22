const request = require('request')
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

const {
  appid,
  secret
} = require('./config.json')

var getAccessToken = () => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
      method: 'GET'
    }, (error, response, body) => {
      if (error) {
        reject(error)
      }
      resolve((typeof response.body === 'object') ? response.body : JSON.parse(response.body))
    })
  })
}
const jsapi_ticket = token => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`,
      method: 'GET'
    }, (error, response, body) => {
      if (error) {
        reject(error)
      }
      resolve((typeof response.body === 'object') ? response.body : JSON.parse(response.body))
    })
  })
}

exports.main = async event => {
  console.log(event)
  const result = (await db.collection('token').where({
    _id: 'TK'
  }).get()).data

  if (result.length !== 0 && Date.now() < (result[0].createTime + result[0].expiresIn - 10000)) {
    if (Date.now() < (result[0].TcreateTime + result[0].Texpires_in - 7000)) {
      if (event.t) {
        return result[0].accessToken
      } else {
        return result[0].Ticket
      }
    } else {
      const ticket = await jsapi_ticket(result[0].accessToken)
      const Tein = ticket.expires_in * 1000
      await db.collection('token').doc('TK').update({
        data: {
          TcreateTime: Date.now(),
          Ticket: ticket.ticket,
          Texpires_in: Tein
        }
      })
      if (event.t) {
        return result[0].accessToken
      } else {
        return ticket.ticket
      }
    }
  } else {
    const accessTokenBody = await getAccessToken()
    const act = accessTokenBody.access_token
    const ein = accessTokenBody.expires_in * 1000

    const ticket = await jsapi_ticket(act)
    const Tein = ticket.expires_in * 1000
    console.log('存入', act, ein, ticket.ticket, Tein)
    if (result.length != 0) {
      await db.collection('token').doc('TK').update({
        data: {
          accessToken: act,
          expiresIn: ein,
          createTime: Date.now(),
          TcreateTime: Date.now(),
          Ticket: ticket.ticket,
          Texpires_in: Tein
        }
      })
    } else {
      await db.collection('token').add({
        data: {
          _id: 'TK',
          accessToken: act,
          expiresIn: ein,
          createTime: Date.now(),
          TcreateTime: Date.now(),
          Ticket: ticket.ticket,
          Texpires_in: Tein
        }
      })
    }

    if (event.t) {
      return accessTokenBody.access_token
    } else {
      return ticket.ticket
    }
  }
}