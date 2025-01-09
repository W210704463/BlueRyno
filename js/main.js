// Weather API Configuration
const API_KEY = process.env.WEATHER_API_KEY;
const API_HOST = 'weather-api167.p.rapidapi.com';

// Weather Check Event Handler
document.getElementById('check-weather').addEventListener('click', function() {
    const date = document.getElementById('installation-date').value;
    const location = document.getElementById('location').value;
    const weatherResult = document.getElementById('weather-result');

    if (!date || !location) {
        weatherResult.innerHTML = 'Please enter both date and location';
        return;
    }

    // Show loading state
    weatherResult.innerHTML = 'Checking weather...';

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            try {
                const response = JSON.parse(this.responseText);
                displayWeatherResult(response);
            } catch (error) {
                weatherResult.innerHTML = 'Error fetching weather data. Please try again.';
                console.error('Weather API Error:', error);
            }
        }
    });

    // Construct API URL with user's location
    const apiUrl = `https://weather-api167.p.rapidapi.com/api/weather/forecast?place=${encodeURIComponent(location)}&cnt=3&units=standard&type=three_hour&mode=json&lang=en`;

    xhr.open('GET', apiUrl);
    xhr.setRequestHeader('x-rapidapi-key', API_KEY);
    xhr.setRequestHeader('x-rapidapi-host', API_HOST);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.send();
});

function displayWeatherResult(weatherData) {
    const weatherResult = document.getElementById('weather-result');
    
    if (weatherData && weatherData.forecast) {
        const forecast = weatherData.forecast[0]; // Get first forecast period
        weatherResult.innerHTML = `
            <div class="weather-info">
                <h3>Weather Forecast</h3>
                <p>Temperature: ${forecast.temp}°F</p>
                <p>Conditions: ${forecast.description}</p>
                <p>Precipitation: ${forecast.precipitation}%</p>
            </div>
        `;
    } else {
        weatherResult.innerHTML = 'Weather data not available for this location/date.';
    }
}

// Mobile Navigation Toggle Handler
document.querySelector('.nav-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Add active class to current page link
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Image Lightbox Feature
class Lightbox {
    constructor() {
        this.init();
    }

    init() {
        // Create lightbox container
        this.lightbox = document.createElement('div');
        this.lightbox.id = 'lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="" alt="Gallery Image">
                <button class="lightbox-prev">&lt;</button>
                <button class="lightbox-next">&gt;</button>
            </div>
        `;
        document.body.appendChild(this.lightbox);

        // Event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Gallery image click
        document.querySelectorAll('.gallery-image').forEach(image => {
            image.addEventListener('click', () => this.open(image));
        });

        // Close button
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());

        // Navigation buttons
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.navigate(-1));
        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.navigate(1));
    }

    open(image) {
        this.currentImage = image;
        this.lightbox.querySelector('img').src = image.src;
        this.lightbox.classList.add('active');
    }

    close() {
        this.lightbox.classList.remove('active');
    }

    navigate(direction) {
        const images = Array.from(document.querySelectorAll('.gallery-image'));
        const currentIndex = images.indexOf(this.currentImage);
        const newIndex = (currentIndex + direction + images.length) % images.length;
        this.open(images[newIndex]);
    }
}

// FAQ Accordion
class FaqAccordion {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggle(item));
        });
    }

    toggle(item) {
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.faq-item.active').forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove('active');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            }
        });

        // Toggle current item
        item.classList.toggle('active');
        if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = null;
        }
    }
}

// Contact Form Validation
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const errorElement = field.nextElementSibling;
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                isValid = /^\d{10}$/.test(field.value.replace(/\D/g, ''));
                errorMessage = 'Please enter a valid phone number';
                break;
            default:
                isValid = field.value.trim() !== '';
                errorMessage = 'This field is required';
        }

        if (!isValid) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
        } else {
            field.classList.remove('error');
            errorElement.textContent = '';
        }

        return isValid;
    }

    handleSubmit(e) {
        e.preventDefault();
        const isValid = Array.from(this.form.elements)
            .filter(element => element.tagName !== 'BUTTON')
            .every(field => this.validateField(field));

        if (isValid) {
            // Submit form data
            console.log('Form submitted successfully');
            // Add your form submission logic here
        }
    }
}

// Quote Calculator
class QuoteCalculator {
    constructor() {
        this.calculator = document.getElementById('quote-calculator');
        if (this.calculator) {
            this.init();
        }
    }

    init() {
        this.calculator.addEventListener('input', () => this.calculate());
        this.calculate(); // Initial calculation
    }

    calculate() {
        const length = parseFloat(this.calculator.querySelector('#fence-length').value) || 0;
        const height = parseFloat(this.calculator.querySelector('#fence-height').value) || 0;
        const material = this.calculator.querySelector('#fence-material').value;

        // Base rates per square foot
        const rates = {
            wood: 25,
            vinyl: 35,
            metal: 45
        };

        const squareFeet = length * height;
        const basePrice = squareFeet * rates[material];
        const estimate = basePrice.toFixed(2);

        this.calculator.querySelector('#quote-result').textContent = `Estimated Cost: $${estimate}`;
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
    new FaqAccordion();
    new ContactForm();
    new QuoteCalculator();
});

// Initialize Bootstrap tooltips and popovers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize all popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Update active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Add lazy loading for images
document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
});

// Back to Top Button
const backToTopButton = document.createElement('button');
backToTopButton.id = 'back-to-top';
backToTopButton.innerHTML = '↑';
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});