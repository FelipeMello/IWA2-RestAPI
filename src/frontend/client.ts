//Global scope
let TOKEN ="";

let createUser = (user) =>{
    const response = fetch("api/v1/users", {
        method: "POST",
        headers : {
            "Accpet": "application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    }).then(response =>{
        response.json().then(json => {
            console.log(json);
        });
    })
};

//createUser

let getAuthToken = async(user) =>{
    const response = fetch("api/v1/auth/login",{
        method : "POST",
        headers : {
            "Accpet": "application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify(user)
    }).then(response =>{
        response.json().then(json =>{
            //The first request
        TOKEN = json.token;
        console.log(json);
        });
        
    })
};

// get AuthToken

let createLink = async (link) => {
    const response = fetch(
        "/api/v1/links",
        {
            method: "POST",
            headers: {
                "Authorization": TOKEN, // We reed the token from the global variable (we must call getAuthToken first)
                "Accept": "application/json",
                "Content-Type": "application/json"
            },  
            body: JSON.stringify(link)
        }
    ).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};
