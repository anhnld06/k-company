import type { DialogueScript } from '../types'

export const DIALOGUE_SCRIPTS: DialogueScript[] = [
  {
    id: 'office-chat-1',
    lines: [
      { agentId: 'huynn', text: 'BTC sập rồi ae ơi!', duration: 3000 },
      { agentId: 'nhibx', text: 'Long thôi chứ còn gì nữa kkk', duration: 2500 },
      { agentId: 'doanhlxq', text: 'Nhị làm gì thì ae làm ngược lại là được :v', duration: 2500 },
      { agentId: 'hieuvq', text: 'Bú', duration: 2000 },
      { agentId: 'anhnld', text: 'Khó lói hè', duration: 2000 },
    ],
  },
  {
    id: 'coffee-break',
    lines: [
      { agentId: 'doanhlxq', text: 'Xún kind cf tốc váy ae?', duration: 2500 },
      { agentId: 'huynn', text: 'Kêu em ly chanh nóng không đường có mật ong nghe', duration: 2200 },
      { agentId: 'nhibx', text: 'Tao ad nhé', duration: 2200 },
      { agentId: 'ducdn', text: 'Ok a.', duration: 2000 },
      { agentId: 'hieuvq', text: 'Đi đi, tôi mời.', duration: 2000 },
      { agentId: 'tinhdt', text: 'Hiệu đưa máy t đánh cho kkk', duration: 2000 },
    ],
  },
  {
    id: 'football-match',
    lines: [
      { agentId: 'huynn', text: 'Xuống công viên làm kèo t8 t4 đê', duration: 3000 },
      { agentId: 'doanhlxq', text: 'Mấy con gà t4 đâu???', duration: 3000 },
      { agentId: 'hieuvq', text: 'Bố ngán ai bao giờ đâu', duration: 2000 },
      { agentId: 'nhibx', text: 'Tao ngủ miếng', duration: 2000 },
      { agentId: 'ducdn', text: 'Rủ mấy anh Huế k mấy anh', duration: 2500 },
      { agentId: 'anhnld', text: 'Go go go', duration: 2000 },
      { agentId: 'tinhdt', text: 'E lên tokyo nghe, bye ae', duration: 2000 },
    ],
  },
  {
    id: 'coin-pump',
    lines: [
      { agentId: 'tinhdt', text: 'Ơ coin mình pump rồi kìa!', duration: 2600 },
      { agentId: 'nhibx', text: 'Chưa take profit à?', duration: 2400 },
      { agentId: 'doanhlxq', text: 'Để thêm chút, target chưa tới.', duration: 2800 },
      { agentId: 'huynn', text: 'Nhớ set stop loss nhé ae.', duration: 2500 },
    ],
  },
  {
    id: 'lunch-break',
    lines: [
      { agentId: 'nhibx', text: 'Trưa ni ăn chi hè?', duration: 3000 },
      { agentId: 'anhnld', text: 'Bún tài xỉu đi', duration: 2500 },
      { agentId: 'hieuvq', text: 'Ăn c gì trả được', duration: 2800 },
      { agentId: 'doanhlxq', text: 'Go', duration: 2500 },
      { agentId: 'huynn', text: 'Chưa, đợi e fix bug xong đã.', duration: 3000 },
    ],
  },
]
