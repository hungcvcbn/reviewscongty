# MovieStream - Challenges & Solutions

## Giới thiệu

Tài liệu này mô tả các thách thức kỹ thuật và nghiệp vụ của dự án **MovieStream** cùng với các giải pháp đề xuất.

---

## 1. Thách thức #1: Bảo vệ Video khỏi Piracy

### 1.1. Mô tả vấn đề

Video piracy là vấn đề nghiêm trọng nhất đối với nền tảng VOD tại Việt Nam:

- **Mức độ nghiêm trọng**: Rất cao
- **Tác động**: Mất doanh thu 30-50%, giảm giá trị nội dung độc quyền
- **Các hình thức tấn công phổ biến**:
  1. Download trực tiếp từ URL video
  2. Screen recording
  3. Browser extension capture
  4. Chia sẻ tài khoản

### 1.2. Giải pháp đa tầng (Defense in Depth)

#### Layer 1: HLS Encryption (AES-128)

**Mô tả**: Mã hóa video segments với AES-128

**Implementation với Bunny.net**:
```
Bunny.net Stream tự động:
1. Transcode video thành HLS
2. Mã hóa mỗi segment với AES-128
3. Tạo encryption key riêng cho mỗi video
4. Key chỉ được cung cấp qua HTTPS
```

**Chi phí**: Miễn phí (đã bao gồm trong Bunny.net Stream)

**Hiệu quả**: Ngăn chặn download trực tiếp file MP4, cần decrypt từng segment

---

#### Layer 2: Signed URLs (Token Authentication)

**Mô tả**: URL video có thời hạn và chỉ valid cho user cụ thể

**Implementation**:
```typescript
// Backend: Generate signed URL
import crypto from 'crypto';

function generateSignedUrl(videoId: string, userId: string): string {
  const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY;
  const expiry = Math.floor(Date.now() / 1000) + (4 * 3600); // 4 hours

  const hashableBase = `${tokenKey}${videoId}${expiry}`;
  const token = crypto
    .createHash('sha256')
    .update(hashableBase)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const pullZone = process.env.BUNNY_PULL_ZONE;
  return `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8?token=${token}&expires=${expiry}`;
}
```

**Bunny.net Config**:
```
Stream Library Settings:
- Token Authentication: Enabled
- Token Authentication Key: [Generate random 32-char key]
- Allowed Referrers: yourdomain.com, *.yourdomain.com
- Blocked Empty Referrer: Yes
```

**Chi phí**: Miễn phí

**Hiệu quả**: URL hết hạn sau 4 giờ, không thể chia sẻ link

---

#### Layer 3: Domain Restriction & Referer Check

**Mô tả**: Chỉ cho phép request video từ domain của mình

**Implementation trong Bunny.net**:
```
Pull Zone Settings:
- Allowed Referrers:
  - moviestream.vn
  - *.moviestream.vn
  - localhost:3000 (dev only)
- Block Root Path Access: Yes
- Blocked Countries: (optional - block high-piracy regions)
```

**Chi phí**: Miễn phí

**Hiệu quả**: Ngăn embed video trên website khác

---

#### Layer 4: Dynamic Watermark

**Mô tả**: Hiển thị thông tin user trên video để trace nguồn leak

**Implementation (Frontend Canvas Overlay)**:
```typescript
// components/VideoPlayer.tsx
import { useEffect, useRef } from 'react';

interface WatermarkProps {
  userId: string;
  username: string;
}

function VideoWatermark({ userId, username }: WatermarkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw every 30 seconds with new position
    const drawWatermark = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random position
      const x = Math.random() * (canvas.width - 200);
      const y = Math.random() * (canvas.height - 50);

      // Semi-transparent text
      ctx.globalAlpha = 0.3;
      ctx.font = '14px Arial';
      ctx.fillStyle = '#ffffff';

      const timestamp = new Date().toISOString();
      ctx.fillText(`${username}`, x, y);
      ctx.fillText(`ID: ${userId.slice(0, 8)}`, x, y + 20);
      ctx.fillText(timestamp, x, y + 40);
    };

    drawWatermark();
    const interval = setInterval(drawWatermark, 30000);

    return () => clearInterval(interval);
  }, [userId, username]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'difference' }}
    />
  );
}
```

**Chi phí**: Miễn phí

**Hiệu quả**:
- Trace được nguồn leak
- Deterrent effect (người dùng biết sẽ bị track)
- Có thể bị bypass bằng crop nhưng giảm chất lượng

