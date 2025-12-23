// Mobile menu toggle
document.getElementById('mobile-nav-toggle')?.addEventListener('click', function() {
  const nav = document.querySelector('.header-nav');
  nav?.classList.toggle('active');
});

// Update cart count
function updateCartCount() {
  fetch('/cart.json')
    .then(response => response.json())
    .then(data => {
      const cartCount = document.getElementById('cart-count');
      if (cartCount) cartCount.textContent = data.item_count;
    });
}

// Handle form submissions
document.querySelectorAll('.product-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const response = await fetch('/cart/add.js', { method: 'POST', body: formData });
      if (response.ok) {
        updateCartCount();
        alert('Added to cart!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

// Calorie slider
const slider = document.getElementById('calorie-slider');
if (slider) {
  slider.addEventListener('input', function() {
    document.getElementById('calorie-value').textContent = this.value;
  });
}

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('input', debounce(function(e) {
    const query = e.target.value;
    if (query.length > 2) {
      performSearch(query);
    }
  }, 300));
}

function performSearch(query) {
  fetch(`/search?q=${encodeURIComponent(query)}&type=product`)
    .then(response => response.text())
    .then(html => {
      // Update search results
      console.log('Search results:', html);
    });
}

function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}