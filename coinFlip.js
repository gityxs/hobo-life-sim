document.addEventListener("alpine:init", () => {
    Alpine.store("coinFlip", {
        isVisible: false,
        choice: null,
        timerWidth: 100,
        outcome: null,
        start() {
            Alpine.store('utils').playSFX('sfx/miniGameAlert.mp3');
            Alpine.store('utils').player.play();
            Alpine.store('utils').player.gotoTrack(3);

            this.choice = null;
            this.outcome = null;
            this.isVisible = true;
            this.timerWidth = 100;
            document.getElementById("coinImage").src = "images/quarterFront.png";
            document.getElementById("jumpscareText").innerHTML = "Think Fast!";
            document.getElementById("jumpscareText").classList.add("jumpscareText");
            document.getElementById("jumpscareText").style.color = "white";
            const duration = Math.floor(Math.random() * 3000) + 1000;
            const startTime = performance.now();
        
            const tick = (now) => {
                const elapsed = now - startTime;
                const remaining = Math.max(0, duration - elapsed);
                const progress = elapsed / duration;
        
                // Update width
                this.timerWidth = 100 - (progress * 100);
        
                // Stop if complete
                if (elapsed >= duration) {
                    this.timerWidth = 0;
                    this.choice = Math.random() < 0.5 ? "heads" : "tails";
                    this.outcome = Math.random() < 0.5 ? "heads" : "tails";
                    console.log('player has not chosen - a choice will be made for them', this.choice, this.outcome);
                    this.flipCoin();
                } 
                else if(this.choice !== null){
                    console.log('player has chosen', this.choice);
                    this.outcome = Math.random() < 0.5 ? "heads" : "tails";
                    this.flipCoin();
                }
                else {
                    requestAnimationFrame(tick);
                }
            };
        
            requestAnimationFrame(tick);
        },
        flipCoin() {
            console.log("flipCoin");
            const audio = new Audio('sfx/coinFlipLoop.mp3');
            //loop the audio
            audio.loop = true;
            audio.play();
            const duration = Math.floor(Math.random() * 2500) + 1000;
            const startTime = performance.now();
            const coinImage = document.getElementById("coinImage");
        
            const totalFlips = 150;
            const isHeads = this.outcome === "heads"; // use the actual outcome
            const finalAngle = isHeads ? 0 : 180;
            const totalRotation = totalFlips * 360 + finalAngle;
        
            const flip = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const rotation = progress * totalRotation;
        
                coinImage.style.transform = `rotateX(${rotation}deg)`;
        
                const angle = rotation % 360;
                coinImage.src = (angle < 90 || angle > 270)
                    ? "images/quarterFront.png"
                    : "images/quarterBack.png";
        
                if (progress < 1) {
                    requestAnimationFrame(flip);
                } else {
                    audio.pause();
                    Alpine.store('utils').player.stop();
                    console.log("Result:", isHeads ? "heads" : "tails");
                    //if player won, show 'You Win!'
                    //if player lost, show 'You Lose!'
                    if(this.choice === this.outcome){
                        document.getElementById("jumpscareText").innerHTML = "You Win!";
                        document.getElementById("jumpscareText").classList.remove("jumpscareText");
                        document.getElementById("jumpscareText").style.color = "green";
                        //give the player a random amount of money between 1 and 100
                        const data = Alpine.store("data");
                        data.player.money += Math.floor(Math.random() * 30) + 1;
                        Alpine.store('utils').playSFX('sfx/success.mp3');
                    }
                    else{
                        document.getElementById("jumpscareText").innerHTML = "You Lose!";
                        document.getElementById("jumpscareText").classList.remove("jumpscareText");
                        document.getElementById("jumpscareText").style.color = "red";
                        //take a random amount of money between 1 and 100 from the player
                        const data = Alpine.store("data");
                        data.player.money -= Math.floor(Math.random() * 50) + 1;
                        Alpine.store('utils').playSFX('sfx/fail.mp3');
                    }
                    // Snap to final clean state
                    coinImage.style.transition = "transform 0.3s ease";
                    coinImage.style.transform = `rotateX(${finalAngle}deg)`;
                    coinImage.src = isHeads
                        ? "images/quarterFront.png"
                        : "images/quarterBack.png";
        
                    setTimeout(() => {
                        coinImage.style.transition = "";
                        coinImage.style.transform = "";
                    }, 300);
                    //after 2 seconds, hide the coinFlip div
                    setTimeout(() => {
                        this.isVisible = false;
                        Alpine.store('utils').player.play();
                        Alpine.store('utils').player.gotoTrack(1);
                    }, 2000);
                }
            };
        
            requestAnimationFrame(flip);
        }
    });
});