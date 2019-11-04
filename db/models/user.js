var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
    username:String,
    email:String,
    password:String,
    registerOrder:Number,
    registerTime:String,
    followers:[],
    following:[],
    articleCount:0,
    followed:Boolean
})

module.exports = mongoose.model('user', userSchema)