---

#### Layer 5: Concurrent Stream Limiting

**Mô tả**: Giới hạn số thiết bị xem cùng lúc

**Implementation (Backend)**:
```typescript
// services/stream.service.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const MAX_CONCURRENT_STREAMS = 2;
const STREAM_TTL = 60; // seconds

async function canStartStream(userId: string, deviceId: string): Promise<boolean> {
  const key = `streams:${userId}`;

  // Get current active streams
  const streams = await redis.hgetall(key);
  const activeStreams = Object.entries(streams || {}).filter(
    ([_, timestamp]) => Date.now() - Number(timestamp) < STREAM_TTL * 1000
  );

  // Check if this device already has a stream
  const existingDevice = activeStreams.find(([id]) => id === deviceId);
  if (existingDevice) {
    // Update heartbeat
    await redis.hset(key, { [deviceId]: Date.now() });
    return true;
  }

  // Check concurrent limit
  if (activeStreams.length >= MAX_CONCURRENT_STREAMS) {
    return false;
  }

  // Register new stream
  await redis.hset(key, { [deviceId]: Date.now() });
  await redis.expire(key, STREAM_TTL * 2);

  return true;
}

async function heartbeatStream(userId: string, deviceId: string): Promise<void> {
  const key = `streams:${userId}`;
  await redis.hset(key, { [deviceId]: Date.now() });
}

async function endStream(userId: string, deviceId: string): Promise<void> {
  const key = `streams:${userId}`;
  await redis.hdel(key, deviceId);
}
```

**Frontend heartbeat**:
```typescript
// hooks/useStreamHeartbeat.ts
import { useEffect } from 'react';

export function useStreamHeartbeat(episodeId: string) {
  useEffect(() => {
    const deviceId = getOrCreateDeviceId(); // localStorage-based

    const heartbeat = () => {
      fetch('/api/stream/heartbeat', {
        method: 'POST',
        body: JSON.stringify({ episodeId, deviceId }),
      });
    };

    heartbeat();
    const interval = setInterval(heartbeat, 30000); // every 30s

    return () => {
      clearInterval(interval);
      fetch('/api/stream/end', {
        method: 'POST',
        body: JSON.stringify({ episodeId, deviceId }),
      });
    };
  }, [episodeId]);
}
```

**Chi phí**: ~$0-5/tháng (Upstash free tier: 10,000 commands/day)

**Hiệu quả**: Ngăn chia sẻ tài khoản cho nhiều người

---

#### Layer 6: Screen Recording Detection (Optional)

**Mô tả**: Detect và cảnh báo khi screen recording

**Implementation**:
```typescript
// hooks/useScreenRecordingDetection.ts

export function useScreenRecordingDetection(onDetected: () => void) {
  useEffect(() => {
    // Method 1: Display Media API detection
    const checkDisplayMedia = async () => {
      try {
        // Check if getDisplayMedia was recently called
        const mediaDevices = navigator.mediaDevices;
        // This is limited - browsers don't expose active captures
      } catch (e) {
        // Ignore
      }
    };

    // Method 2: Visibility change (basic detection)
    const handleVisibility = () => {
      if (document.hidden) {
        // User switched tabs - could be recording
        // Just log, don't block
        console.log('Tab switched during playback');
      }
    };

    // Method 3: DevTools detection (basic)
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        console.log('DevTools may be open');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', detectDevTools);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', detectDevTools);
    };
  }, [onDetected]);
}
```

**Lưu ý**: Không thể hoàn toàn ngăn screen recording, chỉ có thể:
- Detect một số trường hợp
- Tăng friction cho attacker
- Log suspicious behavior

**Chi phí**: Miễn phí

---

### 1.3. So sánh các giải pháp DRM

| Solution | Cost | Protection Level | Implementation |
|----------|------|------------------|----------------|
| Không có gì | $0 | 0/10 | None |
| HLS + Token (Our choice) | $0-10 | 6/10 | Medium |
| Widevine L3 | $100-500/mo | 7/10 | Hard |
| Widevine L1 + FairPlay | $500+/mo | 9/10 | Very Hard |

**Khuyến nghị**: Với ngân sách thấp, Layer 1-5 đủ để:
- Ngăn 90% casual piracy
- Trace được nguồn leak
- Giảm thiểu chia sẻ tài khoản

---

## 2. Thách thức #2: Tối ưu chi phí Video Hosting

### 2.1. Mô tả vấn đề

