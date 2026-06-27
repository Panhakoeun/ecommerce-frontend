<script setup>
import { computed, onMounted, ref, inject, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { getImageUrl } from '@/utils/image';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const showToast = inject('showToast');

const product = ref(null);
const loading = ref(true);
const quantity = ref(1);
const sizes = ['S', 'M', 'L'];
const selectedSize = ref('S');

const formatPrice = (value) => Number(value || 0).toFixed(2);
const selectedPrice = computed(() => product.value?.size_prices?.[selectedSize.value] ?? product.value?.price ?? 0);

const loadProductData = async (id) => {
    loading.value = true;
    product.value = await productStore.getProduct(id);
    selectedSize.value = 'S';
    quantity.value = 1;
    if (product.value) {
        // Fetch related products (e.g. same category)
        if (product.value.category_id) {
            await productStore.fetchProducts({ category_id: product.value.category_id });
        } else {
            await productStore.fetchProducts();
        }
    }
    loading.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    loadProductData(route.params.id);
});

// Important: watch for route changes to allow clicking related products
watch(() => route.params.id, (newId) => {
    if (newId) {
        loadProductData(newId);
    }
});

const addToCart = async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }
    const success = await cartStore.addToCart(product.value.id, quantity.value, selectedSize.value);
    if (success) {
        showToast(`${product.value.name} (${selectedSize.value}) added to cart!`);
    }
};

const goBack = () => {
    router.back();
};
</script>

