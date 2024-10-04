// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    fetchPhilosophers();
    setupCarouselNavigation();
    setupFilterButtons();
    setupModal();
    setupFeaturedArgument();
    setupScrollToTop();
    populateTimeline();
});

// Global Variables
let allPhilosophers = [];
let allArguments = [];
let currentPhilosophersIndex = 0;
let currentArgumentsIndex = 0;
let currentTimelineIndex = 0;
const PHILOSOPHERS_VISIBLE = 3; // Number of philosopher cards visible at once
const ARGUMENTS_VISIBLE = 4;    // Number of argument cards visible at once
const TIMELINE_VISIBLE = 3;     // Number of timeline events visible at once

// Mapping of Philosopher's Name to their Most Famous Publication Date
const publicationDates = {
    "Aristotle": "384 BC",
    "Plato": "428 BC",
    "René Descartes": "1637",
    "Immanuel Kant": "1781",
    "Søren Kierkegaard": "1843",
    "Friedrich Nietzsche": "1883"
};

// Fetch philosophers and initialize sections
async function fetchPhilosophers() {
    try {
        const response = await fetch('data/philosophers.json');
        const philosophers = await response.json();
        allPhilosophers = philosophers.map(philosopher => ({
            ...philosopher,
            publicationDate: publicationDates[philosopher.name] || "Unknown"
        }));
        // Sort philosophers chronologically based on publicationDate
        allPhilosophers.sort((a, b) => compareDates(a.publicationDate, b.publicationDate));
        extractArguments(allPhilosophers);
        displayPhilosophers();
        displayArguments('all'); // Initially display all arguments
    } catch (error) {
        console.error('Error fetching philosopher data:', error);
    }
}

// Function to compare dates in various formats
function compareDates(a, b) {
    const yearA = parseYear(a);
    const yearB = parseYear(b);
    return yearA - yearB;
}

// Helper function to parse year from date string
function parseYear(dateStr) {
    if (dateStr.includes("BC")) {
        return -parseInt(dateStr);
    }
    return parseInt(dateStr);
}

// Extract arguments from philosophers data
function extractArguments(philosophers) {
    const argumentsSet = new Set();
    philosophers.forEach(philosopher => {
        philosopher.arguments.forEach(arg => {
            argumentsSet.add(JSON.stringify(arg));
        });
    });
    allArguments = Array.from(argumentsSet).map(arg => JSON.parse(arg));
}

// Display philosopher cards in the carousel
function displayPhilosophers() {
    const container = document.getElementById('philosophers-container');
    container.innerHTML = ''; // Clear existing content

    allPhilosophers.forEach(philosopher => {
        const card = createPhilosopherCard(philosopher);
        container.appendChild(card);
    });

    updatePhilosophersCarousel();
}

// Create a single philosopher card element (simplified)
function createPhilosopherCard(philosopher) {
    const card = document.createElement('div');
    card.classList.add('philosopher-card');

    // Philosopher Image
    const img = document.createElement('img');
    img.src = philosopher.image;
    img.alt = `${philosopher.name} Portrait`;
    card.appendChild(img);

    // Philosopher Name
    const name = document.createElement('h3');
    name.textContent = philosopher.name;
    card.appendChild(name);

    // Central Argument
    const centralArg = document.createElement('p');
    centralArg.innerHTML = `<strong>Central Argument:</strong> ${philosopher.arguments[0].title}`;
    card.appendChild(centralArg);

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

    return card;
}

