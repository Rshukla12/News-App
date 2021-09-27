const API_KEY = '0fe15eb8597d4e9ea15a41e4e1d3d82a';

function fetchHeadlines(category){
    let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`;
    if ( category ){
        url += `&category=${category}`;
    }
    return fetch(url)
        .then( (res) => {
            return res.json();
        })
        .catch(( err ) => {
            console.log(err);
        });
}


function displayHeadlines(headlines){
    
}


async function getHeadlines(){
    try {
        const headlines = await fetchHeadlines();
        console.log(headlines.articles)
    } catch ( err ){
        console.log(err);
    }
}
getHeadlines();

