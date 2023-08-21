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
const reouterCoupons = require("./reouterCoupons");
const routerCart = require("./routerCart");
const routerOrder = require("./routerOrder");
const routerTexes = require("./routerTexes");

function mountRoutes(app) {
  app.use("/api/v1/category", routerCategorie);
  app.use("/api/v1/subcategory", routersubCategorie);
  app.use("/api/v1/brands", routerBrand);
  app.use("/api/v1/products", routerProduct);
  app.use("/api/v1/users", routerUser);
  app.use("/api/v1/auth", routerAuth);
  app.use("/api/v1/reviews", routerReview);
  app.use("/api/v1/wishlist", routerWishlist);
  app.use("/api/v1/addresses", routerAddresses);
  app.use("/api/v1/coupons", reouterCoupons);
  app.use("/api/v1/cart", routerCart);
  app.use("/api/v1/order", routerOrder);
  app.use("/api/v1/texes", routerTexes);
}
module.exports = mountRoutes;
