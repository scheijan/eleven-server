'use strict';

var _ = require('lodash');
var amf = require('eleven-node-amf/node-amf/amf');
var events = require('events');
var Player = require('model/Player');
var Session = require('comm/Session');


exports.getDummySocket = function getDummySocket() {
	var ret = new events.EventEmitter();
	ret.write = function write(data) {
		ret.emit('data', data);  // simple echo
	};
	ret.setNoDelay = _.noop;
	ret.destroy = _.noop;
	ret.end = _.noop;
	return ret;
};


exports.getTestSession = function getTestSession(id, socket) {
	// creates a Session instance throwing errors (the regular error handler
	// obscures potential test errors, making debugging difficult)
	if (!socket) socket = exports.getDummySocket();
	var ret = new Session(id, socket);
	ret.handleError = function (err) {
		throw err;
	};
	ret.dom.on('error', ret.handleError.bind(ret));
	return ret;
};


exports.getOnlinePlayer = function getOnlinePlayer(data) {
	// create a "connected" player instance with a dummy session object
	var ret = new Player(data);
	ret.session = {send: _.noop};
	return ret;
};


exports.amfEnc = function amfEnc(data) {
	data = amf.serializer().writeObject(data);
	var ret = new Buffer(Buffer.byteLength(data, 'binary'));
	ret.write(data, 0, ret.length, 'binary');
	return ret;
};
