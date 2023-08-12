const path = require('path')

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
const routerBrand = require("./routers/routerBrand");
const routerProduct = require("./routers/routerProduct");
const routerUser = require("./routers/routerUser");
const routerAuth = require("./routers/routerAuth");
const routerReview = require("./routers/routerReview");

app.use(express.json());

connectionDB();
// Medel Ware Development
NODE_ENV === "development" && app.use(morgan("dev"));
// access static files
app.use(express.static(path.join(__dirname,"uploads")))

// @desc Handeling My Ruotes in category
app.use("/api/v1/category", routerCategorie);

// @desc Handeling My Ruotes in sub category
app.use("/api/v1/subcategory", routersubCategorie);

// @desc Handeling My Ruotes in Brands
app.use("/api/v1/brands", routerBrand);

// @desc Handeling My Ruotes in Product
app.use("/api/v1/products", routerProduct);

// @desc Handeling My Ruotes in user
app.use("/api/v1/users", routerUser);

// @desc Handeling My Ruotes in user
app.use("/api/v1/auth", routerAuth);

// @desc Handeling My Ruotes in user
app.use("/api/v1/reviews", routerReview);

// @desc Handeling any not ruotes for errors
app.all("*", (req, res, next) => {
  next(new apiError("This is Ruote not Found", 400));
});

// @desc paseing error messages
app.use(globlError);

app.listen(PORT, console.log(`server listen on http://localhost:${PORT}`));
