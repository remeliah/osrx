<script lang="ts">
  import AnimatedNumber from './AnimatedNumber.svelte';

  let {
    label,
    value = $bindable(),
    type = 'text',
    readonly = false,
    mono = false,
    hint,
  }: {
    label: string;
    value: string | number | boolean;
    type?: 'text' | 'number' | 'checkbox' | 'datetime-local';
    readonly?: boolean;
    mono?: boolean;
    hint?: string;
  } = $props();
</script>

<div class="field-row">
  <label class="field-label mono muted" for={label.replace(/\s/g, '-').toLowerCase()}>
    {label}
  </label>

  <div class="field-input-wrap" class:has-suffix={hint && type === 'number'}>
    {#if type === 'checkbox'}
      <button
        id={label.replace(/\s/g, '-').toLowerCase()}
        type="button"
        role="switch"
        class="toggle"
        class:on={value as boolean}
        aria-checked={value as boolean}
        aria-label={label}
        disabled={readonly}
        onclick={() => {
          if (!readonly) value = !(value as boolean);
        }}
      >
        <span class="toggle-thumb"></span>
      </button>
      <span class="toggle-text mono">{value ? 'yes' : 'no'}</span>
    {:else if type === 'number' && readonly}
      <div class="readonly-number mono">
        <AnimatedNumber bind:value={value as number} />
      </div>
    {:else}
      <input id={label.replace(/\s/g, '-').toLowerCase()} {type} class:mono {readonly} bind:value />
    {/if}
    {#if hint}<span class="field-hint muted">{hint}</span>{/if}
  </div>
</div>

<style>
  .field-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    align-items: center;
    gap: var(--space-lg);
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--color-rule);
  }

  .field-row:last-child {
    border-bottom: none;
  }

  .field-label {
    font-size: var(--text-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-neutral);
    cursor: default;
    line-height: 1.4;
  }

  .field-input-wrap {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .field-input-wrap.has-suffix {
    gap: 2px;
  }

  input {
    width: 100%;
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--color-ink);
    background: transparent;
    border: none;
    outline: none;
    padding: var(--space-2xs) 0;
    font-variant-numeric: tabular-nums;
    transition: color var(--dur-micro) cubic-bezier(0.16, 1, 0.3, 1);
  }

  input.mono {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  input[readonly] {
    color: var(--color-neutral);
    cursor: default;
  }

  input::placeholder {
    color: var(--color-muted);
  }

  .readonly-number {
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--color-neutral);
    font-variant-numeric: tabular-nums;
  }

  .toggle {
    display: flex;
    align-items: center;
    width: 36px;
    height: 20px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--color-rule);
    background: var(--color-paper-3);
    cursor: pointer;
    padding: 2px;
    transition:
      background 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
      border-color 200ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 100ms cubic-bezier(0.16, 1, 0.3, 1);
    flex-shrink: 0;
  }

  .toggle:hover:not(:disabled) {
    transform: scale(1.05);
  }

  .toggle:active:not(:disabled) {
    transform: scale(0.95);
  }

  .toggle.on {
    background: var(--color-accent);
    border-color: var(--color-accent);
  }

  .toggle:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .toggle-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--color-paper);
    transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
    flex-shrink: 0;
    box-shadow: 0 1px 3px oklch(0% 0 0 / 0.2);
  }

  .toggle.on .toggle-thumb {
    transform: translateX(16px);
  }

  .toggle-text {
    font-size: var(--text-xs);
    color: var(--color-neutral);
  }

  .field-hint {
    font-size: var(--text-xs);
    flex-shrink: 0;
  }

  input[type='number'] + .field-hint {
    margin-left: calc(-1 * var(--space-sm) + 2px);
  }
</style>
