import { useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [address, setAddress] = useState('');
    const [data, setData] = useState([]);

    function isValidIpAddress(_address){ // Supports both ipv4 and ipv6
        var ip_validation = new RegExp(/((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/);
        if(!ip_validation.test(_address)){
            return false;
        }
        return true;
    }

    function isValidDomain(_address){
        var domain_validation = new RegExp(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/);
        if(!domain_validation.test(_address)){
            return false;
        }
        return true;
    }

    function validateAddress(_address){
        if(isValidIpAddress(_address)){
            return true;
        }else if(isValidDomain(_address)){
            return true;
        }else{
            alert(`Invalid address: ${_address}. Please enter valid Domain or IP Address`);
            return false;
        }
    }

    function buildBackendUrl(_address){
        // let url = 'http://127.0.0.1:5000/hostInfo/';  // to work locally
        let current_url = window.location.href;
        let url = current_url.replace('3000/', '5000/hostInfo/');
        return url + _address;
    }

    function getInfoForAddress(_addressToLookup){
        let urlStr = buildBackendUrl(_addressToLookup);
        axios.get(urlStr)
            .then(res => {
                console.log(res.data);
                setData(res.data);
            })
            .catch(error => console.log(error));
    }

    const getAddressInfo = event => {
        event.preventDefault();
        var is_valid = validateAddress(address);
        if(is_valid){
            getInfoForAddress(address);
        }
    }

    return (
        <div className='container'>
            <form className='form-inline' onSubmit={getAddressInfo}>
                <div className='form-group mb-2'>
                    <label>Please enter a domain name or an IP address:</label>
                </div>
                <div className='form-group mx-sm-3 mb-2'>
                    <input type='text' value={address} onChange={(e) => setAddress(e.target.value)}/>
                </div>
                <button type='submit' className='btn btn-primary mb-2'>Lookup</button>
            </form>
            <table className="table table-striped">
                <tbody>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                    </tr>
                    {Object.keys(data).map((key) => {
                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{data[key].toString()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default HomePage;