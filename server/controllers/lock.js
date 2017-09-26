let rp = require('request-promise')
let xml2js = require('xml2js')
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录态校验之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    ctx.state.data = {user: null, doorKey: null};
    let user = ctx.state.$wxInfo.userinfo
    if (ctx.state.$wxInfo.loginState === 1) {
        ctx.state.data.user = user
    } else {
        ctx.state.data.user = 'Not Login'
        ctx.state.data.doorKey = 'Not Login'
        return
    }

    let url = 'http://dl.targence.com/?token=dqFrNqm4LhEjFkcyWmqmEURHCzhhoxFMG'
    let msg = `<xml><ToUserName><![CDATA[gh_d2ee75018a07]]></ToUserName>
        <FromUserName><![CDATA[${user.openId}]]></FromUserName>
        <CreateTime>${user.watermark.timestamp}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[Key]]></Content>
        <MsgId>6469198338645048208</MsgId>
        </xml>`
    let doorKey = ''
    let xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true })

    let a 
    await rp({
        url: url,
        method: 'POST',
        body: msg
    }).then((body) => {
        a = body
    }).catch(err => {
        a = err
    })

    await xmlParser.parseString(a, (err, result) => {
        if (err != null) doorKey = err
        else doorKey = result.xml.Content
    })

    console.log("doorKey = ", doorKey)
    ctx.state.data.doorKey = doorKey
}
