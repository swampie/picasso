exports = module.exports = AvatarModule;
var Step = require('step');
var path = require('path');
var ImageMagick = require('../lib/commons-im');
function AvatarModule(){}

exports.conf =function(){
    return new Object({
	name: 'AvatarModule', 
	registeredOption :"-a",
	description : "module to manage user avatars",
	suffixes : [{suffix:'pq',width:19,height:19},
                    {suffix:'md',width:30,height:30},
		    {suffix:'gd',width:48,height:48},
                    {suffix:'xg',width:70,height:70}
                    ]
    });
}

exports.exec = function(args){
    var self = this;
    var destination = path.dirname(args.input);
    console.log(args.input);
    Step(
	function startLog(){
	    console.log("executing module" + self.conf().name+" for "+args.input);
	    return this;
        },
	function converting(){
	    self.conf().suffixes.forEach(
			function(it){
				console.log("converting to "+it.suffix);
				console.log(ImageMagick);
				var im = new ImageMagick(args.input)
					.colorspace("RGB")
					.withType("TrueColor")
					.identify()
					.strip()
					.addResize(it.width/2)
					.addResize(it.width/2+"x<")
					.addResize('50%')
					.withGravity('center')
					.crop(it.width+"x"+it.height+"+0+0")
					.dumpCommand();
		});
	}
	
    );
}
