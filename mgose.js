require('./mgose_conn')
const User = require('./models/user')
const Article = require('./models/article')

class DB{

    static getInstance(){
        if (!DB.instance){
            DB.instance = new DB();
        }
        return DB.instance;
    }

    constructor(){

        this.ModelNameCfg = {
            USER:User,
            ARTICLE:Article,
        }
    }

    findById(model, id){
        return new Promise((resolve, reject) => {
            model.findById(id, (err, res) => {
                if (!err){
                    resolve(res)
                }else{
                    reject(err)
                }
            })
        })
    }
    
    find(model, json){
        return new Promise((resolve, reject) => {
            model.find(json, (err, res) => {
                if (!err){
                    resolve(res)
                }else{
                    reject(err)
                }
            })
        })
    }

    findOne(model, json){
        return new Promise((resolve, reject)=>{
            model.findOne(json, (err, res) => {
                if (!err){
                    resolve(res)
                }else{
                    reject(err)
                }
            })
        })
    }
    
    updateById(model, id, json){
        return new Promise((resolve, reject)=>{
            model.updateOne({_id:id}, json, (err, res)=>{
                if (!err){
                    resolve(res)
                }else{
                    reject(err)
                }
            });
        })
    }

    update(model, json1, json2){
        return new Promise((resolve, reject) => {
            model.updateOne(json1, json2, (err, res) => {
                if (!err){
                    resolve(res)
                }else{
                    reject(err)
                }
            })
        })
    }
    
    insert(model, json){
        return new Promise((resolve, reject)=>{
            model.create(json, (err, res) => {
                if (!err){
                    resolve(res)
                }else{
                    reject(err)
                }
            })
        })
    }

    count(model, json){
        return new Promise((resolve, reject) => {
            model.countDocuments(json, (err, c)=>{
                if (!err){
                    resolve(c)
                }else{
                    reject(err)
                }
            })
        })
    }
    
    removeById(model, id){
        if (model){
            return model.deleteOne({_id:id});
        }else{
            console.log('model name is not exist')
            return []
        }
    }
    
    remove(collectionName, json){
        return new Promise((resolve, reject) => {
            this.connect().then(db=>{
                db.collection(collectionName).removeOne(json, (err, result) => {
                    if (err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                });
            });
        });
    }
}

// DB.this.ModelNameCfg = {
//     USER:User,
//     ARTICLE:Article,
// }

module.exports = DB.getInstance()
// StuModel.create({
//     name:'孙悟空',
//     age:18,
//     gender:'male',
//     address:'suginami'
// }, (err)=>{
//     if (!err){
//         console.log('insert successed!')
//     }
// })

// StuModel.update({name:'孙悟空'}, {age:88}, (err, res)=>{
//     if (!err){
//         console.log('res = ', res)
//     }
// })

// StuModel.countDocuments({}, (err, count)=>{
//     if (!err){
//         console.log('count = ', count)
//     }
// })

// var stu = new StuModel({
//     name:'zhubajie',
//     age:22,
//     gender:'male',
//     address:'tokyo'
// })

// stu.save((err)=>{
//     if (!err){
//         console.log('saved')
//     }
// })

// StuModel.findOne({}, (err, doc)=>{
//     if (!err){
//         console.log('doc = ', doc)
//         doc.updateOne({age:8888}, (err, doc_cb)=>{
//             if (!err){
//                 console.log('doc_cb = ', doc_cb)
//             }
//         })
//     }
// })

// StuModel.findOne({}, (err, doc)=>{
//     if (!err){
//         console.log('doc = ', doc)
//         doc.age = 7777
//         doc.save()
//     }
// })

// StuModel.findOne({}, (err, doc)=>{
//     if (!err){
//         console.log('doc = ', doc)
//         console.log(`doc.get('name')`, doc.get('name'))
//         doc.set('name', 'tracy')
//     }
// })