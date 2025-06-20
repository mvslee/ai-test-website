import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ message: 'Analytics routes working' });
});

export default router; 