const erbox = document.getElementById('erbox')
const keyinput = document.getElementById('key')
const output = document.getElementById('output')
const status = document.getElementById('status')
const alias = document.getElementById('alias')
const sucess = document.getElementById('sucess')
const shortenedURL = document.getElementById('shortenedURL')
const dbtn = document.getElementById('dbtn')
const getkey = () => {
	const key = document.getElementById('key').value
	return key
}
const delKey = (key, data) => {
	fetch(`${endpoint}/${key}`, {
		method: 'DELETE'
	})
	keyinput.value = ''
	status.innerHTML = 'delete'
	output.style.display = 'block'
	alias.innerHTML = 'alias found'
	shortenedURL.value = data
	sucess.innerHTML = 'url deleted'
}
const check_is_unique_alias = () => {
	const key = keyinput.value
	const res = JSON.parse(fetchJSON(`${endpoint}/${key}`))
	const data = res.result
	if (data != null) {
		delKey(key, data)
	} else {
		keyinput.value = ''
		status.innerHTML = 'delete'
		erbox.style.display = 'block'
		erbox.innerHTML = 'alias not found'
	}
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const deleteurl = async () => {
	status.innerHTML = 'deleting...'
	erbox.style.display = 'none'
	output.style.display = 'none'
	await sleep(250)
	const key = getkey()
	const cre = /^([a-zA-Z0-9_-]+)$/
	if (keyinput.value == '') {
		status.innerHTML = 'delete'
		erbox.style.display = 'block'
		erbox.innerHTML = 'invalid alias'
	} else {
		if (cre.test(keyinput.value)) {
			check_is_unique_alias()
		} else {
			keyinput.value = ''
			status.innerHTML = 'delete'
			erbox.style.display = 'block'
			erbox.innerHTML = 'invalid custom alias, use only alphanumerics & underscore'
		}
	}
}
dbtn.addEventListener('click', deleteurl)
// let r = JSON.parse(fetchJSON(endpoint)).result;
// document.getElementById("count").innerHTML = Object.keys(r).length + " urls minimalized";
