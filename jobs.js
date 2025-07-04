document.addEventListener("alpine:init", () => {
  Alpine.store("jobs", {
    // Constants for job mechanics
    MAX_MISSED_DAYS: 3,
    COOLDOWN_DAYS: 7,
    showWorkPrompt: false,

    applyForJob(uid) {
      const data = Alpine.store("data");
      const job = data.jobs.find(j => j.uid === uid);
      const requiredEducation = data.education.find(e => e.uid === job.requiredEducation);

      // Check if player has the required education
      if (!requiredEducation.isUnlocked) {
        Alpine.store("utils").playSFX("sfx/playerFail.mp3");
        return false;
      }

      // Check if job is in cooldown
      if (job.isCoolingDown) {
        const remainingDays = job.cooldownEndDay - data.day;
        if (remainingDays > 0) {
          Alpine.store("utils").playSFX("sfx/playerFail.mp3");
          return false;
        } else {
          // Reset cooldown if it's finished
          job.isCoolingDown = false;
          job.cooldownEndDay = 0;
        }
      }

      // Deactivate current job if any
      const currentJob = data.jobs.find(j => j.isActive);
      if (currentJob) {
        currentJob.isActive = false;
        data.player.dailyIncome -= currentJob.dailyIncome;
      }

      // Reset job stats
      job.isActive = true;
      job.missedDays = 0;
      job.lastWorked = data.day;
      job.isCoolingDown = false;
      job.cooldownEndDay = 0;
      
      // Update player income
      data.player.dailyIncome += job.dailyIncome;
      Alpine.store("utils").playSFX("sfx/playerSuccess.mp3");
      return true;
    },

    quitJob(uid) {
      const data = Alpine.store("data");
      const job = data.jobs.find(j => j.uid === uid);
      
      if (job && job.isActive) {
        this.deactivateJob(job);
        Alpine.store("utils").playSFX("sfx/playerFail.mp3");
        return true;
      }
      return false;
    },

    // Helper function to deactivate a job
    deactivateJob(job) {
      const data = Alpine.store("data");
      job.isActive = false;
      data.player.dailyIncome -= job.dailyIncome;
      job.missedDays = 0;
      job.lastWorked = 0;
    },

    // Helper function to fire player from job
    fireFromJob(job) {
      const data = Alpine.store("data");
      this.deactivateJob(job);
      job.isCoolingDown = true;
      // Ensure cooldown end day is in the future
      job.cooldownEndDay = Math.max(data.day + this.COOLDOWN_DAYS, data.day + 1);
      Alpine.store("utils").playSFX("sfx/playerFail.mp3");
    },

    // Helper function to get all available jobs for a given education level
    getAvailableJobs(educationUid) {
      const data = Alpine.store("data");
      return data.jobs.filter(job => job.requiredEducation === educationUid);
    },

    // Helper function to get the player's current job
    getCurrentJob() {
      const data = Alpine.store("data");
      return data.jobs.find(j => j.isActive);
    },

    // Show work prompt at the start of each day
    showDailyWorkPrompt() {
      const currentJob = this.getCurrentJob();
      if (currentJob && currentJob.lastWorked < Alpine.store("data").day) {
        this.showWorkPrompt = true;
      }
    },

    // Handle response to work prompt
    respondToWorkPrompt(willWork) {
      const data = Alpine.store("data");
      const currentJob = this.getCurrentJob();
      
      if (willWork) {
        if (data.player.energy >= currentJob.energyCost) {
          // Deduct energy cost
          data.player.energy -= currentJob.energyCost;
          // Update last worked day
          currentJob.lastWorked = data.day;
          // Reset missed days
          currentJob.missedDays = 0;
          Alpine.store("utils").playSFX("sfx/playerSuccess.mp3");
        } else {
          // If they try to work but don't have energy, count as slacking
          currentJob.missedDays++;
          Alpine.store("utils").playSFX("sfx/playerFail.mp3");
        }
      } else {
        // Player chose to slack off
        currentJob.missedDays++;
        Alpine.store("utils").playSFX("sfx/playerFail.mp3");
      }

      // Check if player should be fired
      if (currentJob.missedDays >= this.MAX_MISSED_DAYS) {
        this.fireFromJob(currentJob);
      }

      // Hide the prompt
      this.showWorkPrompt = false;
    },

    // Function to check attendance and update job status
    checkAttendance() {
      const data = Alpine.store("data");
      
      // Check and update cooldowns for all jobs
      data.jobs.forEach(job => {
        if (job.isCoolingDown && job.cooldownEndDay <= data.day) {
          job.isCoolingDown = false;
          job.cooldownEndDay = 0;
        }
      });

      // Show work prompt for the new day if player has a job
      this.showDailyWorkPrompt();
    }
  });
}); 