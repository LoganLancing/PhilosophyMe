<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Philosophy Through Time</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Open+Sans&display=swap" rel="stylesheet">
    <!-- Stylesheet -->
    <link rel="stylesheet" href="styles/styles.css">
</head>
<body>
    <!-- Header -->
    <header>
        <nav aria-label="Main Navigation">
            <div class="logo">Philosophy Through Time</div>
            <ul class="nav-links">
                <li><a href="#philosophers">Philosophers</a></li>
                <li><a href="#arguments">Arguments</a></li>
                <li><a href="#timeline">Timeline</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div class="search-container">
                <input type="text" id="search-input" placeholder="Search..." aria-label="Search">
                <button id="search-button" aria-label="Search">🔍</button>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <h1>Explore the Evolution of Philosophy</h1>
        <p>From Descartes to Modern Thinkers</p>
    </section>

    <!-- Philosophers Section -->
    <section id="philosophers" class="philosophers-section">
        <h2>Top Philosophers</h2>
        <div class="carousel-container" aria-label="Philosophers Carousel">
            <button class="carousel-button prev-button" aria-label="Previous Philosophers">❮</button>
            <div class="carousel-wrapper">
                <div class="carousel track" id="philosophers-container">
                    <!-- Philosopher cards will be dynamically inserted here -->
                </div>
            </div>
            <button class="carousel-button next-button" aria-label="Next Philosophers">❯</button>
        </div>
    </section>

    <!-- Arguments Section -->
    <section id="arguments" class="arguments-section">
        <h2>Thought-Provoking Questions &amp; Arguments</h2>
        <p>Philosophy often revolves around big questions. Explore some of the most intriguing arguments that have shaped our understanding of the world.</p>
        
        <!-- Argument Category Filters -->
        <div class="filters" role="group" aria-label="Argument Categories">
            <button class="filter-button active" data-category="all">
                <img src="images/default-icon.png" alt="" aria-hidden="true">
                All
            </button>
            <button class="filter-button" data-category="ethics">
                <img src="images/ethics-icon.png" alt="" aria-hidden="true">
                Ethics &amp; Morality
            </button>
            <button class="filter-button" data-category="existence">
                <img src="images/existence-icon.png" alt="" aria-hidden="true">
                Existence &amp; Reality
            </button>
            <button class="filter-button" data-category="mind">
                <img src="images/mind-icon.png" alt="" aria-hidden="true">
                Mind &amp; Consciousness
            </button>
            <button class="filter-button" data-category="religion">
                <img src="images/religion-icon.png" alt="" aria-hidden="true">
                Religion &amp; God
            </button>
        </div>
        
        <!-- Featured Argument Carousel -->
        <div class="featured-argument-carousel">
            <h3>Featured Arguments</h3>
            <div class="carousel-container featured-carousel" aria-label="Featured Arguments Carousel">
                <button class="carousel-button prev-button" aria-label="Previous Featured Argument">❮</button>
                <div class="carousel-wrapper">
                    <div class="carousel track" id="featured-arguments-container">
                        <!-- Featured argument cards will be dynamically inserted here -->
                    </div>
                </div>
                <button class="carousel-button next-button" aria-label="Next Featured Argument">❯</button>
            </div>
        </div>
        
        <!-- Arguments Carousel -->
        <div class="carousel-container" aria-label="Arguments Carousel">
            <button class="carousel-button prev-button" aria-label="Previous Arguments">❮</button>
            <div class="carousel-wrapper">
                <div class="carousel track" id="arguments-container">
                    <!-- Argument cards will be dynamically inserted here -->
                </div>
            </div>
            <button class="carousel-button next-button" aria-label="Next Arguments">❯</button>
        </div>
        
        <!-- Quotes Section -->
        <div class="quotes-section">
            <blockquote>
                "The unexamined life is not worth living." – Socrates
                <cite>How much time do you spend examining your life?</cite>
            </blockquote>
            <blockquote>
                "I can control my passions and emotions if I can understand their nature." – Spinoza
                <cite>Do you think understanding your emotions can lead to better self-control?</cite>
            </blockquote>
        </div>
    </section>

    <!-- Timeline Section -->
    <section id="timeline" class="timeline-section">
        <h2>Philosophical Timeline</h2>
        <div class="timeline-carousel-container" aria-label="Philosophical Timeline Carousel">
            <button class="timeline-button prev-timeline-button" aria-label="Previous Timeline Event">⬆️</button>
            <div class="timeline-carousel-wrapper">
                <div class="timeline-carousel track" id="timeline-container">
                    <!-- Timeline events will be dynamically inserted here -->
                </div>
            </div>
            <button class="timeline-button next-timeline-button" aria-label="Next Timeline Event">⬇️</button>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
        <h2>About This Website</h2>
        <p>This website traces the evolution of philosophy from Descartes to the present, highlighting key philosophers, their works, and the central arguments that shaped our understanding of the world.</p>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
        <h2>Contact Us</h2>
        <form id="contact-form" aria-label="Contact Form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required aria-required="true">

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-required="true">

            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="5" required aria-required="true"></textarea>

            <button type="submit">Send</button>
        </form>
    </section>

    <!-- Modal for Detailed Information -->
    <div id="modal" class="modal" aria-hidden="true" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-body">
        <div class="modal-content">
            <span class="close-button" aria-label="Close Modal">&times;</span>
            <h2 id="modal-title"></h2>
            <p id="modal-body"></p>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        <p>&copy; 2024 Philosophy Through Time. All rights reserved.</p>
    </footer>

    <!-- Include Lunr.js for Search Functionality -->
    <script src="https://unpkg.com/lunr/lunr.js"></script>
    <!-- Scripts -->
    <script src="scripts/main.js"></script>
</body>
</html>
