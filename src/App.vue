<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import type { SmartAgent } from './types'
import { usePixelWorld } from './composables/usePixelWorld'
import { useDialogue } from './composables/useDialogue'
import { GRID_W, GRID_H } from './constants'
import { INITIAL_CHARACTERS } from './config/characters'
import { housemapImg, homemapImg, wallImg, sunImg, moonImg, characterAssets } from './utils/assets'

import AppHeader from './components/AppHeader.vue'
import PixelCanvas from './components/PixelCanvas.vue'
import './assets/pixel-world.css'

const currentTime = ref(new Date())
const isDaytime = computed(() => {
  const hour = currentTime.value.getHours()
  return hour >= 6 && hour < 18
})

const agents = reactive<SmartAgent[]>([...INITIAL_CHARACTERS])
const { collisionGrid, getRandomValidPos, setAgentTarget, updateAgents } = usePixelWorld(agents)
const { activeDialogue, startGreeting, startScript, getNextScript, resetScriptIndex, isLastScript } = useDialogue()
const lastDialogueEndedAt = ref(0)
const hasShownGreeting = ref(false)
const SCRIPT_INTERVAL = 3000

const currentScene = ref<'housemap' | 'homemap'>('housemap')
const transitionProgress = ref(0)
const transitionPhase = ref<'out' | 'in' | null>(null)
const transitionTypingIndex = ref(0)
const transitionTypingStartedAt = ref(0)
const TRANSITION_DURATION = 600
const TRANSITION_TYPING_TEXT = 'Chap mới'
const TYPING_INTERVAL = 220
const HOLD_AFTER_TYPING = 400
const MAP_FADE_DURATION = 500

const transitionMapFadeProgress = ref(0)

const currentMapImg = computed(() =>
  currentScene.value === 'housemap' ? housemapImg : homemapImg
)

const transitionAlpha = computed(() => {
  if (transitionPhase.value === 'out') return transitionProgress.value
  return 0
})

watch(activeDialogue, (newVal, oldVal) => {
  if (!oldVal || newVal) return
  lastDialogueEndedAt.value = Date.now()

  if (oldVal.phase === 'dialogue' && isLastScript(oldVal.script.id)) {
    transitionPhase.value = 'out'
    transitionProgress.value = 0
  }
})

const selectedAgentId = ref<string | null>(null)
const selectAgent = (id: string) => {
  selectedAgentId.value = id
  setTimeout(() => {
    if (selectedAgentId.value === id) selectedAgentId.value = null
  }, 500)
}

const agentBuffer = document.createElement('canvas')
agentBuffer.width = 32
agentBuffer.height = 32
const bufferCtx = agentBuffer.getContext('2d')

const buildCollisionFromMap = (img: HTMLImageElement) => {
  if (!img.complete) return
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = GRID_W
  tempCanvas.height = GRID_H
  const tCtx = tempCanvas.getContext('2d')
  if (!tCtx) return
  tCtx.drawImage(img, 0, 0, GRID_W, GRID_H)
  const imageDataObj = tCtx.getImageData(0, 0, GRID_W, GRID_H)
  if (!imageDataObj) return
  const imgData = imageDataObj.data
  const grid: boolean[][] = []
  for (let y = 0; y < GRID_H; y++) {
    grid[y] = []
    for (let x = 0; x < GRID_W; x++) {
      const idx = (y * GRID_W + x) * 4 + 3
      const alpha = imgData[idx] ?? 0
      grid[y]![x] = alpha > 0
    }
  }
  collisionGrid.value = grid
}

const { copy } = useClipboard()
const handleCanvasClick = (pos: { gx: number; gy: number }) => {
  const agentAtPos = agents.find(
    (a) => Math.round(pos.gx) === a.pos.x && Math.round(pos.gy) === a.pos.y
  )
  if (agentAtPos) selectAgent(agentAtPos.id)
  const coord = `{ x: ${pos.gx}, y: ${pos.gy} }`
  copy(coord)
}

