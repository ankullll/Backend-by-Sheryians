const express = require("express");
const app = express();

const connectToDB = require("./src/db/db");

connectToDB();
app.use(express.json());

app.get("/notes", (req, res) => {
  res.send("Hello World");
});

app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  console.log(title, content);
});
 app.listen(3000, () => {
      console.log("Server running on port 3000");
    });


