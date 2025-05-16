class Router {
    // #routes
    // #middlewares
    constructor() {
        this.routes = [];
        this.middlewares = [];
        this.handler = this.handler.bind(this);
    };
    #add_to_routes(method, path, handler) {
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
        this.routes.push({ method: method || "get", path, handler });
    };
    #parse_query(search_params) {
        const query = {};
        const pairs = search_params.entries();
        for (const [key, value] of pairs) {
            query[key] = value || true;
        }
        return query;
    }
    use(middlware) {
        this.middlewares.push(middlware);
    };
    get(path, handler) {
        this.#add_to_routes("GET", path, handler);
    };
    post(path, handler) {
        this.#add_to_routes("POST", path, handler);
    }
    put(path, handler) {
        this.#add_to_routes("PUT", path, handler);
    }
    patch(path, handler) {
        this.#add_to_routes("PATCH", path, handler);
    };
    handler(req, res) {
        const { method } = req;
        const isHttps = req.connection.encrypted;
        const url = new URL(`${isHttps ? 'https' : 'http'}://${req.url}`);
        req.query = this.#parse_query(url.searchParams);
        res.send = function () {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Hello World");
        };
        console.log(req.query)
        const route = this.routes.find(route => route.path === `${url.pathname}${url.host}` && method === method)
        console.log(route);
        route.handler(req, res);
    }
};
module.exports = Router;