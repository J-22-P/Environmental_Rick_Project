# Disaster Prediction Dashboard

ระบบทำนายภัยแล้งและน้ำท่วมโดยใช้ข้อมูลจาก API ต่างๆ เช่น ความชื้นในดิน การละลายของธารน้ำแข็ง อุณหภูมิพื้นผิวโลก ดัชนีจุดไฟป่า และระดับน้ำทะเล

## ฟีเจอร์หลัก

- **การเลือกโมเดลการทำนาย**: Linear Regression, Neural Network, Ensemble Model, Random Forest
- **การเลือกข้อมูล**: เลือกข้อมูลที่ต้องการใช้ในการทำนาย
- **การเลือกตำแหน่ง**: ค้นหาและเลือกตำแหน่งที่ต้องการทำนาย
- **การแสดงผลข้อมูล**: กราฟแสดงข้อมูลแบบ real-time
- **การทำนายภัยพิบัติ**: ทำนายความเสี่ยงภัยแล้งและน้ำท่วม
- **Responsive Design**: รองรับการใช้งานบนอุปกรณ์ต่างๆ

## ข้อมูลที่ใช้ในการทำนาย

1. **ความชื้นในดิน** - ข้อมูลความชื้นในดินจากดาวเทียม
2. **การละลายของธารน้ำแข็ง** - อัตราการละลายของธารน้ำแข็ง
3. **อุณหภูมิพื้นผิวโลก** - ข้อมูลอุณหภูมิพื้นผิวจากดาวเทียม
4. **ดัชนีจุดไฟป่า** - ดัชนีความเสี่ยงไฟป่า
5. **ระดับน้ำทะเล** - ข้อมูลระดับน้ำทะเลและแนวโน้ม

## โมเดลการทำนาย

- **Linear Regression**: โมเดลเชิงเส้นสำหรับการทำนายพื้นฐาน
- **Neural Network**: เครือข่ายประสาทเทียมสำหรับการทำนายที่ซับซ้อน
- **Ensemble Model**: การรวมหลายโมเดลเพื่อความแม่นยำสูง
- **Random Forest**: อัลกอริทึม Random Forest สำหรับข้อมูลขนาดใหญ่

## การติดตั้งและรัน

### ข้อกำหนดระบบ

- Node.js 16.0 หรือใหม่กว่า
- npm หรือ yarn

### การติดตั้ง

1. Clone repository:
```bash
git clone <repository-url>
cd disaster-prediction-dashboard
```

2. ติดตั้ง dependencies:
```bash
npm install
```

3. รันแอปพลิเคชัน:
```bash
npm start
```

4. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

### การ build สำหรับ production

```bash
npm run build
```

## โครงสร้างโปรเจค

```
src/
├── components/          # React components
│   ├── Header.tsx      # Header component
│   ├── ModelSelector.tsx    # Model selection
│   ├── FeatureSelector.tsx  # Feature selection
│   ├── LocationSelector.tsx # Location selection
│   ├── PredictionResult.tsx # Prediction results
│   └── DataVisualization.tsx # Data charts
├── services/           # API services
│   └── apiService.ts   # API integration
├── types/             # TypeScript types
│   └── index.ts       # Type definitions
├── hooks/             # Custom hooks
│   └── useDashboard.ts # Dashboard state management
├── App.tsx            # Main app component
├── index.tsx          # App entry point
└── index.css          # Global styles
```

## การใช้งาน

1. **เลือกตำแหน่ง**: ใช้ LocationSelector เพื่อเลือกตำแหน่งที่ต้องการทำนาย
2. **เลือกโมเดล**: เลือกโมเดลการทำนายที่ต้องการใช้
3. **เลือกข้อมูล**: เลือกข้อมูลที่ต้องการใช้ในการทำนาย (อย่างน้อย 2 ตัว)
4. **โหลดข้อมูล**: กดปุ่ม "โหลดข้อมูล" เพื่อดึงข้อมูลล่าสุด
5. **ทำนาย**: กดปุ่ม "ทำนายภัยพิบัติ" เพื่อดูผลการทำนาย

## API Integration

ระบบใช้ mock data สำหรับการพัฒนา ในโปรเจคจริงจะต้องเชื่อมต่อกับ API จริง:

- **Soil Moisture API**: ดึงข้อมูลความชื้นในดิน
- **Glacier API**: ดึงข้อมูลการละลายของธารน้ำแข็ง
- **Temperature API**: ดึงข้อมูลอุณหภูมิพื้นผิว
- **Fire Index API**: ดึงข้อมูลดัชนีจุดไฟป่า
- **Sea Level API**: ดึงข้อมูลระดับน้ำทะเล

## การปรับแต่ง

### Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ root:

```env
REACT_APP_API_BASE_URL=https://your-api-endpoint.com
```

### การเปลี่ยนสีธีม

แก้ไขไฟล์ `tailwind.config.js` เพื่อเปลี่ยนสีธีม:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // เปลี่ยนสีหลัก
      }
    }
  }
}
```

## เทคโนโลยีที่ใช้

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

## การพัฒนาต่อ

1. **เพิ่ม API จริง**: เชื่อมต่อกับ API จริงแทน mock data
2. **ปรับปรุงโมเดล**: เพิ่มโมเดลการทำนายที่ซับซ้อนขึ้น
3. **เพิ่มการแจ้งเตือน**: ระบบแจ้งเตือนเมื่อมีความเสี่ยงสูง
4. **เพิ่มการส่งออกข้อมูล**: ส่งออกผลการทำนายเป็น PDF หรือ Excel
5. **เพิ่มการเปรียบเทียบ**: เปรียบเทียบผลการทำนายระหว่างโมเดลต่างๆ

## License

MIT License

## ผู้พัฒนา

Disaster Prediction Dashboard Team
# Environmental_Rick_Project
