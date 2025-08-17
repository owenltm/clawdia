import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 3000; // Server listens on port 3000

// Middleware
app.use(express.json());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express on port 3000!");
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});