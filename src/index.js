let emojis = ['🙈', '👽', '💩', '✨', '🌟', '💫', '💦', '💖', '💎', '🌈', '🎉', '🔮', ];
let randomItem = emojis[Math.floor(Math.random() * emojis.length)];
document.getElementById("emoji").innerHTML = randomItem;
let pushJSON = (url, data) => {
	let request = new XMLHttpRequest();
	request.open('POST', url);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	request.send(JSON.stringify(data));
};
let cinp = () => {
	document.getElementById("erbox").innerHTML = "";
	let cival = document.getElementById("custominput").value;
	let res = JSON.parse(fetchJSON(endpoint + '/' + cival));
	let data = res.result;
	if (data != null) {
		return false;
	} else if (data == null) {
		return true;
	}
};
let geturl = () => {
	let url = document.getElementById("urlinput").value;
	return url;
};
let getrandom = () => {
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
};
let genhash = () => {
	if (document.getElementById("custominput").value == "") {
		window.location.hash = getrandom();
		check_is_unique();
	} else {
		window.location.hash = document.getElementById("custominput").value;
	}
};
let check_is_unique = () => {
	let url = window.location.hash.substr(1);
	let res = JSON.parse(fetchJSON(endpoint + '/' + url));
	let data = res.result;
	if (data != null) {
		genhash();
	}
};
let copyer = (containerid) => {
	let elt = document.getElementById(containerid);
	if (document.selection) { // IE
		if (elt.nodeName.toLowerCase() === "input") {
			document.getElementById(containerid).select();
			document.execCommand("copy");
		} else {
			let range = document.body.createTextRange();
			range.moveToElementText(document.getElementById(containerid));
			range.select();
			document.execCommand("copy");
		}
	} else if (window.getSelection) {
		if (elt.nodeName.toLowerCase() === "input") {
			document.getElementById(containerid).select();
			document.execCommand("copy");
		} else {
			let range_ = document.createRange();
			range_.selectNode(document.getElementById(containerid));
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range_);
			document.execCommand("copy");
		}
	}
};
let send_request = (url) => {
	let myurl = url;
	let address = endpoint + "/" + window.location.hash.substr(1);
	// console.log(address)
	pushJSON(address, myurl);
	document.getElementById('shortenedURL').value = window.location.href;
	document.getElementById('sucess').innerHTML = "short url copied to clipboard 🚀";
	copyer("shortenedURL");
	document.getElementById("rotate").classList.remove("spinning");
	document.getElementById("status").innerHTML = "shorten";
};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
let shorturl = async () => {
	document.getElementById("erbox").innerHTML = "";
	document.getElementById("sucess").innerHTML = "";
	document.getElementById("rotate").setAttribute("class", "spinning");
	document.getElementById("status").innerHTML = "shortning...";
	await sleep(1000);
	let longurl = geturl();
	let re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
	let cre = /^([a-zA-Z0-9 _-]+)$/;
	let protocol_ok = re.test(longurl);
	if (!protocol_ok) {
		document.getElementById("erbox").style.color = "red";
		document.getElementById("erbox").innerHTML = "❌ invalid url";
		document.getElementById("rotate").classList.remove("spinning");
		document.getElementById("status").innerHTML = "shorten";
	} else {
		document.getElementById("erbox").innerHTML = "";
		if (document.getElementById("custominput").value == "") {
			genhash();
			send_request(longurl);
		} else {
			if (cre.test(document.getElementById("custominput").value)) {
				if (cinp()) {
					document.getElementById("erbox").style.color = "limegreen";
					document.getElementById("erbox").innerHTML = "custom url available ✔️";
					document.getElementById("rotate").classList.remove("spinning");
					document.getElementById("status").innerHTML = "shorten";
					genhash();
					send_request(longurl);
				} else {
					document.getElementById("erbox").style.color = "red";
					document.getElementById("erbox").innerHTML = "❌ custom url already used, choose another";
					document.getElementById("custominput").placeholder = document.getElementById("custominput").value;
					document.getElementById("custominput").value = "";
					document.getElementById("rotate").classList.remove("spinning");
					document.getElementById("status").innerHTML = "shorten";
				}
			} else {
				document.getElementById("erbox").style.color = "red";
				document.getElementById("erbox").innerHTML = "❌ invalid custom url, use only alphanumerics & underscore";
				document.getElementById("custominput").placeholder = document.getElementById("custominput").value;
				document.getElementById("custominput").value = "";
				document.getElementById("rotate").classList.remove("spinning");
				document.getElementById("status").innerHTML = "shorten";
			}
		}
	}
};
document.getElementById("sbtn").addEventListener("click", shorturl);
