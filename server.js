const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const session = require("express-session");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// رفع الصور
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: true
}));

// API بسيط
app.get("/api/products", (req, res) => {
  const data = fs.readFileSync("products.json");
  res.json(JSON.parse(data));
});

// رفع منتج
app.post("/api/upload", upload.single("image"), (req, res) => {
  res.json({ msg: "✅ تم رفع المنتج", file: req.file });
});

app.listen(PORT, () => console.log("🚀 Server running on port " + PORT));