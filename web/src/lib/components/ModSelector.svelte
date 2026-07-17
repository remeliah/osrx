<script lang="ts">
  import { MOD_GROUPS, MOD_LABELS, hasMod, toggleMod, modIcon } from '$lib/mods';

  let { mods = $bindable(0), disabled = false }: { mods: number; disabled?: boolean } = $props();
</script>

<div class="mod-selector" class:disabled>
  {#each MOD_GROUPS as group}
    <div class="mod-group">
      <span class="group-label mono muted">{group.label}</span>
      <div class="mod-pills">
        {#each group.mods as name}
          {@const active = hasMod(mods, name)}
          {@const icon = modIcon(name)}
          <button
            type="button"
            class="mod-pill"
            class:active
            data-pill
            aria-pressed={active}
            {disabled}
            onclick={() => (mods = toggleMod(mods, name))}
          >
            {#if icon}<img src={icon} alt="" class="mod-icon" />{/if}
            {MOD_LABELS[name] ?? name}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .mod-selector {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .mod-selector.disabled {
    opacity: 0.5;
  }

  .mod-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .group-label {
    font-size: var(--text-xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .mod-pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  @keyframes shimmer {
    0% {
      background-position: -200% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  .mod-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 28px;
    padding: 0 var(--space-sm);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 500;
    border-radius: var(--radius-pill);
    border: 1px solid var(--color-rule);
    background: var(--color-paper);
    color: var(--color-neutral);
    cursor: pointer;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition:
      background var(--dur-micro) cubic-bezier(0.16, 1, 0.3, 1),
      color var(--dur-micro) cubic-bezier(0.16, 1, 0.3, 1),
      border-color var(--dur-micro) cubic-bezier(0.16, 1, 0.3, 1),
      transform var(--dur-micro) cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow var(--dur-micro) cubic-bezier(0.16, 1, 0.3, 1);
    user-select: none;
  }

  .mod-pill::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      oklch(95% 0.03 46 / 0.3) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    background-position: -200% center;
    transition: background-position 0s;
    pointer-events: none;
  }

  .mod-pill:hover:not(:disabled) {
    border-color: var(--color-accent-dim);
    color: var(--color-ink);
    transform: translateY(-1px);
  }

  .mod-pill:hover:not(:disabled)::before {
    animation: shimmer 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .mod-pill:active:not(:disabled) {
    transform: scale(0.95);
    transition-duration: 50ms;
  }

  .mod-pill.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: oklch(98% 0.01 46);
    box-shadow: 0 2px 8px oklch(0% 0 0 / 0.1);
  }

  .mod-pill.active:hover:not(:disabled) {
    background: var(--color-accent-dim);
    border-color: var(--color-accent-dim);
    box-shadow: 0 4px 12px oklch(0% 0 0 / 0.15);
  }

  .mod-pill:disabled {
    cursor: not-allowed;
  }

  .mod-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    filter: brightness(0.25);
    transition: filter var(--dur-micro) cubic-bezier(0.16, 1, 0.3, 1);
  }

  .mod-pill.active .mod-icon {
    filter: brightness(1);
  }
</style>
