var cardlist = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
var cardSet;
var s,m;
var intervalId;
var cards_num;
var paused=false;
var gameCompleted;
function timer(){
    if(s<10 && m<10){
        document.getElementById('timer').textContent='0'+m+':0'+s;
    }
    else if (s<10){
        document.getElementById('timer').textContent=m+':0'+s;
    }
    else if(m<10){
        document.getElementById('timer').textContent='0'+m+':'+s;
    }
    else{
        document.getElementById('timer').textContent=m+':'+s;
    }
    s++;
    if(s==60){
        s=0;
        m+=1;
    }
}
function shuffleCards() {
    cardSet = cardlist.concat(cardlist);
    for (let i = 0; i < cardSet.length; i++) {
        let j = Math.floor(Math.random() * cardSet.length);
        let temp = cardSet[i];
        cardSet[i] = cardSet[j];
        cardSet[j] = temp;
    }
}

let cardImages = document.querySelectorAll('.middle-section .card');

function startGame() {
        var section = document.getElementsByClassName('sections')[0];
        section.style.visibility = 'visible';
        gameCompleted = false;
        if (intervalId) {
            clearInterval(intervalId);
        }
        cards_num=0;
        document.getElementById('cards-collected').textContent=cards_num;
        s=0;
        m=0;
        shuffleCards();
        for (let i = 0; i < cardSet.length; i++) {
            cardImages[i].src = "cards/" + cardSet[i] + ".jpg";
            cardImages[i].setAttribute('data-card-index', i);  // Set a custom attribute for index
        }
        setTimeout(hideAllImages, 2000);
        intervalId = setInterval(timer, 1000);
    
}

function hideAllImages() {
    for (let i = 0; i < cardSet.length; i++) {
        cardImages[i].src = "cards/background_card.jpg";
    }
}

var image_swipe_counter = [-1, -1];
var image_swiped_index = [-1, -1];

function switchImage(image) {
    if (!gameCompleted) {
        if (image_swipe_counter[0] === -1) {
            image_swiped_index[0] = parseInt(image.getAttribute('data-card-index'));
            image.src = "cards/" + cardSet[image_swiped_index[0]] + ".jpg";
            image_swipe_counter[0]++;
        } else if (image_swipe_counter[1] === -1) {
            image_swiped_index[1] = parseInt(image.getAttribute('data-card-index'));
            image.src = "cards/" + cardSet[image_swiped_index[1]] + ".jpg";
            image_swipe_counter[1]++;
            setTimeout(function() {
                testCards(image_swiped_index[0], image_swiped_index[1]);
            }, 100); // Adjust timing as necessary
        }
    }
}

function testCards(index1, index2) {
    if (cardSet[index1] === cardSet[index2]) {
        cards_num++;
        document.getElementById('cards-collected').textContent=cards_num;
        image_swipe_counter = [-1, -1];
    } else {
        setTimeout(function() {
            cardImages[index1].src = "cards/background_card.jpg";
            cardImages[index2].src = "cards/background_card.jpg";
            image_swipe_counter = [-1, -1];
        }, 1000); // Adjust timing as necessary
    }
    if (cards_num==10){
        clearInterval(intervalId);
        gameCompleted = true;
        alert("Congratulations! You've completed the game succesfully");
    } 
}

function pause(){
    if (!gameCompleted) {
        clearInterval(intervalId);
        paused=true;
        let container = document.querySelector('.middle-section');
        container.classList.add('disabled-container');
    }
    else{
        alert('Game is completed. Cannot pause.')
    }
    
}
function resume(){
    if(!gameCompleted && paused==true){
        intervalId = setInterval(timer, 1000);
        paused=false;
        let container = document.querySelector('.middle-section');
        container.classList.remove('disabled-container');
    }
    if(gameCompleted){
        alert('Game is completed. Cannot resume. Press START GAME to play again')
    }
}

function getRandomQuote() {
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            const quote = data.content;
            const author = data.author;
            document.getElementById('quote').innerHTML = `"${quote}"`;
            document.getElementById('author').innerHTML = `- ${author}`;
        })
        .catch(error => {
            console.error('Error fetching the random quote:', error);
            document.getElementById('quote').innerHTML = 'Too many essays to fetch a quote lead to failure. Please try again later.';
        });
}
getRandomQuote();