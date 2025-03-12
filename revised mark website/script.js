document.addEventListener('DOMContentLoaded', () => {
    // Menu button functionality
    const menuBtn = document.querySelector('.menu-btn');
    const navbarLinks = document.querySelector('.navbar_links');

    menuBtn.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });

    // Image modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    const enlargeBtns = document.querySelectorAll('.enlarge-image');

    enlargeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.product-card');
            const img = card.querySelector('.product-image img');
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Update cart icon count
    updateCartIcon();
});

// Function to update cart icon
function updateCartIcon() {
    const cartIcon = document.querySelector('.fa-cart-shopping');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add or update the count badge
    let badge = cartIcon.querySelector('.cart-count');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-count';
        cartIcon.appendChild(badge);
    }
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
}
