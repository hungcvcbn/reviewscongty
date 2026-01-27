# MovieStream - Payment Integration Guide

## Giới thiệu

Tài liệu này mô tả chi tiết việc tích hợp thanh toán cho nền tảng **MovieStream**, bao gồm mô hình subscription và integration với VNPay, MoMo.

---

## 1. Mô hình Subscription

### 1.1. Các gói dịch vụ đề xuất

| Gói | Giá | Thời hạn | Quyền lợi |
|-----|-----|----------|-----------|
| **Miễn phí** | 0 VNĐ | - | Xem trailer, 2 tập đầu miễn phí |
| **Cơ bản** | 49,000 VNĐ | 1 tháng | Xem tất cả phim, chất lượng 720p |
| **Premium** | 79,000 VNĐ | 1 tháng | Xem tất cả + phim premium, 1080p, không QC |
| **VIP Năm** | 699,000 VNĐ | 12 tháng | Premium + giảm 26% + ưu tiên xem sớm |

### 1.2. Feature Matrix

| Feature | Miễn phí | Cơ bản | Premium | VIP Năm |
|---------|----------|--------|---------|---------|
| Xem trailer | ✓ | ✓ | ✓ | ✓ |
| 2 tập đầu miễn phí | ✓ | ✓ | ✓ | ✓ |
| Xem phim thường | ✗ | ✓ | ✓ | ✓ |
| Xem phim premium | ✗ | ✗ | ✓ | ✓ |
| Chất lượng 720p | ✗ | ✓ | ✓ | ✓ |
| Chất lượng 1080p | ✗ | ✗ | ✓ | ✓ |
| Không quảng cáo | ✗ | ✗ | ✓ | ✓ |
| Xem sớm 1 tuần | ✗ | ✗ | ✗ | ✓ |
| Giá | 0 | 49K/tháng | 79K/tháng | 699K/năm |

### 1.3. Database Schema cho Plans

```sql
-- plans table
CREATE TABLE plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  price INT NOT NULL, -- VND
  duration INT NOT NULL, -- days
  features JSONB NOT NULL,
  max_quality VARCHAR(10) DEFAULT '720p',
  can_watch_premium BOOLEAN DEFAULT FALSE,
  ads_free BOOLEAN DEFAULT FALSE,
  early_access_days INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sample data
INSERT INTO plans (id, name, slug, price, duration, features, max_quality, can_watch_premium, ads_free, early_access_days) VALUES
('plan_basic', 'Cơ bản', 'basic', 49000, 30, '["Xem phim thường", "Chất lượng 720p"]', '720p', false, false, 0),
('plan_premium', 'Premium', 'premium', 79000, 30, '["Xem tất cả phim", "Chất lượng 1080p", "Không quảng cáo"]', '1080p', true, true, 0),
('plan_vip_year', 'VIP Năm', 'vip-year', 699000, 365, '["Premium + Giảm 26%", "Xem sớm 1 tuần"]', '1080p', true, true, 7);
```

---

## 2. VNPay Integration

### 2.1. Tổng quan

**VNPay** là cổng thanh toán phổ biến nhất tại Việt Nam, hỗ trợ:
- Thẻ nội địa (ATM các ngân hàng VN)
- Thẻ quốc tế (Visa, Mastercard, JCB)
- QR Pay
- Ví VNPay

**Tài liệu chính thức**: https://sandbox.vnpayment.vn/apis/

### 2.2. Đăng ký tài khoản Merchant

1. Truy cập: https://merchants.vnpay.vn
2. Đăng ký tài khoản Business
3. Cung cấp giấy tờ pháp lý (ĐKKD, CMND/CCCD)
4. Nhận thông tin Sandbox để test
5. Sau khi review, nhận thông tin Production

**Thông tin cần lưu**:
```env
VNPAY_TMN_CODE=DEMO123     # Merchant ID
VNPAY_HASH_SECRET=ABCDEF   # Secret key for checksum
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html  # Sandbox
# Production: https://pay.vnpay.vn/vpcpay.html
VNPAY_RETURN_URL=https://yourdomain.com/payment/vnpay/return
```

