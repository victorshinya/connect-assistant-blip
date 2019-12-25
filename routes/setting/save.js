// https://www.npmjs.com/package/blip-sdk
const blip = require('blip-sdk')
// http://npmjs.com/package/lime-transport-websocket
const webSocketTransport = require('lime-transport-websocket')
// https://www.npmjs.com/package/ibm-watson
const AssistantV2 = require('ibm-watson/assistant/v2')
const auth = require('ibm-watson/auth')

// Set Watson Assistant variables
var sessionId, context

module.exports = (req, res) => {
    console.log(req.body)
    process.env.ASSISTANT_APIKEY = req.body.iam_apikey
    process.env.ASSISTANT_ID = req.body.assistant_id
    process.env.BLIP_ID = req.body.blip_identifier
    process.env.BLIP_ACCESSKEY = req.body.blip_access_key

    if (!process.env.ASSISTANT_APIKEY && !process.env.ASSISTANT_ID && !process.env.BLIP_ID && !process.env.BLIP_ACCESSKEY) {
        res.status(400).res({ statusText: "Not found enough resource to complete the request" })
    }

    const assistant = new AssistantV2({
        version: process.env.ASSISTANT_VERSION,
        authenticator: new auth.IamAuthenticator({
            apikey: process.env.ASSISTANT_APIKEY
        }),
    })

    const client = new blip.ClientBuilder()
        .withIdentifier(process.env.BLIP_ID)
        .withAccessKey(process.env.BLIP_ACCESSKEY)
        .withTransportFactory(() => new webSocketTransport())
        .build()

    client.connect()
        .then(async session => {
            console.log(session)
            if (!sessionId) {
                const sessionResponse = await assistant.createSession({
                    assistantId: process.env.ASSISTANT_ID
                })
                console.log(`session_id: ${JSON.stringify(sessionResponse.result.session_id)}`)
                sessionId = sessionResponse.result.session_id
            }
            client.addMessageReceiver(true, async message => {
                console.log(message)
                const response = await assistant.message({
                    assistantId: process.env.ASSISTANT_ID,
                    sessionId: sessionId,
                    input: {
                        text: message.content,
                        options: {
                            return_context: true,
                        }
                    },
                    context: context
                })
                for (var i = 0; i < response.result.output.generic.length; i++) {
                    const msg = {
                        type: "text/plain",
                        content: response.result.output.generic[i].text,
                        to: message.from,
                    }
                    client.sendMessage(msg)
                }
            })
            res.status(200).json({ statusText: "Conected!" })
        })
        .catch(err => {
            console.error(err.message)
            res.status(500).json({ statusText: "Fail to connect to Blip.ai server" })
        })
}
