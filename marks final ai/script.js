document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cartItemsContainer = document.getElementById('cart-items');
    const cartIcon = document.getElementById('cart-icon');
    const checkoutForm = document.getElementById('checkoutForm');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeModal = document.querySelector('.close');

    // Initialize event listeners
    initializeEventListeners();

    // Initial cart update
    updateCartDisplay();
    updateCartIcon();

    function initializeEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });

        // Modal buttons
        document.querySelectorAll('.open-modal').forEach(button => {
            button.addEventListener('click', openModal);
        });

        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', () => modal.style.display = 'none');
        }

        // Click outside modal to close
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Checkout form
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckout);
        }
    }

    function addToCart(event) {
        const productBox = event.target.closest('.product-box');
        const productData = {
            image: productBox.querySelector('.product-image').getAttribute('src'),
            title: productBox.querySelector('.product-title').textContent,
            price: productBox.querySelector('.price').textContent.replace('$', ''),
            quantity: 1
        };

        let cartItems = getCartItems();
        const existingItemIndex = cartItems.findIndex(item => 
            item.title === productData.title && 
            item.image === productData.image
        );

        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push(productData);
        }

        saveCartItems(cartItems);
        updateCartDisplay();
        updateCartIcon();
    }

    function updateQuantity(title, image, change) {
        let cartItems = getCartItems();
        const itemIndex = cartItems.findIndex(item => 
            item.title === title && 
            item.image === image
        );

        if (itemIndex !== -1) {
            const newQuantity = cartItems[itemIndex].quantity + change;
            if (newQuantity <= 0) {
                cartItems.splice(itemIndex, 1);
            } else {
                cartItems[itemIndex].quantity = newQuantity;
            }

            saveCartItems(cartItems);
            updateCartDisplay();
            updateCartIcon();
        }
    }

    function updateCartDisplay() {
        if (!cartItemsContainer) return;

        const cartItems = getCartItems();
        cartItemsContainer.innerHTML = '';

        cartItems.forEach((item) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <h2 class="cart-item-title">${item.title}</h2>
                <span class="cart-item-price">$${item.price}</span>
                <div class="quantity-control">
                    <button class="decrease-quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity">+</button>
                </div>
            `;

            const decreaseBtn = cartItemElement.querySelector('.decrease-quantity');
            const increaseBtn = cartItemElement.querySelector('.increase-quantity');

            decreaseBtn.addEventListener('click', () => updateQuantity(item.title, item.image, -1));
            increaseBtn.addEventListener('click', () => updateQuantity(item.title, item.image, 1));

            cartItemsContainer.appendChild(cartItemElement);
        });

        updateTotalPrice();
    }

    function updateCartIcon() {
        const cartItems = getCartItems();
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartIcon.setAttribute('data-count', totalItems);
    }

    function updateTotalPrice() {
        const totalPriceElement = document.getElementById('total-price');
        if (!totalPriceElement) return;

        const cartItems = getCartItems();
        const total = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price);
            return sum + (price * item.quantity);
        }, 0);

        totalPriceElement.textContent = total.toFixed(2);
    }

    function openModal(event) {
        const productBox = event.target.closest('.product-box');
        const productImage = productBox.querySelector('.product-image');
        
        modal.style.display = 'block';
        modalImg.src = productImage.src;
        captionText.innerHTML = productImage.alt;
    }

    function handleCheckout(event) {
        event.preventDefault();
        alert('Order placed successfully!');
        localStorage.removeItem('cartItems');
        updateCartDisplay();
        updateCartIcon();
    }

    // Helper functions
    function getCartItems() {
        return JSON.parse(localStorage.getItem('cartItems')) || [];
    }

    function saveCartItems(items) {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }
});
