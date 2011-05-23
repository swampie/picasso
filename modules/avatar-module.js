exports = module.exports = AvatarModule;

function AvatarModule(){}

exports.conf =function(){
    return new Object({
	name: 'AvatarModule', 
	registeredOption :"-a",
	description : "module to manage user avatars"
    });
}

exports.exec = function(){
    console.log("executing module" + this.conf().name);
}
