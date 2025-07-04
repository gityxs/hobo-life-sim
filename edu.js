document.addEventListener("alpine:init", () => {
    Alpine.store("edu", {
        study(uid){
            const data = Alpine.store("data");
            const edu = data.education.find(e => e.uid === uid);
            const randomStudyIncrease = Math.floor((Math.random() * 2) + 1);
            edu.successRate += randomStudyIncrease;
            console.log(`${edu.name} success rate increased by ${randomStudyIncrease} to ${edu.successRate}%`);
            Alpine.store('data').player.energy -= 10;
        },
        attempt(uid){
            const data = Alpine.store("data");
            const edu = data.education.find(e => e.uid === uid);
            if(confirm(`Are you sure you want to attempt ${edu.name} for ${Alpine.store('utils').toCurrency(edu.cost)}?`)){
                if(Math.random() * 100 < edu.successRate){
                    edu.isUnlocked = true;
                    console.log(`${edu.name} unlocked`);
                    Alpine.store('utils').playSFX("sfx/success.mp3");
                }
                else{
                    console.log(`${edu.name} failed`);
                    Alpine.store('utils').playSFX("sfx/fail.mp3");
                }
                data.player.money -= edu.cost;
            }
        }
    });
});