// Simple Canvas-based particle system as fallback
class SimpleParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    
    this.config = {
      count: 200,
      colors: ['#a6192e', '#d32f2f', '#ff5252', '#ffffff'],
      speed: 0.5,
      size: 2
    };
    
    this.init();
    this.bindEvents();
    this.animate();
  }
  
  init() {
    this.resize();
    this.createParticles();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    for (let i = 0; i < this.config.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        vz: (Math.random() - 0.5) * this.config.speed,
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
        size: Math.random() * this.config.size + 1,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  
  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;
      particle.pulse += 0.02;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.01;
        particle.vy += (dy / distance) * force * 0.01;
      }
      
      // Draw particle
      const size = particle.size + Math.sin(particle.pulse) * 0.5;
      this.ctx.save();
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = 0.8;
      
      // Add glow for red particles
      if (particle.color.includes('#a6192e') || particle.color.includes('#d32f2f')) {
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur = 10;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize simple particles as fallback
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to see if OGL particles load
  setTimeout(() => {
    const root = document.getElementById('react-particles-root');
    if (root && root.children.length === 0) {
      console.log('OGL particles not loaded, using simple fallback...');
      
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '-1';
      canvas.style.pointerEvents = 'auto';
      
      root.appendChild(canvas);
      new SimpleParticles(canvas);
    }
  }, 2000);
});
