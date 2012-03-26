/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
/*
 * gameQuery rev. 0.5.1
 *
 * Copyright (c) 2008 Selim Arsever (gamequery.onaluf.org)
 * licensed under the MIT (MIT-LICENSE.txt)
 */
// this allow to used the convenient $ notation in  a plugins 
(function($) {
    
    $.extend({ gameQuery: {
        /**
         * This is the Animation Object
         */
        Animation: function (options) {
            // private default values
            var defaults = {
                imageURL:		"",
                numberOfFrame:	1,
                delta:			0,
                rate: 			30,
                type:			0,
                distance:		0,
                offsetx:        0,
                offsety:        0
            };
            
            // options extends defaults
            options = $.extend(defaults, options);

            //"public" attributes:
            this.imageURL		= options.imageURL;		// The url of the image to be used as an animation or sprite 
            this.numberOfFrame	= options.numberOfFrame;// The number of frame to be displayed when playing the animation
            this.delta			= options.delta;		// The the distance in pixels between two frame
            this.rate			= options.rate;			// The rate at which the frame must be played in miliseconds
            this.type			= options.type;			// The type of the animation.This is bitwise OR of the properties.
            this.distance		= options.distance;		// The the distance in pixels between two animation
            this.offsetx        = options.offsetx;      // The x coordinate where the first sprite begin
            this.offsety        = options.offsety;      // The y coordinate where the first sprite begin
            
            //Whenever a new animation is created we add it to the ResourceManager animation list
            $.gameQuery.resourceManager.addAnimation(this);
            
            return true;
        },
        
        // "constants" for the different type of an animation
        ANIMATION_VERTICAL:   1,  // genertated by a verical offset of the background
        ANIMATION_HORIZONTAL: 2,  // genertated by a horizontal offset of the background
        ANIMATION_ONCE:       4,  // played only once (else looping indefinitly)
        ANIMATION_CALLBACK:   8,  // A callack is exectued at the end of a cycle 
        ANIMATION_MULTI:      16, // The image file contains many animations
        
        // "constants" for the different type of geometry for a sprite
        GEOMETRY_RECTANGLE:   1,
        GEOMETRY_DISC:        2, 
        
        // basic values
		refreshRate: 		  30,
        
        /**
         * An object to manages the resources loading
         **/
		resourceManager: {
            animations: [],    // List of animation / images used in the game
            sounds:     [],    // List of sounds used in the game
            callbacks:  [],    // List of the functions called at each refresh
            running:    false, // State of the game,
            
            /**
             * This function the covers things to load befor to start the game.
             **/
            preload: function() {
                //Start loading the images
                for (var i = this.animations.length-1 ; i >= 0; i --){
                    this.animations[i].domO = new Image();
                    this.animations[i].domO.src = this.animations[i].imageURL;
                }
                
                //Start loading the sounds
                for (var i = this.sounds.length-1 ; i >= 0; i --){
                    this.sounds[i].load();
                }
                 
                $.gameQuery.resourceManager.waitForResources();
            },
            
            /**
             * This function the waits for all the resources called for in preload() to finish loading.
             **/
            waitForResources: function() {
                var loadbarEnabled = ($.gameQuery.loadbar != undefined);
                if(loadbarEnabled){
                    $($.gameQuery.loadbar.id).width(0); 
                    var loadBarIncremant = $.gameQuery.loadbar.width / (this.animations.length + this.sounds.length);
                }
                //check the images
                var imageCount = 0; 
                for(var i=0; i < this.animations.length; i++){
                    if(this.animations[i].domO.complete){
                        imageCount++;
                    }
                }
                //check the sounds 
                var soundCount = 0; 
                for(var i=0; i < this.sounds.length; i++){
                    var temp = this.sounds[i].ready();
                    if(temp){
                        soundCount++;
                    }
                }
                //update the loading bar
                if(loadbarEnabled){
                    $("#"+$.gameQuery.loadbar.id).width((imageCount+soundCount)*loadBarIncremant); 
                    if($.gameQuery.loadbar.callback){
                        $.gameQuery.loadbar.callback((imageCount+soundCount)/(this.animations.length + this.sounds.length)*100);
                    }
                }
                if($.gameQuery.resourceManager.loadCallback){
                    var percent = (imageCount+soundCount)/(this.animations.length + this.sounds.length)*100;
                    $.gameQuery.resourceManager.loadCallback(percent); 
                }
                if(imageCount + soundCount < (this.animations.length + this.sounds.length)){
                    imgWait=setTimeout(function () {
                        $.gameQuery.resourceManager.waitForResources();
                    }, 100);
                } else {
                    // all the resources are loaded!
                    // We can associate the animation's images to their coresponding sprites
                    $.gameQuery.sceengraph.children().each(function(){
                        // recursive call on the children:
                        $(this).children().each(arguments.callee);
                        // add the image as a background
                        if(this.gameQuery && this.gameQuery.animation){
                            $(this).css("background-image", "url("+this.gameQuery.animation.imageURL+")");
                            // we set the correct kind of repeat
                            if(this.gameQuery.animation.type & $.gameQuery.ANIMATION_VERTICAL) {
                                $(this).css("background-repeat", "repeat-x");
                            } else if(this.gameQuery.animation.type & $.gameQuery.ANIMATION_HORIZONTAL) {
                                $(this).css("background-repeat", "repeat-y");
                            } else {
                                $(this).css("background-repeat", "no-repeat");
                            }
                        }
                    });
                    
                    // And launch the refresh loop
                    $.gameQuery.resourceManager.running = true;
                    setInterval(function () {
                        $.gameQuery.resourceManager.refresh();
                    },($.gameQuery.refreshRate));
                    if($.gameQuery.startCallback){
                        $.gameQuery.startCallback();
                    }
                    //make the sceengraph visible
                    $.gameQuery.sceengraph.css("visibility","visible");
                }
            },
            
            /**
             * This function refresh a unique sprite here 'this' represent a dom object
             **/
            refreshSprite: function() {
                //Call this function on all the children:
                // is 'this' a sprite ? 
                if(this.gameQuery != undefined){
                    var gameQuery = this.gameQuery;
                    // does 'this' has an animation ?
                    if(gameQuery.animation){
                        //Do we have anything to do?
                        if(gameQuery.idleCounter == gameQuery.animation.rate-1){
                            // does 'this' loops?
                            if(gameQuery.animation.type & $.gameQuery.ANIMATION_ONCE){
                                if(gameQuery.currentFrame < gameQuery.animation.numberOfFrame-2){
                                    gameQuery.currentFrame++;
                                } else if(gameQuery.currentFrame == gameQuery.animation.numberOfFrame-2) {
                                    gameQuery.currentFrame++;
                                    // does 'this' has a callback ?
                                    if(gameQuery.animation.type & $.gameQuery.ANIMATION_CALLBACK){
                                        if($.isFunction(gameQuery.callback)){
                                            gameQuery.callback(this);
                                        }
                                    }
                                }
                            } else {
                                gameQuery.currentFrame = (gameQuery.currentFrame+1)%gameQuery.animation.numberOfFrame;
                                if(gameQuery.currentFrame == 0){
                                    // does 'this' has a callback ?
                                    if(gameQuery.animation.type & $.gameQuery.ANIMATION_CALLBACK){
                                        if($.isFunction(gameQuery.callback)){
                                            gameQuery.callback(this);
                                        }
                                    }
                                }
                            }
                            // update the background:
                            if(gameQuery.animation.type & $.gameQuery.ANIMATION_VERTICAL){
                                if(gameQuery.multi){
                                    $(this).css("background-position",""+(-gameQuery.animation.offsetx-gameQuery.multi)+"px "+(-gameQuery.animation.offsety-gameQuery.animation.delta*gameQuery.currentFrame)+"px");
                                } else {
                                    $(this).css("background-position",""+(-gameQuery.animation.offsetx)+"px "+(-gameQuery.animation.offsety-gameQuery.animation.delta*gameQuery.currentFrame)+"px");
                                }
                            } else if(gameQuery.animation.type & $.gameQuery.ANIMATION_HORIZONTAL) {
                                if(gameQuery.multi){
                                    $(this).css("background-position",""+(-gameQuery.animation.offsetx-gameQuery.animation.delta*gameQuery.currentFrame)+"px "+(-gameQuery.animation.offsety-gameQuery.multi)+"px");
                                } else {
                                    $(this).css("background-position",""+(-gameQuery.animation.offsetx-gameQuery.animation.delta*gameQuery.currentFrame)+"px "+(-gameQuery.animation.offsety)+"px");
                                }
                            }
                        }
                        gameQuery.idleCounter = (gameQuery.idleCounter+1)%gameQuery.animation.rate;
                    }
                }
                return true;
            },
            
            /**
             * This function refresh a unique tile-map here 'this' represent a dom object
             **/
            refreshTilemap: function() {
                //Call this function on all the children:
                // is 'this' a sprite ? 
                if(this.gameQuery != undefined){
                    var gameQuery = this.gameQuery;
                    if($.isArray(gameQuery.frameTracker)){
                        for(var i=0; i<gameQuery.frameTracker.length; i++){
                            //Do we have anything to do?
                            if(gameQuery.idleCounter[i] == gameQuery.animations[i].rate-1){
                                // does 'this' loops?
                                if(gameQuery.animations[i].type & $.gameQuery.ANIMATION_ONCE){
                                    if(gameQuery.frameTracker[i] < gameQuery.animations[i].numberOfFrame-1){
                                        gameQuery.frameTracker[i]++;
                                    }
                                } else {
                                    gameQuery.frameTracker[i] = (gameQuery.frameTracker[i]+1)%gameQuery.animations[i].numberOfFrame;
                                }
                            }
                            gameQuery.idleCounter[i] = (gameQuery.idleCounter[i]+1)%gameQuery.animations[i].rate;
                        }
                    } else {
                        //Do we have anything to do?
                        if(gameQuery.idleCounter == gameQuery.animations.rate-1){
                            // does 'this' loops?
                            if(gameQuery.animations.type & $.gameQuery.ANIMATION_ONCE){
                                if(gameQuery.frameTracker < gameQuery.animations.numberOfFrame-1){
                                    gameQuery.frameTracker++;
                                }
                            } else {
                                gameQuery.frameTracker = (gameQuery.frameTracker+1)%gameQuery.animations.numberOfFrame;
                            }
                        }
                        gameQuery.idleCounter = (gameQuery.idleCounter+1)%gameQuery.animations.rate;
                    }


                    // update the background of all active tiles:
                    $(this).find(".active").each(function(){
                        if($.isArray(gameQuery.frameTracker)){
                            var animationNumber = this.gameQuery.animationNumber
                            if(gameQuery.animations[animationNumber].type & $.gameQuery.ANIMATION_VERTICAL){
                                $(this).css("background-position",""+(-gameQuery.animations[animationNumber].offsetx)+"px "+(-gameQuery.animations[animationNumber].offsety-gameQuery.animations[animationNumber].delta*gameQuery.frameTracker[animationNumber])+"px");
                            } else if(gameQuery.animations[animationNumber].type & $.gameQuery.ANIMATION_HORIZONTAL) {
                                $(this).css("background-position",""+(-gameQuery.animations[animationNumber].offsetx-gameQuery.animations[animationNumber].delta*gameQuery.frameTracker[animationNumber])+"px "+(-gameQuery.animations[animationNumber].offsety)+"px");
                            }
                        } else {
                            if(gameQuery.animations.type & $.gameQuery.ANIMATION_VERTICAL){
                                $(this).css("background-position",""+(-gameQuery.animations.offsetx-this.gameQuery.multi)+"px "+(-gameQuery.animations.offsety-gameQuery.animations.delta*gameQuery.frameTracker)+"px");
                            } else if(gameQuery.animations.type & $.gameQuery.ANIMATION_HORIZONTAL) {
                                $(this).css("background-position",""+(-gameQuery.animations.offsetx-gameQuery.animations.delta*gameQuery.frameTracker)+"px "+(-gameQuery.animations.offsety-this.gameQuery.multi)+"px");
                            }
                        }
                    });
                }
                return true;
            },
            
            /**
             * This function is called periodically to refresh the state of the game.
             **/
            refresh: function() {
                $.gameQuery.playground.find(".sprite").each(this.refreshSprite);
                $.gameQuery.playground.find(".tileSet").each(this.refreshTilemap);
                var deadCallback= new Array();
                for (var i = this.callbacks.length-1; i >= 0; i--){
                    if(this.callbacks[i].idleCounter == this.callbacks[i].rate-1){
                        var returnedValue = this.callbacks[i].fn();
                        if(typeof returnedValue == 'boolean'){
                            // if we have a boolean: 'true' means 'no more execution', 'false' means 'execute once more'
                            if(returnedValue){
                                deadCallback.push(i);
                            }
                        } else if(typeof returnedValue == 'number') {
                            // if we have a number it re-defines the time to the nex call
                            this.callbacks[i].rate = Math.round(returnedValue/$.gameQuery.refreshRate);
                            this.callbacks[i].idleCounter = 0;
                        }
                    }
                    this.callbacks[i].idleCounter = (this.callbacks[i].idleCounter+1)%this.callbacks[i].rate;
                }
                for(var i = deadCallback.length-1; i >= 0; i--){
                    this.callbacks.splice(deadCallback[i],1);
                }
            },
            
            addAnimation: function(animation) {
                if($.inArray(animation,this.animations)<0){
                    //normalize the animationRate:
                    animation.rate = Math.round(animation.rate/$.gameQuery.refreshRate);
                    if(animation.rate==0){
                        animation.rate = 1;
                    }
                    this.animations.push(animation);
                }
            },
            
            addSound: function(sound){
                if($.inArray(sound,this.sounds)<0){
                    this.sounds.push(sound);
                }
            },

            
            registerCallback: function(fn, rate){
                rate  = Math.round(rate/$.gameQuery.refreshRate);
                if(rate==0){
                    rate = 1;
                }
                this.callbacks.push({fn: fn, rate: rate, idleCounter: 0});
            }
        },
        
        // This is a single place to update the underlying data of sprites/groups/tiles
        update: function(descriptor, transformation) {
            // Did we really recieve a descriptor or a jQuery object instead?
            if(!$.isPlainObject(descriptor)){
                // Then we must get real descriptor
                if(descriptor.length > 0){
                    var gameQuery = descriptor[0].gameQuery;
                } else {
                    var gameQuery = descriptor.gameQuery;
                }
            } else {
                var gameQuery = descriptor;
            }
            // If we couldn't find one we return
            if(!gameQuery) return;
            if(gameQuery.tileSet === true){
                //then we have a tilemap!
                descriptor = $(descriptor);
                // find the tilemap offset relatif to the playground:
                var playgroundOffset = $.gameQuery.playground.offset();
                var tileSetOffset = descriptor.offset();
                tileSetOffset = {top: tileSetOffset.top - playgroundOffset.top, left: tileSetOffset.left - playgroundOffset.left};
                // test what kind of transformation we have and react accordingly:
                // Update the descriptor
                for(property in transformation){
                    switch(property){
                        case "left":
                            //Do we need to activate/desactive the first/last column
                            var left = parseFloat(transformation.left);
                            //Get the tileSet offset (relatif to the playground)
                            var playgroundOffset = $.gameQuery.playground.offset();
                            var tileSetOffset = descriptor.parent().offset();
                            tileSetOffset = {top: tileSetOffset.top - playgroundOffset.top, left: tileSetOffset.left + left - playgroundOffset.left};
                            
                            //actvates the visible tiles
                            var firstColumn = Math.max(Math.min(Math.floor(-tileSetOffset.left/gameQuery.width), gameQuery.sizex),0);
                            var lastColumn = Math.max(Math.min(Math.ceil(($.gameQuery.playground[0].width-tileSetOffset.left)/gameQuery.width), gameQuery.sizex),0);
                            
                            for(var i = gameQuery.firstRow; i < gameQuery.lastRow; i++){
                                // if old first col < new first col
                                // deactivate the newly invisible tiles
                                for(var j = gameQuery.firstColumn; j < firstColumn ; j++) {
                                    $("#tile_"+descriptor.attr("id")+"_"+i+"_"+j).removeClass("active");
                                }
                                //and activate the newly visible tiles
                                for(var j = gameQuery.lastColumn; j < lastColumn ; j++) {
                                    $("#tile_"+descriptor.attr("id")+"_"+i+"_"+j).addClass("active");
                                }
                                
                                // if old first col > new first col
                                // deactivate the newly invisible tiles
                                for(var j = lastColumn; j < gameQuery.lastColumn ; j++) {
                                    $("#tile_"+descriptor.attr("id")+"_"+i+"_"+j).removeClass("active");
                                }
                                //activate the newly visible tiles
                                for(var j = firstColumn; j < gameQuery.firstColumn ; j++) {
                                    $("#tile_"+descriptor.attr("id")+"_"+i+"_"+j).addClass("active");
                                }
                            }
                            
                            gameQuery.firstColumn = firstColumn;
                            gameQuery.lastColumn = lastColumn;
                            break;
                        case "top":
                            //Do we need to activate/desactive the first/last row
                            var top = parseFloat(transformation.top);
                            //Get the tileSet offset (relatif to the playground)
                            var playgroundOffset = $.gameQuery.playground.offset();
                            var tileSetOffset = descriptor.parent().offset();
                            tileSetOffset = {top: tileSetOffset.top + top - playgroundOffset.top, left: tileSetOffset.left - playgroundOffset.left};
                            
                            //actvates the visible tiles
                            var firstRow = Math.max(Math.min(Math.floor(-tileSetOffset.top/gameQuery.height), gameQuery.sizey), 0);
                            var lastRow = Math.max(Math.min(Math.ceil(($.gameQuery.playground[0].height-tileSetOffset.top)/gameQuery.height), gameQuery.sizey), 0);
                            
                            
                            for(var j = gameQuery.firstColumn; j < gameQuery.lastColumn ; j++) {
                                 // if old first row < new first row
                                // deactivate the newly invisible tiles
                                for(var i = gameQuery.firstRow; i < firstRow; i++){
                                    $("#tile_"+descriptor.attr("id")+"_"+i+"_"+j).removeClass("active");
                                }
                                //and activate the newly visible tiles
                                for(var i = gameQuery.lastRow; i < lastRow; i++){
                                    $("#tile_"+descriptor.attr("id")+"_"+i+"_"+j).addClass("active");
                                }
                                
                                // if old first row < new first row
                                // deactivate the newly invisible tiles
                                for(var i = lastRow; i < gameQuery.lastRow; i++){
                                    $("#tile_"+descriptor.attr("id")+"_"+i+"_"+j).removeClass("active");
                                }
                                //and activate the newly visible tiles
                                for(var i = firstRow; i < gameQuery.firstRow; i++){
                                    $("#tile_"+descriptor.attr("id")+"_"+i+"_"+j).addClass("active");
                                }
                            }
                            
                            gameQuery.firstRow = firstRow;
                            gameQuery.lastRow = lastRow;
                            
                            break;
                        case "angle": //(in degree)
                            //TODO
                            break;
                        case "factor":
                            //TODO
                            break;
                    }
                }
                
            } else {
                var refreshBoundingCircle = $.gameQuery.playground && !$.gameQuery.playground.disableCollision;
                
                // Update the descriptor
                for(property in transformation){
                    switch(property){
                        case "left":
                            gameQuery.posx = parseFloat(transformation.left);
                            if(refreshBoundingCircle){
                                gameQuery.boundingCircle.x = gameQuery.posx+gameQuery.width/2;
                            }
                            break;
                        case "top":
                            gameQuery.posy = parseFloat(transformation.top);
                            if(refreshBoundingCircle){
                                gameQuery.boundingCircle.y = gameQuery.posy+gameQuery.height/2;
                            }
                            break;
                        case "width":
                            gameQuery.width = parseFloat(transformation.width);
                            break;
                        case "height":
                            gameQuery.height = parseFloat(transformation.height);
                            break;
                        case "angle": //(in degree)
                            gameQuery.angle = parseFloat(transformation.angle);
                            break;
                        case "factor":
                            gameQuery.factor = parseFloat(transformation.factor);
                            if(refreshBoundingCircle){
                                gameQuery.boundingCircle.radius = gameQuery.factor*gameQuery.boundingCircle.originalRadius;
                            }
                            break;
                    }
                }
            }
        },
        
        // This is a utility function that returns the radius for a geometry
        proj: function (elem, angle) {
            switch (elem.geometry){
                case $.gameQuery.GEOMETRY_RECTANGLE :
                    var b = angle*Math.PI*2/360;
                    var Rx = Math.abs(Math.cos(b)*elem.width/2*elem.factor)+Math.abs(Math.sin(b)*elem.height/2*elem.factor);
                    var Ry = Math.abs(Math.cos(b)*elem.height/2*elem.factor)+Math.abs(Math.sin(b)*elem.width/2*elem.factor);
                    
                    return {x: Rx, y: Ry};
            }
        },
        
        // This is a utility function for collision of two object 
        collide: function(elem1, offset1, elem2, offset2) {
            // test real collision (only for two rectangle...)
            if((elem1.geometry == $.gameQuery.GEOMETRY_RECTANGLE && elem2.geometry == $.gameQuery.GEOMETRY_RECTANGLE)){
                
                var dx = offset2.x + elem2.boundingCircle.x - elem1.boundingCircle.x - offset1.x;
                var dy = offset2.y + elem2.boundingCircle.y - elem1.boundingCircle.y - offset1.y;
                var a  = Math.atan(dy/dx);

                var Dx = Math.abs(Math.cos(a-elem1.angle*Math.PI*2/360)/Math.cos(a)*dx);
                var Dy = Math.abs(Math.sin(a-elem1.angle*Math.PI*2/360)/Math.sin(a)*dy);
                
                var R = $.gameQuery.proj(elem2, elem2.angle-elem1.angle);
                
                if((elem1.width/2*elem1.factor+R.x <= Dx) || (elem1.height/2*elem1.factor+R.y <= Dy)) {
                    return false;
                } else {                  
                    var Dx = Math.abs(Math.cos(a-elem2.angle*Math.PI*2/360)/Math.cos(a)*-dx);
                    var Dy = Math.abs(Math.sin(a-elem2.angle*Math.PI*2/360)/Math.sin(a)*-dy);
                    
                    var R = $.gameQuery.proj(elem1, elem1.angle-elem2.angle);
                    
                    if((elem2.width/2*elem2.factor+R.x <= Dx) || (elem2.height/2*elem2.factor+R.y <= Dy)) {
                        return false;
                    } else {  
                        return true;
                    }
                }
            } else {
                return false;
            }
        }
    // This function mute (or unmute) all the sounds. 
    }, muteSound: function(muted){
        for (var i = $.gameQuery.resourceManager.sounds.length-1 ; i >= 0; i --) {
            $.gameQuery.resourceManager.sounds[i].muted(muted);
        }
    }, playground: function() { 
        return $.gameQuery.playground
    // This function define a callback that will be called upon during the 
    // loading of the game's resources. The function will recieve as unique
    // parameter a number representing the progess percentage.
    }, loadCallback: function(callback){
        $.gameQuery.resourceManager.loadCallback = callback;
    }});
    
    $.fn.extend({	
        /**
         * Define the div to use for the display the game and initailize it.
         * This could be called on any node it doesn't matter.
         * The returned node is the playground node.
         * This IS a desrtuctive call
         **/
        playground: function(options) {
            if(this.length == 1){
                if(this[0] == document){ // Old usage check
                    throw "Old playground usage, use $.playground() to retreive the playground and $('mydiv').playground(options) to set the div!";
                }
                options = $.extend({
                    height:		320,
                    width:		480,
                    refreshRate: 30,
                    position:	"absolute",
                    keyTracker:	false,
                    disableCollision: false
                }, options);
                //We save the playground node and set some variable for this node:
                $.gameQuery.playground = this;
                $.gameQuery.refreshRate = options.refreshRate;
                $.gameQuery.playground[0].height = options.height;
                $.gameQuery.playground[0].width = options.width;

                // We initialize the apearance of the div
                $.gameQuery.playground.css({
                        position: options.position,
                        display:  "block",
                        overflow: "hidden",
                        height:   options.height+"px",
                        width:    options.width+"px"
                    })
                    .append("<div id='sceengraph' style='visibility: hidden'/>");
                    
                $.gameQuery.sceengraph = $("#sceengraph");
                
                //Add the keyTracker to the gameQuery object:
                $.gameQuery.keyTracker = {};
                // we only enable the real tracking if the users wants it
                if(options.keyTracker){
                    $(document).keydown(function(event){
                        $.gameQuery.keyTracker[event.keyCode] = true;
                    });
                    $(document).keyup(function(event){
                        $.gameQuery.keyTracker[event.keyCode] = false;
                    });
                }
            }
            return this;
        },
        
        /**
        * Starts the game. The resources from the resource manager are preloaded if necesary 
        * Works only for the playgroung node.
        * This is a non-desrtuctive call
        **/
        startGame: function(callback) {
            //if the element is the playground we start the game:
            $.gameQuery.startCallback = callback;
            $.gameQuery.resourceManager.preload();
            return this;
        },
        
        /**
        * Add a group to the sceen graph
        * works only on the sceengraph root or on another group
        * This IS a desrtuctive call and should be terminated with end() to go back one level up in the chaining
        **/
        addGroup: function(group, options) {
            options = $.extend({
                width:		32,
                height:		32,
                posx:		0,
                posy:		0,
                overflow: 	"visible",
                geometry:   $.gameQuery.GEOMETRY_RECTANGLE,
                angle:          0,
                factor:         1
            }, options);
            
            var newGroupElement = "<div id='"+group+"' class='group' style='position: absolute; display: block; overflow: "+options.overflow+"; top: "+options.posy+"px; left: "+options.posx+"px; height: "+options.height+"px; width: "+options.width+"px;' />";
            if(this == $.gameQuery.playground){
                $.gameQuery.sceengraph.append(newGroupElement);
            } else if ((this == $.gameQuery.sceengraph)||(this.hasClass("group"))){
                this.append(newGroupElement);
            }
            var newGroup = $("#"+group);
            newGroup[0].gameQuery = options;
            newGroup[0].gameQuery.boundingCircle = {x: options.posx + options.width/2,
                                                    y: options.posy + options.height/0,
                                                    originalRadius: Math.sqrt(Math.pow(options.width,2) + Math.pow(options.height,2))/2};
            newGroup[0].gameQuery.boundingCircle.radius = newGroup[0].gameQuery.boundingCircle.originalRadius;
            newGroup[0].gameQuery.group = true;
            return this.pushStack(newGroup);
        },
        
        /**
        * Add a sprite to the current node.
        * Works only on the playground, the sceengraph root or a sceengraph group
        * This is a non-desrtuctive call
        **/
        addSprite: function(sprite, options) {
            options = $.extend({
                width:			32,
                height:			32,
                posx:			0,
                posy:			0,
                idleCounter:	0,
                currentFrame:	0,
                geometry:       $.gameQuery.GEOMETRY_RECTANGLE,
                angle:          0,
                factor:         1
            }, options);
            
            var newSpriteElem = "<div id='"+sprite+"' class='sprite' style='position: absolute; display: block; overflow: hidden; height: "+options.height+"px; width: "+options.width+"px; left: "+options.posx+"px; top: "+options.posy+"px; background-position: "+((options.animation)? -options.animation.offsetx : 0)+"px "+((options.animation)? -options.animation.offsety : 0)+"px;' />";
            if(this == $.gameQuery.playground){
                $.gameQuery.sceengraph.append(newSpriteElem);
            } else {
                this.append(newSpriteElem);
            }
            
            //if the game has already started we want to add the animation's image as a background now:
            if(options.animation){
                if($.gameQuery.resourceManager.running){
                    $("#"+sprite).css("background-image", "url("+options.animation.imageURL+")");
                }
                if(options.animation.type & $.gameQuery.ANIMATION_VERTICAL) {
                    $("#"+sprite).css("background-repeat", "repeat-x");
                } else if(options.animation.type & $.gameQuery.ANIMATION_HORIZONTAL) {
                    $("#"+sprite).css("background-repeat", "repeat-y");
                } else {
                    $("#"+sprite).css("background-repeat", "no-repeat");
                }
            }
            
            
            var spriteDOMObject = $("#"+sprite)[0];
            if(spriteDOMObject != undefined){
                spriteDOMObject.gameQuery = options;
                //Compute bounding Cirlce:
                spriteDOMObject.gameQuery.boundingCircle = {x: options.posx + options.width/2,
                                                            y: options.posy + options.height/2,
                                                            originalRadius: Math.sqrt(Math.pow(options.width,2) + Math.pow(options.height,2))/2};
                spriteDOMObject.gameQuery.boundingCircle.radius = spriteDOMObject.gameQuery.boundingCircle.originalRadius;
            }
            return this;
        },
        
        /**
        * Remove the sprite  on which it is called. This is here for backward compatibility  but it doesn't
        * do anything more than simply calling .remove()
        * This is a non-desrtuctive call.
        **/
        removeSprite: function() {
            this.remove();
            return this;
        },
        
        /**
        * Add a Tile Map to the selected element. 
        * This is a non-destructive call.
        **/
        addTilemap: function(name, tileDescription, animationList, options){
        	options = $.extend({
                width:			32,
                height:			32,
                sizex:          32,
                sizey:          32,
                posx:			0,
                posy:			0
            }, options);
            
            //var newSpriteElem = "<div id='"+sprite+"' style='position: absolute; display: block; overflow: hidden; height: "+options.height+"px; width: "+options.width+"px; left: "+options.posx+"px; top: "+options.posy+"px; background-position: 0px 0px;' />";
            
            var tileSet = $("<div class='tileSet' style='position: absolute; display: block; overflow: hidden;' />");
            tileSet.css({top: options.posy, left: options.posx, height: options.height*options.sizey, width: options.width*options.sizex}).attr("id",name);
            if(this == $.gameQuery.playground){
                $.gameQuery.sceengraph.append(tileSet);
            } else {
                this.append(tileSet);
            }
            
            if($.isArray(animationList)){
                var frameTracker = [];
                var idleCounter = [];
                for(var i=0; i<animationList.length; i++){
                    frameTracker[i] = 0;
                    idleCounter[i] = 0;
                }
                tileSet[0].gameQuery = options
                tileSet[0].gameQuery.frameTracker = frameTracker; 
                tileSet[0].gameQuery.animations = animationList; 
                tileSet[0].gameQuery.idleCounter =  idleCounter; 
                tileSet[0].gameQuery.tileSet = true;
            } else {
                tileSet[0].gameQuery = options
                tileSet[0].gameQuery.frameTracker = 0; 
                tileSet[0].gameQuery.animations = animationList; 
                tileSet[0].gameQuery.idleCounter =  0; 
                tileSet[0].gameQuery.tileSet = true;
            }
            
            if(typeof tileDescription == "function"){
				for(var i=0; i<options.sizey; i++){
            		for(var j=0; j<options.sizex; j++){
                        if(tileDescription(i,j) != 0){
                            if($.isArray(animationList)){
                                // for many simple animation:
                                tileSet.addSprite("tile_"+name+"_"+i+"_"+j, 
                                                      {width: options.width, 
                                                       height: options.height, 
                                                       posx: j*options.width, 
                                                       posy: i*options.height, 
                                                       animation: animationList[tileDescription(i,j)-1]});
                                var newTile = $("#tile_"+name+"_"+i+"_"+j);
                                newTile.removeClass("sprite");
                                newTile.addClass("tileType_"+(tileDescription(i,j)-1));
                                newTile[0].gameQuery.animationNumber = tileDescription(i,j)-1;
                            } else {
                                // for multi-animation:
                                tileSet.addSprite("tile_"+name+"_"+i+"_"+j, 
                                                      {width: options.width, 
                                                       height: options.height, 
                                                       posx: j*options.width, 
                                                       posy: i*options.height, 
                                                       animation: animationList});
                                var newTile = $("#tile_"+name+"_"+i+"_"+j);
                                newTile.setAnimation(tileDescription(i,j)-1);
                                newTile.removeClass("sprite");
                                newTile.addClass("tileType_"+(tileDescription(i,j)-1));
                            }
                        }
            		}	
            	}
            } else if(typeof tileDescription == "object") {
            	for(var i=0; i<tileDescription.length; i++){
            		for(var j=0; j<tileDescription[0].length; j++){
                        if(tileDescription[i][j] != 0){
                            if($.isArray(animationList)){
                                // for many simple animation:
                                tileSet.addSprite("tile_"+name+"_"+i+"_"+j, 
                                                      {width: options.width, 
                                                       height: options.height, 
                                                       posx: j*options.width, 
                                                       posy: i*options.height, 
                                                       animation: animationList[tileDescription[i][j]-1]});
                                var newTile = $("#tile_"+name+"_"+i+"_"+j);
                                newTile.removeClass("sprite");
                                newTile.addClass("tileType_"+(tileDescription[i][j]-1));
                                newTile[0].gameQuery.animationNumber = tileDescription[i][j]-1;
                            } else {
                                // for multi-animation:
                                tileSet.addSprite("tile_"+name+"_"+i+"_"+j, 
                                                      {width: options.width, 
                                                       height: options.height, 
                                                       posx: j*options.width, 
                                                       posy: i*options.height, 
                                                       animation: animationList});
                                var newTile = $("#tile_"+name+"_"+i+"_"+j);
                                newTile.setAnimation(tileDescription[i][j]-1);
                                newTile.removeClass("active");
                                newTile.addClass("tileType_"+(tileDescription[i][j]-1));
                            }
                        }
            		}	
            	}
            }
            //Get the tileSet offset (relatif to the playground)
            var playgroundOffset = $.gameQuery.playground.offset();
            var tileSetOffset = tileSet.offset();
            tileSetOffset = {top: tileSetOffset.top - playgroundOffset.top, left: tileSetOffset.left - playgroundOffset.left};
            
            //actvates the visible tiles
            var firstRow = Math.max(Math.min(Math.floor(-tileSetOffset.top/options.height), options.sizey), 0);
            var lastRow = Math.max(Math.min(Math.ceil(($.gameQuery.playground[0].height-tileSetOffset.top)/options.height), options.sizey), 0);
            var firstColumn = Math.max(Math.min(Math.floor(-tileSetOffset.left/options.width), options.sizex), 0);
            var lastColumn = Math.max(Math.min(Math.ceil(($.gameQuery.playground[0].width-tileSetOffset.left)/options.width), options.sizex), 0);
            
            tileSet[0].gameQuery.firstRow = firstRow;
            tileSet[0].gameQuery.lastRow = lastRow;
            tileSet[0].gameQuery.firstColumn = firstColumn;
            tileSet[0].gameQuery.lastColumn = lastColumn;
            
            for(var i = firstRow; i < lastRow; i++){
                for(var j = firstColumn; j < lastColumn ; j++) {
                    $("#tile_"+name+"_"+i+"_"+j).toggleClass("active");
                }
            }
            return this.pushStack(tileSet);
        },
        
        /**
        * Changes the animation associated with a sprite.
        * WARNING: no check are made to ensure that the object is really a sprite
        * This is a non-desrtuctive call
        **/
        setAnimation: function(animation, callback) {
            var gameQuery = this[0].gameQuery;
            if(typeof animation == "number"){
                if(gameQuery.animation.type & $.gameQuery.ANIMATION_MULTI){
                    var distance = gameQuery.animation.distance * animation;
                    gameQuery.multi = distance;
                    if(gameQuery.animation.type & $.gameQuery.ANIMATION_VERTICAL) {
                       gameQuery.currentFrame = 0;
                        this.css("background-position",""+(-distance-gameQuery.animation.offsetx)+"px "+(-gameQuery.animation.offsety)+"px");
                    } else if(gameQuery.animation.type & $.gameQuery.ANIMATION_HORIZONTAL) {
                        gameQuery.currentFrame = 0;
                        this.css("background-position",""+(-gameQuery.animation.offsetx)+"px "+(-distance-gameQuery.animation.offsety)+"px");
                    }
                }
            } else {
                if(animation){
                    gameQuery.animation = animation;
                    gameQuery.currentFrame = 0;
                    this.css({"background-image": "url("+animation.imageURL+")", "background-position": ""+(-animation.offsetx)+"px "+(-animation.offsety)+"px"});
                    
                    if(gameQuery.animation.type & $.gameQuery.ANIMATION_VERTICAL) {
                        this.css("background-repeat", "repeat-x");
                    } else if(gameQuery.animation.type & $.gameQuery.ANIMATION_HORIZONTAL) {
                        this.css("background-repeat", "repeat-y");
                    } else {
                        this.css("background-repeat", "no-repeat");
                    }
                } else {
                    this.css("background-image", "");
                }
            }
            
            if(callback != undefined){
                this[0].gameQuery.callback = callback;	
            }
            
            return this;
        },
        
        /**
        * This function add the sound to the resourceManger for later use and associate it to the selected dom element(s).
        * This is a non-desrtuctive call
        **/
        addSound: function(sound, add) {
            // Does a SoundWrapper exists
            if($.gameQuery.SoundWrapper) {
                var gameQuery = this[0].gameQuery;
                // should we add to existing sounds ?
                if(add) {
                    // we do, have we some sound associated with 'this'?
                    var sounds = gameQuery.sounds;
                    if(sounds) {
                        // yes, we add it
                        sounds.push(sound);
                    } else {
                        // no, we create a new sound array
                        gameQuery.sounds = [sound];
                    }
                } else {
                    // no, we replace all sounds with this one
                    gameQuery.sounds = [sound];
                }
            }
            return this;
        },
        
        /**
        * This function plays the sound(s) associated with the selected dom element(s)
        * This is a non-desrtuctive call
        **/
        playSound: function() {
            $(this).each(function(){
                var gameQuery = this.gameQuery;
                if(gameQuery.sounds) {
                    for(var i = gameQuery.sounds.length-1 ; i >= 0; i --) {
                        gameQuery.sounds[i].play();
                    }
                }
            });
            
            return this;
        },
        
        /**
        * This function stops the sound(s) associated with the selected dom element(s) and rewind them
        * This is a non-desrtuctive call
        **/
        stopSound: function() {
            $(this).each(function(){
                var gameQuery = this.gameQuery;
                if(gameQuery.sounds) {
                    for(var i = gameQuery.sounds.length-1 ; i >= 0; i --) {
                        gameQuery.sounds[i].stop();
                    }
                }
            });
            return this;
        },
        
        /**
        * This function pauses the sound(s) associated with the selected dom element(s)
        * This is a non-desrtuctive call
        **/
        pauseSound: function() {
            $(this).each(function(){
                var gameQuery = this.gameQuery;
                if(gameQuery.sounds) {
                    for(var i = gameQuery.sounds.length-1 ; i >= 0; i --) {
                        gameQuery.sounds[i].pause();
                    }
                }
            });
            return this;
        },
        
        /**
        * this function mute or unmute the selected sound or all the sounds if none is specified
        **/
        muteSound: function(muted) {
            $(this).each(function(){
                var gameQuery = this.gameQuery;
                if(gameQuery.sounds) {
                    for(var i = gameQuery.sounds.length-1 ; i >= 0; i --) {
                        gameQuery.sounds[i].muted(muted);
                    }
                }
            });
            return this;
        },
        
        /**
        * Register a callback to be trigered every "rate"
        * This is a non-desrtuctive call
        **/
        registerCallback: function(fn, rate) {
            $.gameQuery.resourceManager.registerCallback(fn, rate);
            return this;
        },
        
        /**
        * @DEPRECATED: use loadCallback() instead 
        * Set the id of the div to use as a loading bar while the games media are loaded during the preload.
        * If a callback function is given it will be called each time the loading progression changes with 
        * the precentage passed as unique argument.
        * This is a non-desrtuctive call
        **/
        setLoadBar: function(elementId, finalwidth, callback) {
            $.gameQuery.loadbar = {id: elementId, width: finalwidth, callback: callback};
            return this;
        },
        
        /**
         * This function retreive a list of object in collision with the subject:
         * - if 'this' is a sprite or a group, the function will retrieve the list of sprites (not groups) that touch it
         * - if 'this' is the playground, the function will return a list of all pair of collisioning elements. They are represented 
         *    by a jQuery object containing a series of paire. Each paire represents two object colliding.(not yet implemented)
         * For now all abject are considered to be boxes.
         * This IS a desrtuctive call and should be terminated with end() to go back one level up in the chaining
         **/
        collision: function(filter){
            var resultList = [];
            
            //retrieve 'this' offset by looking at the parents
            var itsParent = this[0].parentNode, offsetX = 0, offsetY = 0;
            while (itsParent != $.gameQuery.playground[0]){
                    if(itsParent.gameQuery){
                    offsetX += itsParent.gameQuery.posx;
                    offsetY += itsParent.gameQuery.posy;
                }
                itsParent = itsParent.parentNode;
            }
            
            // retrieve the gameQuery object
            var gameQuery = this[0].gameQuery;
            
            
            // retrieve the playground's absolute position and size information
            var pgdGeom = {top: 0, left: 0, bottom: $.playground().height(), right: $.playground().width()};
            
            // Does 'this' is inside the playground ?
            if( (gameQuery.boundingCircle.y + gameQuery.boundingCircle.radius + offsetY < pgdGeom.top)    || 
                (gameQuery.boundingCircle.x + gameQuery.boundingCircle.radius + offsetX < pgdGeom.left)   || 
                (gameQuery.boundingCircle.y - gameQuery.boundingCircle.radius + offsetY > pgdGeom.bottom) || 
                (gameQuery.boundingCircle.x - gameQuery.boundingCircle.radius + offsetX > pgdGeom.right)){
                return this.pushStack(new $([]));
            }
            
            if(this == $.gameQuery.playground){ 
                //TODO Code the "all against all" collision detection and find a nice way to return a list of pairs of elements
            } else {
                // we must find all the element that touches 'this'
                var elementsToCheck = new Array();
                elementsToCheck.push($.gameQuery.sceengraph.children(filter).get());
                elementsToCheck[0].offsetX = 0;
                elementsToCheck[0].offsetY = 0;
                
                for(var i = 0, len = elementsToCheck.length; i < len; i++) {
                    var subLen = elementsToCheck[i].length;
                    while(subLen--){
                        var elementToCheck = elementsToCheck[i][subLen];
                        // is it a gameQuery generated element?
                        if(elementToCheck.gameQuery){
                            // we don't want to check groups
                            if(!elementToCheck.gameQuery.group && !elementToCheck.gameQuery.tileSet){
                                // does it touches the selection?
                                if(this[0]!=elementToCheck){
                                    // check bounding circle collision
                                    // 1) distance between center:
                                    var distance = Math.sqrt(Math.pow(offsetY + gameQuery.boundingCircle.y - elementsToCheck[i].offsetY - elementToCheck.gameQuery.boundingCircle.y, 2) + Math.pow(offsetX + gameQuery.boundingCircle.x - elementsToCheck[i].offsetX - elementToCheck.gameQuery.boundingCircle.x, 2));
                                    if(distance - gameQuery.boundingCircle.radius - elementToCheck.gameQuery.boundingCircle.radius <= 0){
                                        // check real collision
                                        if($.gameQuery.collide(gameQuery, {x: offsetX, y: offsetY}, elementToCheck.gameQuery, {x: elementsToCheck[i].offsetX, y: elementsToCheck[i].offsetY})) {
                                            // add to the result list if collision detected
                                            resultList.push(elementsToCheck[i][subLen]);
                                        }
                                    }
                                }
                            }
                            // Add the children nodes to the list
                            var eleChildren = $(elementToCheck).children(filter);
                            if(eleChildren.length){
                                elementsToCheck.push(eleChildren.get());
                                elementsToCheck[len].offsetX = elementToCheck.gameQuery.posx + elementsToCheck[i].offsetX;
                                elementsToCheck[len].offsetY = elementToCheck.gameQuery.posy + elementsToCheck[i].offsetY;
                                len++;
                            }
                        }
                    }
                }
                return this.pushStack($(resultList));
            }
        },
        
        /**
         * This is an internal function doing the combine action of rotate and scale
         * Both argument are mandatory. To get the values back use .rotate() or 
         * .scale()
         **/
        transform: function(angle, factor) {
            var gameQuery = this[0].gameQuery;
            // Mark transformed and compute bounding box
            $.gameQuery.update(gameQuery,{angle: angle, factor: factor});
            
            if(this.css("MozTransform")) {
                // For firefox from 3.5
                var transform = "rotate("+angle+"deg) scale("+factor+")";
                this.css("MozTransform",transform);
            } else if(this.css("WebkitTransform")!==null && this.css("WebkitTransform")!==undefined) {
                // For safari from 3.1 (and chrome)
                var transform = "rotate("+angle+"deg) scale("+factor+")";
                this.css("WebkitTransform",transform);
            } else if(this.css("filter")!==undefined){
                var angle_rad = Math.PI * 2 / 360 * angle;
                // For ie from 5.5
                var cos = Math.cos(angle_rad) * factor;
                var sin = Math.sin(angle_rad) * factor;
                var previousWidth = this.width();
                var previousHeight = this.height();
                this.css("filter","progid:DXImageTransform.Microsoft.Matrix(M11="+cos+",M12="+(-sin)+",M21="+sin+",M22="+cos+",SizingMethod='auto expand',FilterType='nearest neighbor')");
                var newWidth = this.width();
                var newHeight = this.height();
                this.css("left", ""+(gameQuery.posx-(newWidth-previousWidth)/2)+"px");
                this.css("top", ""+(gameQuery.posy-(newHeight-previousHeight)/2)+"px");
            }
            return this;
        },
        
        /**
         * This function rotates the selected element(s) clock-wise. The argument is a degree.
         **/
        rotate: function(angle){
            var gameQuery = this[0].gameQuery;
            
            if(angle !== undefined) {
                return this.transform(angle % 360, this.scale());
            } else {
                var ang = gameQuery.angle;
                return ang ? ang : 0;
            }
        },
        
        /**
         * This function change the scale of the selected element(s). The passed argument is a ratio: 
         * 1.0 = original size
         * 0.5 = half the original size
         * 2.0 = twice the original size
         **/
        scale: function(factor){
            var gameQuery = this[0].gameQuery;
            
            if(factor !== undefined) {
                return this.transform(this.rotate(), factor);
            } else {
                var fac = gameQuery.factor;
                return fac ? fac : 1;
            }
        }
	});
    
    
    // cssHooks to track changes to sprites
	$.cssHooks["left"] = {
		set: function(elem, value) {
			$.gameQuery.update(elem, {left: value});
			return value;
		}
	}
	
	$.cssHooks["top"] = {
		set: function(elem, value) {
			$.gameQuery.update(elem, {top: value});
			return value;
		}
	}
	
	$.cssHooks["width"] = {
		set: function(elem, value) {
			$.gameQuery.update(elem, {width: value});
			return value;
		}
	}
	
	$.cssHooks["height"] = {
		set: function(elem, value) {
			$.gameQuery.update(elem, {height: value});
			return value;
		}
	}
})(jQuery);
/*jslint devel: true, browser: true, white: true, nomen: true */
/*global jWorkflow: false */

