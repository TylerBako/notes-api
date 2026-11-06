import express from "express";
import { z } from "zod";

const app = express();

app.use(express.json());

const noteSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  tag: z.enum(["important", "general", "todo"]).default("general"),
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/notes", (req, res) => {
  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    const issue = result.error.issues[0];

    return res.status(400).json({
      error: "Invalid note",
      details: `${issue.path.join(".")}: ${issue.message}`,
    });
  }
  res.status(201).json(result.data);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