<template>
  <div class="container product-page">
    <div v-if="loading" class="loader-layout animate-fade-in">
        <div class="skeleton-gallery glass"></div>
        <div class="skeleton-content">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line price"></div>
            <div class="skeleton-line desc"></div>
            <div class="skeleton-line desc"></div>
            <div class="skeleton-line action"></div>
        </div>
    </div>
    
    <div v-else-if="!product" class="error-state glass animate-fade-in">
      <div class="error-icon">❌</div>
      <h2>Oops! Product not found</h2>
      <p>The product you are looking for might have been removed or the link is broken.</p>
      <RouterLink to="/" class="btn btn-primary">Back to Shop</RouterLink>
    </div>

    <div v-else class="product-detail-layout">
      <!-- Back Button -->
      <button @click="goBack" class="back-btn glass">
        <span>←</span> Back
      </button>

      <div class="product-grid-main">
        <!-- Image Gallery section -->
        <div class="product-gallery-container animate-fade-in">
            <div class="product-gallery glass-premium smooth-gpu">
                <div class="badge-tag">{{ product.category?.name || 'Product' }}</div>
                <img :src="getImageUrl(product.image || product.image_url)" :alt="product.name">
            </div>
        </div>

        <!-- Info section -->
        <div class="product-info-panel animate-fade-in">
            <div class="breadcrumb">
                <RouterLink to="/">Shop</RouterLink> 
                <span class="separator">/</span> 
                <span class="active">{{ product.category?.name }}</span>
            </div>
            
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="pricing-badge">
                <span class="currency">$</span>
                <span class="amount">{{ formatPrice(selectedPrice) }}</span>
            </div>
            
            <div class="product-meta">
                <div class="meta-item" :class="{ warning: product.stock <= product.low_stock_threshold }">
                    <span class="icon">📦</span>
                    <span>{{ product.stock > 0 ? `${product.stock} in stock` : 'Sold out' }}</span>
                </div>
                <div class="meta-item">
                    <span class="icon">⭐</span>
                    <span>4.8 (120 reviews)</span>
                </div>
            </div>

            <div class="product-description glass">
                <h3>Description</h3>
                <p>{{ product.description }}</p>
            </div>

            <div v-if="product.size_prices" class="size-price-panel glass">
                <h3>Choose Size</h3>
                <div class="size-price-grid">
                    <button
                        v-for="size in sizes"
                        :key="size"
                        type="button"
                        class="size-price-item"
                        :class="{ active: selectedSize === size }"
                        @click="selectedSize = size"
                    >
                        <span class="size-label">{{ size }}</span>
                        <strong>${{ formatPrice(product.size_prices[size]) }}</strong>
                    </button>
                </div>
            </div>

            <div class="purchase-box glass-premium">
                <div class="controls-row">
                    <div class="quantity-selector glass">
                        <button @click="quantity > 1 && quantity--" class="qty-btn" aria-label="Decrease quantity">−</button>
                        <input type="number" v-model="quantity" min="1" readonly>
                        <button @click="quantity++" class="qty-btn" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button @click="addToCart" class="btn btn-primary btn-lg" :disabled="cartStore.loading || product.stock <= 0">
                    <span v-if="!cartStore.loading">Add to Cart</span>
                    <span v-else>Adding...</span>
                </button>
            </div>

            <div class="product-perks">
                <div class="perk">
                    <div class="perk-icon">💎</div>
                    <div class="perk-content">
                        <strong>Premium Quality</strong>
                        <p>Crafted with excellence</p>
                    </div>
                </div>
                <div class="perk">
                    <div class="perk-icon">⚡</div>
                    <div class="perk-content">
                        <strong>Fast Delivery</strong>
                        <p>2-3 business days</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <!-- Related Products -->
      <section class="related-section animate-fade-in" v-if="productStore.products.filter(p => p.id !== product.id).length > 0">
        <div class="section-header">
            <h2 class="section-title">Similar <span class="gradient-text">Products</span></h2>
            <div class="section-line"></div>
        </div>
        
        <div class="related-grid">
            <div v-for="rel in productStore.products.filter(p => p.id !== product.id).slice(0, 4)" :key="rel.id" class="rel-card glass smooth-gpu">
                <RouterLink :to="{ name: 'product-detail', params: { id: rel.id } }">
                    <div class="rel-img-wrapper">
                        <img :src="getImageUrl(rel.image || rel.image_url)" :alt="rel.name">
                    </div>
                    <h4>{{ rel.name }}</h4>
                    <p class="rel-price">${{ formatPrice(rel.price) }}</p>
                </RouterLink>
            </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.product-page {
    padding-bottom: 5rem;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    font-weight: 600;
    margin-bottom: 2rem;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.back-btn:hover {
    color: var(--primary);
    transform: translateX(-5px);
}

.product-detail-layout {
    max-width: 1200px;
    margin: 0 auto;
}

.product-grid-main {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
    gap: 3rem;
    align-items: start;
}

/* ── Gallery ──────────────────────────── */
.product-gallery-container {
    position: sticky;
    top: 130px;
}

.product-gallery {
    border-radius: 28px;
    overflow: hidden;
    min-height: 420px;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    position: relative;
    padding: 2rem;
}

.badge-tag {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    background: var(--primary);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    transform: rotate(-2deg);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.product-gallery img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;
}

.product-gallery:hover img {
    transform: scale(1.05);
}

/* ── Content ─────────────────────────── */
.breadcrumb {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.separator {
    opacity: 0.5;
}

.breadcrumb .active {
    color: var(--primary);
    font-weight: 700;
}

.product-title {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 900;
    margin-bottom: 1rem;
    line-height: 1.1;
    letter-spacing: 0;
    color: var(--text-main);
}

.pricing-badge {
    display: flex;
    align-items: flex-start;
    gap: 0.2rem;
    margin-bottom: 2rem;
    color: var(--primary);
}

.currency {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 0.5rem;
}

.amount {
    font-size: 3rem;
    font-weight: 900;
}

.product-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 2.5rem;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-muted);
}

.meta-item.warning {
    color: #be123c;
}

.meta-item .icon {
    font-size: 1.1rem;
}

.product-description {
    padding: 1.5rem;
    border-radius: 20px;
    margin-bottom: 2.5rem;
}

.product-description h3 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-main);
}

.product-description p {
    color: var(--text-muted);
    line-height: 1.8;
}

.size-price-panel {
    padding: 1.5rem;
    border-radius: 20px;
    margin-bottom: 2.5rem;
}

.size-price-panel h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-main);
}

.size-price-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
}

.size-price-item {
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 0.85rem;
    background: white;
    text-align: left;
}

.size-price-item:hover,
.size-price-item.active {
    border-color: var(--primary);
    background: rgba(99, 102, 241, 0.08);
    color: var(--primary);
}

.size-label {
    display: block;
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
}

/* ── Purchase Box ────────────────────── */
.purchase-box {
    padding: 2rem;
    border-radius: 24px;
    margin-bottom: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.quantity-selector {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    padding: 0.4rem;
    width: fit-content;
}

.qty-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 700;
    border-radius: 12px;
    transition: all 0.2s;
}

