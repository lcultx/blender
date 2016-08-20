var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var Blender = (function () {
    function Blender(options) {
        this.config = options;
    }
    Blender.prototype.init = function () {
        this.jsFunctions = [];
        this.pyFunctions = [];
        return this;
    };
    Blender.prototype.then = function (fun) {
        this.jsFunctions.push(fun);
        return this;
    };
    Blender.prototype.appendContext = function (pyFile) {
    };
    Blender.prototype.appendPath = function (path) {
    };
    Blender.prototype.setContext = function () {
    };
    Blender.prototype.evalPy = function (str) {
        return this;
    };
    Blender.prototype.spawn = function (cmd, callback) {
        var child = child_process.spawn(cmd);
        child.stdout.on('data', function (data) {
            console.log("stdout: " + data);
        });
        child.stderr.on('data', function (data) {
            console.log("stderr: " + data);
        });
        child.on('close', function (code) {
            console.log("child process exited with code " + code);
            if (callback)
                callback();
        });
        return child;
    };
    Blender.prototype.createCmdText = function (pyFile) {
        var cmd = '"' + this.config.blender + '"';
        if (this.config.display == 'none') {
            cmd += ' -b ';
        }
        cmd += ' --python ';
        cmd += pyFile;
        if (this.config.repl == 'ipython') {
            cmd = 'start' + ' "" ' + cmd;
        }
        return cmd;
    };
    Blender.prototype.createCmdFile = function (cmdText, callback) {
        var cmdFile = path.join(__dirname, 'tmp.' + (Math.random() + '').split('.')[1] + '.cmd');
        fs.writeFile(cmdFile, cmdText, function () {
            callback(cmdFile);
        });
    };
    Blender.prototype.deleteCmdFile = function (cmdFile) {
        if (fs.existsSync(cmdFile)) {
            console.log('before exit unlink cmd file: ', cmdFile);
            fs.unlinkSync(cmdFile);
        }
    };
    Blender.prototype.createPyText = function () {
        var pyLibDir = path.join(__dirname, '../library');
        var libDir = path.join(pyLibDir, 'site-packages');
        var enableIPythonScript = '';
        var toggleConsoleScript = '';
        if (this.config.repl == 'ipython') {
            enableIPythonScript = 'import enable_ipython';
            toggleConsoleScript = 'bpy.ops.wm.console_toggle()';
        }
        var execJsScript = "\ndef exec_js():\n    import js2py\n";
        for (var i in this.jsFunctions) {
            var fun = this.jsFunctions[i];
            var funStr = fun.toString().replace(/[\r\n]/g, "");
            funStr = funStr.replace(/'/g, "\\'");
            debugger;
            var funScript = "\n    js2py.eval_js('(" + funStr + ")()')\n";
            execJsScript += funScript;
        }
        var pyText = "\n" + execJsScript + "\n\ndef main():\n    import sys\n    sys.path.append('" + libDir.replace(/\\/g, '\\\\') + "')\n    sys.path.append('" + pyLibDir.replace(/\\/g, '\\\\') + "')\n    import node_include\n    \n    import bpy\n    bpy.context.window.screen = bpy.data.screens['" + (this.config.defaultScreen || 'Scripting') + "']\n    bpy.ops.object.mode_set(mode='" + (this.config.defaultMode || "EDIT") + "')\n    " + enableIPythonScript + "\n    " + toggleConsoleScript + "\n    exec_js()\n\n\nif __name__ == '__main__':\n    main()\n";
        return pyText;
    };
    Blender.prototype.run = function (callback) {
        var _this = this;
        var pyText = this.createPyText();
        this.createPyFile(pyText, function (pyFile) {
            var cmdText = _this.createCmdText(pyFile);
            _this.createCmdFile(cmdText, function (cmdFile) {
                _this.spawn(cmdFile, function () {
                });
            });
        });
    };
    Blender.prototype.createPyFile = function (pyText, callback) {
        var pyFile = path.join(__dirname, 'tmp.' + (Math.random() + '').split('.')[1] + '.py');
        fs.writeFile(pyFile, pyText, function () {
            callback(pyFile);
        });
    };
    Blender.prototype.deletePyFile = function (pyFile) {
        if (fs.existsSync(pyFile)) {
            console.log('before exit unlink py file: ', pyFile);
            fs.unlinkSync(pyFile);
        }
    };
    return Blender;
}());
exports.Blender = Blender;
//# sourceMappingURL=blender.js.map