import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ message: 'Content routes working' });
});

export default router; 