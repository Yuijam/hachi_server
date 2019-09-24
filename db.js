const MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb');
var Config = require('./config.js');

class DB{

    static getInstance(){
        if (!DB.instance){
            DB.instance = new DB();
        }
        return DB.instance;
    }

    constructor(){
        this.dbClient='';
        this.connect();
    }

    connect(){
        return new Promise((resolve, reject) => {
            if (this.dbClient){
                resolve(this.dbClient);
                return;
            }

            MongoClient.connect(`${Config.dbUrl}${Config.dbName}`, { useNewUrlParser: true }, (err, client) => {
                if (!err){
                    let db = client.db(Config.dbName);
                    this.dbClient = db;
                    resolve(this.dbClient);
                }else{
                    reject(err);
                }
            })
        })
    }

    findById(collectionName, id){
        if (!ObjectId.isValid(id)) {
            return Promise.reject(new TypeError(`Invalid id: ${id}`));
        }
        return this.find(collectionName, {_id:ObjectId(id)});
    }

    find(collectionName, json){
        return new Promise((resolve, reject) => {
            this.connect().then(db=>{
                let res = db.collection(collectionName).find(json)
                res.toArray((err, docs)=>{
                    if (err){
                        reject(err)
                        return;
                    }else{
                        resolve(docs)
                    }
                })
            })
        })
    }

    updateById(collectionName, id, json){
        return this.update(collectionName, {_id:ObjectId(id)}, json)
    }

    update(collectionName, json1, json2){
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(json1, {$set:json2}, (err, result) => {
                    if (err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        })
    }

    insert(collectionName, json){
        return new Promise((resolve, reject) => {
            this.connect().then(db=>{
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                });
            });
        });
    }

    removeById(collectionName, id){
        if (!ObjectId.isValid(id)) {
            return Promise.reject(new TypeError(`Invalid id: ${id}`));
        }
        return this.remove(collectionName, {_id:ObjectId(id)});
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

module.exports = DB.getInstance();
