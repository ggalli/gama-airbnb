let allPlaces = [];
let cardsContainer = document.querySelector('.cards-container');
let loading = document.querySelector('.loading-container');
let loadMoreBtn = document.querySelector('.load-more');

window.onload = async () => {
    await getProperties();

    setTimeout(function () {
        mountCards(allPlaces.slice(0, 8))
        loading.style.display = 'none';
        loadMoreBtn.style.display = 'block'
    }, 2000);
}

let getProperties = async () => {
    loading.style.display = 'flex';
    cardsContainer.appendChild(loading);

    let result = await fetch('https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72')
    let places = await result.json();
    allPlaces = places;
}

function mountCards(places, isFiltering) {

    if (isFiltering)
        cardsContainer.innerHTML = '';

    places.forEach(item => {
        let card = document.createElement('div');
        card.className = 'card';

        let imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        let content = document.createElement('div');
        content.className = 'content';

        let img = document.createElement('img');
        img.src = item.photo;

        let title = document.createElement('h3');
        title.innerHTML = item.name;

        let type = document.createElement('span');
        type.className = 'type';
        type.innerHTML = item.property_type;

        let price = document.createElement('span');
        price.className = 'price';
        price.innerHTML = `R$${item.price}`;

        // let favorite = document.createElement('')

        imgContainer.appendChild(img)

        content.appendChild(title);
        content.appendChild(type);
        content.appendChild(price);

        card.appendChild(imgContainer);
        card.appendChild(content);

        cardsContainer.appendChild(card);

    });
}

loadMoreBtn.onclick = (ev) => {
    ev.preventDefault();
    let cards = document.querySelectorAll('.card');
    let newPlaces = allPlaces.slice(cards.length, cards.length + 8)

    if (cards.length + newPlaces.length == allPlaces.length) {
        loadMoreBtn.style.display = 'none';
    }

    return mountCards(newPlaces);
}

let filterBtn = document.querySelector('button.search');
filterBtn.onclick = ev => {
    ev.preventDefault();

    let select = document.querySelector("input[name='property']:checked");
    let searchTerm = select.nextElementSibling.innerText;

    filter(searchTerm);
}

function filter(searchTerm) {
    if(searchTerm == 'O que você está procurando?')
        return mountCards(allPlaces, true);
        
    let filteredPlaces = allPlaces.filter(item => {
        return item.property_type == searchTerm;
    });

    mountCards(filteredPlaces, true);

    loadMoreBtn.style.display = 'none';
}