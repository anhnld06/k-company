export type AgentState = 'idle' | 'working' | 'gathering' | 'sleeping' | 'walking'

export interface Point {
  x: number
  y: number
}

export interface Agent {
  id: string
  name: string
  pos: Point
  target: Point
  state: AgentState
  currentTask?: string
  color: string
  spriteIdx: number
}

export interface AgentAsset {
  body: HTMLImageElement
  hair: HTMLImageElement
  outfit: HTMLImageElement
}

export interface Rect {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface ActionZone {
  name: string
  icon: string | null
  delay: number
  rect?: Rect
  rects?: Rect[]
  targetPos?: Point
}

export interface SmartAgent extends Agent {
  path: Point[]
  targetNodeIdx: number
  statusText: string
  statusIcon: string | null
  delayUntil: number
  isResponding: boolean
}

export interface DialogueLine {
  agentId: string
  text: string
  duration?: number
}

export interface DialogueScript {
  id: string
  lines: DialogueLine[]
}

export type DialoguePhase = 'greeting' | 'response' | 'dialogue'

export interface ActiveDialogue {
  script: DialogueScript
  currentLineIndex: number
  lineStartedAt: number
  phase: DialoguePhase
}