### 2.3. Payment Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VNPay Payment Flow                              │
└─────────────────────────────────────────────────────────────────────────┘

User                    Frontend                Backend               VNPay
 │                         │                       │                    │
 │  1. Click "Thanh toán"  │                       │                    │
 │ ────────────────────────>                       │                    │
 │                         │                       │                    │
 │                         │  2. POST /payment/    │                    │
 │                         │     vnpay/create      │                    │
 │                         │ ──────────────────────>                    │
 │                         │                       │                    │
 │                         │                       │  3. Create order   │
 │                         │                       │     in database    │
 │                         │                       │                    │
 │                         │  4. Return VNPay URL  │                    │
 │                         │ <──────────────────────                    │
 │                         │                       │                    │
 │  5. Redirect to VNPay   │                       │                    │
 │ <────────────────────────                       │                    │
 │                         │                       │                    │
 │ ──────────────────────────────────────────────────────────────────────>
 │                                    6. User pays at VNPay             │
 │ <──────────────────────────────────────────────────────────────────────
 │                         │                       │                    │
 │  7. Redirect to         │                       │                    │
 │     Return URL          │                       │                    │
 │ ────────────────────────>                       │                    │
 │                         │                       │                    │
 │                         │  8. GET /payment/     │                    │
 │                         │     vnpay/return      │  9. IPN webhook    │
 │                         │ ──────────────────────> <───────────────────
 │                         │                       │                    │
 │                         │                       │  10. Verify &      │
 │                         │                       │      Process       │
 │                         │                       │                    │
 │                         │  11. Show result      │                    │
 │                         │ <──────────────────────                    │
 │                         │                       │                    │
 │  12. Success page       │                       │                    │
 │ <────────────────────────                       │                    │
```

### 2.4. Backend Implementation

**Create Payment Endpoint**:
```typescript
// routes/payment.routes.ts
import express from 'express';
import { createVnpayPayment, vnpayReturn, vnpayIPN } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/vnpay/create', authMiddleware, createVnpayPayment);
router.get('/vnpay/return', vnpayReturn);
router.post('/vnpay/ipn', vnpayIPN);

export default router;
```

**VNPay Service**:
```typescript
// services/vnpay.service.ts
import crypto from 'crypto';
import qs from 'qs';
import { format } from 'date-fns';

interface VnpayPaymentParams {
  orderId: string;
  amount: number; // VND
  orderInfo: string;
  ipAddr: string;
}

export function createVnpayPaymentUrl(params: VnpayPaymentParams): string {
  const vnpParams: Record<string, string | number> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: process.env.VNPAY_TMN_CODE!,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: params.orderId,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: 'subscription',
    vnp_Amount: params.amount * 100, // VNPay requires amount * 100
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL!,
    vnp_IpAddr: params.ipAddr,
    vnp_CreateDate: format(new Date(), 'yyyyMMddHHmmss'),
    vnp_ExpireDate: format(
      new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      'yyyyMMddHHmmss'
    ),
  };

  // Sort params alphabetically
  const sortedParams = sortObject(vnpParams);

  // Create query string
  const signData = qs.stringify(sortedParams, { encode: false });

  // Create HMAC SHA512 hash
  const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET!);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  // Add secure hash to params
  sortedParams.vnp_SecureHash = signed;

  // Build final URL
  const paymentUrl = `${process.env.VNPAY_URL}?${qs.stringify(sortedParams, { encode: false })}`;

  return paymentUrl;
}

export function verifyVnpayReturn(vnpParams: Record<string, string>): boolean {
  const secureHash = vnpParams.vnp_SecureHash;

  // Remove hash fields
  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  // Sort and create sign data
  const sortedParams = sortObject(vnpParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  // Verify hash
  const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET!);
  const checkSum = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return secureHash === checkSum;
}

function sortObject(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {} as Record<string, any>);
}
```

**Payment Controller**:
```typescript
// controllers/payment.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createVnpayPaymentUrl, verifyVnpayReturn } from '../services/vnpay.service';
import { processPaymentSuccess } from '../services/subscription.service';

