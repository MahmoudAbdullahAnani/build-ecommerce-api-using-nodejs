const path = require("path");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV;
const connectionDB = require("./config/connectionDB");
x// Errors
const apiError = require("./utils/apiError");
const globlError = require("./middleware/globlError");
// Routers
const mountRouter = require("./routers/index");

app.use(express.json());

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
app.use(express.static(path.join(__dirname, "uploads")));

// Mount Router
mountRouter(app);

// @desc Handeling any not ruotes for errors
app.all("*", (req, res, next) => {
  next(new apiError("This is Ruote not Found", 400));
});

// @desc paseing error messages
app.use(globlError);

app.listen(PORT, console.log(`server listen on http://localhost:${PORT}`));
