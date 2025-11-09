import express from "express";
import cors from "cors";
import columnsRouter from "./routes/columns.js";
import tasksRouter from "./routes/tasks.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.get("/", (_req, res) => {
  res.json({ message: "Ell Kanban API ready" });
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/columns", columnsRouter);
app.use("/api/tasks", tasksRouter);
export default app;
