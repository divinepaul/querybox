async function request(url,body){
    let rawResponse;
    let data;
    if(body){
        rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie.split("=")[1]
            },
            body: JSON.stringify(body)
        });
        data = await rawResponse.json();
    } else {
        rawResponse = await fetch(url);
        data = await rawResponse.json();
    }
    return [ rawResponse, data];
}


async function requestWithAuth(navigate,url,body){
    let rawResponse;
    let data;
    if(body){
        rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie.split("=")[1]
            },
            body: JSON.stringify(body)
        });
        data = await rawResponse.json();
    } else {
        rawResponse = await fetch(url);
        data = await rawResponse.json();
    }
    if(rawResponse.status == 401){
        navigate("/login");
    }
    return [ rawResponse, data];
}


const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-GB', { timeZone: 'IST' })
}

export { request,requestWithAuth,formatDate };
