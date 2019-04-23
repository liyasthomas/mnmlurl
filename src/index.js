const erbox = document.getElementById("erbox");
const custominput = document.getElementById("custominput");
const output = document.getElementById("output");
const rotate = document.getElementById("rotate");
const status = document.getElementById("status");
const alias = document.getElementById("alias");
const sucess = document.getElementById("sucess");
const shortenedURL = document.getElementById("shortenedURL");
const sbtn = document.getElementById("sbtn");
let pushJSON = (url, data) => {
	let request = new XMLHttpRequest();
	request.open('POST', url);
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	request.send(JSON.stringify(data));
};
let cinp = () => {
	erbox.innerHTML = "";
	let cival = custominput.value;
	let res = JSON.parse(fetchJSON(`${endpoint}/${cival}`));
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
	if (custominput.value == "") {
		window.location.hash = getrandom();
		check_is_unique();
	} else {
		window.location.hash = custominput.value;
	}
};
let check_is_unique = () => {
	let url = window.location.hash.substr(1);
	let res = JSON.parse(fetchJSON(`${endpoint}/${url}`));
	let data = res.result;
	if (data != null) {
		genhash();
	}
};
let copyer = (containerid) => {
	let elt = document.getElementById(containerid);
	if (document.selection) { // IE
		if (elt.nodeName.toLowerCase() === "input") {
			elt.select();
			document.execCommand("copy");
		} else {
			let range = document.body.createTextRange();
			range.moveToElementText(elt);
			range.select();
			document.execCommand("copy");
		}
	} else if (window.getSelection) {
		if (elt.nodeName.toLowerCase() === "input") {
			elt.select();
			document.execCommand("copy");
		} else {
			let range_ = document.createRange();
			range_.selectNode(elt);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range_);
			document.execCommand("copy");
		}
	}
};
let send_request = (url) => {
	let myurl = url;
	let address = `${endpoint}/${window.location.hash.substr(1)}`;
	// console.log(address)
	pushJSON(address, myurl);
	output.style.display = "block";
	shortenedURL.value = window.location.href;
	copyer("shortenedURL");
	sucess.innerHTML = "Short url copied to clipboard 🚀";
	rotate.classList.remove("spinning");
	rotate.style.display = "none";
	status.innerHTML = "Shorten";
};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
let shorturl = async () => {
	erbox.innerHTML = "";
	sucess.innerHTML = "";
	rotate.style.display = "inline-block";
	rotate.setAttribute("class", "spinning");
	status.innerHTML = "";
	output.style.display = "none";
	await sleep(1000);
	let longurl = geturl();
	let re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
	let cre = /^([a-zA-Z0-9 _-]+)$/;
	let protocol_ok = re.test(longurl);
	if (!protocol_ok) {
		erbox.innerHTML = "Invalid url 😒";
		rotate.classList.remove("spinning");
		rotate.style.display = "none";
		status.innerHTML = "Shorten";
		sucess.innerHTML = "";
		output.style.display = "none";
	} else {
		erbox.innerHTML = "";
		if (custominput.value == "") {
			genhash();
			send_request(longurl);
			alias.innerHTML = "Shortened 🎉";
		} else {
			if (cre.test(custominput.value)) {
				if (cinp()) {
					alias.innerHTML = "Alias available ✨";
					rotate.classList.remove("spinning");
					rotate.style.display = "none";
					status.innerHTML = "Shorten";
					genhash();
					send_request(longurl);
				} else {
					erbox.innerHTML = "😒 Alias already in use, choose another";
					custominput.placeholder = custominput.value;
					custominput.value = "";
					rotate.classList.remove("spinning");
					rotate.style.display = "none";
					status.innerHTML = "Shorten";
					sucess.innerHTML = "";
					output.style.display = "none";
				}
			} else {
				erbox.innerHTML = "😮 Invalid custom alias, use only alphanumerics & underscore";
				custominput.placeholder = custominput.value;
				custominput.value = "";
				rotate.classList.remove("spinning");
				rotate.style.display = "none";
				status.innerHTML = "Shorten";
				sucess.innerHTML = "";
				output.style.display = "none";
			}
		}
	}
};
sbtn.addEventListener("click", shorturl);
//fetch(endpoint + "/key", {
//	method: 'DELETE',
//});
//let r = JSON.parse(fetchJSON(endpoint)).result;
//document.getElementById("count").innerHTML = Object.keys(r).length + " urls minimalized";
