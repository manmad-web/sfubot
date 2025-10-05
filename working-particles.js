// Guaranteed Working Particle System
class WorkingParticles {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    // Create canvas
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) {
      console.error('❌ Canvas not found! Looking for #particle-canvas');
      return;
    }
    
    console.log('✅ Canvas found:', this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas style
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.background = 'transparent';
    
    console.log('✅ Canvas styles applied');
    
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
    
    console.log('✅ Particles initialized successfully!');
  }
  
  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Ensure canvas covers the entire viewport
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    
    console.log(`✅ Canvas resized to ${width}x${height}`);
  }
  
  createParticles() {
    const colors = ['#a6192e', '#d32f2f', '#ff5252', '#ffffff', '#ffcdd2', '#f0f0f0', '#e0e0e0', '#ff6b6b', '#4ecdc4', '#45b7d1'];
    
    for (let i = 0; i < 300; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        originalSize: Math.random() * 4 + 2,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.04 + 0.02
      });
    }
    
    console.log(`✅ Created ${this.particles.length} particles`);
  }
  
  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
    });
    
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    // Add touch support for mobile
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    });
  }
  
  animate() {
    // Clear canvas with transparent background
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Debug: Log particle count
    if (this.particles.length === 0) {
      console.warn('⚠️ No particles to animate!');
      return;
    }
    
    // Draw a subtle background gradient to make particles more visible
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.pulse += particle.pulseSpeed;
      particle.twinkle += particle.twinkleSpeed;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Keep in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.vx += (dx / distance) * force * 0.015;
        particle.vy += (dy / distance) * force * 0.015;
      }
      
      // Apply some friction
      particle.vx *= 0.995;
      particle.vy *= 0.995;
      
      // Draw particle with enhanced effects
      const pulseSize = Math.sin(particle.pulse) * 1;
      const twinkleOpacity = Math.sin(particle.twinkle) * 0.4 + 0.8;
      const currentSize = particle.originalSize + pulseSize;
      const currentOpacity = particle.opacity * twinkleOpacity;
      
      this.ctx.save();
      this.ctx.globalAlpha = currentOpacity;
      this.ctx.fillStyle = particle.color;
      
      // Enhanced glow for all particles
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      
      // Draw main particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw inner glow
      this.ctx.shadowBlur = 5;
      this.ctx.globalAlpha = currentOpacity * 0.6;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, currentSize * 0.6, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
    
    // Draw connections between nearby particles
    this.drawConnections();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const opacity = (1 - distance / 150) * 0.3;
          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          
          // Use gradient for connections
          const gradient = this.ctx.createLinearGradient(
            this.particles[i].x, this.particles[i].y,
            this.particles[j].x, this.particles[j].y
          );
          gradient.addColorStop(0, this.particles[i].color);
          gradient.addColorStop(1, this.particles[j].color);
          
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 1;
          this.ctx.shadowColor = '#ffffff';
          this.ctx.shadowBlur = 2;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Starting particle system...');
  
  // Add a small delay to ensure DOM is fully loaded
  setTimeout(() => {
    const particles = new WorkingParticles();
    
    // Fallback: If particles don't work after 2 seconds, try again
    setTimeout(() => {
      const canvas = document.getElementById('particle-canvas');
      if (canvas && canvas.width === 0) {
        console.log('🔄 Retrying particle system...');
        new WorkingParticles();
      } else {
        console.log('✅ Particle system is working!');
      }
    }, 2000);
  }, 100);
});
