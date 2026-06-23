<script setup>
import { onMounted, ref } from 'vue';
import api from '@/api/axios';
import { getImageUrl } from '@/utils/image';

const orders = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await api.get('/orders');
        orders.value = response.data;
    } catch (err) {
        console.error('Failed to fetch orders');
    } finally {
        loading.value = false;
    }
});

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>

<template>
  <div class="container animate-fade-in">
    <div class="orders-header">
      <h1>My <span class="gradient-text">Orders</span></h1>
      <p>Tracking your shopping history</p>
    </div>

    <div v-if="loading" class="loader">Loading orders...</div>

    <div v-else-if="orders.length === 0" class="empty-orders glass">
      <div class="empty-icon">📦</div>
      <h3>No orders yet</h3>
      <p>Your history will appear here once you make a purchase.</p>
      <RouterLink to="/" class="btn btn-primary">Discover Products</RouterLink>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card glass">
        <div class="order-info">
          <div class="order-meta">
            <span class="order-id">Order #{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="order-status" :class="order.status.toLowerCase()">
            {{ order.status }}
          </div>
        </div>

        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <div class="item-thumb">
                <img :src="getImageUrl(item.product.image)" alt="">
            </div>
            <div class="item-meta">
              <span class="item-name">{{ item.product.name }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
            </div>
            <span class="item-price">${{ item.price }}</span>
          </div>
        </div>

        <div class="order-footer">
          <div class="shipping-info">
            <span class="label">Shipping to:</span>
            <span class="address">{{ order.address }}</span>
          </div>
          <div class="total-info">
            <span>Total Amount</span>
            <span class="order-total">${{ order.total }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-header {
  margin-bottom: 3rem;
  text-align: center;
}

.orders-header h1 {
  font-size: 2.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.orders-list {
  max-width: 800px;
  margin: 0 auto;
}

.order-card {
  padding: 2rem;
  border-radius: 24px;
  margin-bottom: 2rem;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.order-meta {
  display: flex;
  flex-direction: column;
}

.order-id {
  font-weight: 800;
  font-size: 1.1rem;
}

.order-date {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #f1f5f9;
}

.order-status.completed { background: #dcfce7; color: #15803d; }
.order-status.pending { background: #fef9c3; color: #a16207; }

.order-items {
  margin-bottom: 2rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.item-thumb {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
    background: #f1f5f9;
}

.item-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
}

.item-qty {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.item-price {
  font-weight: 700;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-width: 60%;
}

.shipping-info .label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.shipping-info .address {
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
}

.total-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.order-total {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
}

.empty-orders {
  text-align: center;
  padding: 5rem;
  border-radius: 30px;
}
</style>
