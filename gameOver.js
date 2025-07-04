document.addEventListener("alpine:init", () => {
    Alpine.store("gameOver", {
        show: false,
        reason: "Replace Me",
        showGameOver(reason) {
            console.log('Player Died');
            this.show = true;
            this.reason = reason;
            Alpine.store("utils").playSFX("sfx/deathScream.mp3");
            Alpine.store('utils').player.stop();
            //delete local storage
            localStorage.clear();
            setTimeout(() => {
                Alpine.store('utils').player.play();
                Alpine.store('utils').player.gotoTrack(2);
            }, 1000);
        },
        checkAge() {
            const data = Alpine.store("data");
            //if the player's age is greater than or equal to their lifespan, show game over
            const playerAgeInDays = data.player.age.year * 365 + data.player.age.day;
            const lifespanInDays = data.player.lifespan.year * 365 + data.player.lifespan.day;
            if (playerAgeInDays >= lifespanInDays) {
                console.log("Game Over");
                this.showGameOver("You have reached the end of your life.");
            }
        }
    });

    // Initial check
    Alpine.nextTick(() => {
        Alpine.store("gameOver").checkAge();
    });
});