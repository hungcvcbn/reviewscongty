# API Task List - Subscription & Payment Module

> **Module**: SUBSCRIPTION
> **HLD Reference**: HLD-MS-SUBSCRIPTION.md
> **User Stories**: US-SUB-01 đến US-SUB-07

---

## API Summary

| Category | Count | Phase |
|----------|-------|-------|
| Public APIs | 2 | MVP |
| User APIs | 4 | MVP |
| VNPay Webhooks | 2 | MVP |
| MoMo APIs | 2 | Phase 2 |
| Internal APIs | 1 | MVP |
| **Total MVP** | 9 | |

---

## Public APIs (2)

### 1. List Plans
| Field | Value |
|-------|-------|
| **US** | US-SUB-01 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subscription/plans` |
| **Operation ID** | `listPlans` |
| **Auth** | No |
| **Description** | Xem danh sách các gói subscription và so sánh quyền lợi |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_basic",
      "name": "Cơ bản",
      "slug": "co-ban",
      "price": 49000,
      "priceFormatted": "49,000đ",
      "duration": "1 tháng",
      "durationDays": 30,
      "features": [
        "Xem phim thường",
        "Chất lượng 720p"
      ],
      "maxQuality": "720p",
      "canWatchPremium": false,
      "popular": false
    },
    {
      "id": "plan_premium",
      "name": "Premium",
      "slug": "premium",
      "price": 79000,
      "priceFormatted": "79,000đ",
      "duration": "1 tháng",
      "durationDays": 30,
      "features": [
        "Xem tất cả phim kể cả Premium",
        "Chất lượng 1080p",
        "Không quảng cáo"
      ],
      "maxQuality": "1080p",
      "canWatchPremium": true,
      "popular": true
    },
    {
      "id": "plan_vip_year",
      "name": "VIP Năm",
      "slug": "vip-nam",
      "price": 699000,
      "priceFormatted": "699,000đ",
      "duration": "12 tháng",
      "durationDays": 365,
      "features": [
        "Premium + Giảm 26%",
        "Xem sớm 1 tuần"
      ],
      "maxQuality": "1080p",
      "canWatchPremium": true,
      "popular": false
    }
  ]
}
```

**Notes**:
- Chỉ return plans có is_active = true
- Sorted by sort_order

---

### 2. VNPay Return URL
| Field | Value |
|-------|-------|
| **US** | US-SUB-02 |
| **Method** | GET |
| **Endpoint** | `/api/v1/payment/vnpay/return` |
| **Operation ID** | `vnpayReturn` |
| **Auth** | No |
| **Description** | VNPay redirect về sau khi thanh toán |

**Query Parameters**: VNPay params (vnp_Amount, vnp_ResponseCode, etc.)

**Response**: Redirect to success/failed page

**Business Logic**:
1. Verify checksum
2. Check vnp_ResponseCode
3. Redirect to /payment/success or /payment/failed

---

## User APIs (4)

### 3. Get Current Subscription
| Field | Value |
|-------|-------|
| **US** | US-SUB-04 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subscription/current` |
| **Operation ID** | `getCurrentSubscription` |
| **Auth** | Yes |
| **Description** | Xem thông tin subscription hiện tại và ngày hết hạn |

**Response 200 (Has subscription)**:
```json
{
  "success": true,
  "data": {
    "id": "sub123",
    "plan": {
      "id": "plan_premium",
      "name": "Premium",
      "maxQuality": "1080p",
      "canWatchPremium": true
    },
    "status": "ACTIVE",
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-02-01T00:00:00Z",
    "daysRemaining": 5,
    "isExpiringSoon": true
  }
}
```

**Response 200 (No subscription)**:
```json
{
  "success": true,
  "data": null
}
```

**Notes**:
- isExpiringSoon = true nếu daysRemaining <= 7

---

### 4. Purchase Subscription
| Field | Value |
|-------|-------|
| **US** | US-SUB-02 |
| **Method** | POST |
| **Endpoint** | `/api/v1/subscription/purchase` |
| **Operation ID** | `createPayment` |
| **Auth** | Yes |
| **Description** | Tạo thanh toán subscription qua VNPay |

**Request Body**:
```json
{
  "planId": "string (required)",
  "paymentMethod": "VNPAY"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "paymentId": "pay123",
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
  }
}
```

**Errors**:
| Code | HTTP | Message |
|------|------|---------|
| SUB_PLAN_NOT_FOUND | 404 | Gói không tồn tại |

**Business Logic**:
1. Get plan details
2. Create payment record (PENDING)
3. Generate VNPay payment URL
4. Return URL for frontend redirect

---

### 5. Get Payment History
| Field | Value |
|-------|-------|
| **US** | US-SUB-06 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subscription/history` |
| **Operation ID** | `getPaymentHistory` |
| **Auth** | Yes |
| **Description** | Xem lịch sử thanh toán |

