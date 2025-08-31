const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");

const port =8080;



// This will allow the ejs file to directely access the file inside public folder..
app.use(express.static("public"));

const { v4: uuidv4 } = require('uuid'); // This will generate the unique id.

app.set("view engine", "ejs"); // This allow the server to render ejs file from views folder
// This required package will help to create connection b/w database and server.....

app.use(express.urlencoded({ extended: true})); // This will help to parse the data of request body in post request which is understandable by express.
app.use(express.json());

const mysql = require("mysql2");

require('dotenv').config(); // This will help to access the environment variables from .env file

const connection = mysql.createConnection({
  
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT

   
});



// This line will show all the my recipess it only for understanding not for users...
app.get("/recipedata", (req,res)=>{
    let Q = "SELECT * FROM recipeIndiannnn";
    try{
        connection.query(Q, (err,result)=>{

            if(err) throw err;
            console.log(result);
            res.render("data.ejs",{data:result});
        });
    }
    catch(err){
        console.log(err);
        res.send("Some error in database");
    }
});


// Defining the route for home page

app.get("/",(req,res)=>{
    let queries = {
        // Query for popular recipes..
        popular: `SELECT * FROM recipeIndiannnn WHERE total_time <=30 LIMIT 15`,

        // Query for breakfast recipes..
        breakfast: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Breakfast%" OR
        recipe_name LIKE "%Idli%" OR recipe_name LIKE "%Dosa%" OR recipe_name LIKE "%Upma%" OR recipe_name LIKE "%Poha%" OR recipe_name LIKE "%Paratha%" OR recipe_name LIKE "%Chilla%" OR
        recipe_name LIKE "%Poori%" OR recipe_name LIKE "%Omelet%" OR recipe_name LIKE "%Bathura%" OR recipe_name LIKE "%Bread%" OR recipe_name LIKE "%Milk%" OR
        recipe_name LIKE "%Oats%" OR  recipe_name LIKE "%Dalia%"  LIMIT 25`,

        // Query for lunch..
        lunch:`SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Lunch%" OR
        recipe_name LIKE "%Thali%" OR recipe_name LIKE "%Biryani%" OR recipe_name LIKE "%Pulao%" OR recipe_name LIKE "%Curry%" OR recipe_name LIKE "%Roti%" OR recipe_name LIKE "%Sabzi%" OR
        recipe_name LIKE "%Salad%" OR recipe_name LIKE "%Raita%" OR recipe_name LIKE "%Pickle%" OR recipe_name LIKE "%Vegetables%" OR recipe_name LIKE "%Rice%" OR recipe_name LIKE "%chole%"  LIMIT 25`,

        //Query for dinner recipes..
        dinner: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Dinner%" OR
        recipe_name LIKE "%Thali%" OR recipe_name LIKE "%Biryani%" OR recipe_name LIKE "%Pulao%" OR recipe_name LIKE "%Curry%" OR recipe_name LIKE "%Roti%" OR recipe_name LIKE "%Sabzi%" OR
        recipe_name LIKE "%Dal%" OR recipe_name LIKE "%Rice%" OR recipe_name LIKE "%Paneer%" OR recipe_name LIKE "%Chicken%" OR recipe_name LIKE "%Fish%" OR recipe_name LIKE "%Egg%" OR
        recipe_name LIKE "%Salad%" OR recipe_name LIKE "%Raita%" OR recipe_name LIKE "%Pickle%" OR recipe_name LIKE "%Vegetables%" OR recipe_name LIKE "%Rice%" OR recipe_name LIKE "%Sweets%" OR recipe_name LIKE "%Icecream%"  LIMIT 25`,

        // Query for snacks recipes..
        snacks: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Snacks%" OR
        recipe_name LIKE "%Chips%" OR recipe_name LIKE "%Samosa%" OR recipe_name LIKE "%Pakora%" OR recipe_name LIKE "%Nuts%" OR recipe_name LIKE "%Chivda%" OR recipe_name LIKE "%Murukku%" OR
        recipe_name LIKE "%Mathri%" OR recipe_name LIKE "%Dhokla%" OR recipe_name LIKE "%Khandvi%" OR recipe_name LIKE "%Patties%" OR recipe_name LIKE "%Spring Rolls%" OR recipe_name LIKE "%Sandwich%" OR
        recipe_name LIKE "%Pav Bhaji%" OR recipe_name LIKE "%Bhel Puri%" OR recipe_name LIKE "%Sev Puri%" OR recipe_name LIKE "%Dahi Puri%" OR recipe_name LIKE "%Pani Puri%" OR recipe_name LIKE "%Chaat%" OR  recipe_name LIKE "%Chaumin%" OR recipe_name LIKE "%Chowmein%" OR recipe_name LIKE "%Roll%" OR recipe_name LIKE "%Pasta%" OR recipe_name LIKE "%Momos%" OR recipe_name LIKE "%Noodles%" OR recipe_name LIKE "%Burger%"  LIMIT 25`,

        // Query for non-veg recipes..
        nonveg: `SELECT * FROM recipeIndiannnn WHERE  ingredients LIKE "%Chicken%" OR ingredients LIKE "%Mutton%" OR ingredients LIKE "%Fish%" OR ingredients LIKE "%Egg%"  LIMIT 25`,

        // Query for vegetarian recipes..
        vegetarian: `SELECT * FROM recipeIndiannnn WHERE  ingredients NOT LIKE "%Chicken%" AND ingredients NOT LIKE "%Mutton%" AND ingredients NOT LIKE "%Fish%" AND ingredients NOT LIKE "%Egg%"  LIMIT 25`,
        // Query for sweets..
        sweets: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Sweets%" OR recipe_name LIKE "%Icecream%" LIMIT 25`,

        // Query for pizza recipes..
        pizza: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Pizza%" LIMIT 25`,

        // Query for burger recipes..
        burger: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Burger%" LIMIT 25`,

        // Query for Noodles recipes..
        noodles: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Noodles%" LIMIT 25`,
        // Query for Pasta recipes..
        pasta: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Pasta%" LIMIT 25`,
        // Query for Biryani recipes..
        biryani: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Biryani%" LIMIT 25`

        // Add many according to needs....


    };

    let data = {}; // This will store all the data fetched from database according to different queries..
    let completed = 0; // This will keep track of how many queries have been completed.

    // Object.keys gives an array of the keys in the object
    Object.keys(queries).forEach((category)=>{
        try{
            connection.query(queries[category],(err,result)=>{
                if(err) throw err;
                data[category] =result; // Store the result in the data object
                completed++;
                if(completed === Object.keys(queries).length){ // Check if all queries are completed
                    console.log(data);
                    res.render("home.ejs",{data:data});
                }

            });
        }
        catch(err){
            console.log(err);
            res.send("Some error in database");
        }
    });
});


