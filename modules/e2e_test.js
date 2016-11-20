import {expect} from 'chai';
import {request} from 'http';
import {createServer} from './index';

let processBody = (res) => {
    return new Promise((resolve, reject)=>{
        let body = '';
        res.setEncoding('utf8');
        res
        .on('data', function(chunk) {
          body += chunk;
        })
        .on('error', (err) =>{
            reject(err)
        })
        .on('end', function() {
          resolve(body);
        });
    });

}

let requestLocalPromise = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (res)=>{
            resolve(res)
        })
        .end()
        ;
    })
    .then(processBody)
}

describe('E2E test', () => {
    let server;
    let localAddress;
    before(() => {
        server = createServer();
        server.listen();
        localAddress = "http://localhost:" + server.address().port;
        console.log(localAddress)
  });

    after(() => {
        server.close()
    });
    
    it('/react@15.4.0 should return small commonjs file', () => {
        return requestLocalPromise(localAddress + '/react@15.4.0')
        .then((body)=>{
        	expect(body.substr(0,100)).to.equal('\'use strict\';\n\nmodule.exports = require(\'./lib/React\');\n');
        })
        ;
    });
    it('/jquery@3.1.1 should return beauty browser file', () => {
        return requestLocalPromise(localAddress + '/jquery@3.1.1')
        .then((body)=>{
            expect(body.substr(0,100)).to.equal('/*!\n * jQuery JavaScript Library v3.1.1\n * https://jquery.com/\n *\n * Includes Sizzle.js\n * https://s');
        })
        ;
    });
    it('/jquery@3.1.1?main=browser should complain no "browser" field', () => {
        return requestLocalPromise(localAddress + '/jquery@3.1.1?main=browser')
        .then((body)=>{
            expect(body.substr(0,100)).to.equal('Not found: field "browser" in jquery@3.1.1/package.json');
        })
        ;
    });
    it('/jquery@3.1.1?main=malformed_attribute should complain no field', () => {
        return requestLocalPromise(localAddress + '/jquery@3.1.1?main=malformed_attribute')
        .then((body)=>{
            expect(body.substr(0,100)).to.equal('Not found: field "malformed_attribute" in jquery@3.1.1/package.json');
        })
        ;
    });
    it('/jquery@3.1.1/dist/jquery.js should return beauty browser file', () => {
        return requestLocalPromise(localAddress + '/jquery@3.1.1/dist/jquery.js')
        .then((body)=>{
            expect(body.substr(0,100)).to.equal('/*!\n * jQuery JavaScript Library v3.1.1\n * https://jquery.com/\n *\n * Includes Sizzle.js\n * https://s');
        })
        ;
    });
    it('/jquery@3.1.1?main=main should return beauty browser file', () => {
        return requestLocalPromise(localAddress + '/jquery@3.1.1?main=main')
        .then((body)=>{
            expect(body.substr(0,100)).to.equal('/*!\n * jQuery JavaScript Library v3.1.1\n * https://jquery.com/\n *\n * Includes Sizzle.js\n * https://s');
        })
        ;
    });
    it('/jquery@3.1.1/dist/jquery.min.js should return minified browser file', () => {
        return requestLocalPromise(localAddress + '/jquery@3.1.1/dist/jquery.min.js')
        .then((body)=>{
            expect(body.substr(0,100)).to.equal('/*! jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license */\n!function(a,b){"use strict";"objec');
        })
        ;
    });
    it('/jquery@3.1.1?main=min should return minified browser file', () => {
        return requestLocalPromise(localAddress + '/jquery@3.1.1?main=min')
        .then((body)=>{
            expect(body.substr(0,100)).to.equal('/*! jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license */\n!function(a,b){"use strict";"objec');
        })
        ;
    });
    it('/typescript-register@1.1.0?main=min, because we don\'t have the map, should fall back to beauitiful file', () => {
        // don't worry this is deprecated
        // https://github.com/pspeter3/typescript-register
        return requestLocalPromise(localAddress + '/typescript-register@1.1.0?main=min')
        .then((body)=>{
            expect(body.substr(0,100)).to.equal('/// <reference path="typings/typescript/typescript.d.ts"/>\n/// <reference path="typings/chalk/chalk.');
        })
        ;
    });
    
});