**Query Parameters**:
| Param | Type | Default |
|-------|------|---------|
| page | integer | 1 |
| limit | integer | 20 |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "pay123",
        "plan": {
          "id": "plan_premium",
          "name": "Premium"
        },
        "amount": 79000,
        "amountFormatted": "79,000đ",
        "method": "VNPAY",
        "status": "SUCCESS",
        "transactionId": "14123456",
        "createdAt": "2026-01-27T10:00:00Z",
        "processedAt": "2026-01-27T10:01:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### 6. Upgrade Subscription
| Field | Value |
|-------|-------|
| **US** | US-SUB-07 |
| **Method** | POST |
| **Endpoint** | `/api/v1/subscription/upgrade` |
| **Operation ID** | `upgradeSubscription` |
| **Auth** | Yes |
| **Description** | Nâng cấp gói subscription lên tier cao hơn |

**Request Body**:
```json
{
  "planId": "string (required, higher tier plan)",
  "paymentMethod": "VNPAY"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "paymentId": "pay456",
    "paymentUrl": "https://...",
    "upgradeSummary": {
      "currentPlan": "Cơ bản",
      "newPlan": "Premium",
      "priceDifference": 30000
    }
  }
}
```

**Notes**:
- Tính price difference nếu còn thời gian
- MVP: Có thể implement đơn giản = full price for new plan

---

## VNPay Webhook APIs (2)

### 7. VNPay IPN (Instant Payment Notification)
| Field | Value |
|-------|-------|
| **US** | US-SUB-02 |
| **Method** | POST |
| **Endpoint** | `/api/v1/payment/vnpay/ipn` |
| **Operation ID** | `vnpayIPN` |
| **Auth** | No (checksum verification) |
| **Description** | VNPay webhook để xác nhận thanh toán |

**Request Body**: VNPay IPN params

**Response**:
```json
{
  "RspCode": "00",
  "Message": "Confirm Success"
}
```

**Response Codes**:
| RspCode | Meaning |
|---------|---------|
| 00 | Success |
| 01 | Order not found |
| 02 | Already processed |
| 04 | Amount mismatch |
| 97 | Invalid checksum |

**Business Logic (Idempotent)**:
1. Verify checksum
2. Find payment by order_id
3. Check if already processed
4. Verify amount matches
5. BEGIN TRANSACTION
6. Update payment status
7. Create/Update subscription
8. COMMIT
9. Return response

---

## Internal APIs (1)

### 8. Check Subscription Status
| Field | Value |
|-------|-------|
| **US** | - (Internal) |
| **Method** | GET |
| **Endpoint** | `/api/v1/subscription/status/:userId` |
| **Operation ID** | `checkSubscriptionStatus` |
| **Auth** | Internal service-to-service |
| **Description** | Streaming service gọi để check premium access |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "active": true,
    "plan": "PREMIUM",
    "canWatchPremium": true,
    "maxQuality": "1080p",
    "expiresAt": "2026-02-01T00:00:00Z"
  }
}
```

**Response 200 (No subscription)**:
```json
{
  "success": true,
  "data": {
    "active": false
  }
}
```

**Notes**:
- Auto-expire subscriptions if endDate < NOW()

---

## Phase 2 APIs - MoMo (2)

### 9. Create MoMo Payment (Phase 2)
| Field | Value |
|-------|-------|
| **US** | US-SUB-03 |
| **Method** | POST |
| **Endpoint** | `/api/v1/payment/momo/create` |
| **Operation ID** | `createMomoPayment` |
| **Phase** | 2 |

---

### 10. MoMo Notify Webhook (Phase 2)
| Field | Value |
|-------|-------|
| **US** | US-SUB-03 |
| **Method** | POST |
| **Endpoint** | `/api/v1/payment/momo/notify` |
| **Operation ID** | `momoNotify` |
| **Phase** | 2 |

---

## Subscription State Machine

```
┌─────────────────────────────────────────────────────────┐
│                 Subscription States                      │
└─────────────────────────────────────────────────────────┘

    [*] ─────> ACTIVE ─────> EXPIRED ─────> ACTIVE
                  │                            ▲
                  │                            │
                  └──────> CANCELLED ──────────┘
                              (no refund)
