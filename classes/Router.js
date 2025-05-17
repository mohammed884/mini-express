const { add_to_routes, parse_query, decorate_response, run_middlewares } = require("../utilities/utilities");

class Router {
    // #routes
    // #middlewares
    constructor() {
        this.routes = [];
        this.middlewares = [];
        this.handler = this.handler.bind(this);
    };

    use(middlware) {
        this.middlewares.push(middlware);
    };
    get(path, handler) {
        add_to_routes(this.routes, "GET", path, handler);
    };
    post(path, handler) {
        add_to_routes(this.routes, "POST", path, handler);
    }
    put(path, handler) {
        add_to_routes(this.routes, "PUT", path, handler);
    }
    patch(path, handler) {
        add_to_routes(this.routes, "PATCH", path, handler);
    };
    handler(req, res) {
        decorate_response(res);
        const { method } = req;
        const url = new URL(`http://${req.url}`);
        req.query = parse_query(url.searchParams);
        const route = this.routes.find(route => route.path === `${url.pathname}${url.host}` && method === method)
        if (!route) {
            res.status(404).send("No route was found");
            throw new Error("No route was found for the provided path");
        }
        run_middlewares(this.middlewares, req, res, route.handler)
        // route.handler(req, res);
    }
};
module.exports = Router;