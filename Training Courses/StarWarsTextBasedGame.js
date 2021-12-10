//Imports:
var engine = require('workshop-engine');

//Global Variables:
var lastRoundDamage = 0;
var fightRound = 1;
var timesCountered = 0;
var readRules = '';
var maximumHoursTraining = 24;
var trainedHours = 0;
var maximumHoursInCave = 8;
var hoursInCave = 0;
var attunement = 0;

//Arrays:
vulToBeFound = [
    'Weapons System: Lasers System',
    'Weapons System: Torpedoes System',
    'Kae-Kul\'s Key-Card Maintenance Access',
    'Main Engineering Access',
    'Main Bridge Terminal Hacked',
    'Auxiliary Bridge Access',
    'Sub-System: Targeting System',
    'Sub-System: Power System',
    'Sub-System: Shield Generator Left',
    'Sub-System: Shield Generator Right',
    'Hacking Tips to Open Gate\'s Door',
    'Kae-Kul\'s Work Schedule',
    'Kae-Kul\'s Work Uniform',
    'Kae-Kul\'s FingerPrint sample',
    'Sub-System: Mal Function going on (Need Repair)',
    'Dark Lord Weak Spots',
    'Dark Lord LightSaber BluePrints',
    'Breaching Point: Back',
    'Breaching Point: Front',
    'Generators Maintenance Plan',
];
ancientTexts = [
    {chapter: 1, technique: '□Fo□□rc□e L□ea□p□□'},
    {chapter: 2, technique: 'T□ra□□n□□□s□fe□r F□o□rc□e□□'},
    {chapter: 3, technique: 'Fo□□rc□e B□urs□t'},
    {chapter: 4, technique: '□□M□alac□i□a'},
    {chapter: 5, technique: '□Fo□rce□□ We□a□□po□n'}
];
ancientTextsDecyphered = [];
vulFinded = [];
COLOR = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    fgBlack: '\x1b[30m',
    fgRed: '\x1b[31m',
    fgGreen: '\x1b[32m',
    fgYellow: '\x1b[33m',
    fgBlue: '\x1b[34m',
    fgMagenta: '\x1b[35m',
    fgCyan: '\x1b[36m',
    fgWhite: '\x1b[37m',

    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
}; //Change console color text and backg

//Player Creation
const jedi = new function() {
    this.jediName =  '',
    this.jediKnight = true,
    this.jediGrade = 'Jedi Knight',
    this.forcePower = 150,
    this.bountyValue = 45,
    this.fear = 75,
    this.vulnerabilities = 15,
    this.hitpoints = 35,
    this.learntSkills = ['Force Leap', 'Force Burst'],
    this.attacks = {
        attack: {name: '[Normal Attack]', damage: 7},
        skill1: {name: '[' + this.learntSkills[0] + ']', damage: 15},
        skill2: {name: '[' + this.learntSkills[1] + ']', damage: 18},
        counterAttack: {name: '[CounterAttack]', damage: 14}
    }

}; //Função construtora para poder chamar propriedades próprias dentro do objecto.

//BOSS Creation:
const darkLord = {
    name: 'Darth Vader',
    hitpoints: 45,
    counterImmune: false,
    attacks: {
        attack1: {name: '[Saber Strike]', damage: 7},
        skill1: {name: '[Focused Rage]', damage: 10},
        skill2: {name: '[Saber Throw]', damage: 15},
        skill3: {name: '[Force Choke]', damage: 18}
    }
};

//Checks && Status
const checkFear = function(){
    if(jedi.fear >= 100){
        console.log("\nYou joined the Dark Side! GAME OVER!");
        engine.quit();
    }
} //Calculate Fear random number for each action
const checkBounty = function(){
    if(jedi.bountyValue >= 100) {
        console.log("\nBUSTED!! GAME OVER!");
        engine.quit();
    }
} //Calculate random number for BountyLevel
const playerDashBoard = function() {
    console.log(
        COLOR.fgWhite + COLOR.fgBlack + '      D A S H B O A R D      ' + COLOR.reset + COLOR.fgBlue +
        '\n' + COLOR.bright + COLOR.underscore + COLOR.fgWhite + 'Player: '+ COLOR.reset + jedi.jediName +
        '\nJedi Rank: ' + jedi.jediGrade +
        '\nForce Power: '+ jedi.forcePower +
        '\nSkills: '  + jedi.learntSkills +
        '\nVulnerabilities: ' + jedi.vulnerabilities +
        '\nHitPoints: ' + jedi.hitpoints +
        '\nBounty: '+ jedi.bountyValue +
        '\nFear: ' + jedi.fear +
        '\nRules: '  + readRules +
        '\n\nAvailable Training Time:' +
        '\nJedi Temple: ' + maximumHoursTraining +
        '\nAhch-To Cave: '+  maximumHoursInCave +
        COLOR.fgWhite + COLOR.fgBlack +
        '\n                             ' + COLOR.reset + COLOR.fgBlue +
        '\n'
    )
} //Player DashBoard
const battleDashBoard = function(){ //DashBoard only for battles
    console.log(
        COLOR.fgWhite + COLOR.fgBlack +
        '      D A S H B O A R D      ' + COLOR.reset + COLOR.fgBlue +
        '\n' + jedi.jediName + '\'s' + COLOR.reset + ' HitPoints: ' + jedi.hitpoints +
        COLOR.fgRed + '\n' + darkLord.name+
        '\'s' + COLOR.reset + ' HitPoints: ' + darkLord.hitpoints
    )
};

