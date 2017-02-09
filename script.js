        "use strict";
        var PROXY_URL = "proxy.php?filename=";
        var YUMMLY_URL = "https://api.yummly.com/v1/api/recipes?callback=jsonLoaded&_app_id=";
        var YUMMLY_ID = "19a24bb5";
        var YUMMLY_KEY = "8ed54b2e4467afde5a7567a9e94ad877";

        var BREWERY_URL = "https://api.brewerydb.com/v2/beers?&key=";
        var BREWAPI_KEY = "cca3e63b052423c91031b79ebd84dd90";
        var storeAllJson = [];
        var listBeersPairings = [];

        var value;
        var allStuff = "";
        var numRecipesPage;
        var cuisineKey;
        var courseKey;
        var pageNum = 0;
        var maxPages = 0;
        var whatRecipes = 0;
        var beerState;
        var foodState = true;
        var dairy = false,
            egg = false,
            gluten = false,
            peanut = false,
            seafood = false,
            sesame = false,
            soy = false,
            sulfite = false,
            treeNut = false,
            wheat = false;
        var dairyId = "396^Dairy-Free",
            eggId = "397^Egg-Free",
            glutenId = "393^Gluten-Free",
            peanutId = "394^Peanut-Free",
            seafoodId = "398^Seafood-Free",
            sesameId = "399^Sesame-Free",
            soyId = "400^Soy-Free",
            sulfiteId = "401^Sulfite-Free",
            treeNutId = "395^Tree Nut-Free",
            wheatId = "392^Wheat-Free";
        var allergens;
        var abvMin = 3,
            abvMax = 10;
        var numOfBeers;
        var vintageYear;
        var category;
        var organic, label, breweryInfo, randomBeer;
    
        window.onload = init;

        function init() {

            // if clicking on random
            document.querySelector("#random").onclick = function(e) {
                // clear inner HTML (if any prev results)
                $("#dynamicContent").fadeOut(800);
                // needs for check later
                randomBeer = true;
                // clear console
                console.clear();
                // start the loading spinner!
                jQuery('#Spinner-first').fadeIn();
                //get data
                getData();
            }

            // if we are searching for something
            document.querySelector("#search").onclick = function(e) {
                // clear inner html (if any prev results)
                $("#dynamicContent").fadeOut(800);
                // clear console
                console.clear();
                // start the loading spinner!
                jQuery('#Spinner-first').fadeIn();
                getData();
            }

            // listening for next buttons clicks!
            document.querySelector("#nextButton1").onclick = function(e) {
                if (foodState) whatRecipes = whatRecipes + 10;
                pageNum++;
                console.clear();
                getData();
            }

            document.querySelector("#nextButton2").onclick = function(e) {
                if (foodState) whatRecipes = whatRecipes + 10;
                pageNum++;
                console.clear();
                getData();
            }

            // listening for prev button clicks!
            document.querySelector("#prevButton1").onclick = function(e) {
                if (foodState) whatRecipes = whatRecipes - 10;
                pageNum--;
                console.clear();
                getData();
            }
            document.querySelector("#prevButton2").onclick = function(e) {
                if (foodState) whatRecipes = whatRecipes - 10;
                pageNum--;
                console.clear();
                getData();
            }

            // if we are clicking on the food tab
            document.querySelector("#food").onclick = function(e) {
                foodState = true; // in food state
                // clear inner HTML
                $("#dynamicContent").fadeOut(800);
                // change the header
                headerText.innerText = "What's for Dinner?";
                // set search value (to make it easier for Tony)
                document.querySelector("#searchterm").value = "Chicken";
                // food search start at page 0
                pageNum = 0;
                // change the background image of the header
                // got the image from http://www.imcreator.com/free/food-drinks/mmmmm-harvest-fort-collins-colorado
                document.querySelector("#header").style.backgroundImage = "linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%), url(content/tomatoes.jpg)";
                console.clear();

                // hide the random button
                document.querySelector("#random").style.display = "none";
                // set beer state to false
                beerState = false;
                // display food controls
                document.querySelector("#foodControls").style.display = "block";
                // set the food tab to active
                document.querySelector("#food").classList.add('active');
                // hide beer controls
                document.querySelector("#beerControls").style.display = "none";
                // beer tab is no longer active
                document.querySelector("#beer").classList.remove('active');
                
                // hide buttons
                document.querySelector("#prevButton1").style.visibility = "hidden";
                document.querySelector("#prevButton2").style.visibility = "hidden";
                
                document.querySelector("#nextButton1").style.visibility = "hidden";
                document.querySelector("#nextButton2").style.visibility = "hidden";

            }

            // if we are clicking on beer tab
            document.querySelector("#beer").onclick = function(e) {
                // ber state is true
                beerState = true;
                // clear inner html
                $("#dynamicContent").fadeOut(800);
                // change background image
                // got image from http://www.imcreator.com/free/food-drinks/devine-affair-christmas
                document.querySelector("#header").style.backgroundImage = "linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%), url(content/table.jpg)";
                console.clear();
                // set search value (to make it easier for Tony)
                document.querySelector("#searchterm").value = "Genesee";
                // beer search start at page 1
                pageNum = 1;
                // change the header
                headerText.innerText = "Beer for Days!";
                // display random button
                document.querySelector("#random").style.display = "inline";
                // food state is false
                foodState = false;
                // show beer controls
                document.querySelector("#beerControls").style.display = "block";
                // beer tab is now active
                document.querySelector("#beer").classList.add('active');
                // hide food controls
                document.querySelector("#foodControls").style.display = "none";
                // food tab not active anymore
                document.querySelector("#food").classList.remove('active');
                
                // hide buttons
                document.querySelector("#prevButton1").style.visibility = "hidden";
                document.querySelector("#prevButton2").style.visibility = "hidden";
                
                document.querySelector("#nextButton1").style.visibility = "hidden";
                document.querySelector("#nextButton2").style.visibility = "hidden";

            }

            // if we change the cusine for food, get the key value
            document.querySelector('#cuisine').onchange = function(e) {
                    cuisineKey = e.target.value;
                }
                // if we change the course for food, get the key value
            document.querySelector('#course').onchange = function(e) {
                    courseKey = e.target.value;
                }
                // if we change categories for beer, get value
            document.querySelector('#categories').onchange = function(e) {
                    category = e.target.value;
                }
                // if we are searching for a specific year vintage of beer
            document.querySelector('#year').onchange = function(e) {
                    vintageYear = e.target.value;
                }
                // if we want organic
            document.querySelector("#organic").onchange = function(e) {
                    organic = document.getElementById("organic").checked;
                }
                // if we want labels
            document.querySelector("#labels").onchange = function(e) {
                    label = document.getElementById("labels").checked;
                }
                // if we want beer with brewery information
            document.querySelector("#brewery").onchange = function(e) {
                breweryInfo = document.getElementById("brewery").checked;
            }


            // ALLERGENS FOR FOOD
            document.querySelector("#dairy").onchange = function(e) {
                dairy = document.getElementById("dairy").checked;
            }

            document.querySelector("#egg").onchange = function(e) {
                egg = document.getElementById("egg").checked;
            }

            document.querySelector("#gluten").onchange = function(e) {
                gluten = document.getElementById("gluten").checked;
            }

            document.querySelector("#peanut").onchange = function(e) {
                peanut = document.getElementById("peanut").checked;
            }

            document.querySelector("#seafood").onchange = function(e) {
                seafood = document.getElementById("seafood").checked;
            }

            document.querySelector("#sesame").onchange = function(e) {
                sesame = document.getElementById("sesame").checked;
            }

            document.querySelector("#soy").onchange = function(e) {
                soy = document.getElementById("soy").checked;
            }

            document.querySelector("#sulfite").onchange = function(e) {
                sulfite = document.getElementById("sulfite").checked;
            }

            document.querySelector("#treenut").onchange = function(e) {
                treeNut = document.getElementById("treenut").checked;
            }

            document.querySelector("#wheat").onchange = function(e) {
                wheat = document.getElementById("wheat").checked;
            }

            // use JS to set the year for the pulldown list
            var end = 1990;
            var start = new Date().getFullYear();
            var options = "<option> null </option>";
            for (var year = start; year >= end; year--) {
                options += "<option>" + year + "</option>";
            }
            document.getElementById("year").innerHTML = options;

            // had to use JQUERY for the two value slider for ABV
            $(function() {
                $("#slider-range").slider({
                    range: true,
                    min: 0,
                    max: 70,
                    values: [3, 10],
                    slide: function(event, ui) {
                        $("#amount").val(ui.values[0] + " - " + ui.values[1]);
                        abvMin = ui.values[0];
                        abvMax = ui.values[1];
                    }
                });
                $("#amount").val($("#slider-range").slider("values", 0) +
                    " - " + $("#slider-range").slider("values", 1));
            });

        }

        // ========= GET DATA, BUILD THE URL STRING ========= //
        function getData() {

            // if random beer, we have to change initial url
            if (randomBeer) {
                BREWERY_URL = "https://api.brewerydb.com/v2/beer/random?&key=";
            }
            // star building beer url
            var bUrl = PROXY_URL + BREWERY_URL;
            bUrl += BREWAPI_KEY;
            bUrl += "&abv=";

            // build food URL
            var url = YUMMLY_URL;
            url += YUMMLY_ID;
            url += "&_app_key=";
            url += YUMMLY_KEY;
            url += "&q=";

            // change the brewery_url back to the original/normal url
            BREWERY_URL = "https://api.brewerydb.com/v2/beers?&key=";

            // get value of form field
            value = document.querySelector("#searchterm").value;

            // get rid of any leading and trailing spaces
            value = value.trim();

            // if we are in food state, search for food
            if (foodState) {
                value = encodeURI(value);
                if (cuisineKey) cuisineKey = cuisineKey.trim();
                if (courseKey) courseKey = courseKey.trim();

                // if there's no band to search then bail out of the function
                if (value.length < 1 && cuisineKey == null && courseKey == null && !dairy && !egg && !gluten && !peanut && !seafood && !sesame && !soy && !sulfite && !treeNut && !wheat) return;

                if (cuisineKey) cuisineKey = encodeURI(cuisineKey);
                if (courseKey) courseKey = encodeURI(courseKey);

                url += value;

                if (cuisineKey != null) {
                    url += "&allowedCuisine[]=cuisine^cuisine-" + cuisineKey;
                }

                if (courseKey != null) {
                    url += "&allowedCourse[]=course^course-" + courseKey;
                }

                if (dairy) {
                    url += "&allowedAllergy[]=" + dairyId;
                }

                if (egg) {
                    url += "&allowedAllergy[]=" + eggId;
                }

                if (gluten) {
                    url += "&allowedAllergy[]=" + glutenId;
                }

                if (peanut) {
                    url += "&allowedAllergy[]=" + peanutId;
                }

                if (seafood) {
                    url += "&allowedAllergy[]=" + seafoodId;
                }

                if (sesame) {
                    url += "&allowedAllergy[]=" + sesameId;
                }

                if (soy) {
                    url += "&allowedAllergy[]=" + soyId;

                }
                if (sulfite) {
                    url += "&allowedAllergy[]=" + sulfiteId;

                }
                if (treeNut) {
                    url += "&allowedAllergy[]=" + treeNutId;
                }
                if (wheat) {
                    url += "&allowedAllergy[]=" + wheatId;
                }

                url += "&maxResult=10&start=" + whatRecipes;

                var script = document.createElement('script');
                script.setAttribute('src', url);
                script.setAttribute('id', 'tempScript');
                document.querySelector('head').appendChild(script);

            }

            // if we are in the beer state, have to call proxy server
            // because the web service can only return json
            if (beerState) {
                bUrl += abvMin + "," + abvMax;

                if (value) {
                    bUrl += "&name=" + value;
                }

                if (category >= 1) {
                    bUrl += "&styleId=" + category;
                }

                if (vintageYear) {
                    bUrl += "&year=" + vintageYear;
                }

                if (organic) {
                    bUrl += "&isOrganic=Y";
                }

                if (label) {
                    bUrl += "&hasLabels=Y";
                }

                if (breweryInfo) {
                    bUrl += "&withBreweries=Y";
                }


                bUrl += "&p=" + pageNum;

                bUrl = bUrl.replace(/&/g, '%26');


                var xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    var myJSON = JSON.parse(xhr.responseText);
                    jsonLoaded3(myJSON);
                }
                xhr.open('GET', bUrl, true);

                // try to prevent browser caching by sending a header to the server
                xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2010 00:00:00 GMT");
                xhr.send();
            }
        }



        // ============ FIRST round for Food calls ========== //
        function jsonLoaded(obj) {

            // if there's an error, print a message and return
            if (obj.error) {
                var status = obj.status;
                var description = obj.description;
                document.querySelector("#dynamicContent").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + description + "</i><p>";
                return; // Bail out
            }

            // get max pages, we can only get 10 recipes for each page
            // so we take total count and divide by 10, then round it down to closest integer
            // because not always even
            maxPages = Math.round(obj.totalMatchCount / 10);

            // TO SHOW/HIDE NEXT BUTTON
            if (pageNum < maxPages) {
                document.querySelector("#nextButton1").style.visibility = "visible";
                document.querySelector("#nextButton2").style.visibility = "visible";
            } else {
                document.querySelector("#nextButton1").style.visibility = "hidden";
                document.querySelector("#nextButton2").style.visibility = "hidden";

            }

            // TO SHOW/HIDE PREV BUTTON
            if (pageNum >= 1) {
                document.querySelector("#prevButton1").style.visibility = "visible";
                document.querySelector("#prevButton2").style.visibility = "visible";
            } else {
                document.querySelector("#prevButton1").style.visibility = "hidden";
                document.querySelector("#prevButton2").style.visibility = "hidden";
            }


            // if there are no results, print a message and return
            if (obj.totalMatchCount == 0) {
                var status = "No results found";
                document.querySelector("#dynamicContent").innerHTML = "<p><i>" + status + "</i><p>" + "<p><i>";
                jQuery('#Spinner-first').fadeOut();
                return; // Bail out
            }


            // If there is an array of results, loop through them
            if (obj.totalMatchCount > 1) {
                var allRecipes = obj.matches;
                numRecipesPage = allRecipes.length;

                // loopin through each results, get the id from each and
                // do a second call (each id provides more details for each recipe)
                for (var i = 0; i < allRecipes.length; i++) {
                    var recipe = allRecipes[i];
                    var recipeIDURL = "https://api.yummly.com/v1/api/recipe/";
                    recipeIDURL += recipe.id;
                    recipeIDURL += "?callback=jsonLoaded2&_app_id=19a24bb5&_app_key=8ed54b2e4467afde5a7567a9e94ad877";

                    var script = document.createElement('script');
                    script.setAttribute('src', recipeIDURL);
                    script.setAttribute('id', 'tempScript');
                    document.querySelector('head').appendChild(script);
                }
            }
        };


        // ===== SECOND round for food, more details from each individual dish! ========= //
        function jsonLoaded2(obj) {

            // if there's an error, print a message and return
            if (obj.error) {
                var status = obj.status;
                var description = obj.description;
                document.querySelector("#dynamicContent").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + description + "</i><p>";
                return; // Bail out
            }

            // place holder variable for recipe
            // getting more recipe at a time
            var recipe = obj;

            var name = recipe.name;
            if (!name) name = "No name found";

            var prep = recipe.prepTime;
            var cookTime = recipe.cookTime;
            var ingredients = recipe.ingredientLines;
            var url = recipe.attribution.url;
            var servings = recipe.numberOfServings;

            // get image of the food
            if (recipe.images) {
                if (recipe.images[0].hostedLargeUrl) {
                    var img = recipe.images[0].hostedLargeUrl;
                } else if (recipe.images[0].hostedMediumUrl) {
                    var img = recipe.images[0].hostedMediumUrl;
                }
            }

            var flavor = recipe.flavors;
            if (flavor) {
                var p = recipe.flavors.Piquant;
                var m = recipe.flavors.Meaty;
                var b = recipe.flavors.Bitter;
                var sw = recipe.flavors.Sweet;
                var so = recipe.flavors.Sour;
                var sa = recipe.flavors.Salty;
            }

            // if any of flavor is undefined, most likely all flavors are
            if (p == undefined) {
                flavor = null;
            }

            var line = "<div class='image'>";
            if (img) line += "<img src=" + img + ">";
            if (ingredients != null) {
                line += "<b>Ingredients: </b></br>";
                for (var i = 0; i < ingredients.length; i++) {
                    line += "<br>" + ingredients[i];
                }
            }
            line += "</div>";
            line += "<div class='content'>";
            line += "<h3>" + name + "</h3>";
            if (prep) line += "<b>Prep time:</b> " + prep + "<br>";
            if (cookTime) line += "<b>Cook Time:</b> " + cookTime + "<br></br>";
            if (servings) line += "<b>Servings:</b> " + servings + "<br><br>";
            if (flavor) line += "<b>Flavor Scale, 0-1:</b>";

            if (p != undefined) line += "<p><b>Piquant:</b> " + p + "&nbsp;";
            if (m != undefined) line += "&nbsp; <b>Meaty:</b> " + m + "&nbsp;";
            if (b != undefined) line += "&nbsp; <b>Bitter:</b> " + b + "</p>";
            if (sw != undefined) line += "<p><b>Sweet:</b> " + sw + "&nbsp;";
            if (so != undefined) line += "&nbsp; <b>Sour:</b> " + so + "&nbsp;";
            if (sa != undefined) line += "&nbsp; <b>Salty:</b> " + sa + "</p>";

            if (url) line += "<p><a href=" + url + ">" + "Link to Recipe!" + "</a></p>";
            line += "</div>";
            line += "<div style='clear: both;'></div>";
            allStuff += line;


            // printOut(bigString);
            storeAllJson.push(allStuff);

            if (storeAllJson.length == numRecipesPage) {
                printOut();
                allStuff = "";
                storeAllJson.length = 0;
            }
        }

        // =========== LOADING BEERS! ============= //
        function jsonLoaded3(obj) {
            // bail out if there is an error
            if (obj.status == "400") {
                document.querySelector('#status').innerHTML = "<i>Error! " + obj.error + "<i>";
                return;
            }

            maxPages = obj.numberOfPages;
            var count = obj.totalResults;
            var singleBeer = [];
            if (randomBeer) {
                singleBeer.push(obj);
            }
            
            if (obj.status == "failure" || !count && singleBeer == 0 || obj.errorMessage) {
                var status = "No results found, you are probably too specific!";
                document.querySelector("#dynamicContent").innerHTML = "<p><i>" + status + "</i><p>" + "<p><i>";
                jQuery('#Spinner-first').fadeOut();
                return;
            }
            
            numOfBeers = obj.data.length;

            // ========= Show PREV / NEXT buttons =========//
            if (pageNum < maxPages) {
                document.querySelector("#nextButton1").style.visibility = "visible";
                document.querySelector("#nextButton2").style.visibility = "visible";
            } else {
                document.querySelector("#nextButton1").style.visibility = "hidden";
                document.querySelector("#nextButton2").style.visibility = "hidden";

            }

            if (pageNum > 1) {
                document.querySelector("#prevButton1").style.visibility = "visible";
                document.querySelector("#prevButton2").style.visibility = "visible";
            } else {
                document.querySelector("#prevButton1").style.visibility = "hidden";
                document.querySelector("#prevButton2").style.visibility = "hidden";
            }


            // ======== IF ONLY ONE BEER ========================= //
            // Sadly, when using random, only one beer is given and there is
            // no property that provides data telling us that, so I have to force it into
            // an array, and then check from there

            if (singleBeer.length == 1) {

                // get the name
                if (obj.data.name) var name = obj.data.name;
                // get description
                if (obj.data.description) var description = obj.data.description;
                // get abv
                if (obj.data.abv) var abv = obj.data.abv;
                // get ibu
                if (obj.data.ibu) var ibu = obj.data.ibu;
                //check if organic
                if (obj.data.isOrganic) var isOrg = obj.data.isOrganic;
                // get the largest image of the label
                if (obj.data.labels) {
                    var lablImg = obj.data.labels.large;
                }
                // check during what season it's available
                if (obj.data.available) {
                    var avbDesc = obj.data.available.description;
                }
                // get the style of the beer (what category)
                if (obj.data.style) {
                    var styleName = obj.data.style.category.name;
                }
                // the best serving temperature
                if (obj.data.servingTemperatureDisplay) var temp = obj.data.servingTemperatureDisplay;
                // brewery information
                if (obj.data.breweries) {
                    var bName = obj.data.breweries[0].name;

                    var bDesc = obj.data.breweries[0].description;

                    var bSite = obj.data.breweries[0].website;

                    if (obj.data.breweries[0].images) {
                        var img = obj.data.breweries[0].images.large;
                    }
                }

                var line = "<div class='image'>";
                if (img) line += "<img src=" + img + ">";
                if (lablImg) line += "<img src=" + lablImg + ">";
                if (abv) line += "<p><b>ABV:</b> " + abv + "</p>";
                if (ibu) line += "<p><b>IBU:</b> " + ibu + "</p>";
                if (styleName) line += "<p><b>Style:</b> " + styleName + "</p>";
                if (temp) line += "<p><b>Serving temp:</b> " + temp + "</p>";
                if (isOrg) {
                    if (isOrg == "Y") line += "<p><b>Is Organic</b></p>";
                }
                line += "</div>";
                line += "<div class='content'>";
                line += "<h2>" + name + "</h2>";
                if (description) line += "<br>" + description;
                if (avbDesc) line += "<br><br>" + avbDesc;
                if (bName) line += "<br><h3>" + bName + "</h3>";
                if (bDesc) line += bDesc;
                if (bSite) line += "<p><a href=" + bSite + ">" + "Link to Website!" + "</a></p>"

                line += "</div>";
                line += "<div style='clear: both;'></div>";
                line += "<br>";
                allStuff += line;

                // printOut(bigString);
                storeAllJson.push(allStuff);
            }

            // =========== IF ONLY ONE BEER, BUT NOT FROM RANDOM ============== //
            if (obj.totalResults == 1) {
                if (obj.data[0].name) var name = obj.data[0].name;
                if (obj.data[0].description) var description = obj.data[0].description;
                if (obj.data[0].abv) var abv = obj.data[0].abv;
                if (obj.data[0].ibu) var ibu = obj.data[0].ibu;
                if (obj.data[0].isOrganic) var isOrg = obj.data[0].isOrganic;

                if (obj.data[0].labels) {
                    var lablImg = obj.data[0].labels.large;
                }
                if (obj.data[0].available) {
                    var avbDesc = obj.data[0].available.description;
                }
                if (obj.data[0].style) {
                    var styleName = obj.data[0].style.category.name;
                }
                if (obj.data[0].servingTemperatureDisplay) var temp = obj.data[0].servingTemperatureDisplay;

                if (obj.data[0].breweries) {
                    var bName = obj.data[0].breweries.name;

                    var bDesc = obj.data[0].breweries.description;

                    var bSite = obj.data[0].breweries.website;

                    if (obj.data[0].breweries.images) {
                        var img = obj.data[0].breweries.images.large;
                    }
                }

                var line = "<div class='image'>";
                if (img) line += "<img src=" + img + ">";
                if (lablImg) line += "<img src=" + lablImg + ">";
                if (abv) line += "<p><b>ABV:</b> " + abv + "</p>";
                if (ibu) line += "<p><b>IBU:</b> " + ibu + "</p>";
                if (styleName) line += "<p><b>Style:</b> " + styleName + "</p>";
                if (temp) line += "<p><b>Serving temp:</b> " + temp + "</p>";
                if (isOrg) {
                    if (isOrg == "Y") line += "<p><b>Is Organic</b></p>";
                }
                line += "</div>";
                line += "<div class='content'>";
                line += "<h2>" + name + "</h2>";
                if (description) line += "<br>" + description;
                if (avbDesc) line += "<br><br>" + avbDesc;
                if (bName) line += "<br><h3>" + bName + "</h3>";
                if (bDesc) line += bDesc;
                if (bSite) line += "<p><a href=" + bSite + ">" + "Link to Website!" + "</a></p>"

                line += "</div>";
                line += "<div style='clear: both;'></div>";
                line += "<br>";
                allStuff += line;

                // printOut(bigString);
                storeAllJson.push(allStuff);
            }


            // ============ IF MORE THAN 1 BEER ================== //
            if (count > 1) {
                //  build up a list of the results
                var beers = obj.data;

                beers.forEach(function(b) {
                    if (b.name) var name = b.name;
                    if (b.description) var description = b.description;
                    if (b.abv) var abv = b.abv;
                    if (b.ibu) var ibu = b.ibu;
                    if (b.isOrganic) var isOrg = b.isOrganic;

                    if (b.labels) {
                        var lablImg = b.labels.large;
                    }
                    if (b.available) {
                        var avbDesc = b.available.description;
                    }
                    if (b.style) {
                        var styleName = b.style.category.name;
                    }
                    if (b.servingTemperatureDisplay) var temp = b.servingTemperatureDisplay;

                    if (b.breweries) {
                        var bName = b.breweries[0].name;

                        var bDesc = b.breweries[0].description;

                        var bSite = b.breweries[0].website;

                        if (b.breweries[0].images) {
                            var img = b.breweries[0].images.large;
                        }
                    }

                    var line = "<div class='image'>";
                    if (img) line += "<img src=" + img + ">";
                    if (lablImg) line += "<img src=" + lablImg + ">";
                    if (abv) line += "<p><b>ABV:</b> " + abv + "</p>";
                    if (ibu) line += "<p><b>IBU:</b> " + ibu + "</p>";
                    if (styleName) line += "<p><b>Style:</b> " + styleName + "</p>";
                    if (temp) line += "<p><b>Serving temp:</b> " + temp + "</p>";
                    if (isOrg) {
                        if (isOrg == "Y") line += "<p><b>Is Organic</b></p>";
                    }
                    line += "</div>";
                    line += "<div class='content'>";
                    line += "<h2>" + name + "</h2>";
                    if (description) line += "<br>" + description;
                    if (avbDesc) line += "<br><br>" + avbDesc;
                    if (bName) line += "<br><h3>" + bName + "</h3>";
                    if (bDesc) line += bDesc;
                    if (bSite) line += "<p><a href=" + bSite + ">" + "Link to Website!" + "</a></p>"

                    line += "</div>";
                    line += "<div style='clear: both;'></div>";
                    line += "<br>";
                    allStuff += line;

                    // printOut(bigString);
                    storeAllJson.push(allStuff);
                });
            }

            // print out call from regular search
            if (storeAllJson.length == numOfBeers) {
                printOut();
                allStuff = "";
                storeAllJson.length = 0
                // print out call from random search
            } else if (storeAllJson.length == singleBeer.length) {
                printOut();
                allStuff = "";
                storeAllJson.length = 0;
            }
        }

        // =============== PRINT OUT FUNCTION ============ //
        function printOut() {
            jQuery('#Spinner-first').fadeOut();
            document.querySelector("#dynamicContent").innerHTML = allStuff;
            $("#dynamicContent").fadeIn(800);
            randomBeer = false;
        }
