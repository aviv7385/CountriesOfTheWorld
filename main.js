/// <reference path="jquery-3.5.1.js" />

//a function for the "display all" button
function getCountries() {
    //clear previous data
    $("tbody").empty();
    $("thead").empty();
    //get the Promise object by calling the function where the Promise object was created
    //and give the desired url as an object
    getJsonFromServer("https://restcountries.eu/rest/v2/all")
        .then(array => displayCountries(array))
        .catch(err => alert("Error! " + err))
}

// a function for the "Search" button
function getSearchedCountries() {
    //clear previous data
    $("tbody").empty();
    $("thead").empty();
    //get value from the input box
    try {
        const value = searchCountry();
        //get the Promise object by calling the function where the Promise object was created
        //and give the desired url as an object
        getJsonFromServer(`https://restcountries.eu/rest/v2/name/${value}`)
            .then(array => displayCountries(array))
            .catch(err => alert("Error! No country was found"))
    }
    catch (err) {
        alert(err);
    }
    //clear previous input from the search field
    $("#searchBox").val("");
}

// a function that gets a url as an argument
// and returns a Promise object, which gets 2 arguments: resolve (successCallback) and reject (errorCallback)
function getJsonFromServer(jsonUrl) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: jsonUrl,
            success: jsonRequest => resolve(jsonRequest),
            error: err => reject(err),
        })
    });
}

//this function gets an array as an argument and will display the wanted information from that object 
function displayCountries(countriesArray) {

    //create the header section of the countries table
    $("thead").append(`
    <th>Country Name</th>
    <th>Top Level Domain</th>
    <th>Capital</th>
    <th>Currencies</th>
    <th>Borders</th>
    <th>Flag</th>
    `)

    //loop through the list of countries - either the whole list or the partial list
    //which is created when the user enters input for search
    for (const country of countriesArray) {

        //loop through the currencies array of each country and save it as a string 
        //so it will be easier to be displayed
        let currency = "";
        for (const item of country.currencies) {
            if (item.code == "(none)" || item.code == null) {
                continue;
            }
            currency += item.code + "  ";
        }

        //loop through the borders array of each country and save it as a string 
        //so it will be easier to be displayed
        let border = "";
        for (let i = 0; i < country.borders.length; i++) {
            border += country.borders[i] + " ";
        }
        if (border == "") {
            border = "No Continental Borders";
        }

        //for each country create a table row and insert the specific data
        $("tbody").append(`
        <tr>
            <td>${country.name}</td>
            <td>${country.topLevelDomain}</td>
            <td>${country.capital}</td>
            <td>${currency}</td>
            <td>${border}</td>
            <td><img src="${country.flag}"></td>
        </tr>
        `);
    }
}

// a function that returns the input the user entered at the search field
// and also validates that the input is legal (letters) 
function searchCountry() {
    const inputValue = $("#searchBox").val();

    //validate that the entered value is legal
    if (inputValue == "" || inputValue == undefined || inputValue.trim().length < 1 || $.isNumeric(inputValue) || inputValue == null) {
        throw new Error("Please enter letters");
    }
    return inputValue;
}

