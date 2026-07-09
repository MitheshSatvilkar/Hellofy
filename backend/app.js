const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const templateRoutes = require("./routes/templateRoute");

const app = express();
const {initializeSocket} = require("./socket");

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended:true, limit:'10kb' }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/templates", templateRoutes);

module.exports = app;