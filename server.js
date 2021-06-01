const { response } = require("express");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))

app.get('/', async (request, responce) => {
    const shortUrls = await ShortUrl.find()
    responce.render('index', {shortUrls : shortUrls})
})

app.post('/shortUrls', async (request, response) => {
    await ShortUrl.create({ full: request.body.fullURL })
    response.redirect('/');
});

app.get('/:shortUrl', async (request, response)=>{
    const shortUrl = await ShortUrl.findOne({short: request.params.shortUrl});
    if(shortUrl == null){
        return response.sendStatus(404);
    }
    shortUrl.clicks++;
    shortUrl.save();

    response.redirect(shortUrl.full);
})

app.listen(5000);