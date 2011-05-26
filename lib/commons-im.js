var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    im = require('imagemagick');
    

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
	var crop = {};
	this.options.args.forEach(function(el){
		if(typeof el === 'object'){
			for(i in el){
				if(i=='-crop'){
					crop = el;
				}else{
					args.push(i,el[i]);
				}
			}
		}else{
			args.push(el);
		}
	});
	this.options.resizes.forEach(function(el){
		args.push("-resize",el);
	});
	args.push('-crop',crop['-crop']);
	return args;
	
}

ImageMagick.prototype.toFile = function(targetfile,callback){
	this.options.outputfile = targetfile;
	try{
		var self = this;
		this._prepare(function(err,isReady){
			if(err){
				callback(null,null,err);
			}else{
				var args = self._buildArgs();
				args.push(targetfile);
				im.convert(args,function(err,stdout,stderr){
				if(err){
					console.log(err);	
				}else{
					console.log(stdout);
				}
				});		
			
			}
		});	
	}catch(err){
		callback(null,null,err);
	}

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





	
	
	
	
	
	
