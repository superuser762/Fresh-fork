// PRODUCT.JS

(function() {
    function domReady(cb) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', cb);
        } else {
            cb();
        }
    }

    domReady(function() {
        initGallery();
        initQuantityButtons();
        initVariantSelects();
    });

    // Image gallery: click thumbnail → swap main image
    function initGallery() {
        const mainImage = document.getElementById('product-main-image') || document.getElementById('gallery-main-image');
        const thumbs = document.querySelectorAll('.product-thumbnail, .thumbnail');

        if (!mainImage || !thumbs.length) return;

        thumbs.forEach(function(thumb) {
            thumb.addEventListener('click', function() {
                const src = this.dataset.src || this.dataset.fullSrc || this.dataset.fullSrc;
                if (!src) return;

                mainImage.src = src;
                if (this.alt) mainImage.alt = this.alt;

                thumbs.forEach(function(t) { t.classList.remove('active'); });
                this.classList.add('active');
            });

            thumb.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Quantity +/- buttons on product page
    function initQuantityButtons() {
        const qtyInput = document.getElementById('quantity');
        if (!qtyInput) return;

        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');

        function clamp(val) {
            const min = Number.parseInt(qtyInput.min || '1', 10);
            const max = Number.parseInt(qtyInput.max || '999', 10);
            return Math.max(min, Math.min(max, val));
        }

        minusBtn && minusBtn.addEventListener('click', function(e) {
            e.preventDefault();
            qtyInput.value = clamp(Number.parseInt(qtyInput.value || '1', 10) - 1);
        });

        plusBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            qtyInput.value = clamp(Number.parseInt(qtyInput.value || '1', 10) + 1);
        });
    }

    // Variant dropdowns → update hidden variant ID and price (simple version)
    function initVariantSelects() {
        const form = document.querySelector('.product-form');
        if (!form) return;

        const variantIdInput = form.querySelector('input[name="id"]');
        const optionSelects = form.querySelectorAll('select[name^="options["]');

        // If you are not using multiple variants, you can skip this.
        if (!variantIdInput || !optionSelects.length || !window.productVariantsJson) return;

        const variants = window.productVariantsJson; // set this in product.liquid

        function getCurrentOptions() {
            const opts = [];
            optionSelects.forEach(function(sel) {
                opts.push(sel.value);
            });
            return opts;
        }

        function findVariantByOptions(options) {
            return variants.find(function(v) {
                return JSON.stringify(v.options) === JSON.stringify(options);
            });
        }

        function updateVariant() {
            const options = getCurrentOptions();
            const variant = findVariantByOptions(options);
            if (!variant) return;

            variantIdInput.value = variant.id;

            const priceEls = document.querySelectorAll('.current-price, .product-price .price, .product-price .sale-price');
            priceEls.forEach(function(el) {
                el.textContent = formatMoney(variant.price);
            });

            const compareEls = document.querySelectorAll('.original-price, .product-price .regular-price');
            compareEls.forEach(function(el) {
                if (variant.compare_at_price && variant.compare_at_price > variant.price) {
                    el.textContent = formatMoney(variant.compare_at_price);
                    el.style.display = '';
                } else {
                    el.style.display = 'none';
                }
            });
        }

        optionSelects.forEach(function(sel) {
            sel.addEventListener('change', updateVariant);
        });
    }

    // Simple money formatter using Shopify global if available
    function formatMoney(cents) {
        if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
            return Shopify.formatMoney(cents, Shopify.money_format);
        }
        return '$' + (cents / 100).toFixed(2);
    }
})();