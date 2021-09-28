const API_KEY = '0fe15eb8597d4e9ea15a41e4e1d3d82a';
let searchResults;
let flag = false;

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

function fetchSearchResults(query){
    let url = `https://newsapi.org/v2/everything?q=${query}&sortBy=relevancy&apiKey=${API_KEY}`;
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
    if ( index > Math.floor(title.length * 0.7)){
        title = title.slice(0, index-1);
    }
    return title;
}

function displayLoading(isLoading){
    const container = document.getElementById('headlines');
    if ( isLoading ){
        container.style.display = "none"
        const spinner = document.createElement('div');
        spinner.id = "spinner";
        document.body.append(spinner)
    } else {
        const spinner = document.getElementById('spinner');
        spinner.remove();
        container.style.display = "block"
    }
    
}

function createArticleCard(article){
    const container = document.createElement('div');
    const img = document.createElement('img');
    const newsOutlet = document.createElement('h4');
    const headline = document.createElement('h1');
    const content = document.createElement('p');
    const published = document.createElement('h4')
    const infoCont = document.createElement('div');
    const header = document.createElement('div');

    header.className = "article-header";
    container.className = "article";
    infoCont.className = "article-info"; 
    
    const timeStr = new Date(article.publishedAt);
    let publish = Math.floor((new Date().getTime() - timeStr.getTime())/3600000);
    let period = " Hrs Ago"
    if ( publish > 24 ){
        publish = Math.floor(publish/24);
        period = " Days Ago"
    }

    img.src = article.urlToImage;
    img.setAttribute('alt', 'Article Image')
    newsOutlet.textContent = article.source.name;
    headline.textContent = titleSourceRemover(article.title);
    content.textContent = article.description;
    published.textContent = "Published " + publish + period;

    if ( !article.urlToImage ){
        img.src = 'https://www.albertadoctors.org/images/ama-master/feature/Stock%20photos/News.jpg'
    }

    header.append(newsOutlet, published)
    infoCont.append(header, headline, content);
    container.append(img, infoCont);
    return container;
}

function displayHeadlines(headlines){
    const container = document.getElementById('headlines');
    container.innerHTML = null;
    
    for ( const article of headlines ){
        const artElem = createArticleCard(article);
        container.append(artElem);
    }
}

function displayError(code){
    console.log(500)
}


async function getHeadlines(initial, category){
    try {
        displayLoading(true);
        let headlines;
        if ( initial ){
            headlines = await fetchHeadlines();
        } else {
            headlines = await fetchHeadlines(category);
        }
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

function handleCategoricalNews(e){
    if ( e.target.className === "nav-btn" ){
        // getHeadlines(false, e.target.textContent.toLowerCase());
        location.href = `./${e.target.textContent.toLowerCase()}.html`;
    }
}

function displayPagination(current){
    flag = true;
    const container = document.getElementById("headlines");

    const div = document.createElement("div");

    div.id = "pagination";

    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.textContent = "Previous";
    prevBtn.name = current - 1;

    const currBtn = document.createElement("button");
    currBtn.className = "page-btn";
    currBtn.textContent = Number(current) + 1;
    currBtn.name = current;

    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.textContent = "Next"
    nextBtn.name = current + 1;

    if ( current == 0 ){
        prevBtn.disabled = true;
    }

    if ( current >= Math.floor( searchResults.articles.length / 5 )-1){
        nextBtn.disabled = true;
    }
    
    div.append( prevBtn, currBtn, nextBtn );
    container.append(div);
}

function displaySearchResults(pageNum){
    pageNum = pageNum || 0;
    let start = pageNum * 5
    start = start < 0 ? 0 : start;
    const end = start + 5;
    displayHeadlines(searchResults.articles.slice(start, end));
    displayPagination(pageNum);
    document.getElementById('pagination').addEventListener("click", handleSearchPageClick);
}

async function handleSearch(){
    
    try {
        displayLoading(true);
        const query = document.getElementById("search").value;
        const head = document.querySelector('h1');
        if ( !query ){
            return;
        }

        searchResults = await fetchSearchResults(query);
        
        displaySearchResults()
        head.textContent = `Articles related to ${query}`
        displayLoading(false);
    } catch ( err ){
        console.log(err);
    }
}


function handleSearchPageClick(e){
    if ( e.target.className == "page-btn"){
        displaySearchResults(Number(e.target.name));
    }
}

window.addEventListener("load", () => {
    const search = document.getElementById("search-btn");
    const navBtns = document.getElementById("nav-btns");
    search.addEventListener("click", handleSearch);
    navBtns.addEventListener("click", handleCategoricalNews);
});

