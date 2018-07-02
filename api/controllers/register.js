var request = require('request')
var parseString = require('xml2js').parseString

exports.registerCallDisconnect = function (logger) {
  var options = {
    method: 'GET',
    url: process.env.api + '/api/codec'
  }

  request(options, function (error, response, body) {
    if (error) {
      throw error
    }

    var codecs = JSON.parse(body)

    for (var codec in codecs) {
      register(codecs[codec], logger)
    }
  })
}

function register (codec, logger) {
  var xml = '<Command>' +
    '<HttpFeedback>' +
    '<Register command="True">' +
    '<FeedbackSlot>' + process.env.register_slot + '</FeedbackSlot>' +
    '<ServerUrl>' + process.env.feedback_url + process.env.calldisconnect_url + '</ServerUrl>' +
    '<Format>JSON</Format>' +
    '<Expression item="1">/Event/CallDisconnect</Expression>' +
    '</Register>' +
    '</HttpFeedback>' +
    '</Command>'

  var options = {
    method: 'POST',
    url: 'http://' + codec.ipAddress + '/putxml',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(codec.username + ':' + codec.password).toString('base64'),
      'Content-Type': 'text/xml'
    },
    body: xml
  }

  request(options, function (error, response, body) {
    if (error) {
      logger.error(error)
      updateCodec(codec, true, error.message)
      return
    }

    parseString(body, function (err, result) {
      if (err) {
        logger.error(err)
        updateCodec(codec, true, err.message)
        return
      }

      if (result) {
        if (result.Command.HttpFeedbackRegisterResult[0].$.status === 'OK') {
          logger.info('Enregistrement réussi du codec ' + codec.systemName +
            ' sur l\'URL suivante : ' + process.env.feedback_url + process.env.calldisconnect_url)
          updateCodec(codec, false, null)
        } else {
          logger.warn('L\'enregistrement du codec ' + codec.systemName +
            ' a échoué ! Veuillez réessayer après avoir vérifié les erreurs !')
          updateCodec(codec, true, 'Une erreur est survenue')
        }
      }
    })
  })
}

function updateCodec (codec, errorState, message) {
  codec.error = errorState
  codec.messageError = message

  var options = {
    method: 'PUT',
    url: process.env.api + '/api/codec',
    body: codec,
    json: true
  }

  request(options, function (error, response, body) {
    if (error) {
      throw error
    }
  })
}
