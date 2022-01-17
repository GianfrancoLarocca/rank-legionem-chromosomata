const legionemChromosomataID = ["lzMsqZcfcfxA7GEeLpeYWhm42CP_jBs3RvjakJzitZBjQDo", "jbElwx3cm9db99EH0Oc6T7BbhIgzKUXx9lajLMXcnzI0bog", "-hW7VeVyiK_9nBHVsapkQqxLKh4mBokgdLrVihIXIvX2XEk", "eAca-NOfskRfo3dhnRAqlnRtwyXvAt-_WXhf4SnWdE-A6rc", "1lAGQ3insh9DmslrUSVIVEfMnmchN5Wl3Lo80oMKG74Oq00", "YPiCmq-d2yF_vGhoORnLTYJbbRTQoY7e6tfDAOJMS0TpmqU", "EkSyZiN5fAFgDbSwo6RNlyWf14gAy_VI2om16h5kTG2UPqj8", "b4Fsz9jgQ6wS-N9PAW7uuyW4fPJVHaid4sUjZEXEtzPmHTQ", "_EEnSNRo8ZIB2_oBAcz3nr9MMW78i2i0e2QaIWS38QJMvo0", "w8jcyY7VnHIU877VgecyxWpoEfPEOgokovAAGjUl5gcWPl4"];
const api_key = "RGAPI-4aea90ad-37b4-4333-a5d8-f35f6b99716b";

const sleep = m => new Promise(r => setTimeout(r, m));

const summonerInfo = {
    accountId: [],
    id: [],
    name: [],
    profileIconId: [],
    puuid: [],
    revisionDate: [],
    summonerLevel: [],

    championId: [],
    championLevel: [],
    championPoints: [],

    losses: [],
    queueType: [],
    rank: [],
    tier: [],
    wins: [],
    puntiLega: []
}

const championsInfo = {
    nome: [],
    chiave: [],
    titolo: [],
}

const classifica = [];
const ranked = ["IRON IV", "IRON III", "IRON II", "IRON I", "BRONZE IV", "BRONZE III", "BRONZE II", "BRONZE I", "SILVER IV", "SILVER III", "SILVER II", "SILVER I", "GOLD IV", "GOLD III", "GOLD II", "GOLD I", "PLATINUM IV", "PLATINUM III", "PLATINUM II", "PLATINUM I", "DIAMOND IV", "DIAMOND III", "DIAMOND II", "DIAMOND I"];

async function getChampionName() {

    const risposta = await fetch("https://ddragon.leagueoflegends.com/cdn/9.19.1/data/en_US/champion.json");
    const campioni = await risposta.json();
    const listaCampioni = campioni.data;

    console.log(listaCampioni);

    for (champ in listaCampioni) {
        championsInfo.nome.push(listaCampioni[champ].id);
        championsInfo.chiave.push(+listaCampioni[champ].key);
        championsInfo.titolo.push(listaCampioni[champ].title);
    }
}
console.warn("CHAMPIONS INFO: ", championsInfo)

getChampionName();

setInterval(aggiorna, 1000 * 60 * 3, false);

aggiorna(true);
async function aggiorna(primoAvvio) {

    console.log("FUNZIONE AGGIORNA LANCIATA!!!", primoAvvio);

    let calcoloLanciato = false;
    console.log("CALCOLO LANCIATO!!!", calcoloLanciato);

    for (let i = 0; i < legionemChromosomataID.length; i++) {

        if (primoAvvio == false) {
            document.querySelector("#caricamento").innerHTML = "STO AGGIORNANDO";
        } else {
            document.querySelector("#caricamento").innerHTML = "CARICAMENTO";
        }

        const urls = [
            `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/${legionemChromosomataID[i]}?api_key=${api_key}`,
            `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${legionemChromosomataID[i]}?api_key=${api_key}`,
            `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${legionemChromosomataID[i]}?api_key=${api_key}`
        ];

        urls.forEach(async url => {
            risposta = await fetch(url);
            obj = await risposta.json();
            console.log(obj);

            if (url === urls[0]) {
                console.error("prima risposta!", obj.name);
                summonerInfo.accountId[i] = obj.accountId;
                summonerInfo.id[i] = obj.id;
                summonerInfo.name[i] = obj.name;
                summonerInfo.profileIconId[i] = obj.profileIconId;
                summonerInfo.puuid[i] = obj.puuid;
                summonerInfo.revisionDate[i] = obj.revisionDate;
                summonerInfo.summonerLevel[i] = obj.summonerLevel;
            }
            if (url === urls[1]) {
                console.error("seconda risposta!", obj[0]);
                summonerInfo.championId[i] = obj[0].championId;
                summonerInfo.championLevel[i] = obj[0].championLevel;
                summonerInfo.championPoints[i] = obj[0].championPoints;
            }
            if (url === urls[2]) {
                console.error("terza risposta!");
                if (obj.length > 0 && obj[0].queueType === "RANKED_SOLO_5x5") {
                    console.log(obj[0].tier, obj[0].rank)
                    summonerInfo.losses[i] = obj[0].losses;
                    summonerInfo.queueType[i] = obj[0].queueType;
                    summonerInfo.rank[i] = obj[0].rank;
                    summonerInfo.tier[i] = obj[0].tier;
                    summonerInfo.wins[i] = obj[0].wins;
                    summonerInfo.puntiLega[i] = obj[0].leaguePoints;
                } else {
                    summonerInfo.losses[i] = "valore assente";
                    summonerInfo.queueType[i] = "valore assente";
                    summonerInfo.rank[i] = "valore assente";
                    summonerInfo.tier[i] = "valore assente";
                    summonerInfo.wins[i] = "valore assente";
                }
            }
        });

        await sleep(500);
        if (primoAvvio == true) {
            creazionePagina(i, false, primoAvvio, i + 1);
        }
    }
    if (primoAvvio == false && calcoloLanciato == false) {
        calcoloLanciato = true;
        calcoloClassifica();
    }
}

