<script setup>
import { onMounted, inject, ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import api from '@/api/axios';
import { useRouter } from 'vue-router';
import { getImageUrl } from '@/utils/image';

const cartStore = useCartStore();
const router = useRouter();
const showToast = inject('showToast');

const address = ref('');

onMounted(async () => {
    await cartStore.fetchCart();
});

const removeFromCart = async (id) => {
    await cartStore.removeFromCart(id);
};

const checkout = async () => {
    if (!address.value) {
        showToast('Please enter your shipping address');
        return;
    }

    try {
        await api.post('/orders', { address: address.value });
        cartStore.clearCart();
        showToast('Order placed successfully!');
        router.push('/orders');
    } catch (err) {
        showToast(err.response?.data?.message || 'Failed to place order');
    }
};
</script>

<template>
  <div class="container animate-fade-in">
    <div class="cart-header">
      <h1>Shopping <span class="gradient-text">Cart</span></h1>
      <p>Review your items and proceed to checkout</p>
    </div>

    <div v-if="cartStore.loading" class="loader">Loading cart...</div>
    
    <div v-else-if="cartStore.items.length === 0" class="empty-cart glass">
      <div class="empty-icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Looks like you haven't added anything yet.</p>
      <RouterLink to="/" class="btn btn-primary">Start Shopping</RouterLink>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item glass">
          <div class="item-img">
            <img :src="getImageUrl(item.product.image || item.product.image_url)" :alt="item.product.name">
          </div>
          <div class="item-details">
            <div class="item-info">
              <h4>{{ item.product.name }}</h4>
              <p class="item-price">${{ item.product.price }}</p>
            </div>
            <div class="item-actions">
              <span class="qty">Qty: {{ item.quantity }}</span>
              <button @click="removeFromCart(item.id)" class="btn-remove">Remove</button>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-summary glass">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${{ cartStore.cartTotal }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span class="free">FREE</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>${{ cartStore.cartTotal }}</span>
        </div>

        <div class="shipping-address">
          <label>Shipping Address</label>
          <textarea 
            v-model="address" 
            placeholder="Enter your full delivery address..."
            class="address-input glass"
          ></textarea>
        </div>

        <button @click="checkout" class="btn btn-primary w-full">Proceed to Checkout</button>
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
  font-size: 2.5rem;
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
  grid-template-columns: 1fr 350px;
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
}

.item-info h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.item-price {
  font-weight: 700;
  color: var(--primary);
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
}
</style>
