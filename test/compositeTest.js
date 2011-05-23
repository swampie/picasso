var c = require('../lib/composite');
c.create().gravity('center').dissolve(50).withWatermark('/media/comun/imagenes/fotos/11870.png').source('/media/comun/imagenes/fotos/01.jpg').write('/media/comun/imagenes/fotos/output.jpeg',function(){console.log('done');})
