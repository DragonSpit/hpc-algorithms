console.log('Node is installed!');

var MYNS = MYNS || {};

MYNS.subns = (function() {
    var internalState = "Message";

    var privateMethod = function() {
        // Do private stuff, or build internal.
        return internalState;
    };
    var publicMethod = function() {
        return privateMethod() + " stuff";
    };

    return {
        someProperty: 'prop value',
        publicMethod: publicMethod
    };
})();
