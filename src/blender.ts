import * as child_process from 'child_process';
import * as fs from 'fs';
import * as tty from 'tty';
import * as path from 'path';
export type JsContext = {
   openBlFile(blFile: string);
   evalJs(jsStr: string);
   exec(fun: Function);
}

export type Settings = {
   blender: string,
   repl?: string,// node | ipython 
   display?: string,// none
   defaultScreen?:string,// 3D View Full | Animation | Compositing | Default | Game Logic | Motion Tracking | Scripting | UV Editing | Video Editing ,default use Scripting 
   defaultMode?:string,// Edit | Object | ... default Edit
}

export class Blender {

   private config: Settings;
   private jsFunctions:Array<Function>;
   private pyFunctions:Array<Function>;

   constructor(options: Settings) {
      this.config = options;
   }

 
   public init() {
      this.jsFunctions = [];
      this.pyFunctions = [];
      return this;
   }

   public then(fun: (ctx: JsContext) => void) {
      this.jsFunctions.push(fun);
      return this;
   }

   public appendContext(pyFile: string) {

   }

   public appendPath(path: string) {

   }

   private setContext() {

   }

   public evalPy(str: string) {
      return this;
   }

   /**执行一条系统命令 */
   private spawn(cmd: string, callback?: Function) {
      const child = child_process.spawn(cmd);
      child.stdout.on('data', (data) => {
         console.log(`stdout: ${data}`);
      });

      child.stderr.on('data', (data) => {
         console.log(`stderr: ${data}`);
      });

      child.on('close', (code) => {
         console.log(`child process exited with code ${code}`);
         if (callback) callback();
      });

      return child;
   }

   private createCmdText(pyFile: string) {
      var cmd = '"' + this.config.blender + '"';
      if (this.config.display == 'none') {
         cmd += ' -b '
      }
      cmd += ' --python '
      cmd += pyFile;
      if (this.config.repl == 'ipython') {
         cmd = 'start' + ' "" ' + cmd;
      }
      return cmd;
   }

   private createCmdFile(cmdText, callback) {
      var cmdFile = path.join(__dirname, 'tmp.' + (Math.random() + '').split('.')[1] + '.cmd');
      fs.writeFile(cmdFile, cmdText, () => {
         callback(cmdFile);
      });
   }

   private deleteCmdFile(cmdFile: string) {
      if (fs.existsSync(cmdFile)) {
         console.log('before exit unlink cmd file: ', cmdFile)
         fs.unlinkSync(cmdFile)
      }
   }
   private createPyText() {
      var pyLibDir = path.join(__dirname, '../library');
      var libDir = path.join(pyLibDir, 'site-packages');

      var enableIPythonScript = '';
      var toggleConsoleScript = '';
      if (this.config.repl == 'ipython') {
         enableIPythonScript = 'import enable_ipython';
         toggleConsoleScript = 'bpy.ops.wm.console_toggle()';
      }

      var execJsScript = 
`
def exec_js():
    import js2py
`
      for(var i in this.jsFunctions){
         var fun = this.jsFunctions[i];
         var funStr = fun.toString().replace(/[\r\n]/g, "");
         funStr = funStr.replace(/'/g,"\\'");
         debugger
         var funScript = 
`
    js2py.eval_js('(${funStr})()')
`
         execJsScript += funScript;
      }

      var pyText =
         `
${execJsScript}

def main():
    import sys
    sys.path.append('${libDir.replace(/\\/g, '\\\\')}')
    sys.path.append('${pyLibDir.replace(/\\/g, '\\\\')}')
    import node_include
    
    import bpy
    bpy.context.window.screen = bpy.data.screens['${this.config.defaultScreen || 'Scripting'}']
    bpy.ops.object.mode_set(mode='${this.config.defaultMode || "EDIT"}')
    ${enableIPythonScript}
    ${toggleConsoleScript}
    exec_js()


if __name__ == '__main__':
    main()
`
      return pyText;
   }


   /**最终形成一个python脚本传入blender运行 */
   public run(callback?: Function) {
      var pyText = this.createPyText();
      this.createPyFile(pyText, (pyFile) => {
         var cmdText = this.createCmdText(pyFile);
         this.createCmdFile(cmdText, (cmdFile) => {
            this.spawn(cmdFile, () => {
               // setTimeout(() => {
               //    this.deletePyFile(pyFile);
               //    this.deleteCmdFile(cmdFile);
               // }, 30);

            })
         })
      })

   }

   /**将脚本写入文件 */
   private createPyFile(pyText: string, callback: Function) {
      var pyFile = path.join(__dirname, 'tmp.' + (Math.random() + '').split('.')[1] + '.py');
      fs.writeFile(pyFile, pyText, () => {
         callback(pyFile);
      });
   }

   private deletePyFile(pyFile: string) {
      if (fs.existsSync(pyFile)) {
         console.log('before exit unlink py file: ', pyFile)
         fs.unlinkSync(pyFile)
      }
   }
}

