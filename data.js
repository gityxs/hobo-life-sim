// Save function
const saveData = (data) => {
  try {
    localStorage.setItem('gameData', JSON.stringify(data));
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

// Load function
const loadData = () => {
  try {
    const saved = localStorage.getItem('gameData');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;
  }
};

document.addEventListener("alpine:init", () => {
  // Default data structure
  const defaultData = {
    player: {
      money: 0,
      dailyExpenses: 0,
      dailyIncome: 0,
      energy: 100,
      addiction: 0,
      age: {
        year: 18,
        day: 0,
      },
      lifespan: {
        year: 19,
        day: 0,
      },
    },
    clicks: 0,
    day: 0,
    adminMode: false,
    settings: {
      sfx: 0.5,
      music: 0.3,
    },
    upgrades: [
      {
        uid: "nosePlugs",
        name: "Nose Plugs",
        description: "Unlocks the ability to dumpster dive and sell items for money.",
        cost: 25,
        isUnlocked: false,
      },
      {
        uid: "guitar",
        name: "Guitar",
        description: "Unlocks the ability to play music and busk for money.",
        cost: 100,
        isUnlocked: false,
        dailyExpense: 10,
      },
      {
        uid: "explore",
        name: "Explore the Streets",
        description: "Explore the streets and find a new location.",
        cost: 400,
        isUnlocked: false,
      },
      {
        uid: "dealer",
        name: "Meet the Dealer",
        description: "Meet the dealer and to gain access to drugs to use them to increase your energy.",
        cost: 1500,
        isUnlocked: false,
      },
      {
        uid: "buyHousing",
        name: "Speak to Homeless God",
        description: "The Homeless God will teach you how to truly survive on the streets, for a price.",
        cost: 3000,
        isUnlocked: false,
      }
    ],
    cooldowns: [],
    findables: [
      {
        uid: "plasticBottle",
        name: "Plastic Bottle",
        icon: '<i class="fa-solid fa-bottle-water"></i>',
        worth: 0.1,
        rarity: 10,
      },
      {
        uid: "glassBottle",
        name: "Glass Bottle",
        icon: '<i class="fa-solid fa-wine-bottle"></i>',
        worth: 0.25,
        rarity: 8,
      },
      {
        uid: "oldClothes",
        name: "Old Clothes",
        icon: '<i class="fa-solid fa-shirt"></i>',
        worth: 1.0,
        rarity: 6,
      },
      {
        uid: "usedElectronics",
        name: "Used Electronics",
        icon: '<i class="fa-solid fa-microchip"></i>',
        worth: 5.0,
        rarity: 3,
      },
      {
        uid: "whiskey",
        name: "Whiskey",
        icon: '<i class="fa-solid fa-whiskey-glass"></i>',
        worth: 2.5,
        rarity: 4,
      },
      {
        uid: "codeine",
        name: "Codeine",
        icon: '<i class="fa-solid fa-capsules"></i>',
        worth: 10.0,
        rarity: 1,
      },
    ],
    housing: [
      {
        uid: "shelter",
        name: "Homeless Shelter",
        entryCost: 0,
        dailyCost: 0,
        isActive: false,
      },
    ],
    mastery: [
      {
        uid: "begging",
        name: "Begging",
        percent: 0,
      },
      {
        uid: "dumpsterDiving",
        name: "Dumpster Diving",
        percent: 0,
      },
      {
        uid: "busking",
        name: "Busking",
        percent: 0,
      }
    ],
    housing: [
      {
        uid: "shelter",
        name: "Homeless Shelter",
        entryCost: 0,
        dailyCost: 0,
        isActive: false,
        lifespanPerDay: 1,
      },
      {
        uid: "shared",
        name: "Shared Apartment",
        entryCost: 900,
        dailyCost: 10,
        isActive: false,
        lifespanPerDay: 2,
      },
      {
        uid: "studio",
        name: "Private Studio",
        entryCost: 2000,
        dailyCost: 50,
        isActive: false,
        lifespanPerDay: 5,
      },
      {
        uid: "house",
        name: "House",
        entryCost: 75000,
        dailyCost: 500,
        isActive: false,
        lifespanPerDay: 15,
      },
      {
        uid: "mansion",
        name: "Mansion",
        entryCost: 1000000,
        dailyCost: 1500,
        isActive: false,
        lifespanPerDay: 30,
      }
    ],
    education:[
      {
        uid: "ged",
        name: "GED",
        description: "Pass your GED to get your first job and to progress further in your education.",
        cost: 1000,
        isUnlocked: false,
        successRate: 0.5,
      },
      {
        uid: "associate",
        name: "Associate's Degree",
        description: "Pass your Associate's Degree to qualify for a better job and to progress further in your education.",
        cost: 10000,
        isUnlocked: false,
        successRate: 0,
      },
      {
        uid: "bachelors",
        name: "Bachelor's Degree",
        description: "Pass your Bachelor's Degree to qualify for a better job and to progress further in your education.",
        cost: 100000,
        isUnlocked: false,
        successRate: 0,
      },
      {
        uid: "masters",
        name: "Master's Degree",
        description: "Pass your Master's Degree to qualify for a better job and to progress further in your education.",
        cost: 1000000,
        isUnlocked: false,
        successRate: 0,
      },
      {
        uid: "doctorate",
        name: "Doctorate",
        description: "Pass your Doctorate to qualify for the best jobs and to progress further in your education.",
        cost: 10000000,
        isUnlocked: false,
        successRate: 0,
      }
    ],
    jobs: [
      // GED Level Jobs
      {
        uid: "cashier",
        name: "Cashier",
        description: "Work as a cashier at a local store.",
        requiredEducation: "ged",
        dailyIncome: 80,
        energyCost: 20,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "securityGuard",
        name: "Security Guard",
        description: "Work as a security guard at a local building.",
        requiredEducation: "ged",
        dailyIncome: 100,
        energyCost: 25,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "waiter",
        name: "Waiter/Waitress",
        description: "Work as a server at a restaurant.",
        requiredEducation: "ged",
        dailyIncome: 90,
        energyCost: 30,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      // Associate's Degree Level Jobs
      {
        uid: "paralegal",
        name: "Paralegal Assistant",
        description: "Work as a paralegal assistant at a law firm.",
        requiredEducation: "associate",
        dailyIncome: 150,
        energyCost: 25,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "dentalAssistant",
        name: "Dental Assistant",
        description: "Work as a dental assistant in a dental clinic.",
        requiredEducation: "associate",
        dailyIncome: 180,
        energyCost: 30,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "webDeveloper",
        name: "Junior Web Developer",
        description: "Work as a junior web developer at a small company.",
        requiredEducation: "associate",
        dailyIncome: 200,
        energyCost: 35,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      // Bachelor's Degree Level Jobs
      {
        uid: "accountant",
        name: "Accountant",
        description: "Work as an accountant at a corporate firm.",
        requiredEducation: "bachelors",
        dailyIncome: 300,
        energyCost: 30,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "marketingManager",
        name: "Marketing Manager",
        description: "Work as a marketing manager for a medium-sized company.",
        requiredEducation: "bachelors",
        dailyIncome: 350,
        energyCost: 35,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "softwareEngineer",
        name: "Software Engineer",
        description: "Work as a software engineer at a tech company.",
        requiredEducation: "bachelors",
        dailyIncome: 400,
        energyCost: 40,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      // Master's Degree Level Jobs
      {
        uid: "dataScientist",
        name: "Data Scientist",
        description: "Work as a data scientist analyzing big data.",
        requiredEducation: "masters",
        dailyIncome: 600,
        energyCost: 35,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "financialAnalyst",
        name: "Senior Financial Analyst",
        description: "Work as a senior financial analyst at an investment firm.",
        requiredEducation: "masters",
        dailyIncome: 700,
        energyCost: 40,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "projectDirector",
        name: "Project Director",
        description: "Work as a project director managing large-scale projects.",
        requiredEducation: "masters",
        dailyIncome: 800,
        energyCost: 45,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      // Doctorate Level Jobs
      {
        uid: "researchScientist",
        name: "Research Scientist",
        description: "Lead groundbreaking research at a prestigious institution.",
        requiredEducation: "doctorate",
        dailyIncome: 1000,
        energyCost: 40,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "chiefTechnologist",
        name: "Chief Technology Officer",
        description: "Work as a CTO at a major tech company.",
        requiredEducation: "doctorate",
        dailyIncome: 1200,
        energyCost: 45,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      },
      {
        uid: "universityProfessor",
        name: "University Professor",
        description: "Teach and conduct research at a university.",
        requiredEducation: "doctorate",
        dailyIncome: 900,
        energyCost: 35,
        isActive: false,
        missedDays: 0,
        lastWorked: 0,
        isCoolingDown: false,
        cooldownEndDay: 0
      }
    ]
  };

  // Load saved data or use defaults
  const savedData = loadData();
  const initialData = savedData ? { ...defaultData, ...savedData } : defaultData;

  Alpine.store("data", {
    ...initialData,
  });

  // Auto-save whenever the store changes
  Alpine.effect(() => {
    const data = Alpine.store("data");
    // Trigger reactivity by accessing the store properties
    JSON.stringify(data);
    // Save the data
    saveData(data);
  });
});

// Optional: Add a manual save button for testing
window.saveGame = () => {
  const data = Alpine.store("data");
  saveData(data);
};

// Optional: Add a reset function for testing
window.resetGame = () => {
  localStorage.removeItem('gameData');
  location.reload();
};