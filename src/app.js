/* eslint-disable no-console */
// app.js

console.log('app starting...');

var CONST = {
  BOARD_SIZE: 12,
  CARDS_PER_ROW: 4,

  CARD_INVISIBLE: 'oi oi-aperture text-primary',
  CARD_PAIR_FOUND: 'oi oi-check text-success',

  GAME_STATE_NO_TURNED_CARD: 0,
  GAME_STATE_ONE_TURNED_CARD: 1,
  GAME_STATE_TWO_TURNED_CARD: 2,
  GAME_STATE_GAME_OVER: 3,

  CARD_STATE_IN_GAME: 0,
  CARD_STATE_GAME_OVER: 1,

  CARD_TURN_TIME: 1000,

  // Score points
  POINTS_PER_CARD: 20,
  POINTS_PER_SECOND: 10,  // points lost per second
  POINTS_PER_TURN: 8      // points lost per turn
};

var MemoryCard = function(id, gameController) {
  var that = this;
  this.id = id;
  this.iconClass = '';
  this.gameController = gameController;
  this.state = CONST.CARD_STATE_IN_GAME;

  this.onClickHandler = function () {
    var id = that.id.substr(5);
    console.log('Clicked: ' + that.id + ' state: ' 
                + that.state);
    if (that.state == CONST.CARD_STATE_IN_GAME) {
      that.gameController.turnCard(id);
    }
    else {
      console.log('Card ' + id + ' is no longer playable');
    }
  };

  this.turnVisible = function () {
    var id = this.id.substr(5);
    document.getElementById('span-' + id).className = this.iconClass;
    //document.getElementById('span-' + id).className += ' text-primary';
    document.getElementById('span-' + id).className = this.iconClass +
            ' animated flipInX';
  };
  
  this.turnInvisible = function () {
    var id = this.id.substr(5);
    document.getElementById('span-' + id).className = CONST.CARD_INVISIBLE +
            ' animated flipInX';
    document.getElementById('span-' + id).className = CONST.CARD_INVISIBLE;
    //document.getElementById('span-' + id).className += ' text-primary';
  };

  this.turnGameOver = function() {
    var id = this.id.substr(5);
    document.getElementById('span-' +id).className = CONST.CARD_PAIR_FOUND +
            ' text-primary animated flipInX';
    $('#card-'+id).css('background-color', 'lightgreen');
    this.setCardState(CONST.CARD_STATE_GAME_OVER);
  };

  this.getIconClass = function() {
    return this.iconClass;
  };
  
  this.setIconClass = function(icon) {
    this.iconClass = icon;

    // UNCOMMENT NEXT TWO LINES FOR DEBUG PURPOSES
    // var id = this.id.substr(5);
    // document.getElementById('span-' +id).className = icon;
  };

  this.setCardState = function(state) {
    this.state = state;
  };
};

