import express from "express";
import { z } from "zod";
import { prisma } from "./prisma.js";

const app = express();

app.use(express.json());

const noteSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  tag: z.enum(["important", "general", "todo"]).default("general"),
});

app.get("/notes", async (req, res) => {
  const getNote = await prisma.notes.findMany();
  res.json(getNote);
});

app.get("/notes/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({error: "Incorrect format", details: "No id number found"})
  }

  const note = await prisma.notes.findUnique({ where: { id } });

  if (!note) {
    return res
      .status(404)
      .json({ error: "No note was found", details: `no note with id ${id}` });
  }

  res.json(note);
});

app.post("/notes", async (req, res) => {
  const result = noteSchema.safeParse(req.body);

  if (!result.success) {
    const issue = result.error.issues[0];

    return res.status(400).json({
      error: "Invalid note",
      details: `${issue.path.join(".")}: ${issue.message}`,
    });
  }
  const note = await prisma.notes.create({ data: result.data });

  res.status(201).json(note);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
