export async function run_middlewares(middlewares, req, res, finalHandler) {
    let index = 0;
    async function next() {
        if (index < middlewares.length) {
            const middleware_to_execute = middlewares[index];
            index++;
            await middleware_to_execute(req, res, next);
        } else {
            await finalHandler(req, res);
        }
    }
    await next();
}