//Calculations && Functions:
const calculateJediGrade = function () {
    if (jedi.fear >= 70) {
        jedi.jediGrade = 'Jedi Knight';
        jedi.jediKnight = true;
    } else if (jedi.fear >= 16 && jedi.fear < 70) {
        jedi.jediGrade = 'Jedi-Padawan';
    } else if (jedi.fear <= 15) {
        jedi.jediGrade = 'Jedi-Youngling';
    }
} //Calculates Jedis Grades
const sleepTime = function(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}
const randomIntFromInterval = function (min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
} //To generate a random number for Vulnerabilities.
const calculatePower = function () { //Calculate Power: Change the values as intended.
    if (trainedHours <= 5) {
        jedi.forcePower += randomIntFromInterval(0, 150);
    } else if (trainedHours > 5 && trainedHours <= 10) {
        jedi.forcePower += randomIntFromInterval(150, 225);
    } else if (trainedHours > 10 && trainedHours <= 20) {
        jedi.forcePower += randomIntFromInterval(225, 285);
    } else if (trainedHours > 20 && trainedHours <= 24) {
        jedi.forcePower += randomIntFromInterval(285, 350);
    }
};
const calculateFear = function () {
    jedi.fear += randomIntFromInterval(1, 35);
    return jedi.fear
};
const calculateAttunement = function () {
    attunement = (210 / jedi.fear); //TODO: Changing this value will change the amount of power received.
    return attunement
};
const look4Vuls = function () {//Find new Vulnerabilities:
    if (vulFinded.length !== vulToBeFound.length) {
        let randomNumber = randomIntFromInterval(0, vulToBeFound.length);
        let counter = 0;

        if (jedi.fear >= 43) {
            console.log('Fear high');
            if (randomNumber >= 2 && randomNumber <= 10) {
                randomNumber = Math.floor(randomNumber / 2);
            } else if (randomNumber > 10 && randomNumber <= 20) {
                randomNumber = Math.floor(randomNumber / 4);
            }
        }

        console.log('\n<< You discovered: ');

        for (counter; counter < randomNumber; counter++) {
            let randomIndex = randomIntFromInterval(0, vulToBeFound.length);
            let index = vulToBeFound.indexOf(vulToBeFound[randomIndex]);
            let poppedVul = vulToBeFound.splice(index, 1);
            console.log(": " + poppedVul);
            vulFinded.push(poppedVul);
            counter++;
        }

        //Calculate Bounty & Fear:
        jedi.vulnerabilities += (counter / 2);
        jedi.bountyValue += randomIntFromInterval(1, 30);
        jedi.fear += randomIntFromInterval(1, 20);
        //Checks:
        checkFear();
        checkBounty();
        calculateJediGrade();
        //Return:
        console.log('You now have: ' + vulFinded.length + ' known vulnerabilities!\n');
    }
}