// This define the path for recipe details
app.get("/recipes/:id",(req,res)=>{
    let {id} = req.params;
    connection.query(`SELECT * FROM recipeIndiannnn WHERE id=${id}`,((err,result)=>{
        try{
            if(err) throw err;
            console.log(result);
            res.render("recipe.ejs",{recipe: result[0]});
        }
        catch(err){
            console.log(err);
            res.send("Some error in database!!!!");
        }
    }))
})


// This below path is for veg category recipes...
app.get("/recipe/:category",(req,res)=>{
    let {category} = req.params;
    category = category.toLowerCase(); // Convert category to lowercase
    let queries = {veg: `SELECT * FROM recipeIndiannnn WHERE  ingredients NOT LIKE "%Chicken%" AND ingredients NOT LIKE "%Mutton%" AND ingredients NOT LIKE "%Fish%" AND ingredients NOT LIKE "%Egg%"  LIMIT 175`,

        nonveg: `SELECT * FROM recipeIndiannnn WHERE  ingredients LIKE "%Chicken%" OR ingredients LIKE "%Mutton%" OR ingredients LIKE "%Fish%" OR ingredients LIKE "%Egg%"  LIMIT 175`,

        breakfast:  `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Breakfast%" OR
        recipe_name LIKE "%Idli%" OR recipe_name LIKE "%Dosa%" OR recipe_name LIKE "%Upma%" OR recipe_name LIKE "%Poha%" OR recipe_name LIKE "%Paratha%" OR recipe_name LIKE "%Chilla%" OR
        recipe_name LIKE "%Poori%" OR recipe_name LIKE "%Omelet%" OR recipe_name LIKE "%Bathura%" OR recipe_name LIKE "%Bread%" OR recipe_name LIKE "%Milk%" OR
        recipe_name LIKE "%Oats%" OR  recipe_name LIKE "%Dalia%"  LIMIT 175`,

        snacks:`SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Snacks%" OR
        recipe_name LIKE "%Chips%" OR recipe_name LIKE "%Samosa%" OR recipe_name LIKE "%Pakora%" OR recipe_name LIKE "%Nuts%" OR recipe_name LIKE "%Chivda%" OR recipe_name LIKE "%Murukku%" OR
        recipe_name LIKE "%Mathri%" OR recipe_name LIKE "%Dhokla%" OR recipe_name LIKE "%Khandvi%" OR recipe_name LIKE "%Patties%" OR recipe_name LIKE "%Spring Rolls%" OR recipe_name LIKE "%Sandwich%" OR
        recipe_name LIKE "%Pav Bhaji%" OR recipe_name LIKE "%Bhel Puri%" OR recipe_name LIKE "%Sev Puri%" OR recipe_name LIKE "%Dahi Puri%" OR recipe_name LIKE "%Pani Puri%" OR recipe_name LIKE "%Chaat%" OR  recipe_name LIKE "%Chaumin%" OR recipe_name LIKE "%Chowmein%" OR recipe_name LIKE "%Roll%" OR recipe_name LIKE "%Pasta%" OR recipe_name LIKE "%Momos%" OR recipe_name LIKE "%Noodles%" OR recipe_name LIKE "%Burger%"  LIMIT 175`,

        lunch:`SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Lunch%" OR
        recipe_name LIKE "%Thali%" OR recipe_name LIKE "%Biryani%" OR recipe_name LIKE "%Pulao%" OR recipe_name LIKE "%Curry%" OR recipe_name LIKE "%Roti%" OR recipe_name LIKE "%Sabzi%" OR
        recipe_name LIKE "%Salad%" OR recipe_name LIKE "%Raita%" OR recipe_name LIKE "%Pickle%" OR recipe_name LIKE "%Vegetables%" OR recipe_name LIKE "%Rice%" OR recipe_name LIKE "%chole%"  LIMIT 175`,


        dinner:`SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Dinner%" OR
        recipe_name LIKE "%Thali%" OR recipe_name LIKE "%Biryani%" OR recipe_name LIKE "%Pulao%" OR recipe_name LIKE "%Curry%" OR recipe_name LIKE "%Roti%" OR recipe_name LIKE "%Sabzi%" OR
        recipe_name LIKE "%Dal%" OR recipe_name LIKE "%Rice%" OR recipe_name LIKE "%Paneer%" OR recipe_name LIKE "%Chicken%" OR recipe_name LIKE "%Fish%" OR recipe_name LIKE "%Egg%" OR
        recipe_name LIKE "%Salad%" OR recipe_name LIKE "%Raita%" OR recipe_name LIKE "%Pickle%" OR recipe_name LIKE "%Vegetables%" OR recipe_name LIKE "%Rice%" OR recipe_name LIKE "%Sweets%" OR recipe_name LIKE "%Icecream%"  LIMIT 175`,

        pizza: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Pizza%" LIMIT 175`,

        biryani: `SELECT * FROM recipeIndiannnn WHERE  recipe_name LIKE "%Biryani%" LIMIT 175`
    }
    try{
        connection.query(queries[category],(err,result)=>{
            if(err) throw err;
            console.log(result);
            res.render("category.ejs",{data: result, category: category});
        });

    }
    catch(err){
        console.log(err);
        res.send("Some error in database");
    }


})


