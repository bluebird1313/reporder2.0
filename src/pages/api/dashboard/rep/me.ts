import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Mock data for rep dashboard
  const mockData = {
    stores: [
      { id: 'store1', name: 'Tucker\'s Outdoor Store', status: 'connected' },
      { id: 'store2', name: 'Mountain Gear Co', status: 'connected' },
      { id: 'store3', name: 'Trail Blazers', status: 'disconnected' }
    ],
    inventory: [
      { id: 'inv1', sku: 'TB-001', name: 'Trail Running Shoes', stock: 25, price: 89.99 },
      { id: 'inv2', sku: 'MG-045', name: 'Hiking Backpack', stock: 3, price: 149.99 },
      { id: 'inv3', sku: 'TO-123', name: 'Camping Tent', stock: 0, price: 299.99 },
      { id: 'inv4', sku: 'TB-067', name: 'Water Bottle', stock: 50, price: 19.99 },
      { id: 'inv5', sku: 'MG-089', name: 'Sleeping Bag', stock: 8, price: 179.99 }
    ],
    sales: {
      totalSales: 12450,
      averageOrderValue: 124.50,
      ordersCount: 100,
      target: 15000
    },
    relationships: [
      { storeId: 'store1', storeName: 'Tucker\'s Outdoor Store', permission: 'full', status: 'connected' },
      { storeId: 'store2', storeName: 'Mountain Gear Co', permission: 'limited', status: 'connected' },
      { storeId: 'store3', storeName: 'Trail Blazers', permission: 'collection_only', status: 'error' }
    ]
  };

  res.status(200).json(mockData);
} 