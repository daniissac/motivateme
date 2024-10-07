const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const CACHE_KEY = 'motivateme_quotes_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

let quotes = [];

async function loadQuotes() {
    try {
        const response = await fetch('quotes.json');
        quotes = await response.json();
    } catch (error) {
        console.error('Error loading quotes:', error);
        quotes = [
            { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
            { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
            { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
        ];
    }
}

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

async function updateQuote() {
    if (quotes.length === 0) {
        await loadQuotes();
    }
    const { quote, author } = getRandomQuote();
    quoteElement.textContent = quote;
    authorElement.textContent = author;
}

// Load quotes and display a quote on page load
loadQuotes().then(updateQuote);

// Add click event listener to the document body
document.body.addEventListener('click', updateQuote);

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed:', error));
}
