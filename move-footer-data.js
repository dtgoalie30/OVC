document.addEventListener('DOMContentLoaded', function () {
    console.log('move-footer-data.js: DOM fully loaded and parsed');
    
    const geodirPosts = document.querySelectorAll('.geodir-post');
    console.log(`move-footer-data.js: Found ${geodirPosts.length} geodir-post elements`);

    geodirPosts.forEach(post => {
        const footer = post.querySelector('.card-footer');
        if (footer) {
            console.log('move-footer-data.js: Moving footer to body for post:', post);
            const body = post.querySelector('.card-body');
            if (body) {
                body.appendChild(footer);
                console.log('move-footer-data.js: Footer moved to body:', body);
            } else {
                console.error('move-footer-data.js: No .card-body found in post:', post);
            }
        } else {
            console.error('move-footer-data.js: No .card-footer found in post:', post);
        }
    });
});
