var skillchecks = 0, // The number of skill checks the user has seen
rotation = 1, // Rotation of the tic in degrees
alertduration = 900, // The duration between the alert sound and the skill check's appearance
randomrotation = 0, // The randomized rotation of the skill check
madnessChance = 0, // The chance for a Madness skill check to occur
madnessShake = 0; // Used inside rotateTic() so that the skill check is moved during a madness skill check only every 50 milliseconds (every 10th tic movement)

var keyPressed = false, // Checks if the key is already pressed during this skill check
started = false, // Checks if the game is already started
dontplay = false, // Checks whether a skill check alert shouldn't be played
autodidact = false, // Checks if Autodidact is in use
decisivestrike = false, // Checks if Decisive Strike / Overcharge is in use
useMadness = false, // Checks if the skill check should be a Madness skill check
allowKeyPress = false; // Checks if a skill check is on the screen already, allowing the user to press space

// Activates when the user presses start, informs that the game has either started or stopped
function toggleStarted() {
    started = !started;
    if (started) {
        startbutton.style.backgroundColor = "#c40";
        startbutton.style.borderColor = "#c10";
        startbutton.innerHTML = "Stop";
        start();
    } else {
        startbutton.style.backgroundColor = "#0d3";
        startbutton.style.borderColor = "#0a3";
        startbutton.innerHTML = "Start";
    }
}

// Inform that the space key has not been pressed yet, create a random rotation for the skill check and a random time (between 1 and 2 seconds) for the skill check to occur
function start() {
    keyPressed = false;
    randomrotation = 15 + Math.floor(Math.random() * 12) * 15;
    var randomtime = Math.floor(Math.random() * 1001) + 1000;
    setTimeout(function () {
        if (started) {
            playalert();
            setTimeout(newSkillcheck, alertduration);
            setTimeout(rotateTic, alertduration);
        }
    }, randomtime);
}

// Is called when a skill check has been completed. Resets the skill check to its original state, no longer allows key presses until the next skill check, and recalls start()
function end() {
    tic.style.transform = "rotate(0deg)";
    skillcheck.style.opacity = 0;
    rotation = 1;
    allowKeyPress = false;
    useMadness = false;
    start();
}

// Plays the alert sound for a skill check if Hex: Huntress Lullaby is not set to 5 tokens, also stops the sound and restarts it if it's already playing
function playalert() {
    if (!dontplay) {
        notifysound.pause();
        notifysound.currentTime = 0;
        notifysound.play();
    }
}

function newSkillcheck() {
    console.log(randomrotation);
    successzone.style.transform = "rotate(" + randomrotation + "deg)";
    skillcheck.style.marginLeft = "45vw";
    skillcheck.style.marginTop = "40vh";
    
    // Check for madness
    if (madnessChance != 0) {
        var randomize = Math.floor(Math.random() * 100);
        console.log("Madness: " + madnessChance + " Random: " + randomize);
        if (randomize <= madnessChance) {
            useMadness = true;
            var randomWidth = 25 + Math.floor(Math.random() * 56);
            var randomHeight = 10 + Math.floor(Math.random() * 56);
            skillcheck.style.marginLeft = randomWidth + "vw";
            skillcheck.style.marginTop = randomHeight + "vh";
        }
    }
    
    var opacity = 0.00;
    for (var i = 0; i < 4; i++) {
        opacity += 0.25;
        skillcheck.style.opacity = opacity;
    }
    allowKeyPress = true;
}

// Rotates the tic 2 degrees every 5 milliseconds
function rotateTic() {
    tic.style.transform = "rotate(" + rotation + "deg)";
    var posHorizontal = parseInt(skillcheck.style.marginLeft.split("v")[0]);
    var posVertical = parseInt(skillcheck.style.marginTop.split("v")[0]);
    rotation += 2;
	
	// If madness was determined to be used in newSkillcheck(), will move the skill check in a random direction every 50 milliseconds
    madnessShake++;
    if (useMadness && madnessShake > 10) {
        var rand = -1 + Math.floor(Math.random() * 3);
        posHorizontal += 0.025 * rand;
        rand = -1 + Math.floor(Math.random() * 3);
        posVertical += 0.025 * rand;
        skillcheck.style.marginLeft = posHorizontal + "vw";
        skillcheck.style.marginTop = posVertical + "vh";
        madnessShake = 0;
    }
	
	// Stops the rotation once Space is pressed
    if (keyPressed) {
        return;
    }
	
	// If the skill check goes a full round, it will automatically count as a missed skill check
    if (rotation == 361) {
        points.innerHTML = parseInt(points.innerHTML) - 100;
        save(parseInt(points.innerHTML), true);
        end();
        return;
    }
    setTimeout(rotateTic, 5);
}

