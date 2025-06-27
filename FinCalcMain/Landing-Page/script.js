// Inisialisasi AOS
AOS.init({
    duration: 1000,
    once: true
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
        document.querySelector('.navbar').classList.remove('navbar-dark');
        document.querySelector('.navbar').classList.add('navbar-light');
    } else {
        document.querySelector('.navbar').classList.remove('scrolled');
        document.querySelector('.navbar').classList.add('navbar-dark');
        document.querySelector('.navbar').classList.remove('navbar-light');
    }
}); 