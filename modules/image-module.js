exports = module.exports = AvatarModule;
var Step = require('step');
var composite = require('../lib/composite');
var _ = require('underscore');
var path = require('path');
var ImageMagick = require('../lib/commons-im');
function AvatarModule(){}

exports.conf =function(){
    return new Object({
        name: 'ImageModule',
        registeredOption :"-i",
	watermark: "/home/mfiandesio/nodejs/picasso/modules/watermark.png",
        description : "module to manage common image download",
        suffixes : [{suffix:'ps',width:66,height:66,geometry:'66x66>',actions:['crop']},
                    {suffix:'pm',width:92,height:92,geometry:'92x92>',actions:['crop']},
                    {suffix:'pl',width:320,height:320,geometry:'320x320>',actions:['watermark']},
                    {suffix:'pxl',width:640,height:'',geometry:'>640x',actions:['watermark','progressive']},
		    {suffix:'or',width:2130,height:2130,geometry:'2130x2130>'}
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
        		var im = new ImageMagick(args.input)
					.colorspace("RGB")
                                        .withType("TrueColor")
                                        .identify()
                                        .strip()

			if(it.actions && _.indexOf(it.actions,'crop')>-1){	             
	    			 	im.addResize(it.width/2+"x")
                                        .addResize(it.width/2+"x<")
                                        .addResize('50%')
                                        .withGravity('center')
                                        .crop(it.width+"x"+it.height+"+0+0")
					
			}else{
                                       	im.withGeometry(it.geometry)
			}
			im.toFile(destination+'/'+it.suffix+"-"+path.basename(args.input,path.extname(args.input))+'.png',	
				function(stdout,stderr,err){
                        		if(err){
                                		throw(err);
                                	}
					
					if(it.actions && _.indexOf(it.actions,'watermark')>-1) {                            
						console.log("Watermarking...");					
						composite
							.create()
							.gravity('center')
							.dissolve(50)
							.withWatermark(self.conf().watermark)
							.source(destination+'/'+it.suffix+"-"+path.basename(args.input,path.extname(args.input))+'.png')
							.write(destination+'/'+it.suffix+"-"+path.basename(args.input,path.extname(args.input))+'.png',
							function(){
								console.log('done');
								if(it.actions && _.indexOf(it.actions,'progressive')>-1) {                            
									console.log("Generating progressive jpeg...");					
									im = new ImageMagick(destination+'/'+it.suffix+"-"+path.basename(args.input,path.extname(args.input))+'.png')
										.strip()
                                        					.interlace('Place')
										.toFile(destination+'/'+it.suffix+"-"+path.basename(args.input,path.extname(args.input))+'.jpeg',
									function(){
										console.log('done');
									});
								};								
							});
					}

				});
		});
   });
}
