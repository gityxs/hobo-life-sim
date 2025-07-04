document.addEventListener("alpine:init", () => {
  Alpine.store("actions", {
    isDiving: false,
    difficulty: null,
    board: [],
    revealedSquares: [],
    get remainingBadSquares() {
      if (!this.board.length) return 0;
      let count = 0;
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i] === "❌" && !this.revealedSquares[i]) {
          count++;
        }
      }
      return count;
    },
    endDiving() {
      document.getElementById('squares').style.pointerEvents = 'none';
      document.getElementById('endDiving').style.display = 'none';

      // Pause the music player first
      Alpine.store("utils").player.pause();

      // Play end sound
      Alpine.store("utils").playSFX("sfx/diveEnd.mp3");

      // Wait 2 seconds then close the game and return to main music
      setTimeout(() => {
        this.isDiving = false;
        Alpine.store("utils").player.gotoTrack(1);
        Alpine.store("utils").player.play();
        document.getElementById('endDiving').style.display = 'block';
      }, 2000);
    },
    dumpsterDive() {
      const difficulties = [
        {
          name: "Easy",
          totalSquares: 6,
          badSquares: 2,
        },
        {
          name: "Medium",
          totalSquares: 12,
          badSquares: 4,
        },
        {
          name: "Hard",
          totalSquares: 24,
          badSquares: 8,
        },
        {
          name: "Insane",
          totalSquares: 36,
          badSquares: 12,
        }
      ]
      document.getElementById('squares').style.pointerEvents = 'auto';
      this.isDiving = true;
      this.difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      console.log(this.difficulty);

      // Generate the board
      this.generateBoard();

      // Start dumpster dive music
      Alpine.store("utils").player.gotoTrack(0);

      Alpine.store('data').player.energy -= 15;
    },
    generateBoard() {
      const findables = Alpine.store("data").findables;
      const totalSquares = this.difficulty.totalSquares;
      const badSquares = this.difficulty.badSquares;
      const itemSquares = totalSquares - badSquares;

      // Create array of indices to shuffle
      const indices = Array.from({ length: totalSquares }, (_, i) => i);

      // Shuffle the indices to randomize positions
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      // Initialize board with null values
      this.board = new Array(totalSquares).fill(null);
      this.revealedSquares = new Array(totalSquares).fill(false);

      // Convert rarity into weight: higher rarity = higher weight
      const weights = findables.map((f) => Math.max(1, f.rarity));
      const total = weights.reduce((sum, w) => sum + w, 0);

      // Place items in the first 'itemSquares' shuffled positions
      for (let i = 0; i < itemSquares; i++) {
        // Select random item based on weighted rarity
        let rand = Math.random() * total;
        let selectedItem = null;

        for (let j = 0; j < findables.length; j++) {
          rand -= weights[j];
          if (rand <= 0) {
            selectedItem = findables[j];
            break;
          }
        }

        // Place the selected item at the shuffled position
        this.board[indices[i]] = selectedItem;
      }

      // Place ❌ in the remaining positions
      for (let i = itemSquares; i < totalSquares; i++) {
        this.board[indices[i]] = "❌";
      }

      console.log("Generated board:", this.board);
    },
    clickSquare(index) {
      // Don't allow clicking already revealed squares
      if (this.revealedSquares[index]) {
        return;
      }

      const clickedItem = this.board[index];

      // Mark this square as revealed
      this.revealedSquares[index] = true;

      if (clickedItem === "❌") {
        // Bad square clicked - play fail sound
        Alpine.store("utils").playSFX("sfx/fail.mp3");

        // TODO: Add functionality for bad square consequences here
        // Examples: lose energy, lose money, trigger mini-game, etc.
        console.log("Bad square clicked - add consequences here");
        // Only spawn killer if this is not the last square of the game
        const remainingSquares = this.revealedSquares.filter(square => !square).length;
        if (Math.random() < 0.1 && remainingSquares > 1) {
          Alpine.store("killer").initiateKiller();
        }
      } else if (clickedItem && typeof clickedItem === 'object') {
        // Good item found - play success sound
        Alpine.store("utils").playSFX("sfx/success.mp3");

        // Assign item to player
        const findables = Alpine.store("data").findables;
        const itemIndex = findables.findIndex(f => f.uid === clickedItem.uid);

        if (itemIndex !== -1) {
          // Ensure count exists
          if (typeof findables[itemIndex].count !== "number") {
            findables[itemIndex].count = 0;
          }
          findables[itemIndex].count += 1;
          console.log("Found item:", findables[itemIndex]);
          Alpine.store("mastery").increaseMastery("dumpsterDiving");
        }
      }

      // Check if all squares are revealed (moved outside conditionals)
      if (this.revealedSquares.every(square => square === true)) {
        console.log("All squares revealed! Ending game...");
        this.endDiving();
      }
    },
    beg() {
      const data = Alpine.store("data");
      const amount = Math.floor(Math.random() * 3)
      data.player.money += amount + (amount * Alpine.store("mastery").data.find(m => m.uid === "begging").percent);
      data.player.energy -= 5;
      Alpine.store("mastery").increaseMastery("begging");
      Alpine.store("cooldowns").start("beg", 250);
      //Alpine.store("utils").playSFX("sfx/playerSuccess.mp3");
      //10% chance to start a coin flip
      if (Alpine.store("data").clicks > 30) {
        if (data.player.money > 0) {
          if (Math.random() < 0.1) {
            Alpine.store("coinFlip").start();
          }
        }
      }
    },
    busk() {
      const data = Alpine.store("data");
      const amount = Math.floor(Math.random() * 7 + 1)
      data.player.money += amount + (amount * Alpine.store("mastery").data.find(m => m.uid === "busking").percent);
      data.player.energy -= 15;
      Alpine.store("cooldowns").start("busk", 250);
      Alpine.store("mastery").increaseMastery("busking");
    },
    rest() {
      const data = Alpine.store("data");
      const gain = Math.floor(Math.random() * 100 + 30);
      data.player.energy = Math.min(100, data.player.energy + gain);
      this.progressDay();
    },
    hospital() {
      this.increaseLifespan();
      //reduce energy by 20
      Alpine.store('data').player.energy -= 20;
      Alpine.store("cooldowns").start("hospital", 600000);
    },
    doDrugs() {
      const randEnergyBoost = Math.floor(Math.random() * 100 + 1);

      if (Alpine.store('data').player.addiction > 80) {
        //30% chance to game over due to overdose
        if (Math.random() < 0.3) {
          Alpine.store("gameOver").showGameOver("You have overdosed on drugs.");
        }
      }
      //increase energy by randEnergyBoost
      Alpine.store('data').player.energy += randEnergyBoost;
      //decrease lifespan by random amount
      this.decreaseLifespan();
      Alpine.store("cooldowns").start("drugs", 5000);
      Alpine.store('data').player.addiction += Math.floor(Math.random() * 10 + 1);
      console.log(`Addiction: ${Alpine.store('data').player.addiction}%`);
    },
    increaseLifespan(days) {
      const data = Alpine.store("data");
      console.log(`Received days: ${days}`);
      if (!days) {
        days = Math.floor(Math.random() * 100 + 1);
      }
      data.player.lifespan.day += days;
      console.log(`Increasing lifespan by ${days} days`);

      if (data.player.lifespan.day > 365) {
        data.player.lifespan.day -= 365;
        data.player.lifespan.year++;
      }
    },
    decreaseLifespan() {
      const data = Alpine.store("data");
      const lifeDecrease = Math.floor(Math.random() * 25 + 1);
      data.player.lifespan.day -= lifeDecrease;
      if (data.player.lifespan.day < 0) {
        data.player.lifespan.day += 365;
        data.player.lifespan.year--;
      }
    },
    progressDay() {
      console.log("Progressing day");
      const data = Alpine.store("data");
      data.player.age.day++;
      if (data.player.age.day > 365) {
        data.player.age.day -= 365;
        data.player.age.year++;
      }
      data.day++;
      Alpine.store("gameOver").checkAge();
      data.player.money -= data.player.dailyExpenses;
      data.player.money += data.player.dailyIncome;
      data.player.addiction -= Math.floor(Math.random() * 10 + 1);
      if (data.housing.some(h => h.isActive)) {
        this.increaseLifespan(data.housing.find(h => h.isActive).lifespanPerDay);
      }
      // Check job attendance
      Alpine.store("jobs").checkAttendance();
    },
    sellItem(index, count) {
      const data = Alpine.store("data");
      const sellPrice = (data.findables[index].worth * count)
      const masteryBonus = (data.findables[index].worth * Alpine.store("mastery").data.find(m => m.uid === "dumpsterDiving").percent);
      console.log(sellPrice, masteryBonus);
      data.player.money += (sellPrice + masteryBonus);
      data.findables[index].count -= count;
    },
    buyUpgrade(uid) {
      const data = Alpine.store("data");
      const upgrade = data.upgrades.find(u => u.uid === uid);
      upgrade.isUnlocked = true;
      data.player.money -= upgrade.cost;

      if (upgrade.dailyExpense > 0) {
        data.player.dailyExpenses += upgrade.dailyExpense;
      }
      Alpine.store("utils").playSFX("sfx/upgrade.mp3");
    },
  });
});
