const API_KEY = '0fe15eb8597d4e9ea15a41e4e1d3d82a';

function fetchHeadlines(category){
    let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}&pageSize=10`;
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

function titleSourceRemover(title){
    const index = title.lastIndexOf('-');
    title = title.slice(0, index-1);
    return title;
}

function displayLoading(isLoading){
    const container = document.getElementById('headlines');
    if ( isLoading ){
        const spinner = document.createElement('div');
        spinner.id = "spinner";
        container.append(spinner)
    } else {
        const spinner = document.getElementById('spinner');
        spinner.remove();
    }
    
}


function createArticleCard(article){
    const container = document.createElement('div');
    const img = document.createElement('img');
    const newsOutlet = document.createElement('h2');
    const headline = document.createElement('h1');
    const content = document.createElement('p');
    const infoCont = document.createElement('div');
    
    container.className = "article";
    infoCont.className = "article-info"; 

    img.src =article.urlToImage;
    img.setAttribute('alt', 'Article Image')
    newsOutlet.textContent = article.source.name;
    headline.textContent = titleSourceRemover(article.title);
    content.textContent = article.description;
    
    infoCont.append(newsOutlet, headline, content);
    container.append(img, infoCont);
    return container;
}


function displayHeadlines(headlines){
    const container = document.getElementById('headlines');

    for ( const article of headlines ){
        const artElem = createArticleCard(article);
        container.append(artElem);
    }
}

function displayError(code){

}


async function getHeadlines(){
    try {
        displayLoading(true);
        const headlines = await fetchHeadlines();
        if ( headlines.status == 'ok' ) {
            displayHeadlines(headlines.articles);
        } else {
            displayError('500');
        }
        displayLoading(false);
    } catch ( err ){
        console.log(err);
    }
}
getHeadlines();

