const gridContainer = document.getElementById('grid-container');

// Generate 60 squares and append to grid
for (let i = 0; i < 60; i++) {
    const box = document.createElement('div');
    box.classList.add('box');
    
    // Number starting from 101
    const boxNumber = 101 + i;
    box.textContent = boxNumber;

    // Randomly decide if the place is filled (red) or available (green)
    const isFilled = Math.random() < 0.5; // 50% chance
    if (isFilled) {
        box.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Light transparent red for filled spots
    }

    gridContainer.appendChild(box);
}
