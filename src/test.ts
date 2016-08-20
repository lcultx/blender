import {Blender, JsContext} from './blender';

type Context = JsContext & {
   testFunction();
}

var bl = new Blender({
   blender: "C:\\Program Files\\Blender Foundation\\Blender\\blender.exe",
   //blender:"D:\\BlVray\\blender.exe",
   //repl:"node",
   //repl:"ipython",  
   //display:"none",
   defaultScreen: '3D View Full',
   defaultMode: 'EDIT',
});
bl.init()
   .then(function () {
      console.log("hello from js")
   })
   //.evalPy('print("hello from py")')
   .then(function (ctx: Context) {
      console.log('Hello from js too..')
   }).run();