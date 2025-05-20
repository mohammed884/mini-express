import { FIELD_REQUIRED } from "../constant/errors/index.js";

export function extract_params_values(path_with_values, params) {
    const extracted_params = new Map();
    const split_path_with_values = path_with_values.split("/");
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const param_value = split_path_with_values[param.index];
        extracted_params.set(param.name, { ...param, value: param_value })
    };
    return extracted_params;
}
export function append_params(path_template, params) {
    const split_path_template = path_template.split("/");
    params.forEach((param) => {
        if (param.index < split_path_template.length) {
            split_path_template[param.index] = param.value;
        };
    });
    return split_path_template.join("/");
};
export function find_route(routes, path, method) {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.method !== method) continue;
        const params = extract_params_values(path, route.params)
        const route_path = route.hasParams ? append_params(route.path, params) : route.path;
        console.log(route_path, path);
        if (route_path === path) {
            return { route, params };
        }
    };
    return null;
}
export function parse_query(search_params) {
    const query = {};
    const pairs = search_params.entries();
    for (const [key, value] of pairs) {
        query[key] = value || true;
    }
    return query;
};
export function add_to_routes(routes, method, path, handler) {
    if (!path) throw new Error(FIELD_REQUIRED.replace("{method}", "Route").replace("{field}", "path"));
    if (!handler) throw new Error("Route requires a handler");
    let params = [];
    const split_path = path.split("/");
    for (let i = 0; i < split_path.length; i++) {
        const current = split_path[i];
        if (!current) continue;
        if (current[0] === ":") {
            params.push({
                name: current.slice(1),
                index: i,
            })
        };
    };
    routes.push({
        method: method || "GET",
        path: !path.endsWith("/") ? path + "/" : path,
        handler,
        params,
        hasParams: !!params.length
    });
};