```

| Status | Can Watch Premium | Editable |
|--------|-------------------|----------|
| ACTIVE | Yes | Yes (renew) |
| EXPIRED | No | Yes (renew) |
| CANCELLED | No | Yes (buy again) |

---

## VNPay Integration

### Configuration
```env
VNPAY_TMN_CODE=DEMO123
VNPAY_HASH_SECRET=ABCDEF
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://moviestream.vn/payment/vnpay/return
```

### VNPay Response Codes
| Code | Meaning |
|------|---------|
| 00 | Giao dịch thành công |
| 07 | Giao dịch bị nghi ngờ |
| 09 | Thẻ chưa đăng ký Internet Banking |
| 10 | Xác thực sai quá 3 lần |
| 11 | Hết hạn chờ thanh toán |
| 12 | Thẻ bị khóa |
| 24 | User hủy giao dịch |
| 51 | Không đủ số dư |
| 99 | Lỗi không xác định |

---

## Payment Flow Diagram

```
User        Frontend         Backend           VNPay
 │              │               │                │
 │ Click Pay    │               │                │
 │─────────────>│               │                │
 │              │ POST purchase │                │
 │              │──────────────>│                │
 │              │               │ Create payment │
 │              │               │ (PENDING)      │
 │              │               │                │
 │              │ Payment URL   │                │
 │              │<──────────────│                │
 │              │               │                │
 │ Redirect     │               │                │
 │<─────────────│               │                │
 │              │               │                │
 │ Pay at VNPay │───────────────────────────────>│
 │              │               │                │
 │<───────────────────────────────────────────────
 │              │               │                │
 │ Redirect     │               │    IPN         │
 │─────────────>│               │<───────────────│
 │              │ Return page   │                │
 │              │──────────────>│ Process        │
 │              │               │ payment        │
 │              │               │                │
 │              │ Success page  │                │
 │<─────────────│<──────────────│                │
```

---

## Cron Jobs

### Check Expiring Subscriptions (Daily 9:00 AM)
```typescript
async function sendRenewalReminders() {
  const expiring = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        gte: new Date(),
        lte: addDays(new Date(), 3),
      },
    },
    include: { user: true, plan: true },
  });

  for (const sub of expiring) {
    await sendEmail({
      to: sub.user.email,
      template: 'subscription-expiring',
      data: { ... }
    });
  }
}
```

### Auto-Expire Subscriptions (Hourly)
```typescript
async function autoExpireSubscriptions() {
  await prisma.subscription.updateMany({
    where: {
      status: 'ACTIVE',
      endDate: { lt: new Date() },
    },
    data: {
      status: 'EXPIRED',
      updatedAt: new Date(),
    },
  });
}
```

---

## Error Codes

| Code | HTTP | Message |
|------|------|---------|
| SUB_PLAN_NOT_FOUND | 404 | Gói không tồn tại |
| SUB_ALREADY_ACTIVE | 400 | Bạn đã có subscription active |
| SUB_PAYMENT_FAILED | 400 | Thanh toán thất bại |
| SUB_INVALID_CHECKSUM | 400 | Checksum không hợp lệ |
| SUB_AMOUNT_MISMATCH | 400 | Số tiền không khớp |

---

## Business Rules

- User chỉ có 1 active subscription tại 1 thời điểm
- Gia hạn trước hết hạn → cộng dồn thời gian
- Subscription không hoàn tiền
- Webhook phải idempotent
- Gửi email nhắc gia hạn trước 3 ngày

---

*Document Version: 1.0*
*Created: January 2026*
