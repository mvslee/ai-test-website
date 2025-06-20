import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

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

const platformOptions = [
  { label: '小红书', value: 'XIAOHONGSHU' },
  { label: '微信朋友圈', value: 'WECHAT_MOMENTS' },
  { label: '大众点评', value: 'DIANPING' },
  { label: '微博', value: 'WEIBO' },
];

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/campaigns', {
        headers: { 'Authorization': 'Bearer dev-token' } // Replace with real token
      });
      const data = await res.json();
      setCampaigns(data.data || []);
    } catch (err) {
      message.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (values: any) => {
    console.log('提交的表单数据:', values);
    try {
      if (!values.dates || values.dates.length !== 2) {
        message.error('请选择活动时间');
        return;
      }
      const [start, end] = values.dates || [];
      const payload = {
        name: values.name,
        brandName: values.brandName,
        description: values.description,
        startDate: start.format('YYYY-MM-DD'),
        endDate: end.format('YYYY-MM-DD'),
        platforms: values.platforms,
      };
      const res = await fetch('http://localhost:3001/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev-token' // Replace with real token
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        message.success('Campaign created!');
        setModalOpen(false);
        form.resetFields();
        fetchCampaigns();
      } else {
        const err = await res.json();
        message.error(err.message || 'Failed to create campaign');
      }
    } catch (err) {
      message.error('Failed to create campaign');
    }
  };

  const columns: ColumnsType<Campaign> = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '品牌', dataIndex: 'brandName', key: 'brandName' },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '开始时间', dataIndex: 'startDate', key: 'startDate', render: d => dayjs(d).format('YYYY-MM-DD') },
    { title: '结束时间', dataIndex: 'endDate', key: 'endDate', render: d => dayjs(d).format('YYYY-MM-DD') },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '平台', dataIndex: 'platforms', key: 'platforms', render: (ps: string[]) => ps.map(p => platformOptions.find(opt => opt.value === p)?.label).join(', ') },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: d => dayjs(d).format('YYYY-MM-DD HH:mm') },
    { title: '二维码', dataIndex: 'qrCodeUrl', key: 'qrCodeUrl', render: (url?: string) => url ? <img src={url} alt="活动二维码" style={{ width: 200 }} /> : null },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>营销活动管理</h2>
      <Button type="primary" onClick={() => setModalOpen(true)} style={{ marginBottom: 16 }}>新建活动</Button>
      <Table
        columns={columns}
        dataSource={campaigns}
        rowKey="id"
        loading={loading}
        bordered
      />
      <Modal
        title="新建营销活动"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="创建"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            label="活动名称"
            name="name"
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="品牌名称"
            name="brandName"
            rules={[{ required: true, message: '请输入品牌名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述"> <Input.TextArea rows={2} /> </Form.Item>
          <Form.Item
            label="活动时间"
            name="dates"
            rules={[{ required: true, message: '请选择活动时间' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            label="投放平台"
            name="platforms"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select mode="multiple" options={platformOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Campaigns; 