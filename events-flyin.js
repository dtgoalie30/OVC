// events-flyin.js. ver 1.4.7

jQuery(document).ready(function($) {
    // Add event listeners after the DOM is fully loaded
    $('.quick-view-link').on('click', function(event) {
        event.preventDefault();
        const eventId = $(this).data('event-id');
        console.log(`Quick view link clicked for event ID: ${eventId}`);
        handlePopup(eventId);
    });
});

function handlePopup(eventId) {
    console.log(`Quick view clicked for event ID: ${eventId}`);

    // Extract numeric part of the event ID for AJAX request
    const numericEventId = eventId.replace('event_article_', '');
    console.log(`Handle pop-up for event ID: ${numericEventId}`);

    // Show a temporary loading screen immediately
    showLoadingIndicator();

    // Delay to ensure the modal element is available in the DOM
    setTimeout(() => {
        // Show the temporary modal
        const tempModal = document.getElementById('temporary-modal');
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
        document.body.appendChild(overlay);

        if (!tempModal) {
            console.error('Temporary modal element not found in DOM.');
            hideLoadingIndicator(); // Hide the loading indicator if the modal is not found
            return;
        } else {
            console.log('Temporary modal element found in DOM.');
        }

        // Show the modal and overlay using opacity
// Show the modal and overlay using opacity and transform
tempModal.style.opacity = '1';
tempModal.style.visibility = 'visible';
// Remove the line that sets the height, we'll rely on CSS for height control
tempModal.style.transform = 'translate(-50%, -50%)'; // Adjust the transform to keep the modal centered
overlay.style.opacity = '1';
overlay.style.visibility = 'visible';
// Remove the line that sets the height for the overlay

        console.log('Temporary modal and overlay displayed.');

        // Log the event ID being sent
        console.log(`Sending AJAX request for event ID: ${numericEventId}`);

        // Make the AJAX request to fetch the event details
        jQuery.ajax({
            type: 'POST',
            url: customQuickViewParams.ajax_url,
            data: {
                action: 'fetch_event_details',
                event_id: numericEventId,
                nonce: customQuickViewParams.nonce
            },
            success: function(response) {
                console.log('AJAX response:', response); // Log the AJAX response
                if (response.success) {
                    console.log('AJAX success:', response.data);

                    // Populate the temporary modal content
                    populateTemporaryModal(response.data);
                } else {
                    console.log('AJAX error:', response);
                    hideLoadingIndicator();
                }
            },
            error: function(xhr, status, error) {
                console.log('AJAX error:', status, error);
                hideLoadingIndicator();
            }
        });

        // Close the pop-up when clicking on the overlay
        overlay.addEventListener('click', function() {
            closeTemporaryModal();
        });
    }, 500); // Delay of 500ms to ensure the modal is available in the DOM
}

// Call handleScroll function after populating the content to ensure accurate measurements
function populateTemporaryModal(event) {
    if (!event) {
        console.error('Event data is undefined');
        return;
    }

    console.log(`Attempting to populate temporary modal with content: ${JSON.stringify(event)}`);

    const tempModalContent = document.getElementById('temporary-modal-content');
    if (tempModalContent) {
        tempModalContent.innerHTML = `
            <div class="event-thumbnail">
                <img src="${event.thumbnail}" alt="${event.title}">
            </div>
            <h2><a href="${event.link}" target="_blank">${event.title}</a></h2>
            <p><strong>Date:</strong> ${event.start_date}</p>
            <p><strong>Time:</strong> ${event.start_time}</p>
            <p>${event.description}</p>
            <button class="more-info-button" onclick="window.open('${event.link}', '_blank')">More Info</button>
            <button class="close-window-button" onclick="closeTemporaryModal()">Close Window</button>
        `;
        console.log('Content successfully populated in the temporary modal.');

        hideLoadingIndicator();

        // Add scroll event listener to show scroll indicator
        handleScroll(); // Initial call to check if scroll indicator is needed

        // Add scroll event listeners to multiple elements
        tempModalContent.addEventListener('scroll', onScroll);
        tempModalContent.parentElement.addEventListener('scroll', onScroll);
        document.getElementById('temporary-modal').addEventListener('scroll', onScroll);
        console.log('Scroll event listeners added to tempModalContent and related elements.');
    } else {
        console.error('Temporary modal content placeholder not found.');
    }
}

function closeTemporaryModal() {
    const tempModal = document.getElementById('temporary-modal');
    const overlay = document.querySelector('.modal-overlay');
    
    if (tempModal) {
        tempModal.style.opacity = '0';
        tempModal.style.visibility = 'hidden';
        tempModal.style.transform = 'translateY(-20px)'; // Move it slightly up for a smooth closing effect
    }
    
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        setTimeout(() => overlay.remove(), 300); // Ensure the overlay is removed after the transition
    }
}

function showLoadingIndicator() {
    const tempModalContent = document.getElementById('temporary-modal-content');
    if (tempModalContent) {
        tempModalContent.innerHTML = '<div class="loading-indicator">Loading...</div>';
    } else {
        console.error('Temporary modal content placeholder not found.');
    }
}

function hideLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// Add event listener to close the temporary modal
document.getElementById('temporary-modal-close').addEventListener('click', closeTemporaryModal);

// Scroll event handler
function onScroll() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '0';
    }
}

// Scroll indicator handler
function handleScroll() {
    const tempModal = document.getElementById('temporary-modal');
    const tempModalContent = document.getElementById('temporary-modal-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (tempModal && tempModalContent && scrollIndicator) {
        if (tempModalContent.scrollHeight > tempModal.clientHeight) {
            scrollIndicator.style.opacity = '1';
        } else {
            scrollIndicator.style.opacity = '0';
        }
    } else {
        console.error('Temporary modal, temporary modal content, or scroll indicator not found.');
    }
}
