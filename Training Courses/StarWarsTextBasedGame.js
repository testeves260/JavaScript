//Imports:
var engine = require('workshop-engine');

//Global Variables:
var fightRound = 1;
var timesCountered = 0;
var readRules = false;
var maximumHoursTraining = 24;
var trainedHours = 0;
var maximumHoursInCave = 8;
var hoursInCave = 0;
var attunement = 0;
var emptyString = "";
//Player Creation: Have to create the player with attributes outside to be able to call them inside its own object
var jedi = {}
jedi.jediName= ''; // your Jedi name
jedi.forcePower= 650 // force power gained meditating at the Jedi Temple
jedi.learntSkills = ['[Force Leap]','[Force Burst]'];
jedi.bountyValue = 50; // starts at 0, if it reaches 100 you get busted and 0 -100
jedi.fear = 80; // starts at 0, if it reaches 100 you join the Dark side and lose the game 0 - 100
jedi.vulnerabilities = 16; // number of vulnerabilities found max 20, needed 15 to enter in 2 last scene.
jedi.jediGrade = 'Jedi Knight';
jedi.jediKnight = true; // boolean to indicate if the player has reached
jedi.hitpoints = 30; // your current hitpoints
jedi.attackValues = 7;
jedi.attackTypes = [
    {normalAttack: '[Normal Attack]', damage: 7},
    {counterAttack: '[Counter Attack]', damage: 16}
];
jedi.skillsTypes = [
    {skillName: '[' + jedi.learntSkills[0] + ']', damage: 15},
    {skillName: '[' + jedi.learntSkills[1] + ']', damage: 18}
];

//BOSS Creation:
var darkLord = {
    name: 'Darth Vader',
    hitpoints: 45,
    counterImmune: false,
    attackTypes: [
        {
            attackName: '[Saber Strike]',
            damage: 7
        }
        ],
    skills: [ //Skill Name: HitPoints
        {skillName: '[Focused Rage]', damage: 10},
        {skillName: '[Saber Throw]', damage: 15},
        {skillName: '[Force Choke]', damage: 18}
    ]
};
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
        'Player: ' + jedi.jediName +
        '\nJedi Rank: ' + jedi.jediGrade +
        '\nForce Power: ' + jedi.forcePower +
        '\nSkills: ' + jedi.learntSkills +
        '\nVulnerabilities: ' + jedi.vulnerabilities +
        '\nHitPoints: ' + jedi.hitpoints +
        '\nBounty: ' + jedi.bountyValue +
        '\nFear: ' + jedi.fear +
        '\nRules: ' + readRules +
        '\n\nAvailable Training Time:' +
        '\nJedi Temple: ' + maximumHoursTraining + ' hours' +
        '\nAhch-To Cave: '+ maximumHoursInCave + ' hours' +
        '\n'
    )
} //Player DashBoard
const battleDashBoard = function(){ //DashBoard only for battles
    console.log(
        'Player: ' + jedi.jediName +
        '\nMy HitPoints: ' + jedi.hitpoints +
        '\n\nDarkLord: ' + darkLord.name +
        '\nDarkLord HitPoints: ' + darkLord.hitpoints
    )
};
const checkVulns = function() {
    if (jedi.vulnerabilities < 15) {
        console.log('Requirements: You need at least 15 Vulnerabilities.');
        return false
    }
}
const checkSkills = function () {
    if (jedi.learntSkills.length < 2) {
        console.log('Requirements: You need at least 2 skills dominated');
        return false
    } else {
        return true
    }
}
const checkGrade = function () {
    if (!jedi.jediKnight) {
        console.log('Requirements: You need to be a Jedi Knight');
        return false
    } else {
        return true
    }
}
const checkRules = function () {
    if (!readRules) {
        console.log('Requirements: You need to read and accept the rules')
        return false
    } else {
        return true
    }
}

