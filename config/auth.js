//config/auth.js

//vamos a mostrar nuestra configuración directamente a nuestra app exportando el modulo

module.exports = {
	'facebookAuth' : {
		'clientID' : '1553433908246425', //esta es la APP ID
		'clientSecret' : 'aa7f77bb950723d5e56627e06715b526', //La clave secreta que genera Facebook
		'callbackURL' : 'http://localhost:8080/auth/facebook/callback'
		/*la callback es necesaria para asegurarnos de que identificamos con FB y hacemos un redireccionamiento
		a los usuarios de vuelta a nuestra app después de haber aprobado su acceso a la misma*/
	},

	'twitterAuth' : {
		'consumerKey' : 'hbkwinTR5EpC1KKSujUqf1CCv',
		'consumerSecret' : 'Akln7OKjsTVq1dyUSsJ0Y3dxanVPg5BPQI75QTxp0QQoFBAn3E',
		'callbackURL' : 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' : 'a',
		'clientSecret' : 'a',
		'callbackURL' : 'http://localhost:8080/auth/google/callback'
	}
};