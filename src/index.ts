import app from "./app";

const PORT = process.env.PORT || 3000; // Server listens on port 3000

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();