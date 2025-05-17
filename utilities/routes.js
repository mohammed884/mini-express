
export function extract_params_values(path_with_values, params) {
    const extracted_params = new Map();
    const splited_path_with_values = path_with_values.split("/");
    for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const param_value = splited_path_with_values[param.index];
        extracted_params.set(param.name, { ...param, value: param_value })
    };
    return extracted_params;
}
export function append_params(path_with_placeholders, params) {
    const splited_path_with_placeholders = path_with_placeholders.split("/");
    params.forEach((param) => {
        if (param.index < splited_path_with_placeholders.length) {
            splited_path_with_placeholders[param.index] = param.value;
        }
    });
    return splited_path_with_placeholders.join("/");
};
export function find_route(routes, path, method) {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        if (route.method !== method) continue;
        const params = extract_params_values(path, route.params)
        const routePath = route.hasParams ? append_params(route.path, params) : path;
        if (routePath === path) {
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
    if (!path) throw new Error("Route requires a path");
    if (!handler) throw new Error("Route requires a handler");
    let params = [];
    const splited_path = path.split("/");
    for (let i = 0; i < splited_path.length; i++) {
        const current = splited_path[i];
        if (!current) continue;
        if (current[0] === ":") {
            params.push({
                name: current.slice(1),
                index: i,
            })
        }
    };
    routes.push({
        method: method || "GET",
        path,
        handler,
        params,
        hasParams: !!params.length
    });
};