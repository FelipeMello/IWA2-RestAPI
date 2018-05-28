//Global scope
let TOKEN = "";

//createUser
let createUser = (user) => {
    const response = fetch("api/v1/users", {
        method: "POST",
        headers: {
            "Accpet": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};


// get AuthToken
let getAuthToken = async (user) => {
    const response = fetch("api/v1/auth/login", {
        method: "POST",
        headers: {
            "Accpet": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(response => {
        response.json().then(json => {
            //The first request
            TOKEN = json.token;
            console.log(json);
        });

    })
};


//create a Link
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

//getAll links
let getLinks = async () => {
    const response = fetch("api/v1/links/", {
        method: "GET"
    }).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

//deleteLink
let deleteLink = async (linkId) => {
    const response = fetch(`api/v1/links/${linkId}`, {
        method: "DELETE",
        headers: {
            //We read the token from the global variable (we must call getAuthToken first)
            "Authorization": TOKEN
        }
    }).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
}

//upvote
let upvoteLink = (linkId) => {
    const response = fetch(`/api/v1/links/${linkId}/upvote`, {
        method: "POST",
        headers: {
            //We read the token from the global variable (we must call getAuthToken first)
            "Authorization ": TOKEN
        }
    }).then(response => {
        response.json().then(json => {
            console.log(json);
        });
    })
};

let downVoteLink = (linkId) => {
    const response = fetch(`/api/v1/links/${linkId}/downvote`, {
        method: "POST",
        headers: {
            "Authorization": TOKEN

        }
    }).then(response => {
        response.json().then(json => {
            console.log(json);
        })

    });
};

let getVotesForLink = (linkId) =>{
    const response = fetch(`/api/v1/links/${linkId}/votes`,{
        method: "GET"
    }).then(response =>{
        response.json().then(json =>{
            console.log(json);
        })
    })
}