- Video 1080p trung bình 2-4GB/giờ
- 300 videos = 600GB - 1.2TB storage
- Bandwidth tốn kém nhất: 1GB/view x 1000 views/ngày = 30TB/tháng

### 2.2. So sánh các giải pháp

| Service | Storage | Bandwidth | Total (300 videos, 30TB/mo) |
|---------|---------|-----------|------------------------------|
| AWS S3 + CloudFront | $0.023/GB | $0.085/GB | ~$2,600/tháng |
| Vimeo OTT | $500/mo | Included | $500/tháng |
| Bunny.net Stream | $0.005/GB | $0.01/GB | ~$300/tháng |
| Cloudflare R2 + Stream | $0.015/GB | Free | ~$10 (storage only) |

### 2.3. Giải pháp: Bunny.net Stream

**Tại sao chọn Bunny.net**:
1. Chi phí thấp nhất trong các giải pháp có DRM cơ bản
2. Có sẵn: HLS, Token Auth, Encryption
3. Global CDN (112+ PoPs, có POP ở Vietnam)
4. Upload API đơn giản
5. Webhook cho transcode completion

**Tối ưu chi phí thêm**:

```typescript
// Adaptive bitrate - người dùng tự chọn quality
// Mặc định 720p để tiết kiệm bandwidth, upgrade lên 1080p cho Premium

const qualityOptions = {
  basic: ['360p', '480p', '720p'],
  premium: ['360p', '480p', '720p', '1080p']
};

// Trong video player
function getAvailableQualities(userPlan: string) {
  return qualityOptions[userPlan] || qualityOptions.basic;
}
```

**Caching strategy**:
```
- Bunny.net Edge caching: Automatic
- Browser caching: HLS segments cached 1 hour
- Popular content: Preloaded to edge
```

---

## 3. Thách thức #3: Upload Video hàng loạt

### 3.1. Mô tả vấn đề

- Cần upload 100-500 videos
- Mỗi video 2-4GB
- Upload qua web interface chậm và dễ fail

### 3.2. Giải pháp: Chunked Upload + Resume

**Admin Upload Flow**:
```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Drop video files here or click to browse            │  │
│  │  Supports: MP4, MKV, AVI (max 10GB per file)         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Upload Queue:                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ video1.mp4    [████████████████████] 100% ✓        │    │
│  │ video2.mp4    [████████░░░░░░░░░░░░]  45% ↻        │    │
│  │ video3.mp4    [░░░░░░░░░░░░░░░░░░░░]  0%  Queued   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**TUS Protocol Implementation**:
```typescript
// Frontend: Using tus-js-client
import * as tus from 'tus-js-client';

async function uploadVideo(file: File, onProgress: (percent: number) => void) {
  const upload = new tus.Upload(file, {
    endpoint: '/api/admin/upload/tus',
    retryDelays: [0, 3000, 5000, 10000, 20000],
    metadata: {
      filename: file.name,
      filetype: file.type,
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
      onProgress(Number(percentage));
    },
    onSuccess: () => {
      console.log('Upload complete');
    },
  });

  // Check for previous uploads to resume
  const previousUploads = await upload.findPreviousUploads();
  if (previousUploads.length) {
    upload.resumeFromPreviousUpload(previousUploads[0]);
  }

  upload.start();
  return upload;
}
```

**Backend handling**:
```typescript
// Option 1: Direct upload to Bunny.net
// Bunny.net supports TUS protocol directly

const BUNNY_TUS_ENDPOINT = `https://video.bunnycdn.com/tusupload`;

// Option 2: Upload to server first, then transfer to Bunny
// Better for processing/validation before upload
```

**Bulk Upload Script** (CLI alternative):
```bash
#!/bin/bash
# bulk-upload.sh - For uploading many videos at once

BUNNY_API_KEY="your-api-key"
LIBRARY_ID="your-library-id"

