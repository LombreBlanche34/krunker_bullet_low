const defaults = {
    lombre_bullet_low_percentage: 25,
    lombre_bullet_low_color_crit: "#FF0000"
}

// Initialize localStorage if values don't exist
Object.keys(defaults).forEach(key => {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, defaults[key]);
        console.log(`[LombreScripts] [bullet_low.js] ${key} created with default value: ${defaults[key]}`);
    }
});


// Load configuration
const config = {
    PERCENTAGE: parseInt(localStorage.getItem('lombre_bullet_low_percentage')),
    COLOR_CRIT: localStorage.getItem('lombre_bullet_low_color_crit')
};

function waitForElement(selector, callback) {
    const checkExist = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(checkExist);
            callback(element);
        }
    }, 100);
}

// wait until both elements are visible
Promise.all([
    new Promise(resolve => waitForElement("#ammoVal", resolve)),
    new Promise(resolve => waitForElement("#ammoMax", resolve))
]).then(([ammoElement, ammoMaxElement]) => {

    function updateAmmoColor() {
        const currentText = ammoElement.textContent.trim();
        const maxText = ammoMaxElement.textContent.trim();

        if (currentText === "-") return;

        // Extract text and remove the |
        const maxValue = parseInt(maxText.replace("|", "").trim(), 10);
        const currentValue = parseInt(currentText, 10);

        if (!isNaN(currentValue) && !isNaN(maxValue)) {
            const percentage = (currentValue / maxValue) * 100;

            if (percentage < config.PERCENTAGE) {
                ammoElement.style.color = config.COLOR_CRIT;
            } else {
                ammoElement.style.color = ""; // color by default
            }
        }
    }

    // Observe ammoVal
    const observerVal = new MutationObserver(updateAmmoColor);
    observerVal.observe(ammoElement, {
        childList: true,
        characterData: true,
        subtree: true
    });

    // Observe AmooMax
    const observerMax = new MutationObserver(updateAmmoColor);
    observerMax.observe(ammoMaxElement, {
        childList: true,
        characterData: true,
        subtree: true
    });

    updateAmmoColor(); // check when available
});

console.log(`[LombreScripts] [bulletLow.js] Configuration loaded`, config);
