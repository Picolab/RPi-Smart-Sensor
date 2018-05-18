var Discover = require('node-discover');
var request = require('request');

var d = Discover({
  //helloInterval: 1000, // How often to broadcast a hello packet in milliseconds
  //checkInterval: 2000, // How often to to check for missing nodes in milliseconds
  //nodeTimeout: 2000, // Consider a node dead if not seen in this many milliseconds
  //masterTimeout: 2000, // Consider a master node dead if not seen in this many milliseconds
  //mastersRequired: 1, // The count of master processes that should always be available
  //weight: Math.random(), // A number used to determine the preference for a specific process to become master. Higher numbers win.
 
  //address: '0.0.0.0', // Address to bind to
  port: 8180, // Port on which to bind and communicate with other node-discovery processes
  //broadcast: '255.255.255.255', // Broadcast address if using broadcast
  //multicast: null, // Multicast address if using multicast (don't use multicast, use broadcast)
  //mulitcastTTL: 1, // Multicast TTL for when using multicast
 
  //algorithm: 'aes256', // Encryption algorithm for packet broadcasting (must have key to enable)
  //key: null, // Encryption key if your broadcast packets should be encrypted (null means no encryption)
 
  //ignore: 'self', // Which packets to ignore: 'self' means ignore packets from this instance, 'process' means ignore packets from this process
  //ignoreDataErrors: true // whether to ignore data errors including parse errors
});

var resources = {},dids = [];

// advertise the process with an object
d.advertise({
  name: "PicoEngine",
  resources: resources
});

d.on('added', function(obj) {
  //console.log('A new node has been added.',obj);
  for (var i = 0; i < dids.length; i++) { 
    request.post(
    "http://localhost:8080/sky/event/"+dids[i]+"/12345/discovery/engine_found",
    { json: obj },
    function (error, response, body) { });
  }

});
 
d.on('removed', function(obj) {
  //console.log('A node has been removed.',obj);
  for (var i = 0; i < dids.length; i++) { 
    request.post(
    "http://localhost:8080/sky/event/"+dids[i]+"/12345/discovery/engine_lost",
    { json: obj  },
    function (error, response, body) { });
  }
});


module.exports = {
    resources: {
        type: "function",
        args: [],
        fn: function(args, callback){
            callback(null, resources);
        },
    },
    dids: {
        type: "function",
        args: [],
        fn: function(args, callback){
            callback(null, dids);
        },
    },
    addResource: {
        type: "action",
        args: ["key","value"],
        fn: function(args, callback){
        	resources.set(args.key,args.value);
            callback(null, null);
        },
    },
    removeResource: {
        type: "action",
        args: ["key"],
        fn: function(args, callback){
        	delete resources[args.key];
            callback(null, null);
        },
    },
    addDid: {
        type: "action",
        args: ["did"],
        fn: function(args, callback){
        	dids.push(args.did);
            callback(null, null);
        },
    },
    removeDid: {
        type: "action",
        args: ["did"],
        fn: function(args, callback){
        	var index = array.indexOf(args.did);
			if (index > -1) {
			  array.splice(index, 1);
			}
            callback(null, null);
        },
    },
};