// This below path defined for cuisine .....

app.get("/cuisine/:cuisine", (req, res) => {
    let { cuisine } = req.params;
    cuisine = cuisine.toLowerCase(); // Convert cuisine to lowercase
    let queries = {
        punjabi: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Punjabi%" LIMIT 175`,
        bengali: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Bengali%" LIMIT 175`,
        andhra: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Andhra%" LIMIT 175`,
        maharashtrian: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Maharashtrian%" LIMIT 175`,
        southindian: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%South Indian%" LIMIT 175`,
        northindian: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%North Indian%" LIMIT 175`,
        chinese: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Chinese%" LIMIT 175`,
        asian: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Asian%" LIMIT 175`,
        mexican: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Mexican%" LIMIT 175`,
        japanese: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Japanese%" LIMIT 175`,
        fusion: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Fusion%" LIMIT 175`,
        continental: `SELECT * FROM recipeIndiannnn WHERE  cuisine LIKE "%Continental%" LIMIT 175`
    }
    try {
        connection.query(queries[cuisine], (err, result) => {
            if (err) throw err;
            console.log(result);
            res.render("cuisine.ejs", { data: result, cuisine: cuisine });
        });

    }
    catch (err) {
        console.log(err);
        res.send("Some error in database");
    }


})


// This below will define a path for search query of a recipe...

app.get("/search",(req,res)=>{
    let { query } = req.query;
   // query = query[0].toUpperCase()+query.slice(1).toLowerCase(); // Capitalize the first letter of the query
   query= query
       .split(" ")
       .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
       .join(" ");
    query2 = query.toLowerCase();
    let sql = `SELECT * FROM recipeIndiannnn WHERE recipe_name LIKE "%${query}%" OR recipe_name LIKE "%${query2}%" LIMIT 175`;
    try {
        connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.render("search.ejs", { data: result, query: query });
        });

    }
    catch (err) {
        console.log(err);
        res.send("Some error in database");
    }


})


// This will define a path for About section..
app.get("/about", (req, res) => {
    res.render("about.ejs");
});


app.listen(port, ()=>{
    console.log(`Server is continuously running at port ${port}`);
});

