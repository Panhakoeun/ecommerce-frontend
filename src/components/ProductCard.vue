<script setup>
import { RouterLink } from 'vue-router';
import { getImageUrl } from '@/utils/image';

defineProps({
    product: {
        type: Object,
        required: true
    }
});

defineEmits(['add-to-cart']);
</script>

<template>
  <div class="product-card glass smooth-gpu">
    <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }">
      <div class="product-image">
        <img :src="getImageUrl(product.image || product.image_url)" :alt="product.name" loading="lazy">
      </div>
    </RouterLink>
    <div class="product-info">
      <span class="category-tag">{{ product.category?.name }}</span>
      <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }">
        <h4>{{ product.name }}</h4>
      </RouterLink>
      <p class="description">{{ product.description?.substring(0, 60) }}...</p>
      <div class="product-footer">
        <span class="price">${{ product.price }}</span>
        <button @click="$emit('add-to-cart', product)" class="btn-add">
          <span class="plus">+</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border-radius: 28px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: rgba(99, 102, 241, 0.4);
}

.product-image {
  height: 250px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1rem;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-info {
  padding: 1.8rem;
  background: rgba(255, 255, 255, 0.4);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.category-tag {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 1.5px;
  margin-bottom: 0.5rem;
  display: block;
}

.product-info h4 {
  font-size: 1.3rem;
  margin: 0.5rem 0;
  font-weight: 800;
  line-height: 1.2;
}

.description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: 900;
  font-size: 1.5rem;
  color: var(--text-main);
  letter-spacing: -0.5px;
}

.btn-add {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  transition: all 0.3s;
}

.btn-add:hover {
  transform: rotate(90deg) scale(1.1);
  background: var(--primary-hover);
}
</style>
