import { Request, Response } from 'express';
import { prisma } from '../index';
import { Platform, CampaignStatus } from '@prisma/client';
import QRCode from 'qrcode';
import ossClient from '../utils/oss';
import path from 'path';

export class CampaignController {
  // Get all campaigns with pagination and filtering
  async getAllCampaigns(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      
      if (status) {
        where.status = status as CampaignStatus;
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { brandName: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where,
          include: {
            config: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            _count: {
              select: {
                contents: true,
                analytics: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.campaign.count({ where })
      ]);

      res.json({
        success: true,
        data: campaigns,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaigns'
      });
    }
  }

  // Get campaign by ID
  async getCampaignById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          config: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          contents: {
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              contents: true,
              analytics: true,
              activities: true
            }
          }
        }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign'
      });
    }
  }

  // Create new campaign
  async createCampaign(req: Request, res: Response) {
    try {
      const {
        name,
        brandName,
        description,
        startDate,
        endDate,
        platforms
      } = req.body;

      const userId = (req as any).user?.id || 'cmc2wan3e0001ghftptcmioqg';

      const campaign = await prisma.campaign.create({
        data: {
          name,
          brandName,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          platforms: platforms as Platform[],
          createdBy: userId,
          config: {
            create: {
              maxImagesPerPost: 3,
              maxPostsPerUser: 1,
              templateType: 'DEFAULT'
            }
          }
        },
        include: {
          config: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // 生成二维码并保存
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const qrCodeData = `${frontendUrl}/campaign/${campaign.id}`;
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { qrCodeUrl }
      });

      // Log activity
      await prisma.campaignActivity.create({
        data: {
          campaignId: campaign.id,
          action: 'CREATED',
          details: { platforms, createdBy: userId }
        }
      });

      // 重新查一次，带上二维码
      const campaignWithQR = await prisma.campaign.findUnique({
        where: { id: campaign.id },
        include: {
          config: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: campaignWithQR,
        message: 'Campaign created successfully'
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create campaign'
      });
    }
  }

  // Update campaign
  async updateCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }

      const campaign = await prisma.campaign.update({
        where: { id },
        data: updateData,
        include: {
          config: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Log activity
      await prisma.campaignActivity.create({
        data: {
          campaignId: id,
          action: 'UPDATED',
          details: { updatedFields: Object.keys(updateData) }
        }
      });

      res.json({
        success: true,
        data: campaign,
        message: 'Campaign updated successfully'
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update campaign'
      });
    }
  }

  // Delete campaign
  async deleteCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campaign = await prisma.campaign.findUnique({
        where: { id }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (campaign.status === 'ACTIVE') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete active campaign'
        });
      }

      await prisma.campaign.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete campaign'
      });
    }
  }

  // Publish campaign
  async publishCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { config: true }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (campaign.status === 'ACTIVE') {
        return res.status(400).json({
          success: false,
          message: 'Campaign is already active'
        });
      }

      // Generate QR code if not exists
      let qrCodeUrl = campaign.qrCodeUrl;
      if (!qrCodeUrl) {
        const qrCodeData = `${process.env.FRONTEND_URL}/campaign/${id}`;
        qrCodeUrl = await QRCode.toDataURL(qrCodeData);
      }

      const updatedCampaign = await prisma.campaign.update({
        where: { id },
        data: {
          status: 'ACTIVE',
          qrCodeUrl
        },
        include: {
          config: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Log activity
      await prisma.campaignActivity.create({
        data: {
          campaignId: id,
          action: 'PUBLISHED',
          details: { publishedAt: new Date() }
        }
      });

      res.json({
        success: true,
        data: updatedCampaign,
        message: 'Campaign published successfully'
      });
    } catch (error) {
      console.error('Error publishing campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to publish campaign'
      });
    }
  }

  // Pause campaign
  async pauseCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campaign = await prisma.campaign.update({
        where: { id },
        data: { status: 'PAUSED' },
        include: {
          config: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Log activity
      await prisma.campaignActivity.create({
        data: {
          campaignId: id,
          action: 'PAUSED',
          details: { pausedAt: new Date() }
        }
      });

      res.json({
        success: true,
        data: campaign,
        message: 'Campaign paused successfully'
      });
    } catch (error) {
      console.error('Error pausing campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to pause campaign'
      });
    }
  }

  // Get campaign QR code
  async getCampaignQRCode(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        select: { qrCodeUrl: true, status: true }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      if (!campaign.qrCodeUrl) {
        return res.status(404).json({
          success: false,
          message: 'QR code not generated yet'
        });
      }

      res.json({
        success: true,
        data: {
          qrCodeUrl: campaign.qrCodeUrl,
          status: campaign.status
        }
      });
    } catch (error) {
      console.error('Error fetching QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch QR code'
      });
    }
  }

  // Get campaign analytics
  async getCampaignAnalytics(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { startDate, endDate, platform } = req.query;

      const where: any = { campaignId: id };
      
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate as string);
        if (endDate) where.createdAt.lte = new Date(endDate as string);
      }

      if (platform) {
        where.platform = platform;
      }

      const analytics = await prisma.analytics.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      // Aggregate data
      const aggregatedData = analytics.reduce((acc, item) => {
        const type = item.type;
        if (!acc[type]) acc[type] = 0;
        acc[type]++;
        return acc;
      }, {} as Record<string, number>);

      res.json({
        success: true,
        data: {
          analytics,
          aggregatedData,
          totalRecords: analytics.length
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics'
      });
    }
  }

  // Get campaign activities
  async getCampaignActivities(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [activities, total] = await Promise.all([
        prisma.campaignActivity.findMany({
          where: { campaignId: id },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.campaignActivity.count({
          where: { campaignId: id }
        })
      ]);

      res.json({
        success: true,
        data: activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activities'
      });
    }
  }

  // Update campaign configuration
  async updateCampaignConfig(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const configData = req.body;

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { config: true }
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      let config;
      if (campaign.config) {
        config = await prisma.campaignConfig.update({
          where: { campaignId: id },
          data: configData
        });
      } else {
        config = await prisma.campaignConfig.create({
          data: {
            campaignId: id,
            ...configData
          }
        });
      }

      // Log activity
      await prisma.campaignActivity.create({
        data: {
          campaignId: id,
          action: 'CONFIG_UPDATED',
          details: { updatedConfig: Object.keys(configData) }
        }
      });

      res.json({
        success: true,
        data: config,
        message: 'Campaign configuration updated successfully'
      });
    } catch (error) {
      console.error('Error updating campaign config:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update campaign configuration'
      });
    }
  }

  async uploadToOSS(localFilePath: string, ossFileName: string) {
    try {
      const result = await ossClient.put(ossFileName, path.resolve(localFilePath));
      return result.url;
    } catch (e) {
      throw new Error('OSS上传失败: ' + e.message);
    }
  }
} 