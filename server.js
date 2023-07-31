const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV;
const connectionDB = require("./config/connectionDB");
const morgan = require("morgan");
const routerCategorie = require("./routers/routerCategorie");
const routersubCategorie = require("./routers/routerSubCategory");
const apiError = require("./utils/apiError");
const globlError = require("./middleware/globlError");

app.use(express.json());

connectionDB();
// Medel Ware Development
NODE_ENV === "development" && app.use(morgan("dev"));

// @desc Handeling My Ruotes in category
app.use("/api/v1/category", routerCategorie);

// @desc Handeling My Ruotes in sub category
app.use("/api/v1/subcategory", routersubCategorie);

// @desc Handeling any not ruotes for errors
app.all("*", (req, res, next) => {
  next(new apiError("This is Ruote not Found", 400));
});

// @desc paseing error messages
app.use(globlError);

app.listen(PORT, console.log(`server listen on http://localhost:${PORT}`));