// Update philosopher carousel position
function updatePhilosophersCarousel() {
    const container = document.getElementById('philosophers-container');
    const totalPhilosophers = allPhilosophers.length;
    const maxIndex = Math.ceil(totalPhilosophers / PHILOSOPHERS_VISIBLE) - 1;

    // Disable buttons at the ends
    const prevButton = document.querySelector('.philosophers-section .prev-button');
    const nextButton = document.querySelector('.philosophers-section .next-button');
    prevButton.disabled = currentPhilosophersIndex === 0;
    nextButton.disabled = currentPhilosophersIndex === maxIndex;

    // Calculate translateX
    const cardWidth = container.children[0].offsetWidth;
    const gap = parseInt(getComputedStyle(container).gap);
    const translateX = -(currentPhilosophersIndex * (cardWidth + gap) * PHILOSOPHERS_VISIBLE);
    container.style.transform = `translateX(${translateX}px)`;
}

// Display argument cards based on selected category
function displayArguments(category) {
    const container = document.getElementById('arguments-container');
    container.innerHTML = ''; // Clear existing content

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

// Create a single argument card element (simplified)
function createArgumentCard(argument) {
    const card = document.createElement('div');
    card.classList.add('argument-card', `category-${argument.category}`);

    // Argument Icon
    const icon = document.createElement('img');
    icon.src = getArgumentIcon(argument.title);
    icon.alt = `${argument.title} Icon`;
    card.appendChild(icon);

    // Argument Title
    const title = document.createElement('h3');
    title.textContent = argument.title;
    card.appendChild(title);

    // Brief Overview
    const overview = document.createElement('p');
    overview.textContent = argument.description;
    card.appendChild(overview);

    // Add event listener to open modal with detailed info
    card.addEventListener('click', () => {
        showModal(argument.title, `
Summary:
${argument.summary}

Real-Life Example:
${argument.realLifeExample}

Pro:
${argument.pro}

Con:
${argument.con}

Key Philosopher:
${argument.keyPhilosopher}
        `);
    });

    return card;
}

// Function to get argument icon based on title
function getArgumentIcon(title) {
    const icons = {
        "Cogito, ergo sum": "images/mind-icon.png",
        "Dualism": "images/mind-icon.png",
        "Categorical Imperative": "images/ethics-icon.png",
        "Transcendental Idealism": "images/existence-icon.png",
        "Golden Mean": "images/ethics-icon.png",
        "Four Causes": "images/existence-icon.png",
        "Theory of Forms": "images/existence-icon.png",
        "Allegory of the Cave": "images/existence-icon.png",
        "Leap of Faith": "images/religion-icon.png",
        "Existential Angst": "images/mind-icon.png",
        "Übermensch (Overman/Superman)": "images/ethics-icon.png",
        "Will to Power": "images/ethics-icon.png"
        // Add more mappings as needed
    };
    return icons[title] || "images/default-icon.png";
}

// Update arguments carousel position
function updateArgumentsCarousel() {
    const container = document.getElementById('arguments-container');
    const totalArguments = container.children.length;
    const maxIndex = Math.ceil(totalArguments / ARGUMENTS_VISIBLE) - 1;

    // Disable buttons at the ends
    const prevButton = document.querySelector('.arguments-section .prev-button');
    const nextButton = document.querySelector('.arguments-section .next-button');
    prevButton.disabled = currentArgumentsIndex === 0;
    nextButton.disabled = currentArgumentsIndex === maxIndex;

    // Calculate translateX
    const cardWidth = container.children[0].offsetWidth;
    const gap = parseInt(getComputedStyle(container).gap);
    const translateX = -(currentArgumentsIndex * (cardWidth + gap) * ARGUMENTS_VISIBLE);
    container.style.transform = `translateX(${translateX}px)`;
}

// Setup carousel navigation for philosophers, arguments, and timeline
function setupCarouselNavigation() {
    // Philosophers Carousel Buttons
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
        }
    });

    // Arguments Carousel Buttons
    const prevArguments = document.querySelector('.arguments-section .prev-button');
    const nextArguments = document.querySelector('.arguments-section .next-button');

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
        }
    });

    // Timeline Carousel Buttons
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
        }
    });
}

