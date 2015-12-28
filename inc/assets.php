<?php
/**
 * Enqueue scripts and styles.
 */
function _s_scripts() {
	if ( WP_DEBUG ) {
		wp_enqueue_style( '_s-style', get_template_directory_uri() . '/dist/css/style.css', array(), '0.0.1' );
		wp_enqueue_script( '_s-theme', get_template_directory_uri() . '/dist/js/theme.js', array( 'jquery' ), '0.0.1', true );
	} else {
		wp_enqueue_style( '_s-style', get_template_directory_uri() . '/dist/css/style.min.css', array(), '0.0.1' );
		wp_enqueue_script( '_s-theme', get_template_directory_uri() . '/dist/js/theme.min.js', array( 'jquery' ), '0.0.1', true );
	}


	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', '_s_scripts' );