//Battle Functions
const counterAttack = function(){
    if (darkLord.counterImmune) {
        //CHATS:
        console.clear()
        engine.showBanner('Battle - Round  ' + fightRound);
        console.log(COLOR.fgRed + '                          C H A T   S C E N E                                       \n' + COLOR.reset);
        console.log(jedi.jediName + ': CounterAttacked!\n');
        console.log(COLOR.fgCyan + jedi.jediName + ':' + COLOR.reset + ' Oh no!\n' + COLOR.fgRed + darkLord.name + COLOR.reset + ': Do you relly think that i would fall for that one again?\n')
        console.log(COLOR.fgRed + '                       E N D   C H A sT   S C E N E                                           \n' + COLOR.reset);

        //YOUR MOVE
        console.log('<< You failed to CounterAttack ' + darkLord.name + '! You suffered the hit with a total damage of ' + lastRoundDamage + ' >>\n');
        console.log(COLOR.fgWhite + COLOR.fgBlack + '                                                                                    \n' + COLOR.reset);

        //CALCS:
        jedi.hitpoints -= lastRoundDamage;
        lastRoundDamage = 0;
        timesCountered = 0;
        darkLord.counterImmune = false;
        fightRound += 1;

        // FINAL VERIFICATIONS:
        battleDashBoard();
        checkWin();
        console.log('\n');

    } else if (!darkLord.counterImmune) {
        //CHATS:
        console.clear()
        engine.showBanner('Battle - Round  ' + fightRound);
        console.log(COLOR.fgRed + '                          C H A T   S C E N E                                                \n' + COLOR.reset);
        console.log(COLOR.fgCyan + jedi.jediName + COLOR.reset + ': CounterAttacked!\n');
        console.log(COLOR.fgRed + darkLord.name + COLOR.reset + ': Smart Move! I\'ll be ready next time. I won\'t make it easy for you! \n')
        console.log(COLOR.fgRed + '                       E N D   C H A T   S C E N E                                           \n' + COLOR.reset);

        //YOUR MOVE:
        console.log(COLOR.fgGreen + '<< You CounterAttacked ' + darkLord.name + '! You dealt a total damage of ' + jedi.attacks.counterAttack.damage + ' >>\n' + COLOR.reset);
        console.log(COLOR.fgWhite + '                                                                                            \n' + COLOR.reset);

        //CALCS:
        timesCountered += 1;
        lastRoundDamage = 0;
        darkLord.hitpoints -= jedi.attacks.counterAttack.damage;
        if (timesCountered >= 2){darkLord.counterImmune = true}
        fightRound += 1;

        // FINAL VERIFICATIONS:
        battleDashBoard();
        checkWin();
        console.log('\n');
    }
}
const playerAttacks = function(){
    //CHAT
    console.clear();
    engine.showBanner('Battle Round:  ' + fightRound);
    console.log(COLOR.fgRed + '                          C H A T   S C E N E                                                \n' + COLOR.reset);
    console.log('<< You suffered ' + lastRoundDamage + ' damage from ' + darkLord.name + ' attack. >>')

    //YOUR MOVE:
    console.log('<< You Attacked ' + darkLord.name + '! You dealt a total damage of ' + jedi.attacks.attack.damage + ' >>\n');
    console.log(COLOR.fgRed + '                       E N D   C H A T   S C E N E                                           \n' + COLOR.reset);

    //CALCS:
    jedi.hitpoints -= lastRoundDamage;
    lastRoundDamage = 0;
    darkLord.hitpoints -= jedi.attacks.attack.damage;
    fightRound += 1;

    // FINAL VERIFICATIONS:
    checkWin();
    battleDashBoard();
    console.log('\n');
}
const playerAttackSkill = function(id){
    //VERIFICATIONS:
    let skill;
    if(id === 0){
        skill = jedi.attacks.skill1
    } else if (id === 1){
        skill = jedi.attacks.skill2
    }

    //CHAT
    console.clear();
    engine.showBanner('Battle Round:  ' + fightRound);
    console.log(COLOR.fgRed + '                          C H A T   S C E N E                                                \n' + COLOR.reset);
    console.log('<< You suffered ' + lastRoundDamage + ' damage from ' + darkLord.name + ' attack. >>')
    console.log('<< You Attacked ' + darkLord.name + 'with the skill '+ skill.name + ' and dealt a total damage of ' + skill.damage + ' >>\n');
    console.log(COLOR.fgRed + '                       E N D   C H A T   S C E N E                                           \n' + COLOR.reset);

    //CALCS:
    darkLord.hitpoints -= skill.damage;
    jedi.hitpoints -= lastRoundDamage;
    lastRoundDamage = 0;
    fightRound += 1;

    //VERIFICATIONS:
    checkWin();
    battleDashBoard();
    console.log('\n');
}
const checkWin = function(){
    if (jedi.hitpoints <= 0){
        console.clear()
        engine.showBanner('Game Over!')
        console.log('\n\nGame Over!! Dark Lord Won!'); //TODO: add some fancy words here.
        engine.quit()
    } else if (darkLord.hitpoints <= 0){
        console.clear()
        engine.showBanner('The End');
        console.log(COLOR.fgYellow + COLOR.fgBlack + '\nCongratulations! You defeated the DarkLord, ' + darkLord.name + '. The galaxy is now a better place.' + COLOR.reset); //TODO: add phancy words here...

        playerDashBoard();
        engine.quit()
    }
}