/* ===========================================================================
 * AliceJS
 *
 * @description
 * A Lightweight Independent CSS Engine
 *
 * @author Laurent Hasson (@ldhasson)
 * @author Jim Ing (@jim_ing)
 * ===========================================================================
 *
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @description
 *
 */
var alice = (function () {
    "use strict";

    var core = {
            id: "alice",
            name: "AliceJS",
            description: "A Lightweight Independent CSS Engine",
            version: "0.2",
            build: "20120204-1040",

            prefix: "",
            prefixJS: "",

            elems: null,

            format: {},
            helper: {},
            plugins: {},

            debug: false,

            /**
             * Returns array of elements
             */
            elements: function (params) {
                //console.info("elements", params, typeof params);
                var elems = [],
                    i;

                if (typeof params === "string") {
                    elems.push(document.getElementById(params)); // "myId1"
                }
                else if (typeof params === "object") {
                    if (params.length === undefined) {
                        elems.push(params); // myElem1
                    }
                    else if (params.length === 1) {
                        elems.push(document.getElementById(params[0])); // ["myId2"]
                    }
                    else if (params.length > 0) {
                        for (i = 0; i < params.length; i += 1) {
                            if (document.getElementById(params[i])) {
                                elems.push(document.getElementById(params[i])); // ["myId3-1", "myId3-2", "myId3-3"]
                            }
                            // Chrome NodeList
                            else {
                                // ignore Text
                                if (params[i].nodeType !== 3) {
                                    elems.push(params[i]); // myElem4.childNodes
                                }
                            }
                        }
                    }
                }
                // Safari NodeList
                else if (typeof params === "function") {
                    if (params.length > 0) {
                        for (i = 0; i < params.length; i += 1) {
                            // ignore Text
                            if (params[i].nodeType !== 3) {
                                elems.push(params[i]); // myElem4.childNodes
                            }
                        }
                    }
                }

                //console.log(elems);
                return elems;
            },

            /**
             * Returns random number +/- the factor
             */
            randomize: function (num, factor) {
                var f, r,
                    n = parseInt(num, 10);

                if (typeof factor === "string" && factor.indexOf("%") > -1) {
                    f = parseInt(factor, 10) / 100;
                }
                else {
                    f = parseFloat(factor, 10);
                }

                r = n + n * ((Math.random() * 2 * f) - f);

                //console.log("randomize:", "n=" + n, "factor=" + factor, "r=" + r);
                return Math.floor(r);
            },

            /**
             * Returns duration in milliseconds
             */
            duration: function (params) {
                //console.info("duration", params, typeof params);
                var dur,
                    parseNum = function (num) {
                        return num;
                    },
                    parseStr = function (str) {
                        var val;
                        if (str.indexOf("ms") > -1) {
                            val = parseInt(str, 10); // "1000ms", "1500ms"
                        }
                        else if (str.indexOf("s") > -1) {
                            val = parseFloat(str, 10) * 1000; // "1s", "1.5s"
                        }
                        else {
                            val = parseInt(str, 10); // "1000"
                        }
                        return val;
                    },
                    parseObj = function (obj) {
                        var val;
                        if (obj.value) {
                            if (typeof obj.value === "string") {
                                val = parseStr(obj.value);
                            }
                            else {
                                val = parseNum(obj.value); // {value: 2000}
                            }
                        }
                        return val;
                    };

                switch (typeof params) {
                case "number":
                    dur = parseNum(params);
                    break;
                case "string":
                    dur = parseStr(params);
                    break;
                case "object":
                    dur = parseObj(params);
                    break;
                default:
                    dur = params;
                }

                //console.log("duration:", "dur=" + dur);
                return dur;
            },

            /**
             * Returns x and y coordinates as percentages
             */
            coords: function (params) {
                //console.info("coords", params);
                if (params === undefined || params === null) {
                    return {x: "50%", y: "50%"}; // center
                }

                if (typeof params === "string") {
                    switch (params) {
                    // standard
                    case "top-left":
                        return {x: "0%", y: "0%"};
                    case "top-center":
                        return {x: "50%", y: "0%"};
                    case "top-right":
                        return {x: "100%", y: "0%"};
                    case "middle-left":
                        return {x: "0%", y: "50%"};
                    case "middle-center":
                        return {x: "50%", y: "50%"};
                    case "middle-right":
                        return {x: "100%", y: "50%"};
                    case "bottom-left":
                        return {x: "0%", y: "100%"};
                    case "bottom-center":
                        return {x: "50%", y: "100%"};
                    case "bottom-right":
                        return {x: "100%", y: "100%"};

                    // shortcuts
                    case "top":
                        return {x: "50%", y: "0%"};
                    case "left":
                        return {x: "0%", y: "50%"};
                    case "center":
                        return {x: "50%", y: "50%"};
                    case "right":
                        return {x: "100%", y: "50%"};
                    case "bottom":
                        return {x: "50%", y: "100%"};

                    // compass shortcuts
                    case "NW":
                        return {x: "0%", y: "0%"};
                    case "N":
                        return {x: "50%", y: "0%"};
                    case "NE":
                        return {x: "100%", y: "0%"};
                    case "W":
                        return {x: "0%", y: "50%"};
                    case "E":
                        return {x: "100%", y: "50%"};
                    case "SW":
                        return {x: "0%", y: "100%"};
                    case "S":
                        return {x: "50%", y: "100%"};
                    case "SE":
                        return {x: "100%", y: "100%"};

                    default:
                        return {x: "50%", y: "50%"}; // center
                    }
                }

                return params; // {x: 320, y: 240}
            },

            /**
             * Returns cubic bezier function
             */
            easing: function (params) {
                switch (params) {
                // Standard
                case "linear":
                    return {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750};
                case "ease":
                    return {p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000};
                case "ease-in":
                    return {p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000};
                case "ease-out":
                    return {p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000};
                case "ease-in-out":
                    return {p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000};

                // Penner Equations (approximate)
                case "easeInQuad":
                    return {p1: 0.550, p2: 0.085, p3: 0.680, p4: 0.530};
                case "easeInCubic":
                    return {p1: 0.550, p2: 0.055, p3: 0.675, p4: 0.190};
                case "easeInQuart":
                    return {p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220};
                case "easeInQuint":
                    return {p1: 0.755, p2: 0.050, p3: 0.855, p4: 0.060};
                case "easeInSine":
                    return {p1: 0.470, p2: 0.000, p3: 0.745, p4: 0.715};
                case "easeInExpo":
                    return {p1: 0.950, p2: 0.050, p3: 0.795, p4: 0.035};
                case "easeInCirc":
                    return {p1: 0.600, p2: 0.040, p3: 0.980, p4: 0.335};
                case "easeInBack":
                    return {p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045};
                case "easeOutQuad":
                    return {p1: 0.250, p2: 0.460, p3: 0.450, p4: 0.940};
                case "easeOutCubic":
                    return {p1: 0.215, p2: 0.610, p3: 0.355, p4: 1.000};
                case "easeOutQuart":
                    return {p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000};
                case "easeOutQuint":
                    return {p1: 0.230, p2: 1.000, p3: 0.320, p4: 1.000};
                case "easeOutSine":
                    return {p1: 0.390, p2: 0.575, p3: 0.565, p4: 1.000};
                case "easeOutExpo":
                    return {p1: 0.190, p2: 1.000, p3: 0.220, p4: 1.000};
                case "easeOutCirc":
                    return {p1: 0.075, p2: 0.820, p3: 0.165, p4: 1.000};
                case "easeOutBack":
                    return {p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275};
                case "easeInOutQuad":
                    return {p1: 0.455, p2: 0.030, p3: 0.515, p4: 0.955};
                case "easeInOutCubic":
                    return {p1: 0.645, p2: 0.045, p3: 0.355, p4: 1.000};
                case "easeInOutQuart":
                    return {p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000};
                case "easeInOutQuint":
                    return {p1: 0.860, p2: 0.000, p3: 0.070, p4: 1.000};
                case "easeInOutSine":
                    return {p1: 0.445, p2: 0.050, p3: 0.550, p4: 0.950};
                case "easeInOutExpo":
                    return {p1: 1.000, p2: 0.000, p3: 0.000, p4: 1.000};
                case "easeInOutCirc":
                    return {p1: 0.785, p2: 0.135, p3: 0.150, p4: 0.860};
                case "easeInOutBack":
                    return {p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550};

                // Custom
                case "custom":
                    return {p1: 0.000, p2: 0.350, p3: 0.500, p4: 1.300};

                // Random (between 0 and 1)
                case "random":
                    return {
                        p1: Math.random().toPrecision(3),
                        p2: Math.random().toPrecision(3),
                        p3: Math.random().toPrecision(3),
                        p4: Math.random().toPrecision(3)
                    };

                default:
                    return {p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000}; // ease
                }
            },

            /**
             * Returns a flip object
             */
            flip: function (params, turns, overshoot) {
                var numTurns = turns || 1,
                    ret,
                    parseNum = function (num) {
                        return {start: 0, end: num, axis: "Y"};
                    },
                    parseStr = function (str) {
                        if (params === "left") {
                            return {start: 0, end: -360 * numTurns, axis: "Y"};
                        }
                        else if (params === "right") {
                            return {start: 0, end: 360 * numTurns, axis: "Y"};
                        }
                        else if (params === "up") {
                            return {start: 0, end: 360 * numTurns, axis: "X"};
                        }
                        else if (params === "down") {
                            return {start: 0, end: -360 * numTurns, axis: "X"};
                        }
                    },
                    parseObj = function (obj) {
                        var val;
                        if (obj.value) {
                            if (typeof obj.value === "string") {
                                val = parseStr(obj.value);
                            }
                            else {
                                val = parseNum(obj.value); // {value: -180}
                            }
                        }
                        return val;
                    };

                switch (typeof params) {
                case "number":
                    ret = parseNum(params);
                    break;
                case "string":
                    ret = parseStr(params);
                    break;
                case "object":
                    ret = parseObj(params);
                    break;
                default:
                    ret = null;
                }

                //console.warn(params, ret);
                return ret;
            },

            /**
             * Returns percentage in decimal form
             */
            percentage: function (params) {
                //console.info("percentage", params);
                var pct;

                if (typeof params === "string") {
                    if (params.indexOf("%") > -1 || params.indexOf("°") > -1) {
                        pct = parseInt(params, 10) / 100; // "5%" or "5°"
                    }
                    else {
                        if (params >= 1 || params <= -1) {
                            pct = parseInt(params, 10) / 100; // "5" or "-5"
                        }
                        else {
                            pct = parseFloat(params, 10); // "0.05" or "-0.05"
                        }
                    }
                }
                else if (typeof params === "number") {
                    if (params >= 1 || params <= -1) {
                        pct = params / 100; // 5 or -5
                    }
                    else {
                        pct = params; // 0.05 or -0.05
                    }
                }

                //console.log("percentage:", pct=" + pct);
                return pct;
            },

            /**
             * Set vendor prefix
             */
            vendorPrefix: function () {
                var el = document.createElement("div");

                // Safari 4+, iOS Safari 3.2+, Chrome 2+, and Android 2.1+
                if ("webkitAnimation" in el.style) {
                    this.prefix = "-webkit-";
                    this.prefixJS = "webkit";
                }
                // Firefox 5+
                else if ("MozAnimation" in el.style) {
                    this.prefix = "-moz-";
                    this.prefixJS = "Moz";
                }
                // Internet Explorer 10+
                else if ("MSAnimation" in el.style) {
                    this.prefix = "-ms-";
                    this.prefixJS = "MS";
                }
                // Opera 12+
                else if ("OAnimation" in el.style || "OTransform" in el.style) {
                    this.prefix = "-o-";
                    this.prefixJS = "O";
                }
                else {
                    this.prefix = "";
                    this.prefixJS = "";
                }

                if (this.debug) {
                    console.log("prefix=" + this.prefix, "prefixJS=" + this.prefixJS);
                }

                return;
            },

            /**
             * Get the document height
             */
            docHeight: function () {
                var D = document;

                return Math.max(
                Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
            },

            /**
             *
             */
            pixel: function (p, w) {
                if (typeof p === "number") {
                    // integers: 0, 1, 1024, ... n
                    if (p % 1 === 0) {
                        return p;
                    }
                    // floats: 0.1 ... 0.9
                    else {
                        return (parseFloat(p, 10)) * w;
                    }
                }
                // 1024px
                if (p.indexOf("px") > -1) {
                    return parseInt(p, 10);
                }
                // 80%, 100%
                if (p.indexOf("%") > -1) {
                    return Math.round((parseInt(p, 10) / 100) * w);
                }
            },

            /**
             * Insert CSS keyframe rule
             */
            keyframeInsert: function (rule) {
                if (document.styleSheets && document.styleSheets.length) {
                    try {
                        document.styleSheets[0].insertRule(rule, 0);
                    }
                    catch (ex) {
                        console.warn(ex.message, rule);
                    }
                }
                else {
                    var style = document.createElement("style");
                    style.innerHTML = rule;
                    document.head.appendChild(style);
                }

                return;
            },

            /**
             * Delete CSS keyframe rule
             */
            keyframeDelete: function (ruleName) {
                var cssrules = (document.all) ? "rules" : "cssRules",
                    i;

                for (i = 0; i < document.styleSheets[0][cssrules].length; i += 1) {
                    if (document.styleSheets[0][cssrules][i].name === ruleName) {
                        document.styleSheets[0].deleteRule(i);
                        if (this.debug) {
                            console.log("Deleted keyframe: " + ruleName);
                        }
                        break;
                    }
                }

                return;
            },

            /**
             * Clear animation settings
             */
            clearAnimation: function (evt) {
                //console.info("_clearAnimation", this, evt.srcElement.id, evt.animationName, evt.elapsedTime);
                this.style[this.prefixJS + "AnimationName"] = "";
                this.style[this.prefixJS + "AnimationDelay"] = "";
                this.style[this.prefixJS + "AnimationDuration"] = "";
                this.style[this.prefixJS + "AnimationTimingFunction"] = "";
                this.style[this.prefixJS + "AnimationIterationCount"] = "";
                this.style[this.prefixJS + "AnimationDirection"] = "";
                //this.style[this.prefixJS + "AnimationFillMode"] = "";
                this.style[this.prefixJS + "AnimationPlayState"] = "";

                // TODO: add evt.animationName to a delete queue?
                alice.keyframeDelete(evt.animationName);

                return;
            },

            /**
             * Initialize
             */
            init: function (params) {
                console.info("Initializing " + this.name + " (" + this.description + ") " + this.version);

                this.vendorPrefix();

                if (params && params.elems) {
                    this.elems = this.elements(params.elems);
                    //console.log(this.elems);
                }

                // Add optional support for jWorkflow (https://github.com/tinyhippos/jWorkflow)
                if (typeof jWorkflow !== "undefined") {
                    console.log("jWorkflow: enabled");

                    var id = (params && params.id) ? params.id : '',

                        workflow = jWorkflow.order(),

                        animation = {
                            delay: function (ms) {
                                workflow.chill(ms);
                                return animation;
                            },
                            log: function (msg) {
                                workflow.andThen(function () {
                                    console.log(msg);
                                });
                                return animation;
                            },
                            custom: function (func) {
                                workflow.andThen(func);
                                return animation;
                            },
                            start: function () {
                                workflow.start(function () {
                                    console.info("workflow.start");
                                });
                            }
                        };

                    Array.prototype.forEach.call(Object.keys(core.plugins), function (plugin) {
                        var func = core.plugins[plugin];
                        animation[plugin] = function () {
                            var args = arguments;
                            workflow.andThen(function () {
                                func.apply(document.getElementById(id), args);
                            });
                            return animation;
                        };
                    });

                    return animation;
                }
                else {
                    console.log("jWorkflow: disabled");
                }

                return core.plugins;
            }
        };

    return core;
}());

/**
 *
 */
alice.format = {
    /**
     *
     */
    duration: function (params) {
        "use strict";
        var d = 0, r = 0, dur = 0;

        d = alice.duration(params);
        dur = d;

        if (params.randomness) {
            r = alice.randomize(d, alice.percentage(params.randomness));
            dur = Math.abs(r);
        }

        //console.log(d, r, dur);
        return dur + "ms";
    },

    /**
     *
     */
    coords: function (c) {
        "use strict";
        var cObj = alice.coords(c),
            cVal = cObj.x + " " + cObj.y;
        return cVal;
    },

    /**
     *
     */
    easing: function (e) {
        "use strict";
        var eObj = alice.easing(e),
            eVal = "cubic-bezier(" + eObj.p1 + ", " + eObj.p2 + ", " + eObj.p3 + ", " + eObj.p4 + ")";
        return eVal;
    },

    /**
     *
     */
    oppositeNumber: function (n) {
        "use strict";
        return -n;
    }
};

/**
 *
 */
alice.helper = {
    /**
     *
     */
    duration: function (param, calc, duration) {
        if (param && param.offset) {
            if (calc) {
                calc = parseInt(calc, 10) + parseInt(param.offset, 10);
            }
            else {
                calc = parseInt(alice.format.duration(duration), 10);
            }
            calc += "ms";
            //console.log(duration, param.value, param.offset, calc);
        }
        else {
            calc = parseInt(alice.format.duration(duration), 10) + "ms";
        }
        return calc;
    },

    /**
     *
     */
    rotation: function (rotate, params) {
        "use strict";
        var val = rotate;
        if (params.randomness) {
            val = alice.randomize(val, alice.percentage(params.randomness));
            //console.log("rotation:", "rotate=" + rotate, "params.randomness=" + params.randomness, "val=" + val);
        }
        return val;
    }
};

//----------------------------------------------------------------------------

/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

/* ===========================================================================
 * alice.plugins.cheshire.js
 * ===========================================================================
 *
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * [cheshire description]
 * @param  {[type]} params [description]
 * @return {[type]}
 */
alice.plugins.cheshire = function (params) {
    "use strict";

    console.info("cheshire", params);

    var
        // Initialize variables and set defaults
        delay = params.delay || "0ms",
        duration = params.duration || "2000ms",

        timing = params.timing || "ease",
        iteration = params.iteration || 1,
        direction = params.direction || "normal",
        playstate = params.playstate || "running",

        perspective = params.perspective || "1000",
        perspectiveOrigin = params.perspectiveOrigin || "center",
        backfaceVisibility = params.backfaceVisibility || "visible",

        overshoot = alice.percentage(params.overshoot) || 0,
        overShootPercent = 85,

        rotate = params.rotate || 0,

        turns = params.turns || 1,

        flip = alice.flip(params.flip, turns, overshoot),

        fade = (params.fade && params.fade !== "") ? params.fade : null,
        fadeStart = (fade && fade === "out") ? 1 : 0,
        fadeEnd = (fade && fade === "out") ? 0 : 1,

        scaleFrom = (params.scale && params.scale.from) ? alice.percentage(params.scale.from) : 1,
        scaleTo = (params.scale && params.scale.to) ? alice.percentage(params.scale.to) : 1,
        shadow = params.shadow || false,

        move = "",
        axis = "",
        sign = 1,
        posStart = 0,
        posEnd = params.posEnd || 0,
        over = posEnd + (sign * Math.floor(posEnd * overshoot)),

        // temporary variables
        calc = {},
        container, elems, elem, i, animId, css, transformStart, transformOver, transformEnd, boxShadowStart, boxShadowEnd, dir, size, shadowSize;

    // TODO: use elems from init for chaining?
    if (alice.elems !== null) {
        elems = alice.elems;
    }
    else if (params.elems) {
        elems = alice.elements(params.elems);
    }

    // Loop through elements
    if (elems && elems.length > 0) {
        for (i = 0; i < elems.length; i += 1) {
            elem = elems[i];
            container = elem.parentElement || elem.parentNode;

            // Recalculate delay and duration for each element
            calc.delay = alice.helper.duration(params.delay, calc.delay, delay);
            calc.duration = alice.helper.duration(params.duration, calc.duration, duration);

            // Recalculate rotation with randomization for each element
            calc.rotate = alice.helper.rotation(rotate, params);
            calc.rotateStart = alice.percentage(calc.rotate) * 100;
            calc.rotateOver = overshoot * 100;
            calc.rotateEnd = 0;

            // Generate animation ID
            animId = alice.id + "-cheshire-" + (new Date()).getTime() + "-" + Math.floor(Math.random() * 1000000);

            // Configure settings
            if (params.move) {
                dir = params.move.direction || params.move;
                switch (dir) {
                case "left":
                    move = "Left";
                    axis = "X";
                    sign = -1;
                    size = window.innerWidth;
                    posStart = (params.move.start) ? alice.pixel(params.move.start, size) : size;
                    posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : 0;
                    over = sign * Math.floor(posStart * overshoot);
                    break;
                case "right":
                    move = "Right";
                    axis = "X";
                    sign = 1;
                    size = document.body.offsetWidth - elem.clientWidth;
                    posStart = (params.move.start) ? alice.pixel(params.move.start, size) : 0;
                    posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : size;
                    over = posEnd + (sign * Math.floor(posEnd * overshoot));
                    break;
                case "up":
                    move = "Up";
                    axis = "Y";
                    sign = -1;
                    size = window.innerHeight;
                    posStart = (params.move.start) ? alice.pixel(params.move.start, size) : size;
                    posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : 0;
                    over = sign * Math.floor(posStart * overshoot);
                    break;
                case "down":
                    move = "Down";
                    axis = "Y";
                    sign = 1;
                    size = alice.docHeight() - (container.clientHeight * 3);
                    posStart = (params.move.start) ? alice.pixel(params.move.start, size) : 0;
                    posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : size;
                    over = posEnd + (sign * Math.floor(posEnd * overshoot));

                    if (alice.debug) {
                        console.log(alice.docHeight(), window.innerHeight, window.pageYOffset, container.clientHeight);
                    }
                    break;
                }
            }

            // Generate transforms
            transformStart = "";
            transformStart += (flip) ? " rotate" + flip.axis + "(" + flip.start + "deg)" : " translate" + axis + "(" + posStart + "px)";
            transformStart += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateStart + "deg)" : "";
            transformStart += " scale(" + scaleFrom + ")";

            transformOver = "";
            transformOver += (flip) ? " rotate" + flip.axis + "(" + Math.floor((1 + overshoot) * flip.end) + "deg)" : " translate" + axis + "(" + over + "px)";
            transformOver += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateOver + "deg)" : "";
            transformOver += (scaleTo > 1) ? " scale(" + scaleTo + ")" : "";
            transformOver += " scale(" + scaleTo + ")";

            transformEnd = "";
            transformEnd += (flip) ? " rotate" + flip.axis + "(" + flip.end + "deg)" : " translate" + axis + "(" + posEnd + "px)";

            if (move === "" && direction === "alternate") {
                transformEnd += " rotate(" + alice.format.oppositeNumber(calc.rotateStart) + "deg)";
            }
            else {
                transformEnd += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateEnd + "deg)" : "";
            }

            transformEnd += " scale(" + scaleTo + ")";

            // Generate box shadow
            if (shadow === true && scaleTo > 1) {
                shadowSize = Math.round(scaleTo * 10);
                boxShadowStart = " 0px 0px 0px rgba(0, 0, 0, 1)";
                boxShadowEnd = " " + shadowSize + "px " + shadowSize + "px " + shadowSize + "px rgba(0, 0, 0, 0.5)";
            }

            // Generate CSS for keyframe rule
            css = "";
            css += "@" + alice.prefix + "keyframes " + animId + " {\n";

            css += "\t" + "0% {" + "\n";
            css += "\t\t" + alice.prefix + "transform:" + transformStart + ";" + "\n";
            css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
            css += (fade) ? "\t\t" + "opacity: " + fadeStart + ";" + "\n" : "";
            css += (shadow === true && scaleTo > 1) ? "\t\t" + alice.prefix + "box-shadow: " + boxShadowStart + ";" + "\n" : "";

            css += "\t" + "}" + "\n";

            if (overshoot !== 0) {
                css += "\t" + overShootPercent + "% {\n";
                css += "\t\t" + alice.prefix + "transform:" + transformOver + ";" + "\n";
                css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
                css += "\t" + "}" + "\n";
            }

            css += "\t" + "100% {" + "\n";
            css += "\t\t" + alice.prefix + "transform:" + transformEnd + ";" + "\n";
            css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
            css += (fade) ? "\t\t" + "opacity: " + fadeEnd + ";" + "\n" : "";
            css += (shadow === true && scaleTo > 1) ? "\t\t" + alice.prefix + "box-shadow: " + boxShadowEnd + ";" + "\n" : "";

            css += "\t" + "}" + "\n";

            css += "}" + "\n";

            //console.log(css);

            // Insert keyframe rule
            alice.keyframeInsert(css);

            // Apply perspective to parent container
            container.style[alice.prefixJS + "Perspective"] = perspective + "px";
            container.style[alice.prefixJS + "PerspectiveOrigin"] = alice.format.coords(perspectiveOrigin); // alice.coords();

            // Apply properties to elements
            elem.style[alice.prefixJS + "BackfaceVisibility"] = backfaceVisibility;

            elem.style[alice.prefixJS + "AnimationName"] = animId;
            elem.style[alice.prefixJS + "AnimationDelay"] = calc.delay;
            elem.style[alice.prefixJS + "AnimationDuration"] = calc.duration;
            elem.style[alice.prefixJS + "AnimationTimingFunction"] = alice.format.easing(timing);
            elem.style[alice.prefixJS + "AnimationIterationCount"] = iteration;
            elem.style[alice.prefixJS + "AnimationDirection"] = direction;
            elem.style[alice.prefixJS + "AnimationPlayState"] = playstate;

            // Apply styles from last key frame
            elem.style[alice.prefixJS + "Transform"] = transformEnd;
            elem.style.opacity = (fade) ? fadeEnd : "";
            elem.style[alice.prefixJS + "BoxShadow"] = (shadow === true && scaleTo > 1) ? boxShadowEnd : "";

            // Add listener to clear animation after it's done
            if ("MozAnimation" in elem.style) {
                elem.addEventListener("animationend", alice.clearAnimation, false);
            }
            else {
                elem.addEventListener(alice.prefixJS + "AnimationEnd", alice.clearAnimation, false);
            }

            if (alice.debug) {
                console.log(css);
                console.log(container.style);
                console.log(elem.id, alice.prefixJS, elem.style, elem.style.cssText, elem.style[alice.prefixJS + "AnimationDuration"], elem.style[alice.prefixJS + "AnimationTimingFunction"]);
            }
        }
    }
    else {
        console.warn("No elements!");
    }

    return params;
};

//---[ Shortcut Methods ]-----------------------------------------------------

/*
 * CSS Syntax:
 *     animation: name duration timing-function delay iteration-count direction;
 *
 * Parameter Syntax:
 *     elems, <options>, duration, timing, delay, iteration, direction, playstate
 */

/**
 * [bounce description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} scale     [description]
 * @param  {[type]} shadow    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.bounce = function (elems, scale, shadow, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("bounce: ", arguments);

    var scaleObj = {from: "100%", to: "125%"}; // default
    if (scale) {
        if (typeof scale === "object") {
            scaleObj = scale;
        }
        else {
            scaleObj.to = scale;
        }
    }

    var opts = {
        elems: elems,

        //scale: scale || {from: "100%", to: "125%"},
        scale: scaleObj,
        shadow: shadow || false,

        duration: duration || "750ms",
        timing: timing || "easeOutSine",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [dance description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.dance = function (elems, rotate, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("dance: ", arguments);

    var opts = {
        elems: elems,

        rotate: rotate || 45,

        duration: duration || "750ms",
        timing: timing || "easeInOutBack",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [drain description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.drain = function (elems, fade, rotate, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("drain: ", arguments);

    var opts = {
        scale: (fade === "in") ? {from: "1%", to: "100%"} : {from: "100%", to: "1%"},

        elems: elems,

        fade: fade || "out",
        rotate: rotate || -2880,

        duration: duration || "4500ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [fade description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.fade = function (elems, fade, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("fade: ", arguments);

    var opts = {
        elems: elems,

        fade: fade || "in",

        duration: duration || "4500ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [hinge description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.hinge = function (elems, rotate, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("hinge: ", arguments);

    var opts = {
        perspectiveOrigin: "top-left",

        elems: elems,

        rotate: rotate || 25,
        overshoot: overshoot || 0,

        duration: duration || "1000ms",
        timing: timing || "linear",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [pageFlip description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} turns     [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.pageFlip = function (elems, flip, turns, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("pageFlip: ", arguments);

    var perspectiveOrigin = "left";

    switch (flip) {
    case "right":
        perspectiveOrigin = "right";
        break;
    case "up":
        perspectiveOrigin = "top";
        break;
    case "down":
        perspectiveOrigin = "bottom";
        break;
    }

    var opts = {
        perspectiveOrigin: perspectiveOrigin,

        elems: elems,

        flip: flip || "left",
        turns: turns || 1,
        overshoot: overshoot || 0,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [pendulum description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.pendulum = function (elems, rotate, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("pendulum: ", arguments);

    var opts = {
        perspectiveOrigin: "top",

        elems: elems,

        rotate: rotate || 45,
        overshoot: overshoot || 0,

        duration: duration || "1000ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [phantomZone description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.phantomZone = function (elems, fade, rotate, flip, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("phantomZone: ", arguments);

    var opts = {
        scale: (fade === "in") ? {from: "1%", to: "100%"} : {from: "100%", to: "1%"},

        elems: elems,

        fade: fade || "out",
        rotate: rotate || -720,
        flip: flip || "left",

        duration: duration || "5000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [raceFlag description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} rotate            [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} direction         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.raceFlag = function (elems, rotate, perspectiveOrigin, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("raceFlag: ", arguments);

    var opts = {
        flip: "down",

        elems: elems,

        rotate: rotate || -720,
        perspectiveOrigin: perspectiveOrigin || "top-right",

        duration: duration || "3000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [slide description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} move      [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.slide = function (elems, move, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("slide: ", arguments);

    var opts = {
        elems: elems,

        move: move,
        overshoot: overshoot,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [spin description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} turns     [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.spin = function (elems, flip, turns, overshoot, duration, timing, delay, iteration, playstate) {
    "use strict";
    console.info("spin: ", arguments);

    var opts = {
        perspectiveOrigin: "center",
        direction: "normal",

        elems: elems,

        flip: flip || "left",
        turns: turns || 1,
        overshoot: overshoot || 0,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [toss description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} move              [description]
 * @param  {[type]} overshoot         [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} direction         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.toss = function (elems, move, overshoot, perspectiveOrigin, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("toss: ", arguments);

    var opts = {
        rotate: (move === "left" || move === "down") ? 720 : -720,
        fade: "in",

        elems: elems,

        move: move,
        overshoot: overshoot,
        perspectiveOrigin: perspectiveOrigin,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [twirl description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.twirl = function (elems, flip, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("twirl: ", arguments);

    var opts = {
        rotate: (flip === "left") ? -135 : 135,

        elems: elems,

        flip: flip || "left",

        duration: duration || "3000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [wobble description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} rotate            [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.wobble = function (elems, rotate, perspectiveOrigin, duration, timing, delay, iteration, playstate) {
    "use strict";
    console.info("wobble: ", arguments);

    var opts = {
        elems: elems,

        rotate: rotate || 5,
        perspectiveOrigin: perspectiveOrigin || "center",

        duration: duration || "200ms",
        timing: timing || "linear",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [zoom description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} scale     [description]
 * @param  {[type]} shadow    [description]
 * @param  {[type]} move      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.zoom = function (elems, scale, shadow, move, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("zoom: ", arguments);

    var scaleObj = {from: "100%", to: "125%"}; // default
    if (scale) {
        if (typeof scale === "object") {
            scaleObj = scale;
            //scaleObj = {from: alice.percentage(scale.from), to: alice.percentage(scale.to)};
        }
        else {
            scaleObj.to = scale;
        }
    }

    var opts = {
        elems: elems,

        scale: scaleObj,
        shadow: shadow || false,

        move: move || "none",

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

//----------------------------------------------------------------------------

/*jslint devel: true, browser: true, white: true, nomen: true */
/*global jWorkflow: false */

/* ===========================================================================
 * AliceJS
 *
 * @description
 * A Lightweight Independent CSS Engine
 *
 * @author Laurent Hasson (@ldhasson)
 * @author Jim Ing (@jim_ing)
 * ===========================================================================
 *
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @description
 *
 */
var alice = (function () {
    "use strict";

    var core = {
            id: "alice",
            name: "AliceJS",
            description: "A Lightweight Independent CSS Engine",
            version: "0.2",
            build: "20120204-1040",

            prefix: "",
            prefixJS: "",

            elems: null,

            format: {},
            helper: {},
            plugins: {},

            debug: false,

            /**
             * Returns array of elements
             */
            elements: function (params) {
                //console.info("elements", params, typeof params);
                var elems = [],
                    i;

                if (typeof params === "string") {
                    elems.push(document.getElementById(params)); // "myId1"
                }
                else if (typeof params === "object") {
                    if (params.length === undefined) {
                        elems.push(params); // myElem1
                    }
                    else if (params.length === 1) {
                        elems.push(document.getElementById(params[0])); // ["myId2"]
                    }
                    else if (params.length > 0) {
                        for (i = 0; i < params.length; i += 1) {
                            if (document.getElementById(params[i])) {
                                elems.push(document.getElementById(params[i])); // ["myId3-1", "myId3-2", "myId3-3"]
                            }
                            // Chrome NodeList
                            else {
                                // ignore Text
                                if (params[i].nodeType !== 3) {
                                    elems.push(params[i]); // myElem4.childNodes
                                }
                            }
                        }
                    }
                }
                // Safari NodeList
                else if (typeof params === "function") {
                    if (params.length > 0) {
                        for (i = 0; i < params.length; i += 1) {
                            // ignore Text
                            if (params[i].nodeType !== 3) {
                                elems.push(params[i]); // myElem4.childNodes
                            }
                        }
                    }
                }

                //console.log(elems);
                return elems;
            },

            /**
             * Returns random number +/- the factor
             */
            randomize: function (num, factor) {
                var f, r,
                    n = parseInt(num, 10);

                if (typeof factor === "string" && factor.indexOf("%") > -1) {
                    f = parseInt(factor, 10) / 100;
                }
                else {
                    f = parseFloat(factor, 10);
                }

                r = n + n * ((Math.random() * 2 * f) - f);

                //console.log("randomize:", "n=" + n, "factor=" + factor, "r=" + r);
                return Math.floor(r);
            },

            /**
             * Returns duration in milliseconds
             */
            duration: function (params) {
                //console.info("duration", params, typeof params);
                var dur,
                    parseNum = function (num) {
                        return num;
                    },
                    parseStr = function (str) {
                        var val;
                        if (str.indexOf("ms") > -1) {
                            val = parseInt(str, 10); // "1000ms", "1500ms"
                        }
                        else if (str.indexOf("s") > -1) {
                            val = parseFloat(str, 10) * 1000; // "1s", "1.5s"
                        }
                        else {
                            val = parseInt(str, 10); // "1000"
                        }
                        return val;
                    },
                    parseObj = function (obj) {
                        var val;
                        if (obj.value) {
                            if (typeof obj.value === "string") {
                                val = parseStr(obj.value);
                            }
                            else {
                                val = parseNum(obj.value); // {value: 2000}
                            }
                        }
                        return val;
                    };

                switch (typeof params) {
                case "number":
                    dur = parseNum(params);
                    break;
                case "string":
                    dur = parseStr(params);
                    break;
                case "object":
                    dur = parseObj(params);
                    break;
                default:
                    dur = params;
                }

                //console.log("duration:", "dur=" + dur);
                return dur;
            },

            /**
             * Returns x and y coordinates as percentages
             */
            coords: function (params) {
                //console.info("coords", params);
                if (params === undefined || params === null) {
                    return {x: "50%", y: "50%"}; // center
                }

                if (typeof params === "string") {
                    switch (params) {
                    // standard
                    case "top-left":
                        return {x: "0%", y: "0%"};
                    case "top-center":
                        return {x: "50%", y: "0%"};
                    case "top-right":
                        return {x: "100%", y: "0%"};
                    case "middle-left":
                        return {x: "0%", y: "50%"};
                    case "middle-center":
                        return {x: "50%", y: "50%"};
                    case "middle-right":
                        return {x: "100%", y: "50%"};
                    case "bottom-left":
                        return {x: "0%", y: "100%"};
                    case "bottom-center":
                        return {x: "50%", y: "100%"};
                    case "bottom-right":
                        return {x: "100%", y: "100%"};

                    // shortcuts
                    case "top":
                        return {x: "50%", y: "0%"};
                    case "left":
                        return {x: "0%", y: "50%"};
                    case "center":
                        return {x: "50%", y: "50%"};
                    case "right":
                        return {x: "100%", y: "50%"};
                    case "bottom":
                        return {x: "50%", y: "100%"};

                    // compass shortcuts
                    case "NW":
                        return {x: "0%", y: "0%"};
                    case "N":
                        return {x: "50%", y: "0%"};
                    case "NE":
                        return {x: "100%", y: "0%"};
                    case "W":
                        return {x: "0%", y: "50%"};
                    case "E":
                        return {x: "100%", y: "50%"};
                    case "SW":
                        return {x: "0%", y: "100%"};
                    case "S":
                        return {x: "50%", y: "100%"};
                    case "SE":
                        return {x: "100%", y: "100%"};

                    default:
                        return {x: "50%", y: "50%"}; // center
                    }
                }

                return params; // {x: 320, y: 240}
            },

            /**
             * Returns cubic bezier function
             */
            easing: function (params) {
                switch (params) {
                // Standard
                case "linear":
                    return {p1: 0.250, p2: 0.250, p3: 0.750, p4: 0.750};
                case "ease":
                    return {p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000};
                case "ease-in":
                    return {p1: 0.420, p2: 0.000, p3: 1.000, p4: 1.000};
                case "ease-out":
                    return {p1: 0.000, p2: 0.000, p3: 0.580, p4: 1.000};
                case "ease-in-out":
                    return {p1: 0.420, p2: 0.000, p3: 0.580, p4: 1.000};

                // Penner Equations (approximate)
                case "easeInQuad":
                    return {p1: 0.550, p2: 0.085, p3: 0.680, p4: 0.530};
                case "easeInCubic":
                    return {p1: 0.550, p2: 0.055, p3: 0.675, p4: 0.190};
                case "easeInQuart":
                    return {p1: 0.895, p2: 0.030, p3: 0.685, p4: 0.220};
                case "easeInQuint":
                    return {p1: 0.755, p2: 0.050, p3: 0.855, p4: 0.060};
                case "easeInSine":
                    return {p1: 0.470, p2: 0.000, p3: 0.745, p4: 0.715};
                case "easeInExpo":
                    return {p1: 0.950, p2: 0.050, p3: 0.795, p4: 0.035};
                case "easeInCirc":
                    return {p1: 0.600, p2: 0.040, p3: 0.980, p4: 0.335};
                case "easeInBack":
                    return {p1: 0.600, p2: -0.280, p3: 0.735, p4: 0.045};
                case "easeOutQuad":
                    return {p1: 0.250, p2: 0.460, p3: 0.450, p4: 0.940};
                case "easeOutCubic":
                    return {p1: 0.215, p2: 0.610, p3: 0.355, p4: 1.000};
                case "easeOutQuart":
                    return {p1: 0.165, p2: 0.840, p3: 0.440, p4: 1.000};
                case "easeOutQuint":
                    return {p1: 0.230, p2: 1.000, p3: 0.320, p4: 1.000};
                case "easeOutSine":
                    return {p1: 0.390, p2: 0.575, p3: 0.565, p4: 1.000};
                case "easeOutExpo":
                    return {p1: 0.190, p2: 1.000, p3: 0.220, p4: 1.000};
                case "easeOutCirc":
                    return {p1: 0.075, p2: 0.820, p3: 0.165, p4: 1.000};
                case "easeOutBack":
                    return {p1: 0.175, p2: 0.885, p3: 0.320, p4: 1.275};
                case "easeInOutQuad":
                    return {p1: 0.455, p2: 0.030, p3: 0.515, p4: 0.955};
                case "easeInOutCubic":
                    return {p1: 0.645, p2: 0.045, p3: 0.355, p4: 1.000};
                case "easeInOutQuart":
                    return {p1: 0.770, p2: 0.000, p3: 0.175, p4: 1.000};
                case "easeInOutQuint":
                    return {p1: 0.860, p2: 0.000, p3: 0.070, p4: 1.000};
                case "easeInOutSine":
                    return {p1: 0.445, p2: 0.050, p3: 0.550, p4: 0.950};
                case "easeInOutExpo":
                    return {p1: 1.000, p2: 0.000, p3: 0.000, p4: 1.000};
                case "easeInOutCirc":
                    return {p1: 0.785, p2: 0.135, p3: 0.150, p4: 0.860};
                case "easeInOutBack":
                    return {p1: 0.680, p2: -0.550, p3: 0.265, p4: 1.550};

                // Custom
                case "custom":
                    return {p1: 0.000, p2: 0.350, p3: 0.500, p4: 1.300};

                // Random (between 0 and 1)
                case "random":
                    return {
                        p1: Math.random().toPrecision(3),
                        p2: Math.random().toPrecision(3),
                        p3: Math.random().toPrecision(3),
                        p4: Math.random().toPrecision(3)
                    };

                default:
                    return {p1: 0.250, p2: 0.100, p3: 0.250, p4: 1.000}; // ease
                }
            },

            /**
             * Returns a flip object
             */
            flip: function (params, turns, overshoot) {
                var numTurns = turns || 1,
                    ret,
                    parseNum = function (num) {
                        return {start: 0, end: num, axis: "Y"};
                    },
                    parseStr = function (str) {
                        if (params === "left") {
                            return {start: 0, end: -360 * numTurns, axis: "Y"};
                        }
                        else if (params === "right") {
                            return {start: 0, end: 360 * numTurns, axis: "Y"};
                        }
                        else if (params === "up") {
                            return {start: 0, end: 360 * numTurns, axis: "X"};
                        }
                        else if (params === "down") {
                            return {start: 0, end: -360 * numTurns, axis: "X"};
                        }
                    },
                    parseObj = function (obj) {
                        var val;
                        if (obj.value) {
                            if (typeof obj.value === "string") {
                                val = parseStr(obj.value);
                            }
                            else {
                                val = parseNum(obj.value); // {value: -180}
                            }
                        }
                        return val;
                    };

                switch (typeof params) {
                case "number":
                    ret = parseNum(params);
                    break;
                case "string":
                    ret = parseStr(params);
                    break;
                case "object":
                    ret = parseObj(params);
                    break;
                default:
                    ret = null;
                }

                //console.warn(params, ret);
                return ret;
            },

            /**
             * Returns percentage in decimal form
             */
            percentage: function (params) {
                //console.info("percentage", params);
                var pct;

                if (typeof params === "string") {
                    if (params.indexOf("%") > -1 || params.indexOf("°") > -1) {
                        pct = parseInt(params, 10) / 100; // "5%" or "5°"
                    }
                    else {
                        if (params >= 1 || params <= -1) {
                            pct = parseInt(params, 10) / 100; // "5" or "-5"
                        }
                        else {
                            pct = parseFloat(params, 10); // "0.05" or "-0.05"
                        }
                    }
                }
                else if (typeof params === "number") {
                    if (params >= 1 || params <= -1) {
                        pct = params / 100; // 5 or -5
                    }
                    else {
                        pct = params; // 0.05 or -0.05
                    }
                }

                //console.log("percentage:", pct=" + pct);
                return pct;
            },

            /**
             * Set vendor prefix
             */
            vendorPrefix: function () {
                var el = document.createElement("div");

                // Safari 4+, iOS Safari 3.2+, Chrome 2+, and Android 2.1+
                if ("webkitAnimation" in el.style) {
                    this.prefix = "-webkit-";
                    this.prefixJS = "webkit";
                }
                // Firefox 5+
                else if ("MozAnimation" in el.style) {
                    this.prefix = "-moz-";
                    this.prefixJS = "Moz";
                }
                // Internet Explorer 10+
                else if ("MSAnimation" in el.style) {
                    this.prefix = "-ms-";
                    this.prefixJS = "MS";
                }
                // Opera 12+
                else if ("OAnimation" in el.style || "OTransform" in el.style) {
                    this.prefix = "-o-";
                    this.prefixJS = "O";
                }
                else {
                    this.prefix = "";
                    this.prefixJS = "";
                }

                if (this.debug) {
                    console.log("prefix=" + this.prefix, "prefixJS=" + this.prefixJS);
                }

                return;
            },

            /**
             * Get the document height
             */
            docHeight: function () {
                var D = document;

                return Math.max(
                Math.max(D.body.scrollHeight, D.documentElement.scrollHeight), Math.max(D.body.offsetHeight, D.documentElement.offsetHeight), Math.max(D.body.clientHeight, D.documentElement.clientHeight));
            },

            /**
             *
             */
            pixel: function (p, w) {
                if (typeof p === "number") {
                    // integers: 0, 1, 1024, ... n
                    if (p % 1 === 0) {
                        return p;
                    }
                    // floats: 0.1 ... 0.9
                    else {
                        return (parseFloat(p, 10)) * w;
                    }
                }
                // 1024px
                if (p.indexOf("px") > -1) {
                    return parseInt(p, 10);
                }
                // 80%, 100%
                if (p.indexOf("%") > -1) {
                    return Math.round((parseInt(p, 10) / 100) * w);
                }
            },

            /**
             * Insert CSS keyframe rule
             */
            keyframeInsert: function (rule) {
                if (document.styleSheets && document.styleSheets.length) {
                    try {
                        document.styleSheets[0].insertRule(rule, 0);
                    }
                    catch (ex) {
                        console.warn(ex.message, rule);
                    }
                }
                else {
                    var style = document.createElement("style");
                    style.innerHTML = rule;
                    document.head.appendChild(style);
                }

                return;
            },

            /**
             * Delete CSS keyframe rule
             */
            keyframeDelete: function (ruleName) {
                var cssrules = (document.all) ? "rules" : "cssRules",
                    i;

                for (i = 0; i < document.styleSheets[0][cssrules].length; i += 1) {
                    if (document.styleSheets[0][cssrules][i].name === ruleName) {
                        document.styleSheets[0].deleteRule(i);
                        if (this.debug) {
                            console.log("Deleted keyframe: " + ruleName);
                        }
                        break;
                    }
                }

                return;
            },

            /**
             * Clear animation settings
             */
            clearAnimation: function (evt) {
                //console.info("_clearAnimation", this, evt.srcElement.id, evt.animationName, evt.elapsedTime);
                this.style[this.prefixJS + "AnimationName"] = "";
                this.style[this.prefixJS + "AnimationDelay"] = "";
                this.style[this.prefixJS + "AnimationDuration"] = "";
                this.style[this.prefixJS + "AnimationTimingFunction"] = "";
                this.style[this.prefixJS + "AnimationIterationCount"] = "";
                this.style[this.prefixJS + "AnimationDirection"] = "";
                //this.style[this.prefixJS + "AnimationFillMode"] = "";
                this.style[this.prefixJS + "AnimationPlayState"] = "";

                // TODO: add evt.animationName to a delete queue?
                alice.keyframeDelete(evt.animationName);

                return;
            },

            /**
             * Initialize
             */
            init: function (params) {
                console.info("Initializing " + this.name + " (" + this.description + ") " + this.version);

                this.vendorPrefix();

                if (params && params.elems) {
                    this.elems = this.elements(params.elems);
                    //console.log(this.elems);
                }

                // Add optional support for jWorkflow (https://github.com/tinyhippos/jWorkflow)
                if (typeof jWorkflow !== "undefined") {
                    console.log("jWorkflow: enabled");

                    var id = (params && params.id) ? params.id : '',

                        workflow = jWorkflow.order(),

                        animation = {
                            delay: function (ms) {
                                workflow.chill(ms);
                                return animation;
                            },
                            log: function (msg) {
                                workflow.andThen(function () {
                                    console.log(msg);
                                });
                                return animation;
                            },
                            custom: function (func) {
                                workflow.andThen(func);
                                return animation;
                            },
                            start: function () {
                                workflow.start(function () {
                                    console.info("workflow.start");
                                });
                            }
                        };

                    Array.prototype.forEach.call(Object.keys(core.plugins), function (plugin) {
                        var func = core.plugins[plugin];
                        animation[plugin] = function () {
                            var args = arguments;
                            workflow.andThen(function () {
                                func.apply(document.getElementById(id), args);
                            });
                            return animation;
                        };
                    });

                    return animation;
                }
                else {
                    console.log("jWorkflow: disabled");
                }

                return core.plugins;
            }
        };

    return core;
}());

/**
 *
 */
alice.format = {
    /**
     *
     */
    duration: function (params) {
        "use strict";
        var d = 0, r = 0, dur = 0;

        d = alice.duration(params);
        dur = d;

        if (params.randomness) {
            r = alice.randomize(d, alice.percentage(params.randomness));
            dur = Math.abs(r);
        }

        //console.log(d, r, dur);
        return dur + "ms";
    },

    /**
     *
     */
    coords: function (c) {
        "use strict";
        var cObj = alice.coords(c),
            cVal = cObj.x + " " + cObj.y;
        return cVal;
    },

    /**
     *
     */
    easing: function (e) {
        "use strict";
        var eObj = alice.easing(e),
            eVal = "cubic-bezier(" + eObj.p1 + ", " + eObj.p2 + ", " + eObj.p3 + ", " + eObj.p4 + ")";
        return eVal;
    },

    /**
     *
     */
    oppositeNumber: function (n) {
        "use strict";
        return -n;
    }
};

/**
 *
 */
alice.helper = {
    /**
     *
     */
    duration: function (param, calc, duration) {
        if (param && param.offset) {
            if (calc) {
                calc = parseInt(calc, 10) + parseInt(param.offset, 10);
            }
            else {
                calc = parseInt(alice.format.duration(duration), 10);
            }
            calc += "ms";
            //console.log(duration, param.value, param.offset, calc);
        }
        else {
            calc = parseInt(alice.format.duration(duration), 10) + "ms";
        }
        return calc;
    },

    /**
     *
     */
    rotation: function (rotate, params) {
        "use strict";
        var val = rotate;
        if (params.randomness) {
            val = alice.randomize(val, alice.percentage(params.randomness));
            //console.log("rotation:", "rotate=" + rotate, "params.randomness=" + params.randomness, "val=" + val);
        }
        return val;
    }
};

//----------------------------------------------------------------------------

/*jslint devel: true, browser: true, white: true, nomen: true */
/*global alice: false */

/* ===========================================================================
 * alice.plugins.cheshire.js
 * ===========================================================================
 *
 * Copyright 2011-2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * [cheshire description]
 * @param  {[type]} params [description]
 * @return {[type]}
 */
alice.plugins.cheshire = function (params) {
    "use strict";

    console.info("cheshire", params);

    var
        // Initialize variables and set defaults
        delay = params.delay || "0ms",
        duration = params.duration || "2000ms",

        timing = params.timing || "ease",
        iteration = params.iteration || 1,
        direction = params.direction || "normal",
        playstate = params.playstate || "running",

        perspective = params.perspective || "1000",
        perspectiveOrigin = params.perspectiveOrigin || "center",
        backfaceVisibility = params.backfaceVisibility || "visible",

        overshoot = alice.percentage(params.overshoot) || 0,
        overShootPercent = 85,

        rotate = params.rotate || 0,

        turns = params.turns || 1,

        flip = alice.flip(params.flip, turns, overshoot),

        fade = (params.fade && params.fade !== "") ? params.fade : null,
        fadeStart = (fade && fade === "out") ? 1 : 0,
        fadeEnd = (fade && fade === "out") ? 0 : 1,

        scaleFrom = (params.scale && params.scale.from) ? alice.percentage(params.scale.from) : 1,
        scaleTo = (params.scale && params.scale.to) ? alice.percentage(params.scale.to) : 1,
        shadow = params.shadow || false,

        move = "",
        axis = "",
        sign = 1,
        posStart = 0,
        posEnd = params.posEnd || 0,
        over = posEnd + (sign * Math.floor(posEnd * overshoot)),

        // temporary variables
        calc = {},
        container, elems, elem, i, animId, css, transformStart, transformOver, transformEnd, boxShadowStart, boxShadowEnd, dir, size, shadowSize;

    // TODO: use elems from init for chaining?
    if (alice.elems !== null) {
        elems = alice.elems;
    }
    else if (params.elems) {
        elems = alice.elements(params.elems);
    }

    // Loop through elements
    if (elems && elems.length > 0) {
        for (i = 0; i < elems.length; i += 1) {
            elem = elems[i];
            container = elem.parentElement || elem.parentNode;

            // Recalculate delay and duration for each element
            calc.delay = alice.helper.duration(params.delay, calc.delay, delay);
            calc.duration = alice.helper.duration(params.duration, calc.duration, duration);

            // Recalculate rotation with randomization for each element
            calc.rotate = alice.helper.rotation(rotate, params);
            calc.rotateStart = alice.percentage(calc.rotate) * 100;
            calc.rotateOver = overshoot * 100;
            calc.rotateEnd = 0;

            // Generate animation ID
            animId = alice.id + "-cheshire-" + (new Date()).getTime() + "-" + Math.floor(Math.random() * 1000000);

            // Configure settings
            if (params.move) {
                dir = params.move.direction || params.move;
                switch (dir) {
                case "left":
                    move = "Left";
                    axis = "X";
                    sign = -1;
                    size = window.innerWidth;
                    posStart = (params.move.start) ? alice.pixel(params.move.start, size) : size;
                    posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : 0;
                    over = sign * Math.floor(posStart * overshoot);
                    break;
                case "right":
                    move = "Right";
                    axis = "X";
                    sign = 1;
                    size = document.body.offsetWidth - elem.clientWidth;
                    posStart = (params.move.start) ? alice.pixel(params.move.start, size) : 0;
                    posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : size;
                    over = posEnd + (sign * Math.floor(posEnd * overshoot));
                    break;
                case "up":
                    move = "Up";
                    axis = "Y";
                    sign = -1;
                    size = window.innerHeight;
                    posStart = (params.move.start) ? alice.pixel(params.move.start, size) : size;
                    posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : 0;
                    over = sign * Math.floor(posStart * overshoot);
                    break;
                case "down":
                    move = "Down";
                    axis = "Y";
                    sign = 1;
                    size = alice.docHeight() - (container.clientHeight * 3);
                    posStart = (params.move.start) ? alice.pixel(params.move.start, size) : 0;
                    posEnd = (params.move.end) ? alice.pixel(params.move.end, size) : size;
                    over = posEnd + (sign * Math.floor(posEnd * overshoot));

                    if (alice.debug) {
                        console.log(alice.docHeight(), window.innerHeight, window.pageYOffset, container.clientHeight);
                    }
                    break;
                }
            }

            // Generate transforms
            transformStart = "";
            transformStart += (flip) ? " rotate" + flip.axis + "(" + flip.start + "deg)" : " translate" + axis + "(" + posStart + "px)";
            transformStart += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateStart + "deg)" : "";
            transformStart += " scale(" + scaleFrom + ")";

            transformOver = "";
            transformOver += (flip) ? " rotate" + flip.axis + "(" + Math.floor((1 + overshoot) * flip.end) + "deg)" : " translate" + axis + "(" + over + "px)";
            transformOver += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateOver + "deg)" : "";
            transformOver += (scaleTo > 1) ? " scale(" + scaleTo + ")" : "";
            transformOver += " scale(" + scaleTo + ")";

            transformEnd = "";
            transformEnd += (flip) ? " rotate" + flip.axis + "(" + flip.end + "deg)" : " translate" + axis + "(" + posEnd + "px)";

            if (move === "" && direction === "alternate") {
                transformEnd += " rotate(" + alice.format.oppositeNumber(calc.rotateStart) + "deg)";
            }
            else {
                transformEnd += (calc.rotate && parseInt(calc.rotate, 10) !== 0) ? " rotate(" + calc.rotateEnd + "deg)" : "";
            }

            transformEnd += " scale(" + scaleTo + ")";

            // Generate box shadow
            if (shadow === true && scaleTo > 1) {
                shadowSize = Math.round(scaleTo * 10);
                boxShadowStart = " 0px 0px 0px rgba(0, 0, 0, 1)";
                boxShadowEnd = " " + shadowSize + "px " + shadowSize + "px " + shadowSize + "px rgba(0, 0, 0, 0.5)";
            }

            // Generate CSS for keyframe rule
            css = "";
            css += "@" + alice.prefix + "keyframes " + animId + " {\n";

            css += "\t" + "0% {" + "\n";
            css += "\t\t" + alice.prefix + "transform:" + transformStart + ";" + "\n";
            css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
            css += (fade) ? "\t\t" + "opacity: " + fadeStart + ";" + "\n" : "";
            css += (shadow === true && scaleTo > 1) ? "\t\t" + alice.prefix + "box-shadow: " + boxShadowStart + ";" + "\n" : "";

            css += "\t" + "}" + "\n";

            if (overshoot !== 0) {
                css += "\t" + overShootPercent + "% {\n";
                css += "\t\t" + alice.prefix + "transform:" + transformOver + ";" + "\n";
                css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
                css += "\t" + "}" + "\n";
            }

            css += "\t" + "100% {" + "\n";
            css += "\t\t" + alice.prefix + "transform:" + transformEnd + ";" + "\n";
            css += "\t\t" + alice.prefix + "transform-origin:" + alice.format.coords(perspectiveOrigin) + ";" + "\n";
            css += (fade) ? "\t\t" + "opacity: " + fadeEnd + ";" + "\n" : "";
            css += (shadow === true && scaleTo > 1) ? "\t\t" + alice.prefix + "box-shadow: " + boxShadowEnd + ";" + "\n" : "";

            css += "\t" + "}" + "\n";

            css += "}" + "\n";

            //console.log(css);

            // Insert keyframe rule
            alice.keyframeInsert(css);

            // Apply perspective to parent container
            container.style[alice.prefixJS + "Perspective"] = perspective + "px";
            container.style[alice.prefixJS + "PerspectiveOrigin"] = alice.format.coords(perspectiveOrigin); // alice.coords();

            // Apply properties to elements
            elem.style[alice.prefixJS + "BackfaceVisibility"] = backfaceVisibility;

            elem.style[alice.prefixJS + "AnimationName"] = animId;
            elem.style[alice.prefixJS + "AnimationDelay"] = calc.delay;
            elem.style[alice.prefixJS + "AnimationDuration"] = calc.duration;
            elem.style[alice.prefixJS + "AnimationTimingFunction"] = alice.format.easing(timing);
            elem.style[alice.prefixJS + "AnimationIterationCount"] = iteration;
            elem.style[alice.prefixJS + "AnimationDirection"] = direction;
            elem.style[alice.prefixJS + "AnimationPlayState"] = playstate;

            // Apply styles from last key frame
            elem.style[alice.prefixJS + "Transform"] = transformEnd;
            elem.style.opacity = (fade) ? fadeEnd : "";
            elem.style[alice.prefixJS + "BoxShadow"] = (shadow === true && scaleTo > 1) ? boxShadowEnd : "";

            // Add listener to clear animation after it's done
            if ("MozAnimation" in elem.style) {
                elem.addEventListener("animationend", alice.clearAnimation, false);
            }
            else {
                elem.addEventListener(alice.prefixJS + "AnimationEnd", alice.clearAnimation, false);
            }

            if (alice.debug) {
                console.log(css);
                console.log(container.style);
                console.log(elem.id, alice.prefixJS, elem.style, elem.style.cssText, elem.style[alice.prefixJS + "AnimationDuration"], elem.style[alice.prefixJS + "AnimationTimingFunction"]);
            }
        }
    }
    else {
        console.warn("No elements!");
    }

    return params;
};

//---[ Shortcut Methods ]-----------------------------------------------------

/*
 * CSS Syntax:
 *     animation: name duration timing-function delay iteration-count direction;
 *
 * Parameter Syntax:
 *     elems, <options>, duration, timing, delay, iteration, direction, playstate
 */

/**
 * [bounce description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} scale     [description]
 * @param  {[type]} shadow    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.bounce = function (elems, scale, shadow, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("bounce: ", arguments);

    var scaleObj = {from: "100%", to: "125%"}; // default
    if (scale) {
        if (typeof scale === "object") {
            scaleObj = scale;
        }
        else {
            scaleObj.to = scale;
        }
    }

    var opts = {
        elems: elems,

        //scale: scale || {from: "100%", to: "125%"},
        scale: scaleObj,
        shadow: shadow || false,

        duration: duration || "750ms",
        timing: timing || "easeOutSine",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [dance description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.dance = function (elems, rotate, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("dance: ", arguments);

    var opts = {
        elems: elems,

        rotate: rotate || 45,

        duration: duration || "750ms",
        timing: timing || "easeInOutBack",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [drain description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.drain = function (elems, fade, rotate, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("drain: ", arguments);

    var opts = {
        scale: (fade === "in") ? {from: "1%", to: "100%"} : {from: "100%", to: "1%"},

        elems: elems,

        fade: fade || "out",
        rotate: rotate || -2880,

        duration: duration || "4500ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [fade description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.fade = function (elems, fade, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("fade: ", arguments);

    var opts = {
        elems: elems,

        fade: fade || "in",

        duration: duration || "4500ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [hinge description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.hinge = function (elems, rotate, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("hinge: ", arguments);

    var opts = {
        perspectiveOrigin: "top-left",

        elems: elems,

        rotate: rotate || 25,
        overshoot: overshoot || 0,

        duration: duration || "1000ms",
        timing: timing || "linear",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [pageFlip description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} turns     [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.pageFlip = function (elems, flip, turns, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("pageFlip: ", arguments);

    var perspectiveOrigin = "left";

    switch (flip) {
    case "right":
        perspectiveOrigin = "right";
        break;
    case "up":
        perspectiveOrigin = "top";
        break;
    case "down":
        perspectiveOrigin = "bottom";
        break;
    }

    var opts = {
        perspectiveOrigin: perspectiveOrigin,

        elems: elems,

        flip: flip || "left",
        turns: turns || 1,
        overshoot: overshoot || 0,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [pendulum description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.pendulum = function (elems, rotate, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("pendulum: ", arguments);

    var opts = {
        perspectiveOrigin: "top",

        elems: elems,

        rotate: rotate || 45,
        overshoot: overshoot || 0,

        duration: duration || "1000ms",
        timing: timing || "ease-in-out",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: direction || "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [phantomZone description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} fade      [description]
 * @param  {[type]} rotate    [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.phantomZone = function (elems, fade, rotate, flip, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("phantomZone: ", arguments);

    var opts = {
        scale: (fade === "in") ? {from: "1%", to: "100%"} : {from: "100%", to: "1%"},

        elems: elems,

        fade: fade || "out",
        rotate: rotate || -720,
        flip: flip || "left",

        duration: duration || "5000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [raceFlag description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} rotate            [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} direction         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.raceFlag = function (elems, rotate, perspectiveOrigin, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("raceFlag: ", arguments);

    var opts = {
        flip: "down",

        elems: elems,

        rotate: rotate || -720,
        perspectiveOrigin: perspectiveOrigin || "top-right",

        duration: duration || "3000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [slide description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} move      [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.slide = function (elems, move, overshoot, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("slide: ", arguments);

    var opts = {
        elems: elems,

        move: move,
        overshoot: overshoot,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [spin description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} turns     [description]
 * @param  {[type]} overshoot [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.spin = function (elems, flip, turns, overshoot, duration, timing, delay, iteration, playstate) {
    "use strict";
    console.info("spin: ", arguments);

    var opts = {
        perspectiveOrigin: "center",
        direction: "normal",

        elems: elems,

        flip: flip || "left",
        turns: turns || 1,
        overshoot: overshoot || 0,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [toss description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} move              [description]
 * @param  {[type]} overshoot         [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} direction         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.toss = function (elems, move, overshoot, perspectiveOrigin, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("toss: ", arguments);

    var opts = {
        rotate: (move === "left" || move === "down") ? 720 : -720,
        fade: "in",

        elems: elems,

        move: move,
        overshoot: overshoot,
        perspectiveOrigin: perspectiveOrigin,

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration,
        direction: direction,
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [twirl description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} flip      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.twirl = function (elems, flip, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("twirl: ", arguments);

    var opts = {
        rotate: (flip === "left") ? -135 : 135,

        elems: elems,

        flip: flip || "left",

        duration: duration || "3000ms",
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [wobble description]
 * @param  {[type]} elems             [description]
 * @param  {[type]} rotate            [description]
 * @param  {[type]} perspectiveOrigin [description]
 * @param  {[type]} duration          [description]
 * @param  {[type]} timing            [description]
 * @param  {[type]} delay             [description]
 * @param  {[type]} iteration         [description]
 * @param  {[type]} playstate         [description]
 * @return {[type]}
 */
alice.plugins.wobble = function (elems, rotate, perspectiveOrigin, duration, timing, delay, iteration, playstate) {
    "use strict";
    console.info("wobble: ", arguments);

    var opts = {
        elems: elems,

        rotate: rotate || 5,
        perspectiveOrigin: perspectiveOrigin || "center",

        duration: duration || "200ms",
        timing: timing || "linear",
        delay: delay || "0ms",
        iteration: iteration || "infinite",
        direction: "alternate",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

/**
 * [zoom description]
 * @param  {[type]} elems     [description]
 * @param  {[type]} scale     [description]
 * @param  {[type]} shadow    [description]
 * @param  {[type]} move      [description]
 * @param  {[type]} duration  [description]
 * @param  {[type]} timing    [description]
 * @param  {[type]} delay     [description]
 * @param  {[type]} iteration [description]
 * @param  {[type]} direction [description]
 * @param  {[type]} playstate [description]
 * @return {[type]}
 */
alice.plugins.zoom = function (elems, scale, shadow, move, duration, timing, delay, iteration, direction, playstate) {
    "use strict";
    console.info("zoom: ", arguments);

    var scaleObj = {from: "100%", to: "125%"}; // default
    if (scale) {
        if (typeof scale === "object") {
            scaleObj = scale;
            //scaleObj = {from: alice.percentage(scale.from), to: alice.percentage(scale.to)};
        }
        else {
            scaleObj.to = scale;
        }
    }

    var opts = {
        elems: elems,

        scale: scaleObj,
        shadow: shadow || false,

        move: move || "none",

        duration: duration,
        timing: timing,
        delay: delay,
        iteration: iteration || 1,
        direction: direction || "normal",
        playstate: playstate
    };

    alice.plugins.cheshire(opts);
    return opts;
};

//----------------------------------------------------------------------------

/*! Socket.IO.js build:0.8.7, development. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, global) {

  /**
   * IO namespace.
   *
   * @namespace
   */

  var io = exports;

  /**
   * Socket.IO version
   *
   * @api public
   */

  io.version = '0.8.7';

  /**
   * Protocol implemented.
   *
   * @api public
   */

  io.protocol = 1;

  /**
   * Available transports, these will be populated with the available transports
   *
   * @api public
   */

  io.transports = [];

  /**
   * Keep track of jsonp callbacks.
   *
   * @api private
   */

  io.j = [];

  /**
   * Keep track of our io.Sockets
   *
   * @api private
   */
  io.sockets = {};


  /**
   * Manages connections to hosts.
   *
   * @param {String} uri
   * @Param {Boolean} force creation of new socket (defaults to false)
   * @api public
   */

  io.connect = function (host, details) {
    var uri = io.util.parseUri(host)
      , uuri
      , socket;

    if (global && global.location) {
      uri.protocol = uri.protocol || global.location.protocol.slice(0, -1);
      uri.host = uri.host || (global.document
        ? global.document.domain : global.location.hostname);
      uri.port = uri.port || global.location.port;
    }

    uuri = io.util.uniqueUri(uri);

    var options = {
        host: uri.host
      , secure: 'https' == uri.protocol
      , port: uri.port || ('https' == uri.protocol ? 443 : 80)
      , query: uri.query || ''
    };

    io.util.merge(options, details);

    if (options['force new connection'] || !io.sockets[uuri]) {
      socket = new io.Socket(options);
    }

    if (!options['force new connection'] && socket) {
      io.sockets[uuri] = socket;
    }

    socket = socket || io.sockets[uuri];

    // if path is different from '' or /
    return socket.of(uri.path.length > 1 ? uri.path : '');
  };

})('object' === typeof module ? module.exports : (this.io = {}), this);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, global) {

  /**
   * Utilities namespace.
   *
   * @namespace
   */

  var util = exports.util = {};

  /**
   * Parses an URI
   *
   * @author Steven Levithan <stevenlevithan.com> (MIT license)
   * @api public
   */

  var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

  var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password',
               'host', 'port', 'relative', 'path', 'directory', 'file', 'query',
               'anchor'];

  util.parseUri = function (str) {
    var m = re.exec(str || '')
      , uri = {}
      , i = 14;

    while (i--) {
      uri[parts[i]] = m[i] || '';
    }

    return uri;
  };

  /**
   * Produces a unique url that identifies a Socket.IO connection.
   *
   * @param {Object} uri
   * @api public
   */

  util.uniqueUri = function (uri) {
    var protocol = uri.protocol
      , host = uri.host
      , port = uri.port;

    if ('document' in global) {
      host = host || document.domain;
      port = port || (protocol == 'https'
        && document.location.protocol !== 'https:' ? 443 : document.location.port);
    } else {
      host = host || 'localhost';

      if (!port && protocol == 'https') {
        port = 443;
      }
    }

    return (protocol || 'http') + '://' + host + ':' + (port || 80);
  };

  /**
   * Mergest 2 query strings in to once unique query string
   *
   * @param {String} base
   * @param {String} addition
   * @api public
   */

  util.query = function (base, addition) {
    var query = util.chunkQuery(base || '')
      , components = [];

    util.merge(query, util.chunkQuery(addition || ''));
    for (var part in query) {
      if (query.hasOwnProperty(part)) {
        components.push(part + '=' + query[part]);
      }
    }

    return components.length ? '?' + components.join('&') : '';
  };

  /**
   * Transforms a querystring in to an object
   *
   * @param {String} qs
   * @api public
   */

  util.chunkQuery = function (qs) {
    var query = {}
      , params = qs.split('&')
      , i = 0
      , l = params.length
      , kv;

    for (; i < l; ++i) {
      kv = params[i].split('=');
      if (kv[0]) {
        query[kv[0]] = decodeURIComponent(kv[1]);
      }
    }

    return query;
  };

  /**
   * Executes the given function when the page is loaded.
   *
   *     io.util.load(function () { console.log('page loaded'); });
   *
   * @param {Function} fn
   * @api public
   */

  var pageLoaded = false;

  util.load = function (fn) {
    if ('document' in global && document.readyState === 'complete' || pageLoaded) {
      return fn();
    }

    util.on(global, 'load', fn, false);
  };

  /**
   * Adds an event.
   *
   * @api private
   */

  util.on = function (element, event, fn, capture) {
    if (element.attachEvent) {
      element.attachEvent('on' + event, fn);
    } else if (element.addEventListener) {
      element.addEventListener(event, fn, capture);
    }
  };

  /**
   * Generates the correct `XMLHttpRequest` for regular and cross domain requests.
   *
   * @param {Boolean} [xdomain] Create a request that can be used cross domain.
   * @returns {XMLHttpRequest|false} If we can create a XMLHttpRequest.
   * @api private
   */

  util.request = function (xdomain) {

    if (xdomain && 'undefined' != typeof XDomainRequest) {
      return new XDomainRequest();
    }

    if ('undefined' != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) {
      return new XMLHttpRequest();
    }

    if (!xdomain) {
      try {
        return new ActiveXObject('Microsoft.XMLHTTP');
      } catch(e) { }
    }

    return null;
  };

  /**
   * XHR based transport constructor.
   *
   * @constructor
   * @api public
   */

  /**
   * Change the internal pageLoaded value.
   */

  if ('undefined' != typeof window) {
    util.load(function () {
      pageLoaded = true;
    });
  }

  /**
   * Defers a function to ensure a spinner is not displayed by the browser
   *
   * @param {Function} fn
   * @api public
   */

  util.defer = function (fn) {
    if (!util.ua.webkit || 'undefined' != typeof importScripts) {
      return fn();
    }

    util.load(function () {
      setTimeout(fn, 100);
    });
  };

  /**
   * Merges two objects.
   *
   * @api public
   */
  
  util.merge = function merge (target, additional, deep, lastseen) {
    var seen = lastseen || []
      , depth = typeof deep == 'undefined' ? 2 : deep
      , prop;

    for (prop in additional) {
      if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
        if (typeof target[prop] !== 'object' || !depth) {
          target[prop] = additional[prop];
          seen.push(additional[prop]);
        } else {
          util.merge(target[prop], additional[prop], depth - 1, seen);
        }
      }
    }

    return target;
  };

  /**
   * Merges prototypes from objects
   *
   * @api public
   */
  
  util.mixin = function (ctor, ctor2) {
    util.merge(ctor.prototype, ctor2.prototype);
  };

  /**
   * Shortcut for prototypical and static inheritance.
   *
   * @api private
   */

  util.inherit = function (ctor, ctor2) {
    function f() {};
    f.prototype = ctor2.prototype;
    ctor.prototype = new f;
  };

  /**
   * Checks if the given object is an Array.
   *
   *     io.util.isArray([]); // true
   *     io.util.isArray({}); // false
   *
   * @param Object obj
   * @api public
   */

  util.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  /**
   * Intersects values of two arrays into a third
   *
   * @api public
   */

  util.intersect = function (arr, arr2) {
    var ret = []
      , longest = arr.length > arr2.length ? arr : arr2
      , shortest = arr.length > arr2.length ? arr2 : arr;

    for (var i = 0, l = shortest.length; i < l; i++) {
      if (~util.indexOf(longest, shortest[i]))
        ret.push(shortest[i]);
    }

    return ret;
  }

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  util.indexOf = function (arr, o, i) {
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, o, i);
    }

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0; 
         i < j && arr[i] !== o; i++) {}

    return j <= i ? -1 : i;
  };

  /**
   * Converts enumerables to array.
   *
   * @api public
   */

  util.toArray = function (enu) {
    var arr = [];

    for (var i = 0, l = enu.length; i < l; i++)
      arr.push(enu[i]);

    return arr;
  };

  /**
   * UA / engines detection namespace.
   *
   * @namespace
   */

  util.ua = {};

  /**
   * Whether the UA supports CORS for XHR.
   *
   * @api public
   */

  util.ua.hasCORS = 'undefined' != typeof XMLHttpRequest && (function () {
    try {
      var a = new XMLHttpRequest();
    } catch (e) {
      return false;
    }

    return a.withCredentials != undefined;
  })();

  /**
   * Detect webkit.
   *
   * @api public
   */

  util.ua.webkit = 'undefined' != typeof navigator
    && /webkit/i.test(navigator.userAgent);

})('undefined' != typeof io ? io : module.exports, this);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.EventEmitter = EventEmitter;

  /**
   * Event emitter constructor.
   *
   * @api public.
   */

  function EventEmitter () {};

  /**
   * Adds a listener
   *
   * @api public
   */

  EventEmitter.prototype.on = function (name, fn) {
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[name]) {
      this.$events[name] = fn;
    } else if (io.util.isArray(this.$events[name])) {
      this.$events[name].push(fn);
    } else {
      this.$events[name] = [this.$events[name], fn];
    }

    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  /**
   * Adds a volatile listener.
   *
   * @api public
   */

  EventEmitter.prototype.once = function (name, fn) {
    var self = this;

    function on () {
      self.removeListener(name, on);
      fn.apply(this, arguments);
    };

    on.listener = fn;
    this.on(name, on);

    return this;
  };

  /**
   * Removes a listener.
   *
   * @api public
   */

  EventEmitter.prototype.removeListener = function (name, fn) {
    if (this.$events && this.$events[name]) {
      var list = this.$events[name];

      if (io.util.isArray(list)) {
        var pos = -1;

        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
            pos = i;
            break;
          }
        }

        if (pos < 0) {
          return this;
        }

        list.splice(pos, 1);

        if (!list.length) {
          delete this.$events[name];
        }
      } else if (list === fn || (list.listener && list.listener === fn)) {
        delete this.$events[name];
      }
    }

    return this;
  };

  /**
   * Removes all listeners for an event.
   *
   * @api public
   */

  EventEmitter.prototype.removeAllListeners = function (name) {
    // TODO: enable this when node 0.5 is stable
    //if (name === undefined) {
      //this.$events = {};
      //return this;
    //}

    if (this.$events && this.$events[name]) {
      this.$events[name] = null;
    }

    return this;
  };

  /**
   * Gets all listeners for a certain event.
   *
   * @api publci
   */

  EventEmitter.prototype.listeners = function (name) {
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[name]) {
      this.$events[name] = [];
    }

    if (!io.util.isArray(this.$events[name])) {
      this.$events[name] = [this.$events[name]];
    }

    return this.$events[name];
  };

  /**
   * Emits an event.
   *
   * @api public
   */

  EventEmitter.prototype.emit = function (name) {
    if (!this.$events) {
      return false;
    }

    var handler = this.$events[name];

    if (!handler) {
      return false;
    }

    var args = Array.prototype.slice.call(arguments, 1);

    if ('function' == typeof handler) {
      handler.apply(this, args);
    } else if (io.util.isArray(handler)) {
      var listeners = handler.slice();

      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
    } else {
      return false;
    }

    return true;
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Based on JSON2 (http://www.JSON.org/js.html).
 */

(function (exports, nativeJSON) {
  "use strict";

  // use native JSON if it's available
  if (nativeJSON && nativeJSON.parse){
    return exports.JSON = {
      parse: nativeJSON.parse
    , stringify: nativeJSON.stringify
    }
  }

  var JSON = exports.JSON = {};

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  function date(d, key) {
    return isFinite(d.valueOf()) ?
        d.getUTCFullYear()     + '-' +
        f(d.getUTCMonth() + 1) + '-' +
        f(d.getUTCDate())      + 'T' +
        f(d.getUTCHours())     + ':' +
        f(d.getUTCMinutes())   + ':' +
        f(d.getUTCSeconds())   + 'Z' : null;
  };

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap,
      indent,
      meta = {    // table of character substitutions
          '\b': '\\b',
          '\t': '\\t',
          '\n': '\\n',
          '\f': '\\f',
          '\r': '\\r',
          '"' : '\\"',
          '\\': '\\\\'
      },
      rep;


  function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
          var c = meta[a];
          return typeof c === 'string' ? c :
              '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
  }


  function str(key, holder) {

// Produce a string from holder[key].

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

      if (value instanceof Date) {
          value = date(key);
      }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

      if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
      }

// What happens next depends on the value's type.

      switch (typeof value) {
      case 'string':
          return quote(value);

      case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

          return isFinite(value) ? String(value) : 'null';

      case 'boolean':
      case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

          return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

      case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

          if (!value) {
              return 'null';
          }

// Make an array to hold the partial results of stringifying this object value.

          gap += indent;
          partial = [];

// Is the value an array?

          if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

              length = value.length;
              for (i = 0; i < length; i += 1) {
                  partial[i] = str(i, value) || 'null';
              }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

              v = partial.length === 0 ? '[]' : gap ?
                  '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                  '[' + partial.join(',') + ']';
              gap = mind;
              return v;
          }

// If the replacer is an array, use it to select the members to be stringified.

          if (rep && typeof rep === 'object') {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                  if (typeof rep[i] === 'string') {
                      k = rep[i];
                      v = str(k, value);
                      if (v) {
                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                  }
              }
          } else {

// Otherwise, iterate through all of the keys in the object.

              for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = str(k, value);
                      if (v) {
                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                  }
              }
          }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

          v = partial.length === 0 ? '{}' : gap ?
              '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
              '{' + partial.join(',') + '}';
          gap = mind;
          return v;
      }
  }

