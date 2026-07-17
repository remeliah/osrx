<script lang="ts">
  import DropZone from '$lib/components/DropZone.svelte';
  import ModSelector from '$lib/components/ModSelector.svelte';
  import FieldRow from '$lib/components/FieldRow.svelte';
  import LazerModSettingsEditor from '$lib/components/LazerModSettingsEditor.svelte';
  import { parseReplay, writeReplay } from '$lib/api';
  import { PLAY_MODES, type ReplayDto, type ModInfo } from '$lib/types';
  import { modsString, lazerModsForMode, CATEGORY_LABELS, modIcon, type LazerMod } from '$lib/mods';
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import {
    animatePageEntrance,
    magneticEffect,
    cardDepth,
    floatElement,
    breatheGlow,
    staggerPills,
    ease,
  } from '$lib/animations';

  let replay = $state<ReplayDto | null>(null);
  let loading = $state(false);
  let saving = $state(false);
  let error = $state<string | null>(null);
  let filename = $state('');

  let activeLazerMods = $state<ModInfo[]>([]);
  let cleanupFns: Array<() => void> = [];

  function drawLineArt(el: HTMLElement, duration = 1800) {
    const paths = el.querySelectorAll('.la-path');
    paths.forEach((path) => {
      const len = (path as SVGPathElement).getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: duration / 1000, ease: ease.expo }
      );
    });
    floatElement(el, 0.4);
  }

  onMount(() => {
    animatePageEntrance();

    document.querySelectorAll('.section-art, .section-accent').forEach((el) => {
      floatElement(el as HTMLElement, Math.random() * 0.5 + 0.75);
      const svg = el.querySelector('svg');
      if (svg) breatheGlow(svg as unknown as HTMLElement);
    });

    document.querySelectorAll('.line-art').forEach((el) => {
      drawLineArt(el as HTMLElement);
    });

    document.querySelectorAll('.btn-save, .nav-reset').forEach((el) => {
      cleanupFns.push(magneticEffect(el as HTMLElement, 0.2));
    });

    document.querySelectorAll('.card-surface').forEach((el) => {
      const card = el as HTMLElement;
      const onMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      };
      const onMouseLeave = () => {
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      };
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
      cleanupFns.push(() => {
        card.removeEventListener('mousemove', onMouseMove);
        card.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    document.querySelectorAll('.ambient-dot').forEach((el) => {
      breatheGlow(el as HTMLElement);
    });

    document.querySelectorAll('.breathing-border').forEach((el) => {
      gsap.to(el, {
        opacity: 0.4,
        duration: 3 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  });

  onDestroy(() => {
    cleanupFns.forEach((fn) => fn());
  });

  $effect(() => {
    if (replay) {
      requestAnimationFrame(() => {
        document.querySelectorAll('.card-surface').forEach((el) => {
          cleanupFns.push(cardDepth(el as HTMLElement));
        });
        document.querySelectorAll('.mod-pills, .lazer-pills').forEach((container) => {
          staggerPills(container as HTMLElement);
        });
        document.querySelectorAll('.line-art').forEach((el) => {
          drawLineArt(el as HTMLElement);
        });
      });
    }
  });

  let modStr = $derived(replay ? modsString(replay.mods) : '');
  let isLazer = $derived(!!replay?.score_info);
  let lazerMods = $derived(replay ? lazerModsForMode(replay.play_mode) : []);
  let lazerByCategory = $derived.by(() => {
    const map: Record<string, LazerMod[]> = {};
    for (const m of lazerMods) {
      (map[m.category] ??= []).push(m);
    }
    return map;
  });

  async function onDrop(files: FileList) {
    const file = files[0];
    if (!file?.name.endsWith('.osr')) {
      error = 'Only .osr files are supported.';
      return;
    }
    error = null;
    loading = true;
    filename = file.name;
    try {
      replay = await parseReplay(file);
      activeLazerMods = JSON.parse(JSON.stringify(replay?.score_info?.mods ?? []));
    } catch (e) {
      error = String(e);
      replay = null;
    } finally {
      loading = false;
    }
  }

  async function onSave() {
    if (!replay) return;
    saving = true;
    error = null;
    try {
      if (replay.score_info) {
        replay.score_info.mods = JSON.parse(JSON.stringify(activeLazerMods));
      }
      await writeReplay(replay, `${replay.username}_edited.osr`);
    } catch (e) {
      error = String(e);
    } finally {
      saving = false;
    }
  }

  function onReset() {
    replay = null;
    filename = '';
    error = null;
    activeLazerMods = [];
  }

  function toggleLazerMod(ac: string) {
    const idx = activeLazerMods.findIndex((m) => m.acronym === ac);
    if (idx >= 0) {
      activeLazerMods = activeLazerMods.filter((_, i) => i !== idx);
    } else {
      activeLazerMods = [...activeLazerMods, { acronym: ac }];
    }
  }
</script>

<div class="bg-ambient" aria-hidden="true">
  <div class="bg-gradient bg-gradient--1"></div>
  <div class="bg-gradient bg-gradient--2"></div>
  <div class="bg-grain"></div>
</div>

<nav class="nav">
  <a href="/" class="wordmark" aria-label="osrx"
    >osrx<span class="wordmark-dot ambient-dot">.</span></a
  >
  {#if replay}
    <span class="file-pill mono">{filename}</span>
    <button class="nav-reset" type="button" onclick={onReset} aria-label="Close replay">
      <span class="nav-reset-icon">✕</span>
    </button>
  {/if}
</nav>

<main class="main">
  <div class="ornament-system" aria-hidden="true">
    <div class="orn-vguide orn-vguide--grid-left">
      <div class="orn-vg-line"></div>
      <div class="orn-vg-tick orn-vg-tick--t"></div>
      <div class="orn-vg-tick orn-vg-tick--m"></div>
      <div class="orn-vg-tick orn-vg-tick--b"></div>
      <span class="orn-vg-label mono">grid</span>
    </div>
    <div class="orn-big-ring orn-big-ring--top"></div>
    <div class="orn-wide-rule orn-wide-rule--1">
      <div class="orn-wr-line"></div>
      <div class="orn-wr-dot"></div>
    </div>
    <div class="orn-cluster orn-cluster--mods">
      <div class="orn-c-circle orn-c-circle--a"></div>
      <div class="orn-c-circle orn-c-circle--b"></div>
      <div class="orn-c-cross">+</div>
    </div>
    <div class="orn-diag">
      <div class="orn-diag-line"></div>
      <div class="orn-diag-dot orn-diag-dot--1"></div>
      <div class="orn-diag-dot orn-diag-dot--2"></div>
    </div>
    <div class="orn-wide-rule orn-wide-rule--2">
      <div class="orn-wr-line"></div>
      <span class="orn-wr-label mono">osrx</span>
    </div>
    <div class="orn-big-ring orn-big-ring--bot"></div>
  </div>

  <div class="graphic-accents" aria-hidden="true">
    <div class="ga-shape ga-asterisk">
      <svg viewBox="0 0 80 80" fill="none">
        <path
          d="M40 4 L40 76 M4 40 L76 40 M14 14 L66 66 M14 66 L66 14"
          stroke="currentColor"
          stroke-width="1.2"
          stroke-linecap="round"
        />
        <circle cx="40" cy="40" r="6" stroke="currentColor" stroke-width="0.8" />
      </svg>
    </div>

    <div class="ga-shape ga-bloom">
      <svg viewBox="0 0 100 100" fill="none">
        <ellipse cx="50" cy="50" rx="44" ry="44" stroke="currentColor" stroke-width="0.8" />
        <ellipse cx="50" cy="50" rx="30" ry="44" stroke="currentColor" stroke-width="0.8" />
        <ellipse cx="50" cy="50" rx="44" ry="30" stroke="currentColor" stroke-width="0.8" />
        <circle cx="50" cy="50" r="8" stroke="currentColor" stroke-width="0.7" />
      </svg>
    </div>

    <div class="ga-shape ga-capsules">
      <svg viewBox="0 0 120 80" fill="none">
        <rect
          x="4"
          y="15"
          width="60"
          height="22"
          rx="11"
          stroke="currentColor"
          stroke-width="0.9"
        />
        <rect
          x="56"
          y="43"
          width="60"
          height="22"
          rx="11"
          stroke="currentColor"
          stroke-width="0.9"
        />
        <rect
          x="30"
          y="4"
          width="28"
          height="20"
          rx="10"
          stroke="currentColor"
          stroke-width="0.8"
        />
      </svg>
    </div>

    <div class="ga-shape ga-petals">
      <svg viewBox="0 0 90 90" fill="none">
        <path d="M45 10 Q60 30 45 45 Q30 30 45 10Z" stroke="currentColor" stroke-width="0.8" />
        <path d="M80 45 Q60 60 45 45 Q60 30 80 45Z" stroke="currentColor" stroke-width="0.8" />
        <path d="M45 80 Q30 60 45 45 Q60 60 45 80Z" stroke="currentColor" stroke-width="0.8" />
        <path d="M10 45 Q30 30 45 45 Q30 60 10 45Z" stroke="currentColor" stroke-width="0.8" />
        <circle cx="45" cy="45" r="4" fill="currentColor" opacity="0.5" />
      </svg>
    </div>

    <div class="ga-shape ga-soft-star">
      <svg viewBox="0 0 80 80" fill="none">
        <path
          d="M40 4 Q45 32 68 40 Q45 48 40 76 Q35 48 12 40 Q35 32 40 4Z"
          stroke="currentColor"
          stroke-width="0.9"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div class="ga-shape ga-ring-cluster">
      <svg viewBox="0 0 100 100" fill="none">
        <circle cx="35" cy="35" r="22" stroke="currentColor" stroke-width="0.8" />
        <circle cx="65" cy="40" r="18" stroke="currentColor" stroke-width="0.8" />
        <circle cx="50" cy="65" r="14" stroke="currentColor" stroke-width="0.7" />
        <circle cx="50" cy="45" r="3" fill="currentColor" opacity="0.4" />
      </svg>
    </div>

    <div class="ga-shape ga-ribbon">
      <svg viewBox="0 0 140 60" fill="none">
        <path
          d="M4 30 Q35 4 70 30 Q105 56 136 30"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
        />
        <path
          d="M4 36 Q35 10 70 36 Q105 62 136 36"
          stroke="currentColor"
          stroke-width="0.7"
          stroke-linecap="round"
          opacity="0.5"
        />
        <circle cx="70" cy="30" r="3" fill="currentColor" opacity="0.35" />
      </svg>
    </div>

    <div class="ga-shape ga-overlap-rings">
      <svg viewBox="0 0 80 80" fill="none">
        <circle cx="28" cy="32" r="24" stroke="currentColor" stroke-width="0.7" />
        <circle cx="52" cy="32" r="24" stroke="currentColor" stroke-width="0.7" />
        <circle cx="40" cy="52" r="24" stroke="currentColor" stroke-width="0.7" />
      </svg>
    </div>
  </div>

  {#if error}
    <div class="error-bar" data-reveal role="alert">
      <span class="error-bar-icon" aria-hidden="true">!</span>
      {error}
      <button type="button" onclick={() => (error = null)} aria-label="Dismiss">✕</button>
    </div>
  {/if}

  {#if loading}
    <div class="loading-state" data-reveal aria-live="polite">
      <div class="loading-orb">
        <div class="loading-orb-ring"></div>
        <div class="loading-orb-core ambient-dot"></div>
      </div>
      <span class="mono muted">Parsing replay…</span>
    </div>
  {:else if !replay}
    <div class="empty-state">
      <div class="empty-hero" data-reveal>
        <span class="empty-index mono muted">00</span>
        <h1 class="hero-headline">
          Edit your<br />replay<span class="hero-accent">.</span>
        </h1>
        <p class="hero-sub muted">
          Upload any .osr file — inspect metadata, adjust mods, export the updated replay.
        </p>
      </div>
      <div class="empty-drop" data-reveal>
        <DropZone ondrop={onDrop} />
      </div>
    </div>
  {:else}
    <div class="editor">
      <div class="editor-header">
        <div class="editor-header-left">
          <span class="mode-badge mono"
            >{PLAY_MODES[replay.play_mode] ?? `mode ${replay.play_mode}`}</span
          >
          <span class="mod-summary mono muted">{modStr}</span>
          {#if isLazer}<span class="lazer-badge mono">lazer</span>{/if}
        </div>
        <div class="header-rule" aria-hidden="true">
          <div class="header-rule-line breathing-border"></div>
          <div class="header-rule-tick ambient-dot"></div>
          <div class="header-rule-line breathing-border"></div>
        </div>
      </div>

      <div class="editor-grid">
        <section class="editor-section card-surface" aria-label="Performance">
          <div class="section-accent" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" class="accent-svg">
              <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="0.8" />
              <circle
                cx="32"
                cy="32"
                r="18"
                stroke="currentColor"
                stroke-width="0.5"
                stroke-dasharray="3 4"
              />
              <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.5" />
              <line
                x1="32"
                y1="4"
                x2="32"
                y2="12"
                stroke="currentColor"
                stroke-width="0.5"
                opacity="0.4"
              />
              <line
                x1="32"
                y1="52"
                x2="32"
                y2="60"
                stroke="currentColor"
                stroke-width="0.5"
                opacity="0.4"
              />
              <line
                x1="4"
                y1="32"
                x2="12"
                y2="32"
                stroke="currentColor"
                stroke-width="0.5"
                opacity="0.4"
              />
              <line
                x1="52"
                y1="32"
                x2="60"
                y2="32"
                stroke="currentColor"
                stroke-width="0.5"
                opacity="0.4"
              />
            </svg>
          </div>
          <div class="section-head-wrap">
            <span class="section-index mono muted">01</span>
            <h2 class="section-head">Performance</h2>
            <span class="section-cross mono muted" aria-hidden="true">+</span>
          </div>
          <div class="section-device-line breathing-border" aria-hidden="true"></div>
          <div class="fields">
            <FieldRow label="Username" bind:value={replay.username} />
            <FieldRow label="Score" bind:value={replay.score} type="number" />
            <FieldRow label="Max combo" bind:value={replay.max_combo} type="number" hint="×" />
            <FieldRow label="Full combo" bind:value={replay.fullcombo} type="checkbox" />
          </div>
          <div class="line-art line-art--perf" aria-hidden="true">
            <svg viewBox="0 0 320 140" fill="none" preserveAspectRatio="none">
              <path
                class="la-path"
                d="M-10 90 Q60 80 110 40 T220 20 T300 60"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              />
              <path
                class="la-path"
                d="M20 110 Q80 50 150 60 T260 100"
                stroke="currentColor"
                stroke-width="0.8"
                stroke-linecap="round"
                opacity="0.5"
                vector-effect="non-scaling-stroke"
              />
              <circle cx="110" cy="40" r="2.5" fill="currentColor" opacity="0.35" />
              <circle cx="260" cy="100" r="1.8" fill="currentColor" opacity="0.25" />
            </svg>
          </div>
        </section>

        <section class="editor-section card-surface" aria-label="Hit counts">
          <div class="section-accent" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" class="accent-svg">
              <polyline
                points="8,44 16,36 24,46 32,24 40,34 48,14 56,22"
                stroke="currentColor"
                stroke-width="0.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <line
                x1="8"
                y1="52"
                x2="56"
                y2="52"
                stroke="currentColor"
                stroke-width="0.5"
                opacity="0.4"
              />
              {#each [16, 24, 32, 40, 48] as cx}
                <circle {cx} cy="52" r="1.5" fill="currentColor" opacity="0.25" />
              {/each}
              <line
                x1="8"
                y1="8"
                x2="8"
                y2="52"
                stroke="currentColor"
                stroke-width="0.4"
                opacity="0.3"
              />
              <line
                x1="8"
                y1="44"
                x2="2"
                y2="44"
                stroke="currentColor"
                stroke-width="0.4"
                opacity="0.3"
              />
            </svg>
          </div>
          <div class="section-head-wrap">
            <span class="section-index mono muted">02</span>
            <h2 class="section-head">Hit counts</h2>
            <span class="section-cross mono muted" aria-hidden="true">+</span>
          </div>
          <div class="section-sparkline" aria-hidden="true">
            <svg viewBox="0 0 100 12" fill="none" preserveAspectRatio="none">
              <rect x="0" y="0" width="100" height="12" fill="none" />
              {#each [0, 8, 14, 12, 20, 30, 44, 42, 56, 68, 72, 70, 84, 96, 100] as val, i}
                {@const px = (i / 14) * 100}
                {@const py = (val / 100) * 12}
                <circle cx={px} cy={py} r="1.2" fill="var(--color-accent)" opacity="0.5" />
              {/each}
            </svg>
          </div>
          <div class="section-device-line breathing-border" aria-hidden="true"></div>
          <div class="fields">
            <FieldRow label="300" bind:value={replay.count_300} type="number" />
            <FieldRow label="100" bind:value={replay.count_100} type="number" />
            <FieldRow label="50" bind:value={replay.count_50} type="number" />
            <FieldRow label="Miss" bind:value={replay.count_miss} type="number" />
            <FieldRow label="Geki" bind:value={replay.count_geki} type="number" hint="mania 300g" />
            <FieldRow label="Katu" bind:value={replay.count_katu} type="number" hint="mania 200" />
          </div>
          <div class="line-art line-art--hits" aria-hidden="true">
            <svg viewBox="0 0 320 120" fill="none" preserveAspectRatio="none">
              <path
                class="la-path"
                d="M240 -10 Q200 40 260 70 T240 130"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              />
              <path
                class="la-path"
                d="M270 0 Q230 50 280 90"
                stroke="currentColor"
                stroke-width="0.7"
                stroke-linecap="round"
                opacity="0.45"
                vector-effect="non-scaling-stroke"
              />
              <circle cx="240" cy="70" r="2" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
        </section>
      </div>

      <div class="inter-section-gap" aria-hidden="true"></div>

      {#if !isLazer}
        <section class="editor-section mods-section card-surface" aria-label="Mods">
          <div class="section-accent mods-accent" aria-hidden="true">
            <svg viewBox="0 0 72 40" fill="none" class="accent-svg">
              <circle cx="16" cy="20" r="14" stroke="currentColor" stroke-width="0.8" />
              <circle cx="36" cy="20" r="14" stroke="currentColor" stroke-width="0.8" />
              <circle cx="56" cy="20" r="14" stroke="currentColor" stroke-width="0.8" />
              <circle
                cx="16"
                cy="20"
                r="5"
                stroke="currentColor"
                stroke-width="0.4"
                opacity="0.5"
              />
              <circle
                cx="36"
                cy="20"
                r="5"
                stroke="currentColor"
                stroke-width="0.4"
                opacity="0.5"
              />
              <circle
                cx="56"
                cy="20"
                r="5"
                stroke="currentColor"
                stroke-width="0.4"
                opacity="0.5"
              />
              <circle
                cx="36"
                cy="20"
                r="22"
                stroke="currentColor"
                stroke-width="0.3"
                stroke-dasharray="4 6"
                opacity="0.4"
              />
            </svg>
            <div class="orbit-ring" aria-hidden="true">
              <div class="orbit-dot ambient-dot"></div>
            </div>
          </div>
          <div class="section-head-wrap">
            <span class="section-index mono muted">03</span>
            <h2 class="section-head" style="border:none;padding:0">Mods</h2>
            <span class="section-cross mono muted" aria-hidden="true">+</span>
          </div>
          <p class="mods-subhead mono muted">stable bitmask</p>
          <div class="section-device-line breathing-border" aria-hidden="true"></div>
          <ModSelector bind:mods={replay.mods} />
          <div class="line-art line-art--mods" aria-hidden="true">
            <svg viewBox="0 0 720 180" fill="none" preserveAspectRatio="none">
              <path
                class="la-path"
                d="M-20 140 Q100 30 200 50 T400 20 T560 90 T740 40"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              />
              <path
                class="la-path"
                d="M30 160 Q140 70 240 80 T420 60 T580 120 T720 90"
                stroke="currentColor"
                stroke-width="0.7"
                stroke-linecap="round"
                opacity="0.4"
                vector-effect="non-scaling-stroke"
              />
              <circle cx="200" cy="50" r="2.8" fill="currentColor" opacity="0.3" />
              <circle cx="560" cy="90" r="2.2" fill="currentColor" opacity="0.25" />
              <circle cx="400" cy="20" r="1.5" fill="currentColor" opacity="0.2" />
            </svg>
          </div>
        </section>
      {/if}

      {#if isLazer}
        <section class="editor-section lazer-section card-surface" aria-label="Lazer mods">
          <div class="section-accent lazer-accent" aria-hidden="true">
            <svg viewBox="0 0 72 40" fill="none" class="accent-svg">
              <line
                x1="0"
                y1="20"
                x2="72"
                y2="20"
                stroke="currentColor"
                stroke-width="0.6"
                opacity="0.5"
              />
              <line
                x1="12"
                y1="4"
                x2="60"
                y2="36"
                stroke="currentColor"
                stroke-width="0.4"
                opacity="0.3"
              />
              <line
                x1="12"
                y1="36"
                x2="60"
                y2="4"
                stroke="currentColor"
                stroke-width="0.4"
                opacity="0.3"
              />
              <circle cx="36" cy="20" r="8" stroke="currentColor" stroke-width="0.8" />
              <circle cx="36" cy="20" r="2" fill="currentColor" opacity="0.4" />
            </svg>
            <div class="crosshair-h" aria-hidden="true"></div>
            <div class="crosshair-v" aria-hidden="true"></div>
          </div>
          <div class="section-head-wrap">
            <span class="section-index mono muted">03</span>
            <h2 class="section-head" style="border:none;padding:0">Lazer mods</h2>
            <span class="section-cross mono muted" aria-hidden="true">+</span>
          </div>
          <p class="mods-subhead mono muted">score_info · {PLAY_MODES[replay.play_mode]}</p>
          <div class="section-device-line breathing-border" aria-hidden="true"></div>

          {#each Object.entries(lazerByCategory) as [cat, mods]}
            <div class="lazer-category">
              <span class="category-label mono muted">{CATEGORY_LABELS[cat]}</span>
              <div class="lazer-pills">
                {#each mods as mod}
                  {@const active = activeLazerMods.some((m) => m.acronym === mod.acronym)}
                  {@const icon = modIcon(mod.acronym)}
                  <button
                    type="button"
                    class="lazer-pill"
                    class:active
                    data-pill
                    aria-pressed={active}
                    title={mod.name}
                    onclick={() => toggleLazerMod(mod.acronym)}
                  >
                    {#if icon}<img src={icon} alt="" class="mod-icon" />{/if}
                    {mod.acronym}
                  </button>
                {/each}
              </div>
            </div>
          {/each}

          {#if activeLazerMods.length > 0}
            <div class="lazer-settings-list">
              {#each activeLazerMods as _, i (activeLazerMods[i].acronym)}
                <LazerModSettingsEditor bind:mod={activeLazerMods[i]} />
              {/each}
            </div>
          {/if}
          <div class="line-art line-art--lazer" aria-hidden="true">
            <svg viewBox="0 0 720 160" fill="none" preserveAspectRatio="none">
              <path
                class="la-path"
                d="M-10 120 Q80 20 180 40 T360 10 T540 80 T740 30"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              />
              <path
                class="la-path"
                d="M40 140 Q120 50 220 70 T400 30 T580 100 T720 60"
                stroke="currentColor"
                stroke-width="0.7"
                stroke-linecap="round"
                opacity="0.4"
                vector-effect="non-scaling-stroke"
              />
              <circle cx="180" cy="40" r="2.5" fill="currentColor" opacity="0.28" />
              <circle cx="540" cy="80" r="2" fill="currentColor" opacity="0.22" />
            </svg>
          </div>
        </section>
      {/if}

      <div class="inter-section-gap" aria-hidden="true"></div>

      <section class="editor-section readonly-section card-surface" aria-label="Metadata">
        <div class="section-accent corner-accent" aria-hidden="true">
          <svg viewBox="0 0 120 24" fill="none" preserveAspectRatio="none" class="accent-svg">
            <line x1="0" y1="0" x2="0" y2="24" stroke="currentColor" stroke-width="0.75" />
            <line x1="0" y1="0" x2="120" y2="0" stroke="currentColor" stroke-width="0.75" />
            <line
              x1="0"
              y1="12"
              x2="48"
              y2="12"
              stroke="currentColor"
              stroke-width="0.5"
              opacity="0.5"
            />
            <circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.2" />
          </svg>
        </div>
        <div class="section-head-wrap">
          <span class="section-index mono muted">04</span>
          <h2 class="section-head">Metadata</h2>
          <span class="meta-badge mono">read-only</span>
        </div>
        <div class="section-device-line breathing-border" aria-hidden="true"></div>
        <div class="fields">
          <FieldRow label="Beatmap MD5" value={replay.beatmap_md5} mono readonly />
          <FieldRow label="Replay MD5" value={replay.replay_md5} mono readonly />
          <FieldRow label="Online ID" value={replay.online_id} type="number" readonly />
          <FieldRow label="osu! version" value={replay.osu_version} type="text" readonly />
          <FieldRow label="Timestamp" value={replay.timestamp} mono readonly />
        </div>
      </section>
    </div>
  {/if}
</main>

{#if replay}
  <div class="save-bar" role="region" aria-label="Save actions">
    <span class="save-hint mono muted">
      {replay.username} · {modStr} · {replay.score.toLocaleString()}
    </span>
    <button class="btn-save" type="button" onclick={onSave} disabled={saving} aria-busy={saving}>
      {saving ? 'Saving…' : 'Save & download'}
    </button>
  </div>
{/if}

{#if !replay}
  <footer class="footer" data-reveal>
    <div class="footer-ornament" aria-hidden="true">
      <svg viewBox="0 0 300 20" fill="none" preserveAspectRatio="none" class="footer-graph">
        <line
          x1="0"
          y1="10"
          x2="300"
          y2="10"
          stroke="currentColor"
          stroke-width="0.4"
          opacity="0.3"
        />
        <polyline
          points="0,14 15,12 30,16 45,8 60,13 75,7 90,15 105,10 120,14 135,6 150,13 165,11 180,8 195,15 210,9 225,12 240,7 255,13 270,10 285,6 300,14"
          stroke="currentColor"
          stroke-width="0.5"
          opacity="0.25"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="150" cy="10" r="1.5" fill="currentColor" opacity="0.25" />
        <circle cx="45" cy="8" r="1" fill="currentColor" opacity="0.15" />
      </svg>
    </div>
    <div class="line-art line-art--footer" aria-hidden="true">
      <svg viewBox="0 0 1060 60" fill="none" preserveAspectRatio="none">
        <path
          class="la-path"
          d="M-20 30 Q200 -10 530 20 T1080 30"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
        <path
          class="la-path"
          d="M100 40 Q350 10 530 30 T1000 40"
          stroke="currentColor"
          stroke-width="0.6"
          stroke-linecap="round"
          opacity="0.4"
          vector-effect="non-scaling-stroke"
        />
        <circle cx="530" cy="20" r="2.5" fill="currentColor" opacity="0.25" />
      </svg>
    </div>
    <hr class="footer-rule breathing-border" aria-hidden="true" />
    <p class="footer-line mono muted">
      osrx &middot; replay metadata editor &middot;
      <a
        href="https://github.com/remeliah/osrx"
        class="footer-gh-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg class="footer-gh-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path
            d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.64 7.64 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
        remeliah/osrx
      </a>
    </p>
  </footer>
{/if}

<style>
  @import '$lib/css/page-keyframes.css';
  @import '$lib/css/page-ambient.css';
  @import '$lib/css/page-editor.css';
  @import '$lib/css/page-chrome.css';
</style>
