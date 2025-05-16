const http = require("node:http");
const Router = require("./classes/Router.js");
const app = new Router();

app.get("/test", (req, res) => {
    res.send("Hello world");
})
http.createServer(app.handler).listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});