import {execFile, spawn} from 'child_process';
import {writeFile, unlinkSync} from 'fs';
import * as path from 'path';
export type JsContext = {
    openBlFile(blFile: string);
    evalJs(jsStr: string);
    exec(fun: Function);
}

export class Blender {

    constructor(options: {
        blender: string
    }) {

    }

    /**运行内置start.py文件， 将blender对象暴露给js环境*/
    private _init() {

    }

    /**可以传入一个pyhton文件完成初始化设置 */
    public init(pyFile?: string) {
        this._init();
        return this;
    }

    public then(fun: (ctx: JsContext) => void) {
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

    /**最终形成一个python脚本传入blender运行 */
    public run(callback?: Function) {

        var pyLibDir = path.join(__dirname,'../library');
        var pyText = 
`
def main():
    import sys
    sys.path.append('${pyLibDir.replace(/\\/g,'\\\\')}')
    from moduleA import funA
    funA()
    import moduleB


if __name__ == '__main__':
    main()
`

        var pyFile = path.join(__dirname, 'tmp.' +( Math.random() + '').split('.')[1] + '.py');
        console.log('start exec this python script in blender (' + pyFile + ')')
        console.log('################################################################################');
        console.log(pyText)
        console.log('################################################################################');  

        writeFile(pyFile, pyText, () => {

            const bl = spawn('blender', ['-b', '--python', pyFile]);

            bl.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            bl.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });

            bl.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                unlinkSync(pyFile);
            });
        });

    }
}

