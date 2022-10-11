import express, { application } from "express";
import path from "path";
let app = express();

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./index.html"));
});

app.use(express.static(path.resolve("css")));
app.use(express.static(path.resolve("js")));
app.use(express.static(path.resolve("img")));
app.use(express.static(path.resolve("fonts")));
app.use(express.static(path.resolve("photo")));

let port = 5501;
app.listen(port, () => {
  console.log("listening on port " + port);
});
