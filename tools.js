class Tools {
    constructor(db){
        this.db = db
        this.msgStr = {
            done:'done',
            usernameIsExist: 'usernameIsExist',
            emailIsExist:'emailIsExist',
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
        return this.checkRegistInfo(this.db.ModelNameCfg.USER, {'username': username}, this.msgStr.usernameIsExist)
    }

    checkEmail(email){
        return this.checkRegistInfo(this.db.ModelNameCfg.USER, {'email': email}, this.msgStr.emailIsExist)
    }
}

module.exports = Tools