<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const error = ref('');

const handleSubmit = async () => {
    error.value = '';
    if (form.password !== form.password_confirmation) {
        error.value = 'Passwords do not match';
        return;
    }
    const success = await auth.register(form);
    if (success) {
        router.push('/');
    } else {
        error.value = auth.error || 'Registration failed';
    }
};
</script>

<template>
  <div class="container flex-center">
    <div class="auth-card glass animate-fade-in">
      <div class="auth-header">
        <h2>{{ $t('register.joinUs') }}</h2>
        <p>{{ $t('register.createAccount') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="error" class="error-alert">{{ error }}</div>

        <div class="form-group">
          <label class="form-label">{{ $t('register.fullName') }}</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="form-input" 
            :placeholder="$t('register.namePlaceholder')"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('register.email') }}</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="form-input" 
            :placeholder="$t('register.emailPlaceholder')"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('register.password') }}</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="form-input" 
            :placeholder="$t('register.passwordPlaceholder')"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('register.confirmPassword') }}</label>
          <input 
            v-model="form.password_confirmation" 
            type="password" 
            class="form-input" 
            :placeholder="$t('register.confirmPlaceholder')"
            required
          >
        </div>

        <button :disabled="auth.loading" type="submit" class="btn btn-primary w-full">
          {{ auth.loading ? $t('register.creatingBtn') : $t('register.createBtn') }}
        </button>
      </form>

      <div class="auth-footer">
        <p>{{ $t('register.alreadyAccount') }} <RouterLink to="/login">{{ $t('register.loginHere') }}</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
}

.auth-card {
  width: 100%;
  max-width: 450px;
  padding: 3rem;
  border-radius: 30px;
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--text-muted);
}

.error-alert {
  background: #fee2e2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #fecaca;
}

.w-full {
  width: 100%;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-muted);
}

.auth-footer a {
  color: var(--primary);
  font-weight: 700;
}

@media (max-width: 520px) {
  .flex-center {
    align-items: flex-start;
    min-height: auto;
  }

  .auth-card {
    padding: 2rem 1.25rem;
    border-radius: 20px;
  }

  .auth-header h2 {
    font-size: 1.6rem;
  }
}
</style>