// If the JSON object does not yet have a stringify method, give it one.

  JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

      if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
              indent += ' ';
          }

// If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
          indent = space;
      }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
              (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
      }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

      return str('', {'': value});
  };

// If the JSON object does not yet have a parse method, give it one.

  JSON.parse = function (text, reviver) {
  // The parse method takes a text and an optional reviver function, and returns
  // a JavaScript value if the text is a valid JSON text.

      var j;

      function walk(holder, key) {

  // The walk method is used to recursively walk the resulting structure so
  // that modifications can be made.

          var k, v, value = holder[key];
          if (value && typeof value === 'object') {
              for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = walk(value, k);
                      if (v !== undefined) {
                          value[k] = v;
                      } else {
                          delete value[k];
                      }
                  }
              }
          }
          return reviver.call(holder, key, value);
      }


  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
          text = text.replace(cx, function (a) {
              return '\\u' +
                  ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          });
      }

  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.

  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

      if (/^[\],:{}\s]*$/
              .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                  .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                  .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

  // In the third stage we use the eval function to compile the text into a
  // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
  // in JavaScript: it can begin a block or an object literal. We wrap the text
  // in parens to eliminate the ambiguity.

          j = eval('(' + text + ')');

  // In the optional fourth stage, we recursively walk the new structure, passing
  // each name/value pair to a reviver function for possible transformation.

          return typeof reviver === 'function' ?
              walk({'': j}, '') : j;
      }

  // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError('JSON.parse');
  };

})(
    'undefined' != typeof io ? io : module.exports
  , typeof JSON !== 'undefined' ? JSON : undefined
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Parser namespace.
   *
   * @namespace
   */

  var parser = exports.parser = {};

  /**
   * Packet types.
   */

  var packets = parser.packets = [
      'disconnect'
    , 'connect'
    , 'heartbeat'
    , 'message'
    , 'json'
    , 'event'
    , 'ack'
    , 'error'
    , 'noop'
  ];

  /**
   * Errors reasons.
   */

  var reasons = parser.reasons = [
      'transport not supported'
    , 'client not handshaken'
    , 'unauthorized'
  ];

  /**
   * Errors advice.
   */

  var advice = parser.advice = [
      'reconnect'
  ];

  /**
   * Shortcuts.
   */

  var JSON = io.JSON
    , indexOf = io.util.indexOf;

  /**
   * Encodes a packet.
   *
   * @api private
   */

  parser.encodePacket = function (packet) {
    var type = indexOf(packets, packet.type)
      , id = packet.id || ''
      , endpoint = packet.endpoint || ''
      , ack = packet.ack
      , data = null;

    switch (packet.type) {
      case 'error':
        var reason = packet.reason ? indexOf(reasons, packet.reason) : ''
          , adv = packet.advice ? indexOf(advice, packet.advice) : '';

        if (reason !== '' || adv !== '')
          data = reason + (adv !== '' ? ('+' + adv) : '');

        break;

      case 'message':
        if (packet.data !== '')
          data = packet.data;
        break;

      case 'event':
        var ev = { name: packet.name };

        if (packet.args && packet.args.length) {
          ev.args = packet.args;
        }

        data = JSON.stringify(ev);
        break;

      case 'json':
        data = JSON.stringify(packet.data);
        break;

      case 'connect':
        if (packet.qs)
          data = packet.qs;
        break;

      case 'ack':
        data = packet.ackId
          + (packet.args && packet.args.length
              ? '+' + JSON.stringify(packet.args) : '');
        break;
    }

    // construct packet with required fragments
    var encoded = [
        type
      , id + (ack == 'data' ? '+' : '')
      , endpoint
    ];

    // data fragment is optional
    if (data !== null && data !== undefined)
      encoded.push(data);

    return encoded.join(':');
  };

  /**
   * Encodes multiple messages (payload).
   *
   * @param {Array} messages
   * @api private
   */

  parser.encodePayload = function (packets) {
    var decoded = '';

    if (packets.length == 1)
      return packets[0];

    for (var i = 0, l = packets.length; i < l; i++) {
      var packet = packets[i];
      decoded += '\ufffd' + packet.length + '\ufffd' + packets[i];
    }

    return decoded;
  };

  /**
   * Decodes a packet
   *
   * @api private
   */

  var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;

  parser.decodePacket = function (data) {
    var pieces = data.match(regexp);

    if (!pieces) return {};

    var id = pieces[2] || ''
      , data = pieces[5] || ''
      , packet = {
            type: packets[pieces[1]]
          , endpoint: pieces[4] || ''
        };

    // whether we need to acknowledge the packet
    if (id) {
      packet.id = id;
      if (pieces[3])
        packet.ack = 'data';
      else
        packet.ack = true;
    }

    // handle different packet types
    switch (packet.type) {
      case 'error':
        var pieces = data.split('+');
        packet.reason = reasons[pieces[0]] || '';
        packet.advice = advice[pieces[1]] || '';
        break;

      case 'message':
        packet.data = data || '';
        break;

      case 'event':
        try {
          var opts = JSON.parse(data);
          packet.name = opts.name;
          packet.args = opts.args;
        } catch (e) { }

        packet.args = packet.args || [];
        break;

      case 'json':
        try {
          packet.data = JSON.parse(data);
        } catch (e) { }
        break;

      case 'connect':
        packet.qs = data || '';
        break;

      case 'ack':
        var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
        if (pieces) {
          packet.ackId = pieces[1];
          packet.args = [];

          if (pieces[3]) {
            try {
              packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
            } catch (e) { }
          }
        }
        break;

      case 'disconnect':
      case 'heartbeat':
        break;
    };

    return packet;
  };

  /**
   * Decodes data payload. Detects multiple messages
   *
   * @return {Array} messages
   * @api public
   */

  parser.decodePayload = function (data) {
    // IE doesn't like data[i] for unicode chars, charAt works fine
    if (data.charAt(0) == '\ufffd') {
      var ret = [];

      for (var i = 1, length = ''; i < data.length; i++) {
        if (data.charAt(i) == '\ufffd') {
          ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length)));
          i += Number(length) + 1;
          length = '';
        } else {
          length += data.charAt(i);
        }
      }

      return ret;
    } else {
      return [parser.decodePacket(data)];
    }
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.Transport = Transport;

  /**
   * This is the transport template for all supported transport methods.
   *
   * @constructor
   * @api public
   */

  function Transport (socket, sessid) {
    this.socket = socket;
    this.sessid = sessid;
  };

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(Transport, io.EventEmitter);

  /**
   * Handles the response from the server. When a new response is received
   * it will automatically update the timeout, decode the message and
   * forwards the response to the onMessage function for further processing.
   *
   * @param {String} data Response from the server.
   * @api private
   */

  Transport.prototype.onData = function (data) {
    this.clearCloseTimeout();
    
    // If the connection in currently open (or in a reopening state) reset the close 
    // timeout since we have just received data. This check is necessary so
    // that we don't reset the timeout on an explicitly disconnected connection.
    if (this.connected || this.connecting || this.reconnecting) {
      this.setCloseTimeout();
    }

    if (data !== '') {
      // todo: we should only do decodePayload for xhr transports
      var msgs = io.parser.decodePayload(data);

      if (msgs && msgs.length) {
        for (var i = 0, l = msgs.length; i < l; i++) {
          this.onPacket(msgs[i]);
        }
      }
    }

    return this;
  };

  /**
   * Handles packets.
   *
   * @api private
   */

  Transport.prototype.onPacket = function (packet) {
    if (packet.type == 'heartbeat') {
      return this.onHeartbeat();
    }

    if (packet.type == 'connect' && packet.endpoint == '') {
      this.onConnect();
    }

    this.socket.onPacket(packet);

    return this;
  };

  /**
   * Sets close timeout
   *
   * @api private
   */
  
  Transport.prototype.setCloseTimeout = function () {
    if (!this.closeTimeout) {
      var self = this;

      this.closeTimeout = setTimeout(function () {
        self.onDisconnect();
      }, this.socket.closeTimeout);
    }
  };

  /**
   * Called when transport disconnects.
   *
   * @api private
   */

  Transport.prototype.onDisconnect = function () {
    if (this.close && this.open) this.close();
    this.clearTimeouts();
    this.socket.onDisconnect();
    return this;
  };

  /**
   * Called when transport connects
   *
   * @api private
   */

  Transport.prototype.onConnect = function () {
    this.socket.onConnect();
    return this;
  }

  /**
   * Clears close timeout
   *
   * @api private
   */

  Transport.prototype.clearCloseTimeout = function () {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  };

  /**
   * Clear timeouts
   *
   * @api private
   */

  Transport.prototype.clearTimeouts = function () {
    this.clearCloseTimeout();

    if (this.reopenTimeout) {
      clearTimeout(this.reopenTimeout);
    }
  };

  /**
   * Sends a packet
   *
   * @param {Object} packet object.
   * @api private
   */

  Transport.prototype.packet = function (packet) {
    this.send(io.parser.encodePacket(packet));
  };

  /**
   * Send the received heartbeat message back to server. So the server
   * knows we are still connected.
   *
   * @param {String} heartbeat Heartbeat response from the server.
   * @api private
   */

  Transport.prototype.onHeartbeat = function (heartbeat) {
    this.packet({ type: 'heartbeat' });
  };
 
  /**
   * Called when the transport opens.
   *
   * @api private
   */

  Transport.prototype.onOpen = function () {
    this.open = true;
    this.clearCloseTimeout();
    this.socket.onOpen();
  };

  /**
   * Notifies the base when the connection with the Socket.IO server
   * has been disconnected.
   *
   * @api private
   */

  Transport.prototype.onClose = function () {
    var self = this;

    /* FIXME: reopen delay causing a infinit loop
    this.reopenTimeout = setTimeout(function () {
      self.open();
    }, this.socket.options['reopen delay']);*/

    this.open = false;
    this.socket.onClose();
    this.onDisconnect();
  };

  /**
   * Generates a connection url based on the Socket.IO URL Protocol.
   * See <https://github.com/learnboost/socket.io-node/> for more details.
   *
   * @returns {String} Connection url
   * @api private
   */

  Transport.prototype.prepareUrl = function () {
    var options = this.socket.options;

    return this.scheme() + '://'
      + options.host + ':' + options.port + '/'
      + options.resource + '/' + io.protocol
      + '/' + this.name + '/' + this.sessid;
  };

  /**
   * Checks if the transport is ready to start a connection.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  Transport.prototype.ready = function (socket, fn) {
    fn.call(this);
  };
})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports.Socket = Socket;

  /**
   * Create a new `Socket.IO client` which can establish a persistent
   * connection with a Socket.IO enabled server.
   *
   * @api public
   */

  function Socket (options) {
    this.options = {
        port: 80
      , secure: false
      , document: 'document' in global ? document : false
      , resource: 'socket.io'
      , transports: io.transports
      , 'connect timeout': 10000
      , 'try multiple transports': true
      , 'reconnect': true
      , 'reconnection delay': 500
      , 'reconnection limit': Infinity
      , 'reopen delay': 3000
      , 'max reconnection attempts': 10
      , 'sync disconnect on unload': true
      , 'auto connect': true
      , 'flash policy port': 10843
    };

    io.util.merge(this.options, options);

    this.connected = false;
    this.open = false;
    this.connecting = false;
    this.reconnecting = false;
    this.namespaces = {};
    this.buffer = [];
    this.doBuffer = false;

    if (this.options['sync disconnect on unload'] &&
        (!this.isXDomain() || io.util.ua.hasCORS)) {
      var self = this;

      io.util.on(global, 'beforeunload', function () {
        self.disconnectSync();
      }, false);
    }

    if (this.options['auto connect']) {
      this.connect();
    }
};

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(Socket, io.EventEmitter);

  /**
   * Returns a namespace listener/emitter for this socket
   *
   * @api public
   */

  Socket.prototype.of = function (name) {
    if (!this.namespaces[name]) {
      this.namespaces[name] = new io.SocketNamespace(this, name);

      if (name !== '') {
        this.namespaces[name].packet({ type: 'connect' });
      }
    }

    return this.namespaces[name];
  };

  /**
   * Emits the given event to the Socket and all namespaces
   *
   * @api private
   */

  Socket.prototype.publish = function () {
    this.emit.apply(this, arguments);

    var nsp;

    for (var i in this.namespaces) {
      if (this.namespaces.hasOwnProperty(i)) {
        nsp = this.of(i);
        nsp.$emit.apply(nsp, arguments);
      }
    }
  };

  /**
   * Performs the handshake
   *
   * @api private
   */

  function empty () { };

  Socket.prototype.handshake = function (fn) {
    var self = this
      , options = this.options;

    function complete (data) {
      if (data instanceof Error) {
        self.onError(data.message);
      } else {
        fn.apply(null, data.split(':'));
      }
    };

    var url = [
          'http' + (options.secure ? 's' : '') + ':/'
        , options.host + ':' + options.port
        , options.resource
        , io.protocol
        , io.util.query(this.options.query, 't=' + +new Date)
      ].join('/');

    if (this.isXDomain() && !io.util.ua.hasCORS) {
      var insertAt = document.getElementsByTagName('script')[0]
        , script = document.createElement('script');

      script.src = url + '&jsonp=' + io.j.length;
      insertAt.parentNode.insertBefore(script, insertAt);

      io.j.push(function (data) {
        complete(data);
        script.parentNode.removeChild(script);
      });
    } else {
      var xhr = io.util.request();

      xhr.open('GET', url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          xhr.onreadystatechange = empty;

          if (xhr.status == 200) {
            complete(xhr.responseText);
          } else {
            !self.reconnecting && self.onError(xhr.responseText);
          }
        }
      };
      xhr.send(null);
    }
  };

  /**
   * Find an available transport based on the options supplied in the constructor.
   *
   * @api private
   */

  Socket.prototype.getTransport = function (override) {
    var transports = override || this.transports, match;

    for (var i = 0, transport; transport = transports[i]; i++) {
      if (io.Transport[transport]
        && io.Transport[transport].check(this)
        && (!this.isXDomain() || io.Transport[transport].xdomainCheck())) {
        return new io.Transport[transport](this, this.sessionid);
      }
    }

    return null;
  };

  /**
   * Connects to the server.
   *
   * @param {Function} [fn] Callback.
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.connect = function (fn) {
    if (this.connecting) {
      return this;
    }

    var self = this;

    this.handshake(function (sid, heartbeat, close, transports) {
      self.sessionid = sid;
      self.closeTimeout = close * 1000;
      self.heartbeatTimeout = heartbeat * 1000;
      self.transports = io.util.intersect(
          transports.split(',')
        , self.options.transports
      );

      function connect (transports){
        if (self.transport) self.transport.clearTimeouts();

        self.transport = self.getTransport(transports);
        if (!self.transport) return self.publish('connect_failed');

        // once the transport is ready
        self.transport.ready(self, function () {
          self.connecting = true;
          self.publish('connecting', self.transport.name);
          self.transport.open();

          if (self.options['connect timeout']) {
            self.connectTimeoutTimer = setTimeout(function () {
              if (!self.connected) {
                self.connecting = false;

                if (self.options['try multiple transports']) {
                  if (!self.remainingTransports) {
                    self.remainingTransports = self.transports.slice(0);
                  }

                  var remaining = self.remainingTransports;

                  while (remaining.length > 0 && remaining.splice(0,1)[0] !=
                         self.transport.name) {}

                    if (remaining.length){
                      connect(remaining);
                    } else {
                      self.publish('connect_failed');
                    }
                }
              }
            }, self.options['connect timeout']);
          }
        });
      }

      connect();

      self.once('connect', function (){
        clearTimeout(self.connectTimeoutTimer);

        fn && typeof fn == 'function' && fn();
      });
    });

    return this;
  };

  /**
   * Sends a message.
   *
   * @param {Object} data packet.
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.packet = function (data) {
    if (this.connected && !this.doBuffer) {
      this.transport.packet(data);
    } else {
      this.buffer.push(data);
    }

    return this;
  };

  /**
   * Sets buffer state
   *
   * @api private
   */

  Socket.prototype.setBuffer = function (v) {
    this.doBuffer = v;

    if (!v && this.connected && this.buffer.length) {
      this.transport.payload(this.buffer);
      this.buffer = [];
    }
  };

  /**
   * Disconnect the established connect.
   *
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.disconnect = function () {
    if (this.connected) {
      if (this.open) {
        this.of('').packet({ type: 'disconnect' });
      }

      // handle disconnection immediately
      this.onDisconnect('booted');
    }

    return this;
  };

  /**
   * Disconnects the socket with a sync XHR.
   *
   * @api private
   */

  Socket.prototype.disconnectSync = function () {
    // ensure disconnection
    var xhr = io.util.request()
      , uri = this.resource + '/' + io.protocol + '/' + this.sessionid;

    xhr.open('GET', uri, true);

    // handle disconnection immediately
    this.onDisconnect('booted');
  };

  /**
   * Check if we need to use cross domain enabled transports. Cross domain would
   * be a different port or different domain name.
   *
   * @returns {Boolean}
   * @api private
   */

  Socket.prototype.isXDomain = function () {

    var port = global.location.port ||
      ('https:' == global.location.protocol ? 443 : 80);

    return this.options.host !== global.location.hostname 
      || this.options.port != port;
  };

  /**
   * Called upon handshake.
   *
   * @api private
   */

  Socket.prototype.onConnect = function () {
    if (!this.connected) {
      this.connected = true;
      this.connecting = false;
      if (!this.doBuffer) {
        // make sure to flush the buffer
        this.setBuffer(false);
      }
      this.emit('connect');
    }
  };

  /**
   * Called when the transport opens
   *
   * @api private
   */

  Socket.prototype.onOpen = function () {
    this.open = true;
  };

  /**
   * Called when the transport closes.
   *
   * @api private
   */

  Socket.prototype.onClose = function () {
    this.open = false;
  };

  /**
   * Called when the transport first opens a connection
   *
   * @param text
   */

  Socket.prototype.onPacket = function (packet) {
    this.of(packet.endpoint).onPacket(packet);
  };

  /**
   * Handles an error.
   *
   * @api private
   */

  Socket.prototype.onError = function (err) {
    if (err && err.advice) {
      if (err.advice === 'reconnect' && this.connected) {
        this.disconnect();
        this.reconnect();
      }
    }

    this.publish('error', err && err.reason ? err.reason : err);
  };

  /**
   * Called when the transport disconnects.
   *
   * @api private
   */

  Socket.prototype.onDisconnect = function (reason) {
    var wasConnected = this.connected;

    this.connected = false;
    this.connecting = false;
    this.open = false;

    if (wasConnected) {
      this.transport.close();
      this.transport.clearTimeouts();
      this.publish('disconnect', reason);

      if ('booted' != reason && this.options.reconnect && !this.reconnecting) {
        this.reconnect();
      }
    }
  };

  /**
   * Called upon reconnection.
   *
   * @api private
   */

  Socket.prototype.reconnect = function () {
    this.reconnecting = true;
    this.reconnectionAttempts = 0;
    this.reconnectionDelay = this.options['reconnection delay'];

    var self = this
      , maxAttempts = this.options['max reconnection attempts']
      , tryMultiple = this.options['try multiple transports']
      , limit = this.options['reconnection limit'];

    function reset () {
      if (self.connected) {
        for (var i in self.namespaces) {
          if (self.namespaces.hasOwnProperty(i) && '' !== i) {
              self.namespaces[i].packet({ type: 'connect' });
          }
        }
        self.publish('reconnect', self.transport.name, self.reconnectionAttempts);
      }

      self.removeListener('connect_failed', maybeReconnect);
      self.removeListener('connect', maybeReconnect);

      self.reconnecting = false;

      delete self.reconnectionAttempts;
      delete self.reconnectionDelay;
      delete self.reconnectionTimer;
      delete self.redoTransports;

      self.options['try multiple transports'] = tryMultiple;
    };

    function maybeReconnect () {
      if (!self.reconnecting) {
        return;
      }

      if (self.connected) {
        return reset();
      };

      if (self.connecting && self.reconnecting) {
        return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
      }

      if (self.reconnectionAttempts++ >= maxAttempts) {
        if (!self.redoTransports) {
          self.on('connect_failed', maybeReconnect);
          self.options['try multiple transports'] = true;
          self.transport = self.getTransport();
          self.redoTransports = true;
          self.connect();
        } else {
          self.publish('reconnect_failed');
          reset();
        }
      } else {
        if (self.reconnectionDelay < limit) {
          self.reconnectionDelay *= 2; // exponential back off
        }

        self.connect();
        self.publish('reconnecting', self.reconnectionDelay, self.reconnectionAttempts);
        self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
      }
    };

    this.options['try multiple transports'] = false;
    this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);

    this.on('connect', maybeReconnect);
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.SocketNamespace = SocketNamespace;

  /**
   * Socket namespace constructor.
   *
   * @constructor
   * @api public
   */

  function SocketNamespace (socket, name) {
    this.socket = socket;
    this.name = name || '';
    this.flags = {};
    this.json = new Flag(this, 'json');
    this.ackPackets = 0;
    this.acks = {};
  };

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(SocketNamespace, io.EventEmitter);

  /**
   * Copies emit since we override it
   *
   * @api private
   */

  SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;

  /**
   * Creates a new namespace, by proxying the request to the socket. This
   * allows us to use the synax as we do on the server.
   *
   * @api public
   */

  SocketNamespace.prototype.of = function () {
    return this.socket.of.apply(this.socket, arguments);
  };

  /**
   * Sends a packet.
   *
   * @api private
   */

  SocketNamespace.prototype.packet = function (packet) {
    packet.endpoint = this.name;
    this.socket.packet(packet);
    this.flags = {};
    return this;
  };

  /**
   * Sends a message
   *
   * @api public
   */

  SocketNamespace.prototype.send = function (data, fn) {
    var packet = {
        type: this.flags.json ? 'json' : 'message'
      , data: data
    };

    if ('function' == typeof fn) {
      packet.id = ++this.ackPackets;
      packet.ack = true;
      this.acks[packet.id] = fn;
    }

    return this.packet(packet);
  };

  /**
   * Emits an event
   *
   * @api public
   */
  
  SocketNamespace.prototype.emit = function (name) {
    var args = Array.prototype.slice.call(arguments, 1)
      , lastArg = args[args.length - 1]
      , packet = {
            type: 'event'
          , name: name
        };

    if ('function' == typeof lastArg) {
      packet.id = ++this.ackPackets;
      packet.ack = 'data';
      this.acks[packet.id] = lastArg;
      args = args.slice(0, args.length - 1);
    }

    packet.args = args;

    return this.packet(packet);
  };

  /**
   * Disconnects the namespace
   *
   * @api private
   */

  SocketNamespace.prototype.disconnect = function () {
    if (this.name === '') {
      this.socket.disconnect();
    } else {
      this.packet({ type: 'disconnect' });
      this.$emit('disconnect');
    }

    return this;
  };

  /**
   * Handles a packet
   *
   * @api private
   */

  SocketNamespace.prototype.onPacket = function (packet) {
    var self = this;

    function ack () {
      self.packet({
          type: 'ack'
        , args: io.util.toArray(arguments)
        , ackId: packet.id
      });
    };

    switch (packet.type) {
      case 'connect':
        this.$emit('connect');
        break;

      case 'disconnect':
        if (this.name === '') {
          this.socket.onDisconnect(packet.reason || 'booted');
        } else {
          this.$emit('disconnect', packet.reason);
        }
        break;

      case 'message':
      case 'json':
        var params = ['message', packet.data];

        if (packet.ack == 'data') {
          params.push(ack);
        } else if (packet.ack) {
          this.packet({ type: 'ack', ackId: packet.id });
        }

        this.$emit.apply(this, params);
        break;

      case 'event':
        var params = [packet.name].concat(packet.args);

        if (packet.ack == 'data')
          params.push(ack);

        this.$emit.apply(this, params);
        break;

      case 'ack':
        if (this.acks[packet.ackId]) {
          this.acks[packet.ackId].apply(this, packet.args);
          delete this.acks[packet.ackId];
        }
        break;

      case 'error':
        if (packet.advice){
          this.socket.onError(packet);
        } else {
          if (packet.reason == 'unauthorized') {
            this.$emit('connect_failed', packet.reason);
          } else {
            this.$emit('error', packet.reason);
          }
        }
        break;
    }
  };

  /**
   * Flag interface.
   *
   * @api private
   */

  function Flag (nsp, name) {
    this.namespace = nsp;
    this.name = name;
  };

  /**
   * Send a message
   *
   * @api public
   */

  Flag.prototype.send = function () {
    this.namespace.flags[this.name] = true;
    this.namespace.send.apply(this.namespace, arguments);
  };

  /**
   * Emit an event
   *
   * @api public
   */

  Flag.prototype.emit = function () {
    this.namespace.flags[this.name] = true;
    this.namespace.emit.apply(this.namespace, arguments);
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports.websocket = WS;

  /**
   * The WebSocket transport uses the HTML5 WebSocket API to establish an
   * persistent connection with the Socket.IO server. This transport will also
   * be inherited by the FlashSocket fallback as it provides a API compatible
   * polyfill for the WebSockets.
   *
   * @constructor
   * @extends {io.Transport}
   * @api public
   */

  function WS (socket) {
    io.Transport.apply(this, arguments);
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(WS, io.Transport);

  /**
   * Transport name
   *
   * @api public
   */

  WS.prototype.name = 'websocket';

  /**
   * Initializes a new `WebSocket` connection with the Socket.IO server. We attach
   * all the appropriate listeners to handle the responses from the server.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.open = function () {
    var query = io.util.query(this.socket.options.query)
      , self = this
      , Socket


    if (!Socket) {
      Socket = global.MozWebSocket || global.WebSocket;
    }

    this.websocket = new Socket(this.prepareUrl() + query);

    this.websocket.onopen = function () {
      self.onOpen();
      self.socket.setBuffer(false);
    };
    this.websocket.onmessage = function (ev) {
      self.onData(ev.data);
    };
    this.websocket.onclose = function () {
      self.onClose();
      self.socket.setBuffer(true);
    };
    this.websocket.onerror = function (e) {
      self.onError(e);
    };

    return this;
  };

  /**
   * Send a message to the Socket.IO server. The message will automatically be
   * encoded in the correct message format.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.send = function (data) {
    this.websocket.send(data);
    return this;
  };

  /**
   * Payload
   *
   * @api private
   */

  WS.prototype.payload = function (arr) {
    for (var i = 0, l = arr.length; i < l; i++) {
      this.packet(arr[i]);
    }
    return this;
  };

  /**
   * Disconnect the established `WebSocket` connection.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.close = function () {
    this.websocket.close();
    return this;
  };

  /**
   * Handle the errors that `WebSocket` might be giving when we
   * are attempting to connect or send messages.
   *
   * @param {Error} e The error.
   * @api private
   */

  WS.prototype.onError = function (e) {
    this.socket.onError(e);
  };

  /**
   * Returns the appropriate scheme for the URI generation.
   *
   * @api private
   */
  WS.prototype.scheme = function () {
    return this.socket.options.secure ? 'wss' : 'ws';
  };

  /**
   * Checks if the browser has support for native `WebSockets` and that
   * it's not the polyfill created for the FlashSocket transport.
   *
   * @return {Boolean}
   * @api public
   */

  WS.check = function () {
    return ('WebSocket' in global && !('__addTask' in WebSocket))
          || 'MozWebSocket' in global;
  };

  /**
   * Check if the `WebSocket` transport support cross domain communications.
   *
   * @returns {Boolean}
   * @api public
   */

  WS.xdomainCheck = function () {
    return true;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('websocket');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.flashsocket = Flashsocket;

  /**
   * The FlashSocket transport. This is a API wrapper for the HTML5 WebSocket
   * specification. It uses a .swf file to communicate with the server. If you want
   * to serve the .swf file from a other server than where the Socket.IO script is
   * coming from you need to use the insecure version of the .swf. More information
   * about this can be found on the github page.
   *
   * @constructor
   * @extends {io.Transport.websocket}
   * @api public
   */

  function Flashsocket () {
    io.Transport.websocket.apply(this, arguments);
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(Flashsocket, io.Transport.websocket);

  /**
   * Transport name
   *
   * @api public
   */

  Flashsocket.prototype.name = 'flashsocket';

  /**
   * Disconnect the established `FlashSocket` connection. This is done by adding a 
   * new task to the FlashSocket. The rest will be handled off by the `WebSocket` 
   * transport.
   *
   * @returns {Transport}
   * @api public
   */

  Flashsocket.prototype.open = function () {
    var self = this
      , args = arguments;

    WebSocket.__addTask(function () {
      io.Transport.websocket.prototype.open.apply(self, args);
    });
    return this;
  };
  
  /**
   * Sends a message to the Socket.IO server. This is done by adding a new
   * task to the FlashSocket. The rest will be handled off by the `WebSocket` 
   * transport.
   *
   * @returns {Transport}
   * @api public
   */

  Flashsocket.prototype.send = function () {
    var self = this, args = arguments;
    WebSocket.__addTask(function () {
      io.Transport.websocket.prototype.send.apply(self, args);
    });
    return this;
  };

  /**
   * Disconnects the established `FlashSocket` connection.
   *
   * @returns {Transport}
   * @api public
   */

  Flashsocket.prototype.close = function () {
    WebSocket.__tasks.length = 0;
    io.Transport.websocket.prototype.close.call(this);
    return this;
  };

  /**
   * The WebSocket fall back needs to append the flash container to the body
   * element, so we need to make sure we have access to it. Or defer the call
   * until we are sure there is a body element.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  Flashsocket.prototype.ready = function (socket, fn) {
    function init () {
      var options = socket.options
        , port = options['flash policy port']
        , path = [
              'http' + (options.secure ? 's' : '') + ':/'
            , options.host + ':' + options.port
            , options.resource
            , 'static/flashsocket'
            , 'WebSocketMain' + (socket.isXDomain() ? 'Insecure' : '') + '.swf'
          ];

      // Only start downloading the swf file when the checked that this browser
      // actually supports it
      if (!Flashsocket.loaded) {
        if (typeof WEB_SOCKET_SWF_LOCATION === 'undefined') {
          // Set the correct file based on the XDomain settings
          WEB_SOCKET_SWF_LOCATION = path.join('/');
        }

        if (port !== 843) {
          WebSocket.loadFlashPolicyFile('xmlsocket://' + options.host + ':' + port);
        }

        WebSocket.__initialize();
        Flashsocket.loaded = true;
      }

      fn.call(self);
    }

    var self = this;
    if (document.body) return init();

    io.util.load(init);
  };

  /**
   * Check if the FlashSocket transport is supported as it requires that the Adobe
   * Flash Player plug-in version `10.0.0` or greater is installed. And also check if
   * the polyfill is correctly loaded.
   *
   * @returns {Boolean}
   * @api public
   */

  Flashsocket.check = function () {
    if (
        typeof WebSocket == 'undefined'
      || !('__initialize' in WebSocket) || !swfobject
    ) return false;

    return swfobject.getFlashPlayerVersion().major >= 10;
  };

  /**
   * Check if the FlashSocket transport can be used as cross domain / cross origin 
   * transport. Because we can't see which type (secure or insecure) of .swf is used
   * we will just return true.
   *
   * @returns {Boolean}
   * @api public
   */

  Flashsocket.xdomainCheck = function () {
    return true;
  };

  /**
   * Disable AUTO_INITIALIZATION
   */

  if (typeof window != 'undefined') {
    WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = true;
  }

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('flashsocket');
})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
if ('undefined' != typeof window) {
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
}
// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>
// License: New BSD License
// Reference: http://dev.w3.org/html5/websockets/
// Reference: http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol

(function() {
  
  if ('undefined' == typeof window || window.WebSocket) return;

  var console = window.console;
  if (!console || !console.log || !console.error) {
    console = {log: function(){ }, error: function(){ }};
  }
  
  if (!swfobject.hasFlashPlayerVersion("10.0.0")) {
    console.error("Flash Player >= 10.0.0 is required.");
    return;
  }
  if (location.protocol == "file:") {
    console.error(
      "WARNING: web-socket-js doesn't work in file:///... URL " +
      "unless you set Flash Security Settings properly. " +
      "Open the page via Web server i.e. http://...");
  }

  /**
   * This class represents a faux web socket.
   * @param {string} url
   * @param {array or string} protocols
   * @param {string} proxyHost
   * @param {int} proxyPort
   * @param {string} headers
   */
  WebSocket = function(url, protocols, proxyHost, proxyPort, headers) {
    var self = this;
    self.__id = WebSocket.__nextId++;
    WebSocket.__instances[self.__id] = self;
    self.readyState = WebSocket.CONNECTING;
    self.bufferedAmount = 0;
    self.__events = {};
    if (!protocols) {
      protocols = [];
    } else if (typeof protocols == "string") {
      protocols = [protocols];
    }
    // Uses setTimeout() to make sure __createFlash() runs after the caller sets ws.onopen etc.
    // Otherwise, when onopen fires immediately, onopen is called before it is set.
    setTimeout(function() {
      WebSocket.__addTask(function() {
        WebSocket.__flash.create(
            self.__id, url, protocols, proxyHost || null, proxyPort || 0, headers || null);
      });
    }, 0);
  };

  /**
   * Send data to the web socket.
   * @param {string} data  The data to send to the socket.
   * @return {boolean}  True for success, false for failure.
   */
  WebSocket.prototype.send = function(data) {
    if (this.readyState == WebSocket.CONNECTING) {
      throw "INVALID_STATE_ERR: Web Socket connection has not been established";
    }
    // We use encodeURIComponent() here, because FABridge doesn't work if
    // the argument includes some characters. We don't use escape() here
    // because of this:
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Functions#escape_and_unescape_Functions
    // But it looks decodeURIComponent(encodeURIComponent(s)) doesn't
    // preserve all Unicode characters either e.g. "\uffff" in Firefox.
    // Note by wtritch: Hopefully this will not be necessary using ExternalInterface.  Will require
    // additional testing.
    var result = WebSocket.__flash.send(this.__id, encodeURIComponent(data));
    if (result < 0) { // success
      return true;
    } else {
      this.bufferedAmount += result;
      return false;
    }
  };

  /**
   * Close this web socket gracefully.
   */
  WebSocket.prototype.close = function() {
    if (this.readyState == WebSocket.CLOSED || this.readyState == WebSocket.CLOSING) {
      return;
    }
    this.readyState = WebSocket.CLOSING;
    WebSocket.__flash.close(this.__id);
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {string} type
   * @param {function} listener
   * @param {boolean} useCapture
   * @return void
   */
  WebSocket.prototype.addEventListener = function(type, listener, useCapture) {
    if (!(type in this.__events)) {
      this.__events[type] = [];
    }
    this.__events[type].push(listener);
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {string} type
   * @param {function} listener
   * @param {boolean} useCapture
   * @return void
   */
  WebSocket.prototype.removeEventListener = function(type, listener, useCapture) {
    if (!(type in this.__events)) return;
    var events = this.__events[type];
    for (var i = events.length - 1; i >= 0; --i) {
      if (events[i] === listener) {
        events.splice(i, 1);
        break;
      }
    }
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {Event} event
   * @return void
   */
  WebSocket.prototype.dispatchEvent = function(event) {
    var events = this.__events[event.type] || [];
    for (var i = 0; i < events.length; ++i) {
      events[i](event);
    }
    var handler = this["on" + event.type];
    if (handler) handler(event);
  };

  /**
   * Handles an event from Flash.
   * @param {Object} flashEvent
   */
  WebSocket.prototype.__handleEvent = function(flashEvent) {
    if ("readyState" in flashEvent) {
      this.readyState = flashEvent.readyState;
    }
    if ("protocol" in flashEvent) {
      this.protocol = flashEvent.protocol;
    }
    
    var jsEvent;
    if (flashEvent.type == "open" || flashEvent.type == "error") {
      jsEvent = this.__createSimpleEvent(flashEvent.type);
    } else if (flashEvent.type == "close") {
      // TODO implement jsEvent.wasClean
      jsEvent = this.__createSimpleEvent("close");
    } else if (flashEvent.type == "message") {
      var data = decodeURIComponent(flashEvent.message);
      jsEvent = this.__createMessageEvent("message", data);
    } else {
      throw "unknown event type: " + flashEvent.type;
    }
    
    this.dispatchEvent(jsEvent);
  };
  
  WebSocket.prototype.__createSimpleEvent = function(type) {
    if (document.createEvent && window.Event) {
      var event = document.createEvent("Event");
      event.initEvent(type, false, false);
      return event;
    } else {
      return {type: type, bubbles: false, cancelable: false};
    }
  };
  
  WebSocket.prototype.__createMessageEvent = function(type, data) {
    if (document.createEvent && window.MessageEvent && !window.opera) {
      var event = document.createEvent("MessageEvent");
      event.initMessageEvent("message", false, false, data, null, null, window, null);
      return event;
    } else {
      // IE and Opera, the latter one truncates the data parameter after any 0x00 bytes.
      return {type: type, data: data, bubbles: false, cancelable: false};
    }
  };
  
  /**
   * Define the WebSocket readyState enumeration.
   */
  WebSocket.CONNECTING = 0;
  WebSocket.OPEN = 1;
  WebSocket.CLOSING = 2;
  WebSocket.CLOSED = 3;

  WebSocket.__flash = null;
  WebSocket.__instances = {};
  WebSocket.__tasks = [];
  WebSocket.__nextId = 0;
  
  /**
   * Load a new flash security policy file.
   * @param {string} url
   */
  WebSocket.loadFlashPolicyFile = function(url){
    WebSocket.__addTask(function() {
      WebSocket.__flash.loadManualPolicyFile(url);
    });
  };

  /**
   * Loads WebSocketMain.swf and creates WebSocketMain object in Flash.
   */
  WebSocket.__initialize = function() {
    if (WebSocket.__flash) return;
    
    if (WebSocket.__swfLocation) {
      // For backword compatibility.
      window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation;
    }
    if (!window.WEB_SOCKET_SWF_LOCATION) {
      console.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
      return;
    }
    var container = document.createElement("div");
    container.id = "webSocketContainer";
    // Hides Flash box. We cannot use display: none or visibility: hidden because it prevents
    // Flash from loading at least in IE. So we move it out of the screen at (-100, -100).
    // But this even doesn't work with Flash Lite (e.g. in Droid Incredible). So with Flash
    // Lite, we put it at (0, 0). This shows 1x1 box visible at left-top corner but this is
    // the best we can do as far as we know now.
    container.style.position = "absolute";
    if (WebSocket.__isFlashLite()) {
      container.style.left = "0px";
      container.style.top = "0px";
    } else {
      container.style.left = "-100px";
      container.style.top = "-100px";
    }
    var holder = document.createElement("div");
    holder.id = "webSocketFlash";
    container.appendChild(holder);
    document.body.appendChild(container);
    // See this article for hasPriority:
    // http://help.adobe.com/en_US/as3/mobile/WS4bebcd66a74275c36cfb8137124318eebc6-7ffd.html
    swfobject.embedSWF(
      WEB_SOCKET_SWF_LOCATION,
      "webSocketFlash",
      "1" /* width */,
      "1" /* height */,
      "10.0.0" /* SWF version */,
      null,
      null,
      {hasPriority: true, swliveconnect : true, allowScriptAccess: "always"},
      null,
      function(e) {
        if (!e.success) {
          console.error("[WebSocket] swfobject.embedSWF failed");
        }
      });
  };
  
  /**
   * Called by Flash to notify JS that it's fully loaded and ready
   * for communication.
   */
  WebSocket.__onFlashInitialized = function() {
    // We need to set a timeout here to avoid round-trip calls
    // to flash during the initialization process.
    setTimeout(function() {
      WebSocket.__flash = document.getElementById("webSocketFlash");
      WebSocket.__flash.setCallerUrl(location.href);
      WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
      for (var i = 0; i < WebSocket.__tasks.length; ++i) {
        WebSocket.__tasks[i]();
      }
      WebSocket.__tasks = [];
    }, 0);
  };
  
  /**
   * Called by Flash to notify WebSockets events are fired.
   */
  WebSocket.__onFlashEvent = function() {
    setTimeout(function() {
      try {
        // Gets events using receiveEvents() instead of getting it from event object
        // of Flash event. This is to make sure to keep message order.
        // It seems sometimes Flash events don't arrive in the same order as they are sent.
        var events = WebSocket.__flash.receiveEvents();
        for (var i = 0; i < events.length; ++i) {
          WebSocket.__instances[events[i].webSocketId].__handleEvent(events[i]);
        }
      } catch (e) {
        console.error(e);
      }
    }, 0);
    return true;
  };
  
  // Called by Flash.
  WebSocket.__log = function(message) {
    console.log(decodeURIComponent(message));
  };
  
  // Called by Flash.
  WebSocket.__error = function(message) {
    console.error(decodeURIComponent(message));
  };
  
  WebSocket.__addTask = function(task) {
    if (WebSocket.__flash) {
      task();
    } else {
      WebSocket.__tasks.push(task);
    }
  };
  
  /**
   * Test if the browser is running flash lite.
   * @return {boolean} True if flash lite is running, false otherwise.
   */
  WebSocket.__isFlashLite = function() {
    if (!window.navigator || !window.navigator.mimeTypes) {
      return false;
    }
    var mimeType = window.navigator.mimeTypes["application/x-shockwave-flash"];
    if (!mimeType || !mimeType.enabledPlugin || !mimeType.enabledPlugin.filename) {
      return false;
    }
    return mimeType.enabledPlugin.filename.match(/flashlite/i) ? true : false;
  };
  
  if (!window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION) {
    if (window.addEventListener) {
      window.addEventListener("load", function(){
        WebSocket.__initialize();
      }, false);
    } else {
      window.attachEvent("onload", function(){
        WebSocket.__initialize();
      });
    }
  }
  
})();

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   *
   * @api public
   */
  
  exports.XHR = XHR;

  /**
   * XHR constructor
   *
   * @costructor
   * @api public
   */

  function XHR (socket) {
    if (!socket) return;

    io.Transport.apply(this, arguments);
    this.sendBuffer = [];
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(XHR, io.Transport);

  /**
   * Establish a connection
   *
   * @returns {Transport}
   * @api public
   */

  XHR.prototype.open = function () {
    this.socket.setBuffer(false);
    this.onOpen();
    this.get();

    // we need to make sure the request succeeds since we have no indication
    // whether the request opened or not until it succeeded.
    this.setCloseTimeout();

    return this;
  };

  /**
   * Check if we need to send data to the Socket.IO server, if we have data in our
   * buffer we encode it and forward it to the `post` method.
   *
   * @api private
   */

  XHR.prototype.payload = function (payload) {
    var msgs = [];

    for (var i = 0, l = payload.length; i < l; i++) {
      msgs.push(io.parser.encodePacket(payload[i]));
    }

    this.send(io.parser.encodePayload(msgs));
  };

  /**
   * Send data to the Socket.IO server.
   *
   * @param data The message
   * @returns {Transport}
   * @api public
   */

  XHR.prototype.send = function (data) {
    this.post(data);
    return this;
  };

  /**
   * Posts a encoded message to the Socket.IO server.
   *
   * @param {String} data A encoded message.
   * @api private
   */

  function empty () { };

  XHR.prototype.post = function (data) {
    var self = this;
    this.socket.setBuffer(true);

    function stateChange () {
      if (this.readyState == 4) {
        this.onreadystatechange = empty;
        self.posting = false;

        if (this.status == 200){
          self.socket.setBuffer(false);
        } else {
          self.onClose();
        }
      }
    }

    function onload () {
      this.onload = empty;
      self.socket.setBuffer(false);
    };

    this.sendXHR = this.request('POST');

    if (global.XDomainRequest && this.sendXHR instanceof XDomainRequest) {
      this.sendXHR.onload = this.sendXHR.onerror = onload;
    } else {
      this.sendXHR.onreadystatechange = stateChange;
    }

    this.sendXHR.send(data);
  };

  /**
   * Disconnects the established `XHR` connection.
   *
   * @returns {Transport} 
   * @api public
   */

  XHR.prototype.close = function () {
    this.onClose();
    return this;
  };

  /**
   * Generates a configured XHR request
   *
   * @param {String} url The url that needs to be requested.
   * @param {String} method The method the request should use.
   * @returns {XMLHttpRequest}
   * @api private
   */

  XHR.prototype.request = function (method) {
    var req = io.util.request(this.socket.isXDomain())
      , query = io.util.query(this.socket.options.query, 't=' + +new Date);

    req.open(method || 'GET', this.prepareUrl() + query, true);

    if (method == 'POST') {
      try {
        if (req.setRequestHeader) {
          req.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        } else {
          // XDomainRequest
          req.contentType = 'text/plain';
        }
      } catch (e) {}
    }

    return req;
  };

  /**
   * Returns the scheme to use for the transport URLs.
   *
   * @api private
   */

  XHR.prototype.scheme = function () {
    return this.socket.options.secure ? 'https' : 'http';
  };

  /**
   * Check if the XHR transports are supported
   *
   * @param {Boolean} xdomain Check if we support cross domain requests.
   * @returns {Boolean}
   * @api public
   */

  XHR.check = function (socket, xdomain) {
    try {
      if (io.util.request(xdomain)) {
        return true;
      }
    } catch(e) {}

    return false;
  };

  /**
   * Check if the XHR transport supports corss domain requests.
   * 
   * @returns {Boolean}
   * @api public
   */

  XHR.xdomainCheck = function () {
    return XHR.check(null, true);
  };

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.htmlfile = HTMLFile;

  /**
   * The HTMLFile transport creates a `forever iframe` based transport
   * for Internet Explorer. Regular forever iframe implementations will 
   * continuously trigger the browsers buzy indicators. If the forever iframe
   * is created inside a `htmlfile` these indicators will not be trigged.
   *
   * @constructor
   * @extends {io.Transport.XHR}
   * @api public
   */

  function HTMLFile (socket) {
    io.Transport.XHR.apply(this, arguments);
  };

  /**
   * Inherits from XHR transport.
   */

  io.util.inherit(HTMLFile, io.Transport.XHR);

  /**
   * Transport name
   *
   * @api public
   */

  HTMLFile.prototype.name = 'htmlfile';

  /**
   * Creates a new ActiveX `htmlfile` with a forever loading iframe
   * that can be used to listen to messages. Inside the generated
   * `htmlfile` a reference will be made to the HTMLFile transport.
   *
   * @api private
   */

  HTMLFile.prototype.get = function () {
    this.doc = new ActiveXObject('htmlfile');
    this.doc.open();
    this.doc.write('<html></html>');
    this.doc.close();
    this.doc.parentWindow.s = this;

    var iframeC = this.doc.createElement('div');
    iframeC.className = 'socketio';

    this.doc.body.appendChild(iframeC);
    this.iframe = this.doc.createElement('iframe');

    iframeC.appendChild(this.iframe);

    var self = this
      , query = io.util.query(this.socket.options.query, 't='+ +new Date);

    this.iframe.src = this.prepareUrl() + query;

    io.util.on(window, 'unload', function () {
      self.destroy();
    });
  };

  /**
   * The Socket.IO server will write script tags inside the forever
   * iframe, this function will be used as callback for the incoming
   * information.
   *
   * @param {String} data The message
   * @param {document} doc Reference to the context
   * @api private
   */

  HTMLFile.prototype._ = function (data, doc) {
    this.onData(data);
    try {
      var script = doc.getElementsByTagName('script')[0];
      script.parentNode.removeChild(script);
    } catch (e) { }
  };

  /**
   * Destroy the established connection, iframe and `htmlfile`.
   * And calls the `CollectGarbage` function of Internet Explorer
   * to release the memory.
   *
   * @api private
   */

  HTMLFile.prototype.destroy = function () {
    if (this.iframe){
      try {
        this.iframe.src = 'about:blank';
      } catch(e){}

      this.doc = null;
      this.iframe.parentNode.removeChild(this.iframe);
      this.iframe = null;

      CollectGarbage();
    }
  };

  /**
   * Disconnects the established connection.
   *
   * @returns {Transport} Chaining.
   * @api public
   */

  HTMLFile.prototype.close = function () {
    this.destroy();
    return io.Transport.XHR.prototype.close.call(this);
  };

  /**
   * Checks if the browser supports this transport. The browser
   * must have an `ActiveXObject` implementation.
   *
   * @return {Boolean}
   * @api public
   */

  HTMLFile.check = function () {
    if ('ActiveXObject' in window){
      try {
        var a = new ActiveXObject('htmlfile');
        return a && io.Transport.XHR.check();
      } catch(e){}
    }
    return false;
  };

  /**
   * Check if cross domain requests are supported.
   *
   * @returns {Boolean}
   * @api public
   */

  HTMLFile.xdomainCheck = function () {
    // we can probably do handling for sub-domains, we should
    // test that it's cross domain but a subdomain here
    return false;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('htmlfile');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports['xhr-polling'] = XHRPolling;

  /**
   * The XHR-polling transport uses long polling XHR requests to create a
   * "persistent" connection with the server.
   *
   * @constructor
   * @api public
   */

  function XHRPolling () {
    io.Transport.XHR.apply(this, arguments);
  };

  /**
   * Inherits from XHR transport.
   */

  io.util.inherit(XHRPolling, io.Transport.XHR);

  /**
   * Merge the properties from XHR transport
   */

  io.util.merge(XHRPolling, io.Transport.XHR);

  /**
   * Transport name
   *
   * @api public
   */

  XHRPolling.prototype.name = 'xhr-polling';

  /** 
   * Establish a connection, for iPhone and Android this will be done once the page
   * is loaded.
   *
   * @returns {Transport} Chaining.
   * @api public
   */

  XHRPolling.prototype.open = function () {
    var self = this;

    io.Transport.XHR.prototype.open.call(self);
    return false;
  };

  /**
   * Starts a XHR request to wait for incoming messages.
   *
   * @api private
   */

  function empty () {};

  XHRPolling.prototype.get = function () {
    if (!this.open) return;

    var self = this;

    function stateChange () {
      if (this.readyState == 4) {
        this.onreadystatechange = empty;

        if (this.status == 200) {
          self.onData(this.responseText);
          self.get();
        } else {
          self.onClose();
        }
      }
    };

    function onload () {
      this.onload = empty;
      self.onData(this.responseText);
      self.get();
    };

    this.xhr = this.request();

    if (global.XDomainRequest && this.xhr instanceof XDomainRequest) {
      this.xhr.onload = this.xhr.onerror = onload;
    } else {
      this.xhr.onreadystatechange = stateChange;
    }

    this.xhr.send(null);
  };

  /**
   * Handle the unclean close behavior.
   *
   * @api private
   */

  XHRPolling.prototype.onClose = function () {
    io.Transport.XHR.prototype.onClose.call(this);

    if (this.xhr) {
      this.xhr.onreadystatechange = this.xhr.onload = empty;
      try {
        this.xhr.abort();
      } catch(e){}
      this.xhr = null;
    }
  };

  /**
   * Webkit based browsers show a infinit spinner when you start a XHR request
   * before the browsers onload event is called so we need to defer opening of
   * the transport until the onload event is called. Wrapping the cb in our
   * defer method solve this.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  XHRPolling.prototype.ready = function (socket, fn) {
    var self = this;

    io.util.defer(function () {
      fn.call(self);
    });
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('xhr-polling');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {
  /**
   * There is a way to hide the loading indicator in Firefox. If you create and
   * remove a iframe it will stop showing the current loading indicator.
   * Unfortunately we can't feature detect that and UA sniffing is evil.
   *
   * @api private
   */

  var indicator = global.document && "MozAppearance" in
    global.document.documentElement.style;

  /**
   * Expose constructor.
   */

  exports['jsonp-polling'] = JSONPPolling;

  /**
   * The JSONP transport creates an persistent connection by dynamically
   * inserting a script tag in the page. This script tag will receive the
   * information of the Socket.IO server. When new information is received
   * it creates a new script tag for the new data stream.
   *
   * @constructor
   * @extends {io.Transport.xhr-polling}
   * @api public
   */

  function JSONPPolling (socket) {
    io.Transport['xhr-polling'].apply(this, arguments);

    this.index = io.j.length;

    var self = this;

    io.j.push(function (msg) {
      self._(msg);
    });
  };

  /**
   * Inherits from XHR polling transport.
   */

  io.util.inherit(JSONPPolling, io.Transport['xhr-polling']);

  /**
   * Transport name
   *
   * @api public
   */

  JSONPPolling.prototype.name = 'jsonp-polling';

  /**
   * Posts a encoded message to the Socket.IO server using an iframe.
   * The iframe is used because script tags can create POST based requests.
   * The iframe is positioned outside of the view so the user does not
   * notice it's existence.
   *
   * @param {String} data A encoded message.
   * @api private
   */

  JSONPPolling.prototype.post = function (data) {
    var self = this
      , query = io.util.query(
             this.socket.options.query
          , 't='+ (+new Date) + '&i=' + this.index
        );

    if (!this.form) {
      var form = document.createElement('form')
        , area = document.createElement('textarea')
        , id = this.iframeId = 'socketio_iframe_' + this.index
        , iframe;

      form.className = 'socketio';
      form.style.position = 'absolute';
      form.style.top = '-1000px';
      form.style.left = '-1000px';
      form.target = id;
      form.method = 'POST';
      form.setAttribute('accept-charset', 'utf-8');
      area.name = 'd';
      form.appendChild(area);
      document.body.appendChild(form);

      this.form = form;
      this.area = area;
    }

    this.form.action = this.prepareUrl() + query;

    function complete () {
      initIframe();
      self.socket.setBuffer(false);
    };

    function initIframe () {
      if (self.iframe) {
        self.form.removeChild(self.iframe);
      }

      try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = document.createElement('<iframe name="'+ self.iframeId +'">');
      } catch (e) {
        iframe = document.createElement('iframe');
        iframe.name = self.iframeId;
      }

      iframe.id = self.iframeId;

      self.form.appendChild(iframe);
      self.iframe = iframe;
    };

    initIframe();

    // we temporarily stringify until we figure out how to prevent
    // browsers from turning `\n` into `\r\n` in form inputs
    this.area.value = io.JSON.stringify(data);

    try {
      this.form.submit();
    } catch(e) {}

    if (this.iframe.attachEvent) {
      iframe.onreadystatechange = function () {
        if (self.iframe.readyState == 'complete') {
          complete();
        }
      };
    } else {
      this.iframe.onload = complete;
    }

    this.socket.setBuffer(true);
  };
  
  /**
   * Creates a new JSONP poll that can be used to listen
   * for messages from the Socket.IO server.
   *
   * @api private
   */

  JSONPPolling.prototype.get = function () {
    var self = this
      , script = document.createElement('script')
      , query = io.util.query(
             this.socket.options.query
          , 't='+ (+new Date) + '&i=' + this.index
        );

    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }

    script.async = true;
    script.src = this.prepareUrl() + query;
    script.onerror = function () {
      self.onClose();
    };

    var insertAt = document.getElementsByTagName('script')[0]
    insertAt.parentNode.insertBefore(script, insertAt);
    this.script = script;

    if (indicator) {
      setTimeout(function () {
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        document.body.removeChild(iframe);
      }, 100);
    }
  };

  /**
   * Callback function for the incoming message stream from the Socket.IO server.
   *
   * @param {String} data The message
   * @api private
   */

  JSONPPolling.prototype._ = function (msg) {
    this.onData(msg);
    if (this.open) {
      this.get();
    }
    return this;
  };

  /**
   * The indicator hack only works after onload
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  JSONPPolling.prototype.ready = function (socket, fn) {
    var self = this;
    if (!indicator) return fn.call(this);

    io.util.load(function () {
      fn.call(self);
    });
  };

  /**
   * Checks if browser supports this transport.
   *
   * @return {Boolean}
   * @api public
   */

  JSONPPolling.check = function () {
    return 'document' in global;
  };

  /**
   * Check if cross domain requests are supported
   *
   * @returns {Boolean}
   * @api public
   */

  JSONPPolling.xdomainCheck = function () {
    return true;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('jsonp-polling');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);
/***********************
* Game Client API Code  *
***********************/
// Replace this code with the below for testing use
var socket = io.connect('http://localhost:3000');
// The following should be used in production mode
// var socket = io.connect("http://crunchymall.com");
var sessionId;


socket.on( "connection", function(id){ 
	// alert( "We are Connected Again!!" );
	sessionId = id;
});

/**********************
* Constants & Config      *
**********************/
var STATE_PREGAME = 0;
var STATE_INGAME = 1;

/**********************
* API Variables               *
**********************/
// When nonzero, the playerToken can be used for a player to buy stuff
var playerToken = 0;

// Contains 3 hashed arrays of buyable items
var shopItems = {};

// Player states vary between pre-game and in-game
var playerState = STATE_PREGAME;

// Percentage deviation from perfect synchronization in game states
// value goes from 0 (total desync) to 100 (perfect sync).
// -1 means we're either not in a game, or error has occured.
var syncPercentDeviation = -1;

// Hash map to hold shop-related functions
var shopFunctionHandlers = {};

// Hash map to hold event handling game-related functions
var gameFunctionHandlers = {};

// Hash map for chat related event handling
var chatFunctionHandlers = {};

// Channel name the player is currently in (for references only)
var currentChannel;

// Current gameroom the player is in (for references only)
var currentRoom;

/**********************
* Programmer Functions *
**********************/
// Add a function to handle shop events
function AddShopFunction( eventname, func ){ 
	if( shopFunctionHandlers[ eventname ] === undefined ) { 
		shopFunctionHandlers[ eventname ] = [];
	}
	shopFunctionHandlers[ eventname ].push( func );
}

// Adds a function to handle game events
function AddGameFunction( eventname, func ){ 
	if( gameFunctionHandlers[ eventname ] === undefined ) { 
		gameFunctionHandlers[ eventname ] = [];
	}
	gameFunctionHandlers[ eventname ].push( func );
}

// Adds a function handler to chat events
function AddChatFunction( eventname, func ){ 
	if( chatFunctionHandlers[ eventname ] === undefined ) { 
		chatFunctionHandlers[ eventname ] = [];
	}
	chatFunctionHandlers[ eventname ].push( func );
}

/**********************
* User Functions               *
**********************/
// playerinfo is a json 
function LoginPlayer( playerinfo ){
	var data = playerinfo;
	data['sessionId'] = sessionId; 
	socket.emit( "player login up", data ); 
	alert( "Emitted up: " + JSON.stringify( data ) );
}

socket.on( "player login down", function(data) { 
	if(data['sessionId'] == sessionId) { 
		playerToken = data['playerToken'];
		var handlers = shopFunctionHandlers['player login down'];
		for( var k = 0; k < handlers.length; k++ ){ 
			handlers[k]( playerToken );
		}
	}
	else {
		// inform player of mistake
	}
	// TODO: write code to handle the case when player tokens are false
});

/**********************
* Shop Functions              *
**********************/
// Macro call to summon the shop for the truly lazy

// metadata is not required
function GetShopItems( reqdata ){ 
	var data = { 'sessionId': sessionId, 'data': reqdata }
	socket.emit( "open shop up", data );
}

socket.on( "open shop down", function( data ){ 
	var shopItems = data['items'];
	if( data['sessionId'] == sessionId ) {
		var handlers = shopFunctionHandlers[ 'open shop down' ];
		for( var x in handlers ){
			handlers[x]( shopItems );
		}
	} // end sessionId if
	// TODO: write code to handle bad items or whatever
} );

// playerToken and item id are required to complete a purchase
function BuyItem( data ){ 
	socket.emit( "purchase item up", data );
}

socket.on( "purchase item down", function(result){
	// TODO: write a function to display some sort of message for success or failure
	// myShop.CompletePurchase( result );
} );

/**********************
* Channel functions         *
**********************/
// channels are for the purpose of pre-game chat
// player can be the player token or ip address.
// if no channel is specified, the server decides where to put the player
function JoinChannel( channel ){ 
	socket.emit( "join channel up", channel, function( result ){ 
		// TODO: write a function to let the player know he has joined a new room
		playerState = STATE_PREGAME;
	});
}

socket.on( "join channel down", function( channeldata ){
	// TODO: let the player he has not left his previous channel
	currentChannel = channeldata['channelId'];
	var handlers = chatFunctionHandlers['join channel down'];
	for( var x in handlers ){ 
		handlers[x](channeldata);
	}
} );

socket.on( "left channel down", function( data ){
	currentChannel = undefined;
	var handlers = chatFunctionHandlers['left channel down'];
	for( var x in handlers ){ 
		handlers[x](data);
	}
} );

socket.on( "channel stat down", function( data ){ 
	var handlers = chatFunctionHandlers['channel stat down'];
	for(var x in handlers ){ 
		handlers[x](data);
	}
} );

/**********************
* Gameroom functions     *
**********************/
// Game rooms (just rooms) are where games happen and exist in the during-game
// player can be the token or the ip address.
// if no roomid is specified, the server puts the player into the a game randomly
function JoinRoom( room ){ 
	socket.emit( "join room up", room, function( result ){ 
		// TODO: write me!
		playerState = STATE_INGAME;		
	} );
}

function LeaveRoom( room ){ 
	var aRoom;
	if( room == undefined )
		aRoom = currentRoom;
	else
		aRoom = room;
	socket.emit( "left room up", { 'sessionId': sessionId, 'roomId': aRoom } );
}

socket.on( "join room down", function( roomdata ){
	// TODO: let the player know he has joined a game
	currentRoom = roomdata['roomId'];
	var handlers = gameFunctionHandlers['join room down'];
	for( var x in handlers ){ 
		handlers[x](roomdata);
	}
} );

socket.on( "left room down", function( data ){
	// TODO: let the player know he has joined a game
	currentRoom = undefined;
	var handlers = gameFunctionHandlers['left room down'];
	for( var x in handlers ){ 
		handlers[x](data);
	}
} );

socket.on( "room stat down", function( data ){ 
	var handlers = gameFunctionHandlers['room stat down'];
	for(var x in handlers ){ 
		handlers[x](data);
	}
} );

/**********************
* Chat functions              *
**********************/
// if no receiver is specified, the message is delivered to the channel or room the player is in
function PlayerChat( message ){ 
	socket.emit( "chat up", { 'sessionId': sessionId, 'message': message, 'channelId': currentChannel } );
}



socket.on( "chat down", function( event ){ 
	// TODO: Write a function 
	// alert(chatFunctionHandlers);
	var handlers = chatFunctionHandlers['chat down'];
	for( var x in handlers ){ 
		handlers[x](event);
	}
});


/**********************
* Game functions            *
**********************/
// if no receiver is specified, the message is delivered to every player in the game room
function FireEvent( name, event ){ 
	var middle =  { 
		'sessionId': sessionId, 
		'name': name, 
		'event': event, 
		'roomId': currentRoom
	};
	socket.emit( "game event up", middle, function( result ){ 
		// TODO: write me!
		socket.emit( "sync up", syncPercentDeviation);
	} );
}

function StartGame( room ){ 
	var middle;
	if( room == undefined )
		middle = { 'roomId': currentRoom };
	else
		middle = { 'roomId': room };
	socket.emit( 'start game up', middle );
}

socket.on( "start game down", function( data ){ 
	var handlers = gameFunctionHandlers['start game down'];
	for( var x in handlers ){ 
		handlers[x](data);
	}	
} );

socket.on("sync down", function( value ){ 
	syncPercentDeviation = value;
});

socket.on("game event down", function(data){
	// TODO: handle the null case when there are no event handlers
	var handlers = gameFunctionHandlers[data['name']]
	for( var x in handlers ){ 
			handlers[x](data['sessionId'], data['event']);
	}		
} );


/***********************************
* InGidio Javascript Form Generator *
************************************/
// Needs gayQuery to work
var FORM_PREFIX = "jf094uj954gj95gng3yugny598gyn1o3u3hrg";
/*
specs = [
	{ 
		tag : "input" , <- required!
		id : "faggot01" , <- required (if you want to get data from it)
		content : "stuff goes in here" <- for stuff that aren't attributes
		 ...
	} ,	
	...
]
*/
var InGidioForm = function(){ 
	var formids = {};
	return{ 
		build : function( specs ){ 
			formids = {};
			var output = "<ul id='" + FORM_PREFIX + "-form' style='list-style: none; display: inline;'>";
			for( var k = 0; k < specs.length; k++ ){ 
				var spec = specs[k];
				output += "<li id='"+ FORM_PREFIX + k + "'>";
				output += "<" + spec['tag'] + " ";
				for( var j in spec ){ 
					if( j == 'tag' || j == 'content' ){ 
						continue;
					}
					if( j == 'id' ){ 
						output += j + "='" + FORM_PREFIX + spec[j] + "' ";
						formids[spec[j]] = ( FORM_PREFIX + spec[j] );
						continue;
					}
					output += j + "='" + spec[j] + "' ";
				} // end foreach loop
				output += ">";
				if( spec['content'] != undefined ){ 
					output += spec['content'];
				}
				output += "</" + spec['tag'] + ">";
			} // end for loop
			return output;
		} , // end build function
		get : function( ){ 
			var output = {};
			for( var k in formids ){ 
				output[k] = $("#" + formids[k]).val();
			}
			return output;
		} ,
	};
}();
/****************************
* Constant Configurations        *
*****************************/
// Global constants
var PATH_NAME = "http://localhost:3000/";
var a = alice.init();

// Easy mode setup
var MALL_WIDTH = window.innerWidth,
	MALL_HEIGHT = window.innerHeight,
	DEFAULT_SHOP_WIDTH = 380,
	DEFAULT_SHOP_HEIGHT = 85,
	DEFAULT_ELEMENT_ID = "InGidioClientShopHypeDog",
	DEFAULT_SHOP_X = 0,
	DEFAULT_SHOP_Y = 0,
	DEFAULT_SHOP_Z = 500,
	DEFAULT_TILE_Z = 750,
	DEFAULT_UI_Z = 750,
	DEFAULT_BACKGROUND_COLOR = "rgb( 10, 10, 10 )" ,
	DEFAULT_BACKGROUND_BORDER = "solid 3px",
	DEFAULT_BACKGROUND_IMAGE = PATH_NAME + "images/shopicons/background.png";
	DEFAULT_TILE_WIDTH = 75,
	DEFAULT_TILE_HEIGHT= 75,
	DEFAULT_BUTTON_WIDTH = 75,
	DEFAULT_BUTTON_HEIGHT = 75,
	DEFAULT_COLUMN_PER = 1,
	DEFAULT_ROW_PER = 4 ,
	DEFAULT_BUTTON_WIDTH = 75,
	DEFAULT_FORM_BORDER = "solid 3px",
	DEFAULT_FORM_COLOR = "rgb( 200, 200, 200)" ,
	DEFAULT_FORM_WIDTH = 200,
	DEFAULT_FORM_HEIGHT = 360,
	DEFAULT_FLASH_BORDER = "solid 1px",
	DEFAULT_FLASH_COLOR = "rgb( 178, 205, 105)" ,
	DEFAULT_FLASH_WIDTH = 160,
	DEFAULT_FLASH_HEIGHT = 45,
	CONFIRMATION_WIDTH = 160,
	CONFIRMATION_HEIGHT = 85,
	SMALL_BUTTON_WIDTH = 25,
	SMALL_BUTTON_HEIGHT = 25,
	DEFAULT_ARROW_WIDTH = 40,
	DEFAULT_ARROW_HEIGHT = 35 ,
	DEFAULT_CARD_WIDTH = 246 ,
	DEFAULT_CARD_HEIGHT = 75;
		
// Normal mode setup

// Hard mode setup


var tooltip = function(){
 var id = 'tt';
 var top = 3;
 var left = 3;
 var maxw = 300;
 var speed = 10;
 var timer = 20;
 var endalpha = 95;
 var alpha = 0;
 var tt,t,c,b,h;
 var ie = document.all ? true : false;
 return{
  show:function(v,w){
   if(tt == null){
    tt = document.createElement('div');
    tt.setAttribute('id',id);
    tt.style.zindex = 999;
    t = document.createElement('div');
    t.style.zindex = 999;
    t.setAttribute('id',id + 'top');
    c = document.createElement('div');
    c.style.zindex = 999;
    c.setAttribute('id',id + 'cont');
    b = document.createElement('div');
    b.style.zindex = 999;
    b.setAttribute('id',id + 'bot');
    tt.appendChild(t);
    tt.appendChild(c);
    tt.appendChild(b);
    document.body.appendChild(tt);
    tt.style.opacity = 0;
    tt.style.filter = 'alpha(opacity=0)';
    document.onmousemove = this.pos;
   }
   tt.style.display = 'block';
   c.innerHTML = v;
   tt.style.width = w ? w + 'px' : 'auto';
   if(!w && ie){
    t.style.display = 'none';
    b.style.display = 'none';
    tt.style.width = tt.offsetWidth;
    t.style.display = 'block';
    b.style.display = 'block';
	//$("#faggot").html("we're in boss!");
   }
  if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
  h = parseInt(tt.offsetHeight) + top;
  clearInterval(tt.timer);
  tt.timer = setInterval(function(){tooltip.fade(1)},timer);
  },
  pos:function(e){
   var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
   var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
   tt.style.top = ((u - h) > 0 ? (u - h ) : 0) + 'px';
   tt.style.left = (l + left)+ 'px';
   //$("#faggot").html( (u - h) + 'px' + " and " + (l + left) + 'px' );
  },
  fade:function(d){
   var a = alpha;
   if((a != endalpha && d == 1) || (a != 0 && d == -1)){
    var i = speed;
   if(endalpha - a < speed && d == 1){
    i = endalpha - a;
   }else if(alpha < speed && d == -1){
     i = a;
   }
   alpha = a + (i * d);
   tt.style.opacity = alpha * .01;
   tt.style.filter = 'alpha(opacity=' + alpha + ')';
  }else{
    clearInterval(tt.timer);
     if(d == -1){tt.style.display = 'none'}
  }
 },
 hide:function(){
  clearInterval(tt.timer);
   tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
  }
 };
}();
/****************************
* Utility Functions Class             *
*****************************/
var Generator = function(){ 
	// Drivebox is the element where the action happens; defaults to body
	this.drivebox;
	// Engine is the html5 graphics group we're going to use, defaults to gameQuery
	this.engine;
	// The groups that contain various elements
	this.groups;
	// Id is the element id that will be attached to all shop-generated dom
	this.id;
	// Animation set
	this.animations = {};
	// items set
	this.items;
	// specifications set
	this.specifications;
	
	this.destroy = function(callback){ 
		this.drivebox.hide(750);
		delete this.specifications;
		delete this.items;
		delete this.animations;
		delete this.id;
		this.group.remove();
		this.engine.remove();
		this.drivebox.remove();
		if( callback != undefined )
			callback();
	}	// end this.destroy
	
	this.initialize = function(items, specs){ 
		this.animations = {};
		this.items = items;
		this.specifications = specs;
		this.id = specs['id'];
		$("body").append("<div id='" + this.id + "'></div>" );
		this.drivebox = $("#" + this.id );
		this.drivebox.css( "left", specs['posx'] );
		this.drivebox.css( "top", specs['posy'] );
		this.drivebox.css( ' -moz-border-radius' , "25px");
		this.drivebox.css( 'border-radius' , "25px" );
		this.engine = this.drivebox.playground( { 
			width : MALL_WIDTH ,
			height : MALL_HEIGHT
		} );
		this.engine.css( ' -moz-border-radius' , "25px");
		this.engine.css( 'border-radius' , "25px" );
		this.groups = {};
		for( var k = 0; k < items.length; k++ ){ 
			this.animations['item' + k] = new $.gameQuery.Animation( {
				imageURL : items[k]['tileset']
			} );
		}
		this.animations['arrow'] = new $.gameQuery.Animation({ 
			imageURL : PATH_NAME + "images/shopicons/arrow.png"
		});
		this.animations['smallclose'] = new $.gameQuery.Animation({ 
			imageURL : PATH_NAME + "images/shopicons/smallclose.png"
		});
		this.animations['locked'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/locked.png" 
		} );
		this.animations['vacant'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/vacant.png" 
		} );
		this.animations['close'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/Close.png" 
		} );
		this.animations['approve'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/approve.png" 
		} );
		this.animations['itemtile'] = new $.gameQuery.Animation( { 
			imageURL : PATH_NAME + "images/shopicons/itemicon.png" 
		} );
		this.animations['containerbg']  = new $.gameQuery.Animation( { 
			imageURL : specs['background']['image'] 
		} );
		$.playground().startGame();
	} // end this.initialize
	
	this.CreateContainer = function( ){ 
		var cspec = this.specifications;
		// Step 1: Creating the container
		var theGroup = this.engine.addGroup( this.id + "-shop-container", { 
			overflow : 'visible',
			width : cspec['width'] ,
			height : cspec['height'] ,
			posx : cspec['posx'],
			posy : cspec['posy']
		} ); 
		this.groups['container'] = theGroup;
		
		// Step 2: Setting the CSS
		theGroup.css( "z-index", cspec['posz'] );
		for( var k in cspec['background'] ){ 
			var bgcss = cspec['background'];
			theGroup.css( k, bgcss[k] );
		}
		return theGroup;		
	} // end this.CreateContainer
	
	this.CreateTiles = function( ){ 
		// Step 1: Setting the group
		var tspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + "-shop-tiles-set", { 
			overflow : 'visible',
			width : tspec['width'],
			height : tspec['height'],
			posx : tspec['posx'],
			posy : tspec['posy']
		} );
		this.groups['tiles'] = theGroup;
		
		// Step 2: adding in the sprites
		var tile, tiles = [];
		for( var k = 0; k < this.items.length; k ++ ){ 
			var tilespec = tspec['tile'];
			theGroup.addSprite( this.id + "shop-tile-" + k , {
				animation : this.animations['item' + k] ,
				width : tilespec['width'] ,
				height : tilespec['height'] ,
				posx : tilespec['posx'] ,
				posy : tilespec['posy']
			} );
			tile = $( "#" + this.id + "shop-tile-" + k );
			tiles.push( tile );
			
			// Step 2.5: Establish CSS
			theGroup.css( ' -moz-border-radius' , "25px");
			theGroup.css( 'border-radius' , "25px" );
			var tilecss = tspec['tile'];
			for( var j in tilecss ){ 
				tile.css( j, tilecss[j] );
			}

			// Step 3: adding in mouseover and click functions
			tile.mouseover( (function(item){ 
				return function(){ 
					var help = "<p>Title: " + item['title'] + "</p>";
					help += "<p>Description: " + item['description'] + "</p>";
					help += "<p>Price: $" + item['price'] + "</p>";
					help += "<p>From: inGidio and friends</p>";
					tooltip.show( help );
				};
			} )(this.items[k]) );
			tile.mouseleave( function(){ 
				tooltip.hide();
			} );
			tile.click( ( function(generator, item, p){
				return function(e){ 
					var conform = generator.CreateConfirmForm( item );
					var posx = ( e.pageX % window.innerWidth - CONFIRMATION_WIDTH / 2);
					conform.css( "left",  + (posx > 0 ? posx : 0 ) + "px" );
					conform.css( "top", (tspec['height']) + "px" );
				};
			} )(this, this.items[k], k) );
		} // end for loop
		return tiles;
	} // end this.CreateTiles
	
	this.CreateUI = function(){ 
		// Step 1: Setup the groups
		var gspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + "-shop-ui", { 
			overflow : 'visible',
			width : gspec['width'],
			height : gspec['height']
		} );
		this.groups['ui'] = theGroup;
		
		// Step 1.5: Setup the sprites
		theGroup.addSprite( this.id + "-shop-close", { 
			'width' : DEFAULT_BUTTON_WIDTH,
			'height' : DEFAULT_BUTTON_HEIGHT,
			'animation' : this.animations['close']
		} );
		theGroup.addSprite( this.id + "-shop-approve", { 
			'width' : DEFAULT_BUTTON_WIDTH,
			'height' : DEFAULT_BUTTON_HEIGHT,
			'animation' : this.animations['approve']
		} );
		theGroup.addSprite( this.id + "-shop-smallclose", { 
			'width' : SMALL_BUTTON_WIDTH,
			'height' : SMALL_BUTTON_HEIGHT,
			'animation' : this.animations['smallclose']
		} );
		theGroup.addSprite( this.id + "-shop-arrow", { 
			'width' : DEFAULT_ARROW_WIDTH,
			'height' : DEFAULT_ARROW_HEIGHT,
			'animation' : this.animations['arrow']
		} );
		var smallclose = $("#" + this.id + "-shop-smallclose");
		var arrow = $("#" + this.id + "-shop-arrow");
		var close = $("#" + this.id + "-shop-close");
		var approve = $("#" + this.id + "-shop-approve");
		
		// Step 2: Setup the callbacks
		arrow.mouseover( function(){ 
			tooltip.show( "Cycle through items" );
		} );
		arrow.mouseleave( function(){ 
			tooltip.hide();
		} );
		smallclose.mouseover( function(){ 
			tooltip.show( "Close shop" );
		} );
		smallclose.mouseleave( function(){ 
			tooltip.hide();
		} );
		close.mouseover( function(){ 
			tooltip.show( "Cancel" );
		} );
		close.mouseleave( function(){ 
			tooltip.hide();
		} );
		close.click( gspec['callbacks']['closeshop'] );
		
		approve.mouseover( function(){ 
			tooltip.show( "Confirm!" );
		} );
		approve.mouseleave( function(){ 
			tooltip.hide();
		} );
		smallclose.click( function(){ 
			this.destroy();
		} );
			
		// Step 2.5: Setup the CSS
		theGroup.css( ' -moz-border-radius' , "25px");
		theGroup.css( 'border-radius' , "25px" );
		var uicss = gspec['ui'];
		for( var j in uicss ){ 
			close.css(j, uicss[j]);
			approve.css(j, uicss[j]);
			smallclose.css(j, uicss[j]);
			arrow.css(j, uicss[j]);
		}
		smallclose.css( "left", ( gspec['posx'] + gspec['width'] - SMALL_BUTTON_WIDTH / 2 )+ "px" );
		smallclose.css( "top", (gspec['posy'] + SMALL_BUTTON_WIDTH /2 ) + "px" );
		arrow.css( "left", (gspec['posx'] + DEFAULT_ARROW_WIDTH / 2 + 5 ) + "px" );
		arrow.css( "top", (gspec['posy'] + ( gspec['height'] - DEFAULT_ARROW_HEIGHT ) / 2 ) + "px" ); 
		
		// Step 3: Return this shit!
		return { 
			smallclose : smallclose ,
			arrow : arrow ,
			close : close, 
			approve : approve 
		};		// end return
	} // end this.CreateUI
	
	this.CreateConfirmForm = function(item){ 
		// Step 1: Setting up the containers
		var fspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + item['id'] + "-confirmation", { 
			'overflow' : 'visible',
			'width' : CONFIRMATION_WIDTH,
			'height' : CONFIRMATION_HEIGHT
		} );
		if( this.groups['confirmation'] != undefined )
			this.groups['confirmation'].remove();
		this.groups['confirmation'] = theGroup;
		
		// Step 2: Adding in
		theGroup.addSprite( this.id + item['id'] + "-confirmation-text", { 
			'overflow' : 'visible',
			'width' : CONFIRMATION_WIDTH,
			'height' : CONFIRMATION_HEIGHT
		} ).
		addSprite( this.id + item['id'] + "-confirmation-yes", { 
			'overflow' : 'visible',
			'animation' : this.animations['approve'] ,
			'width' : fspec['ui']['buttonwidth'] ,
			'height' : fspec['ui']['buttonheight'] 
		} ).
		addSprite( this.id + item['id'] + "-confirmation-no", { 
			'overflow' : 'visible',
			'animation' : this.animations['close'] ,
			'width' : fspec['ui']['buttonwidth'] ,
			'height' : fspec['ui']['buttonheight'] 
		} );
		
		// Step 3: CSS and such
		var text = $("#" + this.id + item['id'] + "-confirmation-text" );
		var yes = $("#" + this.id + item['id'] + "-confirmation-yes" );
		var no = $( "#" + this.id + item['id'] + "-confirmation-no" );
		text.append( "<h3>Confirm Purchase</h3>" );
		yes.css( "top", 5 + "px" );
		yes.css( "left", 5 );
		no.css( "top", 5 + "px" );
		no.css( "left", ( 5 + fspec['ui']['buttonwidth'] ) + "px" );
		var fcss = fspec['background'];
		for( var k in fcss ){ 
			theGroup.css( k, fcss[k] );
		}
		
		// Step 4: Interactions
		yes.mouseover( function(){ 
			tooltip.show( "Confirm purchase" );
		} );
		yes.mouseleave( function(){
			tooltip.hide();
		} );
		yes.click( (function(generator){ 
			return function(e){ 
				theGroup.hide();
				var payform = generator.CreatePaymentForm( item );
				payform.css( "top", (fspec['height'] + 5) + "px" );
				var posx = ( e.pageX % window.innerWidth - fspec['form']['width'] / 2);
				payform.css( "left", (posx > 0 ? posx : 0 ) + "px" );
			};
		} )(this) );
		no.mouseover( function(){ 
			tooltip.show( "Cancel" );
		} );
		no.mouseleave( function(){ 
			tooltip.hide();
		} );
		no.click( function(){ 
			theGroup.remove();
		} );
		
		return theGroup;
	} // end this.CreateConfirmForm
	
	this.CreatePaymentForm = function(item){ 
		// Step 1: Setting up the containers
		var fspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + item['id'] + "-payment", { 
			'overflow' : 'visible',
			'width' : fspec['form']['width'],
			'height' : fspec['form']['height']
		} );
		if( this.groups['payment'] != undefined )
			this.groups['payment'].remove();
		this.groups['payment'] = theGroup;
		
		// Step 2: Adding in
		theGroup.addSprite( this.id + item['id'] + "-payment-form", { 
			'overflow' : 'visible',
			'width' : fspec['form']['width'],
			'height' : fspec['form']['height']
		} ).
		addSprite( this.id + item['id'] + "-payment-yes", { 
			'overflow' : 'visible',
			'animation' : this.animations['approve'] ,
			'width' : fspec['ui']['buttonwidth'] ,
			'height' : fspec['ui']['buttonheight'] 
		} ).
		addSprite( this.id + item['id'] + "-payment-no", { 
			'overflow' : 'visible',
			'animation' : this.animations['close'] ,
			'width' : fspec['ui']['buttonwidth'] ,
			'height' : fspec['ui']['buttonheight'] 
		} );
		
		// Step 3: gayQuery naming things
		var form = $("#" + this.id + item['id'] + "-payment-form" );
		var yes = $("#" + this.id + item['id'] + "-payment-yes" );
		var no = $( "#" + this.id + item['id'] + "-payment-no" );
		var myForm = InGidioForm.build([
			{
				'tag' : 'div',
				'content' : "Checkout!"
			},
			{
				'tag' : 'div',
				'content' : "Name: "
			},
			{ 
				'tag' : "input",
				'type' : "text",
				'id' : 'name' ,
				'placeholder' : 'ex. Jack Jackson'
			},
			{
				'tag' : 'div',
				'content' : "Credit Card Number: "
			},
			{ 
				'tag' : "input",
				'type' : "text",
				'id' : 'creditcardnumber' ,
				'placeholder' : 'ex. 1234 4567 8901 2345'
			},
			{
				'tag' : 'div',
				'content' : "CCV: "
			},
			{ 
				'tag' : "input",
				'type' : "text",
				'id' : 'ccv' ,
				'placeholder' : 'ex. 449'
			},
			{
				'tag' : 'div',
				'content' : "Expiration: "
			},
			{ 
				'tag' : "input",
				'type' : "number",
				'id' : 'expiremonth' ,
				'placeholder' : '1',
				'size' : 30,
				'style' : "width: 2em"
			},
			{ 
				'tag' : "input",
				'type' : "number",
				'id' : 'expireyear' ,
				'placeholder' : '2012',
				'size' : 30,
				'style' : "width: 3em"
			},
			{
				'tag' : 'div',
				'content' : "Email: "
			},
			{ 
				'tag' : "input",
				'type' : "text",
				'id' : 'email' ,
				'placeholder' : 'ex. example@ex.com'
			}
		]); // end InGidioForm.build
		
		// Step 3.5: Setting things
		form.append( myForm );
		yes.css( "top", (fspec['form']['height'] - fspec['ui']['buttonheight'] - 5) + "px" );
		yes.css( "left", 5 );
		no.css( "top", (fspec['form']['height'] - fspec['ui']['buttonheight'] - 5) + "px" );
		no.css( "left", ( 5 + fspec['ui']['buttonwidth'] ) + "px" );
		var fcss = fspec['form'];
		for( var k in fcss ){ 
			theGroup.css( k, fcss[k] );
		}
		
		// Step 4: Interactions
		yes.mouseover( function(){ 
			tooltip.show( "Confirm payment" );
		} );
		yes.mouseleave( function(){
			tooltip.hide();
		} );
		yes.click( (function(generator){ 
			return function(e){ 
				theGroup.hide();
				var position = { 
					'x' : e.pageX % window.innerWidth ,
					'y' : e.pageY % window.innerHeight
				};
				generator.CreateFlashMessage( "Purchase Pending...", position );
				var paydata = InGidioForm.get();
				paydata['url'] = document.url;
				fspec['callbacks']['buyitem']( item, paydata );
			};
		} )(this) );
		no.mouseover( function(){ 
			tooltip.show( "Cancel" );
		} );
		no.mouseleave( function(){ 
			tooltip.hide();
		} );
		no.click( function(){ 
			theGroup.remove();
		} );
		return theGroup;
	} // end CreatePaymentForm function
	
	this.CreateFlashMessage = function(message, position){ 
		// Step 1: Setting up the containers
		var fspec = this.specifications;
		var theGroup = this.engine.addGroup( this.id + "-flash", { 
			'overflow' : 'visible',
			'width' : fspec['flash']['width'],
			'height' : fspec['flash']['height']
		} );
		if( this.groups['flash'] != undefined )
			this.groups['flash'].remove();
		this.groups['flash'] = theGroup;		
		
		// Step 2: Adding the sprite
		theGroup.addSprite( this.id + "-flash-message", { 
			'width' : fspec['flash']['width'],
			'height' : fspec['flash']['height'],
			'posx': fspec['posx'] +  fspec['flash']['width'] / 2,
			'posy': fspec['posy' ] + fspec['flash']['height'] / 2
		} );
		var flash = $("#" + this.id + "-flash-message" );
		
		// Step 3: Apply CSS
		var flashcss = fspec['flash'];
		for( var k in flashcss ){ 
			flash.css( k, flashcss[k] );
		}
		
		// Step 4: Putting in the message
		flash.append( "<h4>" + message + "</h4>" );
		
		// Step 5: Setting setting the disapperance
		flash.show(2000, function(){ flash.hide(3000); } );
		
	} // end CreateFlashMessage function
}; //end Generator

