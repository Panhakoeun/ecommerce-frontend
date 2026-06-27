<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { getImageUrl } from '@/utils/image';

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});

defineEmits(['add-to-cart']);

const sizes = ['S', 'M', 'L'];
const selectedSize = ref('S');

const formatPrice = (value) => Number(value || 0).toFixed(2);

const selectedPrice = computed(() => props.product.size_prices?.[selectedSize.value] ?? props.product.price);
</script>

<template>
  <div class="product-card glass smooth-gpu">
    <div class="image-wrapper">
      <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }">
        <div class="product-image">
          <img :src="getImageUrl(product.image || product.image_url)" :alt="product.name" loading="lazy">
        </div>
      </RouterLink>
      
      <!-- Quick View Toggle / Badge -->
      <div class="category-chip">{{ product.category?.name || 'New' }}</div>
      
      <!-- Hover Overlay -->
      <div class="card-overlay">
        <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }" class="btn-detail">
          View Details
        </RouterLink>
      </div>
    </div>

    <div class="product-info">
      <div class="title-row">
        <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }">
          <h4>{{ product.name }}</h4>
        </RouterLink>
      </div>
      
      <p class="description">{{ product.description?.substring(0, 50) }}...</p>

      <div v-if="product.size_prices" class="size-prices" aria-label="Choose product size">
        <button
          v-for="size in sizes"
          :key="size"
          type="button"
          class="size-pill"
          :class="{ active: selectedSize === size }"
          @click="selectedSize = size"
        >
          {{ size }} ${{ formatPrice(product.size_prices[size]) }}
        </button>
      </div>
      
      <div class="product-footer">
        <div class="price-box">
          <span class="from-label">From</span>
          <span class="currency">$</span>
          <span class="price-val">{{ formatPrice(selectedPrice) }}</span>
        </div>
        <span class="stock-badge" :class="{ low: product.stock <= product.low_stock_threshold }">
          {{ product.stock > 0 ? `${product.stock} left` : 'Sold out' }}
        </span>
        <button
          @click="$emit('add-to-cart', product, selectedSize)"
          class="btn-add"
          title="Add to cart"
          :disabled="product.stock <= 0"
        >
          <span class="btn-inner">
            <span class="plus">+</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background: rgba(255, 255, 255, 0.5);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary);
  background: white;
}

/* ── Image Section ───────────────────── */
.image-wrapper {
  position: relative;
  height: clamp(210px, 24vw, 280px);
  background: white;
  margin: 0.75rem;
  border-radius: 20px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.category-chip {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  color: var(--text-main);
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Hover Overlay ───────────────────── */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
}

.product-card:hover .card-overlay {
  opacity: 1;
}

.btn-detail {
  background: white;
  color: var(--text-main);
  padding: 0.75rem 1.5rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.9rem;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.product-card:hover .btn-detail {
  transform: translateY(0);
}

.btn-detail:hover {
  background: var(--primary);
  color: white;
}

/* ── Info Section ────────────────────── */
.product-info {
  padding: 0 1.75rem 1.75rem 1.75rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.title-row h4 {
  font-size: 1.25rem;
  margin: 0.5rem 0;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text-main);
  transition: color 0.3s;
}

.title-row h4:hover {
  color: var(--primary);
}

.description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.size-prices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.size-pill {
  background: rgba(99, 102, 241, 0.08);
  color: var(--primary);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.3rem 0.5rem;
}

.size-pill:hover,
.size-pill.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.price-box {
  display: flex;
  align-items: flex-start;
  gap: 1px;
  flex-wrap: wrap;
  min-width: 90px;
}

.from-label {
  width: 100%;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.currency {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary);
  margin-top: 0.2rem;
}

.price-val {
  font-weight: 900;
  font-size: 1.6rem;
  color: var(--text-main);
  letter-spacing: 0;
}

/* ── Add Button ──────────────────────── */
.stock-badge {
  color: #0f766e;
  background: #ccfbf1;
  border-radius: 999px;
  padding: 0.35rem 0.6rem;
  font-size: 0.72rem;
  font-weight: 800;
  white-space: nowrap;
}

.stock-badge.low {
  color: #be123c;
  background: #ffe4e6;
}

.btn-add {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25);
  border: none;
  padding: 0;
  flex: 0 0 auto;
}

.btn-add:hover {
  transform: scale(1.1) rotate(90deg);
  background: var(--primary-hover);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.35);
}

.btn-add:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  transform: none;
}

.plus {
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1;
}

/* ── Responsive ──────────────────────── */
@media (max-width: 480px) {
  .image-wrapper {
    height: 210px;
    margin: 0.6rem;
  }
  
  .product-info {
    padding: 0 1rem 1rem 1rem;
  }

  .title-row h4 {
    font-size: 1.1rem;
  }

  .size-prices {
    gap: 0.35rem;
  }

  .size-pill {
    flex: 1 1 calc(33.333% - 0.35rem);
    min-width: 0;
    padding: 0.45rem 0.25rem;
    text-align: center;
  }

  .product-footer {
    align-items: flex-end;
  }

  .stock-badge {
    order: 3;
    width: 100%;
    text-align: center;
  }

  .btn-add {
    width: 48px;
    height: 48px;
    border-radius: 16px;
  }
}

@media (max-width: 360px) {
  .product-footer {
    gap: 0.5rem;
  }

  .price-val {
    font-size: 1.35rem;
  }
}
</style>
