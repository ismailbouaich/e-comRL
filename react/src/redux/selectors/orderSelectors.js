export const user = state => state.user.user;
export const product = state => state.product.product;
export const loading = state => state.product.loading;
export const productError = state => state.product.error;
export const orderLoading = state => state.order.loading;
export const orderError = state => state.order.error;
export const stripe_url = state => state.order.order?.stripe_url;