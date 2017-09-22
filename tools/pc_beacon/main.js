var bleno = require("bleno");

var uuid = 'e2c56db5dffb48d2b060d0f5a71096e0';
var major = 0; // 0x0000 - 0xffff
var minor = 0; // 0x0000 - 0xffff
var measuredPower = -59; // -128 - 127

console.log("gump test ibeacon");

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower, function(err) {
            console.log("beacon err: " + err);
        });
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function() {
    console.log('on -> advertisingStart');
});

bleno.on('advertisingStop', function() {
    console.log('on -> advertisingStop');
});
