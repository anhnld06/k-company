# Công ty K - Pixel Canvas

Dự án mô phỏng cuộc sống văn phòng hàng ngày của 5 nhân vật tại Công ty K.

## Nhân vật

- **AnhNLD**
- **NhiBX**
- **DoanhLXQ**
- **TinhDT**
- **HuyNN**
- **HieuVQ**
- **DucDN**

## Phòng ban

- Phòng làm việc (máy tính)
- Phòng họp
- Phòng ăn
- Phòng vệ sinh
- Phòng nghỉ trưa
- Khu giải lao

## Cấu trúc

Dự án độc lập, assets nằm trong `src/assets/`:

```
k-company/
├── src/
│   ├── assets/
│   │   ├── characters/   (anhnld, nhibx, doanhlxq, tinhdt, huynn, hieuvq, ducdn)
│   │   └── map/         (housemap.png, wall.png, sun.png, moon.png)
│   ├── components/
│   ├── config/
│   ├── composables/
│   └── utils/
```

## Chạy dự án

```bash
cd k-company
npm install
npm run dev
```

## Build

```bash
npm run build
```
