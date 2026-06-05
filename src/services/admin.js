import api, { fetchCsrfCookie } from './api';

export async function fetchAdminStats() {
  const { data } = await api.get('/admin/stats');
  return data;
}

export async function fetchAdminOrders(params = {}) {
  const { data } = await api.get('/admin/orders', { params });
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return data;
}

export async function fetchAdminProducts() {
  const { data } = await api.get('/admin/products');
  return data;
}

export async function fetchAdminCoupons() {
  const { data } = await api.get('/admin/coupons');
  return data;
}

export async function createCoupon(payload) {
  const { data } = await api.post('/admin/coupons', payload);
  return data;
}

export async function updateCoupon(id, payload) {
  const { data } = await api.patch(`/admin/coupons/${id}`, payload);
  return data;
}

export async function deleteCoupon(id) {
  const { data } = await api.delete(`/admin/coupons/${id}`);
  return data;
}

export async function createProduct(formData) {
  await fetchCsrfCookie();
  const { data } = await api.post('/admin/products', formData, {
    headers: { 'Content-Type': undefined },
  });
  return data;
}

export async function updateProduct(id, formData) {
  await fetchCsrfCookie();
  formData.append('_method', 'PATCH');
  const { data } = await api.post(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': undefined },
  });
  return data;
}

export async function deleteProduct(id) {
  await fetchCsrfCookie();
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
}

export async function deleteProductImage(productId, imageId) {
  await fetchCsrfCookie();
  const { data } = await api.delete(`/admin/products/${productId}/images/${imageId}`);
  return data;
}

export async function toggleProductActive(id) {
  const { data } = await api.patch(`/admin/products/${id}/toggle`);
  return data;
}
