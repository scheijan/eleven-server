var util = require('util');
var Item = require('model/Item');
var Bag = require('model/Bag');
var Player = require('model/Player');
var OrderedHash = require('model/OrderedHash');


suite('Item', function() {

	suite('ctor', function() {
	
		test('enforces presence of core properties', function() {
			var i = new Item();
			assert.property(i, 'x');
			assert.property(i, 'y');
			assert.property(i, 'count');
		});
		
		test('enables collision detection where appropriate', function() {
			var i = new Item();
			assert.isFalse(i.collDet);
			i = new Item({onPlayerCollision: function dummy() {}});
			assert.isTrue(i.collDet);
			assert.property(i, '!colliders');
		});
		
		test('initializes message_queue as OrderedHash', function() {
			var i = new Item({message_queue: {b: 'b', a: 'a'}});
			assert.instanceOf(i.message_queue, OrderedHash);
			assert.strictEqual(i.message_queue.first(), 'a');
		});
	});
	

	suite('isHidden', function() {
	
		test('works as expected', function() {
			var i = new Item();
			assert.isFalse(i.isHidden);
			i = new Item({'is_hidden': true});
			assert.isTrue(i.isHidden);
		});
		
		test('can not be assigned a value', function() {
			var i = new Item();
			assert.isFalse(i.isHidden);
			i.isHidden = true;
			assert.isFalse(i.isHidden);
		});
		
		test('is not enumerable', function() {
			assert.notInclude(Object.keys(new Item()), 'isHidden');
		});
	});
	
	
	suite('isStack', function() {
	
		test('works as expected', function() {
			var i = new Item();
			assert.isFalse(i.isStack);
			var I = function() {};
			util.inherits(I, Item);
			I.prototype.stackmax = 17;
			i = new I();
			assert.isTrue(i.isStack);
		});
	});
	
	
	suite('updatePath', function() {
	
		test('does its job', function() {
			var p = new Player({tsid: 'P1'});
			var b1 = new Bag({tsid: 'B1'});
			var b2 = new Bag({tsid: 'B2'});
			var i = new Item({tsid: 'I1'});
			i.updatePath();
			assert.strictEqual(i.path, 'I1');
			i.container = b2;
			b2.container = b1;
			i.updatePath();
			assert.strictEqual(i.path, 'B1/B2/I1');
			b1.container = p;
			i.updatePath();
			assert.strictEqual(i.path, 'B1/B2/I1', 'player not included');
		});
	});
});