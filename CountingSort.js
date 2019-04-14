
var HpcAlgorithms = HpcAlgorithms || {};

HpcAlgorithms.Sorting = (function()
{
	var HistogramOneByteComponentUInt8 = function(inArray)
	{
		var numberOfBins = 256;

		var count = new Array(numberOfBins);
		for (var b = 0; b < numberOfBins; b++)
			count[b] = 0;

		for (var i = 0; i < inArray.length; i++)
			count[ inArray[i] ]++;

		return count;
	}

	/**
	 * Counting Sort of typed unsigned byte array
	 * This algorithm is in-place
	 * @param  {Array of bytes} inputArray Array of numbers, which must be a typed array of unsigned bytes
	 * @return {Array of bytes} Sorted array of unsigned bytes
	 */
	var SortCountingUInt8 = function(inputArray)
	{
		var count = HistogramOneByteComponentUInt8(inputArray);

			var startIndex = 0;
			for (var countIndex = 0; countIndex < count.length; countIndex++)
			{
				inputArray.fill(countIndex, startIndex, startIndex + count[countIndex]);  // 2X faster than using a for loop to fill an array
				startIndex += count[countIndex];
			}
			return inputArray;
	}

	var HistogramOneWordComponent = function(inArray)
	{
		var numberOfBins = 65536;

		var count = new Array(numberOfBins);
		for (var b = 0; b < numberOfBins; b++)
			count[b] = 0;

		for (var current = 0; current < inArray.length; current++)
			count[ inArray[current] ]++;

		return count;
	}

	/**
	 * Counting Sort of typed unsigned short array typed array
	 * This algorithm is in-place
	 * @param  {Array of unsigned short} inputArray Array of numbers, which must be a typed array of unsigned short
	 * @return {Array of unsigned short} Sorted array of unsigned short numbers
	 */
	var SortCountingUInt16 = function(inputArray)
	{
			var count = HistogramOneWordComponent(inputArray);

			var startIndex = 0;
			for (var countIndex = 0; countIndex < count.length; countIndex++)
			{
				inputArray.fill(countIndex, startIndex, startIndex + count[countIndex]);
				startIndex += count[countIndex];
			}
			return inputArray;
	}
		
	return {
		SortCountingUInt8: SortCountingUInt8,
		SortCountingUInt16: SortCountingUInt16
	};
})();
