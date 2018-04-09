module.exports = function (app, io) {
  var call = require('../controllers/callController')
  var xapi = require('../controllers/xapi')
  var codec = require('../controllers/codecController')

  app.route('/api/call')
    .get(call.getCalls)
    .post((req, res) => {
      call.createACall(req, res, io)
    })

  app.route('/api/call/:callId')
    .put((req, res) => {
      call.updateCall(req, res, io)
    })

  app.route('/api/disconnect')
    .post(xapi.startFeedbackProcess)

  app.route('/api/codec')
    .get(codec.getCodecs)

  app.route('/api/codec/:mac')
    .get(codec.getOneCodec)

  app.route('/api/codec/diagnostics/:mac')
    .get(codec.getDiagnostics)
}
