/**
 * Created by singyujo on 2016-12-01.
 */

let privateKey = require('./config.js');

var RtmClient = require('@slack/client').RtmClient;
var ClientEvents = require('@slack/client').CLIENT_EVENTS;
var RtmEvents = require('@slack/client').RTM_EVENTS;
var MemoryDataStore = require('@slack/client').MemoryDataStore;
var Slack = require('slack-node');
var htmlDecode = require('htmlencode').htmlDecode;
var urlencode = require('urlencode');

console.log(`START`);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var rtm = new RtmClient(privateKey.RtmClient, {
    dataStore: new MemoryDataStore(),
    // logLevel: 'verbose',
    // useRtmConnect: true
});

var slack = new Slack(privateKey.Slack);

rtm.on(ClientEvents.RTM.AUTHENTICATED, function(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name}`);
});

rtm.start();

onenoteLinkHandler = function (msg) {
    // console.log('1111')
    // console.log(rtm.dataStore.getUserById(msg.user))

    // 원노트 링크
    //onenote:///P:\OneNote\DP\01_업무\자료.one#aaaaa%20모드&section-id={C2DC2369-588E-41FE-A1CA-B615089D2F4E}&page-id={0B4526AD-4388-4A96-BA5F-D70965453227}&end
    var captures = /onenote:\/\/\/.+\\([^\\]+)[.]one#([^&]+&amp;)?section-id=.+end/g.exec(msg.text);
    if (!captures) return false;

    var noteName = decodeURIComponent(captures[2] ? captures[2].substr(0, captures[2].length - 5) : captures[1]);
    console.log(noteName);
    slack.api('chat.delete', {
        ts : msg.ts,
        channel : msg.channel,
    }, function (e, r) {
        // console.log(e, r);
    });
    var user = rtm.dataStore.getUserById(msg.user);

    // 크롬64 버전부터 원노트 링크 동작을 안하는 문제가 있어서 윈도우에 별도의 프로토콜 등록 후 해당 프로토콜 핸들러 프로그램에서 원노트 오픈
    var lnk = htmlDecode(captures[0].replace('onenote:', 'onenotelinker:'));
    //console.log(lnk);
    lnk = encodeURIComponent(lnk);

    postMsg = msg.text.replace(/onenote:\/\/\/.+\\([^\\]+)[.]one#([^&]+&amp;)?section-id=.+end/g, ` <http://dev_dp-d:9292/?${lnk}|:orange_book:${noteName}> `)
    console.log(msg);
    slack.api('chat.postMessage', {
        channel : msg.channel,
        text : postMsg,
        as_user : false,
        icon_url : user.profile.image_48,//'https://ca.slack-edge.com/T2WN70ANL-U39PZDSRL-9340acd3abda-48',
        username : user.real_name,
    }, function (e, r) {
    	console.log(e, r);
    });
    return true;
}

rtm.on(RtmEvents.MESSAGE, function (msg) {
    if (msg.hidden) return;
    if (onenoteLinkHandler(msg)) return;
});

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<script language="javascript">
    <!--
        document.location = decodeURIComponent(window.location.search.substr(1))
    -->
    </script>`);
}).listen(9292);
