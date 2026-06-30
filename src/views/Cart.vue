<script setup>
import { onMounted, inject, ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import api from '@/api/axios';
import { useRouter } from 'vue-router';
import { getImageUrl } from '@/utils/image';
import { useI18n } from 'vue-i18n';

const cartStore = useCartStore();
const router = useRouter();
const showToast = inject('showToast');
const { t } = useI18n();

const address = ref('');

const formatPrice = (value) => Number(value || 0).toFixed(2);

const sizePrices = (item) => {
    const prices = item.product?.size_prices;
    if (!prices) return {};
    if (typeof prices === 'string') {
        try {
            return JSON.parse(prices);
        } catch {
            return {};
        }
    }

    return prices;
};

const itemPrice = (item) => {
    if (!item.product) return 0;
    
    if (item.product.price_s !== undefined) {
        const _sp = {
            S: Number(item.product.price_s ?? 0),
            M: Number(item.product.price_m ?? 0),
            L: Number(item.product.price_l ?? 0),
        };
        const sizeKey = item.size ?? 'S';
        return _sp[sizeKey];
    }
    
    return item.price ?? sizePrices(item)[item.size] ?? item.product?.price ?? 0;
};

onMounted(async () => {
    await cartStore.fetchCart();
});

const removeFromCart = async (id) => {
    await cartStore.removeFromCart(id);
};

const checkout = async () => {
    if (!address.value) {
        showToast(t('toast.addressRequired'));
        return;
    }

    try {
        await api.post('/orders', { address: address.value });
        cartStore.clearCart();
        showToast(t('toast.orderSuccess'));
        router.push('/orders');
    } catch (err) {
        showToast(err.response?.data?.message || t('toast.orderFailed'));
    }
};
</script>

<template>
  <div class="container animate-fade-in">
    <div class="cart-header">
      <h1>{{ $t('cart.header') }} <span class="gradient-text">{{ $t('cart.headerGradient') }}</span></h1>
      <p>{{ $t('cart.subtitle') }}</p>
    </div>

    <div v-if="cartStore.loading" class="loader">{{ $t('cart.loading') }}</div>
    
    <div v-else-if="cartStore.items.length === 0" class="empty-cart glass">
      <div class="empty-icon">🛒</div>
      <h3>{{ $t('cart.empty') }}</h3>
      <p>{{ $t('cart.emptyDesc') }}</p>
      <RouterLink to="/" class="btn btn-primary">{{ $t('cart.startShopping') }}</RouterLink>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item glass">
          <div class="item-img">
            <img :src="getImageUrl(item.product.image || item.product.image_url)" :alt="item.product.name">
          </div>
          <div class="item-details">
            <div class="item-info">
              <RouterLink :to="{ name: 'product-detail', params: { id: item.product_id || item.product.id } }">
                <h4>{{ item.product.name }}</h4>
              </RouterLink>
              <p class="item-price">${{ formatPrice(itemPrice(item)) }}</p>
              <p v-if="item.size" class="item-size">{{ $t('cart.size') }}: {{ item.size }}</p>
            </div>
            <div class="item-actions">
              <span class="qty">{{ $t('cart.qty') }}: {{ item.quantity }}</span>
              <button @click="removeFromCart(item.id)" class="btn-remove">{{ $t('cart.remove') }}</button>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-summary glass">
        <h3>{{ $t('cart.orderSummary') }}</h3>
        <div class="summary-row">
          <span>{{ $t('cart.subtotal') }}</span>
          <span>${{ cartStore.cartTotal }}</span>
        </div>
        <div class="summary-row">
          <span>{{ $t('cart.shipping') }}</span>
          <span class="free">{{ $t('cart.free') }}</span>
        </div>
        <div class="summary-row total">
          <span>{{ $t('cart.total') }}</span>
          <span>${{ cartStore.cartTotal }}</span>
        </div>

        <div class="shipping-address">
          <label>{{ $t('cart.shippingAddress') }}</label>
          <textarea 
            v-model="address" 
            :placeholder="$t('cart.addressPlaceholder')"
            class="address-input glass"
          ></textarea>
        </div>

        <button @click="checkout" class="btn btn-primary w-full">{{ $t('cart.checkout') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-header {
  margin-bottom: 3rem;
  text-align: center;
}

.cart-header h1 {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 350px);
  gap: 2rem;
  align-items: start;
}

.cart-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  transition: transform 0.2s;
}

.cart-item:hover {
  transform: scale(1.01);
}

.item-img {
  width: 100px;
  height: 100px;
  flex: 0 0 100px;
  border-radius: 12px;
  overflow: hidden;
  background: #f1f5f9;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.item-info h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  overflow-wrap: anywhere;
}

.item-price {
  font-weight: 700;
  color: var(--primary);
}

.item-size {
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 0.25rem;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.qty {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.btn-remove {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
}

.cart-summary {
  padding: 2rem;
  border-radius: 20px;
  position: sticky;
  top: 100px;
}

.cart-summary h3 {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-muted);
}

.summary-row.total {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  color: var(--text-main);
  font-weight: 800;
  font-size: 1.25rem;
}

.free {
  color: #10b981;
  font-weight: 700;
}

.w-full {
  width: 100%;
}

.shipping-address {
  margin-top: 2rem;
}

.shipping-address label {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
  color: var(--text-main);
}

.address-input {
  width: 100%;
  height: 100px;
  border-radius: 12px;
  padding: 1rem;
  font-family: inherit;
  font-size: 0.9rem;
  resize: none;
  outline: none;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s;
}

.address-input:focus {
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.empty-cart {
  text-align: center;
  padding: 5rem;
  border-radius: 30px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.empty-cart h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 600px) {
  .cart-header {
    margin-bottom: 2rem;
  }

  .cart-item {
    gap: 1rem;
    padding: 1rem;
    border-radius: 16px;
  }

  .item-img {
    width: 82px;
    height: 82px;
    flex-basis: 82px;
  }

  .item-details {
    flex-direction: column;
  }

  .item-actions {
    flex-direction: row;
    align-items: center;
  }

  .cart-summary {
    padding: 1.25rem;
  }

  .empty-cart {
    padding: 3rem 1rem;
  }
}

@media (max-width: 380px) {
  .cart-item {
    flex-direction: column;
  }

  .item-img {
    width: 100%;
    height: 170px;
    flex-basis: auto;
  }
}
</style>
