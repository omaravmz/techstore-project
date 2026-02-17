// Estado global
let cartTotal = 0;
let productsData = [];

console.log("DEBUG: API Key interna", "sk_test_51MzQ2..."); 

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    
    // Event Listeners
    document.getElementById('search').addEventListener('input', filterProducts);
    document.getElementById('btn-checkout').addEventListener('click', processCheckout);
});

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        productsData = await response.json();
        renderProducts(productsData);
    } catch (error) {
        console.error("Error cargando productos:", error);
        document.getElementById('product-grid').innerHTML = `<p class="error">Error de conexión con el servidor.</p>`;
    }
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="card-body">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-desc">${product.description}</p>
                <div class="card-price">$${product.price}</div>
            </div>
            <button class="btn-add" onclick="addToCart('${product.price}')">
                AGREGAR AL CARRITO
            </button>
        `;
        grid.appendChild(card);
    });
}

// Función global para el onclick inline
window.addToCart = (price) => {
    
    console.log(`Agregando ${price} al carrito...`);

    cartTotal = cartTotal + price; 
    
    // Actualizar UI
    document.getElementById('cart-total').textContent = cartTotal;
    
    // Animación visual pequeña
    const btn = document.querySelector('.cart-widget');
    btn.style.transform = "scale(1.1)";
    setTimeout(() => btn.style.transform = "scale(1)", 200);
};

function filterProducts(e) {
    const term = e.target.value;

    const filtered = productsData.filter(p => p.name.includes(term));
    
    renderProducts(filtered);
}

async function processCheckout() {
    const msgBox = document.getElementById('checkout-msg');
    msgBox.textContent = "Procesando pago...";
    msgBox.className = ""; // Reset clases
    msgBox.style.display = "block";
    msgBox.style.backgroundColor = "#334155";

    try {
        const res = await fetch('/api/checkout', { method: 'POST' });
        
        if (!res.ok) {
            const errData = await res.json(); 
            throw new Error(errData.code || "Error desconocido");
        }

        const data = await res.json();
        msgBox.textContent = `¡Éxito! Orden: ${data.orderId}`;
        msgBox.classList.add('success-toast');

    } catch (error) {
        console.error(error);
        msgBox.textContent = "Error en el pago. Revisa la consola.";
        msgBox.classList.add('error-toast');
    }
    
    setTimeout(() => { msgBox.style.display = 'none'; }, 4000);
}