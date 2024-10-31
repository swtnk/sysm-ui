const osNamePlaceholder = document.querySelector("#os-name");
const osVersionPlaceholder = document.querySelector("#os-version");
const osArchitecturePlaceholder = document.querySelector("#os-architecture");
const processorsAvailablePlaceholder = document.querySelector("#processors-available");
const applicationVersionPlaceholder = document.querySelector("#version-value");
const NOT_AVAILABLE = "N/A";

const populateDashboardRest = (baseUrl) => {
    const systemInfoEndpoint = `${baseUrl}/api/v1/system`;
    fetch(systemInfoEndpoint)
            .then((data) => data.json())
            .then((data) => {
        osNamePlaceholder.textContent = data?.operatingSystem?.name || NOT_AVAILABLE;
        osVersionPlaceholder.textContent = data?.operatingSystem?.version || NOT_AVAILABLE;
        osArchitecturePlaceholder.textContent = data?.operatingSystem?.architecture || NOT_AVAILABLE;
        processorsAvailablePlaceholder.textContent = data?.processor?.available || NOT_AVAILABLE;
        applicationVersionPlaceholder.textContent = "v" + data?.applicationVersion || "Version: " + NOT_AVAILABLE;
    });
}
