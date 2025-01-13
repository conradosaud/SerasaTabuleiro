
let players = [
    { name: "Jogador 1", credit: 0, investiment: 0, warnings: 0, isPlaying: false },
    { name: "Jogador 2", credit: 0, investiment: 0, warnings: 0, isPlaying: false },
    { name: "Jogador 3", credit: 0, investiment: 0, warnings: 0, isPlaying: false },
    { name: "Jogador 4", credit: 0, investiment: 0, warnings: 0, isPlaying: false },
    { name: "Jogador 5", credit: 0, investiment: 0, warnings: 0, isPlaying: false },
    { name: "Jogador 6", credit: 0, investiment: 0, warnings: 0, isPlaying: false },
]
let isAdd = true;
let selectedPlayer = 0;

let isCreditSelected = false;

const fees = 0.10;
const income = 0.25;

let isLoading = false;

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
    if( isCreditSelected ){
        players[selectedPlayer].credit += value;
        document.querySelectorAll(".inputCredit")[selectedPlayer].value = parseInt( players[selectedPlayer].credit );
    }else{
        players[selectedPlayer].investiment += value;
        document.querySelectorAll(".inputInvestiment")[selectedPlayer].value = parseInt( players[selectedPlayer].investiment );
    }

    saveLocalStorage();
}

function addIncome(playerIndex){
    let before = players[playerIndex].investiment;
    players[playerIndex].investiment += parseInt( players[playerIndex].investiment * income );
    let after = players[playerIndex].investiment;
    document.querySelectorAll(".inputInvestiment")[selectedPlayer].value = parseInt( players[selectedPlayer].investiment );

    alert("Rendimentos de 25% aplicado à ["+players[playerIndex].name+"]!\nSaldo anterior: "+before+"\nSaldo atual: "+after+"\n\nGanho total: "+(after-before))

}

function addWarning( add, player ){

    isCreditSelected = true;
    document.querySelector(".operationTypeLabel").innerHTML = "crédito";

    if(player != selectedPlayer)
        selectedPlayer = player;

    value = add == true ? 1 : -1;
    players[player].warnings += value;

    if( players[player].warnings >= 3 )
        players[player].warnings = 3
    if( players[player].warnings <= 0 )
        players[player].warnings = 0

    let before = players[player].credit;
    let feesText = 10;

    let newValue = 0;
    let string = "⚪⚪⚪";
    if(players[player].warnings == 1){
        string = "🔴⚪⚪";
        if( add ){
            newValue = players[player].credit * fees * 1;
            feesText = 10;
        }
    }
    if(players[player].warnings == 2){
        string = "🔴🔴⚪";
        if( add ){
            newValue += players[player].credit * fees * 2;
            feesText = 20;
        }
    }
    if(players[player].warnings == 3){
        string = "🔴🔴🔴";
        if( add ){
            newValue += players[player].credit * fees * 3;
            feesText = 30;
        }
    }

    let after =  players[player].credit + parseInt(newValue);
    
    document.querySelectorAll(".creditWarningValues")[player].innerHTML = string;

    if( add && !isLoading )
        alert("Juros de "+feesText+"% aplicado ao crédito de ["+players[player].name+"]!\n Crédito anterior: "+before+"\nCrédito atual: "+after+"\n\nAcréscimos total: "+(after-before))

    addValue(newValue);

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
        isLoading = true;
        setSelectedInputOnClick();
        addSelectOnClick();
        setCreditOnBlur();
        setInvestimentOnBlur();
        setPlayerNameOnBlur();
        loadPlayerValues();
        isLoading = false;
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
function setSelectedInputOnClick(){
    document.querySelectorAll(".inputCredit").forEach( e => {
        e.addEventListener("click", ()=> {
            isCreditSelected = true;
            document.querySelector(".operationTypeLabel").innerHTML = "crédito";
        })
    });
    document.querySelectorAll(".inputInvestiment").forEach( e => {
        e.addEventListener("click", ()=> {
            isCreditSelected = false;
            document.querySelector(".operationTypeLabel").innerHTML = "investimento";
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
function setInvestimentOnBlur(){    
    // Set investiment value on blur
    document.querySelectorAll(".inputInvestiment").forEach( (e, index) => {
        e.addEventListener("blur", ()=> {
            if(isNaN(e.value) == false)
                players[index].investiment = parseInt( e.value );
            e.value = players[index].investiment
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
    // Add investiment to player on load
    document.querySelectorAll(".inputInvestiment").forEach( (e, index) => {
        e.value = players[index].investiment
    });

    players.forEach((element, index) => {
        addWarning( element.warnings, index )
    });

}