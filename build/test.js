var blender_1 = require('./blender');
var bl = new blender_1.Blender({
    blender: "C:\\Program Files\\Blender Foundation\\Blender\\blender.exe",
    defaultScreen: '3D View Full',
    defaultMode: 'EDIT',
});
bl.init()
    .then(function () {
    console.log("hello from js");
})
    .then(function (ctx) {
    console.log('Hello from js too..');
}).run();
//# sourceMappingURL=test.js.map