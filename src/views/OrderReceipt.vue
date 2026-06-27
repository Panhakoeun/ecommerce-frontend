<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import { getImageUrl } from '@/utils/image';

const route = useRoute();
const router = useRouter();

const order = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        const response = await api.get(`/orders/${route.params.id}`);
        order.value = response.data;

        // Guard: only allow completed orders
        if (order.value.status?.toLowerCase() !== 'completed') {
            router.push('/orders');
        }
    } catch (err) {
        error.value = 'Unable to load receipt. The order may not exist.';
    } finally {
        loading.value = false;
    }
});

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const subtotal = computed(() => {
    if (!order.value?.items) return 0;
    return order.value.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);
});

const printReceipt = () => window.print();
</script>

<template>
  <div class="receipt-page animate-fade-in">

    <div v-if="loading" class="loader-wrap">
      <div class="spinner"></div>
      <p>Loading receipt...</p>
    </div>

    <div v-else-if="error" class="error-wrap glass">
      <div class="error-icon">❌</div>
      <h3>{{ error }}</h3>
      <RouterLink to="/orders" class="btn btn-primary">Back to Orders</RouterLink>
    </div>

    <div v-else-if="order" class="receipt-wrapper">
      <!-- Actions bar (hidden on print) -->
      <div class="actions-bar no-print">
        <RouterLink to="/orders" class="btn btn-back">
          <span>←</span> Back to Orders
        </RouterLink>
        <button @click="printReceipt" class="btn btn-print">
          🖨️ Print Receipt
        </button>
      </div>

      <!-- Receipt Card -->
      <div class="receipt-card glass" id="receipt-content">

        <!-- Receipt Header -->
        <div class="receipt-header">
          <div class="brand-logo">
            <div class="logo-icon">🛍️</div>
            <div class="brand-name">ShopVue</div>
          </div>
          <div class="receipt-badge">
            <span class="checkmark">✓</span>
            <span>Order Completed</span>
          </div>
        </div>

        <!-- Thank You Banner -->
        <div class="thank-you-banner">
          <h1>Thank you for your purchase!</h1>
          <p>Your order has been successfully completed and delivered.</p>
        </div>

        <!-- Order Details -->
        <div class="receipt-meta">
          <div class="meta-item">
            <span class="meta-label">Receipt No.</span>
            <span class="meta-value">#{{ order.id }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Date</span>
            <span class="meta-value">{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Status</span>
            <span class="meta-value status-badge">{{ order.status }}</span>
          </div>
        </div>

        <div class="divider dashed"></div>

        <!-- Shipping Address -->
        <div class="section">
          <h3 class="section-title">📍 Delivered To</h3>
          <p class="address-text">{{ order.address }}</p>
        </div>

        <div class="divider"></div>

        <!-- Items Table -->
        <div class="section">
          <h3 class="section-title">🛒 Items Ordered</h3>
          <div class="items-table">
            <div class="table-header">
              <span>Product</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span>Subtotal</span>
            </div>
            <div
              v-for="item in order.items"
              :key="item.id"
              class="table-row"
            >
              <div class="product-cell">
                <div class="product-thumb">
                  <img :src="getImageUrl(item.product.image)" :alt="item.product.name" />
                </div>
                <span class="product-name">{{ item.product.name }}</span>
              </div>
              <span class="qty-cell">× {{ item.quantity }}</span>
              <span class="price-cell">${{ parseFloat(item.price).toFixed(2) }}</span>
              <span class="subtotal-cell">${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="divider dashed"></div>

        <!-- Totals -->
        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${{ subtotal }}</span>
          </div>
          <div class="total-row">
            <span>Shipping</span>
            <span class="free-text">FREE</span>
          </div>
          <div class="total-row grand-total">
            <span>Total Paid</span>
            <span class="grand-amount">${{ parseFloat(order.total).toFixed(2) }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Footer -->
        <div class="receipt-footer">
          <p>🎉 Thank you for shopping with <strong>ShopVue</strong>!</p>
          <p class="footer-sub">Keep this receipt for your records.</p>
          <div class="barcode-placeholder no-print">
            <div class="barcode-lines">
              <span v-for="n in 30" :key="n" :style="{ height: (Math.random() * 20 + 10) + 'px' }"></span>
            </div>
            <p>{{ `ORD-${String(order.id).padStart(8, '0')}` }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.receipt-page {
  min-height: 100vh;
  padding: 2rem 0;
}

/* Loader */
.loader-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
  color: var(--text-muted);
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-wrap {
  max-width: 480px;
  margin: 4rem auto;
  text-align: center;
  padding: 3rem;
  border-radius: 24px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Actions bar */
.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 780px;
  margin: 0 auto 1.5rem;
  padding: 0 1rem;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text-main);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-back:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-print {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.4rem;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), #a855f7);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
}

.btn-print:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.45);
}

/* Receipt wrapper */
.receipt-wrapper {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Receipt card */
.receipt-card {
  border-radius: 28px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

/* Receipt header */
.receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo-icon {
  font-size: 1.8rem;
}

.brand-name {
  font-size: 1.4rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.receipt-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #dcfce7;
  color: #15803d;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.checkmark {
  font-size: 1rem;
}

/* Thank you banner */
.thank-you-banner {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08));
  border-radius: 20px;
  margin-bottom: 2rem;
}

.thank-you-banner h1 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.thank-you-banner p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Meta info */
.receipt-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta-value {
  font-size: 1rem;
  font-weight: 700;
}

.status-badge {
  display: inline-block;
  background: #dcfce7;
  color: #15803d;
  padding: 0.2rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

/* Dividers */
.divider {
  height: 1px;
  background: var(--border);
  margin: 1.5rem 0;
}

.divider.dashed {
  background: none;
  border-top: 2px dashed var(--border);
}

/* Sections */
.section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.address-text {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.6;
  padding-left: 0.5rem;
  border-left: 3px solid var(--primary);
  padding-left: 1rem;
}

/* Items table */
.items-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 80px 100px 100px;
  padding: 0.75rem 1rem;
  background: rgba(99, 102, 241, 0.08);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 80px 100px 100px;
  padding: 0.9rem 1rem;
  align-items: center;
  border-top: 1px solid var(--border);
  transition: background 0.2s;
}

.table-row:hover {
  background: rgba(99, 102, 241, 0.04);
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-thumb {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background: #f1f5f9;
  flex-shrink: 0;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-weight: 600;
  font-size: 0.9rem;
  overflow-wrap: anywhere;
}

.qty-cell,
.price-cell {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.subtotal-cell {
  font-weight: 700;
  color: var(--text-main);
}

/* Totals */
.totals-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  margin: 0.5rem 0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  width: 280px;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.free-text {
  color: #10b981;
  font-weight: 700;
}

.grand-total {
  padding-top: 0.75rem;
  border-top: 2px solid var(--border);
  color: var(--text-main);
  font-weight: 800;
  font-size: 1.05rem;
}

.grand-amount {
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Footer */
.receipt-footer {
  text-align: center;
  padding-top: 0.5rem;
}

.receipt-footer p {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}

.footer-sub {
  color: var(--text-muted) !important;
  font-size: 0.82rem !important;
  font-weight: 400 !important;
  margin-top: 0.25rem;
}

/* Barcode placeholder */
.barcode-placeholder {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.barcode-lines {
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.barcode-lines span {
  display: block;
  width: 3px;
  background: var(--text-main);
  border-radius: 1px;
  opacity: 0.8;
}

.barcode-placeholder p {
  font-family: monospace;
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: var(--text-muted);
  font-weight: 400 !important;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .receipt-page {
    padding: 0;
    background: white !important;
  }

  .receipt-card {
    box-shadow: none;
    border-radius: 0;
    border: none;
  }

  body {
    background: white !important;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .receipt-page {
    padding: 1rem 0;
  }

  .receipt-card {
    padding: 1.25rem;
    border-radius: 20px;
  }

  .actions-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-back,
  .btn-print {
    justify-content: center;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.4rem;
    font-size: 0.82rem;
  }

  .table-header {
    display: none;
  }

  .table-row {
    padding: 1rem;
  }

  .product-cell {
    align-items: flex-start;
  }

  .qty-cell::before {
    content: 'Qty: ';
    color: var(--text-muted);
  }

  .price-cell::before {
    content: 'Unit Price: ';
    color: var(--text-muted);
  }

  .subtotal-cell::before {
    content: 'Subtotal: ';
    color: var(--text-muted);
  }

  .total-row {
    width: 100%;
  }

  .thank-you-banner h1 {
    font-size: 1.3rem;
  }

  .receipt-meta {
    gap: 1rem;
  }
}

@media (max-width: 420px) {
  .receipt-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 1rem;
  }

  .thank-you-banner {
    padding: 1.5rem 0.75rem;
  }
}
</style>
