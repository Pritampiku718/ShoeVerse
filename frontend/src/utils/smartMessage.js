export const smartMessage = (type) => {
  const messages = {
    orders: "You haven't placed any sneaker orders yet. Ready to step up?",
    wishlist: "Found something you love? Save it here ❤️",
    products: "No sneakers available. Check back later!",
    cart: "Your cart is empty. Start shopping!",
    admin_products: "No sneakers available. Add your first product.",
    admin_orders: "No orders yet. They'll appear here once customers start shopping.",
    admin_users: "No users found. They'll appear here when people register.",
  };
  return messages[type] || "Nothing to see here.";
};