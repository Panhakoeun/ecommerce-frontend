<script setup>
import { onMounted, ref, inject } from 'vue';
import { useProductStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { useI18n } from 'vue-i18n';

const productStore = useProductStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const showToast = inject('showToast');
const { t } = useI18n();

const selectedCategory = ref(null);

onMounted(async () => {
    await productStore.fetchCategories();
    await productStore.fetchProducts();
});

const filterByCategory = async (categoryId) => {
    selectedCategory.value = categoryId;
    await productStore.fetchProducts(categoryId ? { category_id: categoryId } : {});
};

const addToCart = async (product, size = 'S') => {
    if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
    }
    const success = await cartStore.addToCart(product.id, 1, size);
    if (success) {
        showToast(t('toast.addedToCart', { product: product.name, size }));
    }
};

</script>

<template>
  <div class="container animate-fade-in">
    <section class="hero">
      <h1>{{ $t('home.welcome') }}<span class="gradient-text">{{ $t('home.toOur') }}</span> {{ $t('home.shop') }} </h1>
      <p>{{ $t('home.subtitle') }}</p>
    </section>

    <section class="category-tabs glass-premium smooth-gpu animate-fade-in">
      <div class="tabs-container">
        <button 
          :class="{ active: !selectedCategory }" 
          @click="filterByCategory(null)"
          class="tab-btn"
        >
          {{ $t('home.allCollections') }}
        </button>
        <button 
          v-for="cat in productStore.categories" 
          :key="cat.id"
          :class="{ active: selectedCategory === cat.id }"
          @click="filterByCategory(cat.id)"
          class="tab-btn"
        >
          {{ cat.name }}
        </button>
      </div>
    </section>

    <div class="shop-content">
      <div class="product-grid">
        <div v-if="productStore.loading" class="loader-container">
          <div class="skeleton-card" v-for="i in 8" :key="i"></div>
        </div>
        <div v-else-if="productStore.products.length === 0" class="empty-state">
          {{ $t('home.noProducts') }}
        </div>
        <transition-group name="list" tag="div" class="grid-container" v-else>
          <ProductCard 
            v-for="product in productStore.products" 
            :key="product.id" 
            :product="product"
            @add-to-cart="addToCart"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 5rem 0 4rem;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 60%);
  z-index: -1;
  will-change: transform;
}

.hero h1 {
  font-size: clamp(2.25rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  letter-spacing: 0;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary) 0%, #ec4899 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  color: var(--text-muted);
  font-size: clamp(1rem, 2.2vw, 1.4rem);
  max-width: 600px;
  margin: 0 auto;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .grid-container,
  .loader-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 0 2.5rem;
  }

  .category-tabs {
    max-width: 100%;
    top: 80px;
    margin-bottom: 2rem;
    justify-content: flex-start;
  }

  .tabs-container {
    gap: 0.3rem;
    width: 100%;
    scrollbar-width: none;
  }

  .tabs-container::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 2rem 0 2rem;
  }

  .category-tabs {
    border-radius: 16px;
    padding: 0.4rem;
    top: 76px;
  }

  .grid-container {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }

  .loader-container {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
  }
}

.shop-content {
  margin-top: 1rem;
}

.category-tabs {
  margin: 0 auto 3rem auto;
  padding: 0.5rem;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  max-width: fit-content;
  position: sticky;
  top: 100px;
  z-index: 100;
}

.tabs-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.2rem;
}

.tab-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 15px;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-muted);
  white-space: nowrap;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: var(--primary);
  background: rgba(99, 102, 241, 0.05);
}

.tab-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
  width: 100%;
}

.loader-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

.skeleton-card {
  height: 400px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 24px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* List animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}
</style>
