function registerErr(field, value, msg){
    this.field = field
    this.value = value
    this.msg = msg
}

class Tools {
    constructor(db){
        this.db = db
        this.msgStr = {
            done:'done',
            usernameIsExist: 'username is exist',
            emailIsExist: 'email is exist',
        }
    }

    checkRegistInfo(model, json, existMsg) {
        console.log('checkRegistInfo',json, existMsg)
        return new Promise((resolve, reject)=>{
            this.db.findOne(model, json).then(res=>{
                console.log('checkRegistInfo res = ', res)
                if (!res){
                    resolve(res)
                }else{
                    console.log('existMsg', existMsg)
                    reject(existMsg)
                }
            })
        })
    }

    checkUsername(username){
        return this.checkRegistInfo(this.db.ModelNameCfg.USER, {'username': username}, new registerErr('username', username, this.msgStr.usernameIsExist))
    }

    checkEmail(email){
        return this.checkRegistInfo(this.db.ModelNameCfg.USER, {'email': email}, new registerErr('email', email, this.msgStr.emailIsExist))
    }
}

module.exports = Tools