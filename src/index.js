const urlinput = document.getElementById('urlinput')
const custominput = document.getElementById('custominput')
const sbtn = document.getElementById('sbtn')
const status = document.getElementById('status')
const erbox = document.getElementById('erbox')
const output = document.getElementById('output')
const alias = document.getElementById('alias')
const shortenedURL = document.getElementById('shortenedURL')
const sucess = document.getElementById('sucess')
const qr = document.getElementById('qr')
const pushJSON = (url, data) => {
	const request = new XMLHttpRequest()
	request.open('POST', url, true)
	request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
	request.send(JSON.stringify(data))
}
const cinp = () => {
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
	const url = urlinput.value
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
const createFrame = src => `<a href='${src}' target='_blank'><img src='${src}' alt='QR code'></a>`
const send_request = (url) => {
	const myurl = url
	const address = `${endpoint}/${window.location.hash.substr(1)}`
	pushJSON(address, myurl)
	urlinput.value = ''
	custominput.value = ''
	status.innerHTML = 'shorten'
	output.style.display = 'block'
	shortenedURL.value = window.location.href
	copyer('shortenedURL')
	sucess.innerHTML = 'short url copied to clipboard'
	qr.innerHTML = createFrame(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${shortenedURL.value}`)
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const shorturl = async () => {
	status.innerHTML = 'shortening...'
	erbox.style.display = 'none'
	output.style.display = 'none'
	await sleep(250)
	const longurl = geturl()
	const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
	const cre = /^([a-zA-Z0-9_-]+)$/
	const protocol_ok = re.test(longurl)
	if (!protocol_ok) {
		status.innerHTML = 'shorten'
		erbox.style.display = 'block'
		erbox.innerHTML = 'invalid url'
	} else {
		if (custominput.value == '') {
			genhash()
			send_request(longurl)
			alias.innerHTML = 'shortened'
		} else {
			if (cre.test(custominput.value)) {
				if (cinp()) {
					genhash()
					send_request(longurl)
					alias.innerHTML = 'alias available'
				} else {
					custominput.value = ''
					status.innerHTML = 'shorten'
					erbox.style.display = 'block'
					erbox.innerHTML = 'alias already in use, choose another'
				}
			} else {
				custominput.value = ''
				status.innerHTML = 'shorten'
				erbox.style.display = 'block'
				erbox.innerHTML = 'invalid optional custom alias, use only alphanumerics & underscore'
			}
		}
	}
}
sbtn.addEventListener('click', shorturl)
