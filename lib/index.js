
function mocked(mock_path, possible) {
    if(typeof mock_path != 'string' || mock_path == ''){
      throw new Error("Mock path must be a string +++ " + typeof mock_path);
    }

    if(!Array.isArray(possible)){
      throw new Error("Mocked libs must be an array");
    }

    var parent = module.parent;
    var orig_require = parent.require;

    var fake = make_sneaky_require(mock_path, possible, orig_require);
    parent.require = fake; 

    return;
}

function make_sneaky_require (mock_path, possible, orig_require) {
    var libs = new Set(possible);
    var fake = function (path) {
        if(!libs.has(path)) return orig_require.call(null, path);
        
        var old_path = process.env.NODE_PATH;
        process.env.NODE_PATH = mock_path;
        var mock_mod = orig_require.call(null, './' + mock_path + path);
        process.env.NODE_PATH = old_path;
        return mock_mod;
    }
    fake.mock_path = mock_path;
    fake.possible_modules = possible;
    return fake;
}

module.exports = mocked;
mocked.make_sneaky_require = make_sneaky_require;
