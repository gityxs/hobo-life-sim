document.addEventListener("alpine:init", () => {
    Alpine.store("housing", {
        buyHousing(uid) {
            const data = Alpine.store("data");
            const housing = data.housing.find(h => h.uid === uid);
            data.player.money -= housing.entryCost;
            housing.isActive = true;
            //if dailycost then add it to player's daily expenses
            data.player.dailyExpenses += housing.dailyCost;
        },
        sellHousing(uid) {
            const data = Alpine.store("data");
            const housing = data.housing.find(h => h.uid === uid);
            if(housing.entryCost > 0){
            if(confirm(`Are you sure you want to sell this housing for ${housing.entryCost * 0.3}?`)){
                data.player.money += housing.entryCost * 0.3;
                housing.isActive = false;
                    //if dailycost then subtract it from player's daily expenses
                    data.player.dailyExpenses -= housing.dailyCost;
                }
            }
            else{
                housing.isActive = false;
            }
        }
    });
});