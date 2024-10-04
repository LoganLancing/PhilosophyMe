// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    fetchPhilosophers();
    setupFeaturedArgumentNavigation();
    setupPhilosophersNavigation();
    setupFilterButtons();
    setupModal();
    setupScrollToTop();
    setupQuotesCarousel();
});

let allPhilosophers = [];
let allArguments = [];
let featuredArguments = [];
let currentPhilosophersIndex = 0;
let currentFeaturedIndex = 0;
let currentFilterCategory = 'all';

const PHILOSOPHERS_VISIBLE = 3;
const FEATURED_VISIBLE = 1;
const QUOTE_INTERVAL = 7000; // 7 seconds

// Fetch philosophers data
async function fetchPhilosophers() {
    try {
        const response = await fetch('data/philosophers.json');
        const philosophers = await response.json();
        allPhilosophers = philosophers;
        extractArguments();
        displayPhilosophers();
        displayFeaturedArguments();
    } catch (error) {
        console.error('Error fetching philosopher data:', error);
    }
}

// Extract all arguments and featured arguments
function extractArguments() {
    allArguments = [];
    featuredArguments = [];
    allPhilosophers.forEach(philosopher => {
        philosopher.arguments.forEach(arg => {
            allArguments.push(arg);
            if (arg.featured) {
                featuredArguments.push(arg);
            }
        });
    });
}

// Display philosopher cards in the carousel
function displayPhilosophers() {
    const container = document.getElementById('philosophers-container');
    container.innerHTML = '';

    allPhilosophers.forEach(philosopher => {
        const card = createPhilosopherCard(philosopher);
        container.appendChild(card);
    });

    updatePhilosophersCarousel();
}

// Create a philosopher card
function createPhilosopherCard(philosopher) {
    const card = document.createElement('div');
    card.classList.add('philosopher-card');

    const img = document.createElement('img');
    img.src = philosopher.image;
    img.alt = `${philosopher.name} Portrait`;
    card.appendChild(img);

    const name = document.createElement('h3');
    name.textContent = philosopher.name;
    card.appendChild(name);

    const bio = document.createElement('p');
    bio.textContent = philosopher.bio;
    card.appendChild(bio);

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

    return card;
}

// Update philosophers carousel to show only 3 at a time
function updatePhilosophersCarousel() {
    const container = document.getElementById('philosophers-container');
    const totalPhilosophers = allPhilosophers.length;
    const maxIndex = Math.ceil(totalPhilosophers / PHILOSOPHERS_VISIBLE) - 1;

    // Ensure currentPhilosophersIndex wraps around
    if (currentPhilosophersIndex > maxIndex) {
        currentPhilosophersIndex = 0;
    }

    const translateX = -(currentPhilosophersIndex * (container.children[0].offsetWidth + 30) * PHILOSOPHERS_VISIBLE);
    container.style.transform = `translateX(${translateX}px)`;
}

// Setup navigation for Top Philosophers carousel
function setupPhilosophersNavigation() {
    const prevButton = document.querySelector('.philosophers-section .prev-button');
    const nextButton = document.querySelector('.philosophers-section .next-button');

    prevButton.addEventListener('click', () => {
        const totalPhilosophers = allPhilosophers.length;
        const maxIndex = Math.ceil(totalPhilosophers / PHILOSOPHERS_VISIBLE) - 1;

        if (currentPhilosophersIndex > 0) {
            currentPhilosophersIndex--;
        } else {
            currentPhilosophersIndex = maxIndex;
        }
        updatePhilosophersCarousel();
    });

    nextButton.addEventListener('click', () => {
        const totalPhilosophers = allPhilosophers.length;
        const maxIndex = Math.ceil(totalPhilosophers / PHILOSOPHERS_VISIBLE) - 1;

        if (currentPhilosophersIndex < maxIndex) {
            currentPhilosophersIndex++;
        } else {
            currentPhilosophersIndex = 0;
        }
        updatePhilosophersCarousel();
    });
}

// Display featured arguments based on current filter
function displayFeaturedArguments() {
    const container = document.getElementById('featured-argument-container');
    container.innerHTML = '';

    let filteredArguments = getFilteredFeaturedArguments();

    if (filteredArguments.length === 0) {
        container.innerHTML = '<p>No featured arguments available for this category.</p>';
        return;
    }

    // Ensure currentFeaturedIndex wraps around
    if (currentFeaturedIndex >= filteredArguments.length) {
        currentFeaturedIndex = 0;
    }

    const arg = filteredArguments[currentFeaturedIndex];
    const card = createFeaturedArgumentCard(arg);
    container.appendChild(card);
}

