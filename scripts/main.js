// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    fetchPhilosophers();
    setupFeaturedArgumentNavigation();
    setupFilterButtons();
    setupModal();
    setupScrollToTop();
    setupQuotesCarousel();
});

let allPhilosophers = [];
let allArguments = [];
let featuredArguments = [];
let currentFeaturedIndex = 0;
let currentTimelineIndex = 0;
let currentFilterCategory = 'all';

const FEATURED_VISIBLE = 1;
const TIMELINE_VISIBLE = 5;
const QUOTE_INTERVAL = 5000; // 5 seconds

// Fetch philosophers data
async function fetchPhilosophers() {
    try {
        const response = await fetch('data/philosophers.json');
        const philosophers = await response.json();
        allPhilosophers = philosophers;
        extractArguments();
        displayPhilosophers();
        populateFeaturedArguments();
        populateTimeline();
    } catch (error) {
        console.error('Error fetching philosopher data:', error);
    }
}

// Extract all unique arguments and featured arguments
function extractArguments() {
    const argumentsSet = new Set();
    allPhilosophers.forEach(philosopher => {
        philosopher.arguments.forEach(arg => {
            argumentsSet.add(JSON.stringify(arg));
            if (arg.featured) {
                featuredArguments.push(arg);
            }
        });
    });
    allArguments = Array.from(argumentsSet).map(arg => JSON.parse(arg));
}

// Display philosopher cards
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

// Update philosophers carousel
function updatePhilosophersCarousel() {
    const container = document.getElementById('philosophers-container');
    const totalPhilosophers = allPhilosophers.length;
    const maxIndex = Math.ceil(totalPhilosophers / FEATURED_VISIBLE) - 1;

    const prevButton = document.querySelector('.philosophers-section .prev-button');
    const nextButton = document.querySelector('.philosophers-section .next-button');
    prevButton.disabled = false; // Always enabled for cyclic carousel
    nextButton.disabled = false;

    // Handle cyclic carousel
    prevButton.addEventListener('click', () => {
        if (currentFeaturedIndex > 0) {
            currentFeaturedIndex--;
        } else {
            currentFeaturedIndex = maxIndex;
        }
        const translateX = -(currentFeaturedIndex * (container.children[0].offsetWidth + 30) * FEATURED_VISIBLE);
        container.style.transform = `translateX(${translateX}px)`;
    });

    nextButton.addEventListener('click', () => {
        if (currentFeaturedIndex < maxIndex) {
            currentFeaturedIndex++;
        } else {
            currentFeaturedIndex = 0;
        }
        const translateX = -(currentFeaturedIndex * (container.children[0].offsetWidth + 30) * FEATURED_VISIBLE);
        container.style.transform = `translateX(${translateX}px)`;
    });
}

// Populate featured arguments based on current filter
function populateFeaturedArguments() {
    const container = document.getElementById('featured-argument-container');
    container.innerHTML = '';

    let filteredArguments = featuredArguments;
    if (currentFilterCategory !== 'all') {
        filteredArguments = featuredArguments.filter(arg => arg.category === currentFilterCategory);
    }

    if (filteredArguments.length === 0) {
        container.innerHTML = '<p>No featured arguments available for this category.</p>';
        return;
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

// Setup carousel navigation for Featured Argument
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
        populateFeaturedArguments();
    });

    nextFeatured.addEventListener('click', () => {
        const filteredArguments = getFilteredFeaturedArguments();
        if (filteredArguments.length === 0) return;

        if (currentFeaturedIndex < filteredArguments.length - 1) {
            currentFeaturedIndex++;
        } else {
            currentFeaturedIndex = 0;
        }
        populateFeaturedArguments();
    });
}

// Get filtered featured arguments based on current category
function getFilteredFeaturedArguments() {
    if (currentFilterCategory === 'all') {
        return featuredArguments;
    }
    return featuredArguments.filter(arg => arg.category === currentFilterCategory);
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filters .filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            currentFilterCategory = button.getAttribute('data-category');
            currentFeaturedIndex = 0;
            populateFeaturedArguments();
        });
    });
}

// Display argument cards based on category (Removed Arguments Carousel)
// Since the user has removed the bottom carousel, this function is no longer needed

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
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

// Populate timeline
function populateTimeline() {
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';

    // Sort philosophers by publicationDate
    const sortedPhilosophers = allPhilosophers.slice().sort((a, b) => compareDates(a.publicationDate, b.publicationDate));

    sortedPhilosophers.forEach(philosopher => {
        philosopher.arguments.forEach(arg => {
            const event = document.createElement('div');
            event.classList.add('timeline-event');

            const date = document.createElement('h3');
            date.textContent = philosopher.publicationDate;
            event.appendChild(date);

            const name = document.createElement('p');
            name.innerHTML = `<strong>${philosopher.name}</strong>`;
            event.appendChild(name);

            const summary = document.createElement('p');
            summary.textContent = arg.description;
            event.appendChild(summary);

            event.addEventListener('click', () => {
                showModal(`${philosopher.name} - ${arg.title}`, `
Publication Date: ${philosopher.publicationDate}

Argument: ${arg.title}
Description: ${arg.description}
Summary: ${arg.summary}
Real-Life Example: ${arg.realLifeExample}

Influence:
${philosopher.influence}
                `);
            });

            timelineContainer.appendChild(event);
        });
    });

    updateTimelineCarousel();
}

// Compare dates for sorting
function compareDates(a, b) {
    const yearA = parseYear(a);
    const yearB = parseYear(b);
    return yearA - yearB;
}

// Parse year from date string
function parseYear(dateStr) {
    const regex = /(\d+)\s*(BC)?/;
    const match = dateStr.match(regex);
    if (match) {
        let year = parseInt(match[1]);
        if (match[2] === 'BC') {
            year = -year;
        }
        return year;
    }
    return 0;
}

// Update timeline carousel
function updateTimelineCarousel() {
    const container = document.getElementById('timeline-container');
    const totalTimeline = container.children.length;
    const maxIndex = Math.ceil(totalTimeline / TIMELINE_VISIBLE) - 1;

    const prevButton = document.querySelector('.timeline-carousel-container .prev-timeline-button');
    const nextButton = document.querySelector('.timeline-carousel-container .next-timeline-button');
    prevButton.disabled = false; // Always enabled for cyclic carousel
    nextButton.disabled = false;

    // Handle cyclic carousel
    prevButton.addEventListener('click', () => {
        if (currentTimelineIndex > 0) {
            currentTimelineIndex--;
        } else {
            currentTimelineIndex = maxIndex;
        }
        const translateY = -(currentTimelineIndex * (container.children[0].offsetHeight + 30) * TIMELINE_VISIBLE);
        container.style.transform = `translateY(${translateY}px)`;
    });

    nextButton.addEventListener('click', () => {
        if (currentTimelineIndex < maxIndex) {
            currentTimelineIndex++;
        } else {
            currentTimelineIndex = 0;
        }
        const translateY = -(currentTimelineIndex * (container.children[0].offsetHeight + 30) * TIMELINE_VISIBLE);
        container.style.transform = `translateY(${translateY}px)`;
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

    // Auto-cycle quotes every 5 seconds
    setInterval(() => {
        quotes[currentQuote].classList.remove('active');
        currentQuote = (currentQuote + 1) % quotes.length;
        quotes[currentQuote].classList.add('active');
    }, QUOTE_INTERVAL);
}