//Skill Decypher: Extract, Decypher, Append it to Player Skills, Delete it from original array
var learnNewSkill = function () {
    var decypherText = '';
    var randomNumber = randomIntFromInterval(0, ancientTexts.length - 1);
    var extractedSkill = ancientTexts[randomNumber].technique;

    //Show ancient texts to player:
    console.log('Our Jedi luckily managed to save some Ancient Texts before the last StormTroopers attack. You only need to understand 2 of them. Take a look:\n')
    for (var i = 0; i < ancientTexts.length; i++) {
        console.log('Chapter ' + ancientTexts[i].chapter + " : " + ancientTexts[i].technique)
    }
    console.log('\nLet\'s see if you understood any of these texts..\n');

    //Extract the skill from the object
    for (var i = 0; i < extractedSkill.length; i++) {
        if (extractedSkill[i] !== '□') {
            decypherText += extractedSkill[i];
        }
    }
    //Check if the extracted skill respect the length rule (between 10 and 11 chars).
    if (decypherText.length === 10 || decypherText.length === 11) {
        //If respects the rule, join the skill to jedi known skills list
        //sleepTime(2000);
        console.log('Reading Chapters ...');
        //sleepTime(3000);
        console.log('Trying to Decypher a Chapter ...');
        //sleepTime(2000);
        console.log('Found some logical ...');
        //sleepTime(5000);
        console.log('Compilig decyphered chapter ...');
        //sleepTime(6000);
        console.log(COLOR.fgRed + 'Congratulations!' + COLOR.reset + 'You have successfully decrypted and understood the Chapter: ' + ancientTexts[randomNumber].chapter + ' and learned a new Skill: ' + decypherText);
        var splicedObject;
        for (var i = 0; i < ancientTexts.length; i++) { //Remove the skill from the object list
            if (i === randomNumber) {
                splicedObject = ancientTexts.splice(i, 1); //Note: This will splice the object into a new array. To call the object, you must call the index of the object.
            }
        }
        jedi.learntSkills.concat(decypherText);
    } else {
        //sleepTime(2000);
        console.log('Reading Chapters ...');
        //sleepTime(3000);
        console.log('Trying to Decypher a Chapter ...');
        //sleepTime(2000);
        console.log('Found some logical ...');
        //sleepTime(5000);
        console.log('Couldn\'t finish it! It looks really hard. Maybe i should focus more next time.');
        //sleepTime(6000);
        console.log(COLOR.fgBlack + '<< You couldn\'t learn a new skill. Try next time. You lost 40 of Power >>' + COLOR.reset);
        jedi.forcePower -= 40;
    }
}

//STAGES: CREATION OF ALL STAGES:
var entryStage = engine.create({
    type: 'before',
    name: '[Welcome Stage]'
})
var rulesStage = engine.create({
    type: 'before',
    name: '[Rules page]'
})
var helpStage = engine.create({
    type: 'stage',
    name: '[Help Page]'
})
var myStatus = engine.create({
    type: 'stage',
    name: '[My Profile]'
})
var quitgame = engine.create({
    type: 'stage',
    name: '[Quit Game]\n'
})
var jediTemple = engine.create({
    type: 'stage',
    name: '[Jedi Temple]'
})
var cantina = engine.create({
    type: 'stage',
    name: '[Cantina]'
})
var ahchto = engine.create({
    type: 'stage',
    name: '[Ahch-To]'
})
var jediTrain = engine.create({
    type: 'stage',
    name: '[Jedi Training]'
})
var starDestroyer = engine.create({
    type: 'stage',
    name: '[Star Destroyer]\n'
})

//STAGE: ENTRY -> OK
entryStage.executeBefore(function () {
    console.clear()
    engine.showBanner('Star Wars - Rise of Jedis')
    console.log(COLOR.fgRed + '\"For over a thousand generations, the Jedi Knights were the guardians of peace and justice in the Old Republic.\"' + COLOR.reset);
    calculateJediGrade();
})
entryStage.addQuestion({
    type: 'input',
    message: 'Type your name: ',
    validator: function (answer) {
        if (answer.length === 0) {
            return 'You should have a name longer than that... '
        }
    },
    action: function (answer) {
        jedi.jediName = answer;
    }
})
entryStage.addQuestion({
    type: 'list',
    message: 'You are about to enter in World of Star Wars. Are you ready?',
    options: ['[Yes]', '[No]'],
    action: function (answer) {
        if (answer === '[Yes]') {
            console.clear();
            engine.showBanner('Welcome  ' + jedi.jediName);
            console.log('\nWelcome ' + jedi.jediName + '! I hope you enjoy it!');
            jedi.jediGrade = calculateJediGrade();
            console.log('Before proceeding, you must accept the Rules below.\n');
        } else {
            console.log('May the force be with you!');
            engine.quit();
        }
    }
})
rulesStage.addQuestion({
    type: 'list',
    message: 'You agree in following all the rules ?\n    . Defeat the Sith Lord to Win;\n    . Find vulnerabilities to infiltrate the Star Destroyer;\n    . Learn force techniques through ancient texts;\n\n    . Be careful with the following rules:\n    . All of your actions will increase your fear;\n    . If your bounty value or fear reaches 100, you lose;\n    . If your fear becomes higher than 70, you are experienced enough and become a Jedi Knight;\n    . When you become a Jedi Knight, and pull together 15 vulnerabilities, you are ready to defeat the Dark Lord.\n',
    options: ['[Yes, I Agree with the Rules]', '[No, I didn\'t even read it]'],
    action: function (answer) {
        console.clear()
        engine.showBanner('Rules')
        if (answer === '[Yes, I Agree with the Rules]') {
            console.log('\nYou are now ready to proceed with the game!');
            readRules = 'Accepted';
            console.clear()
            engine.showBanner('Game - Menu')
        } else {
            console.log('I knew you weren\'t the Jedi that we are looking for! Get out of here!');
            engine.quit();
        }
    }
})

