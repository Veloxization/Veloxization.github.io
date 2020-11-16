var items = [
    { item: document.getElementById("emf"), amount: document.getElementById("emf-amount"), number: 1, minAmount: 1, maxAmount: 2 },
    { item: document.getElementById("flashlight"), amount: document.getElementById("flashlight-amount"), number: 1, minAmount: 1, maxAmount: 4 },
    { item: document.getElementById("photo"), amount: document.getElementById("photo-amount"), number: 1, minAmount: 1, maxAmount: 3 },
    { item: document.getElementById("lighter"), amount: document.getElementById("lighter-amount"), number: 0, minAmount: 0, maxAmount: 2 },
    { item: document.getElementById("candle"), amount: document.getElementById("candle-amount"), number: 0, minAmount: 0, maxAmount: 4 },
    { item: document.getElementById("uv"), amount: document.getElementById("uv-amount"), number: 1, minAmount: 1, maxAmount: 2 },
    { item: document.getElementById("crucifix"), amount: document.getElementById("crucifix-amount"), number: 0, minAmount: 0, maxAmount: 2 },
    { item: document.getElementById("video"), amount: document.getElementById("video-amount"), number: 1, minAmount: 1, maxAmount: 6 },
    { item: document.getElementById("evp"), amount: document.getElementById("evp-amount"), number: 1, minAmount: 1, maxAmount: 2 },
    { item: document.getElementById("salt"), amount: document.getElementById("salt-amount"), number: 0, minAmount: 0, maxAmount: 2 },
    { item: document.getElementById("smudge"), amount: document.getElementById("smudge-amount"), number: 0, minAmount: 0, maxAmount: 4 },
    { item: document.getElementById("tripod"), amount: document.getElementById("tripod-amount"), number: 0, minAmount: 0, maxAmount: 5 },
    { item: document.getElementById("strongflash"), amount: document.getElementById("strongflash-amount"), number: 0, minAmount: 0, maxAmount: 4 },
    { item: document.getElementById("motion"), amount: document.getElementById("motion-amount"), number: 0, minAmount: 0, maxAmount: 4 },
    { item: document.getElementById("sound"), amount: document.getElementById("sound-amount"), number: 0, minAmount: 0, maxAmount: 4 },
    { item: document.getElementById("thermo"), amount: document.getElementById("thermo-amount"), number: 0, minAmount: 0, maxAmount: 3 },
    { item: document.getElementById("pills"), amount: document.getElementById("pills-amount"), number: 0, minAmount: 0, maxAmount: 4 },
    { item: document.getElementById("book"), amount: document.getElementById("book-amount"), number: 1, minAmount: 1, maxAmount: 2 },
    { item: document.getElementById("infrared"), amount: document.getElementById("infrared-amount"), number: 0, minAmount: 0, maxAmount: 4 },
    { item: document.getElementById("mic"), amount: document.getElementById("mic-amount"), number: 0, minAmount: 0, maxAmount: 2 },
    { item: document.getElementById("glowstick"), amount: document.getElementById("glowstick-amount"), number: 0, minAmount: 0, maxAmount: 2 },
    { item: document.getElementById("headcam"), amount: document.getElementById("headcam-amount"), number: 0, minAmount: 0, maxAmount: 4 }
];

var canLeave = document.getElementById("can-leave");

var zeroCheckbox = document.getElementById("hide-zeros");
var hideNonEssentials = true;

function toggleZeros() {
    if (zeroCheckbox.checked) {
        for (var i = 0; i < items.length; i++) {
            hideNonEssentials = true;
            if (items[i].number === 0) items[i].item.style.display = "none";
        }
    } else {
        for (var i = 0; i < items.length; i++) {
            hideNonEssentials = false;
            items[i].item.style.display = "block";
        }
    }
}

function randomise() {
    for (var i = 0; i < items.length; i++) {
        changeNumber(items[i]);
        checkIfHidden(items[i]);
    }
    if (Math.floor(Math.random() * 2)) canLeave.innerHTML = "Yes";
    else canLeave.innerHTML = "No";
}

function changeNumber(object) {
    object.number = Math.floor(object.minAmount + Math.random() * (object.maxAmount - object.minAmount + 1));
    object.amount.innerHTML = object.number;
}

function checkIfHidden(object) {
    if (object.number === 0 && hideNonEssentials) object.item.style.display = "none";
    else object.item.style.display = "block";
}