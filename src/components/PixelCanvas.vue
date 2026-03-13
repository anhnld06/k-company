<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { SmartAgent, AgentAsset, ActiveDialogue } from "../types";
import { TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants";

const props = withDefaults(
  defineProps<{
    agents: SmartAgent[];
    isDaytime: boolean;
    selectedAgentId: string | null;
    activeDialogue: ActiveDialogue | null;
    transitionAlpha?: number;
    transitionPhase?: 'out' | 'in' | null;
    transitionTypingIndex?: number;
    transitionTypingText?: string;
    transitionMapFadeProgress?: number;
    assets: {
      companyImg: HTMLImageElement;
      sunImg: HTMLImageElement;
      moonImg: HTMLImageElement;
      characterAssets: Record<string, AgentAsset>;
      agentBuffer: HTMLCanvasElement;
      bufferCtx: CanvasRenderingContext2D | null;
    };
}>(),
  {
    transitionAlpha: 0,
    transitionPhase: null,
    transitionTypingIndex: 0,
    transitionTypingText: 'Chap mới',
    transitionMapFadeProgress: 0,
  }
);

const emit = defineEmits(["canvas-click", "mouse-move"]);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const mousePos = ref({ gx: 0, gy: 0 });

const handleMouseMove = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
  const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
  mousePos.value.gx = Number((x / TILE_SIZE).toFixed(1));
  mousePos.value.gy = Number((y / TILE_SIZE).toFixed(1));
  emit("mouse-move", mousePos.value);
};

const handleCanvasClick = () => {
  emit("canvas-click", mousePos.value);
};

defineExpose({
  canvasRef,
});

let rafId: number;

const STAR_COUNT = 180;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  x: ((i * 137.5 + 31) % 100) / 100 * CANVAS_WIDTH,
  y: ((i * 89.2 + 17) % 100) / 100 * CANVAS_HEIGHT,
  r: (i % 3) * 0.5 + 0.5,
  alpha: (i % 5) / 5 * 0.6 + 0.3,
}));

