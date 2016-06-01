var ejs=require("ejs");
var mysql = require("./mysql");
var findHashtags=require('find-hashtags');
var path=require("path");
var searchForTweet="NULL";
//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	//Checks before redirecting whether the session is valid
	ejs.renderFile('./views/login.ejs', function(err, result)
	{

		if(!err)
		{
			res.end(result);
		}
		else{
			res.end('An error Occureed while fetching values');
			console.log(err);
		}
	});
};

exports.homepage = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	//Checks before redirecting whether the session is valid
	ejs.renderFile('./views/homepage.ejs', function(err, result)
	{
		if(!err)
		{
			res.end(result);
		}
		else
		{
			res.end('An error Occured');
			console.log(err);
		}
	});
};

exports.signUp=function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	ejs.renderFile('./views/signup.ejs',function(err,result){
		if(!err)
		{
			console.log("Redirected to SignUp page");
			res.end(result);
		}
		else
		{
			res.end("Error Occurred while redirecting to the signup page");
			console.log(err);
		}
	});
};   

//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.checklogin = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	var username, password;
	username = req.param("username");
	console.log(username);
	password = req.param("password");
	console.log(password);

	var getUser="select * from users where username='" + req.param("username")+"' and password='" + 'SHA1("+req.param("password")+")' +"'";
	console.log("Query is:"+getUser);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			if(results.length > 0)
			{
				console.log("valid Login");
				ejs.renderFile('./views/homepage.ejs',
						{
							data: results
						}, function(err, result){
							// render on success
							if (!err)
							{
								res.end(result);
							}
							// render or error
							else
							{
								res.end('An error occurred');
								console.log(err);
							}
						});
			}
			else
			{
				console.log("Invalid Login");
				ejs.renderFile('./views/failLogin.ejs',function(err, result)
						{
					// render on success
					if (!err)
					{
						res.end(result);
					}
					// render or error
					else
					{
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
		}
	},getUser);
};

//Add New User into the Database
exports.addUser = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	
	var firstname,lastname,username, password,thandle;
	firstname=req.param("firstname");
	console.log(firstname);
	lastname=req.param("lastname");
	console.log(lastname);
	username=req.param("username");
	console.log(username);
	password=req.param("password");
	console.log(password);
	thandle=req.param("thandle");
	console.log(thandle);
	
	var getUser="INSERT INTO `twitter`.`users` (`username`, `password`, `fname`, `lname`, `twitterhandle`) VALUES ('"+req.param("username")+"', 'SHA1("+req.param("password")+")', '"+req.param("firstname")+"', '"+req.param("lastname")+"', '"+req.param("thandle")+"')";
	console.log("Query is:"+getUser);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			if(results.length > 0)
			{
				console.log("New User Created");
				ejs.redirect('./views/login.ejs');
				res.send({"data":results});
			}
			else
			{
				console.log("User Exists");
				res.send({"login":"Fail"});
			}
		}
	},getUser);
};

exports.fetchValues=function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	ejs.renderFile('./views/homepage.ejs',function(err,result){
		if(!err)
		{
			console.log("In FetchValues function");
			res.end(result);
		}
		else
		{
			res.end("Error Occurred");
			console.log(err);
		}
	});
};    

exports.returnValues=function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	var getInfo="SELECT concat(fname,' ',lname) usrname,usr.twitterhandle, F.FOLLOWERS, T.FOLLOWING, TW.TWEETS" +
	"	FROM " +
	"	(SELECT count(*) FOLLOWERS 	from followers	where follows='"+ses.user+"')F," +
	"	(SELECT count(*) FOLLOWING 	from followers	where uname='"+ses.user+"')T," +
	"	(SELECT count(*) TWEETS	from tweets	where username='"+ses.user+"')TW," +
	"	users usr	where username='"+ses.user+"'";
	
	console.log("My Query is:"+getInfo);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			res.send(results);
		}
	},getInfo);
};

