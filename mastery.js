document.addEventListener("alpine:init", () => {
    Alpine.store("mastery", {
        data: Alpine.store("data").mastery,
        increaseMastery(uid){
            const mastery = this.data.find(m => m.uid === uid);
            mastery.percent += Math.min(100, Math.random()/10);
        }
    });
});