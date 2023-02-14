/**
 * 改自维基共享https://commons.wikimedia.org/wiki/MediaWiki:Gadget-ShortLink.js
 */

(function ($, mw) {
	'use strict';
	$(function () {
		mw.util.addPortletLink(
			'p-tb',
			'/?curid=' + mw.config.get('wgArticleId'),
			'短连接',
			't-shortlink',
			'',
			null,
			$('#t-info')
		);
	});
	if (mw.config.get("skin") == "citizen") {
		$('head').append('<style>#t-shortlink>a::before{display:block;width:20px;height:20px;background-position:center;background-repeat:no-repeat;background-size:contain;content:"";opacity:var(--opacity-icon-base);background-image:linear-gradient(transparent,transparent),url(/load.php?modules=skins.citizen.icons.wmui&image=link&format=original&skin=citizen&version=1rg65);}</style>')
	}
})(jQuery, mediaWiki);