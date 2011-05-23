exports = module.exports = AvatarModule;
var im = require('imagemagick');
function AvatarModule(){}

exports.conf =function(){
    return new Object({
	name: 'AvatarModule', 
	registeredOption :"-a",
	description : "module to manage user avatars",
	suffixes = {'pq':{width:19,height:19},
                    'md':{width:30,height:30},
		    'gd':{width:48,height:48},
                    'xg':{width:70,height:70}
                    }
    });
}

exports.exec = function(args){
    console.log("executing module" + this.conf().name);
    im.composite();
}
