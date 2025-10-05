// Electric Border implementation for vanilla JS
class ElectricBorder {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      color: options.color || '#a6192e',
      speed: options.speed || 1,
      chaos: options.chaos || 0.5,
      thickness: options.thickness || 2,
      ...options
    };
    
    this.filterId = `turbulent-displace-${Math.random().toString(36).substr(2, 9)}`;
    this.svgRef = null;
    this.strokeRef = null;
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    // Wrap the element
    this.createWrapper();
    this.createSVG();
    this.createLayers();
    this.updateAnimation();
    this.bindEvents();
  }
  
  createWrapper() {
    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'electric-border';
    wrapper.style.cssText = `
      --electric-border-color: ${this.options.color};
      --eb-border-width: ${this.options.thickness}px;
      position: relative;
      border-radius: inherit;
      overflow: visible;
      isolation: isolate;
    `;
    
    // Insert wrapper before the element
    this.element.parentNode.insertBefore(wrapper, this.element);
    
    // Move element into wrapper
    const content = document.createElement('div');
    content.className = 'eb-content';
    content.style.cssText = `
      position: relative;
      border-radius: inherit;
      z-index: 1;
    `;
    content.appendChild(this.element);
    wrapper.appendChild(content);
    
    this.wrapper = wrapper;
  }
  
  createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.className = 'eb-svg';
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = `
      position: fixed;
      left: -10000px;
      top: -10000px;
      width: 10px;
      height: 10px;
      opacity: 0.001;
      pointer-events: none;
    `;
    
    // Create filter
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.id = this.filterId;
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    filter.setAttribute('x', '-200%');
    filter.setAttribute('y', '-200%');
    filter.setAttribute('width', '500%');
    filter.setAttribute('height', '500%');
    
    filter.innerHTML = `
      <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
      <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
        <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
      </feOffset>

      <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
      <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
        <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
      </feOffset>

      <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
      <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
        <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
      </feOffset>

      <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
      <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
        <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
      </feOffset>

      <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
      <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
      <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="combinedNoise"
        scale="30"
        xChannelSelector="R"
        yChannelSelector="B"
      />
    `;
    
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    
    this.svgRef = svg;
  }
  
  createLayers() {
    const layers = document.createElement('div');
    layers.className = 'eb-layers';
    layers.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: 2;
    `;
    
    // Create stroke layer
    const stroke = document.createElement('div');
    stroke.className = 'eb-stroke';
    stroke.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-sizing: border-box;
      border: var(--eb-border-width) solid var(--electric-border-color);
      filter: url(#${this.filterId});
    `;
    
    // Create glow layers
    const glow1 = document.createElement('div');
    glow1.className = 'eb-glow-1';
    glow1.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-sizing: border-box;
      border: var(--eb-border-width) solid ${this.options.color}99;
      opacity: 0.5;
      filter: blur(calc(0.5px + (var(--eb-border-width) * 0.25)));
    `;
    
    const glow2 = document.createElement('div');
    glow2.className = 'eb-glow-2';
    glow2.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-sizing: border-box;
      border: var(--eb-border-width) solid ${this.options.color};
      opacity: 0.5;
      filter: blur(calc(2px + (var(--eb-border-width) * 0.5)));
    `;
    
    const backgroundGlow = document.createElement('div');
    backgroundGlow.className = 'eb-background-glow';
    backgroundGlow.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-sizing: border-box;
      z-index: -1;
      transform: scale(1.08);
      filter: blur(32px);
      opacity: 0.3;
      background: linear-gradient(-30deg, ${this.options.color}, transparent, ${this.options.color});
    `;
    
    layers.appendChild(stroke);
    layers.appendChild(glow1);
    layers.appendChild(glow2);
    layers.appendChild(backgroundGlow);
    
    this.wrapper.appendChild(layers);
    this.strokeRef = stroke;
  }
  
  updateAnimation() {
    const svg = this.svgRef;
    const host = this.wrapper;
    if (!svg || !host) return;

    const width = Math.max(1, Math.round(host.clientWidth || host.getBoundingClientRect().width || 0));
    const height = Math.max(1, Math.round(host.clientHeight || host.getBoundingClientRect().height || 0));

    const dyAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dy"]'));
    if (dyAnims.length >= 2) {
      dyAnims[0].setAttribute('values', `${height}; 0`);
      dyAnims[1].setAttribute('values', `0; -${height}`);
    }

    const dxAnims = Array.from(svg.querySelectorAll('feOffset > animate[attributeName="dx"]'));
    if (dxAnims.length >= 2) {
      dxAnims[0].setAttribute('values', `${width}; 0`);
      dxAnims[1].setAttribute('values', `0; -${width}`);
    }

    const baseDur = 6;
    const dur = Math.max(0.001, baseDur / (this.options.speed || 1));
    [...dyAnims, ...dxAnims].forEach(a => a.setAttribute('dur', `${dur}s`));

    const disp = svg.querySelector('feDisplacementMap');
    if (disp) disp.setAttribute('scale', String(30 * (this.options.chaos || 1)));

    // Start animations
    requestAnimationFrame(() => {
      [...dyAnims, ...dxAnims].forEach(a => {
        if (typeof a.beginElement === 'function') {
          try {
            a.beginElement();
          } catch (e) {
            console.warn('ElectricBorder: beginElement failed');
          }
        }
      });
    });
  }
  
  bindEvents() {
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => this.updateAnimation());
      ro.observe(this.wrapper);
    }
  }
  
  destroy() {
    if (this.svgRef) {
      this.svgRef.remove();
    }
    if (this.wrapper) {
      // Move element back out of wrapper
      const content = this.wrapper.querySelector('.eb-content');
      if (content && content.firstChild) {
        this.wrapper.parentNode.insertBefore(content.firstChild, this.wrapper);
      }
      this.wrapper.remove();
    }
  }
}

// Initialize electric border on chat input
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 Looking for chat input container...');
  
  // Wait a bit for other scripts to load
  setTimeout(() => {
    const chatInput = document.querySelector('.chat-input-container');
    console.log('Chat input found:', chatInput);
    
    if (chatInput) {
      console.log('🚀 Applying electric border...');
      try {
        new ElectricBorder(chatInput, {
          color: '#a6192e',
          speed: 1.2,
          chaos: 0.8,
          thickness: 3
        });
        console.log('✅ Electric border applied successfully!');
      } catch (error) {
        console.error('❌ Error applying electric border:', error);
      }
    } else {
      console.error('❌ Chat input container not found!');
      console.log('Available elements:', document.querySelectorAll('*[class*="chat"]'));
    }
  }, 1000);
});
