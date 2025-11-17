// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateDarkModeIcon(currentTheme);

darkModeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcon(newTheme);
});

function updateDarkModeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Search Functionality
const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.card');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    filterCards(searchTerm);
});

function filterCards(searchTerm) {
    cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const cardTitle = card.querySelector('h2').textContent.toLowerCase();
        const cardCategory = card.getAttribute('data-category') || '';
        const cardTechnologies = card.getAttribute('data-tecnologias') || '';
        
        const matchesSearch = searchTerm === '' || 
            cardTitle.includes(searchTerm) ||
            cardText.includes(searchTerm) ||
            cardTechnologies.toLowerCase().includes(searchTerm);
        
        const currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter');
        const matchesFilter = !currentFilter || currentFilter === 'all' || cardCategory === currentFilter;
        
        if (matchesSearch && matchesFilter) {
            card.classList.remove('hidden');
            card.style.display = '';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
}

// Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
        
        // Filter cards
        filterCardsByCategory(filterValue);
        
        // Also apply search filter if there's a search term
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filterCards(searchTerm);
        }
    });
});

function filterCardsByCategory(category) {
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            card.style.display = '';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
}

// Initialize - show all cards
filterCards('');

