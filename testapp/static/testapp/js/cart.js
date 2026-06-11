// ═══════════════════════════════════════════════════════════════
// Aura Café — Interactive Cart & UI Engine v2.0
// Toast notifications, badge bounce, button feedback, 
// smooth animations, and checkout page integration.
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
    
    // UI Elements
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalVal = document.getElementById('cart-total-val');
    const cartBadge = document.getElementById('cart-count-badge') || document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const toastContainer = document.getElementById('toast-container');
    
    // Initialize Cart display
    updateCartUI();
    
    // Toggle Cart Drawer
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', openCart);
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    // Close drawer on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
        }
    });
    
    function openCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('open');
        }
    }
    
    function closeCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('open');
        }
    }
    
    // ── Toast Notification System ────────────────────────────
    function showToast(itemName) {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-icon">✓</span>
            <span class="toast-message"><strong>${itemName}</strong> added to your order</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-dismiss after 2.5 seconds
        setTimeout(() => {
            toast.classList.add('out');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
    
    // ── Badge Bounce Animation ───────────────────────────────
    function triggerBadgeBounce() {
        if (cartBadge) {
            cartBadge.classList.remove('bounce');
            // Trigger reflow to restart animation
            void cartBadge.offsetHeight;
            cartBadge.classList.add('bounce');
        }
    }
    
    // ── "Added!" Button Feedback ─────────────────────────────
    function triggerButtonFeedback(btn) {
        const textEl = btn.querySelector('.btn-text');
        const iconEl = btn.querySelector('.btn-icon');
        const originalText = textEl ? textEl.textContent : 'Add to Order';
        
        btn.classList.add('added');
        if (textEl) textEl.textContent = '✓ Added!';
        if (iconEl) iconEl.style.display = 'none';
        
        setTimeout(() => {
            btn.classList.remove('added');
            if (textEl) textEl.textContent = originalText;
            if (iconEl) iconEl.style.display = 'flex';
        }, 1200);
    }
    
    // ── Ripple Effect ────────────────────────────────────────
    function createRipple(event, btn) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    // ── Add to Cart Handlers ─────────────────────────────────
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const imageUrl = btn.getAttribute('data-image');
            
            // Ripple + feedback + toast
            createRipple(e, btn);
            triggerButtonFeedback(btn);
            
            addItem(id, name, price, imageUrl);
            showToast(name);
            triggerBadgeBounce();
            
            // Open cart drawer after a brief delay
            setTimeout(() => openCart(), 400);
        });
    });
    
    // ── Cart Manipulation ────────────────────────────────────
    function addItem(id, name, price, imageUrl) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                imageUrl,
                quantity: 1
            });
        }
        saveCart();
        updateCartUI();
    }
    
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }
    
    function updateQuantity(id, amount) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += amount;
            if (item.quantity <= 0) {
                removeItem(id);
            } else {
                saveCart();
                updateCartUI();
            }
        }
    }
    
    function saveCart() {
        localStorage.setItem('aura_cart', JSON.stringify(cart));
    }
    
    function updateCartUI() {
        // Update Cart Badge count
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItemsCount;
        }
        
        // Render Cart items list in Drawer
        if (cartItemsList) {
            cartItemsList.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsList.innerHTML = `<div class="empty-cart-message">
                    <div class="empty-cart-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                            <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                    </div>
                    <p style="font-weight: 600; margin-bottom: 6px;">Your cart is empty</p>
                    <p style="font-size: 14px;">Explore our menu and add some goodies!</p>
                </div>`;
                if (checkoutBtn) {
                    checkoutBtn.style.display = 'none';
                }
            } else {
                cart.forEach(item => {
                    const itemRow = document.createElement('div');
                    itemRow.className = 'cart-item';
                    itemRow.innerHTML = `
                        <img src="${item.imageUrl || '/static/testapp/images/cappuccino.png'}" class="cart-item-img" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="qty-btn minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button class="qty-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                            </div>
                            <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove ${item.name}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    `;
                    cartItemsList.appendChild(itemRow);
                });
                
                // Add event listeners to quantity buttons in drawer
                cartItemsList.querySelectorAll('.qty-btn.minus').forEach(btn => {
                    btn.addEventListener('click', () => {
                        updateQuantity(btn.getAttribute('data-id'), -1);
                        triggerBadgeBounce();
                    });
                });
                
                cartItemsList.querySelectorAll('.qty-btn.plus').forEach(btn => {
                    btn.addEventListener('click', () => {
                        updateQuantity(btn.getAttribute('data-id'), 1);
                        triggerBadgeBounce();
                    });
                });
                
                cartItemsList.querySelectorAll('.remove-item-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Animate removal
                        const itemRow = btn.closest('.cart-item');
                        if (itemRow) {
                            itemRow.classList.add('removing');
                            setTimeout(() => {
                                removeItem(btn.getAttribute('data-id'));
                                triggerBadgeBounce();
                            }, 300);
                        } else {
                            removeItem(btn.getAttribute('data-id'));
                        }
                    });
                });
                
                if (checkoutBtn) {
                    checkoutBtn.style.display = 'block';
                }
            }
        }
        
        // Update Cart Drawer Total
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalVal) {
            cartTotalVal.textContent = `$${totalPrice.toFixed(2)}`;
        }
        
        // Setup checkout page elements if present
        setupCheckoutPage(cart, totalPrice);
    }
    
    function setupCheckoutPage(cartData, totalPrice) {
        const checkoutSummaryList = document.getElementById('checkout-summary-list');
        const checkoutTotalVal = document.getElementById('checkout-total-val');
        const cartDataInput = document.getElementById('cart-data-input');
        
        if (checkoutSummaryList) {
            checkoutSummaryList.innerHTML = '';
            
            if (cartData.length === 0) {
                checkoutSummaryList.innerHTML = '<li>No items in cart.</li>';
                const submitBtn = document.querySelector('.submit-order-btn');
                if (submitBtn) submitBtn.disabled = true;
            } else {
                cartData.forEach(item => {
                    const row = document.createElement('div');
                    row.className = 'summary-item-row';
                    row.innerHTML = `
                        <span>${item.quantity} x ${item.name}</span>
                        <span style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</span>
                    `;
                    checkoutSummaryList.appendChild(row);
                });
                
                const submitBtn = document.querySelector('.submit-order-btn');
                if (submitBtn) submitBtn.disabled = false;
            }
        }
        
        if (checkoutTotalVal) {
            checkoutTotalVal.textContent = `$${totalPrice.toFixed(2)}`;
        }
        
        if (cartDataInput) {
            cartDataInput.value = JSON.stringify(cartData);
        }
    }
    
    // Clear cart on successful order confirmation
    const successContainer = document.querySelector('.success-container');
    if (successContainer) {
        localStorage.removeItem('aura_cart');
    }
});