// Create a featured argument card
function createFeaturedArgumentCard(argument) {
    const card = document.createElement('div');
    card.classList.add('featured-argument');

    const img = document.createElement('img');
    img.src = getArgumentIcon(argument.title);
    img.alt = `${argument.title} Icon`;
    img.classList.add('featured-argument-image');
    card.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = argument.title;
    card.appendChild(title);

    const summary = document.createElement('p');
    summary.classList.add('summary');
    summary.textContent = argument.summary;
    card.appendChild(summary);

    const details = document.createElement('div');
    details.classList.add('details');

    const example = document.createElement('p');
    example.innerHTML = `<span>Real-Life Example:</span> ${argument.realLifeExample}`;
    details.appendChild(example);

    const pros = document.createElement('p');
    pros.innerHTML = `<span>Pros:</span> ${argument.pro}`;
    details.appendChild(pros);

    const cons = document.createElement('p');
    cons.innerHTML = `<span>Cons:</span> ${argument.con}`;
    details.appendChild(cons);

    const keyPhilosopher = document.createElement('p');
    keyPhilosopher.innerHTML = `<span>Key Philosopher:</span> ${argument.keyPhilosopher}`;
    details.appendChild(keyPhilosopher);

    card.appendChild(details);

    card.addEventListener('click', () => {
        showModal(argument.title, `
Summary:
${argument.summary}

Real-Life Example:
${argument.realLifeExample}

Pros:
${argument.pro}

Cons:
${argument.con}

Key Philosopher:
${argument.keyPhilosopher}
        `);
    });

    return card;
}

// Get argument icon based on title
function getArgumentIcon(title) {
    const icons = {
        "Golden Mean": "images/ethics-icon.png",
        "Four Causes": "images/existence-icon.png",
        "Theory of Forms": "images/existence-icon.png",
        "Allegory of the Cave": "images/existence-icon.png",
        "Cogito, ergo sum": "images/mind-icon.png",
        "Dualism": "images/mind-icon.png",
        "Categorical Imperative": "images/ethics-icon.png",
        "Transcendental Idealism": "images/existence-icon.png",
        "The Trolley Problem": "images/trolley-icon.png",
        "Leap of Faith": "images/religion-icon.png",
        "Existential Angst": "images/mind-icon.png",
        "Übermensch (Overman/Superman)": "images/ethics-icon.png",
        "Will to Power": "images/ethics-icon.png"
    };
    return icons[title] || "images/default-icon.png";
}

// Setup navigation for Featured Argument carousel
function setupFeaturedArgumentNavigation() {
    const prevFeatured = document.querySelector('.featured-argument-carousel .prev-featured-button');
    const nextFeatured = document.querySelector('.featured-argument-carousel .next-featured-button');

    prevFeatured.addEventListener('click', () => {
        const filteredArguments = getFilteredFeaturedArguments();
        if (filteredArguments.length === 0) return;

        if (currentFeaturedIndex > 0) {
            currentFeaturedIndex--;
        } else {
            currentFeaturedIndex = filteredArguments.length - 1;
        }
        displayFeaturedArguments();
    });

    nextFeatured.addEventListener('click', () => {
        const filteredArguments = getFilteredFeaturedArguments();
        if (filteredArguments.length === 0) return;

        if (currentFeaturedIndex < filteredArguments.length - 1) {
            currentFeaturedIndex++;
        } else {
            currentFeaturedIndex = 0;
        }
        displayFeaturedArguments();
    });
}

// Get filtered featured arguments based on current category
function getFilteredFeaturedArguments() {
    if (currentFilterCategory === 'all') {
        return featuredArguments;
    }
    return featuredArguments.filter(arg => arg.category.toLowerCase() === currentFilterCategory.toLowerCase());
}

// Setup filter buttons for Featured Arguments
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filters .filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentFilterCategory = button.getAttribute('data-category');
            currentFeaturedIndex = 0;
            displayFeaturedArguments();
        });
    });
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');

    closeButton.addEventListener('click', () => {
        closeModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Show modal with content
function showModal(title, body) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = title;
    modalBody.textContent = body.trim();

    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

// Setup scroll to top button
function setupScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.classList.add('scroll-to-top');
    scrollButton.innerHTML = '⬆️';
    document.body.appendChild(scrollButton);

    scrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
}

// Setup quotes carousel
function setupQuotesCarousel() {
    const quotes = document.querySelectorAll('.quotes-section .quote-slide');
    let currentQuote = 0;

    if (quotes.length === 0) return;

    // Initialize first quote
    quotes.forEach((quote, index) => {
        if (index === 0) {
            quote.classList.add('active');
        } else {
            quote.classList.remove('active');
        }
    });

    // Auto-cycle quotes every 7 seconds
    setInterval(() => {
        quotes[currentQuote].classList.remove('active');
        currentQuote = (currentQuote + 1) % quotes.length;
        quotes[currentQuote].classList.add('active');
    }, QUOTE_INTERVAL);
}
