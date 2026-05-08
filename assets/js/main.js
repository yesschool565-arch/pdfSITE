/**
 * SmartTools Hub - Main JS
 * General UI interactions, search, and navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Theme Toggle Event
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            ThemeManager.toggle();
        });
    }

    // 3. Tool Filtering Logic (Search + Tabs)
    const searchInput = document.getElementById('tool-search') || document.getElementById('global-search');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const toolSections = document.querySelectorAll('.tool-group-section');

    function filterTools() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeTab = document.querySelector('.tab-btn.active');
        const filter = activeTab ? activeTab.getAttribute('data-filter') : 'all';

        toolSections.forEach(section => {
            const sectionGroup = section.getAttribute('data-group');
            let hasVisibleTools = false;

            const cards = section.querySelectorAll('.tool-card');
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                const category = card.getAttribute('data-category');

                const matchesSearch = title.includes(query) || desc.includes(query);
                // Matches tab if: All, or Category matches, or special case for PDF group
                const matchesTab = (query.length > 0) ? true : (filter === 'all' || category === filter || (filter === 'pdf' && sectionGroup === 'pdf'));

                if (matchesSearch && matchesTab) {
                    card.style.display = 'flex';
                    hasVisibleTools = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Hide the entire section if no tools are visible
            section.style.display = hasVisibleTools ? 'block' : 'none';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTools);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterTools();
        });
    });

    // 4. Drag & Drop Global Logic (for tool pages)
    const uploadZones = document.querySelectorAll('.upload-zone');
    uploadZones.forEach(zone => {
        const fileInput = zone.querySelector('input[type="file"]');
        
        zone.addEventListener('click', () => fileInput.click());

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksMenu = document.querySelector('.nav-links');

    if (menuToggle && navLinksMenu) {
        menuToggle.addEventListener('click', () => {
            navLinksMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinksMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinksMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    }
});
