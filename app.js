const API = 'https://rickandmortyapi.com/api';

var favoritos = [];
var cardsApi = [];
var cardApi = {};

const getCards = async () => {
    try {
        const response = await fetch(`${API}/character`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.log(error);

    }
};

function chooseRandomElements(array, qty) {
    const chooseElements = [];
    console.log(array)

    // Asegurarse de que la cantidad solicitada sea menor o igual al tamaño del array
    if (qty > array.length) {
        console.error("La cantidad solicitada es mayor que el tamaño del array.");
        return [];
    }

    while (chooseElements.length < qty) {
        // Generar un índice aleatorio
        const randomIndex = Math.floor(Math.random() * array.length);

        // Verificar si este índice ya ha sido elegido previamente
        if (chooseElements.indexOf(array[randomIndex]) === -1) {
            chooseElements.push(array[randomIndex]);
        }
    }

    return chooseElements;
}

const searchCards = async (name) => {
    try {
        const response = await fetch(`${API}/character?name=${name}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.log(error);
    }
};

const cardDetail = async (id) => {
    try {
        const response = await fetch(`${API}/character/${id}`);
        const data = await response.json();
        return data
    } catch (error) {
        console.log(error);
    }
};


        function obtainDetail(id) {
            let loader = document.querySelector('.loader')
            loader.classList.remove('d-none');
            cardApi = cardDetail(id)
                .then(Object => {
                    cardApi = Object;
                    document.querySelector('#errorApi').classList.add('d-none');

                    const cardElement = document.querySelector('#detailModal');
                  
                    cardElement.innerHTML = `
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5 text-dark" id="detailModalLabel">${Object.name}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body py-2">
                                <ul class="list-group mb-2">
                                    <li class="list-group-item"><span class="fw-bold">Genero :</span> ${Object.gender}</li>
                                    <li class="list-group-item"><span class="fw-bold">Id:</span> ${Object.id}</li>
                                    <li class="list-group-item"><span class="fw-bold">Especie:</span> ${Object.species}</li>
                                </ul>
                                <div class="mb-2 d-flex justify-content-center">
                                    <img class="card-img-top w-50" src="${Object.image}" alt="${Object.name}">
                                </div>
                                <p>${Object.status}</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" onclick="addFavorito()" class="btn btn-primary" id="#favotitoButton">Agregar a Favoritos</button>
                            </div>
                        </div>
                    </div>`;

                    loader.classList.add('d-none');

                    const myModal = new bootstrap.Modal('#detailModal', {});
                    myModal.show();
                })
                .catch(error => {
                    console.log(error);
                    loader.classList.add('d-none');
                    document.querySelector('#errorApi').classList.remove('d-none');
                });

        }

function search() {
    console.log(document.querySelector('#search').value)
    cardsApi = searchCards(document.querySelector('#search').value)
        .then(cards => {
            if (cards.length === 0) {
                document.querySelector('#nothingFound').classList.remove('d-none');
                return;
            }else{
                document.querySelector('#nothingFound').classList.add('d-none');
                document.querySelector('.cards').innerHTML = "";
                cards.forEach(Object => {
                    if (!(Object.id === undefined)) {
                        const cardElement = document.createElement('div');
                        cardElement.className = 'card col-2 p-2';
                        cardElement.innerHTML = `
                            <img class="card-img-top" src="${Object.image}" alt="${Object.name}">
                            <h5 class="card-title text-dark">${Object.name}</h5>
                            <p class="card-text text-dark">${Object.type}</p>
                            <button  onclick="obtainDetail(${Object.id})" class="btn btn-primary">Card Detail</button>
                        `;
                        document.querySelector('.cards').appendChild(cardElement);
                    }
                });
            }
        })
        .catch(error => console.log(error))
        .finally(() => console.log('Cards searched loaded'));
}

function addFavorito() {
    favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    console.log(favoritos);
    if (favoritos.length === 0) {
        favoritos.push(cardApi);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        console.log(JSON.parse(localStorage.getItem('favoritos')));
        return;
    }
    favoritos.forEach(favotito => {
        if(favotito.id === cardApi.id){
            alert('Esta carta ya se encuentra en favoritos');
            return;
        }else{
            favoritos.push(cardApi);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            console.log(JSON.parse(localStorage.getItem('favoritos')));
        }
    });
}

function callAllCards(){
    cardsApi = getCards()
        .then(cards => {
            document.querySelector('#errorApi').classList.add('d-none');
            console.log(cards)
            let chooseCards = chooseRandomElements(cards, 10);
            chooseCards.forEach(card => {
                if (!(card.id === undefined)) {
                    const cardElement = document.createElement('div');
                    cardElement.className = 'card col-2 p-2';
                    cardElement.innerHTML = `
                        <img class="card-img-top" src="${card.image}" alt="${card.name}">
                        <h4 class="card-title text-dark">${card.name}</h4>
                        <p class="card-text text-dark">${card.type}</p>
                        <button  onclick="obtainDetail(${card.id})" class="btn btn-primary">Card Detail</button>
                    `;
                    document.querySelector('.cards').appendChild(cardElement);
                }
            });
        })
        .catch(error => {
            document.querySelector('#errorApi').classList.remove('d-none');
            console.log(error)
        })
        .finally(() => console.log('Cards loaded'));
}

function deleteFavorito(id) {
    favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos = favoritos.filter(function(card){
        return  card.id != id;
    });
    console.log(favoritos)
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    showFavoritos();
};

function deleteAllfavoritos() {
    localStorage.setItem('favoritos', JSON.stringify([]));
    showFavoritos();
}

function showFavoritos() {
    favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (favoritos.length === 0) {
        document.querySelector('#nothingFound').classList.remove('d-none');
        document.querySelector('.cards').innerHTML = "";
        return;
    }else{
        document.querySelector('#nothingFound').classList.add('d-none');
        document.querySelector('.cards').innerHTML = "";
        favoritos.forEach(card => {
            const cardElement = document.createElement('div');
                    cardElement.className = 'card col-2 p-2';
                    cardElement.innerHTML = `
                        <img class="card-img-top" src="${card.image}" alt="${card.name}">
                        <h5 class="card-title text-dark>${card.name}</h3>
                        <p class="card-text text-dark">${card.type}</p>
                        <button  onclick="deletefavotito(${card.id})" class="btn btn-danger">Delete</button>
                    `;
                    document.querySelector('.cards').appendChild(cardElement);
        });
    }
};


window.addEventListener('load', () => {

        const route = window.location.pathname;
        if (route.includes('/')) {
            callAllCards();
        }else if (route.includes('favoritos')) {
            showFavoritos();
        }else{
            console.log('no estaria funcionando');
        }
});