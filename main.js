document.addEventListener('DOMContentLoaded', () => {  
    const navItems = document.querySelectorAll('.nav-item a');  
    const gameInfo = document.getElementById('game-info');  
    const detailsContent = document.getElementById('detailsContent');
    const detailsSection = document.querySelector('.details'); 
    const btnClose = document.getElementById('btnClose');
    const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games';  
    const options = {  
        method: 'GET',  
        headers: {  
            'x-rapidapi-key': 'bb1e689643msh9452e03265a6bd5p1c39fajsncabb04c313fb',  
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'  
        }  
    };  

    navItems.forEach(item => {  
        item.addEventListener('click', (event) => {  
            event.preventDefault(); 
            const category = item.getAttribute('data-category');  
            fetchGames(category);  

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });  
    });  

    async function fetchGames(category) {  
        try {  
            const response = await fetch(url, options);  
            if (!response.ok) {  
                throw new Error(`HTTP error! status: ${response.status}`);  
            }  
            const result = await response.json();  
            displayGames(result, category);  
        } catch (error) {  
            console.error('Error fetching games:', error);  
        }  
    }

    function displayGames(games, category) {  
        gameInfo.innerHTML = '';  
        const filteredGames = games.filter(game => game.genre.toLowerCase() === category.toLowerCase());  
        
        if (filteredGames.length === 0) {  
            gameInfo.innerHTML = '<p class="errormssg">No games found in this category.</p>';  
            return;  
        }  
    
        filteredGames.forEach(game => {  
            const gameCard = `  
                <div class="col">  
                    <div data-id="${game.id}" class="card h-100 bg-transparent game-card" role="button">  
                        <div class="card-body">  
                            <figure class="position-relative">  
                                <img src="${game.thumbnail}" alt="gameimg" class="card-img-top object-fit-cover h-100">  
                            </figure>  
                            <figcaption>  
                                <div class="hstack justify-content-between">  
                                    <h3 class="small">${game.title}</h3>  
                                    <span class="badge p-2">Free</span>  
                                </div>  
                                <p class="card-text small text-center opacity-50">  
                                    ${game.short_description.split(" ", 8).join(" ")}...  
                                </p>  
                            </figcaption>  
                        </div>  
                        <footer class="card-footer hstack justify-content-between">  
                            <span class="badge badge-col">${game.genre}</span>  
                            <span class="badge badge-col">${game.platform}</span>  
                        </footer>  
                    </div>  
                </div>  
            `;  
            gameInfo.innerHTML += gameCard;  
        });  

        document.querySelectorAll('.game-card').forEach(card => { 
            card.addEventListener('click', () => { 
                const gameId = card.getAttribute('data-id');
                const game = filteredGames.find(g => g.id == gameId); 
                displayGameDetails(game); 
            }); 
        }); 
    }

    function displayGameDetails(game) {
        detailsContent.innerHTML = `
            <div class="col-md-4">
                <img src="${game.thumbnail}" class="w-100" alt="image details" />
            </div>
            <div class="col-md-8">
                <h3>Title: ${game.title}</h3>
                <p>Category: <span class="badge"> ${game.genre}</span> </p>
                <p>Platform: <span class="badge"> ${game.platform}</span> </p>
                                <p>Status: <span class="badge"> ${game.status}</span> </p>
                <p class="small">${game.short_description}</p>
                <a class="btn btn-outline-warning" target="_blank" href="${game.game_url}">Show Game</a>
            </div>
        `;


        detailsSection.classList.remove('d-none'); 
        document.querySelector(".games").classList.add('d-none');
    }


    btnClose.addEventListener('click', () => {
        detailsSection.classList.add('d-none');
        document.querySelector(".games").classList.remove('d-none');
    });

    fetchGames('mmorpg');
});


