import { decorate_response } from "../utilities/response.js";
import { add_to_routes, find_route, parse_query } from "../utilities/routes.js";
import http from "node:http";
import {
    run_middlewares,
} from "../utilities/utilities.js";
import { parse_body } from "../utilities/request.js"
class Router {
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
    async handler(req, res) {
        try {
            decorate_response(res);
            const { method } = req;
            const url = new URL(`http://${req.url}`);
            const route_data = find_route(this.routes, `/${url.host}${url.pathname}`, method);
            if (!route_data) {
                res.status(404).send("No route was found");
                throw new Error("No route was found for the provided path");
            };
            req.params = route_data.params;
            req.query = parse_query(url.searchParams);
            req.body = await parse_body(req);
            run_middlewares(this.middlewares, req, res, await route_data.route.handler)
        } catch (error) {
            console.log(error);
        }
    };
    listen(port, cb) {
        http.createServer(this.handler).listen(port, cb);
    }
};
export default Router;