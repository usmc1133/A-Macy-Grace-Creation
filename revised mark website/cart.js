// JavaScript for handling enhanced cart functionality

  // Initialize cart
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Function to add item to cart
  function addToCart(productName, price) {
      const item = cart.find(item => item.name === productName);
      if (item) {
          item.quantity += 1;
      } else {
          cart.push({ name: productName, price: price, quantity: 1 });
      }
      updateCart();
      
      // Add a visual feedback
      const notification = document.createElement('div');
      notification.className = 'add-to-cart-notification';
      notification.textContent = 'Item added to cart!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
          notification.remove();
      }, 2000);
  }

  // Function to update cart in local storage and UI
  function updateCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      // Add this line to update the cart icon
      if (typeof updateCartIcon === 'function') {
          updateCartIcon();
      }
  }

  // Function to render cart and update UI
  function renderCart() {
      const cartItemsContainer = document.querySelector('.cart-items');
      if (!cartItemsContainer) return; // Exit if not on cart page

      const totalQuantityElement = document.getElementById('total-quantity');
      const totalPriceElement = document.getElementById('total-price');

      cartItemsContainer.innerHTML = '';
      let totalQuantity = 0;
      let totalPrice = 0;

      if (cart.length === 0) {
          cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      } else {
          cart.forEach((item, index) => {
              const itemElement = document.createElement('div');
              itemElement.classList.add('cart-item');
              itemElement.innerHTML = `
                  <p>${item.name} - $${item.price} x 
                  <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
                  <button class="remove-item" data-index="${index}">Remove</button>
                  </p>
              `;
              cartItemsContainer.appendChild(itemElement);

              totalQuantity += item.quantity;
              totalPrice += item.price * item.quantity;
          });
      }

      if (totalQuantityElement) totalQuantityElement.innerText = totalQuantity;
      if (totalPriceElement) totalPriceElement.innerText = totalPrice.toFixed(2);

      setupEventListeners();
  }

  // Function to setup event listeners
  function setupEventListeners() {
      const cartItemsContainer = document.querySelector('.cart-items');
      if (!cartItemsContainer) return;

      document.querySelectorAll('.quantity-input').forEach(input => {
          input.addEventListener('change', event => {
              const index = event.target.dataset.index;
              const newQuantity = parseInt(event.target.value);
              if (isNaN(newQuantity) || newQuantity < 1) {
                  event.target.value = cart[index].quantity;
                  return;
              }
              cart[index].quantity = newQuantity;
              updateCart();
          });
      });

      document.querySelectorAll('.remove-item').forEach(button => {
          button.addEventListener('click', event => {
              const index = event.target.dataset.index;
              cart.splice(index, 1);
              updateCart();
          });
      });
  }

  // Initialize cart functionality
  document.addEventListener('DOMContentLoaded', () => {
      // Setup "Add to Cart" buttons
      document.querySelectorAll('.add-to-cart').forEach(button => {
          button.addEventListener('click', event => {
              const productCard = event.target.closest('.product-card');
              const productName = productCard.querySelector('h2').innerText;
              const price = parseFloat(productCard.querySelector('.price p').innerText.replace('$', ''));
              addToCart(productName, price);
          });
      });

      // Initial render
      renderCart();
  });
