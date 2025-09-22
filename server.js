const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد مجلد الصور
const upload = multer({
  dest: path.join(__dirname, "uploads/"),
  limits: { fileSize: 5 * 1024 * 1024 } // حد أقصى 5MB
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(__dirname));

// دالة مساعدة لقراءة المنتجات
function getProducts() {
  try {
    const data = fs.readFileSync("products.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// دالة مساعدة لحفظ المنتجات
function saveProducts(products) {
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
}

// جلب المنتجات
app.get("/api/products", (req, res) => {
  res.json(getProducts());
});

// رفع منتج جديد
app.post("/api/upload", upload.single("image"), (req, res) => {
  const { name, price } = req.body;
  if (!name || !price || !req.file) {
    return res.status(400).json({ error: "❌ البيانات ناقصة" });
  }

  const products = getProducts();
  const newProduct = {
    id: Date.now(),
    name,
    price,
    image: "/uploads/" + req.file.filename
  };

  products.push(newProduct);
  saveProducts(products);

  res.json({ msg: "✅ تم رفع المنتج", product: newProduct });
});

app.listen(PORT, () => console.log("🚀 Server running on port " + PORT));
