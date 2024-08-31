<?php
// Ensure there are no spaces or lines before this opening PHP tag

function divi_child_theme_enqueue_scripts() {
    // Remove the following line to stop enqueuing jQuery initially
    // wp_enqueue_script('jquery');

    // Enqueue the parent theme stylesheet
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    
    // Enqueue the child theme stylesheet with dependency on parent-style
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.css', array('parent-style'));

    // Load non-critical CSS asynchronously (preload to improve performance)
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css', array(), null, 'print');
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css', array(), null, 'print');
    wp_enqueue_style('roboto-font', 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap', array(), null, 'print');

    // JavaScript to switch back to 'all' once the CSS is loaded
    wp_add_inline_script('jquery', "
        jQuery(document).ready(function() {
            jQuery('link[rel=\"stylesheet\"][media=\"print\"]').each(function() {
                this.media = 'all';
            });
        });
    ");

    // Preload critical CSS stylesheets for parent and child themes
    add_action('wp_head', function() {
        echo '<link rel="preload" href="' . get_template_directory_uri() . '/style.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">';
        echo '<link rel="preload" href="' . get_stylesheet_directory_uri() . '/style.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">';
    });

  //  if (is_page(array('attractions', 'food-and-wine', 'casual-dining', 'pubs-and-lounges', 'fast-food', 'ethnic-dining', 'fine-dining', 'sweets', 'accommodations', 'chain-hotel', 'unique-places-to-stay', 'pet-friendly-hotels', 'shopping', 'specialty-stores', 'clothing-stores', 'grocery-stores'))) {
  //      error_log('Enqueueing move-footer-data.js and location-quick-view.js on attractions page');
  //      wp_enqueue_script('move-footer-data-js', get_stylesheet_directory_uri() . '/js/move-footer-data.js', array('jquery'), null, true);
  //      wp_enqueue_script('location-quick-view-js', get_stylesheet_directory_uri() . '/js/location-quick-view.js', array('jquery'), null, true);
  //      wp_enqueue_script('location-flyin-js', get_stylesheet_directory_uri() . '/js/location-flyin.js', array('jquery'), null, true);

  //      $location_quick_view_nonce = wp_create_nonce('location_quick_view_nonce');

  //      error_log("Location Quick View Nonce: " . $location_quick_view_nonce);

 //       wp_localize_script('location-quick-view-js', 'locationQuickViewParams', array(
 //           'ajax_url' => admin_url('admin-ajax.php'),
 //           'nonce' => $location_quick_view_nonce
 //       ));
 //       wp_localize_script('location-flyin-js', 'locationFlyinParams', array(
 //           'ajax_url' => admin_url('admin-ajax.php'),
 //           'nonce' => $location_quick_view_nonce
 //       ));

        // Enqueue location.css for the attractions page
 //       wp_enqueue_style('location-style', get_stylesheet_directory_uri() . '/css/location.css');
  //  }

 //   if (is_page(array('events', 'front-page', 'home', 'signature-events'))) {
 //       error_log('Enqueueing custom-quick-view.js and events-flyin.js on events page and home page');
 //       wp_enqueue_script('custom-quick-view-js', get_stylesheet_directory_uri() . '/js/custom-quick-view.js', array('jquery'), null, true);
 //       wp_enqueue_script('events-flyin-js', get_stylesheet_directory_uri() . '/js/events-flyin.js', array('jquery'), null, true);

  //      $custom_quick_view_nonce = wp_create_nonce('custom_quick_view_nonce');

  //      error_log("Custom Quick View Nonce: " . $custom_quick_view_nonce);

  //      wp_localize_script('custom-quick-view-js', 'customQuickViewParams', array(
  //           'ajax_url' => admin_url('admin-ajax.php'),
  //           'nonce' => $custom_quick_view_nonce
  //       ));
  //       wp_localize_script('events-flyin-js', 'eventsFlyinParams', array(
  //           'ajax_url' => admin_url('admin-ajax.php'),
  //           'nonce' => $custom_quick_view_nonce
  //      ));
  //  }
} // <- Added missing closing brace here
add_action('wp_enqueue_scripts', 'divi_child_theme_enqueue_scripts');

// Log jQuery loading and readiness
function log_jquery_loading() {
    ?>
    <script type="text/javascript">
        if (typeof jQuery !== 'undefined') {
            console.log('jQuery is loaded');
        } else {
            console.log('jQuery is not loaded');
        }

        jQuery(document).ready(function() {
            console.log('jQuery is fully ready');
        });
    </script>
    <?php
}
add_action('wp_footer', 'log_jquery_loading');

// Custom AJAX functions are kept intact as they don't impact front-end directly.

function custom_quick_view_fetch_event_details() {
    $received_nonce = isset($_POST['nonce']) ? $_POST['nonce'] : 'No nonce received';
    error_log("Received Nonce for Custom Quick View: " . $received_nonce);
    check_ajax_referer('custom_quick_view_nonce', 'nonce');

    $event_id = isset($_POST['event_id']) ? intval($_POST['event_id']) : 0;
    if ($event_id > 0) {
        $event = get_post($event_id);
        if ($event) {
            $response = array(
                'success' => true,
                'data' => array(
                    'thumbnail' => get_the_post_thumbnail_url($event_id, 'full'),
                    'title' => $event->post_title,
                    'link' => get_permalink($event_id),
                    'start_date' => get_post_meta($event_id, '_EventStartDate', true), // Assuming The Events Calendar plugin
                    'start_time' => get_post_meta($event_id, '_EventStartTime', true), // Assuming The Events Calendar plugin
                    'description' => apply_filters('the_content', $event->post_content),
                ),
            );
            error_log('Event details: ' . print_r($response, true));
            wp_send_json($response);
        }
    }
    wp_send_json(array('success' => false, 'data' => 'Event not found.'));
}
add_action('wp_ajax_fetch_event_details', 'custom_quick_view_fetch_event_details');
add_action('wp_ajax_nopriv_fetch_event_details', 'custom_quick_view_fetch_event_details');

function fetch_quick_view_content() {
    $received_nonce = isset($_POST['nonce']) ? $_POST['nonce'] : 'No nonce received';
    error_log("Received Nonce for Events Flyin: " . $received_nonce);
    check_ajax_referer('custom_quick_view_nonce', 'nonce');

    $location_id = intval($_POST['location_id']);
    if (!$location_id) {
        wp_send_json_error('Invalid location ID.');
    }

    $post = get_post($location_id);
    if (!$post) {
        wp_send_json_error('Location not found.');
    }

    $address = get_post_meta($post->ID, 'address', true);
    $phone = get_post_meta($post->ID, 'phone', true);
    $website = get_post_meta($post->ID, 'website', true);
    $featured_image = get_the_post_thumbnail_url($post->ID, 'full');
    $permalink = get_permalink($post->ID);
    $description = $post->post_content;

    ob_start();
    ?>
    <div class="quick-view-header">
        <h2><?php echo esc_html($post->post_title); ?></h2>
        <?php if ($featured_image) : ?>
            <img src="<?php echo esc_url($featured_image); ?>" alt="<?php echo esc_attr($post->post_title); ?>" />
        <?php endif; ?>
    </div>
    <div class="quick-view-details">
        <div class="quick-view-description">
            <?php echo wp_kses_post($description); ?>
        </div>
        <?php if ($address) : ?>
            <p><i class="fas fa-map-marker-alt"></i> <?php echo esc_html($address); ?></p>
        <?php endif; ?>
        <?php if ($phone) : ?>
            <p><i class="fas fa-phone"></i> <?php echo esc_html($phone); ?></p>
        <?php endif; ?>
        <?php if ($website) : ?>
            <p><i class="fas fa-globe"></i> <a href="<?php echo esc_url($website); ?>" target="_blank"><?php echo esc_html($website); ?></a></p>
        <?php endif; ?>
        <p><a href="<?php echo esc_url($permalink); ?>" class="more-info-link">More Info</a></p>
    </div>
    <?php
    $content = ob_get_clean();

    wp_send_json_success(array('content' => $content));
}
add_action('wp_ajax_fetch_quick_view', 'fetch_quick_view_content');
add_action('wp_ajax_nopriv_fetch_quick_view', 'fetch_quick_view_content'); 

function defer_jquery_and_migrate() {
    if (!is_admin()) {
        // Deregister existing jQuery
        wp_deregister_script('jquery');
        
        // Register jQuery with defer
        wp_register_script('jquery', includes_url('/js/jquery/jquery.min.js'), false, null, true);
        wp_enqueue_script('jquery');
        
        // Deregister existing jQuery Migrate
        wp_deregister_script('jquery-migrate');
        
        // Register jQuery Migrate with defer
        wp_register_script('jquery-migrate', includes_url('/js/jquery/jquery-migrate.min.js'), array('jquery'), null, true);
        wp_enqueue_script('jquery-migrate');
    }
}
add_action('wp_enqueue_scripts', 'defer_jquery_and_migrate');
?>