export async function createVnpayPayment(req: Request, res: Response) {
  try {
    const { planId } = req.body;
    const userId = req.user!.id;

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        planId,
        amount: plan.price,
        method: 'VNPAY',
        status: 'PENDING',
      },
    });

    // Generate VNPay URL
    const paymentUrl = createVnpayPaymentUrl({
      orderId: payment.id,
      amount: plan.price,
      orderInfo: `Thanh toan goi ${plan.name} - MovieStream`,
      ipAddr: req.ip || '127.0.0.1',
    });

    res.json({ paymentUrl });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
}

export async function vnpayReturn(req: Request, res: Response) {
  try {
    const vnpParams = req.query as Record<string, string>;

    // Verify checksum
    if (!verifyVnpayReturn({ ...vnpParams })) {
      return res.redirect('/payment/failed?reason=invalid_checksum');
    }

    const orderId = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;

    if (responseCode === '00') {
      // Payment successful
      await processPaymentSuccess(orderId, vnpParams.vnp_TransactionNo);
      return res.redirect('/payment/success');
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: orderId },
        data: { status: 'FAILED' },
      });
      return res.redirect(`/payment/failed?code=${responseCode}`);
    }
  } catch (error) {
    console.error('VNPay return error:', error);
    res.redirect('/payment/failed?reason=error');
  }
}

export async function vnpayIPN(req: Request, res: Response) {
  try {
    const vnpParams = req.body as Record<string, string>;

    // Verify checksum
    if (!verifyVnpayReturn({ ...vnpParams })) {
      return res.json({ RspCode: '97', Message: 'Invalid Checksum' });
    }

    const orderId = vnpParams.vnp_TxnRef;
    const responseCode = vnpParams.vnp_ResponseCode;

    // Check if payment exists
    const payment = await prisma.payment.findUnique({
      where: { id: orderId },
    });

    if (!payment) {
      return res.json({ RspCode: '01', Message: 'Order not found' });
    }

    // Check if already processed
    if (payment.status !== 'PENDING') {
      return res.json({ RspCode: '02', Message: 'Order already confirmed' });
    }

    // Check amount
    const vnpAmount = parseInt(vnpParams.vnp_Amount) / 100;
    if (vnpAmount !== payment.amount) {
      return res.json({ RspCode: '04', Message: 'Invalid Amount' });
    }

    // Process payment
    if (responseCode === '00') {
      await processPaymentSuccess(orderId, vnpParams.vnp_TransactionNo);
    } else {
      await prisma.payment.update({
        where: { id: orderId },
        data: { status: 'FAILED' },
      });
    }

    return res.json({ RspCode: '00', Message: 'Confirm Success' });
  } catch (error) {
    console.error('VNPay IPN error:', error);
    return res.json({ RspCode: '99', Message: 'Unknown error' });
  }
}
```

**Subscription Service**:
```typescript
// services/subscription.service.ts
import { prisma } from '../lib/prisma';
import { addDays } from 'date-fns';

