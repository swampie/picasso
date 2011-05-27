exports = module.exports = AvatarModule;
var Step = require('step');
var path = require('path');
var ImageMagick = require('../lib/commons-im');
function AvatarModule(){}

exports.conf =function(){
    return new Object({
        name: 'ImageModule',
        registeredOption :"-i",
        description : "module to manage common image download",
        suffixes : [{suffix:'ps',width:66,height:66},
                    {suffix:'pm',width:92,height:92},
                    {suffix:'pl',width:320,height:320},
                    {suffix:'pxl',width:640,height:''},
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
                                        .addResize(it.width/2+"x")
                                        .addResize(it.width/2+"x<")
                                        .addResize('50%')
                                        .withGravity('center')
                                        .crop(it.width+"x"+it.height+"+0+0")
                                        .dumpCommand()
                                        .toFile(destination+'/'+it.suffix+"-"+path.basename(args.input,path.extname(args.input))+'.png',
                                        function(stdout,stderr,err){
                                                if(err){
                                                        throw(err);
                                                }
                                                if(stderr && stderr.length > 0){
                                                        console.log(stderr);
                                                        throw new Error('error en la conversion');
                                                }
                                                console.log('done');
                                        });
			});
		});
}
