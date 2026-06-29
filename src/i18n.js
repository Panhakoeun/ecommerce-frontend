import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    navbar: {
      home: 'Home',
      myOrders: 'My Orders',
      cart: 'Cart',
      logout: 'Logout',
      login: 'Login',
      signUp: 'Sign Up',
      searchPlaceholder: 'Search products...',
      ecommerce: 'Ecommerce ',
      shopWeb: 'Shop Web'
    },
    login: {
      welcome: 'Welcome Back',
      loginToAccount: 'Login to your account to continue',
      email: 'Email Address',
      password: 'Password',
      emailPlaceholder: 'name@example.com',
      loggingIn: 'Logging in...',
      loginBtn: 'Login',
      noAccount: "Don't have an account?",
      createOne: 'Create one'
    }
  },
  km: {
    navbar: {
      home: 'ទំព័រដើម',
      myOrders: 'ការបញ្ជាទិញរបស់ខ្ញុំ',
      cart: 'កន្ត្រកទំនិញ',
      logout: 'ចាកចេញ',
      login: 'ចូលគណនី',
      signUp: 'ចុះឈ្មោះ',
      searchPlaceholder: 'ស្វែងរកផលិតផល...',
      ecommerce: 'ទិញទំនិញ ',
      shopWeb: 'អនឡាញ'
    },
    login: {
      welcome: 'សូមស្វាគមន៍ត្រឡប់មកវិញ',
      loginToAccount: 'ចូលគណនីរបស់អ្នកដើម្បីបន្ត',
      email: 'អាសយដ្ឋានអ៊ីមែល',
      password: 'ពាក្យសម្ងាត់',
      emailPlaceholder: 'name@example.com',
      loggingIn: 'កំពុងចូល...',
      loginBtn: 'ចូលគណនី',
      noAccount: "មិនទាន់មានគណនីទេ?",
      createOne: 'បង្កើត'
    }
  }
};

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: localStorage.getItem('user-locale') || 'en', // Set default locale based on local storage or default to 'en'
  fallbackLocale: 'en',
  messages,
});

export default i18n;
