import { ref, onMounted, onUnmounted } from 'vue'
import type { ActiveDialogue, DialogueScript } from '../types'
import { DIALOGUE_SCRIPTS } from '../config/dialogues'

const DEFAULT_LINE_DURATION = 3000
const GREETING_DURATION = 2000
const RESPONSE_DURATION = 3000

const EMPTY_GREETING_SCRIPT: DialogueScript = { id: '_greeting', lines: [] }

export function useDialogue() {
  const activeDialogue = ref<ActiveDialogue | null>(null)
  const currentScriptIndex = ref(0)
  let checkIntervalId: ReturnType<typeof setInterval> | undefined

  const startGreeting = () => {
    activeDialogue.value = {
      script: EMPTY_GREETING_SCRIPT,
      currentLineIndex: 0,
      lineStartedAt: Date.now(),
      phase: 'greeting',
    }
  }

  const startScript = (script: DialogueScript, skipGreeting = false) => {
    if (script.lines.length === 0) return
    activeDialogue.value = {
      script,
      currentLineIndex: 0,
      lineStartedAt: Date.now(),
      phase: skipGreeting ? 'dialogue' : 'greeting',
    }
  }

  const advanceLine = () => {
    const d = activeDialogue.value
    if (!d) return

    const elapsed = Date.now() - d.lineStartedAt

    if (d.phase === 'greeting') {
      if (elapsed >= GREETING_DURATION) {
        activeDialogue.value = {
          ...d,
          phase: 'response',
          lineStartedAt: Date.now(),
        }
      }
      return
    }

    if (d.phase === 'response') {
      if (elapsed >= RESPONSE_DURATION) {
        if (d.script.lines.length === 0) {
          activeDialogue.value = null
        } else {
          activeDialogue.value = {
            ...d,
            phase: 'dialogue',
            currentLineIndex: 0,
            lineStartedAt: Date.now(),
          }
        }
      }
      return
    }

    // phase === 'dialogue'
    const line = d.script.lines[d.currentLineIndex]
    const duration = line?.duration ?? DEFAULT_LINE_DURATION

    if (elapsed >= duration) {
      if (d.currentLineIndex >= d.script.lines.length - 1) {
        activeDialogue.value = null
      } else {
        activeDialogue.value = {
          ...d,
          currentLineIndex: d.currentLineIndex + 1,
          lineStartedAt: Date.now(),
        }
      }
    }
  }

  const getNextScript = (): DialogueScript | null => {
    if (DIALOGUE_SCRIPTS.length === 0) return null
    const script = DIALOGUE_SCRIPTS[currentScriptIndex.value]
    currentScriptIndex.value = (currentScriptIndex.value + 1) % DIALOGUE_SCRIPTS.length
    return script
  }

  const resetScriptIndex = () => {
    currentScriptIndex.value = 0
  }

  const isLastScript = (scriptId: string) => {
    const last = DIALOGUE_SCRIPTS[DIALOGUE_SCRIPTS.length - 1]
    return last?.id === scriptId
  }

  onMounted(() => {
    checkIntervalId = setInterval(advanceLine, 200)
  })

  onUnmounted(() => {
    if (checkIntervalId) clearInterval(checkIntervalId)
  })

  return {
    activeDialogue,
    startGreeting,
    startScript,
    getNextScript,
    resetScriptIndex,
    isLastScript,
    DIALOGUE_SCRIPTS,
  }
}
