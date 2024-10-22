function saveToLocalStorage(data) {
    localStorage.setItem('parkingData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const storedData = localStorage.getItem('parkingData');
    return storedData ? JSON.parse(storedData) : [];
}

function renderTable(data) {
    const tableBody = document.getElementById('parkingTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; 

    data.forEach((item, index) => {
        const newRow = tableBody.insertRow();

        newRow.insertCell(0).textContent = item.name;
        newRow.insertCell(1).textContent = item.vehicleName;
        newRow.insertCell(2).textContent = item.vehicleNumber;
        newRow.insertCell(3).textContent = new Date(item.entryDate).toLocaleString();
        newRow.insertCell(4).textContent = new Date(item.exitDate).toLocaleString();
        
        const removeCell = newRow.insertCell(5);
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            // Remove vehicle and make the spot available again
            const boxNumber = item.parkingSpot;
            const box = document.querySelector(`.box[data-number="${boxNumber}"]`);
            box.style.backgroundColor = 'rgba(0, 128, 0, 0.5)'; // Turn the spot back to green

            data.splice(index, 1);
            saveToLocalStorage(data);
            renderTable(data); 
        };
        removeCell.appendChild(removeButton);
    });
}

function initializeGrid(data) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = ''; // Clear any previous boxes

    for (let i = 0; i < 60; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        
        const boxNumber = 101 + i;
        box.textContent = boxNumber;
        box.setAttribute('data-number', boxNumber);

        // Set color based on availability
        const isOccupied = data.some(entry => entry.parkingSpot === boxNumber);
        if (isOccupied) {
            box.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Red for occupied spots
        } else {
            box.style.backgroundColor = 'rgba(0, 128, 0, 0.5)'; // Green for available spots
        }

        gridContainer.appendChild(box);
    }
}

function allocateParkingSpot(data) {
    // Find the first available spot (not already occupied)
    for (let i = 101; i <= 160; i++) {
        const isOccupied = data.some(entry => entry.parkingSpot === i);
        if (!isOccupied) {
            return i; // Return the first available spot number
        }
    }
    return null; // Return null if no spots are available
}

window.onload = function() {
    const parkingData = loadFromLocalStorage();
    initializeGrid(parkingData);
    renderTable(parkingData);
};

document.getElementById('saveButton').addEventListener('click', function() {
    const name = document.getElementById('name').value.trim();
    const vehicleName = document.getElementById('vehicleName').value.trim();
    const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
    const entryDate = document.getElementById('entryDate').value;
    const exitDate = document.getElementById('exitDate').value;

    if (!name || !vehicleName || !vehicleNumber || !entryDate || !exitDate) {
        alert('Please fill in all fields.');
        return;
    }

    const parkingData = loadFromLocalStorage();

    const parkingSpot = allocateParkingSpot(parkingData);
    if (!parkingSpot) {
        alert('No available parking spots.');
        return;
    }

    const newEntry = { name, vehicleName, vehicleNumber, entryDate, exitDate, parkingSpot };
    parkingData.push(newEntry);
    saveToLocalStorage(parkingData);
    
    // Update table and grid
    renderTable(parkingData);
    initializeGrid(parkingData);

    // Clear input fields after saving
    document.getElementById('name').value = '';
    document.getElementById('vehicleName').value = '';
    document.getElementById('vehicleNumber').value = '';
    document.getElementById('entryDate').value = '';
    document.getElementById('exitDate').value = '';
});
