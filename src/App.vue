<script setup>
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { onMounted, ref, provide } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Toast from '@/components/Toast.vue';

const auth = useAuthStore();
const cart = useCartStore();

const toast = ref({ show: false, message: '' });

const showToast = (message) => {
    toast.value = { show: true, message };
    setTimeout(() => toast.value.show = false, 3000);
};

// Provide toast function to all children
provide('showToast', showToast);

onMounted(() => {
    if (auth.isAuthenticated) {
        cart.fetchCart();
    }
});
</script>

<template>
  <Navbar />

  <main class="main-content">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>

  <footer class="footer">
    <div class="container">
      <p>Ecommerce shop by Panha Koeun Web A 2026</p>
    </div>
  </footer>

  <Toast :show="toast.show" :message="toast.message" />
</template>

<style>
.main-content {
  padding-top: 130px;
  min-height: calc(100vh - 80px);
}

.footer {
  padding: 3rem 0;
  text-align: center;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  margin-top: 4rem;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
