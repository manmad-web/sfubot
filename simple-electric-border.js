// Simple Electric Border Effect
function addElectricBorder() {
  console.log('🔍 Adding simple electric border...');
  
  const chatInput = document.querySelector('.chat-input-container');
  if (!chatInput) {
    console.error('❌ Chat input not found');
    return;
  }
  
  console.log('✅ Chat input found, applying electric border...');
  
  // Add electric border styles directly
  chatInput.style.position = 'relative';
  chatInput.style.overflow = 'visible';
  
  // Create electric border wrapper
  const electricBorder = document.createElement('div');
  electricBorder.className = 'simple-electric-border';
  electricBorder.style.cssText = `
    position: absolute;
    inset: -3px;
    border-radius: 18px;
    background: linear-gradient(45deg, #a6192e, #ff5252, #a6192e, #d32f2f);
    background-size: 400% 400%;
    animation: electricFlow 3s ease-in-out infinite;
    z-index: -1;
    filter: blur(2px);
  `;
  
  // Create inner glow
  const innerGlow = document.createElement('div');
  innerGlow.className = 'electric-glow';
  innerGlow.style.cssText = `
    position: absolute;
    inset: -6px;
    border-radius: 21px;
    background: linear-gradient(45deg, transparent, #a6192e33, transparent, #ff525233);
    background-size: 400% 400%;
    animation: electricFlow 2s ease-in-out infinite reverse;
    z-index: -2;
    filter: blur(8px);
  `;
  
  // Insert before chat input
  chatInput.parentNode.insertBefore(electricBorder, chatInput);
  chatInput.parentNode.insertBefore(innerGlow, chatInput);
  
  console.log('✅ Simple electric border applied!');
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes electricFlow {
    0% {
      background-position: 0% 50%;
      opacity: 0.8;
    }
    25% {
      background-position: 100% 50%;
      opacity: 1;
    }
    50% {
      background-position: 100% 100%;
      opacity: 0.9;
    }
    75% {
      background-position: 0% 100%;
      opacity: 1;
    }
    100% {
      background-position: 0% 50%;
      opacity: 0.8;
    }
  }
  
  .simple-electric-border {
    box-shadow: 
      0 0 20px #a6192e66,
      0 0 40px #a6192e33,
      inset 0 0 20px #ff525233;
  }
  
  .electric-glow {
    box-shadow: 
      0 0 60px #a6192e44,
      0 0 100px #a6192e22;
  }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(addElectricBorder, 500);
});
