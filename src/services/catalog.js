import api from './api';

export async function fetchCategories() {
  const { data } = await api.get('/public/categories');
  return data;
}

export async function fetchProducts(params = {}) {
  const { data } = await api.get('/public/products', { params });
  return data;
}

export async function fetchProduct(slug) {
  const { data } = await api.get(`/public/products/${slug}`);
  return {
    product: data.data,
    related: data.related ?? [],
  };
}

export async function fetchShippingZones() {
  const { data } = await api.get('/public/shipping-zones');
  return data;
}

export async function validateCoupon(payload) {
  const { data } = await api.post('/public/coupons/validate', payload);
  return data;
}
