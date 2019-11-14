const db = require('../db/db');
const Tools = require('../tools')

const tools = new Tools(db)
const articleNumPerPage = 10;

function response(data){
    this.status = 0;
    this.data = data
}

function errorRes(msg, errData){
    this.status = 1;
    this.msg = msg
    this.errorData = errData || null
}

function pageFilter(data, pageIdx, pageSize){
    let start = (pageIdx-1)*pageSize
    let end = start + pageSize
    console.log(start, end)
    return data.slice(start, end)
}

module.exports = {
    'GET /api/session': async (ctx, next) => {
        console.log('session.userinfo = ', ctx.session.userinfo);
        if (ctx.session.userinfo){
            ctx.body = new response(ctx.session.userinfo);
        }else{
            ctx.body = new errorRes('has no session')
        }
    },

    'GET /api/article': async (ctx, next) => {
        console.log('GET /api/article', ctx.query);
        const {id} = ctx.query
        try{
            let article = await db.findById(db.ModelNameCfg.ARTICLE, id);
            console.log('article', article)
            if (article){
                ctx.body = new response(article)
            }else{
                ctx.body = new errorRes('article is not found')
            }
        }catch(err){
            ctx.body = new errorRes(err);
        }  
    },

    'PUT /api/article': async (ctx, next) => {
        // ctx.res.type = 'application/json';
        console.log('PUT /api/article', ctx.request.body)
        let {id, title, text_origin, lastEditTime} = ctx.request.body;
        try{
            let res = await db.updateById(db.ModelNameCfg.ARTICLE, id, {title, text_origin, lastEditTime})
            if (res.ok === 1){
                ctx.body = new response(ctx.request.body);
            }else{
                ctx.body = new errorRes('update failed')
            }
        }catch(err){
            ctx.body = new errorRes(err);
        }
    },

    'GET /api/articles': async (ctx, next) => {
        console.log('GET /api/articles ctx.query', ctx.query)
        const {username, pageIdx, pageSize} = ctx.query
        try{
            let data = await db.find(db.ModelNameCfg.ARTICLE, {owner:username});
            data.reverse()
            ctx.body = new response({articles:pageFilter(data, pageIdx, pageSize*1), total:data.length});
        }catch(err){
            ctx.body = new errorRes(err);
        }
    },
    
    'POST /api/article': async (ctx, next) => {
        console.log('POST /api/article', ctx.request.body)
        let {owner} = ctx.request.body
        try{
            let data = await db.insert(db.ModelNameCfg.ARTICLE, ctx.request.body);
            let articleCount = await db.count(db.ModelNameCfg.ARTICLE, {owner})
            db.update(db.ModelNameCfg.USER, {username:owner}, {articleCount});
            ctx.body = new response(data)
        }catch(err){
            ctx.body = new errorRes(err)
        }
        
    },

    'DELETE /api/article': async (ctx, next) => {
        console.log('DELETE /api/article', ctx.query)
        let {_id} = ctx.query
        try{
            let data = await db.removeById(db.ModelNameCfg.ARTICLE, _id);
            ctx.body = new response(data)
        }catch(err){
            ctx.body = new errorRes(err)
        }
    },

    'POST /api/register': async (ctx)=>{
        let {username, email, password, registerTime} = ctx.request.body;
        try{
            await Promise.all([tools.checkUsername(username), tools.checkEmail(email)])
            let count = await db.count(db.ModelNameCfg.USER, {})
            let res = await db.insert(db.ModelNameCfg.USER, {username, email, password, registerTime, registerOrder:count+1})
            if (res){
                ctx.body = new response(res)
            }else{
                ctx.body = new errorRes('server error')
            }
        }catch(err){
            ctx.body = new errorRes('',err)
        }
    },

    'POST /api/login': async (ctx) => {
        try{
            let {username, password} = ctx.request.body;
            let user = await db.findOne(db.ModelNameCfg.USER, {username:username, password:password});
            if (user){
                console.log('login res = ', user)
                ctx.session.userinfo = user
                ctx.body = new response(user)
            }else{
                ctx.body = new errorRes('username or password is invalid')
            }
        }catch(err){
            ctx.body = new errorRes(err)
        }
        
    },

    'GET /api/logout': async (ctx) => {
        ctx.session = null;
        ctx.body = 'suc'
    },

    'GET /api/checkExist': async(ctx)=>{
        let data = ctx.query;
        // data=JSON.parse(data)
        console.log('GET /api/checkExist data = ', data)
        try{
            let res = await db.findOne(db.ModelNameCfg.USER, data)
            if (res){
                ctx.body = new errorRes('existed')
            }else{
                ctx.body = new response('ok')
            }
        }catch(err){
            ctx.body = new errorRes(err)
        }
    },

    'GET /api/articlesCount': async(ctx) => {
        let totalCount = await db.count(db.ModelNameCfg.ARTICLE, {owner:ctx.query.username});
        ctx.body = totalCount
    },

    'PUT /api/follow': async(ctx) => {
        let {actionUsername, targetUsername} = ctx.request.body;
        console.log('PUT /api/follow ', actionUsername, targetUsername)
        try{
            let actionUser = (await db.findOne(db.ModelNameCfg.USER, {username:actionUsername})).toObject();
            actionUser.following.push(targetUsername)
            console.log('actionUser ', actionUser)
            
            let targetUser = (await db.findOne(db.ModelNameCfg.USER, {username:targetUsername})).toObject();
            targetUser.followers.push(actionUsername)
    
            let res1 = await db.update(db.ModelNameCfg.USER, {username:actionUsername}, {...actionUser});
            let res2 = await db.update(db.ModelNameCfg.USER, {username:targetUsername}, {...targetUser});
            ctx.body = new response({actionUser, targetUser})
        }catch(err){
            ctx.body = new errorRes(err)
        }  
    },

    'PUT /api/unfollow': async(ctx) => {
        let {actionUsername, targetUsername} = ctx.request.body;
        console.log('PUT /api/unfollow ', actionUsername, targetUsername)
        try{
            let actionUser = (await db.findOne(db.ModelNameCfg.USER, {username:actionUsername})).toObject();
            actionUser.following.splice(actionUser.following.indexOf(targetUsername), 1)
            console.log('actionUser ', actionUser)
            
            let targetUser = (await db.findOne(db.ModelNameCfg.USER, {username:targetUsername})).toObject();
            targetUser.followers.splice(targetUser.followers.indexOf(actionUsername), 1)
    
            let res1 = await db.update(db.ModelNameCfg.USER, {username:actionUsername}, {...actionUser});
            let res2 = await db.update(db.ModelNameCfg.USER, {username:targetUsername}, {...targetUser});
            ctx.body = new response({actionUser, targetUser})
        }catch(err){
            ctx.body = new errorRes(err)
        }
        
    },

    'GET /api/user': async(ctx) => {
        let {actionUsername, targetUsername} = ctx.query;
        try {
            let user = await db.findOne(db.ModelNameCfg.USER, {username:targetUsername});
            user = user.toObject();
            delete user.email
            delete user.password
            
            user.followed = false
            for (let follower of user.followers){
                console.log(follower, actionUsername)
                if (follower === actionUsername){
                    user.followed = true
                    break;
                }
            }
            console.log('GET /api/user', user)
            ctx.body = new response(user);
        } catch (err) {
            ctx.body = new errorRes(err)
        }
        
    }
}
