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
