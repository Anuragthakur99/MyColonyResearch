// Simple service store to manage pending services
let pendingServices = [
  {
    _id: '1',
    title: 'Home Cooked Tiffin Service',
    description: 'Fresh, healthy home-cooked meals delivered daily.',
    category: 'Food & Tiffin',
    price: '₹150/day',
    availability: 'Mon-Sat, 12PM-2PM',
    serviceProvider: { fullname: 'Priya Sharma', profile: { flatNumber: 'A-204' } },
    colony: { name: 'Green Valley Residency' },
    isApproved: false,
    createdAt: new Date()
  },
  {
    _id: '2',
    title: 'Express Laundry Service',
    description: 'Quick and reliable laundry service with pickup and delivery.',
    category: 'Laundry',
    price: '₹50/kg',
    availability: 'Daily, 9AM-6PM',
    serviceProvider: { fullname: 'Rajesh Kumar', profile: { flatNumber: 'B-105' } },
    colony: { name: 'Green Valley Residency' },
    isApproved: false,
    createdAt: new Date()
  }
];

export const addPendingService = (service) => {
  const newService = {
    ...service,
    _id: Date.now().toString(),
    serviceProvider: { fullname: 'Current User', profile: { flatNumber: 'A-101' } },
    colony: { name: 'Green Valley Residency' },
    isApproved: false,
    createdAt: new Date()
  };
  pendingServices.push(newService);
};

export const getPendingServices = () => {
  return [...pendingServices];
};

export const removePendingService = (serviceId) => {
  pendingServices = pendingServices.filter(service => service._id !== serviceId);
};