//Imports:
var engine = require('workshop-engine');

//Global Variables:
var readRules = false;
var maximumHoursTraining = 24;
var trainedHours = 0;
var maximumHoursInCave = 8;
var hoursInCave = 0;
var attunement = 0;
var jedi = {
    jediName: '', // your Jedi name
    forcePower: 0, // force power gained meditating at the Jedi Temple
    bountyValue: 0, // starts at 0, if it reaches 100 you get busted and 0 -100
    fear: 0, // starts at 0, if it reaches 100 you join the Dark side and lose the game 0 - 100
    vulnerabilities: 0, // number of vulnerabilities found max 20, needed 15 to enter in 2 last scene.
    jediGrade: '',
    jediKnight: false, // boolean to indicate if the player has reached
    hitpoints: 30 // your current hitpoints
}
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
vulFinded = [];
ancientTexts = [
    {chapter: 1, technique: '□Fo□□rc□e L□ea□p□□'},
    {chapter: 2, technique: 'T□ra□□n□□□s□fe□r F□o□rc□e□□'},
    {chapter: 3, technique: 'Fo□□rc□e B□urs□t'},
    {chapter: 4, technique: '□□M□alac□i□a'},
    {chapter: 5, technique: '□Fo□rce□□ We□a□□po□n'}
];

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
const checkJediGrade = function () {
    if (jedi.fear >= 70) {
        jedi.jediGrade = 'Jedi Knight';
    }
    else if (jedi.fear >= 16 && jedi.fear < 70) {
        jedi.jediGrade = 'Jedi-Padawan';
    }
    else if (jedi.fear <= 15) {
        jedi.jediGrade = 'Jedi-Youngling';
    }
    return jedi.jediGrade;
} //Calculates Jedis Grades
const playerDashBoard = function() {
    console.log(
        'Player: ' + jedi.jediName +
        '\nJedi Rank: ' + jedi.jediGrade +
        '\nForce Power: ' + jedi.forcePower +
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

//Calculations && Functions:
const randomIntFromInterval = function (min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
} //To generate a random number for Vulnerabilities.
const calculatePower = function () { //Calculate Power: Change the values as intended.
    if(trainedHours <= 5){
        jedi.forcePower += randomIntFromInterval(0,150);
    } else if(trainedHours > 5 && trainedHours <= 10){
        jedi.forcePower += randomIntFromInterval(150, 225);
    } else if(trainedHours > 10 && trainedHours <= 20){
        jedi.forcePower += randomIntFromInterval(225, 285);
    } else if(trainedHours > 20 && trainedHours <= 24) {
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
const calculateHoursTrained = function(answer){
    maximumHoursTraining -= answer;

    return maximumHoursTraining
}
const look4Vuls = function () {//Find new Vulnerabilities:
    if(vulFinded.length !== vulToBeFound.length) {
        let randomNumber = randomIntFromInterval(0,vulToBeFound.length);
        let counter = 0;

        if(jedi.fear >= 43) {
            console.log('Fear high');
            if (randomNumber >= 2 && randomNumber <= 10) {
                randomNumber = Math.floor(randomNumber / 2);
            } else if (randomNumber > 10 && randomNumber <= 20) {
                randomNumber = Math.floor(randomNumber / 4);
            }
        }

        console.log('\nYou discovered: ');
        for(counter; counter < randomNumber; counter++){
            let randomIndex = randomIntFromInterval(0,vulToBeFound.length);
            let index = vulToBeFound.indexOf(vulToBeFound[randomIndex]);
            let poppedVul = vulToBeFound.splice(index, 1);
            console.log(": " + poppedVul);
            vulFinded.push(poppedVul);
            counter ++;
        }
        //Calculate Bounty & Fear:
        jedi.vulnerabilities += (counter/2);
        jedi.bountyValue += randomIntFromInterval(1, 30);
        jedi.fear += randomIntFromInterval(1, 20);
        //Checks:
        checkFear();
        checkBounty();
        checkJediGrade();
        //Return:
        console.log('You now have: ' + vulFinded.length + ' known vulnerabilities!\n');
    }
}

//STAGES: CREATION OF ALL STAGES:
var entryStage = engine.create({
    type: 'before',
    name: 'Entry Stage'
});
var rulesStage = engine.create({
    type: 'stage',
    name: '[Rules page]'
})
var myStatus = engine.create({
    type: 'stage',
    name: '[My Profile]'
})
var quitgame = engine.create({
    type: 'stage',
    name: '[Quit Game]'
})
var jediTemple = engine.create({
    type: 'stage',
    name: '-- S T A G E S: --\n  [Jedi Temple]'
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
    name: '[Star Destroyer]\n  -- - - - - --'
})

//CREATION OF BOSS: Sith Lord
var sithLord = {
    name: 'Darth Vader',
    hitpoints: 45,
    counterImmune: false
};

//STAGE: myStatus -> OK
myStatus.executeBefore(function(){
    console.clear()
    engine.showBanner(jedi.jediGrade)
})
myStatus.executeAfter(function() {playerDashBoard()})

//STAGE: ENTRY -> OK
entryStage.executeBefore(function(){
    console.clear()
    engine.showBanner("Star Wars")
})

entryStage.addQuestion({
    type: 'input',
    message: 'Hello! Say your name young jedi:',
    validator: function(answer){
        if (answer.length === 0) {
            return 'You should have a name longer than that... '
        }},
    action: function(answer) {
        jedi.jediName = answer;
    }
})
entryStage.addQuestion({
    type: 'list',
    message: 'You are about to enter in World of Star Wars. Are you ready?',
    options: ['[Yes]', '[No]'],
    action: function(answer) {
        if (answer === '[Yes]') {
            console.log('\nWelcome ' + jedi.jediName + '! I hope you enjoy it!');
        }
        else {
            console.log('Ok, cya later!');
            engine.quit();
        }
    }
})

entryStage.executeAfter(function(){
    jedi.jediGrade = checkJediGrade();
    console.log('Before proceeding, you must accept the Rules. Goto -> "Rules page"\n');
})

//RULES PAGE -> OK
rulesStage.executeBefore(function(){
    console.clear()
    engine.showBanner('Rules')
})

rulesStage.addQuestion({
    type: 'list',
    message: 'You agree in following all the rules ?\n    . Defeat the Sith Lord to Win;\n    . Find vulnerabilities to infiltrate the Star Destroyer;\n    . Learn force techniques through ancient texts;\n\n    . Be careful with the following rules:\n    . All of your actions will increase your fear;\n    . If your bounty value or fear reaches 100, you lose;\n    . If your fear becomes higher than 70, you are experienced enough and become a Jedi Knight;\n    . When you become a Jedi Knight, and pull together 15 vulnerabilities, you are ready to defeat the Dark Lord.\n',
    options: ['[Yes, I Agree with the Rules]', '[No, I didn\'t even read it]'],
    action: function(answer){
        if (answer === '[Yes, I Agree with the Rules]') {
            console.log('\nYou are now ready to proceed with the game!');
            readRules = true;
        }
        else {
            console.log('I knew you weren\'t the Jedi that we are looking for! Get out of here!');
            engine.quit();
        }
    }
})

//STAGE: JEDI TEMPLE -> OK
jediTemple.executeBefore(function() {
    console.clear()
    if (!readRules) {
        console.log('You did not accept the rules. Go to Menu Rules First.');
        return false
    } else{
        engine.showBanner("Room: Jedi Temple")
    }
});

jediTemple.addQuestion({
    type: 'input',
    message: 'How many hours you want to be connecting with Force?',
    validator: function(answer) {
        if(!answer) {
            return 'Type amount of hours: '
        }else if(isNaN(answer)){
            return 'Type numbers only: '
        }else if (answer > maximumHoursTraining) {
            return 'You can only be here for 24 hours. You have ' + maximumHoursTraining + 'hours remaining.'
        }
        trainedHours = answer;
    }
})

jediTemple.executeAfter(function() {
    if(!readRules){
        return false;
    } else{
        calculateFear();
        calculateAttunement();
        calculatePower();
        maximumHoursTraining -= trainedHours;

        console.log('\nYou trained for ' + trainedHours + ' hours. You have ' + maximumHoursTraining + ' hours left yet.\nForce Power Obtained: ' + Math.floor(trainedHours * attunement));
        console.log('Your Fear raised to: ' + jedi.fear + '\n')

        checkJediGrade(); //TODO: Must create a one-only-function to make all the necessary checks like this one for example.
    }
});

//STAGE: CANTINA -> OK
cantina.executeBefore(function(){
    console.clear()
    if (!readRules) {
        console.log('You did not accept the rules. Go read them first.');
        return false
    }else{
        engine.showBanner('Room: Cantina')
    }
});

cantina.addQuestion({
    type: 'list',
    message: '\nChoose an option: ',
    options: ['Find New Vulnerabilities', 'Vulnerabilities already known\n', 'Use MindTrick to lower your Bounty', 'Get Back'],
    action: function(answer){
        if(!readRules){
            console.log('You did not accept the rules. Go read them first.');
            return false
        }else{
            if(answer === 'Find New Vulnerabilities') {
                console.log('\nLet me see what you found so far...');
                if(vulFinded.length === 0){
                    console.log('\nLooks like you didn\'t find any vulnerability yet... Lets find some.');
                    look4Vuls();
                }
                else if(vulFinded.length > 0 && vulFinded.length < 15){
                    console.log('Hummm... you already found ' + vulFinded.length + ' vulnerabilities.')
                    console.log('However, if you want to be ready to fight the Dark Lord, you will need at least 15 vulnerabilities found.\nLet\'s look for some more.');
                    look4Vuls();
                }
                else if(vulFinded.length >= 15){
                    console.log('You have more vulnerabilities known that enough to enter in Star Destroyer and fight the Dark Lord!');
                    console.log('Star Destroyer Vulnerabilities you discover: \n');
                    for( var i = 0; i < vulFinded.length; i++){
                        console.log(vulFinded[i]);
                    }
                }
                else if(vulFinded.length === 20){
                    console.log('\nYou already found all the vulnerabilities available.');
                }
            } //Tested and working
            else if(answer === 'Vulnerabilities already known\n'){
                if (vulFinded.length === 0) {
                    console.log("You don't know any vulnerabilities yet. Keep searching.")
                }
                else if(vulFinded.length > 0){
                    console.log("\nSo far you discovered:" + vulFinded.length);
                    for( var i = 0; i < vulFinded.length; i++){
                        console.log(vulFinded[i]);
                    }
                }
            } //Tested and working
            else if(answer === 'Use MindTrick to lower your Bounty'){
                console.log('\nLets Lower your Bounty by using what you were taught in Jedis School.\nClear your mind...\nFocus...');

                let initialBounty = [];
                initialBounty.push(jedi.bountyValue);

                if(jedi.bountyValue > 50){
                    jedi.bountyValue -= randomIntFromInterval(5, 45);
                    jedi.forcePower -= randomIntFromInterval(5, 200);
                }

                console.log('\nNice! you decreased your bounty by ' + (initialBounty[0] - jedi.bountyValue));
                console.log(jedi.bountyValue + ' initialBounty before calcs: ' + initialBounty[0]);
            }
            else if(answer === 'Get Back'){
                return('\nReturning to Menu')
            }
            else{
                return 'Select one of the available options.'
            }
        }
        trainingHours = answer;
        return maximumHoursTraining -= trainingHours; //If player only choose to play 8 hours, can play the rest of 24 hours minus 8 later.
    }
})

cantina.executeAfter(function(){
    checkJediGrade();
})

//STAGE: AHCH-TO
ahchto.executeBefore(function(){
    console.clear()
    if (!readRules) {
        console.log('You did not accept the rules. Go read them first.');
        return false
    }else{
        engine.showBanner('Room: Ahch-To')
    }
})

ahchto.addQuestion({
    type: 'input',
    message: 'How many hours you want to spend in the Mirror Cave?',
    validator: function(answer) {
        if(!answer) {
            return 'Type amount of hours: '
        }else if(isNaN(answer)){
            return 'Type numbers only: '
        }else if (answer > maximumHoursInCave) {
            return 'You can only be here for 8 hours. You have ' + maximumHoursInCave + 'hours remaining.'
        }
        hoursInCave = answer;
    }
})

ahchto.executeAfter(function(){
    if(!readRules){
        console.log('You did not accept the rules. Go read them first.');
        return false
    } else{
        jedi.fear = Math.floor(jedi.fear / hoursInCave); //reduce Fear change formula as intended.
        jedi.forcePower = Math.floor(jedi.forcePower - (28*hoursInCave)); //reduce ForcePower 28 per hour. Change this value as inteded.
        console.log('After being in the cave, you have lost fear!\nCurrent fear: ' + jedi.fear)
        maximumHoursInCave -= hoursInCave;

        checkJediGrade();
    }
})

//STAGE: JEDI TRAINING
jediTrain.executeBefore(function(){
    console.clear()
    if (!readRules) {
        console.log('You did not accept the rules. Go read them first.');
        return false
    }else{
        if(jedi.jediGrade === 'Jedi Knight'){
            engine.showBanner('Room: Jedi Training')
            console.log('If you want to defeat Sith Lord, you will need new Skills!')
        }else{
            console.log('Dear ' + jedi.jediGrade + ' you have much to learn before learning this special Skills. Graduate a bit more and come back.')
            return false
        }
    }
})

jediTrain.addQuestion({
    type: 'list',
    message: 'Do you want to learn new Skills?',
    options: ['[Yes]', '[No]'],
    action: function(answer) {
        if (answer === '[Yes]') {
            console.log('\nOk! Let me show you some Ancient Texts.');
        }
        else {
            console.log('Ok, Come Back when you are ready!');
            return false
        }
    }
})

jediTrain.executeAfter(function(){
    if (answer === '[Yes]') {
        console.log('\nOk! Let me show you some Ancient Texts.');
    }
    else {

        checkJediGrade();
    }
})

//QUIT GAME -> OK
quitgame.executeBefore(function(){
    console.clear()
    engine.showBanner('Quit ? = (')
})

quitgame.addQuestion({
    type: 'list',
    message: 'Are you sure you want to quit game?',
    options: ['[Yes]', '[No]'],
    action: function(answer){
        if (answer === '[Yes]') {
            console.log('\nHave a nice day!');
            engine.quit();
        }
    }
})

// RUN GAME
engine.run();
