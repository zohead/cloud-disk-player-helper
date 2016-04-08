var vxg_ext_id = "hncknjnnbahamgpjoafdebabmoamcnni";

function vxg_play_video(vlink)
{
	var init = 0;
	// replace flash player with VXG player if needed
	if ($("#StrobeMediaPlayback").length > 0) {
		// initial player width and height are only useful when return from full-screen
		var player_width = $("#main").outerWidth(true) - 30;
		var player_height = $("#main").outerHeight(true) - 20;
		$("#StrobeMediaPlayback").replaceWith('<div class="vxgplayer" id="cloudplayerhelper_360_vxg_player" width="' + player_width + '" height="' + player_height + '" url="' + vlink + '" nmf-src="' + chrome.extension.getURL("pnacl/Release/media_player.nmf") + '" aspect-ratio latency="3000000" autostart controls avsync></div>');
		init = 1;
	} else {
		$("#cloudplayerhelper_360_vxg_player").width("100%");
		$("#cloudplayerhelper_360_vxg_player").height("100%");
	}

	var vxg_cloud_player = vxgplayer('cloudplayerhelper_360_vxg_player');
	if (vxg_cloud_player) {
		if (init) {
			vxg_cloud_player.onReadyStateChange(function(state){
				console.log("Cloud player loaded: vPLG=" + vxg_cloud_player.versionPLG()+" vAPP="+vxg_cloud_player.versionAPP());
				$("#cloudplayerhelper_360_vxg_player").width("100%");
				$("#cloudplayerhelper_360_vxg_player").height("100%");
				vxg_cloud_player.controls(true);
				// really show control bar
				if ($("#cloudplayerhelper_360_vxg_player > .vxgplayer-controls").length > 0)
					$("#cloudplayerhelper_360_vxg_player > .vxgplayer-controls").css("z-index", "1");
			});
		} else {
			if (vxg_cloud_player.isPlaying())
				vxg_cloud_player.stop();
			vxg_cloud_player.src(vlink);
			vxg_cloud_player.play();
		}
	} else
		$("#vxg_install_span").css('display', '');
	return false;
}

$(document).bind('DOMNodeInserted', function(e) {
	if ($("#cloudplayerhelper_div").length <= 0) {
		$("div.dl_app").before('<div id="cloudplayerhelper_div" style="display:inline; padding-left:40px;"><img id="cloudplayerhelper_icon" style="width:48px; height:48px; vertical-align:middle;" src="' + chrome.extension.getURL("icons/48.png") + '"/><span style="display:inline-block; padding-left:10px; height:48px; vertical-align:middle;"><a id="cloudplayerhelper_m3u8_link" href="" style="color:#FFFFFF;">[' + chrome.i18n.getMessage("clouddiskplayer_transcode") + ']</a>&nbsp;&nbsp;&nbsp;<a id="cloudplayerhelper_org_link" href="" style="color:#FFFFFF;">[' + chrome.i18n.getMessage("clouddiskplayer_original") + ']</a><span id="vxg_install_span" style="display:none;">&nbsp;&nbsp;&nbsp;<font color="#FFFFFF">(' + chrome.i18n.getMessage("clouddiskplayer_install") + ' <a href="https://chrome.google.com/webstore/detail/' + vxg_ext_id + '" target="_blank" style="color:#970000;">VXG Media Player</a> ' + chrome.i18n.getMessage("clouddiskplayer_install2") + ')</font></span></span></div>');

		// fill real m3u8 and download links
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerHTML = "if (SYS_CONF.m3u8Url) { document.getElementById('cloudplayerhelper_m3u8_link').href = SYS_CONF.m3u8Url; } else { document.getElementById('cloudplayerhelper_m3u8_link').style.display = 'none'; } if (SYS_CONF.videoUrl) { document.getElementById('cloudplayerhelper_org_link').href = SYS_CONF.videoUrl; } else { document.getElementById('cloudplayerhelper_org_link').style.display = 'none'; }";
		document.head.appendChild(script);
		document.head.removeChild(script);

		$("#cloudplayerhelper_m3u8_link").click(function(e) {
			return vxg_play_video(this.href);
		});
		$("#cloudplayerhelper_org_link").click(function(e) {
			return vxg_play_video(this.href);
		});
	}
});
