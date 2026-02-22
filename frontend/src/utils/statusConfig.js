export const getStatusConfig = (status) => {
  const configs = {
    placed: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: '🕒',
      label: 'Order Placed'
    },
    confirmed: {
      color: 'bg-blue-100 text-blue-800',
      icon: '✅',
      label: 'Confirmed'
    },
    shipped: {
      color: 'bg-purple-100 text-purple-800',
      icon: '📦',
      label: 'Shipped'
    },
    delivered: {
      color: 'bg-green-100 text-green-800',
      icon: '🎉',
      label: 'Delivered'
    },
    cancelled: {
      color: 'bg-red-100 text-red-800',
      icon: '❌',
      label: 'Cancelled'
    }
  };
  return configs[status] || configs.placed;
};