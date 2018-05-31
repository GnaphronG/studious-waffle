async function hello(ctx) {
    return ctx.body = {'hello': 'world!'}
}

module.exports = hello;
