// scripts/main.js

let allPhilosophers = [];
let idx = null;

// Fetch and display philosophers and arguments
async function fetchPhilosophers() {
    try {
        const response = await fetch('data/philosophers.json');
        const philosophers = await response.json();
        allPhilosophers = philosophers; // Store for searching
        displayPhilosophers(philosophers);
        displayArguments(philosophers);
        buildSearchIndex(philosophers);
        buildTimeline(philosophers);
    } catch (error) {
        console.error('Error fetching philosopher data:', error);
    }
}

// Function to display philosopher cards
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
        influence.innerHTML = `<strong>Influence:</strong> ${philosopher.influence}`;
        card.appendChild(influence);
        
        // Add event listener to open modal with detailed info
        card.addEventListener('click', () => {
            showModal(philosopher.name, `
Biography:
${philosopher.bio}

Major Works:
${philosopher.works.join(', ')}

Central Arguments:
${philosopher.arguments.map(arg => `${arg.title}: ${arg.description}`).join('\n')}

Influence:
${philosopher.influence}
            `);
        });
        
        container.appendChild(card);
    });
}

// Function to display argument cards
function displayArguments(philosophers) {
    const container = document.getElementById('arguments-container');
    container.innerHTML = ''; // Clear existing content
    const uniqueArguments = [];
    const argumentTitles = new Set();

    philosophers.forEach(philosopher => {
        philosopher.arguments.forEach(arg => {
            if (!argumentTitles.has(arg.title)) {
                uniqueArguments.push(arg);
                argumentTitles.add(arg.title);
            }
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
            showModal(arg.title, `
Importance:
${arg.importance}

Context:
${arg.context}

Influence:
${arg.influence}
            `);
        });
        
        container.appendChild(card);
    });
}

// Function to build search index using Lunr.js
function buildSearchIndex(philosophers) {
    idx = lunr(function () {
        this.field('name');
        this.field('works');
        this.field('arguments.title');
        this.field('arguments.description');
        
        philosophers.forEach(function (philosopher, index) {
            this.add({
                id: index,
                name: philosopher.name,
                works: philosopher.works.join(' '),
                'arguments.title': philosopher.arguments.map(arg => arg.title).join(' '),
                'arguments.description': philosopher.arguments.map(arg => arg.description).join(' ')
            });
        }, this);
    });
}

// Function to handle search
function handleSearch() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    if (searchInput.length < 2) {
        displayPhilosophers(allPhilosophers);
        displayArguments(allPhilosophers);
        buildTimeline(allPhilosophers);
        return;
    }
    const results = idx.search(`*${searchInput}*`);
    const matchedPhilosophers = results.map(result => allPhilosophers[result.ref]);
    displayPhilosophers(matchedPhilosophers);
    displayArguments(matchedPhilosophers);
    buildTimeline(matchedPhilosophers);
}

// Function to show modal
function showModal(title, body) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.textContent = body.trim();
    
    modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Event listeners for modal
document.addEventListener('DOMContentLoaded', () => {
    fetchPhilosophers();
    
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', handleSearch);
    
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
    
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            closeModal();
        }
    });
});

// Function to build timeline (basic implementation)
function buildTimeline(philosophers) {
    const container = document.getElementById('timeline-container');
    container.innerHTML = ''; // Clear existing content
    
    // Sort philosophers by their birth year (assuming image filenames have birth years or another method)
    // Since we don't have birth years, we'll assign a sample order
    const timelineOrder = [
        "Plato",
        "Aristotle",
        "René Descartes",
        "Immanuel Kant"
        // Add more philosophers in chronological order
    ];
    
    timelineOrder.forEach(name => {
        const philosopher = philosophers.find(p => p.name === name);
        if (philosopher) {
            const event = document.createElement('div');
            event.classList.add('timeline-event');
            event.innerHTML = `
                <h3>${philosopher.name}</h3>
                <p>${philosopher.bio}</p>
            `;
            event.addEventListener('click', () => {
                showModal(philosopher.name, `
Biography:
${philosopher.bio}

Major Works:
${philosopher.works.join(', ')}

Central Arguments:
${philosopher.arguments.map(arg => `${arg.title}: ${arg.description}`).join('\n')}

Influence:
${philosopher.influence}
                `);
            });
            container.appendChild(event);
        }
    });
}
