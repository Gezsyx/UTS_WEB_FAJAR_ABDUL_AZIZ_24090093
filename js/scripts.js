const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const soraGreeting = new Audio("../audio/sora_greetings.m4a");

const correctEmail = "jarzzjr@gmail.com";
const correctPassword = "24090093";

function showNotification(message, type) {
  let notification = document.getElementById("notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    notification.className = "notification";
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 4000);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "" || password === "") {
      showNotification("Email dan password tidak boleh kosong.", "error");
    } else if (email === correctEmail && password === correctPassword) {
      showNotification("Login berhasil", "success");
      soraGreeting.play().catch((error) => {
        console.log("Gagal memutar audio:", error);
      });
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1700);
    } else {
      showNotification("Email atau password salah.", "error");
    }
  });
}

const hamburgerBtn = document.getElementById("hamburger-btn");
const sidebar = document.getElementById("sidebar");
const menuOverlay = document.getElementById("menu-overlay");

if (hamburgerBtn && sidebar && menuOverlay) {
  const openMenu = () => {
    sidebar.classList.add("show");
    menuOverlay.classList.add("show");
  };

  const closeMenu = () => {
    sidebar.classList.remove("show");
    menuOverlay.classList.remove("show");
  };

  hamburgerBtn.addEventListener("click", openMenu);
  menuOverlay.addEventListener("click", closeMenu);

  const navItems = document.querySelectorAll("#sidebar .nav-item a");
  navItems.forEach((item) => {
    item.addEventListener("click", closeMenu);
  });
}

const productsElement = document.getElementById("total-products");
const salesElement = document.getElementById("total-sales");
const revenueElement = document.getElementById("total-revenue");

const summary = {
  totalProducts: 210,
  totalSales: 139,
  totalRevenue: 5724400,
};

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

if (productsElement) productsElement.textContent = summary.totalProducts;
if (salesElement) salesElement.textContent = summary.totalSales;
if (revenueElement)
  revenueElement.textContent = formatRupiah(summary.totalRevenue);

const productsTableBody = document.getElementById("products-tbody");

if (productsTableBody) {
  const products = [
    { id: 1, name: "Kopi Gayo", price: 25000, stock: 50 },
    { id: 2, name: "Teh Hitam", price: 18000, stock: 30 },
    { id: 3, name: "Coklat Aceh", price: 30000, stock: 20 },
  ];

  let pendingDeleteId = null;

  function renderProducts() {
    productsTableBody.innerHTML = "";

    products.forEach((product, index) => {
      const row = document.createElement("tr");
      row.id = `product-${product.id}`;

      row.innerHTML = `
          <td class="no-col" data-label="No">${index + 1}</td>
          <td data-label="Product Name">${product.name}</td>
          <td class="price" data-label="Price">Rp ${product.price.toLocaleString(
            "id-ID"
          )}</td>
          <td class="stock" data-label="Stock">${product.stock}</td>
          <td data-label="Action">
            <div class="action-buttons">
              <button class="edit-btn" onclick="editProduct(${product.id})">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="delete-btn" onclick="deleteProduct(${product.id})">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </td>
        `;

      productsTableBody.appendChild(row);
    });
  }

  window.editProduct = function (id) {
    const product = products.find((p) => p.id === id);
    if (product) {
      showNotification(`Edit produk: ${product.name}`, "info");
    }
  };

  window.deleteProduct = function (id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    pendingDeleteId = id;
    document.getElementById(
      "modal-message"
    ).textContent = `Yakin ingin menghapus produk "${product.name}"?`;
    document.getElementById("delete-modal").classList.add("show");
  };

  window.closeDeleteModal = function () {
    document.getElementById("delete-modal").classList.remove("show");
    pendingDeleteId = null;
  };

  window.confirmDelete = function () {
    if (pendingDeleteId === null) return;

    const product = products.find((p) => p.id === pendingDeleteId);
    const row = document.getElementById(`product-${pendingDeleteId}`);
    if (row) {
      row.remove();
    }

    const index = products.findIndex((p) => p.id === pendingDeleteId);
    if (index > -1) {
      products.splice(index, 1);
      showNotification(`Produk "${product.name}" berhasil dihapus`, "success");
    }

    window.closeDeleteModal();
  };

  renderProducts();
}
