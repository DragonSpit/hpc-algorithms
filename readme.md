If you like hpc-algorithms, then help us keep more good stuff like this coming.\
Let us know what other algorithms could use acceleration or improvement.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LDD8L7UPAC7QL)

# High Performance Computing Algorithms in JavaScript

Faster and Better Algorithms, starting with high performance sorting:
- LSD Radix Sort for unsigned integer arrays. 20-30X faster than JavaScript's built-in array sort for arrays less than 35 Million.
5-10X faster for arrays greater than 35 Million. This sort algorithm is not in-place, returning a new sorted array.
Discussion, benchmarks and usage in https://duvanenko.tech.blog/2017/06/15/faster-sorting-in-javascript/
- LSD Radix Sort for arrays of objects by an unsigned integer key. 15X faster than JavaScript's built-in .sort().
This is a stable sort, while JavaScript built-in is not stable. This sort algorithm is not in-place, returning a new sorted array.
Discussion, benchmarks and usage in https://duvanenko.tech.blog/2017/07/10/sorting-arrays-of-objects-in-javascript-with-radix-sort/

When you benchmark these algorithms keep in mind that for the first one or two runs a basic JavaScript compiler is used, providing fast
time to start up and to give time for the full optimizing compiler to run. After these two runs optimized code starts being used,
revealing the full performance of LSD Radix Sort. See https://blog.sessionstack.com/how-javascript-works-inside-the-v8-engine-5-tips-on-how-to-write-optimized-code-ac089e62b12e
for more details about the JIT engine in Chrome.

If you have a specific needs for higher performance algorithms, let us know.
