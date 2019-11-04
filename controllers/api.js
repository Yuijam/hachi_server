const db = require('../db/db');
const Tools = require('../tools')

const tools = new Tools(db)
const articleNumPerPage = 10;

module.exports = {
    'GET /session': async (ctx, next) => {
        console.log('session.userinfo = ', ctx.session.userinfo);
        ctx.body = ctx.session.userinfo;
    },

    'GET /api/article/:id': async (ctx, next) => {
        ctx.res.type = 'application/json';
        console.log('get articles', ctx.params);
        let article = await db.findById(db.ModelNameCfg.ARTICLE, ctx.params.id);
        ctx.body = article[0] ? article[0] : [];
    },

    'PUT /api/article/:id': async (ctx, next) => {
        ctx.res.type = 'application/json';
        let {title, text_origin, lastEditTime} = ctx.request.body;
        let res = await db.updateById(db.ModelNameCfg.ARTICLE, ctx.params.id, {title, text_origin, lastEditTime})
        ctx.body = res;
    },

    'GET /api/article_list': async (ctx, next) => {
        console.log('ctx.query', ctx.query)
        ctx.res.type = 'application/json';
        let data = await db.find(db.ModelNameCfg.ARTICLE, {owner:ctx.query.username});
        ctx.body = {article_list:data};
    },
    
    'POST /api/article': async (ctx, next) => {
        let {owner} = ctx.request.body
        let data = await db.insert(db.ModelNameCfg.ARTICLE, ctx.request.body);
        let articleCount = await db.count(db.ModelNameCfg.ARTICLE, {owner})
        console.log('wwwwwww articleCount' , articleCount)
        db.update(db.ModelNameCfg.USER, {username:owner}, {articleCount});
        ctx.body = data
    },

    'DELETE /api/article/:id': async (ctx, next) => {
        let data = await db.removeById(db.ModelNameCfg.ARTICLE, ctx.params.id);
        ctx.body = data
    },

    'POST /api/register': async (ctx)=>{
        let {username, email, password, registerTime} = ctx.request.body;
        try{
            await Promise.all([tools.checkUsername(username), tools.checkEmail(email)])
            let count = await db.count(db.ModelNameCfg.USER, {})
            let res = await db.insert(db.ModelNameCfg.USER, {username, email, password, registerTime, registerOrder:count+1})
            ctx.body = res
        }catch(err){
            ctx.body = err
        }
        
    },

    'POST /api/login': async (ctx) => {
        let {username, password} = ctx.request.body;
        let res = await db.findOne(db.ModelNameCfg.USER, {username:username, password:password});
        console.log('login res = ', res)
        if (res){
            ctx.session.userinfo = res
        }
        ctx.body = res;
    },

    'GET /api/logout': async (ctx) => {
        ctx.session = null;
        ctx.body = 'suc'
    },

    'GET /api/checkExist': async(ctx)=>{
        let {data} = ctx.query;
        data=JSON.parse(data)
        console.log('GET /api/checkExist data = ', data)
        let res = await db.findOne(db.ModelNameCfg.USER, data)
        ctx.body = res
    },

    'GET /api/page': async(ctx) => {
        console.log('ctx.query = ', ctx.query)
        let queryPage = ctx.query.curPage
        console.log('queryPage = ', queryPage)
        let articles = await db.find(db.ModelNameCfg.ARTICLE, {owner:ctx.query.username});
        let num = articles.length;
        console.log('num = ', num)
        let startIdx = (queryPage-1) * articleNumPerPage
        console.log('startidx = ', startIdx)
        if (startIdx < num){
            ctx.body = articles.slice(startIdx, startIdx+articleNumPerPage)
        }else{
            ctx.body = []
        }
    },

    'GET /api/articlesCount': async(ctx) => {
        let totalCount = await db.count(db.ModelNameCfg.ARTICLE, {owner:ctx.query.username});
        ctx.body = totalCount
    },

    'PUT /api/follow': async(ctx) => {
        let {actionUsername, targetUsername} = ctx.request.body;
        console.log('PUT /api/follow ', actionUsername, targetUsername)
        
        let actionUser = (await db.findOne(db.ModelNameCfg.USER, {username:actionUsername})).toObject();
        actionUser.following.push(targetUsername)
        console.log('actionUser ', actionUser)
        
        let targetUser = (await db.findOne(db.ModelNameCfg.USER, {username:targetUsername})).toObject();
        targetUser.followers.push(actionUsername)

        let res1 = await db.update(db.ModelNameCfg.USER, {username:actionUsername}, {...actionUser});
        let res2 = await db.update(db.ModelNameCfg.USER, {username:targetUsername}, {...targetUser});
        ctx.body = {actionUser, targetUser}
    },

    'PUT /api/unfollow': async(ctx) => {
        let {actionUsername, targetUsername} = ctx.request.body;
        console.log('PUT /api/unfollow ', actionUsername, targetUsername)
        
        let actionUser = (await db.findOne(db.ModelNameCfg.USER, {username:actionUsername})).toObject();
        actionUser.following.splice(actionUser.following.indexOf(targetUsername), 1)
        console.log('actionUser ', actionUser)
        
        let targetUser = (await db.findOne(db.ModelNameCfg.USER, {username:targetUsername})).toObject();
        targetUser.followers.splice(targetUser.followers.indexOf(actionUsername), 1)

        let res1 = await db.update(db.ModelNameCfg.USER, {username:actionUsername}, {...actionUser});
        let res2 = await db.update(db.ModelNameCfg.USER, {username:targetUsername}, {...targetUser});
        ctx.body = {actionUser, targetUser}
    },

    'GET /api/user': async(ctx) => {
        let {actionUsername, targetUsername} = ctx.query;
        console.log('wwwwwwwwww', actionUsername, targetUsername)
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
        ctx.body = user;
    }
}
