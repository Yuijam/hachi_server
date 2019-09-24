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
        if (model){
            return model.findById(id);
        }else{
            console.log('model name  is not exist')
            return []
        }
    }
    
    find(model, json){
        if (model){
            return model.find(json);
        }else{
            console.log(`model is not exist`)
            return []
        }
    }

    findOne(model, json){
        if (model){
            return model.findOne(json);
        }else{
            console.log(`model is not exist`)
            return []
        }
    }
    
    updateById(model, id, json){
        if (model){
            return model.updateOne({_id:id}, json);
        }else{
            console.log('model name is not exist')
            return []
        }
    }

    update(model, json1, json2){
        if (model){
            return model.updateOne(json1, json2);
        }else{
            console.log('model name is not exist')
            return []
        }
    }
    
    insert(model, json){
        if (model){
            return model.create(json);
        }else{
            console.log('model name is not exist')
            return []
        }
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