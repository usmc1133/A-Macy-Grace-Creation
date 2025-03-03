document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) {
        console.error("Element with ID 'cart-items' not found.");
        return; // Exit if the element is not found
    }

    const cartIcon = document.getElementById('cart-icon');
    const checkoutForm = document.getElementById('checkoutForm');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeModal = document.querySelector('.close');

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(event) {
        const productBox = event.target.closest('.product-box');
        const productImage = productBox.querySelector('.product-image').src;
        const productTitle = productBox.querySelector('.product-title').textContent;
        const productPrice = productBox.querySelector('.price').textContent;

        const cartItem = {
            image: productImage,
            title: productTitle,
            price: productPrice,
            quantity: 1
        };

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItemIndex = cartItems.findIndex(item => item.title === cartItem.title);

        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push(cartItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();
        updateCartIcon();
    }

    function updateCartDisplay() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItemsContainer.innerHTML = '';

        cartItems.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <h2 class="cart-item-title">${item.title}</h2>
                <span class="cart-item-price">${item.price}</span>
                <div class="quantity-control">
                    <button class="decrease-quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);

            cartItemElement.querySelector('.decrease-quantity').addEventListener('click', () => {
                updateQuantity(item.title, -1);
            });

            cartItemElement.querySelector('.increase-quantity').addEventListener('click', () => {
                updateQuantity(item.title, 1);
            });
        });

        updateTotalPrice();
    }

    function updateQuantity(title, change) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemIndex = cartItems.findIndex(item => item.title === title);

        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity += change;

            if (cartItems[itemIndex].quantity <= 0) {
                cartItems.splice(itemIndex, 1);
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartDisplay();
            updateCartIcon();
        }
    }

    function updateTotalPrice() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalPrice = cartItems.reduce((total, item) => {
            return total + parseFloat(item.price.replace('$', '')) * item.quantity;
        }, 0);

        const totalPriceElement = document.getElementById('total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        } else {
            console.error("Element with ID 'total-price' not found.");
        }
    }

    function updateCartIcon() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartIcon.setAttribute('data-count', totalItems);
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Order placed successfully!');
            localStorage.removeItem('cartItems');
            updateCartDisplay();
            updateCartIcon();
        });
    }

    updateCartDisplay();
    updateCartIcon();

    const openModalButtons = document.querySelectorAll('.open-modal');
    openModalButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productBox = event.target.closest('.product-box');
            const productImage = productBox.querySelector('.product-image');
            modal.style.display = 'block';
            modalImg.src = productImage.src;
            captionText.innerHTML = productImage.alt;
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});