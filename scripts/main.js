// scripts/main.js

let allPhilosophers = [];

// Fetch and display philosophers
async function fetchPhilosophers() {
    try {
        const response = await fetch('data/philosophers.json');
        const philosophers = await response.json();
        allPhilosophers = philosophers; // Store for searching
        displayPhilosophers(philosophers);
        displayArguments(philosophers);
        // Initialize timeline after fetching data
        initializeTimeline(philosophers);
    } catch (error) {
        console.error('Error fetching philosopher data:', error);
    }
}

// Function to create philosopher cards
function displayPhilosophers(philosophers) {
    const container = document.getElementById('philosophers-container');
    container.innerHTML = ''; // Clear existing content
    philosophers.forEach(philosopher => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Philosopher Image
        const img = document.createElement('img');
        img.src = philosopher.image;
        img.alt = philosopher.name;
        card.appendChild(img);
        
        // Philosopher Name
        const name = document.createElement('h3');
        name.textContent = philosopher.name;
        card.appendChild(name);
        
        // Biography
        const bio = document.createElement('p');
        bio.textContent = philosopher.bio;
        card.appendChild(bio);
        
        // Major Works
        const works = document.createElement('p');
        works.innerHTML = `<strong>Major Works:</strong> ${philosopher.works.join(', ')}`;
        card.appendChild(works);
        
        // Central Arguments
        const args = philosopher.arguments.map(arg => `<em>${arg.title}:</em> ${arg.description}`).join('<br>');
        const argumentsPara = document.createElement('p');
        argumentsPara.innerHTML = `<strong>Central Arguments:</strong> ${args}`;
        card.appendChild(argumentsPara);
        
        // Influence
        const influence = document.createElement('p');
        influence.classList.add('influence');
        influence.innerHTML = `<strong>Influence:</strong> ${philosopher.influence}`;
        card.appendChild(influence);
        
        // Add event listener for detailed view
        card.addEventListener('click', () => {
            showPhilosopherDetails(philosopher);
        });
        
        container.appendChild(card);
    });
}

// Function to create argument cards
function displayArguments(philosophers) {
    const container = document.getElementById('arguments-container');
    container.innerHTML = ''; // Clear existing content
    const uniqueArguments = [];
    
    philosophers.forEach(philosopher => {
        philosopher.arguments.forEach(arg => {
            uniqueArguments.push(arg);
        });
    });
    
    uniqueArguments.forEach(arg => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Argument Title
        const title = document.createElement('h3');
        title.textContent = arg.title;
        card.appendChild(title);
        
        // Argument Description
        const description = document.createElement('p');
        description.textContent = arg.description;
        card.appendChild(description);
        
        // Add event listener for more details
        card.addEventListener('click', () => {
            showArgumentDetails(arg);
        });
        
        container.appendChild(card);
    });
}

// Function to show philosopher details in modal
function showPhilosopherDetails(philosopher) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = philosopher.name;
    modalBody.innerHTML = `
        <img src="${philosopher.image}" alt="${philosopher.name}" style="width:100%; height:auto; border-radius:6px; margin-bottom:15px;">
        <p><strong>Biography:</strong> ${philosopher.bio}</p>
        <p><strong>Major Works:</strong> ${philosopher.works.join(', ')}</p>
        <p><strong>Central Arguments:</strong><br>${philosopher.arguments.map(arg => `<em>${arg.title}:</em> ${arg.description}`).join('<br>')}</p>
        <p><strong>Influence:</strong> ${philosopher.influence}</p>
    `;
    
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

// Function to show argument details in modal
function showArgumentDetails(arg) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = arg.title;
    modalBody.innerHTML = `
        <p><strong>Description:</strong> ${arg.description}</p>
        <p><strong>Importance:</strong> ${arg.importance}</p>
        <p><strong>Context:</strong> ${arg.context}</p>
        <p><strong>Influence:</strong> ${arg.influence}</p>
    `;
    
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

// Function to initialize modal functionality
function initializeModal() {
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    
    // Close modal when clicking the close button
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close modal on pressing 'Escape' key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}

// Function to handle search functionality
function handleSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredPhilosophers = allPhilosophers.filter(philosopher => 
        philosopher.name.toLowerCase().includes(searchInput) ||
        philosopher.works.some(work => work.toLowerCase().includes(searchInput)) ||
        philosopher.arguments.some(arg => arg.title.toLowerCase().includes(searchInput) || arg.description.toLowerCase().includes(searchInput))
    );
    displayPhilosophers(filteredPhilosophers);
    displayArguments(filteredPhilosophers);
}

// Function to initialize timeline (basic example)
function initializeTimeline(philosophers) {
    const timelineContainer = document.getElementById('timeline-container');
    const sortedPhilosophers = philosophers.sort((a, b) => new Date(a.birthYear || '0') - new Date(b.birthYear || '0'));
    
    sortedPhilosophers.forEach(philosopher => {
        const event = document.createElement('div');
        event.classList.add('timeline-event');
        event.innerHTML = `
            <h4>${philosopher.name}</h4>
            <p>${philosopher.bio}</p>
        `;
        timelineContainer.appendChild(event);
    });
}

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    fetchPhilosophers();
    initializeModal();
    
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', handleSearch);
    
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
});
