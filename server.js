'use strict'

var express = require('express')
var path = require('path')

var app = express()

app.use(express.static(__dirname + "/"))

var port = 6969

app.listen(port, function () {
    console.log('serving at', port)
})
