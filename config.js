const env = 'production'
require('dotenv').config()
const config = {
	production:{	
		APIKey : process.env.API_KEY,
		APISecret : process.env.API_SECRET
	}
};

module.exports = config[env]
