const express   =  require('express')
const request   = require('request')
const bodyParser  = require('body-parser');

const cheerio   = require('cheerio')
const fs        =require('fs')
const app = express()
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use("/public", express.static('public')); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

var title,release,rating

var json    ={title:"",release:"",rating:""}



app.get('/',(req,res)=>{
    //scraping code

    url = "https://www.imdb.com/title/tt0107290/?ref_=fn_al_tt_1"
    request(url, function(error,response,html){
        var $ = cheerio.load(html)
        $(".title_wrapper").filter(function (){
            var data = $(this)

            title = data.children().first().text()

            console.log(title)

            json.title = title.trim()
        })

        $("#titleYear").filter(function (){
            var data = $(this)

            release = data.children().first().text()

            console.log(release)

            json.release = release
        })
        $(".ratingValue strong").filter(function (){
            var data = $(this)

            rating = data.children().first().text()

            console.log(rating)

            json.rating = rating
        })
        //write json file

        fs.writeFile("output.json",JSON.stringify(json,null,4),function(err){
            console.log("File successfully created,check your directory")
        })
        res.send("Check your directory,file is created :)")
        
    })

})
app.get('/index', function (req, res) {
    res.render('index', { title:'Your movie', message1: title ,message2: release,message3:rating});
  }); 
app.listen(5000,function(){
    console.log("Server is running on port 5000")
})