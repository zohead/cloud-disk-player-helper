// for normal file list page
if ($("#listHolder").length > 0) {
	$("#listHolder").bind("DOMSubtreeModified", function() {
		$("li[data-type='file'][data-file-suffix!='mp4']").filter("[data-file-suffix='mkv'],[data-file-suffix='rm'],[data-file-suffix='rmvb'],[data-file-suffix='avi'],[data-file-suffix='mpg'],[data-file-suffix='mpeg'],[data-file-suffix='wmv'],[data-file-suffix='mov'],[data-file-suffix='flv'],[data-file-suffix='f4v'],[data-file-suffix='3gp'],[data-file-suffix='3g2'],[data-file-suffix='3gp2'],[data-file-suffix='3gpp'],[data-file-suffix='vob'],[data-file-suffix='webm'],[data-file-suffix='ogv']").attr('data-file-suffix','mp4');
	});
}

// for videos catagory page
if ($("#cloudplayerhelper_vlist_func_script").length <= 0) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.id = 'cloudplayerhelper_vlist_func_script';
	script.innerHTML = "if (require('js/yunpan/lib/videoplayer/video') && require('js/yunpan/lib/videoplayer/video').isVideo) { require('js/yunpan/lib/videoplayer/video').isVideo = function(t) { return (t == 'mov' || t == 'mp4' || t == 'rmvb' || t == 'wmv' || t == 'rm' || t == 'mpg' || t == 'avi' || t == 'flv' || t == 'mpeg' || t == 'mkv' || t == 'webm' || t == 'f4v' || t == '3gp' || t == '3g2' || t == '3gp2' || t == '3gpp' || t == 'vob' || t == 'ogv'); }; }";
	document.head.appendChild(script);
}
