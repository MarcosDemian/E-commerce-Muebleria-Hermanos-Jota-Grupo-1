/* ==========================================================================
   MUEBLERÍA HERMANOS JOTA — MÓDULO DEL CARRITO DE COMPRAS (LOCALSTORAGE)
   Consigna Final Sprint 1 y 2
   ========================================================================== */

const STORAGE_KEY = 'hj_cart_items_v2';

class CarritoService {
    constructor() {
        this.items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initDOM());
        } else {
            this.initDOM();
        }
    }

    initDOM() {
        this.updateBadge();
        this.renderCartModal();
        this.attachHeaderEvents();
    }

    guardar() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        this.updateBadge();
        this.renderCartItems();
    }

    agregar(producto, cantidad = 1) {
        if (!producto || !producto.id) return;
        const index = this.items.findIndex(i => i.id === producto.id);
        if (index > -1) {
            this.items[index].cantidad += cantidad;
        } else {
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: cantidad
            });
        }
        this.guardar();
        this.mostrarToast(`"${producto.nombre}" agregado al carrito`);
        this.abrirModal();
    }

    modificarCantidad(id, delta) {
        const index = this.items.findIndex(i => i.id === id);
        if (index > -1) {
            this.items[index].cantidad += delta;
            if (this.items[index].cantidad <= 0) {
                this.items.splice(index, 1);
            }
            this.guardar();
        }
    }

    eliminar(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.guardar();
        this.mostrarToast('Producto eliminado del carrito');
    }

    vaciar() {
        this.items = [];
        this.guardar();
    }

    obtenerTotal() {
        return this.items.reduce((total, item) => total + ((item.precio || 0) * item.cantidad), 0);
    }

    obtenerCantidadTotal() {
        return this.items.reduce((acc, item) => acc + item.cantidad, 0);
    }

    updateBadge() {
        const badgeEls = document.querySelectorAll('.cart-count');
        const count = this.obtenerCantidadTotal();
        badgeEls.forEach(el => {
            el.textContent = count;
            if (count > 0) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    attachHeaderEvents() {
        document.querySelectorAll('.cart, .open-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.abrirModal();
            });
        });
    }

    abrirModal() {
        const modal = document.getElementById('cartModalDrawer');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderCartItems();
        }
    }

    cerrarModal() {
        const modal = document.getElementById('cartModalDrawer');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    renderCartModal() {
        if (document.getElementById('cartModalDrawer')) return;

        const modalHTML = `
            <div class="cart-drawer-backdrop" id="cartModalDrawer">
                <div class="cart-drawer-container">
                    <div class="cart-drawer-header">
                        <h3>🛒 Carrito de Compras</h3>
                        <button class="cart-drawer-close" id="closeCartBtn" aria-label="Cerrar carrito">&times;</button>
                    </div>

                    <div class="cart-drawer-body" id="cartItemsContainer">
                        <!-- Renderizado dinámico -->
                    </div>

                    <div class="cart-drawer-footer">
                        <div class="cart-total-row">
                            <span>Total estimado:</span>
                            <strong id="cartTotalValue">$0 ARS</strong>
                        </div>
                        <div class="cart-actions-row">
                            <button class="button button-secondary" id="emptyCartBtn">Vaciar</button>
                            <button class="button button-primary" id="checkoutBtn">Finalizar Compra</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('closeCartBtn').addEventListener('click', () => this.cerrarModal());
        document.getElementById('cartModalDrawer').addEventListener('click', (e) => {
            if (e.target === document.getElementById('cartModalDrawer')) {
                this.cerrarModal();
            }
        });

        document.getElementById('emptyCartBtn').addEventListener('click', () => {
            if (this.items.length === 0) return;
            if (confirm('¿Esta seguro que quiere vaciar todos los productos del carrito?')) {
                this.vaciar();
            }
        });

        document.getElementById('checkoutBtn').addEventListener('click', () => {
            if (this.items.length === 0) {
                alert('El carrito está vacío. ¡Agregá productos antes de finalizar la compra!');
                return;
            }
            alert('🎉 ¡Gracias por tu pedido en Mueblería Hermanos Jota! Nos pondremos en contacto desde Casa Taller para coordinar el envío.');
            this.vaciar();
            this.cerrarModal();
        });
    }

    renderCartItems() {
        const container = document.getElementById('cartItemsContainer');
        const totalEl = document.getElementById('cartTotalValue');
        if (!container || !totalEl) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="cart-empty-state">
                    <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🧺</span>
                    <p>Tu carrito está vacío</p>
                    <a href="productos.html" class="button button-secondary" style="margin-top: 1rem; display: inline-block;" onclick="window.carrito.cerrarModal()">Ver Catálogo</a>
                </div>
            `;
            totalEl.textContent = '$0 ARS';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item-card">
                <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.nombre}</h4>
                    <span class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString('es-AR')} ARS</span>
                    <div class="cart-qty-controls">
                        <button class="btn-qty btn-qty-minus" data-id="${item.id}">-</button>
                        <span class="qty-val">${item.cantidad}</span>
                        <button class="btn-qty btn-qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="btn-remove-cart" data-id="${item.id}" title="Eliminar">&times;</button>
            </div>
        `).join('');

        totalEl.textContent = `$${this.obtenerTotal().toLocaleString('es-AR')} ARS`;

        container.querySelectorAll('.btn-qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                this.modificarCantidad(id, -1);
            });
        });

        container.querySelectorAll('.btn-qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                this.modificarCantidad(id, 1);
            });
        });

        container.querySelectorAll('.btn-remove-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                this.eliminar(id);
            });
        });
    }

    mostrarToast(mensaje) {
        let toast = document.getElementById('globalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'globalToast';
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }
        toast.textContent = mensaje;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// Instancia global
window.carrito = new CarritoService();
