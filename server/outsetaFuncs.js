const axios = require('axios').default;
const util = require('util');

const headers = {
    'Authorization': process.env.OUTSETA_API_KEY,
    'Content-Type': 'application/json'
};

const baseUrl = "https://quiteoften.outseta.com/api/v1"

export const addNewPersonToExistingAccount = async (acctUid, email) => {

    const url = `${baseUrl}/crm/accounts/${acctUid}/memberships?sendWelcomeEmail=true`;

    const data = {
        'Account': { 'Uid': acctUid },
        'Person': { 'Email': email },
        'IsPrimary': 'false'
    };

    try {
        const newPerson = await axios.post(url, data, {headers: headers});
        return newPerson.data;
    }    
    catch (error) {
        console.error(util.inspect(error, {showHidden: false, depth: null}));
        throw error;
    }

}

export const addExistingPersonToExistingAccount = async (acctUid, outsetaPersonUid) => {

    const url = `${baseUrl}/crm/accounts/${acctUid}/memberships`;

    const data = {
        'Account': { 'Uid': acctUid },
        'Person': { 'Uid': outsetaPersonUid },
        'IsPrimary': 'false'
    };

    try {
        const newPersonAccount = await axios.post(url, data, {headers: headers});
        return newPersonAccount.data;
    } 
    catch (error) {
        console.error(util.inspect(error, {showHidden: false, depth: null}));
        throw error;
    }
}

export const getPerson = async (outsetaPersonUid) => {

    const url = `${baseUrl}/crm/people/${outsetaPersonUid}`;


    try {
        const personInOutseta = await axios.get(url, {headers: headers});
        return personInOutseta.data;
    } 
    catch (error) {
        console.error(util.inspect(error, {showHidden: false, depth: null}));
        throw error;
    }
}

export const getPeopleWithEmailInAccount = async (personEmail) => {

    const url = `${baseUrl}/crm/people`;

    let config = {
        headers: headers,
        params: {
          Email: personEmail, //encoding this with encodeURIComponent creates problems 
          fields: `*, PersonAccount.Uid, PersonAccount.Account.Uid`
        },
    }

    try {
        const personInOutseta = await axios.get(url, config);
        return personInOutseta.data;
    } 
    catch (error) {
        console.error(util.inspect(error, {showHidden: false, depth: null}));
        throw error;
    }
}
