//config/auth.js

//vamos a mostrar nuestra configuración directamente a nuestra app exportando el modulo

module.exports = {
	'facebookAuth' : {
		'clientID' : '', //esta es la APP ID
		'clientSecret' : '', //La clave secreta que genera Facebook
		'callbackURL' : 'http://localhost:8080/auth/facebook/callback'
		/*la callback es necesaria para asegurarnos de que identificamos con FB y hacemos un redireccionamiento
		a los usuarios de vuelta a nuestra app después de haber aprobado su acceso a la misma*/
	},

	'twitterAuth' : {
		'consumerKey' : '',
		'consumerSecret' : '',
		'callbackURL' : 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' : '',
		'clientSecret' : '',
		'callbackURL' : 'http://localhost:8080/auth/google/callback'
	}
};