// Prints message IT'S ALIVE
console.log("IT'S ALIVE");

// Create the navigation bar and handle dark mode when DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Pages array with relative URLs (updated paths)
    let pages = [
        { url: "projects", title: "Projects" },
        { url: "CV", title: "CV" },
        { url: "contact", title: "Contact" },
        { url: ".", title: "Home" },
        { url: "https://github.com/Luisajaime94", title: "GitHub" }
    ];
    // Get the existing nav element
    let nav = document.querySelector('nav ul');
    if (!nav) {
        console.error("Navigation element not found!");
        return;
    }

    // Dynamically create the navigation links
    pages.forEach((p) => {
        let li = document.createElement('li');
        let a = document.createElement('a');

        // Set the URL and text content for the navigation link
        a.href = p.url;
        a.textContent = p.title;
        li.appendChild(a);
        nav.appendChild(li);

        // Add 'current' class for the active page (current page highlighting)
        a.classList.toggle(
            'current',
            a.host === location.host && a.pathname === location.pathname
        );

        // Open external links in a new tab
        if (a.host !== location.host) {
            a.target = '_blank';
        }
    });

    // Theme switcher logic
    const themeSwitcher = document.getElementById('theme-select');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('change', (event) => {
            const selectedTheme = event.target.value;

            if (selectedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else if (selectedTheme === 'light') {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.removeItem('theme');
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            }
        });

        // Apply saved or system-preferred theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.toggle('dark-mode', savedTheme === 'dark');
            themeSwitcher.value = savedTheme;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
            themeSwitcher.value = 'auto';
        }
    } else {
        console.error("Theme switcher element not found!");
    }
});