exports.addTweet=function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	console.log(ses.user);
	var hashtags = [];
	hashtags=findHashtags('req.param("tweetval")');
	var getInfo;
	console.log(hashtags);
	if(hashtags.length>0)
	{
		for(var item=0; item<hashtags.length;item++)
		{
			getInfo="INSERT INTO `twitter`.`tweets` (`username`, `tweet`, `hashtag`) VALUES ('"+ses.user+"', '"+req.param("tweetval")+"', '"+hashtags[item]+"')";
			console.log("My Query is:"+getInfo);
			mysql.fetchData(function(err,results)
			{
				console.log(results);
				if(err)
				{
					throw err;
				}
				else
				{
					console.log("fetched the results of the user");
					console.log(results);
					res.send(results);
				}
			},getInfo);
		}
	}
	else
	{
		getInfo="INSERT INTO `twitter`.`tweets` (`username`, `tweet`) VALUES ('"+ses.user+"', '"+req.param("tweetval")+"')";
		console.log("My Query is:"+getInfo);
		mysql.fetchData(function(err,results)
		{
			console.log(results);
			if(err)
			{
				throw err;
			}
			else
			{
				console.log("fetched the results of the user");
				console.log(results);
				res.send(results);
			}
		},getInfo);
	}
	
};

exports.renderTweet = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	//console.log(ses.user);
	var allTweets="select distinct t.tweet, concat(u.fname,' ',u.lname)usrname, twitterhandle" +
			"	from tweets t" +
			"	inner join followers f" +
			"	on t.username='"+ses.user+"' " +
			"   or(t.username=f.follows and f.uname='"+ses.user+"' )" +
			"	inner join users u" +
			"	on u.username=t.username" +
			"	order by t.tweetTime desc";
	
	console.log("My Query is:"+allTweets);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			console.log(results);
			var arrayWithHashes=[];
			for(var i=0;i<results.length;i++)
			{
				arrayWithHashes = findHashtags(results[i].tweet);
				for(var j=0; j <arrayWithHashes.length;j++)
				{
					var newTweet=(results[i].tweet).replace('#'+arrayWithHashes[j], '<a href=\"#\">'+'#'+arrayWithHashes[j]+'</a>');
					console.log(newTweet);
					results[i].tweet=newTweet;
				}
			}
			res.send(results);
		}
	},allTweets);
};

exports.renderUserTweet = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	//console.log(ses.user);
	var userTweets="SELECT concat(fname,' ',lname) usrname, usr.twitterhandle, TW.TWEET " +
					"FROM" +
					"(SELECT tweet TWEET from tweets where username='"+ses.user+"')TW," +
					" users usr where username='"+ses.user+"' " +
					" order by TW.TWEET desc;";
	
	console.log("My Query is:"+userTweets);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			console.log(results);
			var arrayWithHashes=[];
			for(var i=0;i<results.length;i++)
			{
				arrayWithHashes = findHashtags(results[i].tweet);
				for(var j=0; j <arrayWithHashes.length;j++)
				{
					var newTweet=(results[i].tweet).replace('#'+arrayWithHashes[j], '<a href=\"#\">'+'#'+arrayWithHashes[j]+'</a>');
					console.log(newTweet);
					results[i].tweet=newTweet;
				}
			}
			res.send(results);
		}
	},userTweets);
};

exports.renderUserFollowing = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	//console.log(ses.user);
	//BALAJI is following SWAROOP (Balaji=uname && Swaroop=follows)
	var userFollowing = "SELECT concat(fname,' ',lname) usrname, usr.twitterhandle,FW.FOLLOW" +
			"	FROM " +
			"   (SELECT follows FOLLOW  from followers where uname='"+ses.user+"')FW," +
			"    users usr where username=FW.FOLLOW;";
	
	console.log("My Query is:"+userFollowing);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			console.log(results);
			res.send(results);
		}
	},userFollowing);
};

