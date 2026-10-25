
(function () {
  "use strict";

  // ==========================================
  // PINK DOLL SOCIETY PRODUCT CATALOG
  // ==========================================

  const products = [
    {
      id: "pds-straight",
      name: "The Doll Straight",
      category: "Silky Straight",
      texture: "straight",
      description: "Sleek, smooth hair for a flawless finish.",
      price: 85,
      image: "assets/images/doll-straight.jpg",
      badge: "THE CLASSIC"
    },
    {
      id: "pds-body-wave",
      name: "The Society Wave",
      category: "Body Wave",
      texture: "body-wave",
      description: "Soft, flowing waves with effortless volume.",
      price: 90,
      image: "assets/images/society-body-wave.jpg",
      badge: "BESTSELLER"
    },
    {
      id: "pds-deep-wave",
      name: "The Baddie Wave",
      category: "Deep Wave",
      texture: "deep-wave",
      description: "Defined waves for a bold, glamorous look.",
      price: 95,
      image: "assets/images/baddie-deep-wave.jpg",
      badge: "DOLL FAVORITE"
    }
  ];

  const lengths = [14, 16, 18, 20, 22, 24, 26, 28, 30];
  const cartKey = "pinkDollSocietyCart";

  // ==========================================
  // PAGE ELEMENTS
  // ==========================================

  const grid = document.getElementById("product-grid");
  const cartCount = document.getElementById("cart-count");
  const cartToast = document.getElementById("cart-toast");
  const searchInput = document.getElementById("product-search");
  const textureFilter = document.getElementById("texture-filter");
  const sortSelect = document.getElementById("product-sort");
  const productTotal = document.getElementById("product-total");
  const yearElement = document.getElementById("footer-year");
  const textureButtons = document.querySelectorAll(".texture-button");

  // Update footer year automatically.
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ==========================================
  // PRODUCT PRICING
  // Sample pricing: each extra 2 inches adds $5.
  // Replace with confirmed prices before launch.
  // ==========================================

  function getPrice(product, length) {
    return product.price + ((length - 14) / 2) * 5;
  }

  function formatPrice(price) {
    return "$" + Number(price).toFixed(2);
  }

  // ==========================================
  // SHOPPING CART
  // ==========================================

  function getCart() {
    try {
      const savedCart = localStorage.getItem(cartKey);
      const cart = JSON.parse(savedCart || "[]");

      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      console.error("Could not read the shopping cart:", error);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error("Could not save the shopping cart:", error);
      showToast("Your bag could not be updated. Please try again.");
      return false;
    }
  }

  function updateCartCount() {
    if (!cartCount) return;

    const total = getCart().reduce(function (sum, item) {
      return sum + Math.max(0, Number(item.quantity) || 0);
    }, 0);

    cartCount.textContent = total;
  }

  // ==========================================
  // CART NOTIFICATION
  // ==========================================

  let toastTimer;

  function showToast(message) {
    if (!cartToast) return;

    cartToast.textContent = message;
    cartToast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
      cartToast.classList.remove("show");
    }, 2500);
  }

  // ==========================================
  // TEXTURE BUTTONS
  // ==========================================

  function updateTextureButtons(selectedTexture) {
    textureButtons.forEach(function (button) {
      const isActive = button.dataset.texture === selectedTexture;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  textureButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (!textureFilter) return;

      textureFilter.value = button.dataset.texture;
      updateTextureButtons(textureFilter.value);
      renderProducts();
    });
  });

  if (textureFilter) {
    textureFilter.addEventListener("change", function () {
      updateTextureButtons(textureFilter.value);
      renderProducts();
    });

    updateTextureButtons(textureFilter.value);
  }

  // ==========================================
  // CREATE PRODUCT CARDS
  // ==========================================

  function createProductCard(product) {
    const options = lengths.map(function (length) {
      return `
        <option value="${length}">
          ${length} inches
        </option>
      `;
    }).join("");

    return `
      <article class="product-card" data-product-id="${product.id}">

        <div class="product-image-wrap">
          <img
            src="${product.image}"
            alt="${product.category} hair extensions"
            loading="lazy"
          >

          <span class="product-badge">${product.badge}</span>
        </div>

        <div class="product-info">

          <p class="product-category">${product.category}</p>

          <h3>${product.name}</h3>

          <p class="product-description">
            ${product.description}
          </p>

          <p
            class="product-price"
            id="price-${product.id}"
            aria-live="polite"
          >
            ${formatPrice(getPrice(product, 14))}
          </p>

          <label
            class="product-length-label"
            for="length-${product.id}"
          >
            SELECT LENGTH
          </label>

          <select
            class="product-length"
            id="length-${product.id}"
            data-product-id="${product.id}"
          >
            ${options}
          </select>

          <button
            class="add-to-bag"
            type="button"
            data-product-id="${product.id}"
          >
            ADD TO BAG
          </button>

        </div>
      </article>
    `;
  }

  // ==========================================
  // SEARCH, FILTER AND SORT
  // ==========================================

  function getVisibleProducts() {
    let result = products.slice();

    const search = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    const texture = textureFilter
      ? textureFilter.value
      : "all";

    const sort = sortSelect
      ? sortSelect.value
      : "featured";

    // Search product name, texture, and description.
    if (search) {
      result = result.filter(function (product) {
        return (
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.texture.toLowerCase().includes(search)
        );
      });
    }

    // Filter by texture.
    if (texture !== "all") {
      result = result.filter(function (product) {
        return product.texture === texture;
      });
    }

    // Sort products.
    if (sort === "price-low") {
      result.sort(function (a, b) {
        return a.price - b.price;
      });
    } else if (sort === "price-high") {
      result.sort(function (a, b) {
        return b.price - a.price;
      });
    } else if (sort === "name") {
      result.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }

    return result;
  }

  // ==========================================
  // RENDER PRODUCTS
  // ==========================================

  function renderProducts() {
    if (!grid) {
      console.error(
        "Product grid not found. Check for id='product-grid' in products.html."
      );
      return;
    }

    const visibleProducts = getVisibleProducts();

    if (visibleProducts.length === 0) {
      grid.innerHTML = `
        <p class="no-products-message">
          No products found. Try another search or hair texture.
        </p>
      `;
    } else {
      grid.innerHTML = visibleProducts.map(createProductCard).join("");
    }

    if (productTotal) {
      productTotal.textContent =
        visibleProducts.length +
        (visibleProducts.length === 1
          ? " style to explore"
          : " styles to explore");
    }

    grid.setAttribute("aria-busy", "false");

    // Handle missing image files without breaking the product cards.
    grid.querySelectorAll(".product-image-wrap img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.style.display = "none";

        const imageWrap = img.parentElement;

        if (imageWrap) {
          imageWrap.classList.add("image-unavailable");
        }

        console.warn("Product image could not be loaded:", img.src);
      }, { once: true });
    });
  }

  // ==========================================
  // PRODUCT LENGTH AND PRICE CHANGES
  // ==========================================

  if (grid) {
    grid.addEventListener("change", function (event) {
      const target = event.target;

      if (!target.matches(".product-length")) return;

      const product = products.find(function (item) {
        return item.id === target.dataset.productId;
      });

      if (!product) return;

      const selectedLength = Number(target.value);
      const priceElement = document.getElementById(
        "price-" + product.id
      );

      if (
        !lengths.includes(selectedLength) ||
        !priceElement
      ) {
        return;
      }

      priceElement.textContent = formatPrice(
        getPrice(product, selectedLength)
      );
    });

    // ========================================
    // ADD PRODUCTS TO BAG
    // ========================================

    grid.addEventListener("click", function (event) {
      const button = event.target.closest(".add-to-bag");

      if (!button) return;

      const product = products.find(function (item) {
        return item.id === button.dataset.productId;
      });

      if (!product) return;

      const lengthSelect = document.getElementById(
        "length-" + product.id
      );

      if (!lengthSelect) return;

      const length = Number(lengthSelect.value);

      if (!lengths.includes(length)) return;

      const price = getPrice(product, length);
      const cart = getCart();

      const existingItem = cart.find(function (item) {
        return (
          item.id === product.id &&
          Number(item.length) === length
        );
      });

      if (existingItem) {
        existingItem.quantity =
          (Number(existingItem.quantity) || 0) + 1;

        existingItem.price = price;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          category: product.category,
          price: price,
          length: length,
          quantity: 1,
          image: product.image
        });
      }

      if (saveCart(cart)) {
        updateCartCount();
        showToast(product.name + " added to your bag!");
      }
    });
  }

  // ==========================================
  // SEARCH AND SORT EVENT LISTENERS
  // ==========================================

  if (searchInput) {
    searchInput.addEventListener("input", renderProducts);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
  }

  // ==========================================
  // INITIALIZE PAGE
  // ==========================================

  renderProducts();
  updateCartCount();

})();
