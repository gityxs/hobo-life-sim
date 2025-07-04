document.addEventListener("alpine:init", () => {
    Alpine.store("photo", {
        returnPlayerPhoto(){
            const data = Alpine.store("data");
            if(data.player.money < 50000){
                //if player age is 0-29 show homelessPlayer1, 30-44 show homelessPlayer2, 45-59 show homelessPlayer3, 60-74 show homelessPlayer4, 75+ show homelessPlayer5
                if(data.player.age.year < 30){
                    return "images/player/homelessPlayer1.png";
                }
                else if(data.player.age.year < 45){
                    return "images/player/homelessPlayer2.png";
                }
                else if(data.player.age.year < 60){
                    return "images/player/homelessPlayer3.png";
                }
                else if(data.player.age.year < 75){
                    return "images/player/homelessPlayer4.png";
                }
                else{
                    return "images/player/homelessPlayer5.png";
                }
            }
            else{
                if(data.player.age.year < 30){
                    return "images/player/richPlayer1.png";
                }
                else if(data.player.age.year < 45){
                    return "images/player/richPlayer2.png";
                }
                else if(data.player.age.year < 60){
                    return "images/player/richPlayer3.png";
                }
                else if(data.player.age.year < 75){
                    return "images/player/richPlayer4.png";
                }
                else{
                    return "images/player/richPlayer5.png";
                }
            }
        }
    });
});