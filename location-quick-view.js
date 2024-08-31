// Code to move footer data to the body
jQuery(document).ready(function($) {
    console.log('move-footer-data.js: DOM fully loaded and parsed');
    
    // Find all Geodirectory posts
    const geodirPosts = $('.geodir-post');
    console.log('move-footer-data.js: Found', geodirPosts.length, 'geodir-post elements');
    
    // Loop through each Geodirectory post
    geodirPosts.each(function() {
        const geodirPost = $(this);
        const postId = geodirPost.data('post-id');
        console.log('move-footer-data.js: Moving footer to body for post:', geodirPost);
        
        // Find the card body and footer within the Geodirectory post
        const cardBody = geodirPost.find('.card-body');
        const cardFooter = geodirPost.find('.card-footer');
        
        // Move the footer contents to the body
        cardBody.append(cardFooter.html());
        cardFooter.remove();
        
        console.log('move-footer-data.js: Footer moved to body:', cardBody.html());
    });
});

// Code to add Quick View link and icon
jQuery(document).ready(function($) {
    console.log('location-quick-view.js: DOM fully loaded and parsed');
    
    // Find all Geodirectory posts
    const geodirPosts = $('.geodir-post');
    console.log('location-quick-view.js: Found', geodirPosts.length, 'geodir-post elements');
    
    // Loop through each Geodirectory post
    geodirPosts.each(function() {
        const geodirPost = $(this);
        const postId = geodirPost.data('post-id');
        console.log('location-quick-view.js: Adding Quick View link for post:', postId);
        
        // Create the Quick View link and icon
        const quickViewLink = $('<div class="geodir-post-meta-container bsui sdel-quick-view"><div class="geodir_post_meta clear-both gv-hide-s-2 text- text- geodir-field-quick_view"><span class="geodir_post_meta_icon geodir-i-quick-view"><i class="fas fa-eye fa-fw" aria-hidden="true"></i> </span><a href="#" class="quick-view-link" data-location-id="' + postId + '">Quick View</a></div></div>');

        // Ensure no duplicates
        if (!geodirPost.find('.geodir-field-quick_view').length) {
            // Find the card body within the Geodirectory post and append the Quick View link
            const cardBody = geodirPost.find('.card-body');
            cardBody.append(quickViewLink);
            
            console.log('location-quick-view.js: Quick View link added for post:', postId);
        }
    });
    
    // Event listener for Quick View link
    $(document).on('click', '.quick-view-link', function(event) {
        event.preventDefault();
        const locationId = $(this).data('location-id');
        console.log('location-quick-view.js: Quick View clicked for location:', locationId);

        // Call the handlePopup function from location-flyin.js
        handlePopup(locationId);
    });
    
    // Add event listeners for closing the modal
    $(document).on('click', '.quick-view-close-modal, .location-modal-overlay', function(event) {
        event.preventDefault();
        closeTemporaryModal();
    });
});
