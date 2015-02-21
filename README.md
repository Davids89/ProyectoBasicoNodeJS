Proyecto básico de NodeJS para hacer login tanto local, como en redes sociales (Facebook, Twitter y G+)

####Estructura básica####

- app
	- models
		-user.js //modelo de nuestros usuarios
	routes.js // todas las rutas de la app
- config
	- auth.js // alojará todas las keys de los usuarios (Facebook, Twitter y G+)
	- database.js // Aqui irán las configuraciones con la base de datos
	- passport.js // configuración de passport
- views
	- index.jade // nuestra home page con los login links
	- login.jade // mostrará el formulario de login
	- signup.jade // mostrará el formulario de registro
	- profile.jade // después de que el usuario hace log, podrá ver su panel
- package.json // para manejar los paquetes npm
- server.js // nuestro archivo de app