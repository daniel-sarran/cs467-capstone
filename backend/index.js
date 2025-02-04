import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

import cors from "cors";
import express from "express";
import { PORT } from "./utils/constants.js";
import { db } from "./utils/dbConnect.js";
import HTTPError from "./utils/error.js";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Connect to database.
const sequelize = db.sequelize;
try {
  await sequelize.authenticate();
  console.log("Connected to RDS MySQL database.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1);
}
// Drop database tables if needed and synchronize.
try {
  const drop_and_resync = process.env.NODE_ENV !== "production" ? true : false;
  await sequelize.sync({ force: drop_and_resync });
  console.log("Synced database.");
} catch (error) {
  console.error("Failed to sync database: " + error.message);
  process.exit(1);
}

import users from "./routes/users.js";
import companies from "./routes/companies.js";
import skills from "./routes/skills.js";
import contacts from "./routes/contacts.js";
import jobs from "./routes/jobs.js";
app.use("/users", users);
app.use("/companies", companies);
app.use("/skills", skills);
app.use("/contacts", contacts);
app.use("/jobs", jobs);

app.all("*", (_req, _res, next) => {
  next(new HTTPError("Resource not found.", 404));
});

app.use((err, _req, res, _next) => {
  res.status(err.status).json({ error: err.message, status: err.status });
});
