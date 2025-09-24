let cart = [];

const products = [
  {
    name: "Võ phục Vải Sọc Taekwondo",
    type: "size",
    options: [
      { label: "100cm", value: "100", price: 150000 },
      { label: "110cm", value: "110", price: 155000 },
      { label: "120cm", value: "120", price: 160000 },
      { label: "130cm", value: "130", price: 165000 },
      { label: "140cm", value: "140", price: 170000 },
      { label: "150cm", value: "150", price: 175000 },
      { label: "160cm", value: "160", price: 180000 },
      { label: "170cm", value: "170", price: 185000 },
      { label: "180cm", value: "180", price: 190000 },
      { label: "190cm", value: "190", price: 195000 },
    ],
  },
  {
    name: "Võ phục Vải Kim Cương Taekwondo",
    type: "size",
    options: [
      { label: "100cm", value: "100", price: 190000 },
      { label: "110cm", value: "110", price: 195000 },
      { label: "120cm", value: "120", price: 200000 },
      { label: "130cm", value: "130", price: 210000 },
      { label: "140cm", value: "140", price: 215000 },
      { label: "150cm", value: "150", price: 220000 },
      { label: "160cm", value: "160", price: 225000 },
      { label: "170cm", value: "170", price: 230000 },
      { label: "180cm", value: "180", price: 235000 },
      { label: "190cm", value: "190", price: 240000 },
    ],
  },
  {
    name: "Bảo Hộ Tay Chân",
    price: 250000,
    type: "size",
    options: [
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
      { label: "XL", value: "XL" },
    ],
  },
  // Thêm Giáp Thân vào mảng products
  {
    name: "Giáp Thân",
    price: 210000,
    type: "size",
    options: [
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
      { label: "XL", value: "XL" },
    ],
  },
  {
    name: "Đai Taekwondo",
    price: 25000,
    type: "color",
    options: [
      { label: "Trắng", value: "Trắng" },
      { label: "Vàng", value: "Vàng" },
      { label: "Xanh", value: "Xanh" },
      { label: "Đỏ", value: "Đỏ" },
      { label: "Cam", value: "Cam" },
      { label: "Tím", value: "Tím" },
    ],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderProducts();
  setupEventListeners();
});

function setupEventListeners() {
  document
    .querySelector(".checkout-button")
    .addEventListener("click", placeOrder);
  document.querySelector(".product-grid").addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart-btn")) {
      const productDiv = event.target.closest(".product");
      const productName = productDiv.dataset.name;
      const sizeSelect = productDiv.querySelector(".size-select");
      const qtyInput = productDiv.querySelector(".qty-input");
      const productData = products.find((p) => p.name === productName);

      let finalPrice = productData.price;
      let size = sizeSelect.value;

      const selectedOption = productData.options.find(
        (opt) => opt.value === size
      );
      if (selectedOption && selectedOption.price) {
        finalPrice = selectedOption.price;
      }

      addToCart(productName, finalPrice, size, parseInt(qtyInput.value));
    }
  });

  document
    .querySelector(".product-grid")
    .addEventListener("change", (event) => {
      if (event.target.classList.contains("size-select")) {
        updatePrice(event.target);
      }
    });

  document.getElementById("cartTable").addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-item-btn")) {
      const index = event.target.dataset.index;
      removeItem(index);
    }
  });

  document.getElementById("cartTable").addEventListener("change", (event) => {
    if (event.target.classList.contains("qty-input-cart")) {
      const index = event.target.dataset.index;
      updateQty(index, event.target.value);
    }
  });
}

function renderProducts() {
  const productGrid = document.querySelector(".product-grid");
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.dataset.name = product.name;

    let optionsHtml = `<option value="">--Chọn ${
      product.type === "size" ? "size" : "màu"
    }--</option>`;
    optionsHtml += product.options
      .map(
        (opt) =>
          `<option value="${opt.value}" data-price="${opt.price || ""}">${
            opt.label
          }</option>`
      )
      .join("");

    productDiv.innerHTML = `
            <strong>${product.name}</strong><br />
            <label>${product.type === "size" ? "Size" : "Màu"}:
                <select class="size-select">
                    ${optionsHtml}
                </select>
            </label>
            <span class="price-display"></span>
            <label>Số lượng:
                <input type="number" class="qty-input" value="1" min="1" />
            </label>
            <button class="add-to-cart-btn">Thêm vào giỏ</button>
        `;
    productGrid.appendChild(productDiv);
  });
}

function updatePrice(selectElement) {
  const priceDisplay = selectElement
    .closest(".product")
    .querySelector(".price-display");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const price = selectedOption.getAttribute("data-price");
  priceDisplay.textContent =
    price > 0 ? `Giá: ${parseInt(price).toLocaleString()}đ` : "";
}