//STAGE: myStatus -> OK
myStatus.executeBefore(function () {
    console.clear()
    engine.showBanner(jedi.jediGrade)
})
myStatus.executeAfter(function () {
    playerDashBoard()
})

//STAGE: HELP PAGE
helpStage.executeBefore(function(){
    console.clear()
    engine.showBanner('Help Page')
})
helpStage.addQuestion({
    type: 'list',
    message: 'What you want to know?',
    options: ['[How to be a Jedi Knight]', '[How to learn new Skills?]', '[How to Loose Fear?]', '[How to loose Bounty]', '[How to Gain ForcePower]', '[What is HitPoints?]', '[How to defeat the Dark Lord?]', '[Go Back]'],
    action: function(answer) {
        console.clear();
        engine.showBanner('Help Page');
        if (answer === '[How to learn new Skills?]') {
            console.log('You will need to be a Jedi Knight first. Then go to Jedi Training Page. There you must decrypt and learn new scripts based on ancient texts.');
        } else if (answer === '[How to be a Jedi Knight]'){
            console.log('You will reach to Jedi Knight when your fear reches 70. You can control it by looking at your profile info in menu.')
        } else if (answer === '[How to Loose Fear?]'){
            console.log('You can loose fear in the Ahch-To cave. Go there and concentrate with the force. But be carefull. You can only be there 8 hours, as it consumes a lot of your power.')
        } else if (answer === '[How to loose Bounty]'){
            console.log('You can loose bounty by going to \'Cantina\' and use a Mind Trick. Be carefull, it consumes a lot of your power.')
        } else if (answer === '[How to Gain ForcePower]'){
            console.log('You can gain ForcePower in \'Jedi Temple\'. However your fear will increase!')
        } else if (answer === '[What is HitPoints?]'){
            console.log('HitPoints is the amount of hits that you can take from your enemy. More than that, and you are dead!')
        } else if (answer === '[How to defeat the Dark Lord?]'){
            console.log('That is a good question, but you have to dind it out by yourself. Quick Tip: You will need a few requirements:\nYou will need 15 vulnerabilities\nYou will need at least 2 skills\nYou will need to have a Jedi Grade: Jedi Knight')
        } else if (answer === '[Go Back]'){
            return false
        }
    }
})
helpStage.addQuestion({
    type: 'list',
    message: 'Proceed:',
    options: ['[Go Back]'],
    action:function(answer){
        console.clear()
        engine.showBanner('Game - Menu')
        if (answer === '[Go Back]'){
            return false
        }
    }
})

//STAGE: JEDI TEMPLE -> OK
jediTemple.executeBefore(function () {
    console.clear()
    engine.showBanner("Room: Jedi Temple")
    console.log('\n"Enter our Temple unbidden, you have. Leaving it will not be easy, you will find." - Grand Master Yoda\n')
    console.log('Temple\'s role, besides being the central hub of all Jedi activities throughout the galaxy, the Temple functions as a monastery for Jedi Knights and Jedi Masters as well as a school for the training of Padawans and initiates.\nSo yes, You are in the right place to begin your journey.')
    console.log('Here, you will be meditating in contact with the Light! You will achieve grand results, as more you stay, the more Power you will obtain!\n')
})
jediTemple.addQuestion({
    type: 'input',
    message: 'How many hours you want to be connecting with Force? (Max. 24h): ',
    validator: function (answer) {
        if (!answer) {
            return 'Type amount of hours: '
        } else if (isNaN(answer)) {
            return 'Type numbers only: '
        } else if (answer > maximumHoursTraining) {
            return 'You can only be here for 24 hours. You have ' + maximumHoursTraining + 'hours remaining.'
        }
        trainedHours = answer;
    }
})
jediTemple.executeAfter(function () {
    console.clear();
    engine.showBanner('ROOM: Jedi Temple')

    calculateFear();
    calculateAttunement();
    calculatePower();
    maximumHoursTraining -= trainedHours;

    console.log('\nYou trained for ' + trainedHours + ' hours. You have ' + maximumHoursTraining + ' hours left yet.\nForce Power Obtained: ' + Math.floor(trainedHours * attunement));
    console.log('Your Fear raised to: ' + jedi.fear + '\n')

    calculateJediGrade(); //TODO: Must create a one-only-function to make all the necessary checks like this one for example.
});

