var express = require('express')
var http = require('http')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var bunyan = require('bunyan')
var RotatingFileStream = require('bunyan-rotating-file-stream')
var helmet = require('helmet')
var routes = require('./api/routes/routes')
var path = require('path')

require('dotenv').config()

require('body-parser-xml')(bodyParser)

require('./api/models/callModel')
require('./api/models/codecModel')

var register = require('./api/controllers/register.js')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/FeedbackMeeting')

var app = express()
var port = process.env.port

var server = http.createServer(app)
var io = require('socket.io')(server)

io.on('connection', function (client) {})

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(bodyParser.xml())

app.use(helmet())

app.use(express.static('client/dist'))

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
})

var logger = bunyan.createLogger({
  name: 'log',
  streams: [{
    level: 'info',
    stream: process.stdout
  }, {
    stream: new RotatingFileStream({
      path: './log/feedback.log',
      period: '1d',
      totalFiles: 10,
      rotateExisting: true,
      threshold: '10m',
      totalSize: '20m'
    })
  }]
})

routes(app, io)

server.listen(port, function () {
  logger.info('FeedbackMeeting RESTful API server started on: ' + port)

  register.registerCallDisconnect(logger)

  setInterval(() => {
    register.registerCallDisconnect(logger)
  }, process.env.intervalRegister)
})
