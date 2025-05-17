import { decorate_response } from "../utilities/response.js";
import { add_to_routes, extract_params_values, find_route, parse_query } from "../utilities/routes.js";
import {
    run_middlewares,
} from "../utilities/utilities.js";

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
    handler(req, res) {
        decorate_response(res);
        const { method } = req;
        const url = new URL(`http://${req.url}`);
        const rotueData = find_route(this.routes, `/${url.host}${url.pathname}`, method);

        if (!rotueData) {
            res.status(404).send("No route was found");
            throw new Error("No route was found for the provided path");
        };
        req.params = rotueData.params;
        req.query = parse_query(url.searchParams);
        console.log(req.params);

        run_middlewares(this.middlewares, req, res, rotueData.route.handler)
    }
};
export default Router;