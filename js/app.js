const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');

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

async function getQuoteFromZenQuotes() {
    try {
        const response = await fetch('https://zenquotes.io/api/random');
        const data = await response.json();
        return { quote: data[0].q, author: data[0].a };
    } catch (error) {
        console.error('Error fetching quote from ZenQuotes:', error);
        return null;
    }
}

async function getRandomQuote() {
    const quotePromises = [
        getQuoteFromTypeFit(),
        getQuoteFromQuotable(),
        getQuoteFromZenQuotes()
    ];
    
    const quotes = await Promise.all(quotePromises);
    const validQuotes = quotes.filter(quote => quote !== null);

    if (validQuotes.length === 0) {
        return { quote: "Failed to fetch quotes. Please try again later.", author: "" };
    }

    return validQuotes[Math.floor(Math.random() * validQuotes.length)];
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