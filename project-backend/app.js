import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import skillListingRoutes from "./routes/skilllistingroutes.js";
import skillRequestRoutes from "./routes/skilllisrequestRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import protect from "./middlewares/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", protect, skillListingRoutes);
app.use("/api/requests", protect, skillRequestRoutes);
app.use("/api/reviews", protect, reviewRoutes);
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});
app.get("/", (req, res) => {
  res.json({ message: "API Running Successfully " });
});

export default app;