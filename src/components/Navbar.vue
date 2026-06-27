<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useProductStore } from '@/stores/products';
import { ref } from 'vue';

const auth = useAuthStore();
const cart = useCartStore();
const productStore = useProductStore();
const router = useRouter();

const menuOpen = ref(false);
const searchOpen = ref(false);

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
    menuOpen.value = false;
    router.push('/login');
};

const closeMenu = () => {
    menuOpen.value = false;
};
</script>

<template>
  <header class="navbar glass-premium smooth-gpu">
    <div class="container nav-content">
      <!-- Logo -->
      <RouterLink to="/" class="logo" @click="closeMenu">
        <span class="logo-icon">Ecommerce </span>
        <span class="logo-text"><span>Shop</span> Web</span>
      </RouterLink>

      <!-- Desktop Search -->
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

      <!-- Desktop Nav Links -->
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

      <!-- Mobile Right Actions -->
      <div class="mobile-actions">
        <button class="icon-btn" @click="searchOpen = !searchOpen" aria-label="Toggle search">
          🔍
        </button>
        <RouterLink v-if="auth.isAuthenticated" to="/cart" class="icon-btn cart-icon-btn">
          🛒
          <span v-if="cart.cartCount > 0" class="badge-mobile">{{ cart.cartCount }}</span>
        </RouterLink>
        <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
          <span :class="{ open: menuOpen }"></span>
          <span :class="{ open: menuOpen }"></span>
          <span :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    <div class="mobile-search-bar" :class="{ visible: searchOpen }">
      <div class="search-box glass mobile-search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="productStore.searchQuery" 
          @input="handleSearch"
          type="text" 
          placeholder="Search products..." 
          class="search-input"
        >
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <RouterLink to="/" class="mobile-nav-link" @click="closeMenu">🏠 Home</RouterLink>
      <template v-if="auth.isAuthenticated">
        <RouterLink to="/orders" class="mobile-nav-link" @click="closeMenu">📦 My Orders</RouterLink>
        <RouterLink to="/cart" class="mobile-nav-link" @click="closeMenu">
          🛒 Cart
          <span v-if="cart.cartCount > 0" class="badge">{{ cart.cartCount }}</span>
        </RouterLink>
        <div class="mobile-user-info">
          <span class="user-name">👤 {{ auth.user?.name }}</span>
        </div>
        <button @click="handleLogout" class="mobile-logout-btn">Logout</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="mobile-nav-link" @click="closeMenu">🔑 Login</RouterLink>
        <RouterLink to="/register" class="mobile-signup-btn" @click="closeMenu">✨ Sign Up</RouterLink>
      </template>
    </div>
  </header>

  <!-- Overlay -->
  <div v-if="menuOpen" class="menu-overlay" @click="closeMenu"></div>
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
  flex-direction: column;
  justify-content: center;
  border-radius: 20px;
  padding: 0 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
}

.navbar:hover {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: var(--shadow-lg);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.logo {
  font-size: 1.4rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  letter-spacing: 0;
  flex-shrink: 0;
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

/* ── Desktop Search ──────────────────────────── */
.nav-middle {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  min-width: 180px;
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
  font-size: 0.9rem;
}

.search-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(99, 102, 241, 0.1);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Desktop Nav ─────────────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
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

/* ── Mobile Actions (hidden on desktop) ─────── */
.mobile-actions {
  display: none;
  align-items: center;
  gap: 0.5rem;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255,255,255,0.5);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  text-decoration: none;
}

.cart-icon-btn {
  position: relative;
}

.badge-mobile {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--accent);
  color: white;
  font-size: 0.6rem;
  padding: 1px 5px;
  border-radius: 20px;
  font-weight: 800;
}

/* ── Hamburger ───────────────────────────────── */
.hamburger {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255,255,255,0.5);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--text-main);
  border-radius: 2px;
  transition: all 0.3s;
  transform-origin: center;
}

.hamburger span:nth-child(1).open {
  transform: translateY(7px) rotate(45deg);
}
.hamburger span:nth-child(2).open {
  opacity: 0;
  transform: scaleX(0);
}
.hamburger span:nth-child(3).open {
  transform: translateY(-7px) rotate(-45deg);
}

/* ── Mobile Search Bar ───────────────────────── */
.mobile-search-bar {
  display: none;
  padding: 0 1rem 0.75rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.mobile-search-bar.visible {
  max-height: 80px;
}

.mobile-search-box {
  width: 100%;
}

/* ── Mobile Drawer ───────────────────────────── */
.mobile-menu {
  display: none;
  flex-direction: column;
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 1rem;
  gap: 0.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.mobile-menu.open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  color: var(--text-main);
  text-decoration: none;
  transition: all 0.2s;
}

.mobile-nav-link:hover {
  background: rgba(99, 102, 241, 0.08);
  color: var(--primary);
}

.mobile-user-info {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin: 0.25rem 0;
}

.mobile-logout-btn {
  width: 100%;
  padding: 0.9rem;
  border-radius: 12px;
  background: #fee2e2;
  color: #ef4444;
  font-weight: 700;
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.mobile-signup-btn {
  display: block;
  text-align: center;
  padding: 0.9rem;
  border-radius: 12px;
  background: var(--primary);
  color: white;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.9rem;
}

/* ── Overlay ─────────────────────────────────── */
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 998;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(2px);
}

/* ── Responsive Breakpoints ──────────────────── */
@media (max-width: 1024px) {
  .navbar {
    width: calc(100% - 1.25rem);
  }

  .nav-middle {
    max-width: 260px;
    margin: 0 0.75rem;
  }

  .nav-links {
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.45rem 0.55rem;
    font-size: 0.88rem;
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 860px) {
  .nav-middle {
    max-width: 220px;
  }

  .logo {
    font-size: 1.15rem;
  }

  .logo-icon {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    height: auto;
    min-height: 64px;
    padding: 0.75rem 1rem;
    top: 0.75rem;
    width: calc(100% - 1.5rem);
  }

  .nav-middle {
    display: none;
  }

  .nav-links {
    display: none;
  }

  .mobile-actions {
    display: flex;
  }

  .mobile-menu {
    display: flex;
    z-index: 999;
  }

  .mobile-search-bar {
    display: block;
    padding: 0 0 0;
  }

  .mobile-search-bar.visible {
    padding: 0 0 0.75rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    border-radius: 16px;
    padding: 0.65rem 0.75rem;
  }

  .logo-icon {
    font-size: 1.2rem;
  }

  .logo {
    font-size: 1.1rem;
    gap: 0.35rem;
  }

  .icon-btn,
  .hamburger {
    width: 38px;
    height: 38px;
  }
}

@media (max-width: 380px) {
  .logo-text {
    display: none;
  }

  .mobile-actions {
    gap: 0.35rem;
  }
}
</style>