export async function processPaymentSuccess(paymentId: string, transactionNo: string) {
  return await prisma.$transaction(async (tx) => {
    // Update payment status
    const payment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: 'SUCCESS',
        providerId: transactionNo,
        processedAt: new Date(),
      },
      include: { plan: true },
    });

    // Calculate subscription end date
    const existingSub = await tx.subscription.findFirst({
      where: {
        userId: payment.userId,
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
    });

    const startDate = existingSub?.endDate || new Date();
    const endDate = addDays(startDate, payment.plan!.duration);

    // Create or update subscription
    await tx.subscription.upsert({
      where: {
        userId_planId: {
          userId: payment.userId,
          planId: payment.planId!,
        },
      },
      create: {
        userId: payment.userId,
        planId: payment.planId!,
        paymentId: payment.id,
        status: 'ACTIVE',
        startDate,
        endDate,
      },
      update: {
        status: 'ACTIVE',
        endDate,
        paymentId: payment.id,
      },
    });

    return payment;
  });
}
```

### 2.5. VNPay Response Codes

| Code | Meaning |
|------|---------|
| 00 | Giao dịch thành công |
| 07 | Trừ tiền thành công. Giao dịch bị nghi ngờ |
| 09 | Thẻ/Tài khoản chưa đăng ký Internet Banking |
| 10 | Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần |
| 11 | Đã hết hạn chờ thanh toán |
| 12 | Thẻ/Tài khoản bị khóa |
| 13 | Sai mật khẩu xác thực (OTP) |
| 24 | Khách hàng hủy giao dịch |
| 51 | Tài khoản không đủ số dư |
| 65 | Tài khoản đã vượt quá hạn mức giao dịch trong ngày |
| 75 | Ngân hàng đang bảo trì |
| 79 | Nhập sai mật khẩu quá số lần quy định |
| 99 | Lỗi không xác định |

---

## 3. MoMo Integration

### 3.1. Tổng quan

**MoMo** là ví điện tử phổ biến nhất tại Việt Nam với 30+ triệu users.

**Tài liệu chính thức**: https://developers.momo.vn

### 3.2. Đăng ký Partner

1. Truy cập: https://business.momo.vn
2. Đăng ký tài khoản Business
3. Hoàn thành KYC
4. Nhận thông tin Sandbox/Production

**Thông tin cần lưu**:
```env
MOMO_PARTNER_CODE=MOMO
MOMO_ACCESS_KEY=F8BBA842ECF85
MOMO_SECRET_KEY=K951B6PE1waDMi640xX08PD3vg6EkVlz
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api  # Sandbox
# Production: https://payment.momo.vn/v2/gateway/api
MOMO_RETURN_URL=https://yourdomain.com/payment/momo/return
MOMO_NOTIFY_URL=https://yourdomain.com/api/payment/momo/notify
```

### 3.3. MoMo Service Implementation

```typescript
// services/momo.service.ts
import crypto from 'crypto';
import axios from 'axios';

interface MomoPaymentParams {
  orderId: string;
  amount: number;
  orderInfo: string;
}

interface MomoPaymentResponse {
  partnerCode: string;
  requestId: string;
  orderId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
}

