document.addEventListener("alpine:init", () => {
  Alpine.store("cooldowns", {
    cooldowns: Alpine.store("data").cooldowns,
    start(uid, time) {
      const now = Date.now();
      const endTime = now + time;

      if(!this.cooldowns.find(cd => cd.uid === uid)){
        this.cooldowns.push({uid, time: endTime});
      }
      
      //disable button
      document.querySelectorAll(`[data-cooldown="${uid}"]`).forEach(button => {
        const div = document.createElement("div");
        div.classList.add("cooldown");
        button.appendChild(div);
        Alpine.nextTick(() => {
          button.style.pointerEvents = "none";
        });

        //using animation frame, animate the div from 100% to 0% width based on the time left
        const animate = () => {
          const progress = (Date.now() - now) / time;
          div.style.width = `${(1 - progress) * 100}%`;
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
          else{
            div.remove();
            this.cooldowns.splice(this.cooldowns.findIndex(cd => cd.uid === uid), 1);
            Alpine.nextTick(() => {
              button.style.pointerEvents = "auto";
            });
          }
        };
        animate();
      });
    },
    resume(uid){
       
        const now = Date.now();
        const endTime = this.cooldowns.find(cd => cd.uid === uid).time;
        const remaining = endTime - now;
        console.log("resuming " + uid + " " + remaining);
        if(remaining > 0){
            this.start(uid, remaining);
        }
    },
    init(){
        Alpine.nextTick(() => {
            this.cooldowns.forEach(cd => {
                this.resume(cd.uid);
            });
        });
    }
  });
});