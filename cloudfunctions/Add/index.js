const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async event => {
  var result = {}
  try {
    if (event._id != null && (await db.collection('user').where({_id:event._id}).get()).data.length !== 0) {
      const id = event._id
      delete event._id
      await db.collection('user').doc(id).update({data:event})
      result.msg = {
        id: id
      }
    } else {
      result.msg = await db.collection('user').add({data:event})
    }
    result.code = 0
  } catch (e) {
    console.log(e)
    result.code = -1
    result.err = e
  }
  return result
}
