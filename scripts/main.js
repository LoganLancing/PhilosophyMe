// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    fetchPhilosophers();
    setupCarouselNavigation();
    setupFilterButtons();
    setupModal();
    setupScrollToTop();
});

let allPhilosophers = [];
let allArguments = [];
let featuredArguments = [];
let currentPhilosophersIndex = 0;
let currentArgumentsIndex = 0;
let currentFeaturedIndex = 0;
let currentTimelineIndex = 0;
const PHILOSOPHERS_VISIBLE = 3;
const ARGUMENTS_VISIBLE = 4;
const FEATURED_VISIBLE = 1;
const TIMELINE_VISIBLE = 3;

// Fetch philosophers data
async function fetchPhilosophers() {
    try {
        const response = await fetch('data/philosophers.json');
        const philosophers = await response.json();
        allPhilosophers = philosophers;
        extractArguments();
        displayPhilosophers();
        displayArguments('all');
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
    const maxIndex = Math.ceil(totalPhilosophers / PHILOSOPHERS_VISIBLE) - 1;

    const prevButton = document.querySelector('.philosophers-section .prev-button');
    const nextButton = document.querySelector('.philosophers-section .next-button');
    prevButton.disabled = currentPhilosophersIndex === 0;
    nextButton.disabled = currentPhilosophersIndex === maxIndex;

    const translateX = -(currentPhilosophersIndex * (container.children[0].offsetWidth + 30) * PHILOSOPHERS_VISIBLE);
    container.style.transform = `translateX(${translateX}px)`;
}

// Display argument cards based on category
function displayArguments(category) {
    const container = document.getElementById('arguments-container');
    container.innerHTML = '';

    let filteredArguments = allArguments;
    if (category !== 'all') {
        filteredArguments = allArguments.filter(arg => arg.category === category);
    }

    filteredArguments.forEach(argument => {
        const card = createArgumentCard(argument);
        container.appendChild(card);
    });

    updateArgumentsCarousel();
}

// Create an argument card
function createArgumentCard(argument) {
    const card = document.createElement('div');
    card.classList.add('argument-card', `category-${argument.category}`);

    const icon = document.createElement('img');
    icon.src = getArgumentIcon(argument.title);
    icon.alt = `${argument.title} Icon`;
    card.appendChild(icon);

    const title = document.createElement('h3');
    title.textContent = argument.title;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = argument.description;
    card.appendChild(description);

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

// Update arguments carousel
function updateArgumentsCarousel() {
    const container = document.getElementById('arguments-container');
    const totalArguments = container.children.length;
    const maxIndex = Math.ceil(totalArguments / ARGUMENTS_VISIBLE) - 1;

    const prevButton = document.querySelector('.arguments-section .prev-arguments-button');
    const nextButton = document.querySelector('.arguments-section .next-arguments-button');
    prevButton.disabled = currentArgumentsIndex === 0;
    nextButton.disabled = currentArgumentsIndex === maxIndex;

    const translateX = -(currentArgumentsIndex * (container.children[0].offsetWidth + 30) * ARGUMENTS_VISIBLE);
    container.style.transform = `translateX(${translateX}px)`;
}

// Setup carousel navigation
function setupCarouselNavigation() {
    // Philosophers Carousel
    const prevPhilosophers = document.querySelector('.philosophers-section .prev-button');
    const nextPhilosophers = document.querySelector('.philosophers-section .next-button');

    prevPhilosophers.addEventListener('click', () => {
        if (currentPhilosophersIndex > 0) {
            currentPhilosophersIndex--;
            updatePhilosophersCarousel();
        }
    });

    nextPhilosophers.addEventListener('click', () => {
        const totalPhilosophers = allPhilosophers.length;
        const maxIndex = Math.ceil(totalPhilosophers / PHILOSOPHERS_VISIBLE) - 1;
        if (currentPhilosophersIndex < maxIndex) {
            currentPhilosophersIndex++;
            updatePhilosophersCarousel();
        } else {
            currentPhilosophersIndex = 0;
            updatePhilosophersCarousel();
        }
    });

    // Arguments Carousel
    const prevArguments = document.querySelector('.arguments-section .prev-arguments-button');
    const nextArguments = document.querySelector('.arguments-section .next-arguments-button');

    prevArguments.addEventListener('click', () => {
        if (currentArgumentsIndex > 0) {
            currentArgumentsIndex--;
            updateArgumentsCarousel();
        }
    });

    nextArguments.addEventListener('click', () => {
        const container = document.getElementById('arguments-container');
        const totalArguments = container.children.length;
        const maxIndex = Math.ceil(totalArguments / ARGUMENTS_VISIBLE) - 1;
        if (currentArgumentsIndex < maxIndex) {
            currentArgumentsIndex++;
            updateArgumentsCarousel();
        } else {
            currentArgumentsIndex = 0;
            updateArgumentsCarousel();
        }
    });

    // Featured Arguments Carousel
    const prevFeatured = document.querySelector('.featured-argument-carousel .prev-featured-button');
    const nextFeatured = document.querySelector('.featured-argument-carousel .next-featured-button');

    prevFeatured.addEventListener('click', () => {
        if (currentFeaturedIndex > 0) {
            currentFeaturedIndex--;
            updateFeaturedCarousel();
        }
    });

    nextFeatured.addEventListener('click', () => {
        if (currentFeaturedIndex < featuredArguments.length - 1) {
            currentFeaturedIndex++;
        } else {
            currentFeaturedIndex = 0;
        }
        updateFeaturedCarousel();
    });

    // Timeline Carousel
    const prevTimeline = document.querySelector('.timeline-carousel-container .prev-timeline-button');
    const nextTimeline = document.querySelector('.timeline-carousel-container .next-timeline-button');

    prevTimeline.addEventListener('click', () => {
        if (currentTimelineIndex > 0) {
            currentTimelineIndex--;
            updateTimelineCarousel();
        }
    });

    nextTimeline.addEventListener('click', () => {
        const container = document.getElementById('timeline-container');
        const totalTimeline = container.children.length;
        const maxIndex = Math.ceil(totalTimeline / TIMELINE_VISIBLE) - 1;
        if (currentTimelineIndex < maxIndex) {
            currentTimelineIndex++;
            updateTimelineCarousel();
        } else {
            currentTimelineIndex = 0;
            updateTimelineCarousel();
        }
    });
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            currentArgumentsIndex = 0;
            displayArguments(category);
        });
    });
}

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

// Populate featured arguments
function populateFeaturedArguments() {
    const container = document.getElementById('featured-argument-container');
    container.innerHTML = '';

    if (featuredArguments.length === 0) {
        container.innerHTML = '<p>No featured arguments available.</p>';
        return;
    }

    const arg = featuredArguments[currentFeaturedIndex];
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

// Update featured arguments carousel
function updateFeaturedCarousel() {
    const container = document.getElementById('featured-argument-container');
    container.innerHTML = '';

    if (featuredArguments.length === 0) {
        container.innerHTML = '<p>No featured arguments available.</p>';
        return;
    }

    const arg = featuredArguments[currentFeaturedIndex];
    const card = createFeaturedArgumentCard(arg);
    container.appendChild(card);
}