exports.renderUserFollower = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	//console.log(ses.user);
	//BALAJI is followed by SWAROOP
	var userFollowedBy = "SELECT concat(fname,' ',lname) usrname, usr.twitterhandle,FB.FOLLOWEDBY " +
			"	FROM " +
			"  (SELECT uname FOLLOWEDBY  from followers where follows='"+ses.user+"')FB, " +
			"   users usr where username=FB.FOLLOWEDBY; ";
	
	console.log("My Query is:"+userFollowedBy);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			console.log(results);
			res.send(results);
		}
	},userFollowedBy);
};

//Suggest Followers to the User
exports.suggestFollowers = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	//console.log(ses.user);
	var getInfo= "select concat(u.fname,' ',u.lname)usrname, twitterhandle " +
			" from users u " +
			" where not exists " +
				" (select * " +
				" from followers " +
				" where uname='"+ses.user+"' and follows=u.username) and username!='"+ses.user+"'";
	
	console.log("My Query is:"+getInfo);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			console.log(results);
			res.send(results);
		}
	},getInfo);
};

exports.updateFollowers=function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	console.log(req.param('thandler'));
	var getInfo= "INSERT INTO `twitter`.`followers` (`uname`, `follows`) SELECT '"+ses.user+"', username FROM users u where twitterhandle='"+req.param("thandler")+"';";
	
	console.log("Insert Query is:"+getInfo);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			console.log(results);
			res.send(results);
		}
	},getInfo);
};

//Edit User Profile
exports.userProfile = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	console.log("In the userProfile function");
	var viewpath=path.join(__dirname,'../views', 'userprofile.ejs');
	console.log(viewpath);
	ejs.renderFile(viewpath,function(err,result){
		if(!err)
		{
			console.log("In editProfile function");
			res.end(result);
		}
		else
		{
			res.end("Error Occurred");
			console.log(err);
		}
	});
};


exports.getUserProfile = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	console.log("In the userProfile function");
	var getInfo="SELECT concat(fname,' ',lname) usrname,usr.twitterhandle,usr.phone,usr.dob,usr.location, F.FOLLOWERS, T.FOLLOWING, TW.TWEETS" +
	"	FROM " +
	"	(SELECT count(*) FOLLOWERS 	from followers	where follows='"+ses.user+"')F," +
	"	(SELECT count(*) FOLLOWING 	from followers	where uname='"+ses.user+"')T," +
	"	(SELECT count(*) TWEETS	from tweets	where username='"+ses.user+"')TW," +
	"	users usr where username='"+ses.user+"'";
	
	console.log("My Query is:"+getInfo);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			var str = results[0].dob;
			var bday = str.toString();
			//console.log(bday);
			
			bday= bday.substring(4,14);
			results[0].dob=bday;
			//console.log(results[0].dob);
			res.send(results);
		}
	},getInfo);
};

exports.searchTweets = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	console.log("In the searchTweets function called to search for tweets");
	searchForTweet = req.param('searchText');
	console.log(searchForTweet);
	res.send("Success");
};

exports.searchResults = function(req,res)
{
	console.log("In the searchResults function");
	var viewpath=path.join(__dirname,'../views', 'searchResults.ejs');
	ejs.renderFile(viewpath,function(err,result)
	{
		if(!err)
		{
			console.log("Now the results are loaded in the page 'searchResults.ejs'");
			res.end(result);
		}
		else
		{
			res.end("Error Occurred");
			console.log(err);
		}
	});
};

exports.loadSearchResults = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	console.log("In the loadSearchResults function of the functionality.js file");
	var getInfo= "SELECT concat(fname,' ',lname) usrname, usr.twitterhandle, t.tweet " +
			" from tweets t, users usr " +
			" where t.username=usr.username and t.tweet like '%"+searchForTweet+"%';";
	
	console.log("My Query is:"+getInfo);
	mysql.fetchData(function(err,results)
	{
		console.log(results);
		if(err)
		{
			throw err;
		}
		else
		{
			console.log("fetched the results of the user");
			res.send(results);
		}
	},getInfo);
};

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	req.session.destroy();
	res.redirect('/');
};