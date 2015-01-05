var p = require('path');

module = module.exports = function (mock_path, libs){

    if(mock_path == '')
        throw new Error("Mock path must be a string");

    // Strip any trailing slashs so that we have a somewhat normalized
    // path to work from
    mock_path = mock_path.replace(/\/+$/, '');

    if(!(libs instanceof Array))
        throw new Error("Mocked libs must be an array");

    var Module = require('module');
    var orig_req = Module.prototype.require;

    // Here we override the prototype for require because each package
    // will get a new module object.
    Module.prototype.require = function(path){
        var self = this;
        var new_path = path;

        var foo = libs.sort(
              function(a,b){
                return b.length - a.length;
              }
            ).filter(function(libname){
            // NB - We need a lookbehind assertion here, which JS
            // doesn't support, but we can fake using reversed
            // strings and lookahead... yes it's a mindwarp
            var tmp_path = path.split('').reverse().join(''); // compat
            var tmp_libname = libname.split('').reverse().join(''); // compat

            // In proper Regexp this would map to:
            // '(?<=(?:^|/))' + libname + '$'
            return tmp_path.match(new RegExp('^' + tmp_libname + '(?=(?:/|$))'));
        });

        if(foo.length > 0) {
            new_path = mock_path + p.normalize('/' + path);
            // If we're using a mock lib, load it as if it was being loaded
            // from the main script (for require() behaviour)
            self.parent = process.mainModule;
        }

        return orig_req.apply(self, [new_path]);
    }
}

