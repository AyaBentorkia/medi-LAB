require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());

// Test de la base de données
db.sequelize.authenticate()
    .then(() => console.log("Database connected."))
    .catch(err => console.error("Database connection error:", err));

// Routes
app.use("/auth", require("./routes/userRoutes"));
app.use("/Admin", require("./routes/adminRoutes"));
app.use("/Secretary",require("./routes/secretatryRoutes"));
app.use("/LabTechnician",require("./routes/TechLaboRoutes"));


db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
});