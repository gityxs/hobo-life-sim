document.addEventListener("alpine:init", () => {
    Alpine.nextTick(() => {
        let buttons = document.querySelectorAll("button");
        console.log(buttons);
        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                console.log("clicked");
                Alpine.store("utils").playSFX("sfx/click.mp3");
                Alpine.store("data").clicks++;
                console.log(Alpine.store("data").clicks);
            });
        });
    });
    Alpine.store("utils", {
        toCurrency(number, locale = "en-US", currency = "USD") {
            return number.toLocaleString(locale, {style: "currency", currency: currency});
        },
        playSFX(location){
            const audio = new Audio(location);
            audio.volume = Alpine.store("data").settings.sfx;
            audio.play();
        },
        player: new Gapless5({
            tracks:["music/dumpsterDiveBeat.mp3", "music/mainBeat.mp3", "music/deathMusic.mp3", "music/coinSuspense.mp3", "music/killer.mp3", "music/mainMenuLoop.aac"],
            shuffle: false,
            loop: true,
            volume: Alpine.store("data").settings.music,
            singleMode: true,
        }),
        returnHealth() {
            const data = Alpine.store("data");
            
            const ageInDays = data.player.age.year * 365 + data.player.age.day;
            const lifespanInDays = data.player.lifespan.year * 365 + data.player.lifespan.day;
            
            // Calculate remaining days and convert to a percentage
            const remainingDays = lifespanInDays - ageInDays;
            const percent = remainingDays / lifespanInDays;
            
            // Scale the percentage to be more visually appropriate
            // This will make the health bar more visible even with smaller remaining lifespans
            const scaledPercent = Math.pow(percent, 0.5); // Square root scaling for better visual representation
            
            // Convert to actual percentage (0-100) instead of decimal (0-1)
            return Math.max(0, Math.min(scaledPercent * 100, 100));
        }
    });
});