// 1. Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCIYc8Epfu3jmrewyRaVGc4ISm7qKxG03k",
  authDomain: "localluxury-cb0d7.firebaseapp.com",
  projectId: "localluxury-cb0d7",
  storageBucket: "localluxury-cb0d7.firebasestorage.app",
  messagingSenderId: "425958954222",
  appId: "1:425958954222:web:0bfcdedbfbac2697a40fff",
  measurementId: "G-DHC0N06PZB"
};

// 2. Inisialisasi Firebase (Gaya Compat/Lama agar cocok dengan HTML)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- LOGIKA UTAMA ---

// Fungsi mencari makanan (handleSearch)
async function handleSearch() {
    const userInput = document.getElementById('user-input'); // Cocokkan dengan ID di HTML
    const query = userInput.value.trim();
    
    if (!query) return;

    renderMessage(query, 'king');
    userInput.value = '';

    try {
        const snapshot = await db.collection("products").get();
        let products = [];
        snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));

        // Filter sederhana berdasarkan kata kunci
        let results = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            (p.tags && p.tags.some(tag => query.toLowerCase().includes(tag.toLowerCase())))
        );

        if (results.length > 0) {
            showMultipleResults(results); // Tampilkan multiple hasil
        } else {
            renderMessage("Pardon me, Your Majesty. I couldn't find that specific dish.", "servant");
        }
    } catch (e) {
        console.error("Error searching:", e);
        renderMessage("The royal archives are currently locked.", "servant");
    }
}

