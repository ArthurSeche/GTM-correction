/* Correction partie 3 : à coller dans mes-tags.js, après les deux premières lignes */

/* Le dictionnaire : vocabulaire de la boutique → vocabulaire GA4 */
function versItem(x) {
  return {
    item_id: x.sku,
    item_name: x.name,
    item_brand: x.brand,
    item_category: x.category,
    item_variant: x.size,
    price: x.price,
    quantity: x.quantity || 1
  };
}

/* 3.2 — Vue d'un produit */
shopHooks.viewItem = function (data) {
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "view_item",
    ecommerce: {
      currency: "EUR",
      value: data.product.price,
      items: [versItem(data.product)]
    }
  });
};

/* 3.3 — Ajout au panier */
shopHooks.addToCart = function (data) {
  var item = versItem(data.product);
  item.item_variant = data.size;
  item.price = data.unitPrice;
  item.quantity = data.quantity;
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "add_to_cart",
    ecommerce: { currency: "EUR", value: data.value, items: [item] }
  });
};

/* 3.4 — Tunnel de commande */
shopHooks.beginCheckout = function (data) {
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: "EUR",
      value: data.totals.subtotal - data.totals.discount,
      coupon: data.totals.coupon || undefined,
      items: data.lines.map(versItem)
    }
  });
};

shopHooks.addShippingInfo = function (data) {
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "add_shipping_info",
    ecommerce: {
      currency: "EUR",
      value: data.totals.subtotal - data.totals.discount,
      coupon: data.totals.coupon || undefined,
      shipping_tier: data.shippingTier,
      items: data.lines.map(versItem)
    }
  });
};

shopHooks.addPaymentInfo = function (data) {
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "add_payment_info",
    ecommerce: {
      currency: "EUR",
      value: data.totals.subtotal - data.totals.discount,
      coupon: data.totals.coupon || undefined,
      payment_type: data.paymentType,
      items: data.lines.map(versItem)
    }
  });
};

/* 3.5 — Achat */
shopHooks.purchase = function (data) {
  if (!data.firstView) return; // page rechargée : on n'envoie pas l'achat une 2e fois
  var o = data.order;
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: o.transaction_id,
      currency: o.currency,
      value: Math.round((o.total - o.shipping) * 100) / 100,
      tax: o.tax,
      shipping: o.shipping,
      coupon: o.coupon || undefined,
      items: o.lines.map(versItem)
    }
  });
};

/* Bonus — Retrait du panier */
shopHooks.removeFromCart = function (data) {
  var item = versItem(data.line);
  item.quantity = data.quantity;
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: "remove_from_cart",
    ecommerce: { currency: "EUR", value: data.value, items: [item] }
  });
};
