"use strict";
(function () {
	// Global variables
	var userAgent = navigator.userAgent.toLowerCase(),
			initialDate = new Date(),

			$document = $(document),
			$window = $(window),
			$html = $("html"),
			$body = $("body"),

			isDesktop = $html.hasClass("desktop"),
			isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			windowReady = false,
			isNoviBuilder = false,
			pageTransitionDuration = 500,

			plugins = {
				bootstrapTooltip: $("[data-toggle='tooltip']"),
				bootstrapTabs: $('.tabs-custom'),
				counter: $(".counter"),
				captcha: $('.recaptcha'),
				campaignMonitor: $('.campaign-mailform'),
				copyrightYear: $(".copyright-year"),
				isotope: $(".isotope"),
				materialParallax: $(".parallax-container"),
				mailchimp: $('.mailchimp-mailform'),
				owl: $(".owl-carousel"),
				preloader: $(".preloader"),
				rdNavbar: $(".rd-navbar"),
				maps: $(".google-map-container"),
				rdMailForm: $(".rd-mailform"),
				rdInputLabel: $(".form-label"),
				regula: $("[data-constraints]"),

				wow: $(".wow"),

				buttonWinona: $('.button-winona'),

				animePresets: document.querySelectorAll('[data-anime]'),
				navbar: document.querySelectorAll('.navbar'),
			};

	/**
	 * @desc Calls a function when element has been scrolled into the view
	 * @param {object} element - jQuery object
	 * @param {function} func - init function
	 */
	function lazyInit(element, func) {
		var scrollHandler = function () {
			if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
				func.call();
				element.addClass('lazy-loaded');
			}
		};

		scrollHandler();
		$window.on('scroll', scrollHandler);
	}

	// Initialize scripts that require a loaded page
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target: document.querySelector('.page'),
				delay: 0,
				duration: pageTransitionDuration,
				classIn: 'fadeIn',
				classOut: 'fadeOut',
				classActive: 'animated',
				conditions: function (event, link) {
					return !/(\#|callto:|tel:|mailto:|:\/\/)/.test(link)
							&& !event.currentTarget.hasAttribute('data-lightgallery');
				},
				onTransitionStart: function (options) {
					setTimeout(function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75);
				},
				onReady: function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
				isNoviBuilder = window.xMode;

				/**
				 * @desc Initialize owl carousel plugin
				 * @param {object} c - carousel jQuery object
				 */
				function initOwlCarousel(c) {
					var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
							values = [0, 576, 768, 992, 1200, 1600],
							responsive = {};

					for (var j = 0; j < values.length; j++) {
						responsive[values[j]] = {};
						for (var k = j; k >= -1; k--) {
							if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
								responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
							}
							if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
								responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
							}
							if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
								responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
							}
							if (!responsive[values[j]]["autoWidth"] && responsive[values[j]]["autoWidth"] !== 0 && c.attr("data" + aliaces[k] + "auto-width")) {
								responsive[values[j]]["autoWidth"] = k < 0 ? false : c.attr("data" + aliaces[k] + "auto-width");
							}
						}
					}

				

					// Create custom Numbering
					if (typeof (c.attr("data-numbering")) !== 'undefined') {
						var numberingObject = $(c.attr("data-numbering"));

						c.on('initialized.owl.carousel changed.owl.carousel', function (numberingObject) {
							return function (e) {
								if (!e.namespace) return;
								numberingObject.find('.numbering-current').text(e.item.index + 1);
								numberingObject.find('.numbering-count').text(e.item.count);
							};
						}(numberingObject));
					}

					if (typeof (c.attr("data-custom-next")) !== 'undefined') {
						var customNext = $(c.attr("data-custom-next"));

						customNext.on('click', function (customNext, c) {
							return function () {
								c.trigger('next.owl.carousel');
							};
						}(customNext, c));
					}

				
				}

				/**
				 * @desc Check the element whas been scrolled into the view
				 * @param {object} elem - jQuery object
				 * @return {boolean}
				 */
				function isScrolledIntoView(elem) {
					if (!isNoviBuilder) {
						return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
					} else {
						return true;
					}
				}

				/**
				 * @desc Calls a function when element has been scrolled into the view
				 * @param {object} element - jQuery object
				 * @param {function} func - callback function
				 */
				function lazyInit(element, func) {
					var handler = function () {
						if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
							func.call();
							element.addClass('lazy-loaded');
						}
					};

					handler();
					$window.on('scroll', handler);
				}

				// applyAnimation
				function applyAnimation(target, params) {
					var defaultParams = merge({
						targets: '.anime-element',
						duration: 800,
						easing: 'easeInOutQuad',
						loop: false,
						direction: 'alternate'
					}, params.options);

					var animeObj = anime(defaultParams);

					function start() {
						if (animeObj) animeObj.pause();
						animeObj = anime(merge(
								defaultParams,
								params.animationStart
						));
					}

					function end() {
						if (animeObj) animeObj.pause();
						animeObj = anime(merge(
								defaultParams,
								params.animationEnd
						));
					}

					target.addEventListener('mouseenter', function () {
						start();
					});

					target.addEventListener('mouseleave', function () {
						end();
					});
				}

				function merge(target, sources) {
					if (!target || typeof target !== 'object') {
						throw new TypeError('First argument must be passed and be an object.');
					}

					var result = Object(target);

					for (var i = 1; i < arguments.length; i++) {
						var source = arguments[i];

						//null and undefined
						if (source == null) {
							continue;
						}

						for (var key in source) {
							//null and undefined
							if (source[key] == null) {
								continue;
							}

							//Merge objects in object
							if (source[key] && target[key] && typeof source[key] === 'object' && typeof target[key] === 'object') {
								merge(target[key], source[key]);
								continue;
							}

							target[key] = source[key];
						}
					}

					return result;
				}

				// Additional class on html if mac os.
				if (navigator.platform.match(/(Mac)/i)) {
					$html.addClass("mac-os");
				}

				// Adds some loosing functionality to IE browsers (IE Polyfills)
				if (isIE) {
					if (isIE === 12) $html.addClass("ie-edge");
					if (isIE === 11) $html.addClass("ie-11");
					if (isIE < 10) $html.addClass("lt-ie-10");
					if (isIE < 11) $html.addClass("ie-10");
				}

				
				// Copyright Year (Evaluates correct copyright year)
				if (plugins.copyrightYear.length) {
					plugins.copyrightYear.text(initialDate.getFullYear());
				}

				// Bootstrap tabs
				if (plugins.bootstrapTabs.length) {
					var MILLISECONDS_MULTIPLIER = 1000;
					for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
						var $bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

						// Nav plugin
						if ($bootstrapTabsItem.attr('data-transition-state') === 'true') {
							$bootstrapTabsItem.on('hide.bs.tab', function (event) {
								document.querySelectorAll(event.target.getAttribute('href'))[0].classList.add('hiding');
							});
							$bootstrapTabsItem.on('hidden.bs.tab', function (event) {
								var target = document.querySelectorAll(event.target.getAttribute('href'))[0],
										timeout = parseFloat(window.getComputedStyle(target).getPropertyValue('animation-duration')) * MILLISECONDS_MULTIPLIER;
								setTimeout(function () {
									target.classList.remove('hiding');
								}, timeout);
							});
							$bootstrapTabsItem.on('show.bs.tab', function (event) {
								document.querySelectorAll(event.target.getAttribute('href'))[0].classList.add('showing');
							});
							$bootstrapTabsItem.on('shown.bs.tab', function (event) {
								var target = document.querySelectorAll(event.target.getAttribute('href'))[0],
										timeout = parseFloat(window.getComputedStyle(target).getPropertyValue('animation-duration')) * MILLISECONDS_MULTIPLIER;
								setTimeout(function () {
									target.classList.remove('showing');
								}, timeout);
							});
						}
					}
				}

				
				// UI To Top
				if (isDesktop && !isNoviBuilder) {
					$().UItoTop({
						easingType: 'easeOutQuad',
						containerClass: 'ui-to-top mdi mdi-chevron-up'
					});
				}

				// RD Navbar
				if (plugins.rdNavbar.length) {
					var aliaces, i, j, len, value, values;

					aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
					values = [0, 576, 768, 992, 1200, 1600];

					for (var z = 0; z < plugins.rdNavbar.length; z++) {
						var $rdNavbar = $(plugins.rdNavbar[z]),
								responsiveNavbar = {};

						for (i = j = 0, len = values.length; j < len; i = ++j) {
							value = values[i];
							if (!responsiveNavbar[values[i]]) {
								responsiveNavbar[values[i]] = {};
							}
							if ($rdNavbar.attr('data' + aliaces[i] + 'layout')) {
								responsiveNavbar[values[i]].layout = $rdNavbar.attr('data' + aliaces[i] + 'layout');
							}
							if ($rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
								responsiveNavbar[values[i]]['deviceLayout'] = $rdNavbar.attr('data' + aliaces[i] + 'device-layout');
							}
							if ($rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
								responsiveNavbar[values[i]]['focusOnHover'] = $rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
							}
							if ($rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
								responsiveNavbar[values[i]]['autoHeight'] = $rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
							}

							if ($rdNavbar.attr('data' + aliaces[i] + 'anchor-nav-offset')) {
								responsiveNavbar[values[i]]['anchorNavOffset'] = $rdNavbar.attr('data' + aliaces[i] + 'anchor-nav-offset');
							}

							if (isNoviBuilder) {
								responsiveNavbar[values[i]]['stickUp'] = false;
							} else if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
								var isDemoNavbar = $rdNavbar.parents('.layout-navbar-demo').length;
								responsiveNavbar[values[i]]['stickUp'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true' && !isDemoNavbar;
							}

							if ($rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
								responsiveNavbar[values[i]]['stickUpOffset'] = $rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
							}
						}


						$rdNavbar.RDNavbar({
							anchorNav: !isNoviBuilder,
							stickUpClone: ($rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? $rdNavbar.attr("data-stick-up-clone") === 'true' : false,
							responsive: responsiveNavbar
						});


						if ($rdNavbar.attr("data-body-class")) {
							document.body.className += ' ' + $rdNavbar.attr("data-body-class");
						}

					}
				}

				

				// Winona buttons
				if (plugins.buttonWinona.length && !isNoviBuilder && !isIE) {
					initWinonaButtons(plugins.buttonWinona);
				}

				function initWinonaButtons(buttons) {
					for (var i = 0; i < buttons.length; i++) {
						var $button = $(buttons[i]),
								innerContent = $button.html();

						$button.html('');
						$button.append(
								'<div class="content-original">' + innerContent + '</div>'
								+ '<div class="content-dubbed">' + innerContent + '</div>');
					}
				}

				// Navbar-related functions
				function updAnchOffset() {
					var
							relatives = document.querySelectorAll(this.dParams.anchor.offsetRef),
							dY = 0;

					for (var j = 0; j < relatives.length; j++) {
						dY -= relatives[j].offsetHeight;
					}

					this.dParams.anchor.offset = dY * 1.05;
				}

				function updStuckOffset() {
					this.dParams.stuck.offset = document.querySelector(this.dParams.stuck.offsetRef).getBoundingClientRect().height;
				}

				function isInView(node) {
					var rect = node.getBoundingClientRect();
					return (
							rect.top >= 0 &&
							rect.left >= 0 &&
							rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
							rect.right <= (window.innerWidth || document.documentElement.clientWidth)
					);
				}

				// Navbar
				if (plugins.navbar.length && !isNoviBuilder) {
					for (var i = 0; i < plugins.navbar.length; i++) {
						var
								navbar,
								node = plugins.navbar[i],
								options = JSON.parse(node.getAttribute('data-navbar'));


						// Плавная прокрутка окна с использованием jQuery
						if (options.anchor !== false) {
							if (!options.anchor) options.anchor = {};

							options.anchor.clickCb = function () {
								var
										target = $(this.anchor),
										top = target.offset().top,
										offset = this.ref.dParams.anchor.offset;

								$('html, body').stop().animate({
									scrollTop: top + offset + 1
								}, 500, 'swing');
							};
						}

						navbar = new Navbar(node, options);


						// Инициализация и обработка кастомных параметров
						if (options.stuck !== false && options.stuck && options.stuck.offsetRef) {
							updStuckOffset.call(navbar);
							window.addEventListener('scroll', updStuckOffset.bind(navbar));
							window.addEventListener('resize', updStuckOffset.bind(navbar));
						}

						if (options.anchor !== false && options.anchor && options.anchor.offsetRef) {
							updAnchOffset.call(navbar);
							window.addEventListener('scroll', updAnchOffset.bind(navbar));
							window.addEventListener('resize', updAnchOffset.bind(navbar));
						}

						// Плавная гризонтальная прокрутка навигации
						node.addEventListener('anchorchange', function () {
							if (this.currentAnchor && !isInView(this.currentAnchor)) {
								var
										nav = $(this.node).find('.navigation'),
										offset = $(this.currentAnchor).parent().offset().left + nav.scrollLeft();

								nav.stop().animate({
									scrollLeft: offset
								}, 400, 'swing');
							}
						}.bind(navbar));
					}
				}

			}
	);
}());