// Is called when Space is pressed. Checks that the key has not already been pressed during said skill check and that the skill check is visible
function completeSkillcheck(e) {
    if (e.charCode == 32 && !keyPressed && allowKeyPress) {
        var currentrotation = rotation;
        var greatMin = 95 + randomrotation;
        var greatMax = 105 + randomrotation;
        var goodMin = 104 + randomrotation;
        var goodMax = 142 + randomrotation;
        
		// If Autodidact or Decisive Strike / Overcharge is in use, sets the good skill check zones accordingly
        if (autodidact) {
            goodMin = 95 + randomrotation;
            goodMax = 142 + randomrotation;
        }
        
        if (decisivestrike) {
            goodMin = 95 + randomrotation;
            goodMax = 112 + randomrotation;
        }
        
        keyPressed = true;
        var missed = false;
		
		// Great skill checks are only allowed if a special skill check is not active
        if (currentrotation > greatMin && currentrotation < greatMax && !(autodidact || decisivestrike)) {
            greatsound.pause();
            greatsound.currentTime = 0;
            greatsound.play();
            console.log("great!");
            points.innerHTML = parseInt(points.innerHTML) + 100;
        } else if (currentrotation > goodMin && currentrotation < goodMax) {
            goodsound.pause();
            goodsound.currentTime = 0;
            goodsound.play();
            console.log("good!");
            points.innerHTML = parseInt(points.innerHTML) + 50;
        } else {
            points.innerHTML = parseInt(points.innerHTML) - 100;
            missed = true;
        }
        save(parseInt(points.innerHTML), missed);
        setTimeout(end, 1000);
    }
}

// Saves the points, amount of skill checks, average points per skill check the version number of SCS in a cookie that is set to expire after a year
// (Add a checking functionality here to make sure people don't try to cheat by editing with inspect element)
function save(pointcount, missed) {
    skillchecks++;
	
	// Extra points are awarded depending on which settings are active and if the skill check was not missed
    var extraPoints = 0;
    if (!missed) {
        switch(huntresslullaby.value) {
            case "1":
                extraPoints += 10;
                break;
            case "2":
                extraPoints += 20;
                break;
            case "3":
                extraPoints += 30;
                break;
            case "4":
                extraPoints += 40;
                break;
            case "5":
                extraPoints += 50;
        }
        
        if (useMadness) extraPoints += 50;
        
        if (decisivestrike) extraPoints += 50;
    }
    var average = Math.floor((pointcount + extraPoints) / skillchecks);
    points.innerHTML = parseInt(points.innerHTML) + extraPoints;
    averagepoints.innerHTML = average;
    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = "scscookie=" + points.innerHTML + "," + skillchecks + "," + average + "," + versionNumber.innerHTML + "; expires=" + d.toUTCString() + "; path=/";
}

// Is called when the site is loaded, checking the save cookie's validity and setting the points accordingly
function checkSave() {
    console.log(document.cookie);
    if (document.cookie.includes("scscookie")) {
        var cookieSplit = document.cookie.split("scscookie=");
        var stats = cookieSplit[1].split(",");
        if (stats.length < 4 || stats.length > 4) return;
        if (stats[3] != versionNumber.innerHTML) return;
        var pointsAmount = stats[0];
        var skillcheckAmount = stats[1];
        var average = stats[2];
        console.log(pointsAmount);
        console.log(skillcheckAmount);
        console.log(average);
        points.innerHTML = pointsAmount;
        skillchecks = parseInt(skillcheckAmount);
        averagepoints.innerHTML = average;
    }
}

