import { defineStore } from 'pinia';
import api from '@/api/axios';

const unwrapCollection = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.products)) return payload.products;
    if (Array.isArray(payload?.products?.data)) return payload.products.data;

    return [];
};

const unwrapResource = (payload) => payload?.data || payload?.product || payload;

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

const normalizeProduct = (product) => {
    if (!product) return product;

    const sizePrices = {
        S: Number(product.price_s ?? 0),
        M: Number(product.price_m ?? 0),
        L: Number(product.price_l ?? 0),
    };

    return {
        ...product,
        size_prices: sizePrices,
        price: sizePrices.S,
    };
};

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
            this.error = null;
            try {
                const finalParams = { ...params };
                if (this.searchQuery) {
                    finalParams.search = this.searchQuery;
                }
                const response = await api.get('/products', {
                    params: finalParams,
                    headers: { 'Cache-Control': 'no-cache' },
                });
                this.products = unwrapCollection(response.data).map(normalizeProduct);
            } catch (err) {
                this.error = 'Failed to fetch products';
            } finally {
                this.loading = false;
            }
        },

        async fetchCategories() {
            try {
                const response = await api.get('/categories');
                this.categories = unwrapCollection(response.data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        },

        async getProduct(id) {
            try {
                const response = await api.get(`/products/${id}`);
                return normalizeProduct(unwrapResource(response.data));
            } catch (err) {
                console.error('Failed to get product', err);
                return null;
            }
        }
    }
});
