const express = require("express");
const app = express();
const schoolRoutes = require("./routes/schools");

require("dotenv").config();
app.use(express.json());

app.use("/", schoolRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at PORT: ${port}`);
});