//Calculations && Functions:
const calculateJediGrade = function () {
    if (jedi.fear >= 70) {
        jedi.jediGrade = 'Jedi Knight';
    } else if (jedi.fear >= 16 && jedi.fear < 70) {
        jedi.jediGrade = 'Jedi-Padawan';
    } else if (jedi.fear <= 15) {
        jedi.jediGrade = 'Jedi-Youngling';
    }
    return jedi.jediGrade;
} //Calculates Jedis Grades
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
const calculateHoursTrained = function (answer) {
    maximumHoursTraining -= answer;

    return maximumHoursTraining
}
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

        console.log('\nYou discovered: ');
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
        console.log(`${COLOR.fgRed}Congratulations!${COLOR.reset}` + 'You have successfully decrypted and understood the Chapter: ' + ancientTexts[randomNumber].chapter + ' and learned a new Skill: ' + decypherText);
        var splicedObject;
        for (var i = 0; i < ancientTexts.length; i++) { //Remove the skill from the object list
            if (i === randomNumber) {
                splicedObject = ancientTexts.splice(i, 1); //Note: This will splice the object into a new array. To call the object, you must call the index of the object.
            }
        }
        jedi.learntSkills.push(decypherText);
    } else {
        console.log('You couldn\'t learn a new skill. Try next time. You lost 40 of Power');
        jedi.forcePower -= 40;
    }
}
//Combat Scene - Jedi vs Dark Lord
var combat = function () {


    if (jedi.learntSkills.length >= 2) {

    }


}

//STAGES: CREATION OF ALL STAGES:
var entryStage = engine.create({
    type: 'before',
    name: 'Entry Stage'
})
var rulesStage = engine.create({
    type: 'stage',
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
    options: ['[How to Read and Accept Rules?]', '[How to be a Jedi Knight]', '[How to learn new Skills?]', '[How to Loose Fear?]', '[How to loose Bounty]', '[How to Gain ForcePower]', '[What is HitPoints?]', '[How to defeat the Dark Lord?]', '[Go Back]'],
    action: function(answer) {
        console.clear();
        engine.showBanner('Help Page');
        if (answer === '[How to Read and Accept Rules?]') {
            console.log('\nEasy! In the main menu, choose \'Rules\'. There you can read and accept.');
        } else if (answer === '[How to learn new Skills?]') {
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
        engine.showBanner('Star Wars - Menu')
        if (answer === '[Go Back]'){
            return false
        }
    }
})

//STAGE: ENTRY -> OK
entryStage.executeBefore(function () {
    console.clear()
    engine.showBanner("Star Wars")
})
entryStage.addQuestion({
    type: 'input',
    message: 'Hello! Say your name young jedi:',
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
            console.log('\nWelcome ' + jedi.jediName + '! I hope you enjoy it!');
        } else {
            console.log('Ok, cya later!');
            engine.quit();
        }
    }
})
entryStage.executeAfter(function () {
    jedi.jediGrade = calculateJediGrade();
    console.log('Before proceeding, you must accept the Rules. Goto -> "Rules page"\n');
})

//RULES PAGE -> OK
rulesStage.executeBefore(function () {
    console.clear()
    engine.showBanner('Rules')
})
rulesStage.addQuestion({
    type: 'list',
    message: 'You agree in following all the rules ?\n    . Defeat the Sith Lord to Win;\n    . Find vulnerabilities to infiltrate the Star Destroyer;\n    . Learn force techniques through ancient texts;\n\n    . Be careful with the following rules:\n    . All of your actions will increase your fear;\n    . If your bounty value or fear reaches 100, you lose;\n    . If your fear becomes higher than 70, you are experienced enough and become a Jedi Knight;\n    . When you become a Jedi Knight, and pull together 15 vulnerabilities, you are ready to defeat the Dark Lord.\n',
    options: ['[Yes, I Agree with the Rules]', '[No, I didn\'t even read it]'],
    action: function (answer) {
        if (answer === '[Yes, I Agree with the Rules]') {
            console.log('\nYou are now ready to proceed with the game!');
            readRules = true;
            console.clear()
            engine.showBanner('Star Wars - Menu')
        } else {
            console.log('I knew you weren\'t the Jedi that we are looking for! Get out of here!');
            engine.quit();
        }
    }
})

