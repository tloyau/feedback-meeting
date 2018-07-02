var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CodecSchema = new Schema({
  systemName: {
    type: String
  },
  macAddress: {
    type: String
  },
  ipAddress: {
    type: String
  },
  productType: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  firmware: {
    type: String
  },
  uri: {
    type: String
  },
  error: {
    type: Boolean
  },
  messageError: {
    type: String
  }
})

module.exports = mongoose.model('Codecs', CodecSchema)
