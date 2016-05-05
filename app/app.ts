import application = require("application");

// utility functions
require("./shared/lib/utility.js");

// init code
var mainModuleSrc = "views/start/start";
application.mainModule = mainModuleSrc;
application.cssFile = "./app.css";

application.start();