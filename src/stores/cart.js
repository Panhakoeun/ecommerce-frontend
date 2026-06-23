import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        loading: false,
        error: null
    }),

    getters: {
        cartCount: (state) => state.items.length,
        cartTotal: (state) => state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    },

    actions: {
        async fetchCart() {
            this.loading = true;
            try {
                const response = await api.get('/cart');
                this.items = response.data;
            } catch (err) {
                this.error = 'Failed to fetch cart';
            } finally {
                this.loading = false;
            }
        },

        async addToCart(productId, quantity = 1) {
            try {
                await api.post('/cart', { product_id: productId, quantity });
                await this.fetchCart();
                return true;
            } catch (err) {
                this.error = 'Failed to add to cart';
                return false;
            }
        },

        async removeFromCart(cartId) {
            try {
                await api.delete(`/cart/${cartId}`);
                await this.fetchCart();
                return true;
            } catch (err) {
                this.error = 'Failed to remove from cart';
                return false;
            }
        },

        clearCart() {
            this.items = [];
        }
    }
});