export async function createMomoPayment(params: MomoPaymentParams): Promise<MomoPaymentResponse> {
  const partnerCode = process.env.MOMO_PARTNER_CODE!;
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const requestId = `${partnerCode}${Date.now()}`;
  const extraData = ''; // Base64 encoded extra data

  // Create signature
  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${params.amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${process.env.MOMO_NOTIFY_URL}`,
    `orderId=${params.orderId}`,
    `orderInfo=${params.orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${process.env.MOMO_RETURN_URL}`,
    `requestId=${requestId}`,
    `requestType=captureWallet`,
  ].join('&');

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode,
    accessKey,
    requestId,
    amount: params.amount,
    orderId: params.orderId,
    orderInfo: params.orderInfo,
    redirectUrl: process.env.MOMO_RETURN_URL,
    ipnUrl: process.env.MOMO_NOTIFY_URL,
    extraData,
    requestType: 'captureWallet',
    signature,
    lang: 'vi',
  };

  const response = await axios.post<MomoPaymentResponse>(
    `${process.env.MOMO_ENDPOINT}/create`,
    requestBody
  );

  return response.data;
}

export function verifyMomoSignature(params: Record<string, any>): boolean {
  const {
    partnerCode,
    accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = params;

  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `message=${message}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `orderType=${orderType}`,
    `partnerCode=${partnerCode}`,
    `payType=${payType}`,
    `requestId=${requestId}`,
    `responseTime=${responseTime}`,
    `resultCode=${resultCode}`,
    `transId=${transId}`,
  ].join('&');

  const expectedSignature = crypto
    .createHmac('sha256', process.env.MOMO_SECRET_KEY!)
    .update(rawSignature)
    .digest('hex');

  return signature === expectedSignature;
}
```

**MoMo Controller**:
```typescript
// controllers/momo.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createMomoPayment, verifyMomoSignature } from '../services/momo.service';
import { processPaymentSuccess } from '../services/subscription.service';

export async function createMomoPaymentHandler(req: Request, res: Response) {
  try {
    const { planId } = req.body;
    const userId = req.user!.id;

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        planId,
        amount: plan.price,
        method: 'MOMO',
        status: 'PENDING',
      },
    });

    // Create MoMo payment
    const momoResponse = await createMomoPayment({
      orderId: payment.id,
      amount: plan.price,
      orderInfo: `Thanh toan goi ${plan.name} - MovieStream`,
    });

    if (momoResponse.resultCode !== 0) {
      return res.status(400).json({
        error: 'Failed to create MoMo payment',
        message: momoResponse.message,
      });
    }

    res.json({
      payUrl: momoResponse.payUrl,
      qrCodeUrl: momoResponse.qrCodeUrl,
      deeplink: momoResponse.deeplink,
    });
  } catch (error) {
    console.error('Create MoMo payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
}

export async function momoNotify(req: Request, res: Response) {
  try {
    const params = req.body;

    // Verify signature
    if (!verifyMomoSignature(params)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const orderId = params.orderId;
    const resultCode = params.resultCode;

    if (resultCode === 0) {
      // Success
      await processPaymentSuccess(orderId, params.transId);
    } else {
      // Failed
      await prisma.payment.update({
        where: { id: orderId },
        data: { status: 'FAILED' },
      });
    }

    // MoMo expects 204 No Content
    res.status(204).send();
  } catch (error) {
    console.error('MoMo notify error:', error);
    res.status(500).json({ error: 'Processing error' });
  }
}
```

---

## 4. Frontend Payment UI

### 4.1. Pricing Page Component

```typescript
// app/subscription/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    id: 'plan_basic',
    name: 'Cơ bản',
    price: 49000,
    duration: '1 tháng',
    features: [
      'Xem tất cả phim thường',
      'Chất lượng 720p',
      'Xem trên 1 thiết bị',
    ],
    popular: false,
  },
  {
    id: 'plan_premium',
    name: 'Premium',
    price: 79000,
    duration: '1 tháng',
    features: [
      'Xem tất cả phim kể cả Premium',
      'Chất lượng 1080p',
      'Không quảng cáo',
      'Xem trên 2 thiết bị',
    ],
    popular: true,
  },
  {
    id: 'plan_vip_year',
    name: 'VIP Năm',
    price: 699000,
    duration: '12 tháng',
    features: [
      'Tất cả quyền lợi Premium',
      'Tiết kiệm 26%',
      'Xem sớm 1 tuần',
      'Ưu tiên hỗ trợ',
    ],
    popular: false,
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'momo'>('vnpay');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const endpoint = paymentMethod === 'vnpay'
        ? '/api/payment/vnpay/create'
        : '/api/payment/momo/create';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const data = await res.json();

      if (data.paymentUrl || data.payUrl) {
        window.location.href = data.paymentUrl || data.payUrl;
      } else {
        alert('Không thể tạo thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        Chọn gói phù hợp với bạn
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'ring-2 ring-primary'
                : 'hover:shadow-lg'
            } ${plan.popular ? 'border-primary' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-center py-1 text-sm">
                Phổ biến nhất
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{plan.name}</span>
                <span className="text-2xl font-bold">
                  {formatPrice(plan.price)}
                </span>
              </CardTitle>
              <p className="text-muted-foreground">{plan.duration}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Chọn phương thức thanh toán</h2>

          <div className="flex gap-4 mb-6">
            <Button
              variant={paymentMethod === 'vnpay' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('vnpay')}
              className="flex-1"
            >
              VNPay
            </Button>
            <Button
              variant={paymentMethod === 'momo' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('momo')}
              className="flex-1"
            >
              MoMo
            </Button>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
          </Button>
        </div>
      )}
    </div>
  );
}
```

### 4.2. Payment Result Pages

```typescript
// app/payment/success/page.tsx
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto py-20 text-center">
      <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Thanh toán thành công!</h1>
      <p className="text-muted-foreground mb-8">
        Cảm ơn bạn đã đăng ký. Tài khoản của bạn đã được nâng cấp.
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/movies">Xem phim ngay</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/profile">Xem thông tin tài khoản</Link>
        </Button>
      </div>
    </div>
  );
}
```

```typescript
// app/payment/failed/page.tsx
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentFailedPage() {
  return (
    <div className="container mx-auto py-20 text-center">
      <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-4">Thanh toán thất bại</h1>
      <p className="text-muted-foreground mb-8">
        Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/subscription">Thử lại</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
```

---

## 5. Auto-Renewal (Tự động gia hạn)

### 5.1. Lưu ý quan trọng

VNPay và MoMo **KHÔNG hỗ trợ** recurring payment (thanh toán tự động định kỳ) như Stripe. Các giải pháp thay thế:

### 5.2. Phương án 1: Reminder + Manual Renewal

```typescript
// jobs/subscription-reminder.ts
// Chạy hàng ngày bằng cron job

import { prisma } from '../lib/prisma';
import { sendEmail } from '../services/email.service';
import { addDays } from 'date-fns';

export async function sendRenewalReminders() {
  // Find subscriptions expiring in 3 days
  const expiringSubscriptions = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        gte: new Date(),
        lte: addDays(new Date(), 3),
      },
    },
    include: {
      user: true,
      plan: true,
    },
  });

  for (const sub of expiringSubscriptions) {
    await sendEmail({
      to: sub.user.email,
      subject: 'Gói đăng ký của bạn sắp hết hạn - MovieStream',
      template: 'subscription-expiring',
      data: {
        userName: sub.user.name,
        planName: sub.plan.name,
        expiryDate: sub.endDate,
        renewUrl: `${process.env.FRONTEND_URL}/subscription?renew=true`,
      },
    });
  }
}
```

### 5.3. Phương án 2: In-app Notification

```typescript
// hooks/useSubscriptionStatus.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { differenceInDays } from 'date-fns';

