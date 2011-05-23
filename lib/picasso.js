exports = module.exports = Picasso;
var fs = require('fs')
var config = require('./picasso-conf').config;

var picasso = Picasso.prototype;

function Picasso(args){
	this.ready = false;
	this.debugOn = true;
	this.modules = {};
	this.registeredOptions = {};
	this.configure(args);
}
picasso.configure = function(args){
	var self = this;
	//load modules
	fs.readdirSync(config.modules_dir).forEach(function(file) {
		var modname = file.substring(0, file.lastIndexOf("."));
		var extension = "."+file.substring(file.lastIndexOf(".")+1);
		if(extension!='.js'){
		    self.debug("ignoring "+modname + extension);
		}else{
		    console.log("installing " + modname);
		    var module = require(config.modules_dir+"/"+modname);
		    self.modules[modname] = module;
		    self.registeredOptions[module.conf().registeredOption] = modname;
		}
  });
    
	
	
	
	
}

picasso.debug = function(str){
    if(this.debugOn){
	console.log("[DEBUG]>"+str);
    }
}

picasso.skills = function(){
	var self = this;
	Object.keys(self.registeredOptions).forEach(function(o){
		console.log("  >>"+o);
		console.log("\t * "+ self.modules[self.registeredOptions[o]].conf().name);
	})
}

exports.init = function(args){
    return new Picasso(args);
}

picasso.paint = function(args){
     console.log("Picasso is painting");
}

picasso.fail = function(reason,args){
	throw new Error(">>"+reason);
}


