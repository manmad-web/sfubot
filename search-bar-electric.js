// Electric Border specifically for the search bar
function addSearchBarElectricBorder() {
  console.log('🔍 Looking for search bar...');
  
  // Target the entire chat input container, not just the input field
  const searchBar = document.querySelector('.chat-input-container') || 
                   document.querySelector('#user-input')?.parentElement;
  
  if (!searchBar) {
    console.error('❌ Search bar not found');
    return;
  }
  
  console.log('✅ Search bar found:', searchBar);
  
  // Remove any existing electric borders
  const existing = searchBar.parentElement.querySelectorAll('.electric-wrapper, .electric-glow-outer');
  existing.forEach(el => el.remove());
  
  // Create electric border wrapper
  const electricWrapper = document.createElement('div');
  electricWrapper.className = 'electric-wrapper';
  electricWrapper.style.cssText = `
    position: relative;
    display: inline-block;
    border-radius: 10px;
    width: 100%;
  `;
  
  // Create the electric border effect
  const electricBorder = document.createElement('div');
  electricBorder.className = 'electric-border-effect';
  electricBorder.style.cssText = `
    position: absolute;
    inset: -4px;
    border-radius: 19px;
    background: linear-gradient(45deg, 
      #a6192e, 
      #ff5252, 
      #d32f2f, 
      #a6192e, 
      #ff5252
    );
    background-size: 200% 200%;
    animation: electricPulse 2s ease-in-out infinite;
    z-index: -1;
    opacity: 0.2;
    pointer-events: none;
  `;
  
  // Create outer glow
  const outerGlow = document.createElement('div');
  outerGlow.className = 'electric-glow-outer';
  outerGlow.style.cssText = `
    position: absolute;
    inset: -8px;
    border-radius: 23px;
    background: radial-gradient(circle, 
      #a6192e66 0%, 
      #ff525244 30%, 
      #d32f2f33 50%,
      transparent 90%
    );
    animation: electricGlow 3s ease-in-out infinite alternate;
    z-index: -2;
    filter: blur(4px);
    pointer-events: none;
    opacity: 0.4;
  `;
  
  // Wrap the search bar
  const parent = searchBar.parentElement;
  parent.insertBefore(electricWrapper, searchBar);
  electricWrapper.appendChild(outerGlow);
  electricWrapper.appendChild(electricBorder);
  electricWrapper.appendChild(searchBar);
  
  console.log('✅ Electric border applied to search bar!');
}

// Add the CSS animations
const electricStyles = document.createElement('style');
electricStyles.textContent = `
  @keyframes electricPulse {
    0% {
      background-position: 0% 40%;
      box-shadow: 
        0 0 15px #a6192e66,
        0 0 25px #a6192e33,
        inset 0 0 15px #ff525222;
    }
    25% {
      background-position: 100% 40%;
      box-shadow: 
        0 0 18px #ff525288,
        0 0 30px #ff525244,
        inset 0 0 18px #a6192e33;
    }
    50% {
      background-position: 100% 50%;
      box-shadow: 
        0 0 16px #d32f2f77,
        0 0 28px #d32f2f44,
        inset 0 0 16px #ff525222;
    }
    75% {
      background-position: 0% 80%;
      box-shadow: 
        0 0 20px #a6192e99,
        0 0 35px #a6192e55,
        inset 0 0 20px #d32f2f44;
    }
    100% {
      background-position: 0% 70%;
      box-shadow: 
        0 0 15px #a6192e66,
        0 0 25px #a6192e33,
        inset 0 0 15px #ff525222;
    }
  }
  
  @keyframes electricGlow {
    0% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.4;
      transform: scale(1.02);
    }
  }
  
  .electric-wrapper {
    filter: drop-shadow(0 0 5px #a6192e44) drop-shadow(0 0 10px #ff525233);
    display: inline-block !important;
    width: auto !important;
  }
  
  .electric-wrapper .chat-input-container {
    margin: 0 !important;
    position: relative;
    width: 95% !important;
    max-width: none !important;
  }
`;
document.head.appendChild(electricStyles);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Try immediately
  addSearchBarElectricBorder();
  
  // Try again after a delay in case elements load later
  setTimeout(addSearchBarElectricBorder, 1000);
  
  // Try once more after scripts load
  setTimeout(addSearchBarElectricBorder, 2000);
});
