var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CallSchema = new Schema({
  callHistory: {
    type: Object
  },
  codec: {
    type: Object
  },
  rate: {
    type: Number
  },
  feedbacks: {
    type: String
  }
})

module.exports = mongoose.model('Calls', CallSchema)