.qty-btn:hover {
    background: var(--primary);
    color: white;
}

.quantity-selector input {
    width: 60px;
    text-align: center;
    border: none;
    background: transparent;
    font-weight: 800;
    font-size: 1.1rem;
    outline: none;
    color: var(--text-main);
}

.btn-lg {
    width: 100%;
    height: 64px;
    font-size: 1.2rem;
    border-radius: 20px;
}

.btn-lg:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
}

/* ── Perks ──────────────────────────── */
.product-perks {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.perk {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.perk-icon {
    width: 48px;
    height: 48px;
    background: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: var(--shadow);
}

.perk-content strong {
    font-size: 0.85rem;
    display: block;
    color: var(--text-main);
}

.perk-content p {
    font-size: 0.75rem;
    color: var(--text-muted);
}

/* ── Related ─────────────────────────── */
.related-section {
    margin-top: 6rem;
}

.section-header {
    text-align: center;
    margin-bottom: 3rem;
}

.section-title {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
}

.section-line {
    width: 60px;
    height: 4px;
    background: var(--primary);
    margin: 0 auto;
    border-radius: 10px;
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2rem;
}

.rel-card {
    padding: 1.2rem;
    border-radius: 24px;
    text-align: center;
}

.rel-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
}

.rel-img-wrapper {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.2rem;
}

.rel-card img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.rel-card h4 {
    font-size: 1rem;
    margin-bottom: 0.4rem;
}

.rel-price {
    color: var(--primary);
    font-weight: 800;
}

/* ── Skeletons ────────────────────────── */
.loader-layout {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 4rem;
    margin-top: 2rem;
}

.skeleton-gallery {
    height: 600px;
    border-radius: 40px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.shimmer {
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-line {
    height: 20px;
    background: #e2e8f0;
    margin-bottom: 1rem;
    border-radius: 10px;
}

.skeleton-line.title { height: 60px; width: 80%; }
.skeleton-line.price { height: 40px; width: 40%; margin-bottom: 2rem; }
.skeleton-line.desc { height: 100px; }
.skeleton-line.action { height: 60px; margin-top: 2rem; }

/* ── Error State ─────────────────────── */
.error-state {
    text-align: center;
    padding: 5rem 2rem;
    border-radius: 40px;
    margin-top: 2rem;
}

.error-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
}

.error-state h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.error-state p {
    color: var(--text-muted);
    margin-bottom: 2rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

/* ── Responsive ──────────────────────── */
@media (max-width: 1024px) {
    .product-grid-main {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .loader-layout {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .product-gallery-container {
        position: static;
    }

    .product-gallery {
        min-height: auto;
        max-height: 520px;
        aspect-ratio: 4 / 3;
    }

    .related-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .product-page {
        padding-bottom: 3rem;
    }

    .back-btn {
        margin-bottom: 1.25rem;
    }

    .product-gallery {
        border-radius: 22px;
        padding: 1.25rem;
    }

    .badge-tag {
        top: 1rem;
        left: 1rem;
    }

    .pricing-badge,
    .product-meta,
    .product-description,
    .size-price-panel,
    .purchase-box {
        margin-bottom: 1.5rem;
    }

    .purchase-box,
    .product-description,
    .size-price-panel {
        padding: 1.25rem;
    }

    .related-section {
        margin-top: 3rem;
    }
}

@media (max-width: 480px) {
    .skeleton-gallery {
        height: 320px;
    }

    .skeleton-line.title {
        height: 44px;
        width: 100%;
    }

    .product-gallery {
        aspect-ratio: 1 / 1;
    }

    .product-meta {
        gap: 0.75rem 1.25rem;
    }

    .amount {
        font-size: 2.35rem;
    }

    .currency {
        font-size: 1.2rem;
    }

    .size-price-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.5rem;
    }

    .size-price-item {
        padding: 0.75rem 0.55rem;
        text-align: center;
    }

    .product-perks {
        grid-template-columns: 1fr;
    }

    .related-grid {
        grid-template-columns: 1fr;
    }

    .section-title {
        font-size: 1.7rem;
    }
}

@media (max-width: 360px) {
    .size-price-grid {
        grid-template-columns: 1fr;
    }
}
</style>
