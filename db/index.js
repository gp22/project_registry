/* jshint esversion:6, node: true */

const dotenv = require('dotenv').config(),
      dbuser = process.env.DB_UNAME,
      dbpwd  = process.env.DB_PWD;

module.exports = {
    
    getDbConnectionString: function () {
        return `mongodb://${dbuser}:${dbpwd}@ds123361.mlab.com:23361/ngchingu-registry`
    }
    
};
