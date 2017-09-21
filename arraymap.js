/*
MIT License

Copyright (c) 2017 Norman Breau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function(namespace) {
	if (!window[namespace]) {
		window[namespace] = {};
	}

	var Iterator = function(list) {
		this._data = list || [];
		this._cursor = -1;
	};

	Iterator.prototype = {
		constructor : Iterator,

		hasNext : function() {
			var cursor = this._cursor + 1;
			return cursor >= 0 && cursor < this._data.length;
		},

		hasPrevious : function() {
			var cursor = this._cursor;
			return cursor >= 0 && cursor < this._data.length;
		},

		next : function() {
			this._cursor++;
			return this._data[this._cursor];
		},

		previous : function() {
			this._data[this._cursor--];
		},

		iterate : function(fn) {
			this._data.forEach(fn);
		},

		hasReachedEnd() {
			return this._cursor > this._data.length;
		}
	};

	var ArrayMap = function() {
		this._data = {};
		this._lowerBound = 0;
		this._upperBound = 0;
	};

	ArrayMap.prototype = {
		constructor : ArrayMap,

		iterator : function() {
			return new Iterator(this.toArray());
		},

		reverseIterator : function() {
			return new Iterator(this.toArray().reverse());	
		},

		iterate : function(fn) {
			if (!fn) return null;

			for (var i = this.getLowerBound(); i < this.getUpperBound(); i++) {
				var item = this.get(i);
				fn(item, i);
			}
		},

		getLowerBound : function() {
			return this._lowerBound;
		},

		getUpperBound : function() {
			return this._upperBound;
		},

		toArray : function() {
			var arr = [];

			for (var i = this.getLowerBound(); i <= this.getUpperBound(); i++) {
				arr.push(this.get(i));
			}

			return arr;
		}

		first : function() {
			var iterator = this.iterator();
			var item = null;
			
			do {
				item = iterator.next();
			} while(!iterator.hasReachedEnd() && (item === null || item === undefined));

			return item;
		},

		last : function() {
			var iterator = this.reverseIterator();
			var item = null;
			
			do {
				item = iterator.next();
			} while(!iterator.hasReachedEnd() && (item === null || item === undefined));

			return item;
		},

		unshift: function(item) {
			this._lowerBound--;
			this._data[this._lowerBound] = item;
			return this;
		},

		push: function(item) {
			this._upperBound++;
			this._data[this._upperBound] = item;
			return this;
		},

		count: function() {
			return Object.keys(this._data).length;
		},

		length: function() {
			return Math.abs(this._lowerBound - this._upperBound) + 1;
		},

		set: function(index, item) {
			index = parseInt(index);
			if (isNaN(index)) {
				throw new Error('Index must be an integer.');
			}

			if (index < this._lowerBound) {
				this._lowerBound = index;
			}

			if (index > this._upperBound) {
				this._upperBound = index;
			}

			this._data[index] = item;
			return this;
		},

		has: function(index) {
			return this._data[index] !== undefined;
		},

		get: function(index) {
			return this._data[index];
		},

		shift: function() {
			var data = this._data[this._lowerBound];
			delete this._data[this._lowerBound];
			this._lowerBound++;
			return data;
		},

		pop: function() {
			var data = this._data[this._upperBound];
			delete this._data[this._upperBound];
			this._upperBound--;
			return data;
		}
	};

	window[namespace].ArrayMap = ArrayMap;
	window[namespace].Iterator = Iterator;
})('bt');

