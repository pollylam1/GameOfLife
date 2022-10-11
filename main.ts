import express, { application } from "express";
import path from "path";
let app = express();

app.use(express.static("css"));
app.use(express.static("js"));
app.use(express.static("img"));
app.use(express.static("fonts"));
app.use(express.static("photo"));
app.use(express.static(".vscode"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./index.html"));
});

let port = 5501;
app.listen(port, () => {
  console.log("listening on port " + port);
});