// Setup filter buttons for arguments
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');
            // Get category from data attribute
            const category = button.getAttribute('data-category');
            // Reset carousel index
            currentArgumentsIndex = 0;
            // Display arguments based on category
            displayArguments(category);
        });
    });
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');

    // Close modal when clicking on the close button
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    });

    // Accessibility: Close modal with Escape key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}

// Show modal with title and body content
function showModal(title, body) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = title;
    modalBody.textContent = body.trim();

    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

// Setup featured argument interaction (Challenge Yourself Quiz)
function setupFeaturedArgument() {
    const challengeButton = document.querySelector('.featured-argument .challenge-button');
    challengeButton.addEventListener('click', () => {
        setupQuiz(
            'Who proposed the Ontological Argument?',
            ['Aristotle', 'René Descartes', 'Anselm of Canterbury', 'Immanuel Kant'],
            3 // Correct answer index (Anselm of Canterbury)
        );
    });
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

// Populate the philosophical timeline
function populateTimeline() {
    const timelineContainer = document.getElementById('timeline-container');
    const timelineEvents = allPhilosophers.map(philosopher => ({
        date: philosopher.publicationDate,
        philosopher: philosopher.name,
        summary: philosopher.arguments[0].description
    }));

    timelineEvents.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('timeline-event');

        const content = document.createElement('div');
        content.classList.add('timeline-event-content');

        const date = document.createElement('h3');
        date.textContent = event.date;
        content.appendChild(date);

        const philosopher = document.createElement('p');
        philosopher.innerHTML = `<strong>${event.philosopher}</strong>`;
        content.appendChild(philosopher);

        const summary = document.createElement('p');
        summary.textContent = event.summary;
        content.appendChild(summary);

        eventElement.appendChild(content);
        timelineContainer.appendChild(eventElement);
    });

    updateTimelineCarousel();
}

// Update timeline carousel position
function updateTimelineCarousel() {
    const container = document.getElementById('timeline-container');
    const totalTimeline = container.children.length;
    const maxIndex = Math.ceil(totalTimeline / TIMELINE_VISIBLE) - 1;

    // Disable buttons at the ends
    const prevButton = document.querySelector('.timeline-carousel-container .prev-timeline-button');
    const nextButton = document.querySelector('.timeline-carousel-container .next-timeline-button');
    prevButton.disabled = currentTimelineIndex === 0;
    nextButton.disabled = currentTimelineIndex === maxIndex;

    // Calculate translateY
    const eventHeight = container.children[0].offsetHeight;
    const gap = parseInt(getComputedStyle(container).gap);
    const translateY = -(currentTimelineIndex * (eventHeight + gap) * TIMELINE_VISIBLE);
    container.style.transform = `translateY(${translateY}px)`;
}

// Setup quiz functionality
function setupQuiz(question, options, correctAnswer) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');

    // Clear existing content
    modalBody.innerHTML = '';

    const quizContainer = document.createElement('div');
    quizContainer.classList.add('quiz-container');

    const quizQuestion = document.createElement('p');
    quizQuestion.classList.add('quiz-question');
    quizQuestion.textContent = question;
    quizContainer.appendChild(quizQuestion);

    const quizOptions = document.createElement('div');
    quizOptions.classList.add('quiz-options');

    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = `${index + 1}. ${option}`;
        button.addEventListener('click', () => {
            showQuizResult(index + 1 === correctAnswer, correctAnswer);
        });
        quizOptions.appendChild(button);
    });

    quizContainer.appendChild(quizOptions);

    modalBody.appendChild(quizContainer);
}

// Show quiz result
function showQuizResult(isCorrect, correctAnswer) {
    const modalBody = document.getElementById('modal-body');
    const result = document.createElement('div');
    result.classList.add('quiz-results', 'active');
    result.innerHTML = `<p>${isCorrect ? '✅ Correct!' : `❌ Incorrect. The correct answer is ${correctAnswer}.`}</p>`;
    modalBody.appendChild(result);
}
