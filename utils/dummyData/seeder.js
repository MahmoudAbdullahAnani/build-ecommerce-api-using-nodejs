const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const connectionDB = require("../../config/connectionDB");
const productsModel = require("../../modules/productsModule");

dotenv.config({ path: "../../config.env" });

// connect to DB
connectionDB();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json"));

// Insert data into DB
const insertData = async () => {
  try {
    await productsModel.create(products);

    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await productsModel.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
