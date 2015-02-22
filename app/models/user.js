//cargamos las cosas que necesitamos
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//aqui definimos el esquema de los usuarios
var userSchema = mongoose.Schema({

	local		: 	{
		email		: String,
		password	: String,
	},

	facebook	: 	{
		id			: String,
		token		: String,
		email		: String,
		name		: String,
	},

	twitter		: 	{
		id			: String,
		token		: String,
		displayName : String,
		username	: String,
	},

	google		: 	{
		id			: String,
		token		: String,
		email		: String,
		name 		: String,
	}
});

//metodos
//generamos una hash
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checkeamos que la pass sea correcta
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password); //this.local.password hace referencia al parametro password de local
};

//ahora creamos el modelo de usario y lo exportamos
module.exports = mongoose.model('User', userSchema);