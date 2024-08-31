jQuery(document).ready(function($) {
    // Add event listeners after the DOM is fully loaded
    $('.location-quick-view-link').on('click', function(event) {
        event.preventDefault();
        const locationId = $(this).data('location-id');
        handlePopup(locationId);
    });

    // Function to add event listeners to close buttons
    const addCloseButtonListener = () => {
        const closeButtons = document.querySelectorAll('.quick-view-close-modal, .quick-view-close-x');
        closeButtons.forEach(button => {
            button.addEventListener('click', closeTemporaryModal);
        });
    };

    // Add event listener for closing the modal by clicking the overlay
    $(document).on('click', '.location-modal-overlay', function() {
        closeTemporaryModal();
    });

    // Call the function to add the listener after a delay
    setTimeout(addCloseButtonListener, 1000); // Adjust the delay if necessary
});

function handlePopup(locationId) {
    console.log(`Quick view clicked for location ID: ${locationId}`);

    // Show the modal and overlay immediately
    document.getElementById('locationQuickViewModal').style.display = 'block';
    document.querySelector('.location-modal-overlay').style.display = 'block';

    // Show a temporary loading screen immediately
    showLoadingIndicator();

    // Make the AJAX request to fetch the location details
    jQuery.ajax({
        type: 'GET',
        url: `https://www.visitottawail.com/wp-json/geodir/v2/places/${locationId}`,
        success: function(data) {
            console.log('Fetched location data:', data);
            populateModal(data);
        },
        error: function(xhr, status, error) {
            console.log('Error fetching location data:', status, error);
            hideLoadingIndicator();
        }
    });
}

// Populate the modal with the fetched content
function populateModal(data) {
    console.log('Populating modal with data:', data);

    const modalContent = document.querySelector('.modal-content');
    const modalBody = document.querySelector('.modal-body');
    const modalTitle = document.querySelector('.quick-view-modal-location-title');
    const modalWebsite = document.querySelector('.quick-view-modal-location-website');
    const scrollIndicator = document.querySelector('.location-scroll-indicator');
    const modalContainer = document.getElementById('locationQuickViewModal');

    if (modalContent && modalBody && modalTitle && modalWebsite && scrollIndicator && modalContainer) {
        modalBody.innerHTML = '';

        // Add the featured image
        if (data.featured_image && data.featured_image.src) {
            const imgElement = document.createElement('img');
            imgElement.src = data.featured_image.src;
            imgElement.alt = data.title.rendered;
            imgElement.style.width = '100%';
            modalBody.appendChild(imgElement);
        }

        // Set the title
        modalTitle.innerHTML = `<h2>${data.title.rendered}</h2>`;

        // Add the address
        if (data.street) {
            const addressElement = document.createElement('p');
            addressElement.innerHTML = `<strong>Address:</strong> ${data.street}`;
            modalBody.appendChild(addressElement);
        }

        // Add the phone number
        if (data.phone) {
            const phoneElement = document.createElement('p');
            phoneElement.innerHTML = `<strong>Phone:</strong> ${data.phone}`;
            modalBody.appendChild(phoneElement);
        }

        // Add the website link
        if (data.web_site) {
            const websiteElement = document.createElement('p');
            websiteElement.innerHTML = `<strong>Website:</strong> <a href="${data.web_site}" target="_blank">${data.web_site}</a>`;
            modalBody.appendChild(websiteElement);
        }

        // Add the description
        if (data.content.rendered) {
            const descriptionElement = document.createElement('div');
            descriptionElement.innerHTML = data.content.rendered;
            modalBody.appendChild(descriptionElement);
        }

        // Update the More Info button link
        modalWebsite.href = data.link;

        hideLoadingIndicator();

        // Check if scroll indicator is needed
        handleScroll();

        // Add scroll event listeners to modal content, modal body, and modal container
        modalContent.addEventListener('scroll', onScroll);
        modalBody.addEventListener('scroll', onBodyScroll);
        modalContainer.addEventListener('scroll', onContainerScroll);
        console.log('Scroll event listeners added to modalContent, modalBody, and modalContainer.');
    } else {
        console.error('Modal elements not found.');
    }
}

// Close the modal
function closeTemporaryModal() {
    const modal = document.getElementById('locationQuickViewModal');
    const overlay = document.querySelector('.location-modal-overlay');
    if (modal) {
        modal.style.display = 'none';
    }
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Show a temporary loading indicator
function showLoadingIndicator() {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.innerHTML = '<div class="loading-indicator">Loading...</div>';
    } else {
        console.error('Modal body not found.');
    }
}

// Hide the loading indicator
function hideLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// Scroll event handler for modal content
function onScroll() {
    const scrollIndicator = document.querySelector('.location-scroll-indicator');
    console.log('onScroll event triggered');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '0';
        console.log('Scroll indicator hidden');
    } else {
        console.error('Scroll indicator not found in onScroll');
    }
}

// Scroll event handler for modal body
function onBodyScroll() {
    console.log('Scroll event triggered on modalBody');
    const scrollIndicator = document.querySelector('.location-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '0';
    }
}

// Scroll event handler for modal container
function onContainerScroll() {
    console.log('Scroll event triggered on locationQuickViewModal');
    const scrollIndicator = document.querySelector('.location-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '0';
    }
}

// Scroll indicator handler
function handleScroll() {
    const modalContent = document.querySelector('.modal-content');
    const scrollIndicator = document.querySelector('.location-scroll-indicator');
    const modalContainer = document.getElementById('locationQuickViewModal');
    const modalBody = document.querySelector('.modal-body');

    if (modalContent && scrollIndicator && modalContainer) {
        const contentHeight = modalContent.scrollHeight;
        const containerHeight = modalContainer.clientHeight;

        console.log("modalContent.scrollHeight: " + contentHeight);
        console.log("modalContent.clientHeight: " + modalContent.clientHeight);
        console.log("locationQuickViewModal.clientHeight: " + containerHeight);

        if (contentHeight > containerHeight) {
            console.log('Content exceeds container height, showing scroll indicator.');
            scrollIndicator.style.opacity = '1';
        } else {
            console.log('Content fits within container, hiding scroll indicator.');
            scrollIndicator.style.opacity = '0';
        }

        modalContent.addEventListener('scroll', function () {
            console.log('Modal content scrolled');
            if (modalContent.scrollTop > 0) {
                console.log('User scrolled, hiding scroll indicator.');
                scrollIndicator.style.opacity = '0';
            } else {
                console.log('User did not scroll, keeping scroll indicator visible.');
            }
        });

        modalBody.addEventListener('scroll', onBodyScroll);
        modalContainer.addEventListener('scroll', onContainerScroll);
    } else {
        console.error('Modal content, scroll indicator, or modal container not found in handleScroll.');
    }
}