function addToCart(name, price, size, qty) {
  if (!size) {
    alert("Vui lòng chọn size/màu trước khi thêm vào giỏ!");
    return;
  }
  if (qty <= 0 || isNaN(qty)) {
    alert("Số lượng phải lớn hơn 0!");
    return;
  }

  let found = false;
  for (let item of cart) {
    if (item.name === name && item.size === size) {
      item.qty += qty;
      found = true;
      break;
    }
  }
  if (!found) cart.push({ name, price, size, qty });

  saveCart();
  renderCart();
  showToast("Đã thêm vào giỏ hàng");
}

function renderCart() {
  const table = document.getElementById("cartTable");
  let tableHTML = `
        <thead>
            <tr>
                <th>Sản phẩm</th>
                <th>Size/Màu</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Xóa</th>
            </tr>
        </thead>
        <tbody>
    `;
  let total = 0;

  if (cart.length === 0) {
    tableHTML += `<tr><td colspan="5">Giỏ hàng trống.</td></tr>`;
  } else {
    cart.forEach((item, index) => {
      tableHTML += `<tr>
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td><input type="number" class="qty-input-cart" data-index="${index}" value="${
        item.qty
      }" min="1"></td>
                <td>${(item.price * item.qty).toLocaleString()}đ</td>
                <td><button class="remove-item-btn" data-index="${index}">🗑</button></td>
            </tr>`;
      total += item.price * item.qty;
    });
  }

  tableHTML += `
        </tbody>
        <tfoot>
            <tr class="cart-total-row">
                <td colspan="3" style="text-align:right;">Tổng cộng:</td>
                <td colspan="2" style="text-align:left;">${total.toLocaleString()}đ</td>
            </tr>
        </tfoot>
    `;
  table.innerHTML = tableHTML;
}

function updateQty(index, newQty) {
  cart[index].qty = parseInt(newQty);
  if (cart[index].qty <= 0 || isNaN(cart[index].qty)) cart[index].qty = 1;
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function placeOrder() {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }
  document.getElementById("overlay").style.display = "flex";
  let count = 3;
  const countdown = document.getElementById("countdown");
  const orderResult = document.getElementById("orderResult");
  countdown.innerHTML = "";
  orderResult.innerHTML = "";

  const timer = setInterval(() => {
    if (count > 0) {
      countdown.innerHTML = `<h2>${count}...</h2>`;
      count--;
    } else {
      clearInterval(timer);
      countdown.innerHTML = "<h2>💥 Cú đá quyết định đã được tung ra!</h2>";

      // Lấy URL của Apps Script đã copy ở bước trước
      const googleSheetUrl =
        "https://script.google.com/macros/s/AKfycbwHopZSGmffXCeAUTOgJHMZPh4Q4pZbpAHuEiDQrLQHYbWfJnmPnOjEmOYomEleR7gPxQ/exec";

      // Dữ liệu cần gửi
      const orderData = {
        cart: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      };

      // Gửi dữ liệu đến Google Sheet
      fetch(googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
        .then(() => {
          // Phản hồi thành công
          console.log("✅ Dữ liệu đã được gửi thành công!");
          let result = "<div class='success'>✅ ĐẶT HÀNG THÀNH CÔNG</div><br>";
          result +=
            "<table border='1' style='width:100%; border-collapse:collapse;'><thead><tr><th>Sản phẩm</th><th>Size/Màu</th><th>SL</th><th>Thành tiền</th></tr></thead><tbody>";
          let total = 0;
          cart.forEach((item) => {
            result += `<tr><td>${item.name}</td><td>${item.size}</td><td>${
              item.qty
            }</td><td>${(item.price * item.qty).toLocaleString()}đ</td></tr>`;
            total += item.price * item.qty;
          });
          result += `</tbody><tfoot><tr><td colspan='3' style='text-align:right;font-weight:bold;'>Tổng cộng:</td><td><b>${total.toLocaleString()}đ</b></td></tr></tfoot></table>`;
          orderResult.innerHTML = result;

          cart = [];
          saveCart();
          renderCart();
          setTimeout(() => {
            document.getElementById("overlay").style.display = "none";
          }, 4000);
        })
        .catch((error) => {
          console.error("❌ Lỗi khi gửi dữ liệu:", error);
          alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
          document.getElementById("overlay").style.display = "none";
        });
    }
  }, 1000);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function loadCart() {
  const data = localStorage.getItem("cart");
  if (data) cart = JSON.parse(data);
  renderCart();
}
function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}
