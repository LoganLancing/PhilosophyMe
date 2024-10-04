// scripts/main.js

let allPhilosophers = [];
let idx = null;
let currentSlide = 0;
const slidesToShow = 3; // Number of cards to show at once
let totalSlides = 0;

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
        calculateTotalSlides(philosophers);
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
        img.loading = 'lazy'; // Improve performance with lazy loading
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
        calculateTotalSlides(allPhilosophers);
        resetCarousel();
        return;
    }
    const results = idx.search(`*${searchInput}*`);
    const matchedPhilosophers = results.map(result => allPhilosophers[result.ref]);
    displayPhilosophers(matchedPhilosophers);
    displayArguments(matchedPhilosophers);
    buildTimeline(matchedPhilosophers);
    calculateTotalSlides(matchedPhilosophers);
    resetCarousel();
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

    // Carousel Navigation
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const philosophersContainer = document.getElementById('philosophers-container');

    prevButton.addEventListener('click', () => {
        slideCarousel(-1);
    });

    nextButton.addEventListener('click', () => {
        slideCarousel(1);
    });
});

// Function to calculate total slides based on philosophers count
function calculateTotalSlides(philosophers) {
    totalSlides = Math.ceil(philosophers.length / slidesToShow);
}

// Function to reset carousel to first slide
function resetCarousel() {
    currentSlide = 0;
    updateCarousel();
}

// Function to slide carousel
function slideCarousel(direction) {
    currentSlide += direction;
    if (currentSlide < 0) {
        currentSlide = 0;
    } else if (currentSlide >= totalSlides) {
        currentSlide = totalSlides - 1;
    }
    updateCarousel();
}

// Function to update carousel position
function updateCarousel() {
    const philosophersContainer = document.getElementById('philosophers-container');
    const cardWidth = philosophersContainer.querySelector('.card').offsetWidth + 20; // card width + margin-right
    philosophersContainer.style.transform = `translateX(-${currentSlide * slidesToShow * cardWidth}px)`;
}

// Function to build timeline (basic implementation)
function buildTimeline(philosophers) {
    const container = document.getElementById('timeline-container');
    container.innerHTML = ''; // Clear existing content
    
    // Sample chronological order based on historical timelines
    const timelineOrder = [
        { name: "Plato", year: -427 },
        { name: "Aristotle", year: -384 },
        { name: "René Descartes", year: 1596 },
        { name: "Immanuel Kant", year: 1724 }
        // Add more philosophers with their approximate birth years
    ];
    
    // Sort the timelineOrder by year
    timelineOrder.sort((a, b) => a.year - b.year);
    
    timelineOrder.forEach((philosopher, index) => {
        const philosopherData = philosophers.find(p => p.name === philosopher.name);
        if (philosopherData) {
            const event = document.createElement('div');
            event.classList.add('timeline-event');
            event.classList.add(index % 2 === 0 ? 'left' : 'right');
            event.innerHTML = `
                <div class="timeline-event-content">
                    <h3>${philosopherData.name}</h3>
                    <p><strong>Born:</strong> ${philosopher.year < 0 ? Math.abs(philosopher.year) + " BC" : philosopher.year}</p>
                    <p>${philosopherData.bio}</p>
                </div>
            `;
            event.addEventListener('click', () => {
                showModal(philosopherData.name, `
Biography:
${philosopherData.bio}

Major Works:
${philosopherData.works.join(', ')}

Central Arguments:
${philosopherData.arguments.map(arg => `${arg.title}: ${arg.description}`).join('\n')}

Influence:
${philosopherData.influence}
                `);
            });
            container.appendChild(event);
        }
    });
}
