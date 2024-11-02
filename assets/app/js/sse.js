// PHYSICAL MEMORY DATA ELEMENTS
let graphs = new Set();
let eventSources = [];
const $processTable = $('#process-table');

const processNameFormatter = (index, row) => {
    const pName = row?.processName;
    return pName.length > 50 ? `${pName.substring(0, 50)}...` : pName;
}

const processDataTable = new DataTable("#process-table", {
    responsive: true,
    bPaginate: false,
    bInfo: false,
    order: [[3, 'desc'], [4, 'desc']],
    language: { search: '', searchPlaceholder: "Search" },
    layout: {
        topEnd: {
            search: true,
            buttons: ['copy', 'csv', 'excel', 'pdf', 'print', 'search'],
        }
    },
    columns: [
        {
            data: 'pid',
            title: 'PID',
            width: 60,
        },
        {
            data: 'processName',
            title: 'PROCESS',
            width: 200,
            render: (value, _, row) => {
                return value.length > 50 ? `${value.substring(0, 50)}...` : value;;
            }
        },
        {
            data: 'user',
            title: 'USER'
        },
        {
            data: 'cpuUsage',
            title: '%CPU',
            sortable: true
        },
        {
            data: 'memoryUsage',
            title: '%MEM',
            sortable: true
        },
        {
            data: 'cpuTime',
            title: 'TIME'
        },
        {
            data: 'elapsedTime',
            title: 'ELAPSED'
        }
    ],
    data: []
});


const physicalMemoryTotalPlaceholder = document.querySelector("#physical-memory-total");
const physicalMemoryUsedPlaceholder = document.querySelector("#physical-memory-used");
const physicalMemoryFreePlaceholder = document.querySelector("#physical-memory-free");
const physicalMemoryUsagePlaceholder = document.querySelector("#physical-memory-usage");
const diskUsage = document.querySelector("#disk-usage");
let storagePlaceholderCreated = false;

const physicalMemoryUsageGraph = echarts.init(physicalMemoryUsagePlaceholder);
graphs.add(physicalMemoryUsageGraph);

// SWAP SPACE DATA ELEMENTS
const swapSpaceTotalPlaceholder = document.querySelector("#swap-space-total");
const swapSpaceUsedPlaceholder = document.querySelector("#swap-space-used");
const swapSpaceFreePlaceholder = document.querySelector("#swap-space-free");
const swapSpaceUsagePlaceholder = document.querySelector("#swap-space-usage");

const swapSpaceUsageGraph = echarts.init(swapSpaceUsagePlaceholder);
graphs.add(swapSpaceUsageGraph);

// CPU DATA ELEMENTS
const cpuInstantUsagePlaceholder = document.querySelector("#instant-cpu-usage");
const cpuHistoryUsagePlaceholder = document.querySelector("#cpu-usage-history");

const cpuInstantUsageGraph = echarts.init(cpuInstantUsagePlaceholder);
const cpuHistoryUsageGraph = echarts.init(cpuHistoryUsagePlaceholder);

graphs.add(cpuInstantUsageGraph);
graphs.add(cpuHistoryUsageGraph);

// MEMORY OPTIONS
const memoryOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ['Total', 'Used', 'Free']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLabel: {
            formatter: function (value) {
                return timeFormat(value);
            }
        }
    }
    ,
    yAxis: [
        {
            type: 'value',
            name: 'Physical Memory (%)',
            min: 0,
            max: 100
        }
    ],
    series: [
        {
            name: 'Used',
            type: 'line',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: []
        }
    ]
};

// SWAP OPTION
const swapOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: ['Total', 'Used', 'Free']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:
    {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLabel: {
            formatter: function (value) {
                return timeFormat(value);
            }
        }
    }
    ,
    yAxis: [
        {
            type: 'value',
            name: 'Swap Space (%)',
            min: 0,
            max: 100
        }
    ],
    series: [
        {
            name: 'Used',
            type: 'line',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: []
        }
    ]
};

const cpuInstantOption = {
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    series: [
        {
            type: 'gauge',
            axisLine: {
                distance: 5,
                lineStyle: {
                    width: 10,
                    color: [
                        [0.3, '#67e0e3'],
                        [0.7, '#37a2da'],
                        [1, '#fd666d']
                    ]
                }
            },
            pointer: {
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                distance: 5,
                length: 5,
                lineStyle: {
                    color: '#2a67c9',
                    width: 2
                }
            },
            splitLine: {
                distance: -10,
                length: 20,
                lineStyle: {
                    color: '#2a67c9',
                    width: 4
                }
            },
            axisLabel: {
                color: 'inherit',
                distance: 20,
                fontSize: 15
            },
            detail: {
                valueAnimation: true,
                color: 'inherit',
                formatter: '{value} %',
                fontSize: 15
            },
            data: [
                {
                    value: 0,
                    name: "CPU Usage",
                    fontSize: 10
                }
            ]
        }
    ]
};

const cpuHistoryOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        boundaryGap: false,
        axisLabel: {
            formatter: function (value) {
                return timeFormat(value);
            }
        }
    },
    yAxis: {
        type: 'value',
        name: 'CPU Usage (%)',
        min: 0,
        max: 100
    },
    series: [
        {
            name: 'CPU Usage',
            type: 'line',
            data: [],
            smooth: true,
            lineStyle: {
                color: '#F5453D'
            }
        },
    ]
};

const diskPartitionElements = {};

const populateStorageUsage = (data, index, totalDiskPart, isLast = true) => {

    const storageOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['Total', 'Free', 'Usable']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis:
        {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
                formatter: function (value) {
                    return timeFormat(value);
                }
            }
        }
        ,
        yAxis: [
            {
                type: 'value',
                name: 'Disk Space',
                min: 0,
                max: 100
            }
        ],
        series: [
            {
                name: 'Usable',
                type: 'line',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: []
            },
            {
                name: 'Free',
                type: 'line',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: []
            }
        ]
    };

    const currentTime = new Date();

    if (!storagePlaceholderCreated) {
        diskUsage.innerHTML = "";
        const colDiv = _div.cloneNode();
        const cardTitle = _div.cloneNode();
        const rowDiv = _div.cloneNode();
        const dataDiv = _div.cloneNode();
        const graph = _div.cloneNode();
        const spanDataLabel = _span.cloneNode();
        const spanData = _span.cloneNode();
        const hr1 = _hr.cloneNode();
        const hr2 = _hr.cloneNode();

        rowDiv.classList.add("row");

        if (!isLast) {
            colDiv.classList.add("border-right");
        }

        if (totalDiskPart > 1) {
            colDiv.classList.add("col-sm-6");
        } else {
            colDiv.classList.add("col-sm-12");
        }

        dataDiv.classList.add("col-4");

        const colTotal = dataDiv.cloneNode();
        const colFree = dataDiv.cloneNode();
        const colUsable = dataDiv.cloneNode();

        cardTitle.classList.add("card-title", "h4", "text-center");
        spanDataLabel.classList.add("data-label", "h6", "fw-light");
        spanData.classList.add("data", "d-block", "fw-bold");
        colTotal.classList.add("border-right");
        colFree.classList.add("border-right");
        graph.classList.add("graph-memory");
        graph.setAttribute("id", "partition-" + (index + 1))

        const totalSpanDataLabel = spanDataLabel.cloneNode();
        const freeSpanDataLabel = spanDataLabel.cloneNode();
        const usableSpanDataLabel = spanDataLabel.cloneNode();
        const totalSpanData = spanData.cloneNode();
        const freeSpanData = spanData.cloneNode();
        const usableSpanData = spanData.cloneNode();

        cardTitle.appendChild(document.createTextNode(`${data?.path}`));

        totalSpanDataLabel.appendChild(document.createTextNode("Total"));
        freeSpanDataLabel.appendChild(document.createTextNode("Free"));
        usableSpanDataLabel.appendChild(document.createTextNode("Usable"));

        totalSpanData.appendChild(document.createTextNode(`${formatBytes(data?.totalSpace)}`));
        freeSpanData.appendChild(document.createTextNode(`${formatBytes(data?.freeSpace)}`));
        usableSpanData.appendChild(document.createTextNode(`${formatBytes(data?.usableSpace)}`));

        colTotal.appendChild(totalSpanDataLabel);
        colTotal.appendChild(totalSpanData);
        colFree.appendChild(freeSpanDataLabel);
        colFree.appendChild(freeSpanData);
        colUsable.appendChild(usableSpanDataLabel);
        colUsable.appendChild(usableSpanData);

        rowDiv.appendChild(colTotal);
        rowDiv.appendChild(colFree);
        rowDiv.appendChild(colUsable);

        colDiv.appendChild(cardTitle);
        colDiv.appendChild(hr1);
        colDiv.appendChild(rowDiv);
        colDiv.appendChild(hr2);
        colDiv.appendChild(graph);

        diskUsage.appendChild(colDiv);
        const storageGraph = echarts.init(graph);

        graphs.add(storageGraph);

        storageOption.xAxis.data.push(currentTime);
        storageOption.series[0].data.push(((data?.freeSpace / data?.totalSpace) * 100).toFixed(2));
        storageOption.series[1].data.push(((data?.usableSpace / data?.totalSpace) * 100).toFixed(2));

        storageGraph.setOption(storageOption);
        diskPartitionElements[data?.path] = {
            "totalSpanData": totalSpanData,
            "freeSpanData": freeSpanData,
            "usableSpanData": usableSpanData,
            "graph": storageGraph,
            "storageOption": storageOption
        }
    } else {
        let storageUpdateOption = diskPartitionElements[data?.path].storageOption;
        diskPartitionElements[data?.path].totalSpanData.textContent = formatBytes(data?.totalSpace);
        diskPartitionElements[data?.path].freeSpanData.textContent = formatBytes(data?.freeSpace);
        diskPartitionElements[data?.path].usableSpanData.textContent = formatBytes(data?.usableSpace);

        storageUpdateOption.xAxis.data.push(currentTime);
        storageUpdateOption.series[0].data.push(((data?.freeSpace / data?.totalSpace) * 100).toFixed(2));
        storageUpdateOption.series[1].data.push(((data?.usableSpace / data?.totalSpace) * 100).toFixed(2));
        diskPartitionElements[data?.path].graph.setOption(storageUpdateOption);

        if (storageUpdateOption.xAxis.data.length > 100) {
            storageUpdateOption.xAxis.data.shift();
            storageUpdateOption.series[0].data.shift();
            storageUpdateOption.series[1].data.shift();
        }
    }
}

