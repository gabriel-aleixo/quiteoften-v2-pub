// GET data from server route
export const getData = async (URL = '', params = {}) => {
    try {
        const queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
        const response = await fetch(`${URL}?${queryString}`, {
            method: 'GET', //POST, GET, PUT, DEL...
            credentials: 'same-origin',
            headers: setHeaders({}),
            }
        )
        if (!response.ok) {
            const message = `An error has occured: ${response.status}: ${response.statusText}`;
            throw new Error(message);
        } else {
            const jsonData = await response.json();
            return jsonData;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// POST data to server route
export const postData = async (URL = '', params = {}, DATA = {}) => {
    try {
        const queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
        const response = await fetch(`${URL}?${queryString}`, {
            method: 'POST', //POST, GET, PUT, DEL...
            credentials: 'same-origin',
            headers: setHeaders({}),
            //body data type must match "Content-Type" header
            body: JSON.stringify(DATA),
        });
        if (!response.ok) {
            const message = `An error has occured: ${response.status}: ${response.statusText}`;
            throw new Error(message);
        } else {
            const jsonData = await response.json();
            return jsonData;
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

// DELETE data on server route
export const deleteData = async (URL = '', params = {}) => {
    try {
        const queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
        const response = await fetch(`${URL}?${queryString}`, {
            method: 'DELETE', //POST, GET, PUT, DEL...
            credentials: 'same-origin',
            headers: setHeaders({}),
        });
        return response; //unlike other calls, here we are sending response, not jsonData as we need status to bubble up to caller
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Put data on server route
export const putData = async (URL = '', params = {}, DATA = {}) => {
    try {
        const queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
        const response = await fetch(`${URL}?${queryString}`, {
            method: 'PUT', //POST, GET, PUT, DEL...
            credentials: 'same-origin',
            headers: setHeaders({}),
            //body data type must match "Content-Type" header
            body: JSON.stringify(DATA),
        });
        if (!response.ok) {
            const message = `An error has occured: ${response.status}: ${response.statusText}`;
            throw new Error(message);
        } else {
            const jsonData = await response.json();
            return jsonData;
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export function getUserNameGivenId (userId) {        
    return (userId && `User ${userId}`);
}

//Outseta code to get actual user name goes here..
export function getUserName (pairedUser, loggedInUser) {
    if (loggedInUser !=null && pairedUser!=null) {
        if (loggedInUser === pairedUser.lead) {
            return getUserNameGivenId(pairedUser.follow);
        }
        else {
            if (loggedInUser === pairedUser.follow) {
                return getUserNameGivenId(pairedUser.lead);
            }
            else {
                return null;
            }

        }
    }
    else { 
        return null;
    }
}

export function setHeaders(headers) {
    if(localStorage [`Outseta.nocode.accessToken`]) {
        return {
            ...headers,
            Accept: "application/json",
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage [`Outseta.nocode.accessToken`]}`
        }
    } else {
        return {
            ...headers,
            Accept: "application/json",
            'Content-Type': 'application/json'
        }
    }
}
// Helper to check if a URL has a specific param. Returns true or false.
export function hasQueryParam(queryString, param) {
    const urlParams = new URLSearchParams(queryString);
    return urlParams.has(param);
}