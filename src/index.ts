import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/notes", (req, res) => {
  res.status(201).json(req.body);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