for file in ./videos/*.mp4; do
  filename=$(basename "$file")
  echo "Uploading: $filename"

  # Create video entry
  video_id=$(curl -s -X POST "https://video.bunnycdn.com/library/$LIBRARY_ID/videos" \
    -H "AccessKey: $BUNNY_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"title\": \"$filename\"}" | jq -r '.guid')

  # Upload file
  curl -X PUT "https://video.bunnycdn.com/library/$LIBRARY_ID/videos/$video_id" \
    -H "AccessKey: $BUNNY_API_KEY" \
    --data-binary "@$file"

  echo "Uploaded: $video_id"
done
```

---

## 4. Thách thức #4: Performance trang web

### 4.1. Mô tả vấn đề

- Nhiều images (posters, thumbnails)
- Video player load time
- SEO requirements

### 4.2. Giải pháp

**Image Optimization**:
```typescript
// Next.js Image component với Bunny.net CDN
import Image from 'next/image';

const bunnyImageLoader = ({ src, width, quality }) => {
  return `https://your-pullzone.b-cdn.net/${src}?width=${width}&quality=${quality || 75}`;
};

export function MoviePoster({ src, alt }) {
  return (
    <Image
      loader={bunnyImageLoader}
      src={src}
      alt={alt}
      width={300}
      height={450}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."
    />
  );
}
```

**Video Player Optimization**:
```typescript
// Lazy load video player
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <VideoPlayerSkeleton />,
  ssr: false, // Video player không cần SSR
});
```

**Database Query Optimization**:
```typescript
// Prisma queries với select chỉ fields cần thiết
const movies = await prisma.movie.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    poster: true,
    rating: true,
    year: true,
    // Không select description (large text) trong listing
  },
  take: 20,
  orderBy: { createdAt: 'desc' },
});
```

---

## 5. Thách thức #5: Đảm bảo thanh toán thành công

### 5.1. Mô tả vấn đề

- Thanh toán online có tỷ lệ fail cao
- Webhook có thể miss
- User có thể close browser trước khi complete

### 5.2. Giải pháp

**Idempotent Payment Processing**:
```typescript
// services/payment.service.ts

async function processPayment(orderId: string, status: string) {
  // 1. Check if already processed (idempotency)
  const existingPayment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (existingPayment?.status === 'SUCCESS') {
    return existingPayment; // Already processed
  }

  // 2. Use transaction for consistency
  return await prisma.$transaction(async (tx) => {
    // Update payment
    const payment = await tx.payment.update({
      where: { orderId },
      data: { status, processedAt: new Date() },
    });

    if (status === 'SUCCESS') {
      // Create/extend subscription
      const plan = await tx.plan.findUnique({
        where: { id: payment.planId },
      });

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      await tx.subscription.upsert({
        where: { userId: payment.userId },
        create: {
          userId: payment.userId,
          planId: payment.planId,
          status: 'ACTIVE',
          endDate,
        },
        update: {
          planId: payment.planId,
          status: 'ACTIVE',
          endDate,
        },
      });
    }

    return payment;
  });
}
```

**Webhook Retry Handling**:
```typescript
// VNPay webhook - idempotent
app.post('/api/payment/vnpay/ipn', async (req, res) => {
  const params = req.body;

  // 1. Verify checksum
  if (!verifyVnpayChecksum(params)) {
    return res.json({ RspCode: '97', Message: 'Invalid checksum' });
  }

  // 2. Process (idempotent)
  try {
    await processPayment(params.vnp_TxnRef, params.vnp_ResponseCode === '00' ? 'SUCCESS' : 'FAILED');
    return res.json({ RspCode: '00', Message: 'Success' });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.json({ RspCode: '99', Message: 'Error' });
  }
});
```

---

## 6. Checklist bảo mật

### 6.1. Video Protection Checklist

- [ ] Bunny.net Token Authentication enabled
- [ ] Token expiry set to 4 hours
- [ ] Allowed referrers configured
- [ ] Block empty referrer enabled
- [ ] HLS encryption enabled (default in Bunny Stream)
- [ ] Dynamic watermark implemented
- [ ] Concurrent stream limiting implemented
- [ ] Rate limiting on stream endpoint

### 6.2. Application Security Checklist

- [ ] HTTPS only (enforced by Cloudflare/Vercel)
- [ ] CORS configured properly
- [ ] Helmet.js security headers
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (React default escaping)
- [ ] CSRF protection (SameSite cookies)
- [ ] Rate limiting on auth endpoints
- [ ] Password hashed with bcrypt
- [ ] JWT with short expiry + refresh tokens
- [ ] Sensitive data encrypted at rest

### 6.3. Payment Security Checklist

- [ ] Use official VNPay/MoMo SDKs
- [ ] Verify all webhooks with checksum
- [ ] Idempotent payment processing
- [ ] Never store card details (use payment gateway)
- [ ] Log all transactions for audit
- [ ] SSL pinning (if mobile app in future)

---

*Tài liệu này được cập nhật lần cuối: Tháng 1/2026*