const drawSpaceBackground = (ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, '#0a1628');
  gradient.addColorStop(0.4, '#050810');
  gradient.addColorStop(1, '#020408');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  stars.forEach((s) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = 'rgba(60, 80, 140, 0.12)';
  ctx.beginPath();
  ctx.ellipse(CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.7, 180, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(80, 60, 120, 0.1)';
  ctx.beginPath();
  ctx.ellipse(CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.3, 150, 60, 0, 0, Math.PI * 2);
  ctx.fill();
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const render = (time: number) => {
    ctx.imageSmoothingEnabled = false;

    const isTransitionIn = props.transitionPhase === 'in';
    const isTypingComplete = props.transitionTypingText
      ? props.transitionTypingIndex >= props.transitionTypingText.length
      : false;
    const mapFadeProgress = props.transitionMapFadeProgress ?? 0;

    if (isTransitionIn) {
      drawSpaceBackground(ctx);

      ctx.save();
      ctx.globalAlpha = isTypingComplete ? mapFadeProgress : 0;
      if (props.assets.companyImg.complete) {
        ctx.drawImage(props.assets.companyImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      const skyImg = props.isDaytime ? props.assets.sunImg : props.assets.moonImg;
      if (skyImg.complete) {
        ctx.drawImage(skyImg, 0.7 * TILE_SIZE, 0.7 * TILE_SIZE, 1.4 * TILE_SIZE, 1.4 * TILE_SIZE);
      }
      props.agents.forEach((agent) => {
        const characterAssets = props.assets.characterAssets[agent.id];
        if (!characterAssets) return;
        const x = agent.pos.x * TILE_SIZE;
        const y = agent.pos.y * TILE_SIZE;
        const AGENT_SCALE = 1.2;
        const displaySize = TILE_SIZE * AGENT_SCALE;
        const drawX = x - displaySize / 2;
        const drawY = y - displaySize;
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.ellipse(x, y, TILE_SIZE * 0.3, TILE_SIZE * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        const frame = (Math.floor(time / 200) % 4) * 32;
        const { agentBuffer, bufferCtx } = props.assets;
        const hasSprite = characterAssets.body.complete && characterAssets.body.naturalWidth > 1;
        if (bufferCtx && hasSprite) {
          bufferCtx.clearRect(0, 0, 32, 32);
          bufferCtx.drawImage(characterAssets.body, frame, 0, 32, 32, 0, 0, 32, 32);
          if (characterAssets.outfit.complete) bufferCtx.drawImage(characterAssets.outfit, frame, 0, 32, 32, 0, 0, 32, 32);
          if (characterAssets.hair.complete) bufferCtx.drawImage(characterAssets.hair, frame, 0, 32, 32, 0, -2, 32, 32);
          ctx.drawImage(agentBuffer, 0, 0, 32, 32, drawX, drawY, displaySize, displaySize);
        } else {
          ctx.fillStyle = agent.color || "#4fc3f7";
          ctx.fillRect(drawX, drawY, displaySize, displaySize);
        }
        ctx.font = `${Math.round(TILE_SIZE * 0.6)}px 'VT323'`;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(agent.name, x, drawY - TILE_SIZE * 0.2 + TILE_SIZE * 0.25);
      });
      ctx.restore();

      const typedText = props.transitionTypingText
        ? props.transitionTypingText.slice(0, props.transitionTypingIndex)
        : '';
      const cursorBlink = Math.floor(time / 400) % 2 === 0 ? '|' : '';
      ctx.font = `${Math.round(TILE_SIZE * 1.2)}px 'VT323'`;
      ctx.fillStyle = '#e5e7eb';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedText + cursorBlink, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    } else {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (props.assets.companyImg.complete) {
        ctx.drawImage(props.assets.companyImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      const skyImg = props.isDaytime ? props.assets.sunImg : props.assets.moonImg;
      if (skyImg.complete) {
        ctx.drawImage(skyImg, 0.7 * TILE_SIZE, 0.7 * TILE_SIZE, 1.4 * TILE_SIZE, 1.4 * TILE_SIZE);
      }

      props.agents.forEach((agent) => {
        const characterAssets = props.assets.characterAssets[agent.id];
        if (!characterAssets) return;

        const x = agent.pos.x * TILE_SIZE;
        const y = agent.pos.y * TILE_SIZE;
        const AGENT_SCALE = 1.2;
        const displaySize = TILE_SIZE * AGENT_SCALE;

        const drawX = x - displaySize / 2;
        const drawY = y - displaySize;

        if (agent.id === props.selectedAgentId) {
          ctx.shadowBlur = 40;
          ctx.shadowColor = "#ffffff";
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.beginPath();
          ctx.arc(x, y - displaySize / 2, TILE_SIZE * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.ellipse(x, y, TILE_SIZE * 0.3, TILE_SIZE * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        const frame = (Math.floor(time / 200) % 4) * 32;
        const { agentBuffer, bufferCtx } = props.assets;
        const hasSprite = characterAssets.body.complete && characterAssets.body.naturalWidth > 1;
        if (bufferCtx && hasSprite) {
          bufferCtx.clearRect(0, 0, 32, 32);
          bufferCtx.drawImage(characterAssets.body, frame, 0, 32, 32, 0, 0, 32, 32);
          if (characterAssets.outfit.complete) bufferCtx.drawImage(characterAssets.outfit, frame, 0, 32, 32, 0, 0, 32, 32);
          if (characterAssets.hair.complete) bufferCtx.drawImage(characterAssets.hair, frame, 0, 32, 32, 0, -2, 32, 32);
          ctx.drawImage(agentBuffer, 0, 0, 32, 32, drawX, drawY, displaySize, displaySize);
        } else {
          ctx.fillStyle = agent.color || "#4fc3f7";
          ctx.fillRect(drawX, drawY, displaySize, displaySize);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(drawX, drawY, displaySize, displaySize);
        }

        ctx.shadowBlur = 0;

        const labelY = drawY - TILE_SIZE * 0.45;
        ctx.font = `${Math.round(TILE_SIZE * 0.6)}px 'VT323'`;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(agent.name, x, labelY + TILE_SIZE * 0.25);

        const d = props.activeDialogue;
        let bubbleText: string | null = null;
        if (d) {
          if (d.phase === 'greeting' && agent.id === 'anhnld') {
            bubbleText = 'こんにちは！';
          } else if (d.phase === 'response' && agent.id !== 'anhnld') {
            bubbleText = 'はい。';
          } else if (d.phase === 'dialogue') {
            const currentLine = d.script.lines[d.currentLineIndex];
            if (currentLine && agent.id === currentLine.agentId) {
              bubbleText = currentLine.text;
            }
          }
        }
        if (bubbleText && d) {
          const dialogueFontSize = Math.round(TILE_SIZE * 0.5);
          const isJapanese = d.phase === 'greeting' || d.phase === 'response';
          ctx.font = isJapanese
            ? `${dialogueFontSize}px 'Noto Sans JP', sans-serif`
            : `${dialogueFontSize}px 'VT323'`;
          const paddingX = TILE_SIZE * 0.3;
          const paddingY = TILE_SIZE * 0.2;
          const textMetrics = ctx.measureText(bubbleText);
          const textWidth = textMetrics.width;
          const bubbleWidth = textWidth + paddingX * 2;
          const bubbleHeight = dialogueFontSize + paddingY * 2;
          const bubbleX = x - bubbleWidth / 2;
          const bubbleY = labelY - bubbleHeight - TILE_SIZE * 0.1;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 4);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          const tailWidth = TILE_SIZE * 0.2;
          const tailHeight = TILE_SIZE * 0.2;
          const tailX = x;
          const tailY = bubbleY + bubbleHeight;
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(tailX - tailWidth / 2, tailY + tailHeight);
          ctx.lineTo(tailX + tailWidth / 2, tailY + tailHeight);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f9fafb';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bubbleText, x, bubbleY + bubbleHeight / 2);
        }
      });
    }

    if (props.transitionAlpha > 0) {
      ctx.fillStyle = `rgba(15, 23, 42, ${props.transitionAlpha})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    rafId = requestAnimationFrame(render);
  };

  rafId = requestAnimationFrame(render);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div
    class="relative bg-bg-deep border border-border-default p-0.5 flex items-center justify-center shadow-2xl"
    :style="{ aspectRatio: '4/3', maxWidth: '100%', maxHeight: '100%' }"
  >
    <div class="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-accent-coral z-20"></div>
    <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-accent-coral z-20"></div>
    <div class="scanlines pointer-events-none absolute inset-0 z-10 opacity-10"></div>
    <div
      v-if="!isDaytime"
      class="absolute inset-0 bg-blue-900/20 pointer-events-none z-10 mix-blend-multiply"
    ></div>
    <canvas
      ref="canvasRef"
      :width="CANVAS_WIDTH"
      :height="CANVAS_HEIGHT"
      @mousemove="handleMouseMove"
      @click="handleCanvasClick"
      class="block w-full h-full object-contain image-pixelated cursor-crosshair"
    ></canvas>
  </div>
</template>
