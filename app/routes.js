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
	//app.post('/login', cosas);

	app.get('/signup', function(req, res){

		//renderizamos la pagina de registro y pasamos un mensaje de flash si hay
		res.render('signup.ejs', { message : req.flash('signupMessage')});

	});

	//procesamos el formulario de registro
	app.post('/signup', passport.authenticate('local-signup', {
		succesRedirect : '/profile', //redireccionamos al perfil de usuario
		failureRedirect : '/signup', 
		failureFlash : true //asignamos mensajes flash al fallo de registro
	}));

	//PANEL DE USUARIO
	//queremos proteger esta pagina asi que nos aseguraremos de que este logueado
	//usaremos un middleware isLoggedIn

	app.get('/profile', isLoggedIn, function(req, res){

		res.render('profile.ejs', {
			user : req.user //cogemos el usuario y lo pasamos al template
		})
	});

	//LOGOUT

	app.get('/logout', function(req, res){
		res.logout();
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