const populateDashboardSse = (baseUrl) => {
    const resourceEndpoint = `${baseUrl}/api/v1/sse/resources`;
    const resourceEvent = "resource-utilization";

    // EVENT SOURCE
    const eventSource = new EventSource(`${resourceEndpoint}`);

    eventSources.push({
        "eventSource": eventSource,
        "listener": resourceEvent
    });

    physicalMemoryUsageGraph.setOption(memoryOption);
    swapSpaceUsageGraph.setOption(swapOption);
    cpuInstantUsageGraph.setOption(cpuInstantOption);
    cpuHistoryUsageGraph.setOption(cpuHistoryOption);

    // RESOURCE UTILIZATION EVENT LISTENER
    eventSource.addEventListener(resourceEvent, (event) => {
        const data = JSON.parse(event.data);

        const physicalMemoryTotal = data?.memory?.physical?.total;
        const physicalMemoryUsed = data?.memory?.physical?.used;
        const physicalMemoryFree = data?.memory?.physical?.free;
        const diskPartition = data?.diskPartition;

        const swapSpaceTotal = data?.memory?.swap?.total;
        const swapSpaceUsed = data?.memory?.swap?.used;
        const swapSpaceFree = data?.memory?.swap?.free;

        const cpuUsage = isNaN(data?.cpuLoad) ? 0 : data?.cpuLoad;

        physicalMemoryTotalPlaceholder.textContent = formatBytes(physicalMemoryTotal);
        physicalMemoryUsedPlaceholder.textContent = formatBytes(physicalMemoryUsed);
        physicalMemoryFreePlaceholder.textContent = formatBytes(physicalMemoryFree);

        swapSpaceTotalPlaceholder.textContent = formatBytes(swapSpaceTotal);
        swapSpaceUsedPlaceholder.textContent = formatBytes(swapSpaceUsed);
        swapSpaceFreePlaceholder.textContent = formatBytes(swapSpaceFree);

        const currentTime = new Date();

        memoryOption.xAxis.data.push(currentTime);
        memoryOption.series[0].data.push((data?.memory?.physical?.used / data?.memory?.physical?.total).toPrecision(2) * 100);

        swapOption.xAxis.data.push(currentTime);
        swapOption.series[0].data.push(parseFloat(data?.memory?.swap?.used / data?.memory?.swap?.total).toPrecision(2) * 100);

        cpuInstantOption.series[0].data[0].value = parseFloat(cpuUsage * 100).toFixed(2);

        cpuHistoryOption.xAxis.data.push(currentTime);
        cpuHistoryOption.series[0].data.push(cpuInstantOption.series[0].data[0].value)

        physicalMemoryUsageGraph.setOption(memoryOption);
        swapSpaceUsageGraph.setOption(swapOption);

        cpuInstantOption.toolbox.feature.saveAsImage.name = saveImageNameFormat("cpu_instant");
        cpuInstantUsageGraph.setOption(cpuInstantOption);

        cpuHistoryOption.toolbox.feature.saveAsImage.name = saveImageNameFormat("cpu_history");
        cpuHistoryUsageGraph.setOption(cpuHistoryOption, true);

        if (memoryOption.xAxis.data.length > 100) {
            memoryOption.xAxis.data.shift();
            memoryOption.series[0].data.shift();
        }

        if (swapOption.xAxis.data.length > 100) {
            swapOption.xAxis.data.shift();
            swapOption.series[0].data.shift();
        }

        if (cpuHistoryOption.xAxis.data.length > 100) {
            cpuHistoryOption.xAxis.data.shift();
            cpuHistoryOption.series[0].data.shift();
        }

        const totalDiskPart = data?.diskPartition.length;

        data?.diskPartition.forEach((data, index) => {
            if (index === diskPartition.length - 1) {
                populateStorageUsage(data, index, totalDiskPart, true);
                storagePlaceholderCreated = true;
            } else {
                populateStorageUsage(data, index, totalDiskPart, false);
            }
        });
    });
}

const showProcesses = (baseUrl) => {
    const processesEndpoint = `${baseUrl}/api/v1/sse/processes`;
    const resourceEvent = "processes";

    // EVENT SOURCE
    const eventSource = new EventSource(`${processesEndpoint}`);

    eventSources.push({
        "eventSource": eventSource,
        "listener": resourceEvent
    });

    eventSource.addEventListener(resourceEvent, (event) => {
        const data = JSON.parse(event.data);
        processDataTable.clear();
        processDataTable.rows.add(data?.processes);
        processDataTable.draw();
    });
}

window.onresize = () => {
    graphs.forEach((graph) => {
        graph.resize();
    });
}
