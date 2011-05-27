exports = module.exports = PromoVideoModule;
var Step = require('step');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
function PromoVideoModule(){}

exports.conf =function(){
    return new Object({
	name: 'PromoVideoModule', 
	registeredOption :"-b",
	actions:'-f',
	description : "module to manage promo video",
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
    Step(
	function startLog(){
	    console.log("executing module" + self.conf().name+" for "+args.input);
	    return this;
        },
	function convertMp4(){
		
		ffmpeg = new ffmpeg(args.input)
			 	     .withAudioCodec('libfaac')
				     .withAudioFrequency(44100)
				     .withAudioBitrate('128k')	
				     .withAudioChannels(2)
				     .withVideoCodec('libx264')
				     .withVideoBitrate('500k')
				     .addOption('-flags','+loop+mv4')
				     .addOption('-partitions','+parti4x4+partp8x8+partb8x8')
				     .addOption('-cmp',256)
				     .addOption('-subq', 6)
				     .addOption('-trellis',1)
				     .addOption('-refs',5)
				     .addOption('-coder',0)
                                     .addOption('-me_range',16)
				     .addOption('-keyint_min',25)
                                     .addOption('-sc_threshold',40)
                                     .addOption('-i_qfactor',0.71)
				     .addOption('-rc_eq', '\'blurCplx(1-qComp)\'')
			             .addOption('-qcomp',0.6)
				     .addOption('-qmin',10)
				     .addOption('-qmax',51)
				     .addOption('-qdiff',4)
				     .addOption('-level',30)
				     .withAspect('16:9')
				     .addOption('-r',30)
				     .addOption('-g',90)
				     .addOption('-async',2)
				     .addOption('-threads',2)
				     .dumpCommand()
				     .saveToFile(destination+'/'+path.basename(args.input,path.extname(args.input))+'.mp4',function(stdout,stderr,err){
					if(err){
						throw new err;
					}else{
						console.log(stderr);
						console.log('done');
					}
				    });	
	}
    );
}	
