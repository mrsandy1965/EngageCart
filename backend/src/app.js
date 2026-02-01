import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes.js";

const PORT = process.env.PORT || 5001;

connectDB();
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
