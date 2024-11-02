const body = document.body;
const themeToggleSwitch = document.querySelector("#themeToggleSwitch");
const theme = document.querySelector("[data-bs-theme]")
const dataHolder = document.querySelectorAll(".data");
const systemThemeSwitch = body.querySelector('#setSystemTheme');
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
const _div = document.createElement("div");
const _span = document.createElement("span");
const _hr = document.createElement("hr");

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

// FORMAT BYTES
const formatBytes = (bytes) => {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return `${size.toFixed(2)} ${units[i]}`;
}

// TIME FORMAT
const timeFormat = (value) => {
    const date = new Date(value);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
}

// SAVE IMAGE NAME FORMAT
const saveImageNameFormat = (prefix) => {
    const date = new Date();
    `${prefix}__${baseUrlField.value || defaultBaseUrl}__${timeFormat(new Date())}`;
    const url = (baseUrlField.value || defaultBaseUrl).replace(/:/g, '..').replace(/\//g, '-');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const dateTime = `${year}-${month}-${day}-${hours}..${minutes}..${seconds}`;
    return `${prefix}__${url}__${dateTime}`;
}