//STAGE: CANTINA -> OK
cantina.executeBefore(function () {
    console.clear()
    engine.showBanner('Room: Cantina')
});
cantina.addQuestion({
    type: 'list',
    message: '\nChoose an option: ',
    options: ['[Find New Vulnerabilities]', '[Vulnerabilities already known]\n', '[Use MindTrick to lower your Bounty]', '[Go Back]'],
    action: function (answer) {
        console.clear();
        engine.showBanner('Room: Cantina')
        if (answer === '[Find New Vulnerabilities]') {
            console.log('\nLet me see what you found so far...');
            if (vulFinded.length === 0) {
                console.log('\nLooks like you didn\'t find any vulnerability yet... Lets find some.');
                look4Vuls();
            } else if (vulFinded.length > 0 && vulFinded.length < 15) {
                console.log('Hummm... you already found ' + vulFinded.length + ' vulnerabilities.')
                console.log('However, if you want to be ready to fight the Dark Lord, you will need at least 15 vulnerabilities found.\nLet\'s look for some more.');
                look4Vuls();
            } else if (vulFinded.length >= 15) {
                console.log('You have more vulnerabilities known that enough to enter in Star Destroyer and fight the Dark Lord!');
                console.log('Star Destroyer Vulnerabilities you discover: \n');
                for (var i = 0; i < vulFinded.length; i++) {
                    console.log(vulFinded[i]);
                }
            } else if (vulFinded.length === 20) {
                console.log('\nYou already found all the vulnerabilities available.');
            }
        } //Tested and working
        else if (answer === '[Vulnerabilities already known]\n') {
            if (vulFinded.length === 0) {
                console.log("You don't know any vulnerabilities yet. Keep searching.")
            } else if (vulFinded.length > 0) {
                console.log("\nSo far you discovered:" + vulFinded.length);
                for (var i = 0; i < vulFinded.length; i++) {
                    console.log(vulFinded[i]);
                }
            }
        } //Tested and working
        else if (answer === '[Use MindTrick to lower your Bounty]') {
            console.log('\nLets Lower your Bounty by using what you were taught in Jedis School.\nClear your mind...\nFocus...');

            let initialBounty = [];
            initialBounty.push(jedi.bountyValue);

            if (jedi.bountyValue > 50) {
                jedi.bountyValue -= randomIntFromInterval(5, 45);
                jedi.forcePower -= randomIntFromInterval(5, 200);
            }

            console.log('\nNice! you decreased your bounty by ' + (initialBounty[0] - jedi.bountyValue));
            console.log('Quick Tip: You will only be able to loose some bounty if it is higher than 50.');
        } else if (answer === '[Go Back]') {
            return false
        } else {
            return 'Select one of the available options.'
        }
    }
})
cantina.executeAfter(function () {
    calculateJediGrade();
})

//STAGE: AHCH-TO
ahchto.executeBefore(function () {
    console.clear()
    engine.showBanner('Room: Ahch-To')
})
ahchto.addQuestion({
    type: 'input',
    message: 'How many hours you want to spend in the Mirror Cave?',
    validator: function (answer) {
        if (!answer) {
            return 'Type amount of hours: '
        } else if (isNaN(answer)) {
            return 'Type numbers only: '
        } else if (answer > maximumHoursInCave) {
            return 'You can only be here for 8 hours. You have ' + maximumHoursInCave + 'hours remaining.'
        }
        hoursInCave = answer;
    }
})
ahchto.executeAfter(function () {
    jedi.fear = Math.floor(jedi.fear / hoursInCave); //reduce Fear change formula as intended.
    jedi.forcePower = Math.floor(jedi.forcePower - (28 * hoursInCave)); //reduce ForcePower 28 per hour. Change this value as inteded.
    console.log('After being in the cave, you lost some fear!\nCurrent fear: ' + jedi.fear)
    maximumHoursInCave -= hoursInCave;
    calculateJediGrade();
})

