var load = false
var login = false
var Mess = null
const yuzhuci = [{
  name: '送你的福气',
  text: '鼠年大吉,福气惊人',
  money: '88.66',
  des: '福气已经得到,并立即生效 >'
}, {
  name: '送你的运气',
  text: '鼠年大吉,好运连连',
  money: '66.88',
  des: '运气已经得到,并立即生效 >'
}, {
  name: '送你的财气',
  text: '鼠年大吉,财源滚滚',
  money: '8888.88',
  des: '财气已经得到,并立即生效 >'
}, {
  name: '送你的旺气',
  text: '鼠年大吉,旺气十足',
  money: '6666.66',
  des: '旺气已经得到,并立即生效 >'
}]
var Saudio = null
var Splay = false
var Splaytimer = null
var Spictr = null
var Sknum = 0
var Sname = ''
var Sid = ''
var url = window.location.href
var PersonData = {}
var bgflag = false
var bgok = false
let timer = null
let starter = null
let mi = 10000
let omi = 0
const TAid = getUrlParam('fu')
Loadshow('8%')
var app = null
try {
  app = window.tcb.init({
    env: cloudenvid
  })
} catch (e) {
  Loadshow('请使用手机版微信打开')
}
window.addEventListener('contextmenu', function (e) {
  e.preventDefault()
})
inittcb(() => {
  let ddone = false
  const conf = Mess.config
  conf.jsApiList = [
    'chooseImage',
    'getLocalImgData',
    'updateAppMessageShareData',
    'updateTimelineShareData',
    'startRecord',
    'stopRecord',
    'playVoice',
    'translateVoice',
    'onVoicePlayEnd',
    'stopVoice',
    'uploadVoice',
    'showAllNonBaseMenuItem',
    'downloadVoice',
    'pauseVoice'
  ]
  Loadshow('72%')
  wx.error(function (res) {
    console.log(res)
    ddone = true
    toshow('S_load')
    tohide('S_1')
    Loadshow('请在微信内使用')
  })
  wx.ready(function (res) {
    Loadshow('97%')
    if (Mess.tadata != null) {
      document.getElementById('pimg').setAttribute('src', Mess.tadata.img + '?ran=' + Math.random())
      wx.updateAppMessageShareData({
        title: '嗨，这是我送你的祝福【贺卡】',
        desc: '快来收下我的贺卡吧',
        link: `${location.origin}${location.pathname}?fu=${TAid}#`,
        imgUrl: `${location.origin}${location.pathname}/res/share.png`
      })
      wx.updateTimelineShareData({
        title: '嗨，这是我送你的祝福【贺卡】',
        link: `${location.origin}${location.pathname}?fu=${TAid}#`,
        imgUrl: `${location.origin}${location.pathname}/res/share.png`
      })
      wx.downloadVoice({
        serverId: Mess.tadata.audio,
        isShowProgressTips: 1,
        success: function (res) {
          Loadshow('100%')
          Saudio = res.localId
          omi = Mess.tadata.omi
          ddone = true
          start()
          playbg()
        }
      })
    } else {
      wx.updateAppMessageShareData({
        title: '嗨! 这是一个祝福【贺卡】',
        desc: '快来得到这个贺卡吧',
        link: `${location.origin}${location.pathname}#`,
        imgUrl: `${location.origin}${location.pathname}/res/share.png`
      })
      wx.updateTimelineShareData({
        title: '嗨! 这是一个创意祝福【贺卡】',
        link: `${location.origin}${location.pathname}#`,
        imgUrl: `${location.origin}${location.pathname}/res/share.png`
      })
      Loadshow('100%')
      ddone = true
      start()
      playbg()
    }
  })
  wx.config(conf)
  setTimeout(function () {
    if (ddone == false) Loadshow('请在微信内使用')
    ddone = true
  }, 3000)
})
function inittcb (success) {
  load = true
  const auth = app.auth()
  Loadshow('12%')
  auth.signInAnonymously().then(() => {
    Loadshow('20%')
    auth.getLoginState().then((e) => {
      load = false
      login = e.isAnonymous
      Loadshow('45%')
      Sid = e.credential.refreshToken
      app.callFunction({
        name: 'init',
        data: {
          uid: e.credential.refreshToken,
          url: url,
          taid: TAid
        }
      }, function (err, res) {
        Loadshow('62%')
        if (err) {
          Loadshow('服务连接异常,检查网络哦~')
        } else {
          if (res.result.code == 0) {
            Mess = res.result
            console.log(Mess)
            imgload()
            success ? success() : null
          } else {
            Loadshow('来访的人太多啦!稍后再试呢~')
          }
        }
      })
    })
  })
}
function imgload () {
  const MO = document.getElementById('KImgModel')
  for (const i in Mess.img) {
    getDataUrlBySrc(Mess.img[i]).then(b64 => {
      const TempImg = document.createElement('img')
      TempImg.setAttribute('src', b64)
      TempImg.setAttribute('id', 'KM' + i)
      MO.appendChild(TempImg)
    })
  }
}
function start () {
  tohide('S_load')
  toshow('S_1')
  document.getElementById('Topimg').classList.add('topimgshow')
  document.getElementById('S_1').classList.add('bodycolorshow')
  setTimeout(function () {
    document.getElementById('Topimg').setAttribute('onclick', 'go()')
  }, 1000)
}
function go () {
  if (Mess.tadata != null) {
    toshow('S_2')
    const S_Main = document.getElementById('S_Main')
    const suji = getRndInteger(0, yuzhuci.length)
    const zhuci = yuzhuci[suji]
    sethong({
      name: '来自' + Mess.tadata.name + zhuci.name,
      text: zhuci.text,
      money: zhuci.money,
      des: zhuci.des
    })
    toshow('S4btns')
    S_Main.classList.add('Show_S4')
    setTimeout(function () {
      S_Main.style = 'height:10%'
      S_Main.classList.remove('Show_S4')
    }, 480)
  } else {
    toshow('S_2')
    toshow('Main2')
    toshow('Cent2')
    toshow('Jinmode')
    toshow('chooseImg')
  }
  document.getElementById('S_1').classList.add('hideS_1')
  setTimeout(function () {
    tohide('S_1')
  }, 1000)
}
function laqu () {
  const S_Main = document.getElementById('S_Main')
  toshow('Personimg')
  toshow('Main2')
  toshow('Cent5')
  tohide('S4btns')
  S_Main.classList.add('Hide_S4')
  setTimeout(function () {
    toshow('S6btns')
    playAudio(document.getElementById('cbtn'), true)
    S_Main.style = ''
    S_Main.classList.remove('Hide_S4')
  }, 480)
}
function returnhong () {
  const S_Main = document.getElementById('S_Main')
  toshow('S4btns')
  tohide('S6btns')
  tohide('Cent5')
  S_Main.classList.add('Show_S4')
  setTimeout(function () {
    tohide('Main2')
    S_Main.style = 'height:10%'
    S_Main.classList.remove('Show_S4')
  }, 480)
}
function startnew () {
  Saudio = null
  omi = 0
  const S_Main = document.getElementById('S_Main')
  tohide('honglaqu')
  toshow('S4btns')
  tohide('S6btns')
  tohide('Cent5')
  tohide('Namein')
  S_Main.classList.add('Show_S4')
  setTimeout(function () {
    tohide('Personimg')
    tohide('S4btns')
    S_Main.style = 'height:10%'
    S_Main.classList.remove('Show_S4')
    S_Main.classList.add('Hide_S4')
    setTimeout(function () {
      document.getElementById('pimg').setAttribute('src', '')
      toshow('Jinmode')
      toshow('chooseImg')
      toshow('Cent2')
      toshow('S2btns')
      S_Main.style = ''
      S_Main.classList.remove('Hide_S4')
    }, 480)
  }, 480)
}
function toAudio () {
  toshow('Main3')
  tohide('Cent2')
  tohide('S2btns')
  toshow('S3btns')
  document.getElementById('Main2').classList.add('hideS_2')
  setTimeout(function () {
    tohide('Main2')
    document.getElementById('Main2').classList.remove('hideS_2')
  }, 480)
}
function chooseimg () {
  wx.ready(function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.localIds)
        wx.getLocalImgData({
          localId: res.localIds[0], // 图片的localID
          success: function (res) {
            console.log(res.localData.length)
            if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
              starteditpersonimg(res.localData)
            } else {
              starteditpersonimg('data:image/png;base64,' + res.localData)
            }
          }
        })
      },
      fail (e) {
        alert('微信授权异常,请退出再试一次吧~')
      }
    })
  })
}
function starteditpersonimg (img) {
  document.getElementById('pimg').setAttribute('src', img)
  document.getElementById('S2btnc').setAttribute('disabled', '')
  document.getElementById('S2btnf').setAttribute('disabled', '')
  tohide('chooseImg')
  tohide('kbtn')
  tohide('Jinmode')
  toshow('Personimg')
  toshow('confirmImg')
  toshow('S2btns')
  $('#pimg').cropper({
    aspectRatio: 824 / 1188,
    crop: function (data) {
      editdata = data
    }
  })
}
function doneeditimg () {
  try {
    $('#pimg').cropper('destroy')
    var canvas = document.getElementById('Pcanvas')
    var img = document.getElementById('pimg')
    let TempImg = document.getElementById('Mtemp')
    if (TempImg) {
      TempImg.setAttribute('src', img.src)
    } else {
      TempImg = document.createElement('img')
      TempImg.setAttribute('src', img.src)
      TempImg.setAttribute('id', 'Mtemp')
      document.getElementById('KImgModel').appendChild(TempImg)
    }

    Sknum = getRndInteger(0, Mess.img.length)
    var kimg = document.getElementById('KM' + Sknum)
    var context = canvas.getContext('2d')
    canvas.width = 1080
    canvas.height = 1604
    context.drawImage(TempImg, editdata.x, editdata.y, editdata.width, editdata.height, 128, 263, 815, 1177)
    context.drawImage(kimg, 0, 0, 1080, 1604)
    document.getElementById('pimg').setAttribute('src', canvas.toDataURL('image/png'))
    Spictr = document.getElementById('pimg')
    tohide('confirmImg')
    toshow('kbtn')
    document.getElementById('S2btnc').removeAttribute('disabled')
    document.getElementById('S2btnf').removeAttribute('disabled')
  } catch (e) {
    console.log(e)
    alert('内存告警,需要你重新尝试~')
  }
}
function changekimg () {
  try {
    var canvas = document.getElementById('Pcanvas')
    var img = document.getElementById('Mtemp')
    Sknum = (Sknum + 1 < Mess.img.length) ? Sknum + 1 : 0
    var kimg = document.getElementById('KM' + Sknum)
    var context = canvas.getContext('2d')
    canvas.width = 1080
    canvas.height = 1604
    context.drawImage(img, editdata.x, editdata.y, editdata.width, editdata.height, 128, 263, 815, 1177)
    context.drawImage(kimg, 0, 0, 1080, 1604)
    document.getElementById('pimg').setAttribute('src', canvas.toDataURL('image/png'))
  } catch (e) {
    console.log(e)
    alert('内存告警,需要你重新尝试~')
  }
}
function getRndInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
function inAudio () {
  const BB = document.getElementById('chooseAudio')
  const btn3c = document.getElementById('S3btnc')
  const btn3f = document.getElementById('S3btnf')
  if (Splay == true) {
    if (starter && !timer) {

    } else {
      if (bgok == true) playbg()
      window.clearInterval(timer)
      timer = null
      wx.stopRecord({
        success: function (res) {
          omi = 10000 - mi
          btn3c.removeAttribute('disabled')
          toshow('playAudio')
          toshow('Namein')
          toshow('bgmusic')
          tohide('audiotips')
          BB.classList.remove('Audiobtn')
          BB.classList.add('Audiobtn_d')
          BB.innerText = '重新录制'
          console.log(res)
          Saudio = res.localId
          Splay = false
          flagcheck()
        },
        fail: function (e) {
          console.log(e)
        }
      })
    }
  } else {
    if (Splay == false) bgok = bgflag
    Splay = true
    console.log('开始录音')
    if (bgok == true) playbg()
    wx.startRecord({
      success: function () {
        wx.stopRecord()
        try {
          tohide('playAudio')
          tohide('Namein')
          tohide('bgmusic')
          toshow('audiotips')
          BB.classList.remove('Audiobtn_d')
          BB.classList.add('Audiobtn')
          btn3c.setAttribute('disabled', '')
          btn3f.setAttribute('disabled', '')
          let bi = 3
          BB.innerText = bi + '秒后录音'
          starter = window.setInterval(function () {
            bi--
            BB.innerText = bi + '秒后录音'
            if (bi <= 0) {
              window.clearInterval(starter)
              starter = null
              wx.startRecord({
                success: function () {
                  mi = 10000
                  BB.innerText = '停止录制10秒'
                  timer = window.setInterval(function () {
                    mi -= 10
                    BB.innerText = '停止录制' + (parseInt(mi / 1000) + 1) + '秒'
                    if (mi <= 0) {
                      if (bgok == true) playbg()
                      window.clearInterval(timer)
                      timer = null
                      wx.stopRecord({
                        success: function (res) {
                          omi = 10000 - mi
                          btn3c.removeAttribute('disabled')
                          toshow('playAudio')
                          toshow('Namein')
                          toshow('bgmusic')
                          tohide('audiotips')
                          BB.classList.remove('Audiobtn')
                          BB.classList.add('Audiobtn_d')
                          BB.innerText = '重新录制'
                          console.log(res)
                          Saudio = res.localId
                          Splay = false
                          flagcheck()
                        },
                        fail: function (e) {
                          console.log(e)
                        }
                      })
                    }
                  }, 10)
                },
                fail: function (e) {
                  alert('不能录音:' + e.errMsg)
                  console.log(e)
                  toshow('playAudio')
                  tohide('audiotips')
                  btn3c.removeAttribute('disabled')
                  BB.innerText = '录制祝福语音'
                  flagcheck()
                }
              })
            }
          }, 1000)
        } catch (e) {
          console.log(e)
        }
      }
    })
  }
}
function playAudio (elm, col = false) {
  console.log(Splay)
  const bgaudiotance = document.getElementById('audioInstance')
  const PP = elm
  if (Splay == false) bgok = bgflag

  if (Splay == false) {
    Splay = true
    if (bgok == true) playbg()
    document.getElementById('S3btnc').setAttribute('disabled', '')
    document.getElementById('S3btnf').setAttribute('disabled', '')
    document.getElementById('S5btnc').setAttribute('disabled', '')
    document.getElementById('S5btnf').setAttribute('disabled', '')
    document.getElementById('S6btnc').setAttribute('disabled', '')
    document.getElementById('S6btnf').setAttribute('disabled', '')
    tohide('chooseAudio')
    tohide('Namein')
    PP.innerText = '播放中'

    wx.playVoice({
      localId: Saudio,
      success: function (res) {
        console.log('播放成功', res)
        Splaytimer = setTimeout(function () {
          clearTimeout(Splaytimer)
          Splaytimer = null
          wx.stopVoice({
            localId: Saudio,
            complete: function (res) {
              Splay = false
              if (bgok == true) playbg()
              toshow('Namein')
              document.getElementById('S3btnc').removeAttribute('disabled')
              document.getElementById('S5btnc').removeAttribute('disabled')
              document.getElementById('S5btnf').removeAttribute('disabled')
              document.getElementById('S6btnc').removeAttribute('disabled')
              document.getElementById('S6btnf').removeAttribute('disabled')
              PP.removeAttribute('disabled')
              toshow('chooseAudio')
              if (col) {
                PP.innerText = '再听一次祝福语音'
              } else {
                PP.innerText = '播放祝福语音'
              }
              flagcheck()
            }
          })
        }, omi - 100)
      },
      fail: function (e) {
        Splay = false
        console.log('播放失败', e)
        if (bgok == true) playbg()
        document.getElementById('S3btnc').removeAttribute('disabled')
        document.getElementById('S5btnc').removeAttribute('disabled')
        document.getElementById('S5btnf').removeAttribute('disabled')
        document.getElementById('S6btnc').removeAttribute('disabled')
        document.getElementById('S6btnf').removeAttribute('disabled')
        PP.removeAttribute('disabled')
        toshow('chooseAudio')
        toshow('Namein')
        if (col) {
          PP.innerText = '再听一次祝福语音'
        } else {
          PP.innerText = '播放祝福语音'
        }
        flagcheck()
      }
    })
  } else {
    wx.stopVoice({
      localId: Saudio,
      complete: function (res) {
        clearTimeout(Splaytimer)
        Splay = false
        toshow('Namein')
        if (bgok == true) playbg()
        document.getElementById('S3btnc').removeAttribute('disabled')
        document.getElementById('S5btnc').removeAttribute('disabled')
        document.getElementById('S5btnf').removeAttribute('disabled')
        document.getElementById('S6btnc').removeAttribute('disabled')
        document.getElementById('S6btnf').removeAttribute('disabled')
        PP.removeAttribute('disabled')
        toshow('chooseAudio')
        if (col) {
          PP.innerText = '再听一次祝福语音'
        } else {
          PP.innerText = '播放祝福语音'
        }
        flagcheck()
      }
    })
  }
}
function Loadshow (msg) {
  document.getElementById('Loadtips').innerText = msg
}
function inName (e) {
  Sname = e.value
  flagcheck()
}
function flagcheck () {
  if (Sname != '' && Spictr != null && Saudio != null) {
    document.getElementById('S3btnf').removeAttribute('disabled')
  } else {
    document.getElementById('S3btnf').setAttribute('disabled', '')
  }
}
function done () {
  const S_Main = document.getElementById('S_Main')
  sethong({
    name: Sname + '的福气',
    text: '鼠年大吉,福气滚滚',
    des: '福气来临,稍等片刻'
  })
  tohide('Main3')
  tohide('S3btns')
  toshow('S4btns')
  tohide('honglaqu')
  document.getElementById('hongDes').style = ''
  document.getElementById('cbtn').innerText = '听听他送你的祝福'
  S_Main.classList.add('Show_S4')
  setTimeout(function () {
    S_Main.style = 'height:10%'
    S_Main.classList.remove('Show_S4')
  }, 480)
  let okflag = false
  let tiflag = false
  const TTimer = setTimeout(function () {
    tiflag = true
    console.log('1.5秒')
    if (okflag) {
      doneok()
    }
  }, 1500)
  console.log(Saudio, Spictr, Sname)
  PersonData.name = Sname
  PersonData._id = Sid
  var dataurl = Spictr.src
  var arr = dataurl.split(','); var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  var obj = new Blob([u8arr], { type: mime })

  app.uploadFile({
    cloudPath: 'User/' + Sid + '.png',
    filePath: obj
  }).then((e) => {
    PersonData.img = CloudIdtourl(e.fileID)
    wx.uploadVoice({
      localId: Saudio,
      isShowProgressTips: 1,
      success: function (res) {
        PersonData.audio = res.serverId
        PersonData.omi = omi
        console.log(PersonData)
        app.callFunction({
          name: 'Add',
          data: PersonData
        }, function (err, res) {
          console.log(err, res)
          okflag = true
          if (tiflag) {
            doneok()
          }
        })
      }
    })
  })
}
function doneok () {
  document.getElementById('cbtn').innerText = '听听你制作的祝福语音'
  toshow('Main2')
  toshow('Cent5')
  tohide('S4btns')
  toshow('honglaqu')
  document.getElementById('hongDes').style = 'visibility: hidden;'
  S_Main.classList.add('Hide_S4')
  setTimeout(function () {
    toshow('S5btns')
    S_Main.style = ''
    S_Main.classList.remove('Hide_S4')
  }, 480)
  wx.updateAppMessageShareData({
    title: '嗨，这是我送你的祝福【贺卡】',
    desc: '快来收下我的贺卡吧',
    link: `${location.origin}${location.pathname}?fu=${Sid}#`,
    imgUrl: `${location.origin}${location.pathname}/res/share.png`
  })
  wx.updateTimelineShareData({
    title: '嗨，这是我送你的祝福【贺卡】',
    link: `${location.origin}${location.pathname}?fu=${Sid}#`,
    imgUrl: `${location.origin}${location.pathname}/res/share.png`
  })
}
function returnMade () {
  const S_Main = document.getElementById('S_Main')
  tohide('S5btns')
  tohide('Cent5')
  toshow('S4btns')
  S_Main.classList.add('Show_S4')
  setTimeout(function () {
    tohide('Main2')
    S_Main.style = 'height:10%'
    S_Main.classList.remove('Show_S4')
    S_Main.classList.add('Hide_S4')
    tohide('S4btns')
    setTimeout(function () {
      toshow('S3btns')
      S_Main.classList.remove('Hide_S4')
      toshow('Main3')
      S_Main.style = ''
    }, 480)
  }, 480)
}
function weixinShareTimeline () {
  toshow('cover')
  toshow('guide')
}
function hideguide () {
  tohide('cover')
  tohide('guide')
}
function returnimg () {
  toshow('Main2')
  tohide('Main3')
  tohide('S3btns')
  toshow('S2btns')
  document.getElementById('Main2').classList.add('showS_2')
  setTimeout(function () {
    toshow('Cent2')
    document.getElementById('Main2').classList.remove('showS_2')
  }, 480)
}
function toshow (id) {
  const div = document.getElementById(id)
  div.classList.remove('unvisable')
}
function tohide (id) {
  const div = document.getElementById(id)
  div.classList.add('unvisable')
}
function getDataUrlBySrc (src) {
  return new Promise((resolve, reject) => {
    const xmlHTTP = new XMLHttpRequest()
    xmlHTTP.open('GET', src, true)
    xmlHTTP.responseType = 'arraybuffer'
    xmlHTTP.onload = function (e) {
      const arr = new Uint8Array(xmlHTTP.response)
      const raw = Array.prototype.map.call(arr, charCode => String.fromCharCode(charCode)).join('')
      const b64 = btoa(raw)
      const dataURL = 'data:image/jpeg;base64,' + b64
      resolve(dataURL)
    }
    xmlHTTP.onerror = function (err) {
      reject(err)
    }
    xmlHTTP.send()
  })
}
function CloudIdtourl (img) {
  const first = img.indexOf('.')
  const end = img.indexOf('/', first)
  return 'https://' + img.slice(first + 1, end) + '.tcb.qcloud.la/' + img.slice(end + 1, img.length)
}
function playbg () {
  var BGMplayer = document.getElementById('audioInstance')
  var BGbtn = document.getElementById('bgmusic')
  if (bgflag == false) {
    toshow('bgmusic')
    BGbtn.classList.remove('radio-s-control')
    BGMplayer.volume = 0.3
    BGMplayer.play()
    bgflag = true
  } else {
    BGbtn.classList.add('radio-s-control')
    BGMplayer.pause()
    bgflag = false
  }
}
function sethong (obj) {
  obj.name ? (document.getElementById('hongName').innerText = obj.name) : null
  obj.fu ? (document.getElementById('hongFu').innerText = obj.fu) : null
  obj.text ? (document.getElementById('hongText').innerText = obj.text) : null
  obj.des ? (document.getElementById('hongDes').innerText = obj.des) : null
  if (obj.money != null) {
    document.getElementById('hongmt').innerText = obj.money
    toshow('hongmtmode')
    tohide('hongm')
  } else {
    tohide('hongmtmode')
    toshow('hongm')
  }
}
function getUrlParam (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]); return null
}