// Fungsi menampilkan pesan di chat
function renderMessage(message, sender) {
    const chatWindow = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `${sender}-bubble p-6 max-w-[85%] animate-fadeIn`;
    div.innerHTML = `<p class="${sender === 'king' ? 'text-right' : 'text-left'}">${message}</p>`;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Fungsi menampilkan kartu rekomendasi
function showWinner(product) {
    const resultArea = document.getElementById('result-area');
    const winnerContainer = document.getElementById('winner-container');
    
    winnerContainer.innerHTML = `
        <div class="p-6 bg-black/20 rounded-xl border gold-border winner-card">
            <h3 class="text-2xl gold-text font-bold mb-2">${product.name}</h3>
            <p class="text-lg text-gray-300 mb-4">Price: Rp ${product.price.toLocaleString()}</p>
            <div class="flex gap-3">
                <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="flex-1 luxury-button text-black font-bold py-3 rounded-xl font-semibold">
                    <span class="flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Add to Cart
                    </span>
                </button>
            </div>
        </div>
    `;
    resultArea.classList.remove('hidden');
}

// Fungsi menampilkan multiple hasil sebagai chat message
function showMultipleResults(products) {
    const chatWindow = document.getElementById('chat-window');
    
    let productsHTML = '<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">';
    
    products.forEach(product => {
        productsHTML += `
            <div class="p-3 bg-black/20 rounded-lg border gold-border product-card hover:scale-105 transition-transform">
                <h4 class="text-sm gold-text font-bold mb-1">${product.name}</h4>
                <p class="text-xs text-gray-300 mb-2">Rp ${product.price.toLocaleString()}</p>
                <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="w-full luxury-button text-black font-bold py-1.5 rounded text-xs">
                    <span class="flex items-center justify-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Add to Cart
                    </span>
                </button>
            </div>
        `;
    });
    
    productsHTML += '</div>';
    
    // Create servant message with products
    const div = document.createElement('div');
    div.className = 'servant-bubble p-4 max-w-[90%] animate-fadeIn';
    div.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full gold-bg flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>
            <div class="flex-1">
                <p class="text-sm font-semibold mb-2">I found these royal delicacies for you, Your Majesty:</p>
                ${productsHTML}
            </div>
        </div>
    `;
    
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 3. EVENT LISTENERS (Kunci Agar Tombol Berfungsi)
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Setting up event listeners');
    const btn = document.getElementById('send-btn'); // ID Tombol Discover
    const input = document.getElementById('user-input'); // ID Input Teks
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartOverlay = document.getElementById('cart-overlay');

    console.log('Elements found:', {
        cartBtn: !!cartBtn,
        closeCartBtn: !!closeCartBtn,
        cartOverlay: !!cartOverlay
    });

    if (btn) {
        btn.addEventListener('click', handleSearch);
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            console.log('Cart button clicked');
            toggleCart();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            console.log('Close cart button clicked');
            toggleCart();
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            console.log('Cart overlay clicked');
            toggleCart();
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Checkout functionality would be implemented here!');
        });
    }

    // Initialize cart count on page load
    updateCartCount();
});

// 4. Cek apakah database kosong, jika ya isi data awal
db.collection("products").limit(1).get().then(snapshot => {
    if (snapshot.empty) {
        const menu = [
            { name: "Nasi Rendang Royal", price: 25000, tags: ["spicy", "filling"] },
            { name: "Martabak Sweetness", price: 20000, tags: ["sweet", "dessert"] },
            { name: "Sate Ayam Sultan", price: 30000, tags: ["luxury", "portion"] },
            { name: "Gado-Gado Premium", price: 18000, tags: ["healthy", "vegetarian"] },
            { name: "Bakso Urat Special", price: 22000, tags: ["spicy", "filling"] },
            { name: "Es Teler Deluxe", price: 15000, tags: ["sweet", "dessert", "cold"] },
            { name: "Ayam Bakar Madu", price: 28000, tags: ["luxury", "sweet"] },
            { name: "Mie Goreng Special", price: 16000, tags: ["quick", "filling"] },
            { name: "Soto Ayam Premium", price: 19000, tags: ["warm", "comfort"] },
            { name: "Pisang Goreng Crispy", price: 12000, tags: ["sweet", "snack"] }
        ];
        menu.forEach(item => db.collection("products").add(item));
    }
});

// ADD TO CART LOGIC
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.productId === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
  animateCart();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalItems;
}

function toggleCart() {
  console.log('toggleCart function called');
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  
  console.log('Sidebar element:', sidebar);
  console.log('Overlay element:', overlay);
  
  if (sidebar && overlay) {
    // Toggle custom CSS classes instead of Tailwind
    if (sidebar.classList.contains('cart-sidebar-hidden')) {
      sidebar.classList.remove('cart-sidebar-hidden');
      sidebar.classList.add('cart-sidebar-visible');
      overlay.classList.remove('hidden');
    } else {
      sidebar.classList.remove('cart-sidebar-visible');
      sidebar.classList.add('cart-sidebar-hidden');
      overlay.classList.add('hidden');
    }
    
    console.log('Sidebar classes after toggle:', sidebar.className);
    console.log('Overlay classes after toggle:', overlay.className);
    
    if (sidebar.classList.contains('cart-sidebar-visible')) {
      renderCart();
    }
  } else {
    console.error('Sidebar or overlay element not found');
  }
}

function animateCart() {
  const cartIcon = document.getElementById("cartIcon");
  cartIcon.classList.add("pulse");

  setTimeout(() => {
    cartIcon.classList.remove("pulse");
  }, 400);
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-400 py-8">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <p>Your cart is empty</p>
      </div>
    `;
    totalElement.textContent = "Rp 0";
    return;
  }

  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    container.innerHTML += `
      <div class="glass-morphism p-4 rounded-xl">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <p class="gold-text font-semibold">${item.name}</p>
            <p class="text-sm text-gray-400">Rp ${item.price.toLocaleString()} each</p>
          </div>
          <button onclick="removeFromCart('${item.productId}')" class="text-red-400 hover:text-red-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button onclick="updateQuantity('${item.productId}', -1)" class="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center">
              -
            </button>
            <span class="w-8 text-center">${item.quantity}</span>
            <button onclick="updateQuantity('${item.productId}', 1)" class="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center">
              +
            </button>
          </div>
          <p class="gold-text font-semibold">Rp ${itemTotal.toLocaleString()}</p>
        </div>
      </div>
    `;
  });

  totalElement.textContent = `Rp ${total.toLocaleString()}`;
}

function updateQuantity(id, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(item => item.productId === id);
  
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.productId !== id);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.productId !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}
