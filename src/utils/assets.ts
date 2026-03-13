import type { AgentAsset } from '../types'

// Assets local
import anhnldBody from '../assets/characters/anhnld/anhnld.png'
import anhnldHair from '../assets/characters/anhnld/anhnld-hair.png'
import anhnldOutfit from '../assets/characters/anhnld/anhnld-outfit.png'
import nhibxBody from '../assets/characters/nhibx/nhibx.png'
import nhibxHair from '../assets/characters/nhibx/nhibx-hair.png'
import nhibxOutfit from '../assets/characters/nhibx/nhibx-outfit.png'
import doanhlxqBody from '../assets/characters/doanhlxq/doanhlxq.png'
import doanhlxqHair from '../assets/characters/doanhlxq/doanhlxq-hair.png'
import doanhlxqOutfit from '../assets/characters/doanhlxq/doanhlxq-outfit.png'
import ducdnBody from '../assets/characters/ducdn/ducdn.png'
import ducdnHair from '../assets/characters/ducdn/ducdn-hair.png'
import ducdnOutfit from '../assets/characters/ducdn/ducdn-outfit.png'
import tinhdtBody from '../assets/characters/tinhdt/tinhdt.png'
import tinhdtHair from '../assets/characters/tinhdt/tinhdt-hair.png'
import tinhdtOutfit from '../assets/characters/tinhdt/tinhdt-outfit.png'
import huynnBody from '../assets/characters/huynn/huynn.png'
import huynnHair from '../assets/characters/huynn/huynn-hair.png'
import huynnOutfit from '../assets/characters/huynn/huynn-outfit.png'
import hieuvqBody from '../assets/characters/hieuvq/hieuvq.png'
import hieuvqHair from '../assets/characters/hieuvq/hieuvq-hair.png'
import hieuvqOutfit from '../assets/characters/hieuvq/hieuvq-outfit.png'
import housemapUrl from '../assets/map/housemap.png'
import homemapUrl from '../assets/map/homemap.png'
import wallUrl from '../assets/map/wall.png'
import sunUrl from '../assets/map/sun.png'
import moonUrl from '../assets/map/moon.png'

const loadImg = (url: string) => {
  const img = new Image()
  img.src = url
  return img
}

export const housemapImg = loadImg(housemapUrl)
export const homemapImg = loadImg(homemapUrl)
export const companyImg = housemapImg
export const wallImg = loadImg(wallUrl)
export const sunImg = loadImg(sunUrl)
export const moonImg = loadImg(moonUrl)

export const characterAssets: Record<string, AgentAsset> = {
  anhnld: {
    body: loadImg(anhnldBody),
    hair: loadImg(anhnldHair),
    outfit: loadImg(anhnldOutfit),
  },
  nhibx: {
    body: loadImg(nhibxBody),
    hair: loadImg(nhibxHair),
    outfit: loadImg(nhibxOutfit),
  },
  doanhlxq: {
    body: loadImg(doanhlxqBody),
    hair: loadImg(doanhlxqHair),
    outfit: loadImg(doanhlxqOutfit),
  },
  ducdn: {
    body: loadImg(ducdnBody),
    hair: loadImg(ducdnHair),
    outfit: loadImg(ducdnOutfit),
  },
  tinhdt: {
    body: loadImg(tinhdtBody),
    hair: loadImg(tinhdtHair),
    outfit: loadImg(tinhdtOutfit),
  },
  huynn: {
    body: loadImg(huynnBody),
    hair: loadImg(huynnHair),
    outfit: loadImg(huynnOutfit),
  },
  hieuvq: {
    body: loadImg(hieuvqBody),
    hair: loadImg(hieuvqHair),
    outfit: loadImg(hieuvqOutfit),
  },
}
