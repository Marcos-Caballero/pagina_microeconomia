// 1. Inicializar el carrito desde la memoria local del navegador
let cart = JSON.parse(localStorage.getItem('avocare_cart')) || [];

// 2. Actualizar el contador del carrito en el menú superior
function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countSpan.textContent = totalItems;
    }
}

// 3. Lógica para agregar al carrito (desde index.html)
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    localStorage.setItem('avocare_cart', JSON.stringify(cart));
    updateCartCount();
    alert(`¡Se agregó ${name} al carrito exitosamente!`);
}

// 4. Lógica para abrir y cerrar modales de ingredientes
function openModal(id) {
    const modal = document.getElementById(id);
    if(modal) modal.style.display = 'block';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if(modal) modal.style.display = 'none';
}

// Cerrar modal al hacer clic por fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// 5. Lógica exclusiva para renderizar la página del carrito (carrito.html)
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    // Validación de carrito vacío
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="padding: 1rem;">Tu carrito está vacío. ¡Descubre nuestros productos en la página de inicio!</p>';
        document.getElementById('subtotal').textContent = '$0';
        document.getElementById('iva').textContent = '$0';
        document.getElementById('total').textContent = '$0';
        
        const btnCheckout = document.getElementById('btn-checkout');
        if(btnCheckout) {
            btnCheckout.disabled = true;
            btnCheckout.style.opacity = '0.5';
            btnCheckout.style.cursor = 'not-allowed';
        }
        return;
    }

    // Habilitar botón de compra
    const btnCheckout = document.getElementById('btn-checkout');
    if(btnCheckout) {
        btnCheckout.disabled = false;
        btnCheckout.style.opacity = '1';
        btnCheckout.style.cursor = 'pointer';
    }

    // Dibujar cada producto en el carrito
    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4 style="color: var(--primary-dark); margin-bottom: 5px;">${item.name}</h4>
                    <p style="font-weight: bold; color: var(--accent-gold);">$${item.price.toLocaleString('es-CO')}</p>
                </div>
                <div>
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span style="margin: 0 15px; font-weight: bold; font-size: 1.1rem;">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    // Calcular y mostrar Subtotal, IVA (19%) y Total
    const iva = subtotal * 0.19;
    const total = subtotal + iva;

    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    document.getElementById('iva').textContent = `$${iva.toLocaleString('es-CO')}`;
    document.getElementById('total').textContent = `$${total.toLocaleString('es-CO')}`;
}

// 6. Cambiar cantidad de un producto (+ o -)
function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Si llega a 0, se elimina del carrito
    }
    localStorage.setItem('avocare_cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// 7. Simular el pago final
function processCheckout() {
    if (cart.length === 0) return;
    
    const orderNumber = Math.floor(Math.random() * 90000) + 10000;
    document.getElementById('order-number').textContent = `AVO-${orderNumber}`;
    document.getElementById('modal-checkout').style.display = 'block';
    
    // Vaciar carrito
    cart = [];
    localStorage.setItem('avocare_cart', JSON.stringify(cart));
    updateCartCount();
}

// Ejecutar al cargar cualquier página para mantener el contador actualizado
document.addEventListener('DOMContentLoaded', updateCartCount);