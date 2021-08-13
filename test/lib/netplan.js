'use strict';

const NetPlan = require('../../index');
const expect = require('chai').expect;
const assert = require('chai').assert;
const fs = require('fs');

const testData = {
	oneStaticEth:
		JSON.parse(fs.readFileSync(`${__dirname}/../data/1StaticEth.json`, 'utf8')),
	oneStaticEthInterface:
		JSON.parse(fs.readFileSync(`${__dirname}/../data/StaticEthInterface.json`, 'utf8')),
	oneStaticEthInterfaceNoGateway:
		JSON.parse(fs.readFileSync(`${__dirname}/../data/StaticEthInterfaceNoGateway.json`, 'utf8')),
	oneStaticEthOneDhcpWifi:
		JSON.parse(fs.readFileSync(`${__dirname}/../data/1StaticEth1DhcpWifi.json`, 'utf8')),
	oneDhcpWifiInterface:
		JSON.parse(fs.readFileSync(`${__dirname}/../data/DhcpWifiInterface.json`, 'utf8'))
};

async function expectError(fn) {
	let error = null;
	try {
		await fn()
	} catch (thrown) {
		error = thrown;
	}
	assert(error !== null);
}

describe('/lib/netplan', function() {

    describe('constructor', function() {
    	it('defaults', function(done) {
			const netplan = new NetPlan();
			expect(netplan.plan).not.undefined;
			done();
		});

		it('valid', function(done) {
			const netplan = new NetPlan(testData.oneStaticEth);
			expect(
				JSON.stringify(netplan.plan, null, 2)
			).eql(JSON.stringify(testData.oneStaticEth, null, 2));
			done();
		});

		it('invalid', function(done) {
			try {
				new NetPlan({
					network: 'somestring'
				});
				done(new Error('should have thrown joi error'));
			} catch (err) {
				done();
			}
		});
    });

	describe('loadConfig', function() {
		it('valid', function(done) {
			const netplan = new NetPlan({
				configFile: `${__dirname}/../data/1StaticEth.yaml`
			});
			netplan.loadConfig();
			expect(
				JSON.stringify(netplan.plan, null, 2)
			).eql(JSON.stringify(testData.oneStaticEth, null, 2));
			done();
		});

		it('no file', function(done) {
			const netplan = new NetPlan({
				configFile: '/invalid/file'
			});
			const before = JSON.stringify(netplan.plan, null, 2);
			netplan.loadConfig();
			const after = JSON.stringify(netplan.plan, null, 2);
			expect(before).eql(after);
			done();
		});
	});

    describe('configureInterface', function() {
		it('valid ethernet static', function(done) {
			const netplan = new NetPlan({
				configFile: '/tmp/netplan.yaml'
			});
			netplan.configureInterface(testData.oneStaticEthInterface);
			expect(
				JSON.stringify(netplan.plan, null, 2)
			).eql(JSON.stringify(testData.oneStaticEth, null, 2));
			// TODO: test configureInterface
			done();
		});

		it('valid wifi dhcp', function(done) {
			const netplan = new NetPlan({
				configFile: '/tmp/netplan.yaml'
			});
			netplan.configureInterface(testData.oneStaticEthInterfaceNoGateway);
			netplan.configureInterface(testData.oneDhcpWifiInterface);
			expect(
				JSON.stringify(netplan.plan, null, 2)
			).eql(JSON.stringify(testData.oneStaticEthOneDhcpWifi, null, 2));
			// TODO: test configureInterface
			done();
		});
    });
    
});