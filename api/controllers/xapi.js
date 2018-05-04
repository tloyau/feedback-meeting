var jsxapi = require('jsxapi')
var request = require('request')

exports.startFeedbackProcess = (req, res) => {
  var options = {
    method: 'GET',
    url: process.env.api + '/api/codec/' + req.body.Event.Identification.MACAddress.Value
  }

  request(options, function (error, response, body) {
    if (error) {
      throw error
    }

    var codec = JSON.parse(body)

    launchProcess(codec, req.body.Event)
  })

  res.sendStatus(200)
}

function launchProcess (codec, event) {
  const xapi = jsxapi.connect('ssh://' + codec.ipAddress, {
    username: codec.username,
    password: codec.password
  })

  if (event.CallDisconnect.Duration.Value > 0) {
    getCallHistoryId(xapi, function (callHistoryId) {
      getCallHistoryData(xapi, callHistoryId, function (callHistoryData) {
        callHistoryData.codec = codec

        createCall(callHistoryData, function (callId) {
          registerEvents(xapi, callId)
        })
      })
    })
  }
}

function getCallHistoryId (xapi, callback) {
  xapi.command('CallHistory Recents', {
    Limit: 1
  }).then((callHistory) => {
    callback(callHistory.Entry[0].LastOccurrenceHistoryId)
  }).catch(function (error) {
    console.error(error)
  })
}

function getCallHistoryData (xapi, callHistoryId, callback) {
  xapi.command('CallHistory Get', {
    CallHistoryId: callHistoryId,
    DetailLevel: 'Full'
  }).then((callHistoryData) => {
    callback(callHistoryData)
  }).catch(function (error) {
    console.error(error)
  })
}

function createCall (bodyCall, callback) {
  var options = {
    method: 'POST',
    url: process.env.api + '/api/call',
    body: bodyCall,
    json: true
  }

  request(options, function (error, response, body) {
    if (error) {
      throw error
    }

    callback(body._id)
  })
}

function updateCall (bodyCall, callback) {
  var options = {
    method: 'PUT',
    url: process.env.api + '/api/call/' + bodyCall.callId,
    body: bodyCall,
    json: true
  }

  request(options, function (error, response, body) {
    if (error) {
      throw error
    }

    callback()
  })
}

function registerEvents (xapi, id) {
  xapi.command('UserInterface Message Prompt Display', {
    Title: 'Comment s\'est passée la réunion ?',
    Text: 'Veuillez évaluer cet appel sur une échelle de 1 à 5',
    FeedbackId: 'callrating-' + id,
    'Option.1': '1',
    'Option.2': '2',
    'Option.3': '3',
    'Option.4': '4',
    'Option.5': '5',
    Duration: 30
  }).catch(function (error) {
    console.error(error)
  })

  xapi.event.on('Standby', function (event) {
    xapi.command('UserInterface Message Prompt Clear', {
      FeedbackId: 'callrating-' + id
    }).catch(function (error) {
      console.error(error)
    })
  })

  xapi.event.on('UserInterface Message Prompt Response', function (event) {
    if (event.FeedbackId === 'callrating-' + id) {
      updateCall({
        rate: event.OptionId,
        callId: id
      }, function () {
        xapi.command('UserInterface Message TextInput Display', {
          Duration: 0,
          FeedbackId: 'feedbacks-' + id,
          InputType: 'SingleLine',
          KeyboardState: 'Open',
          Placeholder: 'Ecrivez vos commentaires ici',
          SubmitText: 'Envoyer',
          Text: 'Vos commentaires sont très importants pour nous',
          Title: 'Feedback'
        }).catch(function (error) {
          console.error(error)
        })
      })
    }
  })

  xapi.event.on('UserInterface Message TextInput Response', function (event) {
    if (event.FeedbackId === 'feedbacks-' + id) {
      updateCall({
        feedbacks: event.Text,
        callId: id
      }, function () {
        xapi.command('UserInterface Message Alert Display', {
          Duration: 3,
          Text: 'Merci beaucoup pour ce feedback !',
          Title: 'Merci'
        }).catch(function (error) {
          console.error(error)
        })
      })
    }
  })
}
