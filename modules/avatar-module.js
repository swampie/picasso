exports = module.exports = AvatarModule;
var Step = require('step');
var path = require('path');
var im = require('imagemagick');
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
			im.convert([args.input,
				   "-colorspace",
				   "RGB",
				   "-type",
				   "TrueColor",
				   "-identify",
				   "-strip",
                                   "-resize",
                                   it.width/2,
				   "-resize",
				   it.width/2+"x<",
				   "-resize",
				   "50%",
                                   "-gravity",
                                   "center",
                                   "-crop",it.width+"x"+it.height+"+0+0",
                                   destination+"/"+it.suffix+"_"+path.basename(args.input,path.extname(args.input)+".png")],function(err,stdout,stderr){
				if(err){
					console.log(err);	
				}else{
					console.log(stdout);
				}
			})
		});
	}
	
    );
}
