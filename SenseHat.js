matrix = require('node-sense-hat').Leds

matrix.setRotation(180)

//function done(){
//    matrix.showMessage(" One Small Step For Pico's  ",.05,done)
//}
//done();

imu = require('node-sense-hat').Imu
IMU = new imu.IMU()

module.exports = {
    getSensors: {
        type: "function",
        args: [],
        fn: function(args, callback){
            IMU.getValue(function(err,data){
                callback(err, data);
            });
        },
    },

    //LED Matrix http://pythonhosted.org/sense-hat/api/#led-matrix
//set_rotation
//flip_h
//flip_v
//set_pixels
//get_pixel
//load_image
//show_letter
//low_light
//gamma
//gamma_reset
//
    setPixels: {
        type: "action",
        args: ["matrix"],
        fn: function(args, callback){
            callback(null, matrix.setPixels(args.matrix));
        },
    },
    getPixel: {
        type: "function",
        args: ["x","y"],
        fn: function(args, callback){
            callback(null, matrix.getPixel(args.x,args.y));
        },
    },
    getPixels: {
        type: "function",
        args: [],
        fn: function(args, callback){
            callback(null, matrix.getPixels());
        },
    },
    setPixels: {
        type: "action",
        args: ["matrix"],
        fn: function(args, callback){
            callback(null, matrix.setPixels(args.matrix));
        },
    },
    clear: {
        type: "action",
        args: [""],
        fn: function(args, callback){
            callback(null, matrix.clear());
        },
    },
    showMessage: {
        type: "action",
        args: ["message","speed","textColor","backColor"],
        fn: function(args, callback){
            callback(null, matrix.showMessage(args.message,args.speed,args.testColor,args.backColor));
        },
    },

};

