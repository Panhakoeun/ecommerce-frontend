<script setup>
import { onMounted, ref, inject } from 'vue';
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

onMounted(async () => {
    product.value = await productStore.getProduct(route.params.id);
    await productStore.fetchProducts(); // For related products
    loading.value = false;
});

const addToCart = async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }
    const success = await cartStore.addToCart(product.value.id, quantity.value);
    if (success) {
        showToast(`${product.value.name} added to cart!`);
        router.push('/cart');
    }
};
</script>

<template>
  <div class="container animate-fade-in">
    <div v-if="loading" class="loader">Loading product details...</div>
    
    <div v-else-if="!product" class="error-state">
      <h2>Product not found</h2>
      <RouterLink to="/" class="btn btn-primary">Back to Shop</RouterLink>
    </div>

    <div v-else class="product-detail-grid">
      <div class="product-gallery glass">
        <img :src="getImageUrl(product.image || product.image_url)" :alt="product.name">
      </div>

      <div class="product-info-panel">
        <nav class="breadcrumb">
          <RouterLink to="/">Shop</RouterLink> / {{ product.category?.name }}
        </nav>
        
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-price">${{ product.price }}</p>
        
        <div class="product-description">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
        </div>

        <div class="purchase-actions glass">
          <div class="quantity-selector">
            <button @click="quantity > 1 && quantity--" class="qty-btn">-</button>
            <input type="number" v-model="quantity" min="1">
            <button @click="quantity++" class="qty-btn">+</button>
          </div>
          <button @click="addToCart" class="btn btn-primary btn-lg">Add to Cart</button>
        </div>

        <div class="product-features">
          <div class="feature">
            <span class="icon">🚚</span>
            <div>
              <strong>Free Shipping</strong>
              <p>On all orders over $100</p>
            </div>
          </div>
          <div class="feature">
            <span class="icon">🛡️</span>
            <div>
              <strong>2 Year Warranty</strong>
              <p>Quality guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <section class="related-products animate-fade-in" v-if="productStore.products.length > 0">
      <h2 class="section-title">You May Also <span class="gradient-text">Like</span></h2>
      <div class="related-grid">
        <div v-for="rel in productStore.products.slice(0, 4)" :key="rel.id" class="rel-card glass">
            <RouterLink :to="{ name: 'product-detail', params: { id: rel.id } }">
                <img :src="getImageUrl(rel.image || rel.image_url)" alt="">
                <h4>{{ rel.name }}</h4>
                <p>${{ rel.price }}</p>
            </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 2rem;
  margin: 6rem 0 2rem 0;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

.rel-card {
  padding: 1.5rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s;
}

.rel-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.rel-card img {
  width: 100%;
  height: 150px;
  object-fit: contain;
  margin-bottom: 1rem;
}

.rel-card h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.rel-card p {
  color: var(--primary);
  font-weight: 700;
}
.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 2rem;
}

.product-gallery {
  border-radius: 30px;
  overflow: hidden;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.product-gallery img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.breadcrumb {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.product-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.product-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 2rem;
}

.product-description {
  margin-bottom: 3rem;
}

.product-description h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.product-description p {
  color: var(--text-muted);
  line-height: 1.8;
}

.purchase-actions {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 20px;
  align-items: center;
  margin-bottom: 3rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 0.5rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.quantity-selector input {
  width: 50px;
  text-align: center;
  border: none;
  background: transparent;
  font-weight: 700;
  outline: none;
}

.btn-lg {
  flex: 1;
  height: 56px;
  font-size: 1.1rem;
}

.product-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.feature {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.feature .icon {
  font-size: 1.5rem;
}

.feature strong {
  display: block;
  font-size: 0.9rem;
}

.feature p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .product-detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-gallery {
    height: 400px;
  }
}
</style>
