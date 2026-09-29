// const express = require("express")
// const cookieParser = require("cookie-parser")
// const cors = require("cors")
// const helmet = require("helmet")
// const morgan = require("morgan")
// const path = require("path");

// const authRoutes = require("./routes/authRoutes")
// const adminRoutes = require("./routes/adminRoutes")
// const studentRoutes = require("./routes/studentRoutes")
// const supervisorRoutes = require("./routes/supervisorRoutes")
// const evaluatorRoutes = require("./routes/evaluatorRoutes")

// const app = express()
// app.use(cors({
//   origin: "http://localhost:5173", // frontend URL
//   credentials: true,               // allow cookies/auth headers
// }));

// //  Static files (PDF serve)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(express.json())
// app.use(cookieParser())
// app.use(helmet());
// app.use(morgan('dev'));

// app.use("/api/auth",authRoutes)
// app.use("/api/admin",adminRoutes)
// app.use("/api/student",studentRoutes)
// app.use("/api/supervisor",supervisorRoutes)
// app.use("/api/evaluator",evaluatorRoutes)

// module.exports = app

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const supervisorRoutes = require("./routes/supervisorRoutes");
const evaluatorRoutes = require("./routes/evaluatorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const publicResultRoutes = require("./routes/publicResultRoutes");

const app = express();
let databaseConnectionPromise;

app.set("trust proxy", 1);

const connectToDatabase = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }

  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error("MONGO_URI is not configured"));
  }

  if (!databaseConnectionPromise) {
    databaseConnectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => {
        databaseConnectionPromise = null;
      })
      .catch((error) => {
        databaseConnectionPromise = null;
        throw error;
      });
  }

  return databaseConnectionPromise;
};

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      /*
       * Requests without an Origin header include tools such as Postman
       * and server-to-server calls.
       */
      if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return res.status(503).json({
      status: "degraded",
      database: "disconnected",
      message: "Database unavailable",
    });
  }
});

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  return res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/supervisor", supervisorRoutes);
app.use("/api/evaluator", evaluatorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/public", publicResultRoutes);

app.use((error, req, res, next) => {
  console.error(error);

  if (error.message === "Origin is not allowed by CORS") {
    return res.status(403).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

module.exports = app;
