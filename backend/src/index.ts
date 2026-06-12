import express from "express";
import { getUser } from "./endpoints/GetUser.js";
import { logIn } from "./endpoints/LogIn.js";
import { signUp } from "./endpoints/SignUp.js";
import { updateUser } from "./endpoints/UpdateUser.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/login", logIn);
app.post("/signup", signUp);
app.get("/users/:id", getUser);
app.put("/users/:id", updateUser);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
