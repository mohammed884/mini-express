const http = require("node:http");
const Router = require("./classes/Router.js");
const app = new Router();

app.get("/test", (req, res) => {
    res.status(201).send("Hello");
})
http.createServer(app.handler).listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});