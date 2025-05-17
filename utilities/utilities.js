export function parse_query(search_params) {
    const query = {};
    const pairs = search_params.entries();
    for (const [key, value] of pairs) {
        query[key] = value || true;
    }
    return query;
};
export function add_to_routes(routes, method, path, handler) {
    if (!path) throw new Error("Route requires a path");
    if (!handler) throw new Error("Route requires a handler");
    let params = [];
    const splitedPath = path.split("/");
    for (let i = 0; i < splitedPath.length; i++) {
        const current = splitedPath[i];
        if (!current) continue;
        if (current[0] === ":") {
            params.push({
                name: current,
                index: i,
            })
        }
    };
    routes.push({ method: method || "get", path, handler, params, hasParams: !!params.length });
};
export function find_route(routes, path, method) {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.method !== method) continue;
        const routePath = route.hasParams ? append_params(route.path, path, route.params) : path;
        if (routePath === path) {
            return route;
        }
    };
    return null;
}
export function append_params(path_to_append, path_with_params, params) {
    const splited_path_to_append = path_to_append.split("/");
    const splited_path_with_params = path_with_params.split("/");
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        if (
            param.index > splited_path_to_append.length) break;
        splited_path_to_append[param.index] = splited_path_with_params[param.index]
    }
    return splited_path_to_append.join("/");
}
export function run_middlewares(middlewares, req, res, finalHandler) {
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
export function parse_body() {

};
export function decorate_response(res) {
    res.status = function (code) {
        this.statusCode = code;
        return this;
    };
    res.send = function send(body) {
        if (!body) throw new Error("[res.send] requires a body to send!");
        switch (typeof body) {
            case "string":
                this.setHeader('Content-Type', 'text/plain');
                break;
            case "object":
                this.setHeader('Content-Type', 'application/json');
                break;
            default:
                this.setHeader('Content-Type', 'text/plain');
        };
        const response = typeof body === 'string' ? body : JSON.stringify(body);
        this.end(response);
    };
    res.json = function (body) {
        if (!body) throw new Error("[res.json] requires a body to send!");
        this.setHeader("Content-Type", "application/json");
        this.end(JSON.stringify(body));
    }
};