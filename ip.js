'use strict';


const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

const checkLAN = (adapterName)=>{
    if(
        adapterName.search(/wlp/i) > -1 ||
        adapterName.search(/enp0s31f6/i) > -1 ||
        adapterName.search(/wi-fi/i) > -1 ||
        adapterName.search(/ethernet/i) > -1
        ){
        console.log("Match: ",adapterName);
        return true;
    }else{
        return false;
    }
};
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            //!results[name]
            if (!results[name]) {
                results[name] = [];
            }
            if(checkLAN(name))
                results[name].push(net.address);
        }
    }
}
// const text = "wlp2s0"<
// console.log(checkLAN(text));
console.log(results);
console.log(results['wlp2s0'][0]);