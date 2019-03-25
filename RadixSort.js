// TODO: It may be faster to do shift-mask instead of the current mask-shift, since the mask would then be the same for all bytes (0xff).
// TODO: Remove extract digit function and just inline the core code. I've seem this improve performance in C#. Not sure how agressively JavaScript inlines small functions.
// TODO: Compare performance versus TimSort for random, pre-sorted and constant, since TimSort is available in JavaScript thru npm
//       (https://stackoverflow.com/questions/40721767/what-is-the-fastest-way-to-sort-a-largeish-array-of-numbers-in-javascript)

var HpcAlgorithms = HpcAlgorithms || {};

HpcAlgorithms.Sorting = (function()
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

	/**
	 * Radix Sort (Least Significant Digit - LSD) of unsigned integer array with values up to 32-bits (e.g. 0, 1, 2, ... 2_000_000_000, ...)
	 * This algorithm is not in-place - i.e. returns a sorted array
	 * @param  {Array of numbers} inputArray Array of numbers, which must be unsigned integers of values within 32-bits
	 * @return {Array of numbers} Sorted array of numbers
	 */
	var RadixSortLsdUInt32_old = function(inputArray)
	{
		if (typeof inputArray.constructor === Array && typeof inputArray[0] === "number") throw new TypeError("Input argument must be an array of unsigned integers");
		var numberOfBins = 256;
		var Log2ofPowerOfTwoRadix = 8;
		var outputArray = new Array(inputArray.length);
		var count = new Array(numberOfBins);
		var outputArrayHasResult = false;

		var bitMask = 255;
		var shiftRightAmount = 0;

		var startOfBin = new Array( numberOfBins );
	
		while( bitMask != 0 ) // end processing digits when all the mask bits have been processed and shifted out, leaving no bits set in the bitMask
		{
			for (var i = 0; i < numberOfBins; i++ )
				count[ i ] = 0;
			for (var current = 0; current < inputArray.length; current++ ) // Scan the array and count the number of times each digit value appears - i.e. size of each bin
				count[ extractDigit( inputArray[ current ], bitMask, shiftRightAmount ) ]++;
	 
			startOfBin[ 0 ] = 0;
			for( var i = 1; i < numberOfBins; i++ )
				startOfBin[ i ] = startOfBin[ i - 1 ] + count[ i - 1 ];
			for ( var current = 0; current < inputArray.length; current++ )
				outputArray[ startOfBin[ extractDigit( inputArray[ current ], bitMask, shiftRightAmount ) ]++ ] = inputArray[ current ];
	 
			bitMask <<= Log2ofPowerOfTwoRadix;
			shiftRightAmount += Log2ofPowerOfTwoRadix;
			outputArrayHasResult = !outputArrayHasResult;
	 
			var tmp = inputArray, inputArray = outputArray, outputArray = tmp; // swap input and output arrays
		}
		if ( outputArrayHasResult )
			for ( var current = 0; current < inputArray.length; current++ ) // copy from output array into the input array
				inputArray[ current ] = outputArray[ current ];
	 
		return inputArray;
	}

	var HistogramByteComponents = function(inArray, l, r)
	{
	  var numberOfDigits = 4;
	  var numberOfBins = 256;
	
	  var count = new Array(numberOfDigits);
	  for (var d = 0; d < numberOfDigits; d++)
	  {
		count[d] = new Array(numberOfBins);
		for (var b = 0; b < numberOfBins; b++)
		  count[d][b] = 0;
	  }
	  
	  for (var current = l; current <= r; current++)    // Scan the array and count the number of times each digit value appears - i.e. size of each bin
	  {
		var value = inArray[current];
		count[0][ value &       0xff       ]++;
		count[1][(value &     0xff00) >>  8]++;
		count[2][(value &   0xff0000) >> 16]++;
		count[3][(value & 0xff000000) >> 24]++;
	  }
	  return count;
	}
	
	/**
	 * Radix Sort (Least Significant Digit - LSD) of unsigned integer array with values up to 32-bits (e.g. 0, 1, 2, ... 2_000_000_000, ...)
	 * This algorithm is not in-place - i.e. returns a sorted array
	 * @param  {Array of numbers} inputArray Array of numbers, which must be unsigned integers of values within 32-bits
	 * @return {Array of numbers} Sorted array of numbers
	 */
	var RadixSortLsdUInt32 = function(inputArray)
	{
		if (typeof inputArray.constructor === Array && typeof inputArray[0] === "number") throw new TypeError("Input argument must be an array of unsigned integers");
		var numberOfBins = 256;
		var numberOfDigits = 4;
		var Log2ofPowerOfTwoRadix = 8;
		var outputArrayHasResult = false;
		var bitMask = 255;
		var shiftRightAmount = 0;
		var outputArray = new Array(inputArray.length);

		var count = HistogramByteComponents(inputArray, 0, inputArray.length - 1);

		var startOfBin = new Array(numberOfDigits);
		var d = 0;
		for (d = 0; d < numberOfDigits; d++)
		{
			startOfBin[d] = new Array(numberOfBins);
			startOfBin[d][0] = 0;
			for (var b = 1; b < numberOfBins; b++ )
			startOfBin[d][b] = startOfBin[d][b - 1] + count[d][b - 1];
		}

		d = 0;
		while( bitMask != 0 ) // end processing digits when all the mask bits have been processed and shifted out, leaving no bits set in the bitMask
		{
			var startOfBinLoc = startOfBin[d];
			for ( var current = 0; current < inputArray.length; current++ )
			outputArray[ startOfBinLoc[ (inputArray[ current ] & bitMask) >>> shiftRightAmount ]++ ] = inputArray[ current ];
		
			bitMask <<= Log2ofPowerOfTwoRadix;
			shiftRightAmount += Log2ofPowerOfTwoRadix;
			outputArrayHasResult = !outputArrayHasResult;
			d++;
		
			var tmp = inputArray, inputArray = outputArray, outputArray = tmp; // swap input and output arrays
		}
		
		return outputArrayHasResult ? outputArray : inputArray;;
	}
		
	/**
	 * Radix Sort (Least Significant Digit - LSD) of user defined type/class array based on a key that is a 32-bit unsigned integer (e.g. 0, 1, 2, ... 2_000_000_000, ...)
	 * This algorithm is not in-place - i.e. returns a sorted array. This algorithm is stable.
	 * @param  {Array} inputArray user defined type/class  (UDT) array with each element containing a key that is a 32-bit unsigned integer
	 * @param  {function} getKey function to extract and return a numeric key from the user defined type/class to sort on
	 * @return {Array of numbers} Sorted array of a user defined type
	 */
	var RadixSortLsdUdtUInt32 = function(inputArray, getKey)
	{
		var numberOfBins = 256;
		var Log2ofPowerOfTwoRadix = 8;
		var OutputArray = new Array(inputArray.length);
		var count = new Array(numberOfBins);
		var OutputArrayHasResult = false;
		var bitMask = 255;
		var shiftRightAmount = 0;
		var startOfBin = new Array( numberOfBins );

		while( bitMask != 0 )    // end processing digits when all the mask bits have been processed and shifted out, leaving no bits set in the bitMask
		{
			for (var i = 0; i < numberOfBins; i++ )
				count[ i ] = 0;
			for (var current = 0; current < inputArray.length; current++ )    // Scan the array and count the number of times each digit value appears - i.e. size of each bin
				count[ extractDigit( getKey(inputArray[ current ]), bitMask, shiftRightAmount ) ]++;
			startOfBin[ 0 ] = 0;
			for( var i = 1; i < numberOfBins; i++ )
				startOfBin[ i ] = startOfBin[ i - 1 ] + count[ i - 1 ];
			for ( var current = 0; current < inputArray.length; current++ )
				OutputArray[ startOfBin[ extractDigit( getKey(inputArray[ current ]), bitMask, shiftRightAmount ) ]++ ] = inputArray[ current ];
			bitMask <<= Log2ofPowerOfTwoRadix;
			shiftRightAmount += Log2ofPowerOfTwoRadix;
			OutputArrayHasResult = !OutputArrayHasResult;
			var tmp = inputArray, inputArray = OutputArray, OutputArray = tmp;    // swap input and output arrays
		}
		if ( OutputArrayHasResult )
			for ( var current = 0; current < inputArray.length; current++ )    // copy from output array into the input array
				inputArray[ current ] = OutputArray[ current ];
		return inputArray;
	}
	
    return {
        //someProperty: 'prop value',
        RadixSortLsdUInt32: RadixSortLsdUInt32,
		RadixSortLsdUdtUInt32: RadixSortLsdUdtUInt32
    };
})();
