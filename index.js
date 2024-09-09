require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const URL = require('url').URL;

// Setup URL array
let ShortURLs = [];

// Basic Configuration
const port = process.env.PORT || 3000;

// POST request body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Helper to check if a URL is valid
const checkURL = (u) => {
	try {
		new URL(u);
		return true;
	} catch (e) {
		return false;
	}
};

// URL Shortener API endpoint
app.route('/api/shorturl').post(function(req, res) {
	if (checkURL(req.body.url)) {
		res.json({ original_url: req.body.url, short_url: ShortURLs.length });
		ShortURLs.push(req.body.url);
	} else {
		res.json({ error: "invalid url" });
	}
});

app.get('/api/shorturl/:index', function(req, res, next) {
	let index = req.params.index;
	if (index < 1) {
		res.json({ error: "Wrong format" });
	} else if (index > ShortURLs.length) {
		res.json({ error: "No short URL found for the given input" });
	} else {
		res.redirect(ShortURLs[index-1]);
	}
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
