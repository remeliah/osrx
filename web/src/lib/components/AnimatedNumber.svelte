<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let { value = $bindable(0) }: { value: number } = $props();

  let displayValue = $state(value);
  let element: HTMLSpanElement;
  let tween: gsap.core.Tween | null = null;

  $effect(() => {
    if (!element) return;

    const target = Number(value);
    if (isNaN(target)) return;

    if (tween) tween.kill();

    const obj = { val: displayValue };
    tween = gsap.to(obj, {
      val: target,
      duration: 1.2,
      ease: 'expo.out',
      onUpdate: () => {
        displayValue = Math.round(obj.val);
      },
    });
  });
</script>

<span bind:this={element}>{displayValue.toLocaleString()}</span>
