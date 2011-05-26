var fs = require('fs'),
	path = require('path')

function ImageMagick(source){
	var srcfile;
	if(typeof source === 'object'){
		
	}else{
		srcfile = source;
	}
	
	this.options = {
		inputfile:srcfile,
		args:[],
		resizes:[]
	}
	
}

ImageMagick.prototype.colorspace = function(colorspace) {
	this.options.args.push({'-colorspace':colorspace});
	return this;
}

ImageMagick.prototype.withType = function(type) {
	this.options.args.push({'-type':type});
	return this;
}

ImageMagick.prototype.identify = function() {
	this.options.args.push('-identify');
	return this;
}

ImageMagick.prototype.strip = function() {
	this.options.args.push('-strip');
	return this;
}

ImageMagick.prototype.addResize = function(value){
		this.options.resizes.push(value);
		return this;
}

ImageMagick.prototype.withGravity = function(gravity){
		this.options.args.push({'-gravity':gravity});
		return this;
	}

ImageMagick.prototype.crop = function(crop){
		this.options.args.push({'-crop':crop});
		return this;
	}

ImageMagick.prototype._prepare = function(callback){
	var self = this;
	if(self.options.resizes.length==0){
		callback(new Error('no resizes specified'));
	}else{
		callback(undefined,true);
	}
	
}

ImageMagick.prototype._buildArgs = function(){
	var self = this;
	var args = [];
	try{
		var fstats = fs.statSync(this.options.inputfile);
		if(fstats.isFile()){
			args.push(this.options.inputfile.replace(' ', '\ '))
		}else{
			throw new Error('input file is not readable');
		}
	}catch(err){
		throw err;
	}
	this.options.args.forEach(function(el){
		if(typeof el === 'object'){
			for(i in el){
				args.push(i,el[i]);
			}
		}else{
			args.push(el);
		}
	});
	this.options.resizes.forEach(function(el){
		args.push("-resize",el);
	});
	return args;
	
}

ImageMagick.prototype.dumpCommand = function(){
	var self = this;
	this._prepare(function(err,isReady){
		if(err){
			console.log("[IM:ERROR>>]"+err);
		}else{
			var args = self._buildArgs(/*true*/);
			var cmd = '';
			cmd += 'convert';
			args.forEach(function(el){
				cmd+=' ' +el;
			});
			console.log(cmd);
		}
		
	});
	return this;
}
exports = module.exports = function(source) {
  return new ImageMagick(source);
}





	
	
	
	
	
	
