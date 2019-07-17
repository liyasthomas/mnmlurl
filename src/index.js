const erbox = document.getElementById('erbox')
const custominput = document.getElementById('custominput')
const output = document.getElementById('output')
const status = document.getElementById('status')
const alias = document.getElementById('alias')
const sucess = document.getElementById('sucess')
const shortenedURL = document.getElementById('shortenedURL')
const sbtn = document.getElementById('sbtn')
const dbtn = document.getElementById('dbtn')
const pushJSON = (url, data) => {
	const request = new XMLHttpRequest()
	request.open('POST', url)
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
	request.send(JSON.stringify(data))
}
const cinp = () => {
	erbox.innerHTML = ''
	erbox.style.display = 'none'
	const cival = custominput.value
	const res = JSON.parse(fetchJSON(`${endpoint}/${cival}`))
	const data = res.result
	if (data != null) {
		return false
	} else if (data == null) {
		return true
	}
}
const geturl = () => {
	const url = document.getElementById('urlinput').value
	return url
}
const getrandom = () => {
	let text = ''
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return text
}
const genhash = () => {
	if (custominput.value == '') {
		window.location.hash = getrandom()
		check_is_unique()
	} else {
		window.location.hash = custominput.value
	}
}
const check_is_unique = () => {
	const url = window.location.hash.substr(1)
	const res = JSON.parse(fetchJSON(`${endpoint}/${url}`))
	const data = res.result
	if (data != null) {
		genhash()
	}
}
const copyer = (containerid) => {
	const elt = document.getElementById(containerid)
	if (document.selection) { // IE
		if (elt.nodeName.toLowerCase() === 'input') {
			elt.select()
			document.execCommand('copy')
		} else {
			const range = document.body.createTextRange()
			range.moveToElementText(elt)
			range.select()
			document.execCommand('copy')
		}
	} else if (window.getSelection) {
		if (elt.nodeName.toLowerCase() === 'input') {
			elt.select()
			document.execCommand('copy')
		} else {
			const range_ = document.createRange()
			range_.selectNode(elt)
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range_)
			document.execCommand('copy')
		}
	}
}
const send_request = (url) => {
	const myurl = url
	const address = `${endpoint}/${window.location.hash.substr(1)}`
	pushJSON(address, myurl)
	output.style.display = 'block'
	shortenedURL.value = window.location.href
	copyer('shortenedURL')
	sucess.innerHTML = 'short url copied to clipboard'
	status.innerHTML = 'shorten'
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const shorturl = async () => {
	erbox.innerHTML = ''
	erbox.style.display = 'none'
	sucess.innerHTML = ''
	status.innerHTML = 'shortening...'
	output.style.display = 'none'
	await sleep(500)
	const longurl = geturl()
	const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
	const cre = /^([a-zA-Z0-9 _-]+)$/
	const protocol_ok = re.test(longurl)
	if (!protocol_ok) {
		erbox.style.display = 'block'
		erbox.innerHTML = 'invalid url'
		status.innerHTML = 'shorten'
		sucess.innerHTML = ''
		output.style.display = 'none'
	} else {
		erbox.style.display = 'block'
		erbox.innerHTML = ''
		if (custominput.value == '') {
			genhash()
			send_request(longurl)
			alias.innerHTML = 'shortened'
		} else {
			if (cre.test(custominput.value)) {
				if (cinp()) {
					alias.innerHTML = 'alias available'
					status.innerHTML = 'shorten'
					genhash()
					send_request(longurl)
				} else {
					erbox.style.display = 'block'
					erbox.innerHTML = 'alias already in use, choose another'
					custominput.placeholder = custominput.value
					custominput.value = ''
					status.innerHTML = 'shorten'
					sucess.innerHTML = ''
					output.style.display = 'none'
				}
			} else {
				erbox.style.display = 'block'
				erbox.innerHTML = 'invalid custom alias, use only alphanumerics & underscore'
				custominput.placeholder = custominput.value
				custominput.value = ''
				status.innerHTML = 'shorten'
				sucess.innerHTML = ''
				output.style.display = 'none'
			}
		}
	}
}
sbtn.addEventListener('click', shorturl)
const getkey = () => {
	const key = document.getElementById('key').value
	return key
}
const delKey = (key) => {
	fetch(`${endpoint}/${key}`, {
		method: 'DELETE'
	})
	status.innerHTML = 'delete'
	output.style.display = 'block'
	alias.innerHTML = 'deleted'
}
const deleteurl = async () => {
	erbox.innerHTML = ''
	erbox.style.display = 'none'
	sucess.innerHTML = ''
	status.innerHTML = 'deleting...'
	output.style.display = 'none'
	await sleep(500)
	const key = getkey()
	console.log(key)
	delKey(key)
}
dbtn.addEventListener('click', deleteurl)
// let r = JSON.parse(fetchJSON(endpoint)).result;
// document.getElementById("count").innerHTML = Object.keys(r).length + " urls minimalized";
