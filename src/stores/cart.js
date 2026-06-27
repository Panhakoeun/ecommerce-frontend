import { defineStore } from 'pinia';
import api from '@/api/axios';

const normalizeSizePrices = (sizePrices) => {
    if (!sizePrices) return {};
    if (typeof sizePrices === 'string') {
        try {
            return JSON.parse(sizePrices);
        } catch {
            return {};
        }
    }

    return sizePrices;
};

const linePrice = (item) => {
    const sizePrices = normalizeSizePrices(item.product?.size_prices);

    return Number(item.price ?? sizePrices[item.size] ?? item.product?.price ?? 0);
};

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        loading: false,
        error: null
    }),

    getters: {
        cartCount: (state) => state.items.length,
        cartTotal: (state) => state.items
            .reduce((total, item) => total + (linePrice(item) * item.quantity), 0)
            .toFixed(2)
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

        async addToCart(productId, quantity = 1, size = 'S') {
            try {
                await api.post('/cart', { product_id: productId, quantity, size });
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