//STAGE: JEDI TRAINING
jediTrain.executeBefore(function () {
    console.clear()
    engine.showBanner('Room: Jedi Training Skills')
    calculateJediGrade()
    if (jedi.jediKnight) {
        console.log('If you want to defeat Sith Lord, you will need at least 2 Skills!\n')
    } else {
        console.log('Dear ' + jedi.jediGrade + ' you have much to learn before learning this special Skills. Graduate a bit more and come back.')
        return false
    }
})
jediTrain.addQuestion({
    type: 'list',
    message: 'Do you want to learn new Skills?',
    options: ['[Yes]', '[No]'],
    action: function (answer) {
        if (answer === '[Yes]') {
            console.clear();
            engine.showBanner('Room: Jedi Training Skills');
            console.log('\nOk! Let me show you some Ancient Texts.');

            learnNewSkill();
        } else {
            console.log('Ok, Come Back when you are ready!');
            return false
        }
    }
})

//STAGE:  Star Destroyer Where you'll fight the Sith Lord
starDestroyer.executeBefore(function () { //Round 1 - DarkLord Attack
    console.clear();
    engine.showBanner('Fight: ' + darkLord.name);

    if (jedi.learntSkills.length === 2 && jedi.vulnerabilities >=15 && jedi.jediKnight) {
        console.log('***You are now ready for this battle! May the Force be with you!****\n'); //TODO: Edit dialogues with some fancy words related with Star Wars galaxy shit.
        console.log(COLOR.fgRed + '                          C H A T   S C E N E                                                \n' + COLOR.reset);
        console.log(COLOR.fgRed + darkLord.name + COLOR.reset + ': You should have come to Dark Side. Either you join us, or you will die!');
        console.log(COLOR.fgCyan + jedi.jediName + COLOR.reset + ': Strike me down and I will become more powerful than you could possibly imagine!');
        console.log(COLOR.fgRed + darkLord.name + COLOR.reset + ': You Don\'t Know The Power Of The Dark Side!');
        console.log(COLOR.fgRed + darkLord.name + COLOR.reset + ': I Will Show You The True Nature Of The Force now. Be ready for my Saber!\n');
        console.log(COLOR.fgRed + '                       E N D   C H A T   S C E N E                                           \n' + COLOR.reset);
        lastRoundDamage = darkLord.attacks.attack1.damage;
        battleDashBoard();

    } else {
        console.clear()
        engine.showBanner('Fight: ' + darkLord.name);
        console.log('Some requirements are not met. Please proceed with the necessary arrangements before coming here.\n');
        if (jedi.learntSkills.length < 2){console.log('Requirements: You need at least 2 skills. Current known Skills: '+jedi.learntSkills.length)}
        if (jedi.vulnerabilities.length < 15){console.log('Requirements: You need at least 15 vulnerabilites. Current known Vulnerabilities: '+jedi.vulnerabilities)}
        if (!jedi.jediKnight){console.log('Requirements: You need to be a Jedi Knight. Current Jedi Grade: '+jedi.jediGrade)}
        return false
    }
})
starDestroyer.addQuestion({ //Round 1 - Player Attack/CounterAttack
    type: 'list',
    message: ('\n' + COLOR.fgBlack + '<< ' + darkLord.name + ': Attacked with ' + COLOR.fgRed + darkLord.attacks.attack1.name + COLOR.reset + COLOR.fgBlack + '. You lost ' + darkLord.attacks.attack1.damage + ' HitPoints >>' + COLOR.reset),
    options: ['[Attack]', '[Counter]'], //TODO: Add a defend mode...
    action: function (answer) {
        lastRoundDamage = darkLord.attacks.attack1.damage;

        if (answer === '[Attack]') {
            jedi.hitpoints -= lastRoundDamage;
            checkWin();
            playerAttacks();
        } else if (answer === '[Counter]') {
            checkWin()
            counterAttack();
        }
    }
}) //Round 1
starDestroyer.addQuestion({
    type: 'list',
    message: (COLOR.fgBlack + '<< ' + darkLord.name + ': attacked with ' + COLOR.fgRed + darkLord.attacks.skill1.name + COLOR.reset + COLOR.fgBlack + '. You lost ' + darkLord.attacks.skill1.damage + ' HitPoints >>\n' + COLOR.reset),
    options: ['[Attack]', '[Counter]', '[' + jedi.attacks.skill1.name + ']', '[' + jedi.attacks.skill2.name + ']'],
    action: function (answer) {
        lastRoundDamage = darkLord.attacks.skill1.damage;

        if (answer === '[Attack]') {
            playerAttacks();
        } else if (answer === '[Counter]') {
            counterAttack();
        } else if (answer === '[' + jedi.attacks.skill1.name + ']') {
            playerAttackSkill(0);
        } else if (answer === '[' + jedi.attacks.skill2.name + ']') {
            playerAttackSkill(1);
        }
    }
})
starDestroyer.addQuestion({
    type: 'list',
    message: (COLOR.fgBlack + '<< ' + darkLord.name + ': attacked with ' + COLOR.fgRed + darkLord.attacks.attack1.name + COLOR.reset + COLOR.fgBlack + '. You lost ' + darkLord.attacks.attack1.damage + ' HitPoints >>\n' + COLOR.reset),
    options: ['[Attack]', '[Counter]', '[' + jedi.learntSkills[0] + ']', '[' + jedi.learntSkills[1] + ']'],
    action: function (answer) {
        lastRoundDamage = darkLord.attacks.attack1.damage;

        if (answer === '[Attack]') {
            playerAttacks();
        } else if (answer === '[Counter]') {
            counterAttack();
        } else if (answer === '[' + jedi.learntSkills[0] + ']') {
            playerAttackSkill(0);
        } else if (answer === '[' + jedi.learntSkills[1] + ']') {
            playerAttackSkill(1);
        }
    }
})
starDestroyer.addQuestion({
    type: 'list',
    message: (COLOR.fgBlack + '<< ' + darkLord.name + ': attacked with ' + COLOR.fgRed + darkLord.attacks.skill2.name + COLOR.reset + COLOR.fgBlack + '. You lost ' + darkLord.attacks.skill2.damage + ' HitPoints >>\n' + COLOR.reset),
    options: ['[Attack]', '[Counter]', '[' + jedi.learntSkills[0] + ']', '[' + jedi.learntSkills[1] + ']'],
    action: function (answer) {
        lastRoundDamage = darkLord.attacks.skill2.damage;

        if (answer === '[Attack]') {
            playerAttacks();
        } else if (answer === '[Counter]') {
            counterAttack();
        } else if (answer === '[' + jedi.learntSkills[0] + ']') {
            playerAttackSkill(0);
        } else if (answer === '[' + jedi.learntSkills[1] + ']') {
            playerAttackSkill(1);
        }
    }
})
starDestroyer.addQuestion({
    type: 'list',
    message: (COLOR.fgBlack + '<< ' + darkLord.name + ': attacked with ' + COLOR.fgRed + darkLord.attacks.attack1.name + COLOR.reset + COLOR.fgBlack + '. You lost ' + darkLord.attacks.attack1.damage + ' HitPoints >>\n' + COLOR.reset),
    options: ['[Attack]', '[Counter]', '[' + jedi.learntSkills[0] + ']', '[' + jedi.learntSkills[1] + ']'],
    action: function (answer) {
        lastRoundDamage = darkLord.attacks.attack1.damage;

        if (answer === '[Attack]') {
            playerAttacks();
        } else if (answer === '[Counter]') {
            counterAttack();
        } else if (answer === '[' + jedi.learntSkills[0] + ']') {
            playerAttackSkill(0);
        } else if (answer === '[' + jedi.learntSkills[1] + ']') {
            playerAttackSkill(1);
        }
    }
})
starDestroyer.addQuestion({
    type: 'list',
    message: (COLOR.fgBlack + '<< ' + darkLord.name + ': attacked with ' + COLOR.fgRed + darkLord.attacks.skill3.name + COLOR.reset + COLOR.fgBlack + '. You lost ' + darkLord.attacks.skill3.damage + ' HitPoints >>\n' + COLOR.reset),
    options: ['[Attack]', '[Counter]', '[' + jedi.learntSkills[0] + ']', '[' + jedi.learntSkills[1] + ']'],
    action: function (answer) {
        lastRoundDamage = darkLord.attacks.skill3.damage;

        if (answer === '[Attack]') {
            playerAttacks();
        } else if (answer === '[Counter]') {
            counterAttack();
        } else if (answer === '[' + jedi.learntSkills[0] + ']') {
            playerAttackSkill(0);
        } else if (answer === '[' + jedi.learntSkills[1] + ']') {
            playerAttackSkill(1);
        }
    }
})

//QUIT GAME -> OK
quitgame.executeBefore(function () {
    console.clear()
    engine.showBanner('Quit ? = (')
})
quitgame.addQuestion({
    type: 'list',
    message: 'Are you sure you want to quit game?',
    options: ['[Yes]', '[No]'],
    action: function (answer) {
        if (answer === '[Yes]') {

            console.log('\nHave a nice day!');
            engine.quit();
        } else {
            return false
        }
    }
})

// RUN GAME
engine.run();


/*
* KNOWN BUGS:
* When learn new skills, the engine read it as undifined. If i pre-fill the skills array, it will work.
 */
