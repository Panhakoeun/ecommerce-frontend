<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useProductStore } from '@/stores/products';

const auth = useAuthStore();
const cart = useCartStore();
const productStore = useProductStore();
const router = useRouter();

let searchTimeout;
const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (router.currentRoute.value.path !== '/') {
            router.push('/');
        }
        productStore.fetchProducts();
    }, 500);
};

const handleLogout = async () => {
    await auth.logout();
    router.push('/login');
};
</script>

<template>
  <header class="navbar glass-premium smooth-gpu">
    <div class="container nav-content">
      <RouterLink to="/" class="logo">
        <span class="logo-icon">Ecommerce </span>
        <span class="logo-text"><span>Shop</span> Web</span>
      </RouterLink>

      <div class="nav-middle">
        <div class="search-box glass" :class="{ 'is-loading': productStore.loading }">
            <span class="search-icon">🔍</span>
            <input 
                v-model="productStore.searchQuery" 
                @input="handleSearch"
                type="text" 
                placeholder="Search products..." 
                class="search-input"
            >
            <div v-if="productStore.loading" class="search-spinner"></div>
        </div>
      </div>

      <nav class="nav-links">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <template v-if="auth.isAuthenticated">
          <RouterLink to="/orders" class="nav-link">My Orders</RouterLink>
          <RouterLink to="/cart" class="nav-link cart-link">
            Cart
            <span v-if="cart.cartCount > 0" class="badge">{{ cart.cartCount }}</span>
          </RouterLink>
          <div class="user-menu">
            <span class="user-name">{{ auth.user?.name }}</span>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-link">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary">Sign Up</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 2rem);
  max-width: 1300px;
  z-index: 1000;
  height: 70px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 0 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar:hover {
  height: 75px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: var(--shadow-lg);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  font-size: 1.4rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  letter-spacing: -0.02em;
}

.logo-icon {
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
  font-size: 1.6rem;
}

.logo-text span {
  background: linear-gradient(135deg, var(--primary), #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-middle {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
}

.search-icon {
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.search-input {
  border: none;
  background: transparent;
  width: 100%;
  padding: 0.4rem 0;
  outline: none;
  font-weight: 600;
  color: var(--text-main);
}

.search-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(99, 102, 241, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-muted);
  transition: all 0.3s;
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
}

.nav-link:hover, .router-link-active {
  color: var(--primary);
  background: rgba(99, 102, 241, 0.08);
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.badge {
  background: var(--accent);
  color: white;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 20px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(244, 63, 94, 0.3);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding-left: 1.2rem;
  border-left: 1px solid var(--border);
}

.user-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main);
}

.btn-logout {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
}

.btn-logout:hover {
  color: var(--accent);
}
</style>
