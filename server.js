const path = require("path");
const hpp = require("hpp");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV;
const connectionDB = require("./config/connectionDB");
// Errors
const apiError = require("./utils/apiError");
const globlError = require("./middleware/globlError");
// Routers
const mountRouter = require("./routers/index");



// Hacker Send Query In Inputs "Input-Query"
// To remove data using these defaults:
const mongoSanitize = require("express-mongo-sanitize")
app.use(mongoSanitize());

// HTTP parametr pollution
app.use(hpp())

// Hakers Attac
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 5 minutes
  max: 10000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Connection DataBase
connectionDB();

// Deploymant Access & compression data
const cors = require("cors");
app.use(cors());
// compress all responses
const compression = require("compression");
app.use(compression());

// Medel Ware Development
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// access static files
app.use(express.static(path.join(__dirname, "tmp")));

// Add End Point in checkout.session.completed
const { checkoutCompletedService } = require("./services/orderService");



// EndPoint Checkout session completed
app.post(
  `/checkout-completed`,
  express.raw({ type: "application/json" }),
  checkoutCompletedService
);

// Body Parser
app.use(express.json({ limit: "1000kb" }));

// Mount Routers
mountRouter(app);


// @desc Handeling any not ruotes for errors
app.all("*", (req, res, next) => {
  next(new apiError("This is Ruote not Found", 400));
});

// @desc paseing error messages
app.use(globlError);

app.listen(PORT, console.log(`server listen on http://localhost:${PORT}`));
