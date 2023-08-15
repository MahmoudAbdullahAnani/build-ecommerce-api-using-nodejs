// Routers
const routerCategorie = require("./routerCategorie");
const routersubCategorie = require("./routerSubCategory");
const routerBrand = require("./routerBrand");
const routerProduct = require("./routerProduct");
const routerUser = require("./routerUser");
const routerAuth = require("./routerAuth");
const routerReview = require("./routerReview");
const routerWishlist = require("./routerWishlist");
const routerAddresses = require("./routerAddresses");

function mountRoutes(app){
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

// @desc Handeling My Ruotes in user
app.use("/api/v1/wishlist", routerWishlist);

// @desc Handeling My Ruotes in user
app.use("/api/v1/addresses", routerAddresses);
}
module.exports = mountRoutes