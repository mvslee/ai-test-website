import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ message: 'Upload routes working' });
});

export default router; 