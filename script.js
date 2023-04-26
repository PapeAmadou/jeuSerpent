var serpent;
var pomme;
window.onload=function(){
    var canvasWidth=900;
    var canvasHeight=300;
    var blockSize=30;
    var ctx;
    var delay=100;
    var widthInBlocks=canvasWidth/blockSize;
    var heightInBlocks=canvasHeight/blockSize;
    var score;
    var timeOut;

    
    
    init();
    function init(){
        var canvas=document.createElement('canvas');
        canvas.width=canvasWidth;
        canvas.height=canvasHeight;
        canvas.style.border="30px solid gray";
        canvas.style.margin="50 px auto";
        canvas.style.display="block"
        canvas.style.backgroundColor="#ddd"
        document.body.appendChild(canvas);
        ctx=canvas.getContext('2d');
        serpent=new Snake([[6,4], [5,4], [4, 4], [3,4],[2,4]],"right");
        pomme=new Apple([5,5]);
        score=0;
        refreshCanvas();
    }
    function refreshCanvas(){
        serpent.advance();
        if(serpent.checkCollision()){
            gameOver()
        }
        else{
            if(serpent.isEatingApple(pomme)){
                score++;
                serpent.ateApple=true;
                do{
                    pomme.setNewPosition();
                }
                while(pomme.isOnSnake(serpent));
                
                
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            serpent.draw();
            pomme.draw();
            
            timeOut=setTimeout(refreshCanvas,delay);
        }
        
    }
    function gameOver(){
        ctx.save();
        ctx.font="bold 400 px sans-serif"
        ctx.fillStyle="#000";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.strokeStyle="white";
        ctx.lineWidth=5;
        var centerX=canvasWidth/2;
        var centerY=canvasHeight/2;
        ctx.strokeText("Game over",centerX,centerY-130 );
        ctx.fillText("Game over",centerX,centerY-130 );
        ctx.font="bold 200 px sans-serif"
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer",centerX,centerY-120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer",centerX,centerY-120);
        ctx.restore();
    }
    function drawScore(){
        ctx.save();
        ctx.font="bold 1000 px sans-serif"
        ctx.fillStyle="gray";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        var centerX=canvasWidth/2;
        var centerY=canvasHeight/2;
        ctx.fillText(score.toString(),centerX,centerY );
        ctx.restore();
    }
    
    function drawBlock(ctx,position){
        var x=position[0]*blockSize;
        var y=position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
    function Snake(body, direction){
        this.body=body;
        this.direction=direction;
        this.ateApple=false;
        this.draw=function(){
            ctx.save();
            ctx.fillStyle='#ff0000';
            for(var i=0;i<this.body.length;i++){
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();

        }
        this.advance=function(){
            var nexPosition=this.body[0].slice();
            switch(this.direction){
                case "left":
                    nexPosition[0]-=1;
                    break;
                case "right":
                    nexPosition[0]+=1;
                    break;
                case "down":
                    nexPosition[1]+=1;
                    break;
                case "up":
                    nexPosition[1]-=1;
                    break;
                default:
                    throw("Invalid direction");
                
            }
            this.body.unshift(nexPosition);
            if(!this.ateApple)
                this.body.pop();
            else 
                this.ateApple=false;

        }
    this.setDirection=function(newDirection){
        var allowdDirections;
        switch(this.direction){
            case "left":
            case "right":
                allowdDirections=["up","down"];
                break;
            case "up":
            case "down":
                allowdDirections=["right","left"];
                break;
            default:
                throw("Invalid direction");

        }
        if(allowdDirections.indexOf(newDirection)>-1){
            this.direction=newDirection;
        }
    }
    this.checkCollision=function(){
        var wallCollision=false;
        var snakeCollision=false;
        var head =this.body[0];
        var rest=this.body.slice(1);
        var snakeX=head[0];
        var snakeY=head[1];
        var minX=0;
        var minY=0;
        var maxX=widthInBlocks-1;
        var maxY=heightInBlocks-1;
        var isNotBetweenHorizontalWalls=snakeX<minX || snakeX>maxX ;
        var isNotBetweenVerticalWalls= snakeY<minY || snakeY>maxY;
        if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
            wallCollision=true;
        }

        for(var i=0;i<rest.length;i++){
            if(snakeX===rest[i][0] && snakeY===rest[i][1]){
                snakeCollision=true;
            }
        }
        return wallCollision || snakeCollision;
    }
    this.isEatingApple=function(appleToEat){
        var head=this.body[0];
        if(head[0]===appleToEat.position[0] && head[1]===appleToEat.position[1]){
            return true;
        }
        else{
            return false;
        }

    }
    }
    function Apple(position){
        this.position=position;
        this.draw=function(){
            ctx.save();
            ctx.fillStyle="#33cc33";
            ctx.beginPath();
            var radius=blockSize/2;
            var x=this.position[0]*blockSize + radius;
            var y=this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition=function(){
            var newX=Math.round(Math.random()*(widthInBlocks-1));
            var newY=Math.round(Math.random()*(heightInBlocks-1));
            this.position=[newX,newY];
        }
        this.isOnSnake=function(snakeToCheck){
            var isOnSnake=false;
            for(var i=0; i<snakeToCheck.body.length;i++){
                if(this.position[0]===snakeToCheck.body[i][0] && this.position[1]===snakeToCheck.body[i][1]){
                    isOnSnake=true;
                }
            }
            return isOnSnake;
        }
    }

    document.onkeydown=function handleKeyDown(e){
    
        function restart(){
            
            serpent=new Snake([[6,4], [5,4], [4, 4], [3,4],[2,4]],"right");
            pomme=new Apple([5,5]);
            score=0;
            clearTimeout(timeOut);
            refreshCanvas();
        }
        
        var clef = e.code;
        var newDirection;
        switch(clef) {
        case 'ArrowLeft':
        case 'Left':
        case 37:
            newDirection = 'left';
            break;
        case 'ArrowUp':
        case 'Up':
        case 38:
            newDirection = 'up';
            break;
        case 'ArrowRight':
        case 'Right':
        case 39:
            newDirection = 'right';
            break;
        case 'ArrowDown':
        case 'Down':
        case 40:
            newDirection = 'down';
            break;
        case '':
        case 'Space':
        case 32:
            restart();
            return;
        default:
            return;
            
        
        }
        serpent.setDirection(newDirection);
    }    
    
}


