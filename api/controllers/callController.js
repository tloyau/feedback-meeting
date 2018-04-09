var mongoose = require('mongoose')
var Call = mongoose.model('Calls')

exports.createACall = (req, res, io) => {
  var newCall = new Call({
    callHistory: req.body.Entry[0],
    codec: req.body.codec,
    rate: req.body.rate,
    feedbacks: req.body.feedbacks
  })

  newCall.save((err, call) => {
    if (err) {
      res.send(err)
    }
    res.json(call)

    io.sockets.emit('newCall', call)
  })
}

exports.getCalls = (req, res) => {
  Call.find({}, function (err, calls) {
    if (err) {
      res.send(err)
    }
    res.json(calls)
  })
}

exports.updateCall = (req, res, io) => {
  Call.findById(req.body.callId, function (err, call) {
    if (err) {
      res.send(err)
    }

    if (req.body.rate) {
      call.rate = req.body.rate
    }

    if (req.body.feedbacks) {
      call.feedbacks = req.body.feedbacks
    }

    call.save(function (err, updatedCall) {
      if (err) {
        res.send(err)
      }
      res.send(updatedCall)

      io.sockets.emit('updateCall', call)
    })
  })
}
