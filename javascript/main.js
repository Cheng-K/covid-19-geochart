class DataQuery {

    constructor() {
        this.dataSource = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json';
        let request = new XMLHttpRequest();
        request.open("GET",this.dataSource);
        request.send();
        request.addEventListener("load",function(data) {
            dataQuery.parseData(data.target.response);

        });
    }

    parseData (results) {
        let parsedJson = JSON.parse(results);
        visualizer = new GeoMapVisualizer(parsedJson);
    }

}

class GeoMapVisualizer  {

    constructor (data) {
        this.dataSource = data;
        google.charts.load('current', {
            'packages':['corechart','geochart'],
        });
        google.charts.setOnLoadCallback(function (){
            visualizer.prepareData(data,"new_cases");
        });
    }

    prepareData (data,parametersToCatch,colorGradient = ["#FFFFFF","#A40000"]){
        let allDataRequired = []
        let header = ["Country",parametersToCatch];
        allDataRequired.push(header);
        for (let countryIso in data) {
            if (!countryIso.includes("OWID")) {
                let currentCountryData = []
                currentCountryData.push(data[countryIso]["location"]);
                if (data[countryIso][parametersToCatch] !== null) {
                    dateOfData = data[countryIso]["last_updated_date"];
                    currentCountryData.push(data[countryIso][parametersToCatch]);
                    allDataRequired.push(currentCountryData);
                }
            }
        }
        title.innerHTML = title.innerHTML  + dateOfData;
        this.drawRegionsMap(allDataRequired,colorGradient);

    }

    drawRegionsMap(requiredData,colorGradient) {
        var data = google.visualization.arrayToDataTable(requiredData);
        var options = {colorAxis:{colors:colorGradient},width: 1900,datalessRegionColor: "grey",backgroundColor : "whitesmoke" };
        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
    }

    clearMap() {
        document.getElementById("regions_div").innerHTML = '';
    }


}


let dataQuery = new DataQuery();
let title = document.querySelector(".title");
let dateOfData = "";
let visualizer;


// All buttons
document.getElementById("totalDeaths").addEventListener("click",function(e) {
    visualizer.clearMap();
    title.innerHTML = "Total Deaths as per ";
    visualizer.prepareData(visualizer.dataSource,"total_deaths");
});

document.getElementById("totalCase").addEventListener("click",function(e) {
    visualizer.clearMap();
    title.innerHTML = "Total Covid-19  case as per ";
    visualizer.prepareData(visualizer.dataSource,"total_cases");
});
document.getElementById("dailyCase").addEventListener("click",function(e) {
    visualizer.clearMap();
    title.innerHTML = "Daily Covid-19 case as per ";
    visualizer.prepareData(visualizer.dataSource,"new_cases");
});
document.getElementById("dailyDeaths").addEventListener("click",function(e) {
    visualizer.clearMap();
    title.innerHTML = "Daily Deaths as per ";
    visualizer.prepareData(visualizer.dataSource,"new_deaths");
});
document.getElementById("totalFullyVacPerHund").addEventListener("click",function(e) {
    visualizer.clearMap();
    visualizer.prepareData(visualizer.dataSource,"people_fully_vaccinated_per_hundred",["#565954","#32FF67"]);
    title.innerHTML = "Total Fully Vaccinated People Per Hundred";
});