var postSection;
var postTemplate;

function creazionePagina(i, cond, primoAvvio, numpos) {

    console.log("FUNZIONE CREAZIONE PAGINA LANCIATA!!!", i, cond, primoAvvio);

    console.warn(summonerInfo);

    postSection = document.querySelector('#posts');
    postTemplate = document.querySelector('#post-template');

    //for (let i = 0; i < summonerInfo.accountId.length; i++) {

    const indiceCampione = championsInfo.chiave.indexOf(summonerInfo.championId[i]);

    const nomeCampione = championsInfo.nome[indiceCampione];
    const titoloCampione = championsInfo.titolo[indiceCampione];
    const imgMastery = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${nomeCampione}_0.jpg`;
    const imgIcon = `https://ddragon.leagueoflegends.com/cdn/12.1.1/img/profileicon/${summonerInfo.profileIconId[i]}.png`

    console.log("IMG BUGGATE", summonerInfo.name[i], indiceCampione, nomeCampione, titoloCampione, imgMastery, imgIcon);

    const newPost = document.importNode(postTemplate.content, true);

    const imgChamp = newPost.querySelector('.post__img');
    const icon = newPost.querySelector('#icona');
    const nameSummoner = newPost.querySelector('#nome_summoner');
    const lvlSummoner = newPost.querySelector('#lvl_summoner');
    const nomeLvlCampione = newPost.querySelector('#nome_lvl_campione');
    const titoloChamp = newPost.querySelector('#titolo_campione');
    const puntiChamp = newPost.querySelector('#punti_campione');
    const dati = newPost.querySelector('#dati');

    imgChamp.src = imgMastery;
    icon.src = imgIcon;
    nameSummoner.innerText = `${numpos}\n${summonerInfo.name[i]}`;
    lvlSummoner.innerText = "LVL: " + summonerInfo.summonerLevel[i];
    nomeLvlCampione.innerText = `${nomeCampione} LVL: ${summonerInfo.championLevel[i]}`;
    titoloChamp.innerText = titoloCampione;

    puntiChamp.innerText = summonerInfo.championPoints[i];
    if (summonerInfo.rank[i] != "valore assente") {
        dati.innerText = `${summonerInfo.tier[i]} ${summonerInfo.rank[i]}\n${summonerInfo.puntiLega[i]} punti\n Wins: ${summonerInfo.wins[i]} - Losses: ${summonerInfo.losses[i]}\n`;
        let imgRankSrc = `ranked-emblems/${summonerInfo.tier[i]}.png`;
        let imgRank = document.createElement('img');
        imgRank.src = imgRankSrc;
        imgRank.width = 100;
        imgRank.height = 100;
        imgRank.style.margin = 5;
        dati.appendChild(imgRank);
    } else {
        dati.innerText = "Non ti sei ancora qualificato questa season!!!\n";
        let imgRank = document.createElement('img');
        imgRank.src = `ranked-emblems/clown.png`;
        imgRank.width = 80;
        imgRank.height = 80;
        imgRank.style.margin = 5;
        dati.appendChild(imgRank);
    }

    postSection.appendChild(newPost);

    if (i >= legionemChromosomataID.length - 1 && cond == false) {
        cond = true;
        console.error(`I: ${i} length: ${legionemChromosomataID.length} cond: ${cond}`);
        if (primoAvvio == true) {
            calcoloClassifica();
        }
    }
}

function calcoloClassifica() {

    console.log("FUNZIONE CALCOLO CLASSIFICA LANCIATA!!!");

    const posizionePunti = [];
    let ultimoClassificato = false;

    for (let i = 0; i < legionemChromosomataID.length; i++) {
        posizionePunti.push({
            'posizione': i,
            'punti': ranked.indexOf(`${summonerInfo.tier[i]} ${summonerInfo.rank[i]}`)
        });
    }

    posizionePunti.sort((a, b) => b.punti - a.punti);

    let div = document.querySelectorAll('div');
    div.forEach(elem => elem.remove());
    let caricamento = document.querySelector("#caricamento");
    caricamento.innerHTML = "";

    let numpos = 0;
    posizionePunti.forEach(elem => {
        console.log(elem);
        if (elem.punti >= 0) {
            numpos++;
        }
        if (elem.punti == -1 && ultimoClassificato == false) {
            numpos++;
            ultimoClassificato = true;
        }
        indOrd = elem.posizione;
        creazionePagina(indOrd, true, false, numpos);
    });
}