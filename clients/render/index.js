/** globals CF_API_DATA **/
import './index.scss';
import {CalderaFormsRender} from "./components/CalderaFormsRender";

import React from 'react';
import ReactDOM from "react-dom";
import domReady from '@wordpress/dom-ready';

const CryptoJS = require("crypto-js");
Object.defineProperty(global.wp, 'element', {
	get: () => React
});


domReady(function () {
	jQuery(document).on('cf.form.init', (e, obj) => {
		const {
			state,//CF state instance
			formId, //Form's ID
			idAttr, //Form element id attribute,
			//$form, //Form jQuery object
		} = obj;
		const fieldsToControl = [];


		//Build configurations
		document.querySelectorAll('.cf2-field-wrapper').forEach(function (fieldElement) {
			const fieldIdAttr = fieldElement.getAttribute('data-field-id');

			const formConfig = window.cf2[idAttr];

			let fieldConfig = formConfig.fields.hasOwnProperty(fieldIdAttr) ?
				formConfig.fields[fieldIdAttr]
				: null;

			if ('string' === typeof  fieldConfig) {
				fieldConfig = JSON.parse(fieldConfig);
			}
			if (fieldConfig) {
				fieldsToControl.push(fieldConfig);
				if (fieldConfig.hasOwnProperty('fieldDefault')) {
					state.mutateState(fieldIdAttr, fieldConfig.fieldDefault);

				}
			}
		});

		/**
		 * Flag to indicate if validation is happening or not
		 *
		 * This is controlled outside of React so that CF1 can trigger validation
		 *
		 * @since 1.8.0
		 *
		 * @type {boolean}
		 */
		let shouldBeValidating = false;


		const API_FOR_FILES_URL = CF_API_DATA.rest.fileUpload;
		const _wp_nonce = CF_API_DATA.rest.nonce;

		function createMediaFromFile(file, additionalData) {
			// Create upload payload
			const data = new window.FormData();
			data.append('file', file, file.name || file.type.replace('/', '.'));
			data.append('title', file.name ? file.name.replace(/\.[^.]+$/, '') : file.type.replace('/', '.'));
			Object.keys(additionalData)
				.forEach(key => data.append(key, additionalData[key]));

			return fetch(API_FOR_FILES_URL, {
				body: data,
				method: 'POST',
				headers: {
					'X-WP-Nonce': _wp_nonce
				}
			});


		}


		jQuery(document).on('cf.form.request', (event, obj) => {
			const values = theComponent.getFieldValues();
			const cf2 = window.cf2[obj.formIdAttr];
			if ('object' !== typeof cf2) {
				return;
			}

			cf2.pending = cf2.pending || [];
			cf2.uploadStated = cf2.uploadStated || [];

			if (Object.keys(values).length) {
				Object.keys(values).forEach(fieldId => {
					const field = fieldsToControl.find(field => fieldId === field.fieldId);
					if (field) {
						if ('file' === field.type) {
							if( -1 <= cf2.uploadStated ){
								cf2.uploadStated.push(fieldId);
								obj.$form.data(fieldId, field.control);
								cf2.pending.push(fieldId);
								const verify = jQuery(`#_cf_verify_${field.formId}`).val();
								const binaries = [];
								const files = [values[fieldId]];
								files.forEach(file => {
										createMediaFromFile(file[0], {
											hashes: ['hi-roy'],
											verify,
											formId: field.formId,
											fieldId: field.fieldId,
											control: field.control,
											_wp_nonce
										}).then(
											response => response.json()
										).then(
											success => {
												const index = cf2.pending.findIndex(item => item === fieldId);
												if (-1 < index) {
													cf2.pending.splice(index, 1);
												}
												obj.$form.submit();
											}
										).catch(
											error => console.log(error)
										)
									}
								);
							}



						}
					}
				});
			} else {
				obj.$form.data(fieldId, values[fieldId]);
			}

		});
		/**
		 * Ref for rendered app
		 *
		 * @see https://reactjs.org/docs/refs-and-the-dom.html
		 *
		 * @since 1.8.0
		 * @type {*}
		 */
		let theComponent = '';
		ReactDOM.render(
			<CalderaFormsRender
				cfState={state}
				formId={formId}
				formIdAttr={idAttr}
				fieldsToControl={fieldsToControl}
				shouldBeValidating={shouldBeValidating}
				ref={(component) => {
					theComponent = component
				}}
			/>,
			document.getElementById(`cf2-${idAttr}`)
		);

	});

});


