<script lang="ts">
  import type { ModInfo } from '$lib/types';
  import FieldRow from '$lib/components/FieldRow.svelte';

  let { mod = $bindable() }: { mod: ModInfo } = $props();

  type FieldDef = {
    key: string;
    label: string;
    type: 'number' | 'checkbox' | 'text';
    hint?: string;
  };
  const SCHEMAS: Record<string, FieldDef[]> = {
    DA: [
      { key: 'CS', label: 'Circle Size', type: 'number' },
      { key: 'AR', label: 'Approach Rate', type: 'number' },
      { key: 'OD', label: 'Overall Difficulty', type: 'number' },
      { key: 'HP', label: 'Drain Rate', type: 'number' },
      { key: 'extended_limits', label: 'Extended Limits', type: 'checkbox' },
      { key: 'scroll_speed', label: 'Scroll Speed (Taiko)', type: 'number' },
      { key: 'hard_rock_offsets', label: 'Hard Rock Offsets (Catch)', type: 'checkbox' },
    ],
    HD: [
      { key: 'only_fade_approach_circles', label: 'Only Fade Approach Circles', type: 'checkbox' },
    ],
    DT: [
      { key: 'speed_change', label: 'Speed Change', type: 'number' },
      { key: 'adjust_pitch', label: 'Adjust Pitch', type: 'checkbox' },
    ],
    HT: [
      { key: 'speed_change', label: 'Speed Change', type: 'number' },
      { key: 'adjust_pitch', label: 'Adjust Pitch', type: 'checkbox' },
    ],
    NC: [
      { key: 'speed_change', label: 'Speed Change', type: 'number' },
      { key: 'adjust_pitch', label: 'Adjust Pitch', type: 'checkbox' },
    ],
    DC: [
      { key: 'speed_change', label: 'Speed Change', type: 'number' },
      { key: 'adjust_pitch', label: 'Adjust Pitch', type: 'checkbox' },
    ],
    FL: [
      { key: 'follow_delay', label: 'Follow Delay', type: 'number' },
      { key: 'size_multiplier', label: 'Size Multiplier', type: 'number' },
      { key: 'combo_based_size', label: 'Combo Based Size', type: 'checkbox' },
    ],
    AD: [
      { key: 'scale', label: 'Scale', type: 'number' },
      { key: 'style', label: 'Style', type: 'text' },
    ],
    BM: [
      { key: 'max_combo_count', label: 'Max Combo Count', type: 'number' },
      { key: 'max_cursor_size', label: 'Max Cursor Size', type: 'number' },
    ],
    CL: [
      { key: 'no_slider_head_accuracy', label: 'No Slider Head Acc', type: 'checkbox' },
      { key: 'classic_note_lock', label: 'Classic Note Lock', type: 'checkbox' },
      { key: 'always_play_tail_sample', label: 'Play Tail Sample', type: 'checkbox' },
      { key: 'fade_hit_circle_early', label: 'Fade Hit Circle Early', type: 'checkbox' },
      { key: 'classic_health', label: 'Classic Health', type: 'checkbox' },
    ],
    DP: [
      { key: 'max_depth', label: 'Max Depth', type: 'number' },
      { key: 'show_approach_circles', label: 'Show Approach Circles', type: 'checkbox' },
    ],
    MG: [{ key: 'attraction_strength', label: 'Attraction Strength', type: 'number' }],
    RP: [{ key: 'repulsion_strength', label: 'Repulsion Strength', type: 'number' }],
    MR: [{ key: 'reflection', label: 'Reflection', type: 'text' }],
    RD: [{ key: 'angle_sharpness', label: 'Angle Sharpness', type: 'number' }],
    WG: [{ key: 'strength', label: 'Strength', type: 'number' }],
    TP: [
      { key: 'seed', label: 'Seed', type: 'number' },
      { key: 'metronome', label: 'Metronome', type: 'checkbox' },
    ],
    SD: [{ key: 'fail_on_slider_tail', label: 'Fail on Slider Tail', type: 'checkbox' }],
    GR: [{ key: 'start_scale', label: 'Start Scale', type: 'number' }],
    DF: [{ key: 'start_scale', label: 'Start Scale', type: 'number' }],
    SI: [{ key: 'start_scale', label: 'Start Scale', type: 'number' }],
    WU: [
      { key: 'initial_rate', label: 'Initial Rate', type: 'number' },
      { key: 'final_rate', label: 'Final Rate', type: 'number' },
      { key: 'adjust_pitch', label: 'Adjust Pitch', type: 'checkbox' },
    ],
    WD: [
      { key: 'initial_rate', label: 'Initial Rate', type: 'number' },
      { key: 'final_rate', label: 'Final Rate', type: 'number' },
      { key: 'adjust_pitch', label: 'Adjust Pitch', type: 'checkbox' },
    ],
    AS: [
      { key: 'initial_rate', label: 'Initial Rate', type: 'number' },
      { key: 'adjust_pitch', label: 'Adjust Pitch', type: 'checkbox' },
    ],
    CO: [
      { key: 'coverage', label: 'Coverage', type: 'number' },
      { key: 'direction', label: 'Direction', type: 'text' },
    ],
    PF: [{ key: 'require_perfect_hits', label: 'Require Perfect Hits', type: 'checkbox' }],
    SR: [
      { key: 'one_third_conversion', label: '1/3 Conversion', type: 'checkbox' },
      { key: 'one_sixth_conversion', label: '1/6 Conversion', type: 'checkbox' },
      { key: 'one_eighth_conversion', label: '1/8 Conversion', type: 'checkbox' },
    ],
  };

  let schema = $derived(SCHEMAS[mod.acronym]);

  $effect(() => {
    if (schema && !mod.settings) {
      mod.settings = {};
    }

    if (schema && mod.settings && ['DT', 'NC'].includes(mod.acronym)) {
      if (mod.settings.speed_change === undefined) {
        mod.settings.speed_change = 1.5;
      }
    }

    if (schema && mod.settings && ['HT', 'DC'].includes(mod.acronym)) {
      if (mod.settings.speed_change === undefined) {
        mod.settings.speed_change = 0.75;
      }
    }
  });
</script>

{#if schema && mod.settings}
  <div class="mod-settings">
    <div class="mod-settings-header mono">
      {mod.acronym} <span class="muted">settings</span>
    </div>
    <div class="schema-fields">
      {#each schema as field}
        <FieldRow
          label={field.label}
          type={field.type}
          hint={field.hint}
          bind:value={mod.settings[field.key] as any}
        />
      {/each}
    </div>
  </div>
{/if}

<style>
  .mod-settings {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: var(--radius-md);
    padding: var(--space-md);
  }
  .mod-settings-header {
    font-size: var(--text-xs);
    font-weight: 500;
    margin-bottom: var(--space-xs);
  }
  .schema-fields {
    display: flex;
    flex-direction: column;
  }
</style>
