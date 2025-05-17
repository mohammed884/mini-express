import http from "node:http"
import Router from "./classes/Router.js";
const app = new Router();
const isLoggedIn = false;
const loggedIn = (req, res, next) => {
    if (!isLoggedIn) return res.send("MF you need to be logged in")
    next();
}
app.use(loggedIn);
app.get("/test", (req, res) => {
    res.status(201).send("Hello");
})
http.createServer(app.handler).listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});