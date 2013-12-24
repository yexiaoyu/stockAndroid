/**
 * Phonegap ClipboardManager plugin
 * Omer Saatcioglu 2011
 * Guillaume Charhon - Smart Mobile Software 2011
 */

var ClipboardManager = { 
	copy:function(str, success, fail) {
		cordova.exec(success, fail, "ClipboardManager", "copy", [str]);
	},
	paste:function(success, fail) {
		cordova.exec(success, fail, "ClipboardManager", "paste", []);
	}

}


