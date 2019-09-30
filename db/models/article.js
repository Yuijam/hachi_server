var mongoose = require('mongoose')
var Schema = mongoose.Schema

var articleSchema = new Schema({
    title:String,
    text_origin:String,
    writeTime:Number,
    lastEditTime:Number,
    owner:String
})

module.exports = mongoose.model('article', articleSchema)