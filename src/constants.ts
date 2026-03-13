export const TILE_SIZE = 40
export const GRID_W = 20
export const GRID_H = 15
export const CANVAS_WIDTH = GRID_W * TILE_SIZE
export const CANVAS_HEIGHT = GRID_H * TILE_SIZE
export const WALKABLE_AREA = { minX: 1, maxX: 18, minY: 1, maxY: 13 }

// Công ty K: Phòng làm việc (máy tính), phòng họp, phòng ngủ, phòng ăn, phòng vệ sinh
// Bản đồ 20x15 - điều chỉnh theo layout housemap.png
export const ACTION_ZONES = [
  // Phòng làm việc - máy tính (khu vực bàn làm việc)
  {
    name: 'Làm việc',
    icon: '💻',
    delay: 4000,
    rects: [
      { x1: 2, y1: 2, x2: 4.5, y2: 5 },
      { x1: 5.5, y1: 2, x2: 8, y2: 5 },
      { x1: 9, y1: 2, x2: 11.5, y2: 5 },
    ],
  },
  // Phòng họp
  {
    name: 'Họp',
    icon: '📋',
    delay: 5000,
    rect: { x1: 12, y1: 2, x2: 16, y2: 5 },
    targetPos: { x: 14, y: 3.5 },
  },
  // Phòng ăn
  {
    name: 'Ăn trưa',
    icon: '🍽️',
    delay: 3000,
    rect: { x1: 2, y1: 6, x2: 6, y2: 9 },
    targetPos: { x: 4, y: 7.5 },
  },
  // Phòng vệ sinh
  {
    name: 'Vệ sinh',
    icon: '🚻',
    delay: 2000,
    rect: { x1: 16.5, y1: 1, x2: 19, y2: 4 },
    targetPos: { x: 17.5, y: 2.5 },
  },
  // Phòng nghỉ trưa
  {
    name: 'Nghỉ trưa',
    icon: '💤',
    delay: 6000,
    rect: { x1: 16, y1: 7, x2: 19, y2: 11 },
    targetPos: { x: 17.5, y: 9 },
  },
  // Khu giải lao / cà phê
  {
    name: 'Giải lao',
    icon: '☕',
    delay: 2000,
    rect: { x1: 7, y1: 6, x2: 11, y2: 9 },
  },
]
