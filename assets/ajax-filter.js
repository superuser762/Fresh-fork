class AjaxFilter {
    constructor() {
        this.filters = document.querySelectorAll('.filter-btn');
        this.filterSliders = document.querySelectorAll('.calorie-slider');
        this.init();
    }

    init() {
        this.filters.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        this.filterSliders.forEach(slider => {
            slider.addEventListener('change', () => this.applyFilters());
        });
    }

    handleFilterClick(e) {
        const btn = e.target;


        // Toggle active state
        btn.classList.toggle('active');

        // Apply all active filters
        this.applyFilters();
    }

    applyFilters() {
        const activeFilters = Array.from(this.filters)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.dataset.filter);

        const calorieValue = document.getElementById('calorie-slider') ? value || 500 :

            // Build query string
            const params = new URLSearchParams();
        activeFilters.forEach(filter => params.append('filter', filter));
        params.append('calories', calorieValue);

        // Fetch filtered products via AJAX
        fetch(`/collections/all?${params.toString()}`)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newProducts = doc.querySelector('.products-grid');

                if (newProducts) {
                    const grid = document.getElementById('products-grid');
                    grid.innerHTML = newProducts.innerHTML;
                    window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
                }
            })
            .catch(err => console.error('Filter error:', err));
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => new AjaxFilter());