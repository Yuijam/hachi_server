const db = require('../db/db');

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
        let {title, text_origin, owner, writeTime} = ctx.request.body
        let data = await db.insert(db.ModelNameCfg.ARTICLE, {title, text_origin, owner, writeTime});
        ctx.body = data
    },

    'DELETE /api/article/:id': async (ctx, next) => {
        let data = await db.removeById(db.ModelNameCfg.ARTICLE, ctx.params.id);
        ctx.body = data
    },

    'POST /api/register': async (ctx)=>{
        let {username, email, password, registerTime} = ctx.request.body;
        // let result = await db.find('users', {username:username})
        let res = await db.insert(db.ModelNameCfg.USER, {username, email, password, registerTime});
        console.log('res = ', res)
        ctx.body = res;
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
    }

}
