<?php

/**
 * Entry viewer shortcode
 *
 * @package Caldera_Forms
 * @author    Josh Pollock <Josh@CalderaWP.com>
 * @license   GPL-2.0+
 * @link
 * @copyright 2016 CalderaWP LLC
 */
class Caldera_Forms_Entry_Shortcode {

	/**
	 * Name of shortcode
	 *
	 * @since 1.5.0
	 *
	 * @var string
	 */
	protected static $name = 'caldera_forms_entry_viewer';

	/**
	 * Get shorcode name
	 *
	 * @since 1.5.0
	 *
	 * @return string
	 */
	public static function get_shortcode_name(){
		return self::$name;
	}

	/**
	 * Callback for shortcode
	 *
	 * @since 1.5.0
	 *
	 * @param array $atts Shortcode atts
	 *
	 * @return string
	 */
	public static function shortcode_callback( $atts ){
		$atts = shortcode_atts( array(
			'id' => strip_tags( ! isset( $_GET[ 'cf_id' ] ) ? null : $_GET[ 'cf_id' ] ),
			'version' => '2',
			'with_toolbar' => false,
			'role' => 'admin'
		), $atts, self::$name );

		$form = Caldera_Forms_Forms::get_form( $atts[ 'id' ] );
		if ( ! empty( $form ) ) {
			if ( '2' == $atts[ 'version' ] ) {

				return Caldera_Forms_Entry_Viewer::form_entry_viewer_2( $form, array( 'token' => Caldera_Forms_API_Token::make_token( $atts[ 'role' ], $atts[ 'id' ] ) ) );
			}else{
				return Caldera_Forms_Entry_Viewer::form_entry_viewer_1( $atts[ 'id' ], wp_validate_boolean( $atts[ 'with_toolbar' ] ) );

			}

		}
	}

}