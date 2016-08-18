var child_process_1 = require('child_process');
var fs_1 = require('fs');
var path = require('path');
var Blender = (function () {
    function Blender(options) {
    }
    Blender.prototype._init = function () {
    };
    Blender.prototype.init = function (pyFile) {
        this._init();
        return this;
    };
    Blender.prototype.then = function (fun) {
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
    Blender.prototype.run = function (callback) {
        var pyLibDir = path.join(__dirname, '../library');
        var pyText = "\ndef main():\n    import sys\n    sys.path.append('" + pyLibDir.replace(/\\/g, '\\\\') + "')\n    from moduleA import funA\n    funA()\n    import moduleB\n\n\nif __name__ == '__main__':\n    main()\n";
        var pyFile = path.join(__dirname, 'tmp.' + (Math.random() + '').split('.')[1] + '.py');
        console.log('start exec this python script in blender (' + pyFile + ')');
        console.log('################################################################################');
        console.log(pyText);
        console.log('################################################################################');
        fs_1.writeFile(pyFile, pyText, function () {
            var bl = child_process_1.spawn('blender', ['-b', '--python', pyFile]);
            bl.stdout.on('data', function (data) {
                console.log("stdout: " + data);
            });
            bl.stderr.on('data', function (data) {
                console.log("stderr: " + data);
            });
            bl.on('close', function (code) {
                console.log("child process exited with code " + code);
                fs_1.unlinkSync(pyFile);
            });
        });
    };
    return Blender;
}());
exports.Blender = Blender;
//# sourceMappingURL=blender.js.map