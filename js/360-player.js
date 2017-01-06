var vxg_ext_id = "hncknjnnbahamgpjoafdebabmoamcnni";

function __vxg_play_video()
{
	var vxg_cloud_player = vxgplayer('cloudplayerhelper_360_vxg_player');
	if (!vxg_cloud_player)
		return;
	console.log("Cloud player loaded: vPLG=" + vxg_cloud_player.versionPLG() + " vAPP=" + vxg_cloud_player.versionAPP());
	$("#cloudplayerhelper_360_vxg_player").width("100%");
	$("#cloudplayerhelper_360_vxg_player").height("100%");
	if (vxg_cloud_player.isPlaying())
		vxg_cloud_player.stop();
	vxg_cloud_player.controls(true);
	// really show control bar
	if ($("#cloudplayerhelper_360_vxg_player > .vxgplayer-controls").length > 0)
		$("#cloudplayerhelper_360_vxg_player > .vxgplayer-controls").css("z-index", "1");
	vxg_cloud_player.src($("#cloudplayerhelper_360_vxg_player").attr("video_link"));
	vxg_cloud_player.play();
	return false;
}

function vxg_play_video(vlink)
{
	var init = 0;
	var replace_obj = null;
	var vxg_cloud_player = null;

	try {
		vxg_cloud_player = vxgplayer('cloudplayerhelper_360_vxg_player');
	} catch (e) {
	}

	// replace flash player with VXG player if needed
	if (vxg_cloud_player) {
	} else if ($("#StrobeMediaPlayback").length > 0)
		replace_obj = $("#StrobeMediaPlayback");
	else if ($("#main").length > 0)
		replace_obj = $("#main");

	if (replace_obj !== null) {
		// initial player width and height are only useful when return from full-screen
		var player_width = $("#main").outerWidth(true) - 30;
		var player_height = $("#main").outerHeight(true) - 20;
		replace_obj.replaceWith('<div class="vxgplayer" id="cloudplayerhelper_360_vxg_player" width="' + player_width + '" height="' + player_height + '"></div>');
		init = 1;
	} else {
		$("#cloudplayerhelper_360_vxg_player").width("100%");
		$("#cloudplayerhelper_360_vxg_player").height("100%");
	}
	$("#cloudplayerhelper_360_vxg_player").attr("video_link", vlink);

	try {
		if (!init)
			__vxg_play_video();
		else {
			vxgplayer("cloudplayerhelper_360_vxg_player", {
				url: '',
				nmf_path: 'media_player.nmf',
				nmf_src: chrome.extension.getURL("pnacl/Release/media_player.nmf"),
				latency: 300000,
				aspect_ratio_mode: 1,
				autohide: 3,
				controls: true,
				debug: true,
				avsync: true
			});
			setTimeout(function() {
				vxgplayer('cloudplayerhelper_360_vxg_player').onError(function(player){
					console.log("VXG error: " + player.error());
				});
				__vxg_play_video();
			}, 300);
		}
	} catch (e) {
		$("#vxg_install_span").css('display', '');
	}
	return false;
}

function vxg_pause()
{
	var vxg_cloud_player = vxgplayer('cloudplayerhelper_360_vxg_player');
	if (vxg_cloud_player) {
		if (vxg_cloud_player.isPlaying())
			vxg_cloud_player.pause();
		else
			vxg_cloud_player.play();
	}
}

$(document).bind('DOMNodeInserted', function(e) {
	if ($("#cloudplayerhelper_div").length > 0) return;
	$(document).unbind('DOMNodeInserted');

	$("div.dl_app").before('<div id="cloudplayerhelper_div" style="display:inline; padding-left:40px;"><img id="cloudplayerhelper_icon" style="width:48px; height:48px; vertical-align:middle;" src="' + chrome.extension.getURL("icons/48.png") + '"/><span style="display:inline-block; padding-left:10px; height:48px; vertical-align:middle;"><a id="cloudplayerhelper_m3u8_link" href="" style="color:#FFFFFF;">[' + chrome.i18n.getMessage("clouddiskplayer_transcode") + ']</a>&nbsp;&nbsp;&nbsp;<a id="cloudplayerhelper_org_link" href="" style="color:#FFFFFF;">[' + chrome.i18n.getMessage("clouddiskplayer_original") + ']</a><span id="vxg_install_span" style="display:none;">&nbsp;&nbsp;&nbsp;<font color="#FFFFFF">(' + chrome.i18n.getMessage("clouddiskplayer_install") + ' <a href="https://chrome.google.com/webstore/detail/' + vxg_ext_id + '" target="_blank" style="color:#970000;">VXG Media Player</a> ' + chrome.i18n.getMessage("clouddiskplayer_install2") + ')</font></span></span></div>');

	// fill real m3u8 and download links
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.setAttribute("id", "vxg_360_player_js");
	script.innerHTML = "function init_vxg() { if (typeof(SYS_CONF) == 'undefined') { if (document.getElementById('cloudplayerhelper_div')) { document.getElementById('cloudplayerhelper_div').style.display = 'none'; } return; } var fileExtension = SYS_CONF.name.split('.').pop().toLowerCase(); if (fileExtension != 'mp4' && fileExtension != 'flv' && fileExtension != 'f4v') { if (fileExtension == 'webm' || fileExtension == 'ogv') { SYS_CONF.name = SYS_CONF.name.replace(/\\.[^\\.]*$/, '.mp4'); } else { SYS_CONF.name = SYS_CONF.name.replace(/\\.[^\\.]*$/, '.flv'); } } if (SYS_CONF.m3u8Url) { document.getElementById('cloudplayerhelper_m3u8_link').href = SYS_CONF.m3u8Url; } else { document.getElementById('cloudplayerhelper_m3u8_link').style.display = 'none'; SYS_CONF.m3u8Url = (SYS_CONF.videoUrl ? SYS_CONF.videoUrl : SYS_CONF.downloadUrl); } if (SYS_CONF.videoUrl) { document.getElementById('cloudplayerhelper_org_link').href = SYS_CONF.videoUrl; } else { document.getElementById('cloudplayerhelper_org_link').style.display = 'none'; } } init_vxg();";
	document.head.appendChild(script);
	document.head.removeChild(script);

	$("#cloudplayerhelper_m3u8_link").click(function(e) {
		return vxg_play_video(this.href);
	});
	$("#cloudplayerhelper_org_link").click(function(e) {
		return vxg_play_video(this.href);
	});
	$("#cloudplayerhelper_icon").click(function(e) {
		return vxg_pause();
	});
});
