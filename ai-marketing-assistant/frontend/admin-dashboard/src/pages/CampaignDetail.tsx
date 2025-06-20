import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Campaign {
  id: string;
  name: string;
  brandName: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
  platforms: string[];
  createdAt: string;
  qrCodeUrl?: string;
}

const platformLabels: Record<string, string> = {
  XIAOHONGSHU: '小红书',
  WECHAT_MOMENTS: '微信朋友圈',
  DIANPING: '大众点评',
  WEIBO: '微博',
};
const platformColors: Record<string, string> = {
  XIAOHONGSHU: '#ff2442',
  WECHAT_MOMENTS: '#1aad19',
  DIANPING: '#ff8800',
  WEIBO: '#f87123',
};
const statusColors: Record<string, string> = {
  DRAFT: '#aaa',
  PENDING: '#faad14',
  ACTIVE: '#52c41a',
  PAUSED: '#fa541c',
  ENDED: '#bfbfbf',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
}

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:3001/api/campaigns/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCampaign(data.data);
        } else {
          setError(data.message || '未找到活动');
        }
      })
      .catch(() => setError('加载失败'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 24, textAlign: 'center' }}>加载中...</div>;
  if (error) return <div style={{ padding: 24, color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!campaign) return null;

  // 检查是否在小红书App内
  const isXHS = typeof window !== 'undefined' && (window as any).xhs;

  const handleXHSPost = () => {
    if ((window as any).xhs && (window as any).xhs.openPost) {
      (window as any).xhs.openPost({
        text: `${campaign.name}\n${campaign.description || ''}`.trim(),
        // images: [], // 可选，传图片URL数组
      });
    } else {
      alert('请在小红书App内打开本页面以发文');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16, fontSize: 16, background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, textAlign: 'center', margin: '24px 0 18px 0', letterSpacing: 1 }}>{campaign.name}</h2>
      <div style={{ background: '#f7f8fa', borderRadius: 10, padding: 16, marginBottom: 18, boxShadow: '0 1px 4px #eee' }}>
        <div style={{ marginBottom: 10 }}><span style={{ color: '#888' }}>品牌：</span>{campaign.brandName}</div>
        <div style={{ marginBottom: 10 }}><span style={{ color: '#888' }}>描述：</span>{campaign.description || '无'}</div>
        <div style={{ marginBottom: 10 }}><span style={{ color: '#888' }}>时间：</span>{formatDate(campaign.startDate)} ~ {formatDate(campaign.endDate)}</div>
        <div style={{ marginBottom: 10 }}>
          <span style={{ color: '#888' }}>平台：</span>
          {campaign.platforms.map(p => (
            <span key={p} style={{
              display: 'inline-block',
              background: platformColors[p] || '#eee',
              color: '#fff',
              borderRadius: 6,
              padding: '2px 10px',
              fontSize: 14,
              marginRight: 8
            }}>{platformLabels[p] || p}</span>
          ))}
        </div>
        <div>
          <span style={{ color: '#888' }}>状态：</span>
          <span style={{
            display: 'inline-block',
            background: statusColors[campaign.status] || '#eee',
            color: '#fff',
            borderRadius: 6,
            padding: '2px 10px',
            fontSize: 14
          }}>{campaign.status}</span>
        </div>
      </div>
      {campaign.qrCodeUrl && (
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <div style={{
            display: 'inline-block',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 16px #eee',
            padding: 16,
            border: '1px solid #f0f0f0'
          }}>
            <img
              src={campaign.qrCodeUrl}
              alt="活动二维码"
              style={{ width: 180, height: 180, display: 'block', margin: '0 auto' }}
            />
            <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>扫码进入本页</div>
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <button
          onClick={handleXHSPost}
          style={{
            background: '#ff2442',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            fontSize: 18,
            fontWeight: 600,
            boxShadow: '0 2px 8px #eee',
            cursor: 'pointer'
          }}
        >
          去小红书发文
        </button>
        {!isXHS && (
          <div style={{ color: '#888', fontSize: 14, marginTop: 10 }}>
            请在小红书App内打开本页面以发文
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail; 