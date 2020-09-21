require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("_helpers/jwt");
const morgan = require("morgan");

const errorHandler = require("_helpers/error-handler");
const contactRoutes = require("./routes/contactRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use("/users", require("./routes/userRoutes"));
app.use("/users/contacts", contactRoutes);

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
const server = app.listen(port, function () {
  console.log("Server listening on port " + port);
});
