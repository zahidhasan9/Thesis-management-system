const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const path = require("path");

const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const studentRoutes = require("./routes/studentRoutes")
const supervisorRoutes = require("./routes/supervisorRoutes")
const evaluatorRoutes = require("./routes/evaluatorRoutes")

const app = express()
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // allow cookies/auth headers
}));

//  Static files (PDF serve) 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json())
app.use(cookieParser())
app.use(helmet());
app.use(morgan('dev'));

app.use("/api/auth",authRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/student",studentRoutes)
app.use("/api/supervisor",supervisorRoutes)
app.use("/api/evaluator",evaluatorRoutes)

module.exports = app