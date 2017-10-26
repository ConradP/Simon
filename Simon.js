buttons=['green','red','yellow','blue'];
PlayerSequence = [];
MemorySequence = [];
var level,score;

function _unBlink(button,oldColor){
	button.css('color',button.attr('id'));
	button.css('background-color',oldColor);
}
function blink(button){
	var oldColor = button.css('background-color');
	button.css('color','black').css('background-color',button.attr('id'));
	setTimeout(function(){_unBlink(button,oldColor)},500);
}


buttons.forEach((element)=>{
	$('#body').append($('<input>').attr('id',element).addClass('button').addClass(element).click(
		(event)=>{
			blink($(event.target));
			userChoice($(event.target),MemorySequence[PlayerSequence.length]).then((resolve)=>{
				$('#score').text(++score);
				$('#status').text('');
				if(PlayerSequence.length==MemorySequence.length){
					PlayerSequence = [];
					_round();
				}
			},(reject)=>{
				console.log(reject);
				$('#status').text(reject);
				score = score - (PlayerSequence.length+1);
				$('#score').text(++score);
				_gameOver();

			})
		}).prop('token',element).css("color",element).prop('disabled',true));
})

$('#body').append($('<button></button').attr('id','start').click(
	(event)=>{
		PlayerSequence = [];
		MemorySequence = [];
		score = 0;
		level = 0;
		$('#score').text(0);
		$('#status').text('');
		_round();
		$('#start').prop('disabled',true);
	}).text('start').addClass('button'));


function userChoice(button,actual){
	return new Promise((resolve,reject)=>{
			console.log('entering userChoice('+button+','+actual);
			console.log('PlayerSequence: '+PlayerSequence);
			console.log('MemorySequence: ' + MemorySequence);
			if (button.prop('token') ==actual.prop('token')){
				PlayerSequence.push(button);
				_readSequence(PlayerSequence);
				resolve('correct choice');
			}else{
				reject('Game Over');
			}
		})
}

function _gameOver(){
	$('#start').prop('disabled',false);
}

function _getRandomButton(){
	var index = Math.floor(Math.random()*4);
	var buttonTag = buttons[index];
	var button = $('#'+buttonTag);
	return button;
}

function _round(){
	MemorySequence.push(_getRandomButton());
	level++;
	_play(MemorySequence);
}

function _lockButtons(){
	buttons.forEach((element)=>{
			$('#'+element).prop('disabled',true);
		});
}

function _unlockButtons(){
	buttons.forEach((element)=>{
		$('#'+element).prop('disabled',false);
	})
}


function _play(Sequence){
	var index = 0;
	_lockButtons();
	var interval = setInterval(function(){
		blink(Sequence[index]);
		index++;
		if(index>level-1){
			clearInterval(interval);
			_unlockButtons();
		}
	},1000)
}

function _readSequence(Sequence){
	Sequence.forEach((element)=>{
		console.log(element);
	})
}


