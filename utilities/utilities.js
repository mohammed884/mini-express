function parse_query(search_params) {
    const query = {};
    const pairs = search_params.entries();
    for (const [key, value] of pairs) {
        query[key] = value || true;
    }
    return query;
};
function add_to_routes(routes, method, path, handler) {
    if (!path) throw new Error("Route requires a path");
    if (!handler) throw new Error("Route requires a handler");
    let hasParams = false;
    // /user/:id/posts/:id
    /*
    -if it has : then basically get the index where it starts
    -then get the param name
    -if there is no slash, append it and that's it 
    -if there is a slash, check if there is another param
    then check if there is a slash at the end, that 
    */
    routes.push({ method: method || "get", path, handler });
};
// function run_middlewares(middlewares, req, res, finalHandler, index = 0) {
//     if (index >= middlewares.length) return finalHandler(req, res);
//     const middleware_to_execute = middlewares[index];
//     middleware_to_execute(req, res, () => run_middlewares(middlewares, req, res, finalHandler, index + 1));
// }
function run_middlewares(middlewares, req, res, finalHandler) {
    let index = 0;
    function next() {
        if (index < middlewares.length) {
            const middleware_to_execute = middlewares[index];
            index++;
            middleware_to_execute(req, res, next);
        } else {
            finalHandler(req, res);
        }
    }
    next();
}
function parse_body() {

};
function decorate_response(res) {
    res.status = function (code) {
        this.statusCode = code;
        return this;
    };
    res.send = function send(body) {
        if (!body) throw new Error("[res.send] requires a body to send!");
        switch (typeof body) {
            case "string":
                this.setHeader('Content-Type', 'text/plain');
            case "object":
                this.setHeader('Content-Type', 'application/json');
            default:
                this.setHeader('Content-Type', 'text/plain');
        }
        this.end(typeof body === 'string' ? body : JSON.stringify(body));
    };
    res.json = function (body) {
        if (!body) throw new Error("[res.json] requires a body to send!");
        this.setHeader("Content-Type", "application/json");
        this.end(JSON.stringify(body));
    }
}
module.exports = {
    parse_query,
    add_to_routes,
    run_middlewares,
    decorate_response,
}