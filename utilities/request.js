export function parse_body(req) {
    return new Promise((resolve, reject) => {
        const body = [];
        let parsed_body;
        req.on("data", (chunk) => {
            body.push(chunk);
        });
        req.on("end", () => {
            parsed_body = Buffer.concat(body).toString();
            try {
                resolve(JSON.parse(parsed_body));
            } catch (error) {
                reject(error);
            }
        });
        req.on("error", reject);
    })

}