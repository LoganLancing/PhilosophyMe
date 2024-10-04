// scripts/main.js

let allPhilosophers = [];
let idx = null;

// Function to fetch and display philosophers
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
        
        container.appendChild(card);
    });
}

// Function to display argument cards
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
            showModal(arg.title, `**Importance:** ${arg.importance}\n\n**Context:** ${arg.context}\n\n**Influence:** ${arg.influence}`);
        });
        
        container.appendChild(card);
    });
}

// Function to show modal with detailed information
function showModal(title, body) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    // Replace line breaks with <br> for HTML rendering
    modalBody.innerHTML = body.replace(/\n/g, '<br>');
    
    modal.style.display = 'block';
}

// Function to build search index using Lunr.js
function buildSearchIndex(philosophers) {
    idx = lunr(function () {
        this.field('name');
        this.field('works');
        this.field('arguments_title', { boost: 10 });
        this.field('arguments_description');
        this.ref('id');
        
        philosophers.forEach(function (philosopher, index) {
            this.add({
                id: index,
                name: philosopher.name,
                works: philosopher.works.join(' '),
                arguments_title: philosopher.arguments.map(arg => arg.title).join(' '),
                arguments_description: philosopher.arguments.map(arg => arg.description).join(' ')
            });
        }, this);
    });
}

// Function to handle search
function handleSearch() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
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

// Function to build an interactive timeline
function buildTimeline(philosophers) {
    const container = document.getElementById('timeline-container');
    container.innerHTML = ''; // Clear existing content

    // Sort philosophers by birth year for the timeline
    const sortedPhilosophers = philosophers.slice().sort((a, b) => a.birthYear - b.birthYear);

    sortedPhilosophers.forEach(philosopher => {
        const event = document.createElement('div');
        event.classList.add('timeline-event');
        event.innerHTML = `
            <h3>${philosopher.name}</h3>
            <p><strong>Birth Year:</strong> ${philosopher.birthYear || 'N/A'}</p>
            <p><strong>Major Works:</strong> ${philosopher.works.join(', ')}</p>
        `;
        container.appendChild(event);
    });
}

// Function to handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    document.getElementById('contact-form').reset();
}

// Initialize the website
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

    // Modal functionality
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', handleContactForm);
});
