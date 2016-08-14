import {Blender,JsContext} from './blender';

type Context = JsContext & {
    testFunction();
} 

var bl = new Blender({
    blender:"D:\\Program Files\\Blender Foundation\\Blender\\blender.exe"
});
bl.init();
bl.then(function(ctx:JsContext){
    ctx.evalJs('console.log("hello from js")')
});
bl.evalPy('print("hello from py")');
bl.appendContext('test_append_context.py');
bl.then(function(ctx:Context){
    ctx.exec(function(){
        console.log('Hello from js too..')
    });
    ctx.testFunction();
});
bl.run();