// Is called when the user clicks "Reset Stats". Sets the cookie to a default stage that expires the moment the browser is closed
function removeSave() {
    var confirmed = confirm("Are you sure?");
    if (confirmed) {
        var d = new Date();
        d.setTime(d.getTime() - 1000 * 60 * 60 * 24);
        document.cookie = "scscookie=0,0,0,0.0.0; expires=" + d.toUTCString() + "; path=/";
        points.innerHTML = 0;
        averagepoints.innerHTML = 0;
        skillchecks = 0;
        console.log(document.cookie);
    }
}

// Is called when the user clicks the "Settings" button, displaying the div containing settings. Makes sure the settings screen is not opened mid-game
function openSettings() {
    if (!started) {
        overlay.style.display = "block";
        settings.style.display = "block";
        closebutton.style.display = "block";
    }
}

// Is called when the user clicks the "Save and Exit" button, closing the div containing settings
function closeSettings() {
    overlay.style.display = "none";
    settings.style.display = "none";
    closebutton.style.display = "none";
    
	// Checks if Hex: Huntress Lullaby is set and sets the time between the alert and the skill check accordingly
    switch(huntresslullaby.value) {
        case "default":
            alertduration = 900;
            dontplay = false;
            break;
        case "1":
            alertduration = 720;
            dontplay = false;
            break;
        case "2":
            alertduration = 540;
            dontplay = false;
            break;
        case "3":
            alertduration = 360;
            dontplay = false;
            break;
        case "4":
            alertduration = 180;
            dontplay = false;
            break;
        case "5":
            dontplay = true;
            break;
        default:
            alertduration = 900;
    }
    
	// Changes the graphical outlook of the skill check if a special skill check is used
    switch(specialsc.value) {
        case "default":
            autodidact = false;
            decisivestrike = false;
            successzone.src = "graphics/normal/normal100.png";
            break;
        case "ad":
            autodidact = true;
            decisivestrike = false;
            successzone.src = "graphics/autodidact/autodidact100.png";
            break;
        case "ds":
            autodidact = false;
            decisivestrike = true;
            successzone.src = "graphics/special/special100.png";
            break;
        default:
            autodidact = false;
            decisivestrike = false;
            successzone.src = "graphics/normal/normal100.png";
    }
    
	// Sets the chance for a madness skill check if it's set in the settings (30% for tier 1, 60% for tier 2)
    switch(madness.value) {
        case "default":
            madnessChance = 0;
            break;
        case "tier1":
            madnessChance = 29;
            break;
        case "tier2":
            madnessChance = 59;
            break;
        default:
            madnessChance = 0;
    }
}

// Is called when user clicks anywhere inside the settings div, changing the percentage at the bottom of the settings div if needed
function changedSettings() {
    
}

var tic = document.getElementById("tic"), // The graphical element for the skill check tic image
        skillcheck = document.getElementById("skillcheck-wrapper"), // The HTML element for the skill check as a whole
        successzone = document.getElementById("skillcheck"), // The graphical element for the skill check ring image
        notifysound = document.getElementById("notify"), // The sound file for the skill check alert
        goodsound = document.getElementById("good"), // The sound file for good skill checks
        greatsound = document.getElementById("great"), // The sound file for great skill checks
        points = document.getElementById("points"), // The HTML element for the user's point
        averagepoints = document.getElementById("average"), // The HTML element for the average points per skill check
        startbutton = document.getElementById("button-start"), // The HTML element for the Start button
        settingsbutton = document.getElementById("button-settings"), // The HTML element for the Settings button
        closebutton = document.getElementById("button-close"), // The HTML element for the Save and Exit button
        overlay = document.getElementById("settings-wrapper"), // The HTML element for the transparent black background behind the settings window
        settings = document.getElementById("settings"), // The HTML element for the settings window
        specialsc = document.getElementById("special"), // The drop down menu for Autodidact and Decisive Strike / Overcharge 
        madness = document.getElementById("madness"), // The drop down menu for the Madness tier
        huntresslullaby = document.getElementById("huntresslullaby"), // The drop down menu for Hex: Huntress Lullaby tokens
        versionNumber = document.getElementById("version"); // The HTML element containing the current version of Skill Check Simulator