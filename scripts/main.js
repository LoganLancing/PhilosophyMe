// scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
    fetchPhilosophers();
    setupCarouselNavigation();
    setupFilterButtons();
    setupModal();
    setupFeaturedArgument();
    setupScrollToTop();
});

// Global Variables
let allPhilosophers = [];
let allArguments = [];
let currentPhilosophersIndex = 0;
let currentArgumentsIndex = 0;
const PHILOSOPHERS_VISIBLE = 3; // Number of philosopher cards visible at once
const ARGUMENTS_VISIBLE = 3;    // Number of argument cards visible at once

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
            // Assign category to each argument
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

// Create a single philosopher card element
function createPhilosopherCard(philosopher) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('philosopher-card');

    // Philosopher Image
    const img = document.createElement('img');
    img.src = philosopher.image;
    img.alt = philosopher.name;
    img.loading = 'lazy';
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

    return card;
}

// Update philosopher carousel position
function updatePhilosophersCarousel() {
    const container = document.getElementById('philosophers-container');
    const totalPhilosophers = allPhilosophers.length;
    const maxIndex = Math.ceil(totalPhilosophers / PHILOSOPHERS_VISIBLE) - 1;

    // Disable buttons at the ends
    document.querySelector('.prev-button').disabled = currentPhilosophersIndex === 0;
    document.querySelector('.next-button').disabled = currentPhilosophersIndex === maxIndex;

    // Calculate translateX
    const translateX = -(currentPhilosophersIndex * PHILOSOPHERS_VISIBLE * 340); // 300px width + 40px gap
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

// Create a single argument card element
function createArgumentCard(argument) {
    const card = document.createElement('div');
    card.classList.add('argument-card');
    card.classList.add(`category-${argument.category}`);

    // Argument Icon
    const icon = document.createElement('img');
    icon.src = getArgumentIcon(argument.title);
    icon.alt = `${argument.title} Icon`;
    icon.loading = 'lazy';
    card.appendChild(icon);

    // Argument Title
    const title = document.createElement('h3');
    title.textContent = argument.title;
    card.appendChild(title);

    // Brief Overview
    const overview = document.createElement('p');
    overview.textContent = argument.briefOverview;
    card.appendChild(overview);

    // Learn More Button
    const learnMore = document.createElement('button');
    learnMore.classList.add('learn-more-button');
    learnMore.textContent = 'Learn More';
    card.appendChild(learnMore);

    // Add event listener to open modal with detailed info
    learnMore.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering card's click event
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

// Get argument icon based on title
function getArgumentIcon(title) {
    const icons = {
        "The Problem of Evil": "images/balance-scale.png",
        "The Trolley Problem": "images/trolley-icon.png",
        "Utilitarianism": "images/utilitarianism.png",
        "Ontological Argument": "images/ontological.png",
        // Add more mappings as needed
    };
    return icons[title] || "images/default-icon.png"; // Fallback icon
}

// Update arguments carousel position
function updateArgumentsCarousel() {
    const container = document.getElementById('arguments-container');
    const totalArguments = container.children.length;
    const maxIndex = Math.ceil(totalArguments / ARGUMENTS_VISIBLE) - 1;

    // Disable buttons at the ends
    document.querySelector('.arguments-section .prev-button').disabled = currentArgumentsIndex === 0;
    document.querySelector('.arguments-section .next-button').disabled = currentArgumentsIndex === maxIndex;

    // Calculate translateX
    const translateX = -(currentArgumentsIndex * ARGUMENTS_VISIBLE * 340); // 300px width + 40px gap
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
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
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
}

// Setup featured argument interaction (Challenge Yourself Quiz)
function setupFeaturedArgument() {
    const challengeButton = document.querySelector('.featured-argument .challenge-button');
    challengeButton.addEventListener('click', () => {
        showModal('Challenge Yourself: Quiz Time!', `
**Quiz:** Match the Argument to the Philosopher

**Question:** Who proposed the Ontological Argument?

1. Aristotle
2. René Descartes
3. Anselm of Canterbury
4. Immanuel Kant

**Your Answer:** (Type the number corresponding to your answer)
        `);

        // Optionally, implement a simple quiz interaction here
    });
}

// Setup scroll to top button (if implemented)
function setupScrollToTop() {
    // Optional: Implement a scroll-to-top button if desired
    // Example implementation can be added here
}

// Additional Interactive Features

// Example: Poll/Voting Option
function setupPoll(argumentTitle) {
    const pollContainer = document.createElement('div');
    pollContainer.classList.add('poll-container');

    const pollQuestion = document.createElement('p');
    pollQuestion.textContent = `Do you agree with the idea of ${argumentTitle}?`;
    pollContainer.appendChild(pollQuestion);

    const pollOptions = document.createElement('div');
    pollOptions.classList.add('poll-options');

    const agreeButton = document.createElement('button');
    agreeButton.textContent = 'Agree';
    agreeButton.addEventListener('click', () => {
        incrementVote(argumentTitle, 'agree');
    });
    pollOptions.appendChild(agreeButton);

    const disagreeButton = document.createElement('button');
    disagreeButton.textContent = 'Disagree';
    disagreeButton.addEventListener('click', () => {
        incrementVote(argumentTitle, 'disagree');
    });
    pollOptions.appendChild(disagreeButton);

    pollContainer.appendChild(pollOptions);

    const pollResults = document.createElement('div');
    pollResults.classList.add('poll-results');
    pollContainer.appendChild(pollResults);

    // Append poll to modal body
    const modalBody = document.getElementById('modal-body');
    modalBody.appendChild(pollContainer);

    displayPollResults(argumentTitle, pollResults);
}

// Increment vote count and update results
function incrementVote(argumentTitle, voteType) {
    const votes = JSON.parse(localStorage.getItem('votes')) || {};
    if (!votes[argumentTitle]) {
        votes[argumentTitle] = { agree: 0, disagree: 0 };
    }
    votes[argumentTitle][voteType]++;
    localStorage.setItem('votes', JSON.stringify(votes));
    displayPollResults(argumentTitle, document.querySelector('.poll-results'));
}

// Display poll results
function displayPollResults(argumentTitle, container) {
    const votes = JSON.parse(localStorage.getItem('votes')) || {};
    if (!votes[argumentTitle]) {
        votes[argumentTitle] = { agree: 0, disagree: 0 };
    }
    const { agree, disagree } = votes[argumentTitle];
    const total = agree + disagree;
    const agreePercent = total ? ((agree / total) * 100).toFixed(1) : 0;
    const disagreePercent = total ? ((disagree / total) * 100).toFixed(1) : 0;

    container.innerHTML = `
        <p>Agree: ${agree} (${agreePercent}%)</p>
        <p>Disagree: ${disagree} (${disagreePercent}%)</p>
    `;
    container.classList.add('active');
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

function showQuizResult(isCorrect, correctAnswer) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML += `
        <div class="quiz-results ${isCorrect ? 'active' : ''}">
            <p>${isCorrect ? '✅ Correct!' : `❌ Incorrect. The correct answer is ${correctAnswer}.`}</p>
        </div>
    `;
}

// Example usage within featured argument setup
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
