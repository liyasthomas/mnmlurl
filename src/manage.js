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
	keyinput.placeholder = 'alias'
	keyinput.value = ''
	alias.innerHTML = 'alias found'
	status.innerHTML = 'delete'
	shortenedURL.value = data
	sucess.innerHTML = 'url deleted'
	output.style.display = 'block'
}
const check_is_unique_alias = () => {
	const key = keyinput.value
	const res = JSON.parse(fetchJSON(`${endpoint}/${key}`))
	const data = res.result
	if (data != null) {
		delKey(key, data)
	} else {
		erbox.style.display = 'block'
		erbox.innerHTML = 'alias not found'
		keyinput.placeholder = 'alias'
		keyinput.value = ''
		status.innerHTML = 'delete'
		sucess.innerHTML = ''
		output.style.display = 'none'
	}
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const deleteurl = async () => {
	erbox.innerHTML = ''
	erbox.style.display = 'none'
	sucess.innerHTML = ''
	status.innerHTML = 'deleting...'
	output.style.display = 'none'
	await sleep(500)
	const key = getkey()
	const cre = /^([a-zA-Z0-9_-]+)$/
	if (keyinput.value == '') {
		erbox.style.display = 'block'
		erbox.innerHTML = 'invalid alias'
		status.innerHTML = 'delete'
		sucess.innerHTML = ''
		output.style.display = 'none'
	} else {
		if (cre.test(keyinput.value)) {
			check_is_unique_alias()
		} else {
			erbox.style.display = 'block'
			erbox.innerHTML = 'invalid custom alias, use only alphanumerics & underscore'
			keyinput.placeholder = 'alias'
			keyinput.value = ''
			status.innerHTML = 'delete'
			sucess.innerHTML = ''
			output.style.display = 'none'
		}
	}
}
dbtn.addEventListener('click', deleteurl)
// let r = JSON.parse(fetchJSON(endpoint)).result;
// document.getElementById("count").innerHTML = Object.keys(r).length + " urls minimalized";
