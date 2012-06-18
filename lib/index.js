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

        var foo = libs.filter(function(libname){
            // XXX - this check may not be sufficient =0(
            return path.match(new RegExp(libname+'$'));
        });

        if(foo.length > 0)
            new_path = mock_path + p.normalize('/' + path);
      
        return orig_req.apply(self, [new_path]);
    }
}

