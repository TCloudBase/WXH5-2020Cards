const crypto = require('crypto')
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

const { appid } = require('./config.json')

// sha1加密
function sha1 (str) {
  var shasum = crypto.createHash('sha1')
  shasum.update(str)
  str = shasum.digest('hex')
  return str
}

/**
 * 生成签名的时间戳
 */
function createTimestamp () {
  return parseInt(new Date().getTime() / 1000) + ''
}

/**
 * 生成签名的随机串
 */
function createNonceStr () {
  return Math.random().toString(36).substr(2, 15)
}

/**
 * 对参数对象进行字典排序
 * @param  {对象} args 签名所需参数对象
 * @return {字符串}    排序后生成字符串
 */
function raw (args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}

exports.main = async event => {
  const result = {}
  console.log(event.uid)
  try {
    const ticket = await cloud.callFunction({ name: 'token' })
    var ret = {
      jsapi_ticket: ticket.result,
      nonceStr: createNonceStr(),
      timestamp: createTimestamp(),
      url: event.url
    }
    console.log(ret)
    var string = raw(ret)
    ret.signature = sha1(string)
    ret.appId = appid
    result.config = ret

    if (event.taid != null) {
      const tmess = (await db.collection('user').where({_id:event.taid}).get()).data
      if (tmess.length !== 0) {
        result.tadata = tmess[0]
      }
    }
    const mess = (await db.collection('image').doc('SI').get()).data;
    result.img = mess.img
    result.code = 0
  } catch(e){
    console.log(e)
    result.code = -1
    result.err = e
  }
  return result
}
