var mongoose = require('mongoose')
var Schema = mongoose.Schema

var commentSchema = new Schema({
    author:String,
    content:String,
    avatar:String,
    datetime:Number,
    article_id:String,
})

module.exports = mongoose.model('comment', commentSchema)