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
      <h1>{{ $t('orders.header') }} <span class="gradient-text">{{ $t('orders.headerGradient') }}</span></h1>
      <p>{{ $t('orders.subtitle') }}</p>
    </div>

    <div v-if="loading" class="loader">{{ $t('orders.loading') }}</div>

    <div v-else-if="orders.length === 0" class="empty-orders glass">
      <div class="empty-icon">📦</div>
      <h3>{{ $t('orders.empty') }}</h3>
      <p>{{ $t('orders.emptyDesc') }}</p>
      <RouterLink to="/" class="btn btn-primary">{{ $t('orders.discover') }}</RouterLink>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card glass">
        <div class="order-info">
          <div class="order-meta">
            <span class="order-id">{{ $t('orders.orderId') }} #{{ order.id }}</span>
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
              <RouterLink :to="{ name: 'product-detail', params: { id: item.product_id } }">
                <span class="item-name">{{ item.product.name }}</span>
              </RouterLink>
              <span class="item-qty">x{{ item.quantity }}</span>
            </div>
            <span class="item-price">${{ item.price }}</span>
          </div>
        </div>

        <div class="order-footer">
          <div class="shipping-info">
            <span class="label">{{ $t('orders.shippingTo') }}</span>
            <span class="address">{{ order.address }}</span>
          </div>
          <div class="total-info">
            <span>{{ $t('orders.totalAmount') }}</span>
            <span class="order-total">${{ order.total }}</span>
            <RouterLink
              v-if="order.status?.toLowerCase() === 'completed'"
              :to="{ name: 'order-receipt', params: { id: order.id } }"
              class="btn-receipt"
            >
              🧾 {{ $t('orders.viewReceipt') }}
            </RouterLink>
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
  font-size: clamp(2rem, 5vw, 2.5rem);
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
  gap: 1.5rem;
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

.btn-receipt {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.6rem;
  padding: 0.45rem 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), #a855f7);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 3px 12px rgba(99, 102, 241, 0.3);
}

.btn-receipt:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
}

.empty-orders {
  text-align: center;
  padding: 5rem;
  border-radius: 30px;
}

@media (max-width: 640px) {
  .orders-header {
    margin-bottom: 2rem;
  }

  .order-card {
    padding: 1.25rem;
    border-radius: 18px;
  }

  .order-info,
  .order-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .shipping-info {
    max-width: 100%;
  }

  .total-info {
    align-items: flex-start;
    width: 100%;
  }

  .btn-receipt {
    width: 100%;
    justify-content: center;
  }

  .order-item {
    align-items: flex-start;
  }

  .item-price {
    white-space: nowrap;
  }

  .empty-orders {
    padding: 3rem 1rem;
  }
}

@media (max-width: 380px) {
  .order-item {
    flex-wrap: wrap;
  }

  .item-price {
    width: 100%;
    padding-left: 66px;
  }
}
</style>
