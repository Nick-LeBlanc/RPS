let webSocket = new WebSocket('ws://localhost:7878/');

const win = false;


const disconnect = document.getElementById("button2");
disconnect.onclick = function testfunc(){
    webSocket.close();
    disconnect.disabled = true;
}


webSocket.addEventListener('message', (sendevent) => {
        if(sendevent.data == "Waiting for another player<br>"){
            document.getElementById("ans").innerHTML = ""
            document.getElementById("rock").innerHTML = ""
            document.getElementById("paper").innerHTML = ""
            document.getElementById("scissors").innerHTML = ""
            document.getElementById("input").innerHTML += sendevent.data;
        }
        if(sendevent.data.includes("connected to room:")){
            console.log("connected")
            document.getElementById("input").innerHTML += sendevent.data;
            document.getElementById("ans").innerHTML = ""
            document.getElementById("rock").innerHTML = "rock"
            document.getElementById("paper").innerHTML = "paper"
            document.getElementById("scissors").innerHTML = "scissors"
        }
        if((sendevent.data === "rock" || sendevent.data === "paper" || sendevent.data === "scissors")
        && choices.opp === null){
            targetProxy.opp = sendevent.data;
            
        }
        if((sendevent.data === "rock" || sendevent.data === "paper" || sendevent.data === "scissors")
        && choices.you === null){
            webSocket.send("Waiting for other player");
            targetProxy.opp = sendevent.data;
            
        }
        if(sendevent.data === "you lose"){
            console.log("you win"); 
        }
        if(sendevent.data === "you win"){
            console.log("you lose"); 
        }
})

const rock = document.getElementById("rock");
const paper = document.getElementById("paper");
const scissors = document.getElementById("scissors");

function select(input){
    input.onclick= () =>{
        rock.disabled =true;
        paper.disabled =true;
        scissors.disabled =true;
        const answer = document.getElementById("ans");
        switch (input) {
            case rock:
                answer.innerHTML = "You Chose Rock";
                webSocket.send("rock");
                targetProxy.you = "rock";
            break;
            case paper:
                answer.innerHTML = "You Chose Paper";
                webSocket.send("paper");
                targetProxy.you = "paper";
            break;
            case scissors:
                answer.innerHTML = "You Chose Scissors";
                webSocket.send("scissors");
                targetProxy.you = "scissors";
            break;
        
            default:
                break;
        }
    }
}

select(rock)
select(paper)
select(scissors)


let choices = {
    you:null,
    opp:null
};
var targetProxy = new Proxy(choices, {
  set: function (target, key, value) {
      target[key] = value;
    //   console.log(choices);
      if(choices.you !== null && choices.opp !==null){
        //tie state
        if(choices.you === choices.opp){
            rock.disabled =false;
            paper.disabled =false;
            scissors.disabled =false;
            document.getElementById("ans").innerHTML = "It's a tie, you both chose " + choices.you;
            choices.you = null;
            choices.opp = null;
            webSocket.send("tie");
        }

        //winning states
        if(choices.you === "rock"){
            if(choices.opp  == "paper"){
                webSocket.send("you lose");
                document.getElementById("ans").innerHTML = 
                "You Lose<br>You Chose Rock<br>Opponent chose Paper";
            }
            if(choices.opp  == "scissors"){
                webSocket.send("you win");
                document.getElementById("ans").innerHTML = 
                "You win<br>You Chose Rock<br>Opponent chose Scissors";
            }
        }
        if(choices.you === "paper"){
            if(choices.opp  == "scissors"){
                webSocket.send("you lose");
                document.getElementById("ans").innerHTML = 
                "You Lose<br>You Chose Paper<br>Opponent chose Scissors";
            }
            if(choices.opp  == "rock"){
                webSocket.send("you win");
                document.getElementById("ans").innerHTML = 
                "You win<br>You Chose Paper<br>Opponent chose Rock";
            }
        }
        if(choices.you === "scissors"){
            if(choices.opp  == "rock"){
                webSocket.send("you lose");
                document.getElementById("ans").innerHTML = 
                "You Lose<br>You Chose Scissors<br>Opponent chose Rock";
            }
            if(choices.opp  == "paper"){
                webSocket.send("you win");
                document.getElementById("ans").innerHTML = 
                "You win<br>You Chose Scissors<br>Opponent chose Paper";
            }
        }
      }
      return true;
  }
});