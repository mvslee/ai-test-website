import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ message: 'WeChat routes working' });
});

export default router; 