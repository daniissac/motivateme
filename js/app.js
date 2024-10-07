const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const CACHE_KEY = 'motivateme_quotes_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const fallbackQuotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
];

async function getQuoteFromRealInspire() {
    try {
        const response = await fetch('https://api.realinspire.tech/v1/quotes/random');
        const data = await response.json();
        return { quote: data.quote, author: data.author };
    } catch (error) {
        console.error('Error fetching quote from Real Inspire:', error);
        return null;
    }
}

async function getQuoteFromZenQuotes() {
    try {
        const response = await fetch('https://zenquotes.io/api/random');
        const data = await response.json();
        return { quote: data[0].q, author: data[0].a };
    } catch (error) {
        console.error('Error fetching quote from Zen Quotes:', error);
        return null;
    }
}

async function getQuoteFromQuotable() {
    try {
        const response = await fetch('https://api.quotable.io/quotes/random');
        const data = await response.json();
        return { quote: data[0].content, author: data[0].author };
    } catch (error) {
        console.error('Error fetching quote from Quotable:', error);
        return null;
    }
}

async function getQuoteFromApiNinjas() {
    try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
            headers: { 'X-Api-Key': 'YOUR_API_NINJAS_KEY' }
        });
        const data = await response.json();
        return { quote: data[0].quote, author: data[0].author };
    } catch (error) {
        console.error('Error fetching quote from API Ninjas:', error);
        return null;
    }
}

async function getQuoteFromTypeFit() {
    try {
        const response = await fetch('https://type.fit/api/quotes');
        const data = await response.json();
        const randomQuote = data[Math.floor(Math.random() * data.length)];
        return { quote: randomQuote.text, author: randomQuote.author || 'Unknown' };
    } catch (error) {
        console.error('Error fetching quote from Type.fit:', error);
        return null;
    }
}

function getCachedQuotes() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        const { quotes, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
            return quotes;
        }
    }
    return null;
}

function updateCache(newQuotes) {
    const cachedData = getCachedQuotes() || [];
    const updatedCache = [...new Set([...cachedData, ...newQuotes])];
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        quotes: updatedCache,
        timestamp: Date.now()
    }));
}

async function getRandomQuote() {
    const cachedQuotes = getCachedQuotes();
    if (cachedQuotes && cachedQuotes.length > 0) {
        return cachedQuotes[Math.floor(Math.random() * cachedQuotes.length)];
    }

    const apiCalls = [
        getQuoteFromRealInspire(),
        getQuoteFromZenQuotes(),
        getQuoteFromQuotable(),
        getQuoteFromTypeFit()
    ];

    const results = await Promise.all(apiCalls);
    const validQuotes = results.filter(quote => quote !== null);

    if (validQuotes.length > 0) {
        updateCache(validQuotes);
        return validQuotes[Math.floor(Math.random() * validQuotes.length)];
    } else {
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

// Add click event listener to the document body
document.body.addEventListener('click', updateQuote);

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed:', error));
}