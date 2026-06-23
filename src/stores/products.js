import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        categories: [],
        searchQuery: '',
        loading: false,
        error: null
    }),

    actions: {
        async fetchProducts(params = {}) {
            this.loading = true;
            try {
                // Merge explicit params with searchQuery
                const finalParams = { ...params };
                if (this.searchQuery) {
                    finalParams.search = this.searchQuery;
                }
                const response = await api.get('/products', { params: finalParams });
                this.products = response.data.data || response.data;
            } catch (err) {
                this.error = 'Failed to fetch products';
            } finally {
                this.loading = false;
            }
        },

        async fetchCategories() {
            try {
                const response = await api.get('/categories');
                this.categories = response.data;
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        },

        async getProduct(id) {
            try {
                const response = await api.get(`/products/${id}`);
                return response.data;
            } catch (err) {
                console.error('Failed to get product', err);
                return null;
            }
        }
    }
});
