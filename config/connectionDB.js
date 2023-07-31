const mongoose = require("mongoose");
const URI = process.env.URI;

const connectionDB = () =>
  mongoose
    .connect(URI)
    .then((conn) =>
      console.log(`Connected By Data Base ${conn.connection.host}`)
    )
    .catch((err) => console.error(`You have an error: ${err}`));

module.exports = connectionDB;
