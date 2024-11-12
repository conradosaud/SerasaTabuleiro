
let players = [
    { name: "Jogador 1", credit: 1500, warnings: 0, isPlaying: false },
    { name: "Jogador 2", credit: 1500, warnings: 0, isPlaying: false },
    { name: "Jogador 3", credit: 1500, warnings: 0, isPlaying: false },
    { name: "Jogador 4", credit: 1500, warnings: 0, isPlaying: false },
    { name: "Jogador 5", credit: 1500, warnings: 0, isPlaying: false },
    { name: "Jogador 6", credit: 1500, warnings: 0, isPlaying: false },
]
let isAdd = true;
let selectedPlayer = 0;

function start(){

    if( localStorage.getItem("isPlaying") == null )
        localStorage.setItem("isPlaying", 0)

    if( localStorage.getItem("isPlaying") == 1 ){
        document.querySelector("#gameContent").style.display = "block";
        document.querySelector("#gameSettings").style.display = "none";
        document.querySelector(".endGame").style.display = "block";

        loadLocalStorage().then( data => {
            players = data;
            initializeListenners();
            setSelectedPlayer(0);

            document.querySelectorAll(".playerContent").forEach((element, index) => {
                if(players[index].isPlaying == false)
                    element.style.display = "none";
            });

        });

    }else{
        document.querySelector("#gameContent").style.display = "none";
        document.querySelector(".endGame").style.display = "none";
        document.querySelector("#gameSettings").style.display = "block";
    }

}
start();

function startGame( playerCount ){
    localStorage.setItem("isPlaying", 1);
    for(let i = 0; i < playerCount; i++)
        players[i].isPlaying = true;

    saveLocalStorage();
    start();
}

function endGame(){
    localStorage.removeItem("isPlaying");
    localStorage.removeItem("players");
    window.location.reload();
}

function setSelectedPlayer( index ){
    selectedPlayer = index;
    document.querySelector(".creditPlayerName").innerHTML = players[selectedPlayer].name;
    document.querySelectorAll(".playerContent").forEach(element => {
        element.classList.remove("selected");
    });

    document.querySelectorAll(".playerContent")[selectedPlayer].classList.add("selected")
}  


function operationHandle( add ){
    if( add == true ){
        isAdd = true;
        document.querySelector(".operationButtonAdd").classList.add("selectedAdd")
        document.querySelector(".operationButtonSub").classList.remove("selectedSub")

        document.querySelector(".bankerContent").classList.add("bankerAdd")
        document.querySelector(".bankerContent").classList.remove("bankerSub")
        
        document.querySelector(".operationLabel").innerHTML = "Adicionar";
    }else{
        isAdd = false;
        document.querySelector(".operationButtonSub").classList.add("selectedSub")
        document.querySelector(".operationButtonAdd").classList.remove("selectedAdd")

        document.querySelector(".bankerContent").classList.add("bankerSub")
        document.querySelector(".bankerContent").classList.remove("bankerAdd")

        document.querySelector(".operationLabel").innerHTML = "Subtrair";
    }
}

function addValue( value ){
    
    value = isAdd ? value : -value;
    value = parseInt(value);
    console.log(value)
    console.log(players[selectedPlayer].credit)
    players[selectedPlayer].credit += value;
    document.querySelectorAll(".inputCredit")[selectedPlayer].value = parseInt( players[selectedPlayer].credit );

    saveLocalStorage();
}

function addWarning( add, player ){

    if(player != selectedPlayer)
        selectedPlayer = player;

    value = add == true ? 1 : -1;
    players[player].warnings += value;

    if( players[player].warnings >= 3 )
        players[player].warnings = 3
    if( players[player].warnings <= 0 )
        players[player].warnings = 0

    let string = "⚪⚪⚪";
    if(players[player].warnings == 1)
        string = "🔴⚪⚪";
    if(players[player].warnings == 2)
        string = "🔴🔴⚪";
    if(players[player].warnings == 3)
        string = "🔴🔴🔴";

    document.querySelectorAll(".creditWarningValues")[player].innerHTML = string;

    saveLocalStorage();
}

function saveLocalStorage(){
    localStorage.setItem("players", JSON.stringify(players) );
    localStorage.setItem("isPlaying", 1 );
}
function loadLocalStorage(){
    return new Promise((resolve, reject )=> {
        let data = JSON.parse( localStorage.getItem("players") );
        resolve(data)
    })
}


function initializeListenners(){
    try{
        addSelectOnClick();
        setCreditOnBlur();
        setPlayerNameOnBlur();
        loadPlayerValues();
    }catch(e){
        console.log("loading...")
    }
}
function addSelectOnClick(){
    // Add "select" on player on click
    document.querySelectorAll(".playerContent").forEach( (e, index) => {

        e.querySelector(".inputPlayerName").value = players[index].name
    
        e.addEventListener("click", ()=> {
            setSelectedPlayer(index)
        })
    });
}
function setCreditOnBlur(){    
    // Set credit value on blur
    document.querySelectorAll(".inputCredit").forEach( (e, index) => {
        e.addEventListener("blur", ()=> {
            if(isNaN(e.value) == false)
                players[index].credit = parseInt( e.value );
            e.value = players[index].credit
            saveLocalStorage();
        })
    });
}
function setPlayerNameOnBlur(){
    // Set player name on blur
    document.querySelectorAll(".inputPlayerName").forEach( (e, index) => {
        e.addEventListener("blur", ()=> {
            players[index].name = e.value;
            e.value = players[index].name;
            saveLocalStorage();
        })
    });
}
function loadPlayerValues(){
    // Add credit to player on load
    document.querySelectorAll(".inputCredit").forEach( (e, index) => {
        e.value = players[index].credit
    });

    players.forEach((element, index) => {
        addWarning( element.warnings, index )
    });

}