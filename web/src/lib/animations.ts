import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ease = {
  power3: 'power3.out',
  power4: 'power4.out',
  expo: 'expo.out',
  back: 'back.out(1.6)',
  circ: 'circ.out',
  elastic: 'elastic.out(1, 0.5)',
} as const;

export function animatePageEntrance() {
  const tl = gsap.timeline({ defaults: { ease: ease.expo } });

  tl.fromTo('.nav',
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: ease.power4 }
  );

  tl.fromTo('[data-reveal]',
    { y: 40, opacity: 0, scale: 0.95, rotateX: 5 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      duration: 1,
      stagger: {
        amount: 0.6,
        from: 'start',
        ease: ease.power3
      },
      ease: ease.expo
    },
    '-=0.4'
  );

  return tl;
}

export function magneticEffect(element: HTMLElement, strength = 0.3) {
  let rafId: number;

  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.6,
        ease: ease.power3,
      });
    });
  };

  const onMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: ease.back,
    });
  };

  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

export function animateNumber(
  element: HTMLElement,
  target: number,
  duration = 1.2
) {
  const obj = { value: parseFloat(element.textContent || '0') };

  return gsap.to(obj, {
    value: target,
    duration,
    ease: ease.expo,
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toLocaleString();
    },
  });
}

export function shimmerPill(element: HTMLElement) {
  const tl = gsap.timeline();

  tl.to(element, {
    scale: 0.97,
    duration: 0.1,
    ease: ease.power3,
  });

  tl.to(element, {
    scale: 1,
    duration: 0.4,
    ease: ease.back,
  });

  const shimmer = element.querySelector('.shimmer-overlay');
  if (shimmer) {
    tl.fromTo(shimmer,
      { x: '-100%' },
      { x: '100%', duration: 0.6, ease: ease.power3 },
      '-=0.3'
    );
  }

  return tl;
}

export function floatElement(element: HTMLElement, intensity = 1) {
  return gsap.to(element, {
    y: -8 * intensity,
    duration: 2 + Math.random(),
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

export function breatheGlow(element: HTMLElement) {
  return gsap.to(element, {
    opacity: 0.6,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

export function parallaxScroll(selector: string, speed = 0.5) {
  if (typeof window === 'undefined') return;

  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    gsap.to(element, {
      y: () => -window.scrollY * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}

export function cardDepth(element: HTMLElement) {
  let rafId: number;

  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      gsap.to(element, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: ease.power3,
      });
    });
  };

  const onMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: ease.back,
    });
  };

  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

export function buttonPress(element: HTMLElement) {
  const tl = gsap.timeline();

  tl.to(element, {
    scale: 0.92,
    duration: 0.1,
    ease: ease.power3,
  })
  .to(element, {
    scale: 1,
    duration: 0.3,
    ease: ease.back,
  });

  return tl;
}

export function staggerPills(container: HTMLElement) {
  const pills = container.querySelectorAll('[data-pill]');

  return gsap.fromTo(pills,
    { scale: 0, opacity: 0, rotateZ: -10 },
    {
      scale: 1,
      opacity: 1,
      rotateZ: 0,
      duration: 0.5,
      stagger: {
        amount: 0.4,
        grid: 'auto',
        from: 'start',
        ease: ease.power3,
      },
      ease: ease.back,
    }
  );
}
