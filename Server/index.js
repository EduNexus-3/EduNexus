const express = require("express");

const app = express();
const port = 8000;
app.get("/", (req, res) => {
  res.send({ msg: "sucess" });
});

app.listen(port, () => console.log(`Server started at port ${port}`));
