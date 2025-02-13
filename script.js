const ACCESS_KEY = 'k3otGkSHQ1CU5KOJMd7BGk4Mj2gEDRQPA-UztejAKtc';
const feed = document.getElementById('feed');
const loader = document.getElementById('loader');
let isLoading = false;
let page = 1;
let currentTheme = 'light';

async function fetchPosts() {
    isLoading = true;
    loader.style.display = 'block';

    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}&count=3&page=${page}`
        );
        const posts = await response.json();

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${post.user.profile_image.medium}" 
                         class="user-avatar" 
                         alt="${post.user.name}">
                    <h3>${post.user.username}</h3>
                </div>
                <img src="${post.urls.regular}" 
                     class="post-image"
                     alt="${post.alt_description}"
                     data-caption="${post.description || post.alt_description}">
                <div class="post-actions">
                    <i class="far fa-heart"></i>
                    <i class="far fa-comment"></i>
                    <i class="far fa-bookmark"></i>
                </div>
                <div class="caption">
                    <strong>${post.user.username}</strong> 
                    ${post.description || post.alt_description || ''}
                </div>
            `;

            postElement.querySelector('.post-image').addEventListener('click', openLightbox);
            feed.appendChild(postElement);
        });

        page++;
    } catch (error) {
        console.error('Error fetching posts:', error);
    } finally {
        isLoading = false;
        loader.style.display = 'none';
    }
}

function openLightbox(e) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    img.src = e.target.src;
    caption.textContent = e.target.dataset.caption;
    lightbox.style.display = 'block';

    // Close lightbox on background click
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox || event.target.classList.contains('close-btn')) {
            lightbox.style.display = 'none';
        }
    });
}

function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 500 && !isLoading) {
        fetchPosts();
    }
}

// Theme toggle
document.querySelector('.color-mode').addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
});

// Initial load
fetchPosts();

// Scroll event
window.addEventListener('scroll', handleScroll);

// Lightbox keyboard control
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
        lightbox.style.display = 'none';
    }
});