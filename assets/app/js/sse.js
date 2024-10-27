const memoryEndpoint = `${baseUrl}/api/v1/sse/memory`;

// PHYSICAL MEMORY DATA ELEMENTS
const physicalMemoryTotalPlaceholder = document.querySelector("#physical-memory-total");
const physicalMemoryUsedPlaceholder = document.querySelector("#physical-memory-used");
const physicalMemoryFreePlaceholder = document.querySelector("#physical-memory-free");
const physicalMemoryUsagePlaceholder = document.querySelector("#physical-memory-usage");

const physicalMemoryUsageGraph = echarts.init(physicalMemoryUsagePlaceholder);

// SWAP SPACE DATA ELEMENTS
const swapSpaceTotalPlaceholder = document.querySelector("#swap-space-total");
const swapSpaceUsedPlaceholder = document.querySelector("#swap-space-used");
const swapSpaceFreePlaceholder = document.querySelector("#swap-space-free");
const swapSpaceUsagePlaceholder = document.querySelector("#swap-space-usage");

const swapSpaceUsageGraph = echarts.init(swapSpaceUsagePlaceholder);

// CPU DATA ELEMENTS
const cpuInstantUsagePlaceholder = document.querySelector("#instant-cpu-usage");
const cpuHistoryUsagePlaceholder = document.querySelector("#cpu-usage-history");

const cpuInstantUsageGraph = echarts.init(cpuInstantUsagePlaceholder);
const cpuHistoryUsageGraph = echarts.init(cpuHistoryUsagePlaceholder);

// EVENT SOURCE
const eventSource = new EventSource(`${memoryEndpoint}`);

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
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
                formatter: function (value) {
                    const date = new Date(value);
                    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                }
            }
        }
    ],
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
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
                formatter: function (value) {
                    const date = new Date(value);
                    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                }
            }
        }
    ],
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
                distance: -30,
                length: 8,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
            splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                    color: '#fff',
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
        trigger: 'axis'
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
                const date = new Date(value);
                return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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

physicalMemoryUsageGraph.setOption(memoryOption);
swapSpaceUsageGraph.setOption(swapOption);
cpuInstantUsageGraph.setOption(cpuInstantOption);
cpuHistoryUsageGraph.setOption(cpuHistoryOption);

// RESOURCE UTILIZATION EVENT LISTENER
eventSource.addEventListener("resource-utilization", (event) => {
    const data = JSON.parse(event.data);

    const physicalMemoryTotal = data?.memory?.physical?.total;
    const physicalMemoryUsed = data?.memory?.physical?.used;
    const physicalMemoryFree = data?.memory?.physical?.free;

    const swapSpaceTotal = data?.memory?.swap?.total;
    const swapSpaceUsed = data?.memory?.swap?.used;
    const swapSpaceFree = data?.memory?.swap?.free;

    const cpuUsage = isNaN(data?.cpuLoad) ? 0 : data?.cpuLoad;

    physicalMemoryTotalPlaceholder.textContent = physicalMemoryTotal;
    physicalMemoryUsedPlaceholder.textContent = physicalMemoryUsed;
    physicalMemoryFreePlaceholder.textContent = physicalMemoryFree;

    swapSpaceTotalPlaceholder.textContent = swapSpaceTotal;
    swapSpaceUsedPlaceholder.textContent = swapSpaceUsed;
    swapSpaceFreePlaceholder.textContent = swapSpaceFree;

    const currentTime = new Date();

    memoryOption.xAxis[0].data.push(currentTime);
    memoryOption.series[0].data.push((data?.memory?.physical?.used / data?.memory?.physical?.total).toPrecision(2) * 100);

    swapOption.xAxis[0].data.push(currentTime);
    swapOption.series[0].data.push(parseFloat(data?.memory?.swap?.used / data?.memory?.swap?.total).toPrecision(2) * 100);

    cpuInstantOption.series[0].data[0].value = parseFloat(cpuUsage * 100).toFixed(2);
    
    cpuHistoryOption.xAxis.data.push(currentTime);
    cpuHistoryOption.series[0].data.push(cpuInstantOption.series[0].data[0].value)

    physicalMemoryUsageGraph.setOption(memoryOption);
    swapSpaceUsageGraph.setOption(swapOption);
    cpuInstantUsageGraph.setOption(cpuInstantOption);
    cpuHistoryUsageGraph.setOption(cpuHistoryOption);

    if (memoryOption.xAxis[0].data.length > 100) {
        memoryOption.xAxis[0].data.shift();
        memoryOption.series[0].data.shift();
    }
    
    if (swapOption.xAxis[0].data.length > 100) {
        swapOption.xAxis[0].data.shift();
        swapOption.series[0].data.shift();
    }
    
    if (cpuHistoryOption.xAxis.data.length > 100) {
        cpuHistoryOption.xAxis.data.shift();
        cpuHistoryOption.series[0].data.shift();
    }


});