var MemoryGame = function (size, cardsPerRow) {
  var that = this;

  this.numberOfCards = size;
  this.cardsPerRow = cardsPerRow;
  this.state = CONST.GAME_STATE_NO_TURNED_CARD;
  this.firstCard = -1;
  this.secondCard = -1;

  this.startTime = -1;
  this.playTime = 0;
  this.turns = 0;
  this.foundPairs = 0;
  this.cards = [];
  this.usedIcons = []; // store used icons to prevent duplicates
  
  this.initialize = function() {
    this.createDivs();
    this.setEventListeners();
    this.setIconClassToCards();
  };

  this.getNextUnitializedIconClass = function(x) {
    var index;
    for (index = 0; index < this.numberOfCards; index++) {
      if (that.cards[(x+index) % this.numberOfCards].getIconClass() == '') {
        return((x+index) % this.numberOfCards);
      }
    }
    console.log('You are not supposed to be here');
    return 0;
  };
  
  /* eslint-disable no-undef */
  this.getNextUnitializedIcon = function(xIcon) {

    // Loop until unused icon is found
    for (let index = 0; index < ICONNAMES.length; index++) {
      // If icon isn't already used: add it to the usedIcons array and return index
      if (!this.usedIcons.includes(ICONNAMES[(xIcon+index) % ICONNAMES.length])) {
        this.usedIcons.push(ICONNAMES[(xIcon+index) % ICONNAMES.length]);
        return (xIcon+index) % ICONNAMES.length;
      } 
    }

    console.log('You are not supposed to be here');
    return 0;
  };

  this.setIconClassToCards = function() {
    var i;
    var icon;
    var x, y;

    for (i = 0; i < this.numberOfCards/2; i++) {
      console.log(i);
      icon = Math.floor(Math.random() * ICONNAMES.length);
      x = Math.floor(Math.random() * this.numberOfCards);
      y = Math.floor(Math.random() * this.numberOfCards);
      console.log(icon + ' ' + x + ' ' + y);

      icon = this.getNextUnitializedIcon(icon);

      x = this.getNextUnitializedIconClass(x);
      this.cards[x].setIconClass(ICONNAMES[icon]);
      
      y = this.getNextUnitializedIconClass(y);
      this.cards[y].setIconClass(ICONNAMES[icon]);

      console.log('Icon ' + ICONNAMES[icon] + ' set to ' + x + ' and ' + y);
    }
  };
  /* eslint-disable no-undef */
  
  this.setEventListeners = function() {
    var i;
    var cardId = '';

    for (i = 0; i < this.numberOfCards; i++) {
      cardId = 'card-'+i;
      this.cards[i] = new MemoryCard(cardId, this);
      console.log(cardId);
      document.getElementById(cardId).
        addEventListener('click', this.cards[i].onClickHandler);
    }
    console.log(this.cards);
  };
  
  //#region HTML elements
  this.createRow = function(id) {
    var divRow;
    divRow = document.createElement('div');
    divRow.id = 'row-'+id;
    divRow.className = 'row';
    return divRow;
  };
  
  this.createCard = function(id) {
    var divCard;
    divCard = document.createElement('div');
    divCard.id = 'card-'+id;
    divCard.className = 'col-sm card';
    return divCard;
  };
  
  this.createCardBody = function() {
    var divCardBody;
    divCardBody = document.createElement('div');
    divCardBody.className = 'card-body';
    return divCardBody;
  };
  
  this.createIcon = function(id) {
    var iconSpan;
    iconSpan = document.createElement('span');
    iconSpan.id = 'span-'+id;
    iconSpan.className = CONST.CARD_INVISIBLE;
    return iconSpan;
  };

  
  this.createDivs = function() {
    var row;
    var column;
    var cardId = 0;
    var cardIndex = 0;
    
    var rowElement;
    var cardElement;
    var cardBodyElement;
    var iconElement;
    
    for (row = 0; row < this.numberOfCards/this.cardsPerRow; row++) {
      rowElement = this.createRow(row);
      for (column = 0; column < this.cardsPerRow; column++) {
        cardId = cardIndex; //(row + (column*this.cardsPerRow));
        cardElement = this.createCard(cardId);
        cardBodyElement = this.createCardBody();
        iconElement = this.createIcon(cardId);
        
        cardBodyElement.appendChild(iconElement);
        cardElement.appendChild(cardBodyElement);
        rowElement.appendChild(cardElement);

        cardIndex++;
      }
      document.getElementById('game-content').appendChild(rowElement);
    }
  };
  //#endregion

  this.setPlayTime = function() {
    if (this.state == CONST.GAME_STATE_GAME_OVER) {
      return;
    }
    if (this.startTime > 0){
      this.playTime = new Date().getTime() - this.startTime;
    }
  };
  
  // Update progress bar to indicate game progress
  this.updateProgress = function() {
    var progress = (this.foundPairs*2/this.numberOfCards) * 100;
    $('#progress-bar').attr(
      'style', ('width:' + progress + '%')
    );
  };
    
  
  this.turnCard = function(id) {
    console.log('Turning card: ' +id);

    //#region Timer
    if (this.startTime == -1) {
      // Start timer
      this.startTime = new Date().getTime();
    }

    else if (this.startTime > 0) {
      this.setPlayTime();
    }
    //#endregion
    
    if (this.state == CONST.GAME_STATE_NO_TURNED_CARD) {
      this.cards[id].turnVisible();
      this.firstCard = id;
      this.state = CONST.GAME_STATE_ONE_TURNED_CARD;
    }
    
    else if (this.state == CONST.GAME_STATE_ONE_TURNED_CARD) {
      if (id == this.firstCard) return;
      this.cards[id].turnVisible();
      this.secondCard = id;
      this.state = CONST.GAME_STATE_TWO_TURNED_CARD;
      this.turns++;
      
      // Check pairs
      if (this.cards[this.firstCard].getIconClass() ==
      this.cards[this.secondCard].getIconClass()) {
        // Pair found
        that.cards[this.firstCard].turnGameOver();
        that.cards[this.secondCard].turnGameOver();
        this.state = CONST.GAME_STATE_NO_TURNED_CARD;
        this.foundPairs++;
        this.updateProgress();
        
        // End game if all pairs have been found
        if (this.cards.length == this.foundPairs * 2) {
          that.state = CONST.GAME_STATE_GAME_OVER;
          setTimeout(() => this.endGame(), 500);
        }
      }
      
      else{
        setTimeout(function(){
          that.cards[that.firstCard].turnInvisible();
          that.cards[that.secondCard].turnInvisible();
          that.state = CONST.GAME_STATE_NO_TURNED_CARD;
        }, CONST.CARD_TURN_TIME);
        
      }
    }
  };
  
  this.endGame = function() {
    // Calculate score
    var cardBonus = CONST.BOARD_SIZE * CONST.POINTS_PER_CARD;
    var timeBonus = (100 - Math.floor(memoryGame.playTime / 1000))
            * CONST.POINTS_PER_SECOND;
    var turnBonus = (50 - this.turns) * CONST.POINTS_PER_TURN;
    var score = cardBonus + timeBonus + turnBonus;
    var highscore = 0;

    // Get highscore from local storage if it exist
    if (localStorage.highscore) {
      highscore = localStorage.highscore;
    }
    else {
      // Add highscore variable to local storage
      localStorage.highscore = 0;
    }

    // Compare score to highscore
    if (score > highscore) {
      localStorage.highscore = score;
      $('.modal-title').text('Game Comleted - NEW HIGHSCORE!');
    }

    // Update score window text
    $('#player-score-1').text('Playtime: ' + (Math.floor(that.playTime / 1000))
          + ' s - Turns: ' + this.turns);
    $('#player-score-2').text('Your score: ' + score + ' points');
    $('#high-score').text('Highscore: ' + localStorage.highscore + ' points');

    // Show score window
    $('#highScoreModal').modal('show');
    // Refresh page if play again button is pressed
    $('#Again').on('click', () => location.reload(true));
  };
  
};

var memoryGame = new MemoryGame(CONST.BOARD_SIZE, CONST.CARDS_PER_ROW);
var playTimeElement = document.getElementById('play-time');
var turnCountElement = document.getElementById('turn-count');

memoryGame.initialize();

setInterval(function() {
  memoryGame.setPlayTime();
  playTimeElement.innerHTML = 'Playtime: ' + Math.floor(memoryGame.playTime / 1000) + ' s';
  turnCountElement.innerHTML = 'Turns: ' + memoryGame.turns;
  //console.log(memoryGame.state);
}, 1000);