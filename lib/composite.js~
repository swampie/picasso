var sys = require('sys');
var childProcess = require('child_process');

exports.create = function() { 
  return compositeCommand(new Object()); 
};

var compositeCommand = function(obj) {
  obj.inArgs = [];
  obj.outArgs = [];
  
  obj.dissolve = function(dissolveValue) {
       return obj.makeArgs(["-dissolve", dissolveValue]);
  };

  obj.gravity = function(grav){
	return obj.makeArgs(["-gravity", grav]);
  }

  obj.withWatermark = function(watermarkFile) {
      return obj.makeArgs([watermarkFile]);
  };

  obj.source = function(input){
 	return obj.makeArgs([input]);
  }
  obj.makeArgs = function(inargs, outargs) {
    if (arguments.length == 1) {
      outargs = inargs;
      inargs = null;
    }
    if (inargs) {
      obj.inArgs = obj.inArgs.concat(inargs);
    }
    if (outargs) {
      obj.outArgs = obj.outArgs.concat(outargs);
    }
    return obj;
  };

  obj.write = function(out, callback) {
    obj.inArgs.push(obj.input); 
    obj.outArgs.push(out);
    var args = obj.inArgs.concat(obj.outArgs);
    obj.__run("composite", args, callback);
  };
  obj.__run = function (cmd, args, callback) {
    args.unshift(cmd);
    cmd = "composite";
    sys.puts("running command: " + cmd + " " + args.join(" "));
    var p = childProcess.exec((cmd + " " + args.join(" ")), function(error, stdout, stderr) {
      callback();
    });
  };
  return obj;
}
