import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, permission } = req.body

  if (!email || !permission) {
    return res.status(400).json({ error: 'Email and permission are required' })
  }

  // Mock successful response
  res.status(200).json({ 
    success: true, 
    message: `Permission "${permission}" granted to ${email}`, 
  })
} 