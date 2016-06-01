
/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , home = require('./routes/functionality')
    , path = require('path');

var app = express();

// all environments
//configure the sessions with our application
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'twitter clone', cookie: { maxAge: 600000 }}));app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//GET
//app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/',home.redirectToHomepage);
app.get('/signUp',home.signUp);

app.get('/homepage', function(req,res)
{
	ses = req.session;
	console.log("get homepage");
			
	if(ses.user)
	{
		home.fetchValues(req,res);	
	}
	else
	{
		console.log("logging out");
		res.redirect('/');			
	}
});

app.post('/checklogin',function(req,res)
{
	ses = req.session;
	console.log("check login");
	
	if(ses.user)
		{
			res.redirect('/homepage');
		}
	else
		{
			ses.user=req.param("username");
			home.checklogin(req,res);
		}
});

app.post('/newUser',function(req,res)
{
	console.log("Request received");
	home.addUser(req,res);
});

app.post('/calulateValues',function(req,res)
{
	ses = req.session;
	console.log("cal values");
	
	if(ses.user)
		{
			home.returnValues(req,res);	
		}
	else
		{
			console.log("logging out");
			res.redirect('/');		
		}
});

app.post('/addTweetToDB',function(req,res)
{
	ses = req.session;
	//console.log(ses);
	console.log("Add Tweet to DB");
	
	if(ses.user)
		{
			home.addTweet(req,res);	
		}
	else
		{
			console.log("logging out");
			res.redirect('/');		
		}
});

app.post('/renderTweets',function(req,res)
{
	ses = req.session;
	//console.log(ses);
	console.log("In render tweets function");
			
	if(ses.user)
	{
		home.renderTweet(req,res);	
	}
	else
	{
		console.log("logging out");
		res.redirect('/');		
	}
});

app.post('/renderUserTweets',function(req,res)
{
	ses = req.session;
	//console.log(ses);
	console.log("Render Only the User Tweets");
					
	if(ses.user)
	{
		home.renderUserTweet(req,res);	
	}
	else
	{
		console.log("logging out");
		res.redirect('/');		
	}
});

app.post('/renderUserFollowing',function(req,res)
{
	ses = req.session;
	//console.log(ses);
	console.log("Render the people the user is following");
							
	if(ses.user)
	{
		home.renderUserFollowing(req,res);	
	}
	else
	{
		console.log("logging out");
		res.redirect('/');		
	}
});

app.post('/renderUserFollowers',function(req,res)
{
	ses = req.session;
	//console.log(ses);
	console.log("Render the people who are followers of the user");
							
	if(ses.user)
	{
		home.renderUserFollower(req,res);	
	}
	else
	{
		console.log("logging out");
		res.redirect('/');		
	}
});

app.post('/suggestFollowers',function(req,res)
{
	ses = req.session;
	//console.log(ses);
	console.log("Suggest Followers to User");
					
	if(ses.user)
	{
		home.suggestFollowers(req,res);	
	}
	else
	{
		console.log("Session Expired. Log In Again");
		res.redirect('/');		
	}
});

app.post('/updateFollowers', function(req,res)
{	
	ses= req.session;
	console.log("Updating Followers Table")
	if(ses.user)
	{
		home.updateFollowers(req,res);
	}
	else
	{
		console.log("Session Expired. Log In Again");
		res.redirect("/");
	}
});

app.get('/userProfile', function(req,res)
{
	ses= req.session;
	console.log("User Profile Info Page");
	if(ses.user)
	{
		home.userProfile(req,res);
	}
	else
	{
		console.log("Session Expired. Log In Again");
		res.redirect("/");
	}
});


app.post('/profileInfo', function(req,res)
{
	ses= req.session;
	console.log("User Profile Info Page");
	if(ses.user)
	{
		home.getUserProfile(req,res);
	}
	else
	{
		console.log("Session Expired. Log In Again");
		res.redirect("/");
	}
});

app.post('/searchTweets',function(req,res)
{
	ses = req.session;
	if(ses.user)
	{
		console.log("Going to the functionality.js page to set the global variable 'searchTweet'")
		home.searchTweets(req,res);
	}
	else
	{
		console.log("Session Expired. Log in Again");
		res.redirect("/");
	}
});


app.get('/searchResults',function(req,res)
{
	ses = req.session;
	if(ses.user)
	{
		console.log("In the searchResults function");
		home.searchResults(req,res);
	}
	else
	{
		console.log("Session expired. Log in Again");
		res.redirect("/");
	}
});

app.get('/loadSearchResults',function(req,res)
{
	ses = req.session;
	if(ses.user)
	{
		console.log("Loading the search results");
		home.loadSearchResults(req,res);
	}
	else
	{
		console.log("Session expired. Log in Again");
		res.redirect("/");
	}
});

app.get('/logout',home.logout);


http.createServer(app).listen(app.get('port'), function()
{
  console.log('Express server listening on port ' + app.get('port'));
});
