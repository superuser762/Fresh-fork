class ProductSearch {
  constructor() {
    this.searchInput = document.querySelector('.search-input');
    this.searchResults = document.querySelector('.search-results');
    this.minChars = 2;
    this.debounceTimer = null;
    this.init();
  }

  init() {
    if (!this.searchInput) return;

    this.searchInput.addEventListener('input', (e) => {
      this.debounceSearch(e.target.value);
    });

    // Close results on blur
    this.searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (this.searchResults) this.searchResults.style.display = 'none';
      }, 200);
    });

    this.searchInput.addEventListener('focus', () => {
      if (this.searchInput.value.length >= this.minChars && this.searchResults) {
        this.searchResults.style.display = 'block';
      }
    });
  }

  debounceSearch(query) {
    clearTimeout(this.debounceTimer);

    if (query.length < this.minChars) {
      if (this.searchResults) this.searchResults.style.display = 'none';
      return;
    }

    // Start timer for 150ms debounce
    this.debounceTimer = setTimeout(() => {
      this.performSearch(query);
    }, 150);
  }

  performSearch(query) {
    const startTime = performance.now();

    // Use Shopify's search endpoint
    fetch(`/search?type=product&q=${encodeURIComponent(query)}&view=json`)
      .then(response => response.json())
      .then(data => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`Search completed in ${duration.toFixed(0)}ms`);

        if (duration <= 250) {
          this.displayResults(data.results);
        } else {
          console.warn('Search exceeded 250ms threshold');
        }
      })
      .catch(err => console.error('Search error:', err));
  }

  displayResults(results) {
    if (!this.searchResults) return;

    // Limit to 8 results
    const limited = results.slice(0, 8);

    if (limited.length === 0) {
      this.searchResults.innerHTML = '<p class="no-results">No meals found</p>';
    } else {
      this.searchResults.innerHTML = limited.map(product => `
        <a href="${product.url}" class="search-result-item">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
          <div class="search-result-info">
            <h4>${product.title}</h4>
            <p class="price">${product.price}</p>
          </div>
        </a>
      `).join('');
    }

    this.searchResults.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => new ProductSearch());