/****************************
* Functional Shop Class             *
*****************************/
// Some specifications
/**
items = { 
	'description': 
	'id': for your use
	'company_id': brand name can go here
	'tileset': the picture path
	'price': #
	'title': #
}
*/
/**
specs = { 
	id : if you want to specify 
	width :
	height :
	posx :
	posy :
	z-index:
	background : { css }
	tile : { css }
	callback : { eventname : callback }
}
*/
var InGidioShop = function(){ 
	var spec = {
		'id': DEFAULT_ELEMENT_ID,
		'width': DEFAULT_SHOP_WIDTH,
		'height': DEFAULT_SHOP_HEIGHT,
		'posx': DEFAULT_SHOP_X,
		'posy': DEFAULT_SHOP_Y,
		'posz': DEFAULT_SHOP_Z,
		'background' : { 
			'background-color': DEFAULT_BACKGROUND_COLOR,
			'border': DEFAULT_BACKGROUND_BORDER,
			'image': DEFAULT_BACKGROUND_IMAGE,
			' -moz-border-radius' : "25px",
			'border-radius' : "25px"
		},
		'tile' : { 
			'width' : DEFAULT_TILE_WIDTH,
			'height' : DEFAULT_TILE_HEIGHT,
			'columnper' : DEFAULT_COLUMN_PER,
			'rowper': DEFAULT_ROW_PER,
			'z-index' : DEFAULT_TILE_Z ,
			' -moz-border-radius' : "5px",
			'border-radius' : "5px"
		},
		'ui' : { 
			'buttonwidth' : DEFAULT_BUTTON_WIDTH,
			'buttonheight' : DEFAULT_BUTTON_HEIGHT,
			'z-index' : DEFAULT_UI_Z
		},
		'form' : { 
			'z-index' : DEFAULT_UI_Z,
			'border': DEFAULT_FORM_BORDER,
			'background-color': DEFAULT_FORM_COLOR,
			'width': DEFAULT_FORM_WIDTH ,
			'height': DEFAULT_FORM_HEIGHT,
			'opacity' : 0.97
		},
		'flash' : { 
			'width' : DEFAULT_FLASH_WIDTH,
			'height' : DEFAULT_FLASH_HEIGHT ,
			'z-index' : DEFAULT_UI_Z,
			'border' : DEFAULT_FLASH_BORDER ,
			'background-color' : DEFAULT_FLASH_COLOR,
			'opacity' : 0.97
		},
		'callbacks': { 
			'shopclose': function(){ },
			'buyfailed' : function(){ },
			'buysuccessful' : function(){ },
			'buyitem' : function(item, paydata){ 
				InGidioShop.BuyItem( item, paydata );
			} , // end buyitem
			'approve' : function(){ }
		}
	};
	return{ 
		BuyItem : function(item, paydata){ 
			// Step 1: Setup the query string with jquery
			var data = $.extend( item, paydata );
			data['url'] = document.url;
			// var querydata = $.param( data );
			BuyItem( data );
		}, // end BuyItem
		CallSimpleShop : function(items, specs){
			// Step 1: Setting custom specs and necessar
			var cspec = spec;
			if( specs != undefined )
				cspec = $.extend( specs, spec );
			var generator = new Generator();
			generator.initialize(items, cspec);
							
			// Step 2: Setting up the shop container
			var container = generator.CreateContainer();
			var tiles = generator.CreateTiles();
			var gui = generator.CreateUI();
			
			// Step 3: Present user with the shop
			container.show();
			container.css( "border-radius", "25px" );
			container.css( "-moz-border-radius" , "25px" );
			for( var k = 0; k < tiles.length; k++ ){
				tiles[k].css( "left", (k % DEFAULT_ROW_PER ) * ( cspec['tile']['width'] + 5 ) + 55 );
				tiles[k].css( "top", 5 );
				if( Math.floor( k / DEFAULT_ROW_PER ) > 1 ){ 
					tiles[k].hide();
				}
				else{
					tiles[k].show();
				}
			}
			for( var k in gui )
				gui[k].hide();
			
			// Step 3.5: Setting the arrow scroller
			var arrowcounter = 1;
			gui['arrow'].click( function(){ 
				if( tiles.length <= DEFAULT_ROW_PER )
					return;
				arrowcounter += 1;
				arrowcounter = arrowcounter % DEFAULT_ROW_PER;
				a.spin( tiles,  "left", "", "", {
					"value": "750ms",
					"randomness": "0%",
					"offset": "150ms"
				});
				for( var k = 0; k < tiles.length; k++ ){ 
					if( Math.floor( k / DEFAULT_ROW_PER ) == arrowcounter ){ 
						tiles[k].show(450);
					}
					else{
						tiles[k].hide();
					}
				}
				
			} );
			
			// Step 4: Return the shop object programatically
			return { 
				'container' : container,
				'tiles' : tiles,
				'gui' : gui
			}; // end return
		}, // end CallSimpleShop 
		CallNormalShop : function(items, specs){
		
		},
		CallHardShop : function(items, specs){
		
		}
	}; // end return
} ();// end InGidioShop


var INGIDIO_SCRIPT_PATH = "http://localhost:3000/";
function LoadStyleSheets(){ 
	var indigiStyle = document.createElement("link");
	indigiStyle.type = "text/css";
	indigiStyle.href = INGIDIO_SCRIPT_PATH + "stylesheets/extensions.css";
	indigiStyle.rel = "stylesheet";
	indigiStyle.media = "screen";
	var s = document.getElementsByTagName('body')[0]; 
	s.appendChild(indigiStyle, s); 
};

socket.on( "connection", function(id){ 
	// alert( "We are Connected!" );
	GetShopItems({	url : document.url }); 
	LoadStyleSheets();
	AddShopFunction( "open shop down", function(items){ 
		// alert( "Stuff has come down" );
		InGidioShop.CallSimpleShop(items);
	} );
} );
	



