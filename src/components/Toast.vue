<script setup>
defineProps({
    show: Boolean,
    message: String
});
</script>

<template>
  <Transition name="toast">
    <div v-if="show" class="toast-notification glass">
        <span class="toast-icon">✅</span>
        {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast-notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 16px;
  background: var(--primary);
  color: white;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 700;
  box-shadow: var(--shadow-xl);
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translate(-50%, -20px) scale(0.9); }
</style>
