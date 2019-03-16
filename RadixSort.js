var HPCjs = HPCjs || {};

HPCjs.Algorithm = (function()
{
    var internalState = "Message";

    var privateMethod = function() {
        // Do private stuff, or build internal.
        return internalState;
    };
    var publicMethod = function() {
        return privateMethod() + " stuff";
    };

	var extractDigit = function( a, bitMask, shiftRightAmount )
	{
		var digit = (a & bitMask) >>> shiftRightAmount; // extract the digit we are sorting based on
		return digit;
	}
	
	// Sorts an array of unsigned integers only
	// Be careful as Javascript has only the notion of a number and not unsigned integer, signed integer, floating-point, double, decimal, etc.
	var sortRadixLsdUnsigned = function(_input_array)
	{
		if (typeof _input_array.constructor === Array && typeof _input_array[0] === "number") throw new TypeError("Input argument must be an array of unsigned integers");
		var numberOfBins = 256;
		var Log2ofPowerOfTwoRadix = 8;
		var _output_array = new Array(_input_array.length);
		var count = new Array(numberOfBins);
		var _output_array_has_result = false;

		var bitMask = 255;
		var shiftRightAmount = 0;

		var startOfBin = new Array( numberOfBins );
		var endOfBin   = new Array( numberOfBins );

		while( bitMask != 0 ) // end processing digits when all the mask bits have been processed and shifted out, leaving no bits set in the bitMask
		{
			for (var i = 0; i < numberOfBins; i++ )
				count[ i ] = 0;
			for (var _current = 0; _current < _input_array.length; _current++ ) // Scan the array and count the number of times each digit value appears - i.e. size of each bin
				count[ extractDigit( _input_array[ _current ], bitMask, shiftRightAmount ) ]++;
	 
			startOfBin[ 0 ] = endOfBin[ 0 ] = 0;
			for( var i = 1; i < numberOfBins; i++ )
				startOfBin[ i ] = endOfBin[ i ] = startOfBin[ i - 1 ] + count[ i - 1 ];
			for ( var _current = 0; _current < _input_array.length; _current++ )
				_output_array[ endOfBin[ extractDigit( _input_array[ _current ], bitMask, shiftRightAmount ) ]++ ] = _input_array[ _current ];
	 
			bitMask <<= Log2ofPowerOfTwoRadix;
			shiftRightAmount += Log2ofPowerOfTwoRadix;
			_output_array_has_result = !_output_array_has_result;
	 
			var tmp = _input_array, _input_array = _output_array, _output_array = tmp; // swap input and output arrays
		}
		if ( _output_array_has_result )
			for ( var _current = 0; _current < _input_array.length; _current++ ) // copy from output array into the input array
				_input_array[ _current ] = _output_array[ _current ];
	 
		return _input_array;
	}
	
	// Sorts an array of user define classes based on an unsigned integer keys only
	// Be careful as Javascript has only the notion of a number and not unsigned integer, signed integer, floating-point, double, decimal, etc.
	var sortRadixLsdUserUnsigned = function(_input_array, getKey)
	{
		var numberOfBins = 256;
		var Log2ofPowerOfTwoRadix = 8;
		var _output_array = new Array(_input_array.length);
		var count = new Array(numberOfBins);
		var _output_array_has_result = false;
		var bitMask = 255;
		var shiftRightAmount = 0;
		var startOfBin = new Array( numberOfBins );
		var endOfBin   = new Array( numberOfBins );

		while( bitMask != 0 )    // end processing digits when all the mask bits have been processed and shifted out, leaving no bits set in the bitMask
		{
			for (var i = 0; i < numberOfBins; i++ )
				count[ i ] = 0;
			for (var _current = 0; _current < _input_array.length; _current++ )    // Scan the array and count the number of times each digit value appears - i.e. size of each bin
				count[ extractDigit( getKey(_input_array[ _current ]), bitMask, shiftRightAmount ) ]++;
			startOfBin[ 0 ] = endOfBin[ 0 ] = 0;
			for( var i = 1; i < numberOfBins; i++ )
				startOfBin[ i ] = endOfBin[ i ] = startOfBin[ i - 1 ] + count[ i - 1 ];
			for ( var _current = 0; _current < _input_array.length; _current++ )
				_output_array[ endOfBin[ extractDigit( getKey(_input_array[ _current ]), bitMask, shiftRightAmount ) ]++ ] = _input_array[ _current ];
			bitMask <<= Log2ofPowerOfTwoRadix;
			shiftRightAmount += Log2ofPowerOfTwoRadix;
			_output_array_has_result = !_output_array_has_result;
			var tmp = _input_array, _input_array = _output_array, _output_array = tmp;    // swap input and output arrays
		}
		if ( _output_array_has_result )
			for ( var _current = 0; _current < _input_array.length; _current++ )    // copy from output array into the input array
				_input_array[ _current ] = _output_array[ _current ];
		return _input_array;
	}
	
    return {
        //someProperty: 'prop value',
        sortRadixLsd: sortRadixLsdUnsigned,
		sortRadixLsdUser: sortRadixLsdUserUnsigned
    };
})();
