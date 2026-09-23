// --- LÓGICA DEL CARRITO DE COMPRAS Y DESGLOSE DE IVA ---

// Función para agregar productos al carrito
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('avocare_cart')) || [];
    
    // Verificar si el producto ya existe en el carrito
    let existingIndex = cart.findIndex(item => item.id === id);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    localStorage.setItem('avocare_cart', JSON.stringify(cart));
    updateCartCount();
    alert(`¡"${name}" se agregó al carrito exitosamente!`);
}

// Actualizar el numerito del carrito en el menú superior
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('avocare_cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.innerText = totalCount;
    }
}

// Función para renderizar los productos, subtotal, IVA y total en carrito.html
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('avocare_cart')) || [];
    
    updateCartCount();

    if (!cartItemsContainer) return; // Si no estamos en la página del carrito, no hace nada aquí

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">Tu carrito está vacío.</td></tr>';
        if(subtotalEl) subtotalEl.innerText = '$0';
        if(taxEl) taxEl.innerText = '$0';
        if(totalEl) totalEl.innerText = '$0';
        return;
    }

    let html = '';
    let totalConIva = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalConIva += itemTotal;

        html += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toLocaleString()}</td>
                <td>
                    <button onclick="updateQuantity(${index}, -1)" class="qty-btn">-</button>
                    <span style="margin: 0 10px;">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" class="qty-btn">+</button>
                </td>
                <td>$${itemTotal.toLocaleString()}</td>
                <td><button onclick="removeFromCart(${index})" class="remove-btn">🗑️</button></td>
            </tr>
        `;
    });

    cartItemsContainer.innerHTML = html;

    // Cálculo financiero: El precio incluye IVA del 19% -> Subtotal = Total / 1.19
    let subtotal = totalConIva / 1.19;
    let iva = totalConIva - subtotal;

    if(subtotalEl) subtotalEl.innerText = `$${Math.round(subtotal).toLocaleString()}`;
    if(taxEl) taxEl.innerText = `$${Math.round(iva).toLocaleString()} (19%)`;
    if(totalEl) totalEl.innerText = `$${totalConIva.toLocaleString()}`;
}

// Modificar cantidades dentro de la tabla del carrito
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('avocare_cart')) || [];
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('avocare_cart', JSON.stringify(cart));
    renderCart();
}

// Eliminar un producto completo del carrito
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('avocare_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('avocare_cart', JSON.stringify(cart));
    renderCart();
}

// Control de modales informativos (Ver más)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = 'none';
}

// Ejecutar funciones básicas al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});

// Duplicar tarjetas de productos para el carrusel infinito
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.products-track');
    if (track) {
        // Clona el contenido exacto para completar la segunda mitad del ciclo
        track.innerHTML += track.innerHTML;
    }
});

// --- LÓGICA DE AUTENTICACIÓN Y REGISTRO ---

// Cambiar entre la pestaña de Login y Registro
function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tab === 'login') {
        if(loginForm) loginForm.classList.add('active');
        if(registerForm) registerForm.classList.remove('active');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        if(loginForm) loginForm.classList.remove('active');
        if(registerForm) registerForm.classList.add('active');
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// Manejar el envío de inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    alert(`¡Bienvenido de nuevo, ${email}! Has iniciado sesión correctamente.`);
    window.location.href = 'index.html';
}

// Manejar el envío del registro de nuevo usuario
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    alert(`¡Registro exitoso! bienvenido a la comunidad Avocare, ${name}.`);
    switchAuthTab('login');
}