document.getElementById('year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.topics article, .article-grid a, .approach-copy > *');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(18px)';
  item.style.transition = 'opacity .55s ease, transform .55s ease';
  observer.observe(item);
});

const style = document.createElement('style');
style.textContent = '.visible{opacity:1!important;transform:none!important}';
document.head.appendChild(style);