//STAGE: JEDI TEMPLE -> OK
jediTemple.executeBefore(function () {
    console.clear()
    if (!readRules) {
        console.log('You did not accept the rules. Go to Menu Rules First.');
        return false
    } else {
        engine.showBanner("Room: Jedi Temple")
    }
})
jediTemple.addQuestion({
    type: 'input',
    message: 'How many hours you want to be connecting with Force?',
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
    if (!readRules) {
        console.clear();
        engine.showBanner('Star Wars - Menu')
        return false;
    } else {
        console.clear();
        engine.showBanner('Star Wars - Menu')
        calculateFear();
        calculateAttunement();
        calculatePower();
        maximumHoursTraining -= trainedHours;

        console.log('\nYou trained for ' + trainedHours + ' hours. You have ' + maximumHoursTraining + ' hours left yet.\nForce Power Obtained: ' + Math.floor(trainedHours * attunement));
        console.log('Your Fear raised to: ' + jedi.fear + '\n')

        calculateJediGrade(); //TODO: Must create a one-only-function to make all the necessary checks like this one for example.
    }
});

//STAGE: CANTINA -> OK
cantina.executeBefore(function () {
    console.clear()
    if (!readRules) {
        console.log('You did not accept the rules. Go read them first.');
        return false
    } else {
        engine.showBanner('Room: Cantina')
    }
});
cantina.addQuestion({
    type: 'list',
    message: '\nChoose an option: ',
    options: ['Find New Vulnerabilities', 'Vulnerabilities already known\n', 'Use MindTrick to lower your Bounty', 'Get Back'],
    action: function (answer) {
        if (!readRules) {
            console.clear();
            engine.showBanner('Star Wars - Menu')
            console.log('You did not accept the rules. Go read them first.');
            return false
        } else {
            if (answer === 'Find New Vulnerabilities') {
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
            else if (answer === 'Vulnerabilities already known\n') {
                if (vulFinded.length === 0) {
                    console.log("You don't know any vulnerabilities yet. Keep searching.")
                } else if (vulFinded.length > 0) {
                    console.log("\nSo far you discovered:" + vulFinded.length);
                    for (var i = 0; i < vulFinded.length; i++) {
                        console.log(vulFinded[i]);
                    }
                }
            } //Tested and working
            else if (answer === 'Use MindTrick to lower your Bounty') {
                console.log('\nLets Lower your Bounty by using what you were taught in Jedis School.\nClear your mind...\nFocus...');

                let initialBounty = [];
                initialBounty.push(jedi.bountyValue);

                if (jedi.bountyValue > 50) {
                    jedi.bountyValue -= randomIntFromInterval(5, 45);
                    jedi.forcePower -= randomIntFromInterval(5, 200);
                }

                console.log('\nNice! you decreased your bounty by ' + (initialBounty[0] - jedi.bountyValue));
                console.log(jedi.bountyValue + ' initialBounty before calcs: ' + initialBounty[0]);
            } else if (answer === 'Get Back') {
                return ('\nReturning to Menu')
            } else {
                return 'Select one of the available options.'
            }
        }
        console.clear();
        engine.showBanner('Star Wars - Menu')
        trainingHours = answer;
        return maximumHoursTraining -= trainingHours; //If player only choose to play 8 hours, can play the rest of 24 hours minus 8 later.

    }
})
cantina.executeAfter(function () {
    calculateJediGrade();
})

//STAGE: AHCH-TO
ahchto.executeBefore(function () {
    console.clear()
    if (!readRules) {
        console.log('You did not accept the rules. Go read them first.');
        return false
    } else {
        engine.showBanner('Room: Ahch-To')
    }
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
    if (!readRules) {
        console.log('You did not accept the rules. Go read them first.');
        return false
    } else {
        jedi.fear = Math.floor(jedi.fear / hoursInCave); //reduce Fear change formula as intended.
        jedi.forcePower = Math.floor(jedi.forcePower - (28 * hoursInCave)); //reduce ForcePower 28 per hour. Change this value as inteded.
        console.log('After being in the cave, you have lost fear!\nCurrent fear: ' + jedi.fear)
        maximumHoursInCave -= hoursInCave;

        calculateJediGrade();
    }
})

//STAGE: JEDI TRAINING
jediTrain.executeBefore(function () {
    console.clear()
    if (!readRules) {
        console.log('\nYou did not accept the rules. Go read them first.');
        return false
    } else {
        if (jedi.jediKnight) {
            engine.showBanner('Room: Jedi Training')
            console.log('If you want to defeat Sith Lord, you will need at least 2 Skills!')
        } else {
            console.log('Dear ' + jedi.jediGrade + ' you have much to learn before learning this special Skills. Graduate a bit more and come back.')
            return false
        }
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
jediTrain.addQuestion({
    type: 'list',
    message: 'Do you feel capable of defeat the Dark Lord, ' + darkLord.name,
    options: ['[Yes]', '[No]'],
    action: function (answer) {
        if (answer === '[Yes]') {
            console.log('\nOk! Let\'s do it!');

        } else {
            console.log('Ok, Come Back when you are ready!');
            return false
        }
    }
})
jediTrain.executeAfter(function () {
    if (!readRules) {
        engine.showBanner('Star Wars');
        console.log('You did not accept the rules. Go read them first.');
        return false
    }
})

//STAGE:  Star Destroyer Where you'll fight the Sith Lord
starDestroyer.executeBefore(function () {
    console.clear();
    engine.showBanner('Fight: ' + darkLord.name);

    if (readRules === true &&  jedi.learntSkills.length === 2 && jedi.vulnerabilities >=15 && jedi.jediKnight) {
        console.log('After a long way, you are now ready to defeat the Dark Lord.\n')
        console.log(COLOR.fgRed + darkLord.name + COLOR.fgRed + ': So you are the Jedi that rised to defeat me? You ready to die?\n')
        console.log(COLOR.fgRed + darkLord.name + COLOR.fgRed + ': You ridiculous Jedis, you think you can beat me?!\nNOW TASTE THIS!!!!');
        jedi.hitpoints -= darkLord.attackDamage;
        console.log(darkLord.name + ' attacked you with a ' + darkLord.attackTypes[0].attackName + ' and you lost ' + darkLord.attackTypes[0].damage + ' HitPoints');
    } else {
        console.clear()
        engine.showBanner('Fight: ' + darkLord.name);
        console.log('Some requirements are not met. Please proceed with the necessary arrangements before coming here.\n');
        if (readRules === false){console.log('Requirements: Read the Rules before proceeding')}
        if (jedi.learntSkills < 2){console.log('Requirements: You need at least 2 skills. Current known Skills: '+jedi.learntSkills.length)}
        if (jedi.vulnerabilities < 15){console.log('Requirements: You need at least 15 vulnerabilites. Current known Vulnerabilities: '+jedi.vulnerabilities)}
        if (jedi.grade !== 'Jedi Knight'){console.log('Requirements: You need to be a Jedi Knight. Current Jedi Grade: '+jedi.jediGrade)}
        return false
    }

})
starDestroyer.addQuestion({ //Round 1
    type: 'list',
    message: 'Choose your Best Strategy:',
    options: ['[Attack]', '[Counter]'],
    action: function (answer) {
        if (answer === '[Attack]'){
            console.clear();
            engine.showBanner('Battle - Round I');
            console.log('\nYou attacked ' + darkLord.name+ 'and dealt a total damage of ' + jedi.attackTypes[0].damage + '\n');
            darkLord.hitpoints -= jedi.attackTypes[0].damage;
            battleDashBoard();
        } else if (answer === '[Counter]'){ // normal attack = 0; counter attack = 1
            if (timesCountered >= 2) {
                console.clear();
                engine.showBanner('Battle - Round I');
                console.log('You failed to CounterAttack your Opponent! You suffered the hit with a total damage of ' + darkLord.attackTypes[0].damage + '\n');
                jedi.hitpoints -= darkLord.attackTypes[0].damage;
                battleDashBoard();
            } else if (timesCountered < 2){
                console.clear();
                engine.showBanner('Battle - Round I');
                console.log('You CounterAttacked your opponent and dealt a total damage of ' + jedi.attackTypes[1].damage + '\n');
                darkLord.hitpoints -= jedi.attackTypes[1].damage;
                battleDashBoard();
                timesCountered += 1;
            }
        }
        fightRound += 1;
    }
}) // Round 1 Attack
starDestroyer.addQuestion({
    type: 'list',
    message: 'Round I:',
    options: ['[Move to Round II]'],
    action: function (answer) {
        if (answer === '[Move to Round II]') {
            console.clear();
            engine.showBanner('Battle - Round II');
            console.log('Is that all you got ??');
            jedi.hitpoints -= darkLord.attackDamage;
            console.log(darkLord.name + ' attacked you with a ' + darkLord.attackTypes[0].attackName + ' and you lost ' + darkLord.attackTypes[0].damage + ' HitPoints');
        }
    }
}) // Round 1 Move
starDestroyer.addQuestion({ //Round 2
    type: 'list',
    message: 'Choose your Best Strategy:',
    options: ['[Counter]', '[Attack - Normal Hit]\n', '[Skill ' + jedi.skillsTypes[0].skillName, '[Skill ' + jedi.skillsTypes[1].skillName],
    action: function (answer) {
        if (answer === '[Counter]') { // normal attack = 0; counter attack = 1
            if (timesCountered >= 2) {
                console.clear()
                engine.showBanner('Battle - Round II')
                console.log('You failed to CounterAttack your Opponent! You suffered the hit with a total damage of ' + darkLord.attackTypes[0].damage);
                jedi.hitpoints -= darkLord.attackTypes[0].damage;
                battleDashBoard();
            } else if (timesCountered < 2) {
                console.log('You CounterAttacked your opponent and dealt a total damage of ' + jedi.attackTypes[1].damage)
                darkLord.hitpoints -= jedi.attackTypes[1].damage;
                timesCountered += 1;
            }
        } else if (answer === '[Attack - Normal Hit]') {
            console.clear()
            engine.showBanner('Battle - Round II')
            console.log('\nYou attacked ' + darkLord.name);
            darkLord.hitpoints -= jedi.attackTypes[0].damage;
            battleDashBoard();
        } else if (answer === '[Skill ' + jedi.skillsTypes[0].skillName) {
            console.clear()
            engine.showBanner('Battle - Round II')
            console.log('You attacked your opponent with ' + jedi.skillsTypes[0].skillName + ' and dealt a total damage of ' + jedi.skillsTypes[0].damage + ' HitPoints.');
            battleDashBoard();
        } else if (answer === '[Skill ' + jedi.skillsTypes[1].skillName) {
            console.clear()
            engine.showBanner('Battle - Round II')
            console.log('You attacked your opponent with ' + jedi.skillsTypes[1].skillName + ' and dealt a total damage of ' + jedi.skillsTypes[1].damage + ' HitPoints.')
            battleDashBoard();
        }
        fightRound += 1;
    }
}) // Round 2 Attack
starDestroyer.addQuestion({
    type: 'list',
    message: 'Round II:',
    options: ['[Move to Round III]'],
    action: function (answer) {
        if (answer === '[Move to Round III]') {
            console.clear()
            engine.showBanner('Battle - Round III')
            console.log('Is that all you got ??');
            jedi.hitpoints -= darkLord.attackDamage;
            console.log(darkLord.name + ' attacked you with a Special Skill: ' + darkLord.skills[0].skillName + ', and you lost ' + darkLord.skills[0].damage + ' HitPoints');
            battleDashBoard();
        }
    }
}) // Round 2 Move
starDestroyer.addQuestion({ //Round 3
    type: 'list',
    message: 'Choose your Best Strategy:',
    options: ['[Counter]', '[Attack - Normal Hit]\n', '[Skill ' + jedi.skillsTypes[0].skillName, '[Skill ' + jedi.skillsTypes[1].skillName],
    action: function (answer) {
        if (answer === '[Counter]') { // normal attack = 0; counter attack = 1
            if (timesCountered >= 2) {
                console.clear()
                engine.showBanner('Battle - Round III')
                console.log('You failed to CounterAttack your Oponnent! You suffered the hit with a total damage of ' + darkLord.attackTypes[0].damage);
                jedi.hitpoints -= darkLord.attackTypes[0].damage;
                console.log('Your total of HitPoints now are: ', jedi.hitpoints);
            } else if (timesCountered < 2) {
                console.clear()
                engine.showBanner('Battle - Round III')
                console.log('You CounterAttacked your opponent and dealt a total damage of ' + jedi.attackTypes[1].damage)
                darkLord.hitpoints -= jedi.attackTypes[1].damage;
                timesCountered += 1;
            }
        } else if (answer === '[Attack]') {
            console.clear()
            engine.showBanner('Battle - Round III')
            console.log('\nYou attacked ' + darkLord.name);
            darkLord.hitpoints -= jedi.attackTypes[0].damage;
            console.log(darkLord.name + ' has now ' + darkLord.hitpoints + ' HitPoints left.\n');
        } else if (answer === '[Skill ' + jedi.skillsTypes[0].skillName) {
            console.clear()
            engine.showBanner('Battle - Round III')
            console.log('You attacked your opponent with ' + jedi.skillsTypes[0].skillName + ' and dealt a total damage of ' + jedi.skillsTypes[0].damage + ' HitPoints.');
            console.log(darkLord.name + ' has now a total of ' + darkLord.hitpoints + ' HitPoints.');
        } else if (answer === '[Skill ' + jedi.skillsTypes[1].skillName) {
            console.clear()
            engine.showBanner('Battle - Round III')
            console.log('You attacked your opponent with ' + jedi.skillsTypes[1].skillName + ' and dealt a total damage of ' + jedi.skillsTypes[1].damage + ' HitPoints.')
            console.log(darkLord.name + ' has now a total of ' + darkLord.hitpoints + ' HitPoints.')
        }
        fightRound += 1;
    }
}) // Round 3 Attack
starDestroyer.addQuestion({
    type: 'list',
    message: 'Round III:',
    options: ['[Move to Round IV]'],
    action: function (answer) {
        if (answer === '[Move to Round IV]') {
            console.clear()
            engine.showBanner('Battle - Round III')
            console.log('Is that all you got ??');
            jedi.hitpoints -= darkLord.attackDamage;
            console.log(darkLord.name + ' attacked you with a Special Skill: ' + darkLord.skills[0].skillName + ', and you lost ' + darkLord.skills[0].damage + ' HitPoints');
            battleDashBoard();
        }
    }
}) // Round 3 Move





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
        }
    }
})

// RUN GAME
engine.run();


/*
* KNOWN BUGS:
* When you go to cantina and find new vulnerabilities, somehow it corupts the number of hours left to train in jedi temple.
*
* TODO: Edit the outputs with colored backgrounds and fonts
 */
