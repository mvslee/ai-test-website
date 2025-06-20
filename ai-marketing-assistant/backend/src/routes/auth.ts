import { Router } from 'express';

const router = Router();

// Simple health check for auth routes
router.get('/health', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

export default router; 