import express from "express";
import cors from "cors";
import { config, validateConfig } from "./config.js";
import { closeDb } from "./lib/db.js";

// Routes
import healthRouter from "./routes/health.js";
import usersRouter from "./routes/users.js";
import validateEmailRouter from "./routes/validate-email.js";
import paymentCreateRouter from "./routes/payment/create.js";
import paymentReturnRouter from "./routes/payment/return.js";
import paymentServiceRouter from "./routes/payment/service.js";
import paymentStatusRouter from "./routes/payment/status.js";
import cronCheckUnpaidRouter from "./routes/cron/check-unpaid.js";

validateConfig();

const app = express();

// CORS — allow frontend origin
const allowedOrigins = [
    config.SITE_URL,
    "https://holystudio-ai.onrender.com",
    "http://localhost:5555",
    "http://localhost:3000",
    ...(process.env.RENDER_EXTERNAL_URL ? [process.env.RENDER_EXTERNAL_URL] : []),
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, '')] : []),
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (for req.ip behind reverse proxy)
app.set("trust proxy", true);

// Mount routes
app.use("/api/health", healthRouter);
app.use("/api/users", usersRouter);
app.use("/api/validate-email", validateEmailRouter);
app.use("/api/payment/create", paymentCreateRouter);
app.use("/api/payment/return", paymentReturnRouter);
app.use("/api/payment/service", paymentServiceRouter);
app.use("/api/payment/status", paymentStatusRouter);
app.use("/api/cron/check-unpaid", cronCheckUnpaidRouter);

// Graceful shutdown
function shutdown() {
    console.log("\nShutting down...");
    closeDb().then(() => process.exit(0)).catch(() => process.exit(1));
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start
app.listen(config.PORT, () => {
    console.log(`\n🚀 HOLYSTUDIO API server running on http://localhost:${config.PORT}`);
    console.log(`   SITE_URL: ${config.SITE_URL}`);
    console.log(`   API_URL:  ${config.API_URL}`);
    console.log(`   Price:    ${config.COURSE_PRICE_UAH} UAH\n`);
});
