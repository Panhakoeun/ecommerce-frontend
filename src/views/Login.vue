<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
    email: '',
    password: ''
});

const error = ref('');

const handleSubmit = async () => {
    error.value = '';
    const success = await auth.login(form);
    if (success) {
        router.push('/');
    } else {
        error.value = auth.error || 'Invalid credentials';
    }
};
</script>

<template>
  <div class="container flex-center">
    <div class="auth-card glass animate-fade-in">
      <div class="auth-header">
        <h2>{{ $t('login.welcome') }}</h2>
        <p>{{ $t('login.loginToAccount') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="error" class="error-alert">{{ error }}</div>

        <div class="form-group">
          <label class="form-label">{{ $t('login.email') }}</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="form-input" 
            :placeholder="$t('login.emailPlaceholder')"
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('login.password') }}</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="form-input" 
            placeholder="••••••••"
            required
          >
        </div>

        <button :disabled="auth.loading" type="submit" class="btn btn-primary w-full">
          {{ auth.loading ? $t('login.loggingIn') : $t('login.loginBtn') }}
        </button>
      </form>

      <div class="auth-footer">
        <p>{{ $t('login.noAccount') }} <RouterLink to="/register">{{ $t('login.createOne') }}</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
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
  margin-bottom: 2.5rem;
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
  margin-top: 1rem;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-muted);
  font-size: 0.95rem;
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

  .auth-header {
    margin-bottom: 1.75rem;
  }

  .auth-header h2 {
    font-size: 1.6rem;
  }
}
</style>
