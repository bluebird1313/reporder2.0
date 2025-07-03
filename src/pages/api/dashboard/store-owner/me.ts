import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Mock data for company dashboard
  const mockData = {
    storeStatus: {
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
    },
    reps: [
      { id: 'rep1', name: 'John Smith' },
      { id: 'rep2', name: 'Sarah Johnson' },
      { id: 'rep3', name: 'Mike Davis' },
    ],
    collections: [
      { id: 'col1', name: 'Outdoor Gear', productsCount: 45, thumbnailUrl: null },
      { id: 'col2', name: 'Camping Equipment', productsCount: 32, thumbnailUrl: null },
      { id: 'col3', name: 'Hiking Accessories', productsCount: 28, thumbnailUrl: null },
      { id: 'col4', name: 'Water Sports', productsCount: 15, thumbnailUrl: null },
    ],
    permissions: {
      'rep1': {
        'col1': 'write',
        'col2': 'read',
        'col3': 'none',
        'col4': 'write',
      },
      'rep2': {
        'col1': 'read',
        'col2': 'write',
        'col3': 'read',
        'col4': 'none',
      },
      'rep3': {
        'col1': 'none',
        'col2': 'none',
        'col3': 'write',
        'col4': 'read',
      },
    },
    analytics: {
      sharedValue: 45000,
      sharedVolume: 280,
      topReps: [
        { repName: 'John Smith', value: 18500 },
        { repName: 'Sarah Johnson', value: 15200 },
        { repName: 'Mike Davis', value: 11300 },
      ],
    },
  }

  res.status(200).json(mockData)
} 