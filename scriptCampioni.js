const postSection = document.querySelector('#posts');
const postTemplate = document.querySelector('#post-template');

getAllChampion()
    .catch(err => console.log(err));

async function getAllChampion() {
    const risposta = await fetch("https://ddragon.leagueoflegends.com/cdn/9.19.1/data/en_US/champion.json");
    const campioni = await risposta.json();
    const listaCampioni = campioni.data;

    console.log(listaCampioni);

    let i = 0;

    for (champ in listaCampioni) {
        i++;

        if (i < 500) {
            const title = listaCampioni[champ].name;
            const body = listaCampioni[champ].blurb;
            const url = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${listaCampioni[champ].id.trim()}_0.jpg`;

            const newPost = document.importNode(postTemplate.content, true);
            const postTitle = newPost.querySelector('.post__title');
            const postBody = newPost.querySelector('.post__body');
            const postImg = newPost.querySelector('.post__img');

            postImg.src = url;
            postTitle.innerText = title;
            postBody.innerText = body;
            postSection.appendChild(newPost);


            console.log(listaCampioni[champ].name);
            console.log(listaCampioni[champ].key);
            console.log(listaCampioni[champ].image.full);
            console.log(url)
        }
    }
}