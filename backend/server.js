const express = require('express');
const https = require('https');
const app = express();

function isIpAddress(_address){ // Supports both ipv4 and ipv6
	var validation = new RegExp(/((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/);
    if(!validation.test(_address)){
        return false;
    }
    return true;
}

function buildUrl(_addressToLookup){
	let is_ip = isIpAddress(_addressToLookup);
	let data = {
		key: 'C62C3F6D786375985245FA228DBDE61B',
		domain: '',
		ip: '',
		format: 'json',
	};
	var url = '';

	if(is_ip){
		data['ip'] = _addressToLookup;
		url = 'https://api.ip2location.io/?';
	}else{
		data['domain'] = _addressToLookup;
		url = 'https://api.ip2whois.com/v2?';
	}

	Object.keys(data).forEach((key, index) => {
		if(data[key] != ''){
			url += key + '=' + encodeURIComponent(data[key]) + "&";
		}
	}, data);

	url = url.substring(0, url.length - 1);

	return url;
}

function getHostInfo(_addressToLookup){ // uses WHOIS API
	let urlStr = buildUrl(_addressToLookup);
	let d = '';

	return new Promise((resolve, reject) => {
		https.get(urlStr, res => {
			res.on('data', chunk => (d = d + chunk));
			res.on('end', () => {
				try{
					resolve(d);
				}catch(e){
					reject(e.message);
				}
			});
		}).on('error', e => {
			reject(`Got error: ${e.message}`);
		});
	})
}

app.get('/hostInfo/:addressToLookup', (req, res) => {
	var addressToLookup = req.params.addressToLookup; // get user input of either IP or Domain
	getHostInfo(addressToLookup)
		.then(response => {
            res.set({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials" : true 
            });
            res.status(200);
            res.end(response);
		})
		.catch(error => {
			console.log(`Error: ${error}`);
		});
});

app.listen(5000, () => {
	console.log('Server is running on port 5000.');
});







