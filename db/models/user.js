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
    articleCount:{
      type:Number,
      default:0
    },
    followed:Boolean,
    avatar:String
})

module.exports = mongoose.model('user', userSchema)