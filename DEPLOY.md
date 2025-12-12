# 🚀 วิธี Deploy เกมปาร์ตี้ลง Netlify

## วิธีที่ 1: Netlify Drop (ง่ายที่สุด - 2 นาที)

1. ไปที่ **https://app.netlify.com/drop**
2. ลาก folder นี้ หรือไฟล์ `game.html` ไปวางในหน้าเว็บ
3. รอสักครู่ จะได้ลิงก์ทันที!

**ข้อดี:** ไม่ต้อง login, deploy ได้ทันที
**ข้อเสีย:** ทุกครั้งที่แก้ไขต้อง upload ใหม่

---

## วิธีที่ 2: Connect กับ GitHub (แนะนำ)

### ขั้นตอนที่ 1: Login Netlify
1. ไปที่ **https://netlify.com**
2. คลิก **Sign up** (หรือ Log in ถ้ามี account แล้ว)
3. เลือก **Sign up with GitHub** (ง่ายที่สุด)

### ขั้นตอนที่ 2: Import Project
1. คลิก **"Add new site"** → **"Import an existing project"**
2. เลือก **"Deploy with GitHub"**
3. เลือก repository: **Noppanut01/Party-game**

### ขั้นตอนที่ 3: Configure Settings
```
Branch to deploy: claude/party-card-game-012qPiNiFzSpPiq4ehvA1CgV
Build command: (ปล่อยว่าง)
Publish directory: . (หรือปล่อยว่าง)
```

### ขั้นตอนที่ 4: Deploy
1. คลิก **"Deploy site"**
2. รอ 30-60 วินาที
3. **เสร็จแล้ว!** จะได้ลิงก์แบบนี้:
   ```
   https://random-name-123.netlify.app
   ```

### ขั้นตอนที่ 5: เปลี่ยนชื่อ (ถ้าอยากได้ชื่อสวยๆ)
1. ใน Dashboard → **Site settings** → **Change site name**
2. เปลี่ยนเป็นชื่อที่ต้องการ เช่น `party-game-thai`
3. Save → ลิงก์จะกลายเป็น:
   ```
   https://party-game-thai.netlify.app
   ```

---

## วิธีที่ 3: ใช้ Netlify CLI (สำหรับนักพัฒนา)

### ติดตั้ง Netlify CLI
```bash
npm install -g netlify-cli
```

### Deploy
```bash
cd /path/to/Party-game
netlify login
netlify deploy --prod
```

เลือก publish directory: `. (current directory)`

---

## 🎯 หลังจาก Deploy แล้ว

ลิงก์ของคุณจะเป็นแบบนี้:
```
https://your-site-name.netlify.app
```

### คุณสามารถ:
- ✅ เปิดบน iPad, iPhone, Android ได้ทันที
- ✅ แชร์ลิงก์ให้เพื่อนๆ เล่นได้เลย
- ✅ ทุกครั้งที่ push code ใหม่จะ deploy อัตโนมัติ (ถ้าใช้วิธีที่ 2)
- ✅ ใช้ฟรี ไม่มีค่าใช้จ่าย

---

## 📱 ทดสอบบน iPad

1. เปิด Safari บน iPad
2. พิมพ์ลิงก์ที่ได้
3. เพิ่มเข้า Home Screen (เหมือนเป็น App!):
   - กด Share → **"Add to Home Screen"**
   - ตั้งชื่อ เช่น "เกมปาร์ตี้"
   - เสร็จแล้ว! มี icon บน Home Screen เหมือน App

---

## 🔧 Custom Domain (ถ้าต้องการ)

Netlify รองรับ custom domain ฟรี:
1. ซื้อ domain (เช่น partygame.com)
2. ใน Netlify: **Domain settings** → **Add custom domain**
3. ตั้งค่า DNS ตามที่ Netlify บอก
4. เสร็จแล้ว! ใช้ domain ของตัวเองได้

---

## 🎉 เสร็จแล้ว!

ตอนนี้เกมปาร์ตี้ของคุณพร้อมเล่นแล้ว! 🍻

มีปัญหาหรือข้อสงสัยไหม? ติดต่อได้เลย!
