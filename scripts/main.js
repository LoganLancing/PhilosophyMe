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
const PHILOSOPHERS_VISIBLE = 3; // Number of philosopher cards visible at once
const ARGUMENTS_VISIBLE = 4;    // Number of argument cards visible at once

// Fetch philosophers and initialize sections
async function fetchPhilosophers() {
    try {
        const response = await fetch('data/philosophers.json');
        const philosophers = await response.json();
        allPhilosophers = philosophers;
        extractArguments(philosophers);
        displayPhilosophers();
        displayArguments('all'); // Initially display all arguments
    } catch (error) {
        console.error('Error fetching philosopher data:', error);
    }
}

// Extract arguments from philosophers data
function extractArguments(philosophers) {
    const argumentsSet = new Set();
    philosophers.forEach(philosopher => {
        philosopher.arguments.forEach(arg => {
            // Assign category to each argument if not already assigned
            if (!arg.category) {
                arg.category = categorizeArgument(arg.title);
            }
            argumentsSet.add(JSON.stringify(arg));
        });
    });
    allArguments = Array.from(argumentsSet).map(arg => JSON.parse(arg));
}

// Simple categorization based on argument title keywords
function categorizeArgument(title) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('ethic') || lowerTitle.includes('moral')) {
        return 'ethics';
    } else if (lowerTitle.includes('existence') || lowerTitle.includes('reality') || lowerTitle.includes('ontological')) {
        return 'existence';
    } else if (lowerTitle.includes('mind') || lowerTitle.includes('consciousness')) {
        return 'mind';
    } else if (lowerTitle.includes('god') || lowerTitle.includes('religion')) {
        return 'religion';
    } else {
        return 'other';
    }
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
    card.classList.add('card', 'philosopher-card');

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
    const cardWidth = 300; // Width of each card
    const gap = 30;         // Gap between cards
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

    // Argument Title
    const title = document.createElement('h3');
    title.textContent = argument.title;
    card.appendChild(title);

    // Brief Overview
    const overview = document.createElement('p');
    overview.textContent = argument.briefOverview;
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
    const cardWidth = 300; // Width of each card
    const gap = 30;         // Gap between cards
    const translateX = -(currentArgumentsIndex * (cardWidth + gap) * ARGUMENTS_VISIBLE);
    container.style.transform = `translateX(${translateX}px)`;
}

// Setup carousel navigation for both philosophers and arguments
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
    const timelineEvents = [
        {
            year: "1641",
            title: "René Descartes Born",
            description: "René Descartes, a French philosopher, is born. He will later become known as the father of modern philosophy."
        },
        {
            year: "1804",
            title: "Immanuel Kant Dies",
            description: "Immanuel Kant, a central figure in modern philosophy, passes away, leaving behind a legacy of critical philosophy."
        },
        {
            year: "384 BC",
            title: "Aristotle Born",
            description: "Aristotle, an ancient Greek philosopher and polymath, is born. He becomes a student of Plato and teacher of Alexander the Great."
        },
        {
            year: "428 BC",
            title: "Plato Dies",
            description: "Plato, an ancient Greek philosopher and student of Socrates, dies, having founded the Academy in Athens."
        },
        {
            year: "1813",
            title: "Søren Kierkegaard Born",
            description: "Søren Kierkegaard, a Danish philosopher, is born. He is often considered the first existentialist philosopher."
        },
        {
            year: "1900",
            title: "Friedrich Nietzsche Dies",
            description: "Friedrich Nietzsche, a German philosopher known for his critique of traditional morality, passes away."
        }
        // Add more timeline events as needed
    ];

    timelineEvents.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('timeline-event', index % 2 === 0 ? 'left' : 'right');

        const content = document.createElement('div');
        content.classList.add('timeline-event-content');

        const year = document.createElement('h3');
        year.textContent = event.year;
        content.appendChild(year);

        const title = document.createElement('p');
        title.innerHTML = `<strong>${event.title}</strong>`;
        content.appendChild(title);

        const description = document.createElement('p');
        description.textContent = event.description;
        content.appendChild(description);

        eventElement.appendChild(content);
        timelineContainer.appendChild(eventElement);
    });
}

// Example: "Challenge Yourself" Quiz
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
