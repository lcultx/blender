var blender_1 = require('./blender');
var bl = new blender_1.Blender({
    blender: "D:\\Program Files\\Blender Foundation\\Blender\\blender.exe"
});
bl.init();
bl.then(function (ctx) {
    ctx.evalJs('console.log("hello from js")');
});
bl.evalPy('print("hello from py")');
bl.appendContext('test_append_context.py');
bl.then(function (ctx) {
    ctx.exec(function () {
        console.log('Hello from js too..');
    });
    ctx.testFunction();
});
bl.run();
//# sourceMappingURL=test.js.map