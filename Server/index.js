const express = require("express");

const app = express();
const helmet = require("helmet");
const userRoutes = require("./routes/user");
const port = 8000;

app.use(helmet());
app.get("/", (req, res) => {
  res.send({ msg: "sucess" });
});
app.use("/user", userRoutes);
// app.use("/instructor");
// app.use("/admin");
app.listen(port, () => console.log(`Server started at port ${port}`));