export function useSubscriptionStatus() {
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => fetch('/api/subscription/current').then(r => r.json()),
  });

  const daysRemaining = subscription
    ? differenceInDays(new Date(subscription.endDate), new Date())
    : null;

  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7;
  const isExpired = daysRemaining !== null && daysRemaining < 0;

  return {
    subscription,
    daysRemaining,
    isExpiringSoon,
    isExpired,
  };
}

// Usage in layout
function SubscriptionBanner() {
  const { isExpiringSoon, daysRemaining } = useSubscriptionStatus();

  if (!isExpiringSoon) return null;

  return (
    <div className="bg-yellow-500 text-black px-4 py-2 text-center">
      Gói đăng ký của bạn sẽ hết hạn sau {daysRemaining} ngày.{' '}
      <Link href="/subscription" className="underline font-bold">
        Gia hạn ngay
      </Link>
    </div>
  );
}
```

---

## 6. Testing Checklist

### 6.1. VNPay Sandbox Testing

- [ ] Tạo payment thành công
- [ ] Verify checksum hoạt động
- [ ] Return URL xử lý đúng các response code
- [ ] IPN webhook nhận và xử lý được
- [ ] Subscription được tạo sau khi thanh toán thành công
- [ ] Handle duplicate IPN calls (idempotency)
- [ ] Handle payment timeout (code 11)
- [ ] Handle user cancel (code 24)

**VNPay Sandbox Test Cards**:
- Bank: NCB
- Card number: 9704198526191432198
- Name: NGUYEN VAN A
- Date: 07/15
- OTP: 123456

### 6.2. MoMo Sandbox Testing

- [ ] Tạo payment thành công
- [ ] QR code hiển thị đúng
- [ ] Deep link hoạt động trên mobile
- [ ] Notify webhook nhận và xử lý được
- [ ] Handle các error codes

**MoMo Sandbox**:
- Sử dụng app MoMo Test trên Android/iOS
- Hoặc approve payment trực tiếp trên Sandbox portal

---

## 7. Production Checklist

- [ ] Đổi endpoint từ Sandbox sang Production
- [ ] Cập nhật credentials Production
- [ ] HTTPS cho tất cả endpoints
- [ ] Logging đầy đủ cho transactions
- [ ] Monitoring cho payment failures
- [ ] Customer support process cho payment issues
- [ ] Refund process documentation
- [ ] PCI DSS compliance (không lưu thông tin thẻ)

---

*Tài liệu này được cập nhật lần cuối: Tháng 1/2026*
