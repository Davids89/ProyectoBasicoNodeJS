//importamos lo que necesitamos

var localStrategy = require('passport-local').Strategy;

//cargamos el modelo de usuario

var User = require('../app/models/user.js');

//vamos a crear un modulo passport

module.exports = function(passport){
	/*Configuracion de la sesion de Passport
	Esto es necesario para la persistencia de login de usuarios
	Passport necesita la habilidad de introducir y quitar usuarios de la sesion*/

	//este es para introducir en la sesión
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	//######LOCAL SIGNUP######

	passport.use('local-signup', new localStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true //nos va a permitir devolver la request entera a la callback
	},

		function(req, email, password, done){
			/*Al hacerlo de forma asíncrona, el User.findOne no se disparará hasta que los datos estén de vuelta*/
			/*Se ha hecho de forma asincrona, por tanto debemos devolver una callback, ya que si usamos un 
			argumento de vuelta no nos servira. Hay que confirmarle a passport que todo ha ido bien*/
			process.nextTick(function(){
				//tengo que encontrar un usuario al que le coincida el email
				//debemos saber si el usuario que intenta hacer loggin esta ya registrado

				User.findOne({'local.email'	: 	email}, function(err, user){
					if(err) //si hay error lo retorno
						return done(err);
					//checkeamos si hay usuario con ese email
					if (user){
						return done(null, false, req.flash('signupMessage', 'Ese email esta ya en uso'));
					}
					else{
						//si no hay usuario con ese email lo creamos
						var newUser = new User();
						//configuramos las credenciales del usuario
						newUser.local.email = email;
						newUser.local.password = newUser.generateHash(password);
						//guardamos el usuario
						newUser.save(function(err){
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			});
		 }

	));
};