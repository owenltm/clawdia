import app from "./app";
import { runMigrations } from "./db";

const PORT = process.env.PORT || 3000; // Server listens on port 3000

async function startServer() {
  try {
    await runMigrations();
    console.log("Database migrations completed.");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
