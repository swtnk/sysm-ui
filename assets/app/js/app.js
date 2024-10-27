const body = document.body;
const themeToggleSwitch = document.querySelector("#themeToggleSwitch");
const theme = document.querySelector("[data-bs-theme]")
const dataHolder = document.querySelectorAll(".data");
const systemThemeSwitch = body.querySelector('#setSystemTheme');
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
const _div = document.createElement("div");
const _span = document.createElement("span");

// SPINNER ELEMENT START
const spinner = _div.cloneNode();
spinner.classList.add("spinner-border");
spinner.setAttribute("role", "status");
const spinnerInner = _span.cloneNode();
spinnerInner.classList.add("visually-hidden");
const hiddenText = document.createTextNode("Loading...");
spinnerInner.appendChild(hiddenText);
spinner.appendChild(spinnerInner);
// SPINNER ELEMENT END

dataHolder.forEach((e) => {
    e.appendChild(document.createTextNode("..."));
})

// THEME SETTING START

const windowColorScheme = window.matchMedia(`(prefers-color-scheme: ${DARK_THEME})`);

const isWindowColorSchemeDark = windowColorScheme.matches;

const setTheme = (t) => {theme.setAttribute("data-bs-theme", t);};

const applyWindowColorSchemeToTheme = () => {
    if (isWindowColorSchemeDark) {
        setTheme(DARK_THEME);
        themeToggleSwitch.checked = true;
    } else {
        setTheme(LIGHT_THEME);
        themeToggleSwitch.checked = false;
    }
}

if (systemThemeSwitch) {
    systemThemeSwitch.addEventListener('click', (element) => {
        window.localStorage.removeItem('theme');
        applyWindowColorSchemeToTheme();
    });
}

if (typeof Storage !== "undefined") {
    let selectedTheme = window.localStorage.getItem('theme');
    if (selectedTheme) {
        setTheme(selectedTheme);
        if (selectedTheme === DARK_THEME) {
            themeToggleSwitch.checked = true;
        } else {
            themeToggleSwitch.checked = false;
        }
    } else {
        applyWindowColorSchemeToTheme();
    }
} else {
    console.log('Your browser does not support theme memorisation. Applying system default.');
    applyWindowColorSchemeToTheme();
}

windowColorScheme.addEventListener('change', ({ matches }) => {
    if (matches) {
        setTheme(DARK_THEME);
        themeToggleSwitch.checked = true;
    } else {
        setTheme(LIGHT_THEME);
        themeToggleSwitch.checked = false;
    }
});

if (themeToggleSwitch) {
    themeToggleSwitch.addEventListener('change', (element) => {
        if (element.target.checked) {
            setTheme(DARK_THEME);
            window.localStorage.setItem('theme', DARK_THEME);
        } else {
            setTheme(LIGHT_THEME);
            window.localStorage.setItem('theme', LIGHT_THEME);
        }
    })
}

// THEME SETTING END
