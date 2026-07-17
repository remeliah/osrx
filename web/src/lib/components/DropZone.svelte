<script lang="ts">
  let { ondrop }: { ondrop: (files: FileList) => void } = $props();

  let dragging = $state(false);
  let inputRef: HTMLInputElement;

  function handleDrag(e: DragEvent, over: boolean) {
    e.preventDefault();
    dragging = over;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (e.dataTransfer?.files.length) ondrop(e.dataTransfer.files);
  }

  function handleChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files?.length) ondrop(files);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="drop-zone"
  class:dragging
  role="button"
  tabindex="0"
  aria-label="Upload replay file — drag and drop or click to browse"
  ondragover={(e) => handleDrag(e, true)}
  ondragleave={(e) => handleDrag(e, false)}
  ondrop={handleDrop}
  onclick={() => inputRef.click()}
  onkeydown={(e) => e.key === 'Enter' && inputRef.click()}
>
  <svg class="drop-art" viewBox="0 0 160 120" fill="none" aria-hidden="true">
    <path
      d="M48 32 L48 72 L58 62 L66 80 L72 77 L64 59 L76 58 Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
      fill="none"
    />
    <circle cx="90" cy="46" r="2" fill="currentColor" opacity="0.55" />
    <circle cx="100" cy="40" r="1.5" fill="currentColor" opacity="0.40" />
    <circle cx="111" cy="35" r="1" fill="currentColor" opacity="0.28" />
    <circle cx="120" cy="32" r="0.8" fill="currentColor" opacity="0.18" />
    <circle cx="108" cy="80" r="18" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
    <circle cx="108" cy="80" r="14" stroke="currentColor" stroke-width="1" opacity="0.18" />
    <circle
      cx="108"
      cy="80"
      r="26"
      stroke="currentColor"
      stroke-width="0.8"
      stroke-dasharray="3 4"
      opacity="0.18"
    />
    <line
      x1="20"
      y1="100"
      x2="140"
      y2="100"
      stroke="currentColor"
      stroke-width="0.75"
      opacity="0.15"
    />
    <polyline
      points="20,100 38,95 55,97 72,91 88,96 105,88 122,93 140,85"
      stroke="currentColor"
      stroke-width="1.25"
      opacity="0.35"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <div class="drop-text">
    <span class="drop-primary">Drop a replay file</span>
    <span class="drop-secondary">or click to browse &middot; .osr format</span>
  </div>

  <input
    bind:this={inputRef}
    type="file"
    accept=".osr"
    class="sr-only"
    onchange={handleChange}
    tabindex="-1"
  />
</div>

<style>
  .drop-zone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-xl);
    min-height: 420px;
    border: 1px dashed var(--color-rule);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition:
      border-color var(--dur-short) cubic-bezier(0.16, 1, 0.3, 1),
      background var(--dur-short) cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow var(--dur-short) cubic-bezier(0.16, 1, 0.3, 1);
    padding: var(--space-3xl) var(--space-xl);
    position: relative;
    overflow: hidden;
    --mx: 50%;
    --my: 50%;
  }

  .drop-zone::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: radial-gradient(
      600px circle at var(--mx) var(--my),
      oklch(96% 0.03 46 / 0.12),
      transparent 50%
    );
    opacity: 0;
    transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }

  .drop-zone:hover::before,
  .drop-zone:focus-visible::before {
    opacity: 1;
  }

  .drop-zone:hover,
  .drop-zone:focus-visible {
    border-color: var(--color-accent-dim);
    background: oklch(97.5% 0.008 60);
    box-shadow: 0 2px 16px oklch(0% 0 0 / 0.04);
  }

  .drop-zone.dragging {
    border-color: var(--color-accent);
    background: oklch(96% 0.016 50);
    border-style: solid;
    box-shadow: 0 4px 24px oklch(0% 0 0 / 0.08);
  }
  .drop-zone.dragging::before {
    opacity: 1;
  }

  .drop-art {
    width: 160px;
    height: 120px;
    color: var(--color-neutral);
    transition: all var(--dur-short) cubic-bezier(0.16, 1, 0.3, 1);
    flex-shrink: 0;
    animation: float 5s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  .drop-zone:hover .drop-art {
    color: var(--color-accent);
    animation-duration: 2.5s;
  }

  .drop-zone.dragging .drop-art {
    color: var(--color-accent);
    animation-duration: 1.5s;
  }

  .drop-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    text-align: center;
  }

  .drop-primary {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--color-ink);
    font-style: italic;
    letter-spacing: -0.01em;
  }

  .drop-secondary {
    font-size: var(--text-sm);
    color: var(--color-neutral);
    font-family: var(--font-mono);
  }
</style>