let rafId: number
let timerId: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timerId = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)

  startGreeting()
  hasShownGreeting.value = true

  wallImg.onload = () => {
    buildCollisionFromMap(wallImg)
    agents.forEach((a) => {
      const pos = getRandomValidPos()
      a.pos = { ...pos }
      a.target = { ...pos }
    })
  }

  let lastTime = 0
  const renderLoop = (time: number) => {
    const dt = time - (lastTime || time)
    lastTime = time
    updateAgents(dt)

    const now = Date.now()

    if (transitionPhase.value === 'out') {
      transitionProgress.value = Math.min(1, transitionProgress.value + dt / TRANSITION_DURATION)
      if (transitionProgress.value >= 1) {
        currentScene.value = currentScene.value === 'housemap' ? 'homemap' : 'housemap'
        resetScriptIndex()
        agents.forEach((a) => {
          const pos = getRandomValidPos()
          a.pos = { ...pos }
          a.target = { ...pos }
        })
        transitionPhase.value = 'in'
        transitionProgress.value = 0
        transitionTypingIndex.value = 0
        transitionMapFadeProgress.value = 0
        transitionTypingStartedAt.value = Date.now()
      }
    } else if (transitionPhase.value === 'in') {
      const elapsed = now - transitionTypingStartedAt.value
      const maxIndex = TRANSITION_TYPING_TEXT.length
      const typingEndTime = maxIndex * TYPING_INTERVAL
      const holdEndTime = typingEndTime + MAP_FADE_DURATION + HOLD_AFTER_TYPING

      if (elapsed < typingEndTime) {
        transitionTypingIndex.value = Math.min(maxIndex, Math.floor(elapsed / TYPING_INTERVAL))
        transitionMapFadeProgress.value = 0
      } else {
        transitionTypingIndex.value = maxIndex
        const fadeElapsed = elapsed - typingEndTime
        transitionMapFadeProgress.value = Math.min(1, fadeElapsed / MAP_FADE_DURATION)
        if (elapsed >= holdEndTime) {
          transitionPhase.value = null
          transitionTypingIndex.value = 0
          transitionMapFadeProgress.value = 0
          startGreeting()
        }
      }
    } else {
      agents.forEach((a) => {
        const isAvailable =
          (a.state === 'idle' || a.state === 'working' || a.state === 'sleeping') &&
          !a.isResponding &&
          now >= a.delayUntil
        if (isAvailable && Math.random() < 0.015) setAgentTarget(a, getRandomValidPos(), 'idle')
      })

      if (
        hasShownGreeting.value &&
        lastDialogueEndedAt.value > 0 &&
        !activeDialogue.value &&
        now - lastDialogueEndedAt.value >= SCRIPT_INTERVAL
      ) {
        const script = getNextScript()
        if (script) {
          startScript(script, true)
        }
      }
    }
    rafId = requestAnimationFrame(renderLoop)
  }
  rafId = requestAnimationFrame(renderLoop)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <div
    class="h-screen w-screen overflow-hidden bg-bg-deep text-text-primary font-pixel flex flex-col selection:bg-accent-coral/30"
  >
    <div class="fixed top-4 right-4 z-50">
      <div
        class="bg-accent-coral text-bg-deep font-pixel font-bold text-xs tracking-widest px-2 py-1 rotate-3 shadow-lg"
      >
        CÔNG TY K / 2026
      </div>
    </div>

    <div class="flex flex-col h-full w-full min-h-0 px-2 py-2 md:px-4 md:py-4">
      <AppHeader class="shrink-0 mb-2 md:mb-4" />

      <div class="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <div class="relative flex items-center justify-center max-w-full max-h-full">
          <PixelCanvas
            :agents="agents"
            :is-daytime="isDaytime"
            :selected-agent-id="selectedAgentId"
            :active-dialogue="activeDialogue"
            :assets="{ companyImg: currentMapImg, sunImg, moonImg, characterAssets, agentBuffer, bufferCtx }"
            :transition-alpha="transitionAlpha"
            :transition-phase="transitionPhase"
            :transition-typing-index="transitionTypingIndex"
            :transition-typing-text="TRANSITION_TYPING_TEXT"
            :transition-map-fade-progress="transitionMapFadeProgress"
            @canvas-click="handleCanvasClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>
