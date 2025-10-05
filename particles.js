class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    
    // Configuration with SFU red theme
    this.config = {
      particleCount: options.particleCount || 150,
      particleColors: options.particleColors || ['#a6192e', '#d32f2f', '#ff5252', '#ffffff'],
      speed: options.speed || 0.5,
      particleSize: options.particleSize || 2,
      connectionDistance: options.connectionDistance || 100,
      mouseInteraction: options.mouseInteraction !== false,
      ...options
    };
    
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;
    
    this.init();
    this.bindEvents();
    this.animate();
  }
  
  init() {
    this.resizeCanvas();
    this.createParticles();
  }
  
  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = rect.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width / window.devicePixelRatio,
        y: Math.random() * this.canvas.height / window.devicePixelRatio,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        size: Math.random() * this.config.particleSize + 1,
        color: this.config.particleColors[Math.floor(Math.random() * this.config.particleColors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
    
    if (this.config.mouseInteraction) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      
      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });
    }
  }
  
  updateParticles() {
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      
      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));
      
      // Mouse interaction
      if (this.config.mouseInteraction) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx -= (dx / distance) * force * 0.1;
          particle.vy -= (dy / distance) * force * 0.1;
        }
      }
      
      // Pulse effect
      particle.pulse += 0.02;
      particle.currentSize = particle.size + Math.sin(particle.pulse) * 0.5;
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.currentSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Add glow effect for red particles
      if (particle.color.includes('#a6192e') || particle.color.includes('#d32f2f')) {
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
      }
      
      this.ctx.restore();
    });
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = (1 - distance / this.config.connectionDistance) * 0.3;
          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          this.ctx.strokeStyle = '#a6192e';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);
    
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    new ParticleSystem(canvas, {
      particleCount: 120,
      particleColors: ['#a6192e', '#d32f2f', '#ff5252', '#ffffff', '#ffcdd2'],
      speed: 0.3,
      particleSize: 3,
      connectionDistance: 120,
      mouseInteraction: true
    });
  }
});
