document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // CONFIGURATION
    // --------------------------------------------------------------------------
    // 1. Get your Access Token from the Facebook Developers Portal.
    // 2. Paste it below inside the quotes.
    const INSTAGRAM_ACCESS_TOKEN = "";

    // Optional: Limit number of posts to display
    const POST_LIMIT = 5;
    // --------------------------------------------------------------------------

    const feedContainer = document.querySelector('.instagram-grid');

    if (!INSTAGRAM_ACCESS_TOKEN) {
        console.warn("Instagram Feed: No Access Token provided. Showing placeholder images.");
        return; // Exit and leave static HTML as fallback
    }

    if (feedContainer) {
        fetchInstagramPosts();
    }

    async function fetchInstagramPosts() {
        try {
            // Fetch media from Instagram Graph API
            const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=${POST_LIMIT}`);

            if (!response.ok) {
                throw new Error('Failed to fetch Instagram posts');
            }

            const data = await response.json();
            const posts = data.data;

            if (posts && posts.length > 0) {
                renderPosts(posts);
            }

        } catch (error) {
            console.error("Instagram Feed Error:", error);
            // Fallback is already there (static HTML), so we just log the error
        }
    }

    function renderPosts(posts) {
        // Clear static placeholders only if we have real data
        feedContainer.innerHTML = '';

        posts.forEach(post => {
            // Handle Images vs Videos
            // If media_type is VIDEO, use thumbnail_url. Otherwise use media_url.
            const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
            const caption = post.caption ? post.caption.substring(0, 50) + '...' : 'View Post';

            const postElement = document.createElement('a');
            postElement.href = post.permalink;
            postElement.target = "_blank";
            postElement.className = "insta-item";

            postElement.innerHTML = `
                <img src="${imageUrl}" alt="Instagram Post" loading="lazy">
                <div class="insta-overlay">
                    <span>View Post ↗</span>
                </div>
            `;

            feedContainer.appendChild(postElement);
        });
    }
});
