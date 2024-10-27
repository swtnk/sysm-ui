const systemInfoEndpoint = `${baseUrl}/api/v1/system`;

const osNamePlaceholder = document.querySelector("#os-name");
const osVersionPlaceholder = document.querySelector("#os-version");
const osArchitecturePlaceholder = document.querySelector("#os-architecture");
const processorsAvailablePlaceholder = document.querySelector("#processors-available");

fetch(systemInfoEndpoint)
        .then((data) => data.json())
        .then((data) => {
    osNamePlaceholder.textContent = data?.operatingSystem?.name;
    osVersionPlaceholder.textContent = data?.operatingSystem?.version;
    osArchitecturePlaceholder.textContent = data?.operatingSystem?.architecture;
    processorsAvailablePlaceholder.textContent = data?.processor?.available;
}) 