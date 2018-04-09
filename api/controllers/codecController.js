var mongoose = require('mongoose')
var Codec = mongoose.model('Codecs')
var jsxapi = require('jsxapi')

exports.getOneCodec = (req, res) => {
  Codec.findOne({'macAddress': req.params.mac}, function (err, codec) {
    if (err) {
      res.send(err)
    }
    res.json(codec)
  })
}

exports.getCodecs = (req, res) => {
  Codec.find({}, function (err, codecs) {
    if (err) {
      res.send(err)
    }
    res.json(codecs)
  })
}

exports.getDiagnostics = (req, res) => {
  Codec.findOne({'macAddress': req.params.mac}, function (err, codec) {
    if (err) {
      res.send(err)
    }

    const xapi = jsxapi.connect('ssh://' + codec.ipAddress, {
      username: codec.username,
      password: codec.password
    })

    xapi.command('Diagnostics Run', {
      ResultSet: 'All'
    }).then((diagnostics) => {
      res.json(diagnostics)
    }).catch(function (error) {
      console.error(error)
    })
  })
}
