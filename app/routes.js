//app/routes.js

module.exports = function(app, passport){
	//HOME PAGE

	app.get('/', function(req, res){
		res.render('index.ejs');
	});

	//LOGIN

	app.get('/login', function(req, res){

		//cargamos la pagina inicial y pasamos un mensaje flash si lo hay
		res.render('login.ejs', { message : req.flash('loginMessage')});
	});

	//procesamos el formulario de login
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function(req, res){

		//renderizamos la pagina de registro y pasamos un mensaje de flash si hay
		res.render('signup.ejs', { message : req.flash('signupMessage')});

	});

	//procesamos el formulario de registro
	app.post('/signup', passport.authenticate('local-signup',{
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	//PANEL DE USUARIO
	//queremos proteger esta pagina asi que nos aseguraremos de que este logueado
	//usaremos un middleware isLoggedIn

	app.get('/profile', isLoggedIn, function(req, res){

		res.render('profile.ejs', {
			user : req.user //cogemos el usuario y lo pasamos al template
		});
	});

	//AUTH DE FACEBOOK
	//ruta para la autentificación de facebook y login

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' })); //el scope es información que por defecto facebook no nos da

	//manejamos la callback una vez que facebook lo ha autenticado

	app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

	//hay que tener cuidado porque al configurar la app en facebook hay que poner como URL: http://localhost:8080/


	//AUTH DE TWITTER
	//ruta para la autenticación de twitter y login

	app.get('/auth/twitter', passport.authenticate('twitter'));

	//manejamos la callback una vez que twitter lo ha autenticado
	app.get('/auth/twitter/callback', 
		passport.authenticate('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	//LOGOUT

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

};

//la funcion middleware que usaremos para ver que el usuario esta conectado

function isLoggedIn(req, res, next){

	// si el usuario esta autenticado, seguimos
	if(req.isAuthenticated())
		return next();
	else
		res.redirect('/'); //sino lo mandamos al inicio
}