document.addEventListener("DOMContentLoaded", () => {
    Alpine.store("killer", {
        isActive: false,
        text: '',
        reactionTime: 0,
        startTime: 0,
        timerInterval: null,
        hasDecided: false,
        initiateKiller(){
            // Clear any existing timer first
            if (this.timerInterval) {
                cancelAnimationFrame(this.timerInterval);
                this.timerInterval = null;
            }
            
            // Reset state
            this.hasDecided = false;
            
            const slurs = [
                'Holy Sh*t!',
                'Who the F*ck are you?',
                'F*ck My Life!',
                'Mother F*cker!',
                'No No No!',
                'Sh*t!',
            ];
            this.text = slurs[Math.floor(Math.random() * slurs.length)];
            this.isActive = true;
            Alpine.store('utils').playSFX('sfx/miniGameAlert.mp3');
            Alpine.store('utils').playSFX('sfx/killerGreeting.mp3');            
            Alpine.store('utils').player.gotoTrack(4);
            Alpine.store('utils').player.play();
            
            // Set up the timer
            this.reactionTime = Math.floor(Math.random() * 10000) + 2500;
            this.startTime = Date.now();
            
            // Initialize progress bar to 100% and remove transition
            const progressBar = document.querySelector('#killerProgressBar .progressBar');
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.style.transition = 'none'; // Remove CSS transition for instant updates
            }
            
            // Start the progress bar countdown using requestAnimationFrame
            const updateProgress = () => {
                const elapsed = Date.now() - this.startTime;
                const remaining = Math.max(0, this.reactionTime - elapsed);
                const progressPercent = (remaining / this.reactionTime) * 100;
                
                // Update the progress bar (decreases from 100% to 0%)
                const progressBar = document.querySelector('#killerProgressBar .progressBar');
                if (progressBar) {
                    progressBar.style.width = `${progressPercent}%`;
                }
                
                // If time runs out, end the killer
                if (remaining <= 0) {
                    console.log('randomly deciding')
                    if(Math.random() < 0.5){
                        this.fightKiller();
                    }
                    else{
                       this.runAway();
                    }
                    return; // Stop the animation loop
                }
                
                // If player decided, stop the animation
                if(this.hasDecided){
                    return; // Stop the animation loop
                }
                
                // Continue the animation loop
                this.timerInterval = requestAnimationFrame(updateProgress);
            };
            
            // Start the animation loop
            this.timerInterval = requestAnimationFrame(updateProgress);
        },
        fightKiller(){
            this.hasDecided = true;
            Alpine.store('utils').player.stop();
            if(Math.random() < 0.8){
                console.log('Killer Wins');
                this.text = 'You were killed by the killer.';
                Alpine.store('utils').playSFX('sfx/killerKnifeKill.mp3');
                document.getElementById('killerText').style.color = 'red';
                document.getElementById('killerText').classList.remove('jumpscareText');
                //Alpine.store('utils').playSFX('sfx/fail.mp3');
                setTimeout(() => {
                Alpine.store('gameOver').showGameOver('You were killed by the killer.');
                //this.endKiller();
                this.isActive = false;
                }, 3000);
            }
            else{
                this.text = 'You fought the killer and won!';
                document.getElementById('killerText').style.color = 'limegreen';
                document.getElementById('killerText').classList.remove('jumpscareText');
                Alpine.store('utils').playSFX('sfx/success.mp3');
                setTimeout(() => {
                    this.endKiller();
                }, 3000);
            }
        },
        runAway(){
            this.hasDecided = true;
            console.log('Player Runs Away');            
            Alpine.store('utils').playSFX('sfx/success.mp3');
            Alpine.store('utils').player.stop();
            if(Math.random() < 0.1){
                Alpine.store('actions').decreaseLifespan();
                this.text = 'You managed to escape, but got cut up a bit.';
                Alpine.store('utils').playSFX('sfx/knifeSlice.mp3');
            }
            else{
                this.text = 'You ran away from the killer!';
            }
            document.getElementById('killerText').style.color = 'limegreen';
            document.getElementById('killerText').classList.remove('jumpscareText');

            setTimeout(() => {
                this.endKiller();
                Alpine.store('actions').endDiving();
            }, 3000);
        },
        endKiller(){
            this.isActive = false;
            // Clear the timer interval
            if(Alpine.store('actions').isDiving){
                Alpine.store('utils').player.gotoTrack(0);
                Alpine.store('utils').player.play();
            }
            else{
                Alpine.store('utils').player.gotoTrack(1);
                Alpine.store('utils').player.play();
            }
            document.getElementById('killerText').style.color = 'white';
            document.getElementById('killerText').classList.add('jumpscareText');
            if (this.timerInterval) {
                cancelAnimationFrame(this.timerInterval);
                this.timerInterval = null;
            }
        }
    })
})