import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { CampaignController } from '../controllers/CampaignController';
import { validateRequest } from '../middleware/validation';

const router = Router();
const campaignController = new CampaignController();

// Get all campaigns with pagination and filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['DRAFT', 'PENDING', 'ACTIVE', 'PAUSED', 'ENDED']).withMessage('Invalid status'),
  query('search').optional().isString().withMessage('Search must be a string'),
  validateRequest
], campaignController.getAllCampaigns);

// Get campaign by ID
router.get('/:id', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  validateRequest
], campaignController.getCampaignById);

// Create new campaign
router.post('/', [
  body('name').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be 1-100 characters'),
  body('brandName').isString().trim().isLength({ min: 1, max: 100 }).withMessage('Brand name is required and must be 1-100 characters'),
  body('description').optional().isString().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').isISO8601().withMessage('End date must be a valid date'),
  body('platforms').isArray({ min: 1 }).withMessage('At least one platform must be selected'),
  body('platforms.*').isIn(['XIAOHONGSHU', 'WECHAT_MOMENTS', 'DIANPING', 'WEIBO']).withMessage('Invalid platform'),
  validateRequest
], campaignController.createCampaign);

// Update campaign
router.put('/:id', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  body('name').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('brandName').optional().isString().trim().isLength({ min: 1, max: 100 }).withMessage('Brand name must be 1-100 characters'),
  body('description').optional().isString().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('platforms').optional().isArray({ min: 1 }).withMessage('At least one platform must be selected'),
  body('platforms.*').optional().isIn(['XIAOHONGSHU', 'WECHAT_MOMENTS', 'DIANPING', 'WEIBO']).withMessage('Invalid platform'),
  validateRequest
], campaignController.updateCampaign);

// Delete campaign
router.delete('/:id', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  validateRequest
], campaignController.deleteCampaign);

// Publish campaign
router.post('/:id/publish', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  validateRequest
], campaignController.publishCampaign);

// Pause campaign
router.post('/:id/pause', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  validateRequest
], campaignController.pauseCampaign);

// Get campaign QR code
router.get('/:id/qr-code', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  validateRequest
], campaignController.getCampaignQRCode);

// Get campaign analytics
router.get('/:id/analytics', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('platform').optional().isIn(['XIAOHONGSHU', 'WECHAT_MOMENTS', 'DIANPING', 'WEIBO']).withMessage('Invalid platform'),
  validateRequest
], campaignController.getCampaignAnalytics);

// Get campaign activities
router.get('/:id/activities', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validateRequest
], campaignController.getCampaignActivities);

// Update campaign configuration
router.put('/:id/config', [
  param('id').isString().notEmpty().withMessage('Campaign ID is required'),
  body('maxImagesPerPost').optional().isInt({ min: 1, max: 10 }).withMessage('Max images per post must be between 1 and 10'),
  body('maxPostsPerUser').optional().isInt({ min: 1, max: 10 }).withMessage('Max posts per user must be between 1 and 10'),
  body('rewardMessage').optional().isString().trim().isLength({ max: 500 }).withMessage('Reward message must be less than 500 characters'),
  body('customerServiceQR').optional().isString().withMessage('Customer service QR must be a valid URL'),
  body('backgroundImage').optional().isString().withMessage('Background image must be a valid URL'),
  body('templateType').optional().isIn(['DEFAULT', 'CUSTOM']).withMessage('Invalid template type'),
  validateRequest
], campaignController.updateCampaignConfig);

export default router; 