function pragma () {
    return async (ctx, next) => {
        if (ctx.headers['pragma']){
            ctx.headers['pragma'].split(',').forEach(pragma => {
                switch (pragma.trim().toLowerCase()){
                    case 'x-request-id':
                        ctx.response.set('X-Request-Id', ctx.reqId);
                        break;
                }
            });
        }
        return await next();
    };
};

module.exports = pragma;
