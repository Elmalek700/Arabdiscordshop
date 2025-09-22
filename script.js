async function login() {
  window.location.href = "/auth/discord";
}

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  const container = document.getElementById("products");
  container.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="صورة المنتج">
      <h3>${p.name}</h3>
      <p>السعر: ${p.price}💰</p>
      <p>البائع: ${p.seller}</p>
    `;
    container.appendChild(div);
  });
}

async function addProduct() {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const imageFile = document.getElementById("productImage").files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("image", imageFile);

  await fetch("/api/products", {
    method: "POST",
    body: formData
  });

  loadProducts();
}

window.onload = loadProducts;