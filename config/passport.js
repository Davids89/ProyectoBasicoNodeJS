//importamos lo que necesitamos

var localStrategy = require('passport-local').Strategy; //login local
var FacebookStrategy = require('passport-facebook').Strategy; //login por facebook
var TwitterStrategy = require('passport-twitter'); //login con twitter

//cargamos el modelo de usuario

var User = require('../app/models/user');

//cargamos la configuración de auth

var configAuth = require('./auth');

//vamos a crear un modulo passport

module.exports = function(passport){
	/*Configuracion de la sesion de Passport
	Esto es necesario para la persistencia de login de usuarios
	Passport necesita la habilidad de introducir y quitar usuarios de la sesion*/

	//este es para introducir en la sesión
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	//######LOCAL SIGNUP######

	passport.use('local-signup', new localStrategy({
		usernameField : 'email', //aqui cogemos los datos del formulario
		passwordField : 'password',
		passReqToCallback : true //nos va a permitir devolver la request entera a la callback
	},

		function(req, email, password, done){
			/*Al hacerlo de forma asíncrona, el User.findOne no se disparará hasta que los datos estén de vuelta*/
			/*Se ha hecho de forma asincrona, por tanto debemos devolver una callback, ya que si usamos un 
			argumento de vuelta no nos servira. Hay que confirmarle a passport que todo ha ido bien*/

			/*la función process.nextTick se basa en el event loop de Node. Es un ciclo de ejecución y las callback
			se ejecutan una tras otra. Lo que vamos a hacer, es retrasar la ejecución de esta parte de código
			al siguiente Tick del ciclo de Node, para que pueda seguir ejecutando otra funciones si son necesarias*/

			/*Esto tambien se puede hacer con setTimeout(function(),0). La función process.nextTick no es sólo un alias de
			setTimeout sino que también es mucho más eficiente

			https://gist.github.com/mmalecki/1257394		

			*/
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

	//######LOCAL LOGIN######

	passport.use('local-login', new localStrategy({
		//por defecto, como en el signup, se usa nombre de usuario y contraseña
		//nosotros vamos a usar email y contraseña
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true //nos va a permitir devolver la request entera a la callback
	},

		function(req, email, password, done){
			//esta es la callback que trae el email y la password del formulario
			//buscamos un usuario que tenga el mismo email
			//estamos comprobando si alguien que se quiere loguear esta registrado antes

			User.findOne({'local.email' : email}, function(err, user){
				if(err)
					return done(err);
				//si no encontramos un usuario registrado devolvemos un mensaje flash
				if(!user)
					return done(null, false, req.flash('loginMessage', 'Usuario no valido'));
				//si el usuario es valido pero no la contraseña
				if(!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'Ops! Contraseña no valida'));
				else
					done(null, user);
			});
		}

	));

	//######FACEBOOK LOGIN######

	passport.use(new FacebookStrategy({
		//debemos coger los datos almacenados en auth.js
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL
	},
		/*profile es el usuario como tal que es pasado a cada servicio (facebook, twitter o g+)
		Passport estandariza la información que viene a través de profile
		todo lo que viene con profile esta en este enlace

		http://passportjs.org/guide/profile/

		*/
		function(token, refreshToken, profile, done){
			//de nuevo lo vamos a hacer de forma asíncrona
			process.nextTick(function(){
				//buscamos el usuario en la base de datos basándonos en su facebook ID
				User.findOne({'facebook.id' : profile.id}, function(err, user){
					//si hay error lo paramos todos y volvemos
					if (err)
						return done(err);
					//si encontramos el usuario logueamos
					if (user)
						return done(null, user); //usuario encontrado y lo devolvemos
					else{
						//si no encontramos usuario con ese facebook id lo vamos a crear
						var newUser = new User();
						//le asignamos su información de Facebook
						newUser.facebook.id = profile.id;
						newUser.facebook.token = token;
						//mirando en la docu de passport vemos que el nombre se compone de dos
						//el nombre es givenName y los apellidos familyName
						newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value; //por lo visto facebook puede 
						//retornar varios email así que cogemos el primero que será el principal

						//ahora ya que tenemos todo asignado vamos a guardar el usuario
						newUser.save(function(err){
							if(err)
								throw err;
							else
								return done(null, newUser);
						});
					}
				});
			});
		}

	));

	//######TWITTER LOGIN######

	passport.use(new TwitterStrategy({
		consumerKey : configAuth.twitterAuth.consumerKey,
		consumerSecret : configAuth.twitterAuth.consumerSecret,
		callbackURL : configAuth.twitterAuth.callbackURL
	},

		function(token, tokenSecret, profile, done){
			//como siempre hacemos el codigo asíncrono
			process.nextTick(function(){
				User.findOne({'twitter.id' : profile.id}, function(err, user){
					//si hay error paramos y volvemos
					if (err)
						return done(err);
					//si encontramos el usuario logueamos
					if (user)
						return done(null, user); //usuario encontrado, lo retornamos
					else{
						//si no hay usuario lo creamos
						var newUser = new User();
						//asignamos los datos necesarios
						newUser.twitter.id = profile.id;
						newUser.twitter.token = token;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;

						//guardamos el usuario

						newUser.save(function(err){
							if (err)
								throw err;
							else
								return done(null, newUser);
						});
					}
				});
			});
		}

	));

};