import Router from "./classes/Router.js";
const app = new Router();
const isLoggedIn = false;
const loggedIn = (req, res, next) => {
    if (!isLoggedIn) return res.send("MF you need to be logged in")
    next();
}
// app.use(loggedIn);
app.post("/test", async (req, res) => {

    res.status(201).send(req.body);
})
app.listen(3000, (error) => {
    if (error) {
        throw error;
    } else {
        console.log("Server is running on port 3000");

    }
})