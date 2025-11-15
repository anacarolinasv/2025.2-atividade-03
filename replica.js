// ==========================================
// GEMINI REPLICA - JavaScript Functionality
// ==========================================

// Estado da aplicação
const appState = {
    sidebarOpen: false,
    darkMode: localStorage.getItem('darkMode') === 'true',
    versionDropdownOpen: false,
    selectedVersion: '2.5 Pro',
    activeConversation: null
};

// Função de inicialização
function initializeApp() {
    initDarkMode();
    initSidebar();
    initVersionDropdown();
    initTooltips();
    initConversationHistory();
    initInputExpansion();
    initKeyboardSimulation();
    initAnimations();
}

// Inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM já está pronto
    initializeApp();
}

// ==========================================
// DARK MODE
// ==========================================
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Aplicar tema salvo
    if (appState.darkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        appState.darkMode = !appState.darkMode;
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', appState.darkMode);
        updateDarkModeIcon(appState.darkMode);
        
        // Animação suave
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    });
}

function updateDarkModeIcon(isDark) {
    const icon = document.querySelector('.dark-mode-toggle .material-icons');
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
}

// ==========================================
// SIDEBAR (Menu Hambúrguer)
// ==========================================
function initSidebar() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    // Abrir/fechar sidebar no mobile
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });
    
    // Fechar ao clicar no overlay
    overlay.addEventListener('click', () => {
        closeSidebar();
    });
    
    // Fechar ao clicar fora em desktop (se necessário)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && appState.sidebarOpen) {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                closeSidebar();
            }
        }
    });
    
    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            appState.sidebarOpen = false;
            overlay.classList.remove('active');
        }
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    appState.sidebarOpen = !appState.sidebarOpen;
    
    if (appState.sidebarOpen) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    } else {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    appState.sidebarOpen = false;
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// ==========================================
function initVersionDropdown() {
    const selector = document.getElementById('versionSelector');
    const dropdown = document.getElementById('versionDropdown');
    const options = dropdown.querySelectorAll('.version-option');
    
    selector.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVersionDropdown();
    });
    
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const version = option.getAttribute('data-version');
            selectVersion(version);
            closeVersionDropdown();
        });
    });
    
    document.addEventListener('click', () => {
        if (appState.versionDropdownOpen) {
            closeVersionDropdown();
        }
    });
}

function toggleVersionDropdown() {
    const selector = document.getElementById('versionSelector');
    const dropdown = document.getElementById('versionDropdown');
    
    appState.versionDropdownOpen = !appState.versionDropdownOpen;
    
    if (appState.versionDropdownOpen) {
        dropdown.classList.add('open');
        selector.setAttribute('aria-expanded', 'true');
    } else {
        dropdown.classList.remove('open');
        selector.setAttribute('aria-expanded', 'false');
    }
}

function closeVersionDropdown() {
    const selector = document.getElementById('versionSelector');
    const dropdown = document.getElementById('versionDropdown');
    
    appState.versionDropdownOpen = false;
    dropdown.classList.remove('open');
    selector.setAttribute('aria-expanded', 'false');
}

function selectVersion(version) {
    const selector = document.getElementById('versionSelector');
    const options = document.querySelectorAll('.version-option');
    
    appState.selectedVersion = version;
    selector.querySelector('.text').textContent = version;
    
    options.forEach(opt => {
        if (opt.getAttribute('data-version') === version) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
}

function initTooltips() {
    const tooltip = document.getElementById('tooltip');
    const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');
    
    elementsWithTooltip.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            showTooltip(e, element);
        });
        
        element.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        element.addEventListener('mousemove', (e) => {
            updateTooltipPosition(e);
        });
    });
}

function showTooltip(e, element) {
    const tooltip = document.getElementById('tooltip');
    const text = element.getAttribute('data-tooltip');
    
    tooltip.textContent = text;
    tooltip.classList.add('visible');
    
    updateTooltipPosition(e);
}

function updateTooltipPosition(e) {
    const tooltip = document.getElementById('tooltip');
    const offset = 10;
    
    tooltip.style.left = `${e.clientX + offset}px`;
    tooltip.style.top = `${e.clientY + offset}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible');
}

function initConversationHistory() {
    const conversationLinks = document.querySelectorAll('.recent-list a');
    
    conversationLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadConversation(link.textContent.trim(), index);
        });
        
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateX(4px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateX(0)';
        });
    });
}

function loadConversation(title, index) {
    const conversationLinks = document.querySelectorAll('.recent-list a');
    
    conversationLinks.forEach(link => link.classList.remove('active'));
    
    conversationLinks[index].classList.add('active');
    
    appState.activeConversation = { title, index };
    
    const welcomeMessage = document.querySelector('.welcome-message h2');
    const originalText = welcomeMessage.textContent;
    
    welcomeMessage.textContent = title;
    welcomeMessage.style.opacity = '0.5';
    
    setTimeout(() => {
        welcomeMessage.style.opacity = '1';
        welcomeMessage.textContent = originalText;
    }, 300);
    
    const chatArea = document.querySelector('.chat-area');
    chatArea.style.animation = 'fadeIn 0.3s ease';
}

function initInputExpansion() {
    const input = document.querySelector('.chat-input');
    const inputBox = document.querySelector('.input-box');
    const maxHeight = 200;
    
    input.addEventListener('focus', () => {
        inputBox.classList.add('expanded');
        inputBox.style.maxHeight = `${maxHeight}px`;
    });
    
    input.addEventListener('blur', () => {
        if (!input.value.trim()) {
            inputBox.classList.remove('expanded');
            inputBox.style.maxHeight = '';
        }
    });
    
    input.addEventListener('input', () => {
        if (input.scrollHeight > input.clientHeight) {
            input.style.height = 'auto';
            input.style.height = `${Math.min(input.scrollHeight, maxHeight)}px`;
        }
    });
}

function initKeyboardSimulation() {
    const input = document.querySelector('.chat-input');
    const chatArea = document.querySelector('.chat-area');
    
    input.addEventListener('focus', () => {
        if (window.innerWidth <= 768) {
            chatArea.classList.add('keyboard-open');
            
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 300);
        }
    });
    
    input.addEventListener('blur', () => {
        chatArea.classList.remove('keyboard-open');
    });
}

function initAnimations() {
    const animatedElements = [
        '.sidebar',
        '.welcome-message',
        '.input-container',
        '.top-bar'
    ];
    
    animatedElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = selector === '.sidebar' ? 'translateX(-20px)' : 'translateY(-20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateX(0) translateY(0)';
            }, index * 100);
        }
    });
    
    const listItems = document.querySelectorAll('.recent-list li');
    listItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 500 + (index * 50));
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

