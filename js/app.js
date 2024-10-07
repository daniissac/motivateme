const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');

const fallbackQuotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { quote: "Success is not how high you have climbed, but how you make a positive difference to the world.", author: "Roy T. Bennett" }
];

async function getQuoteFromQuotable() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        return { quote: data.content, author: data.author };
    } catch (error) {
        console.error('Error fetching quote from Quotable:', error);
        return null;
    }
}

async function getRandomQuote() {
    const quote = await getQuoteFromQuotable();
    if (quote) {
        return quote;
    } else {
        // Fallback to local quotes if API fails
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}

async function updateQuote() {
    const { quote, author } = await getRandomQuote();
    quoteElement.textContent = quote;
    authorElement.textContent = author;
}

// Load a new quote on page load
updateQuote();

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed:', error));
}