const toNumber = (value) => Number(value || 0);

const formatProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    price: toNumber(product.price),
    salePrice: product.salePrice === null || product.salePrice === undefined ? null : toNumber(product.salePrice),
  };
};

const formatOrder = (order) => {
  if (!order) return null;
  return {
    ...order,
    subtotal: toNumber(order.subtotal),
    discount: toNumber(order.discount),
    total: toNumber(order.total),
    items: order.items?.map((item) => ({
      ...item,
      productPrice: toNumber(item.productPrice),
      total: toNumber(item.total),
    })),
  };
};

module.exports = { toNumber, formatProduct, formatOrder };
