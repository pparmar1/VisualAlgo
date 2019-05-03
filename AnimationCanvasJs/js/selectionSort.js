let timeoutId=0;
let start=0;
let speed = 1000;
let play=false;
//default array
let array = [50, 90, 30, 70, 60, 10, 20, 40, 80];
let resetArray = [50, 90, 30, 70, 60, 10, 20, 40, 80];
let customArray=[];
let resetCustomArray = [];
let resetFlag = false;
window.onload = function () {

    function renderChart(array) {
        let dataPoint = [];
        //console.log(array);
        for (let i = 0; i < array.length; i++) {
            dataPoint.push({y: array[i], indexLabel: array[i].toString(), color: null});
        }
        //console.log(dataPoint);
        let chartData = {
            animationEnabled: false,
            //backgroundColor: "#333",
            //theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                //text: "Selection sort"
            },
            axisX: {
                lineColor: "white",
                tickColor: "white",
                labelFontColor: "white"
            },
            axisY: {
                title: "",
                gridColor: "white",
                labelFontColor: "white",
                tickColor: "white",
                lineColor: "white"
            },
            data: [{
                type: "column",
                color: "#4682B4",
                dataPoints: dataPoint
            }]
        };
        return chartData;
    }

    chart = new CanvasJS.Chart("chartContainer", renderChart(array));
    chart.render();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

      function minIndex(a, i, j) {
        if (i == j)
            return i;
        // Find minimum of remaining elements
        let k = minIndex(a, i + 1, j);
        //traceCode("code2");
        //traceCode('code3');
        // Return minimum of current and remaining.
        return (a[i] < a[k]) ? i : k;


    }

     async function recurSelectionSort(a, n, index) {
         console.log(a);
         timeoutId = await setTimeout(async () => {
             // Return when starting and size are same
             if (index == n)
                 return;
             // calling minimum index function for minimum index
            // traceCode("code1");
             let k =  minIndex(a, index, n - 1);
             //traceCode("code5");
             // Swapping when index nd minimum index are not same
             if (k != index) {
                 // swap
               //  traceCode('code4');
                 let temp = a[k];
                 a[k] = a[index];
                 a[index] = temp;
                 //chart = new CanvasJS.Chart("chartContainer", renderChart(array));
                 chart = new CanvasJS.Chart("chartContainer", renderChart(a));
                 chart.render();
             }
             // Recursively calling selection sort function
             start = index;
             console.log("start in recur " + start);
             //traceCode("code1");
            // await sleep(1000);
             await recurSelectionSort(a, n, index + 1);
         }, speed);
    }

     function traceCode(code) {
        TweenMax.to(`#${code}`, 0.5, {color: "#4682b4", fontWeight: 'bold'})
        TweenMax.to(`#${code}`, 1, {color:'#000000',fontWeight: 'normal', delay:0.5});
    }


//Play or Pause animation for Selection Sort
    document.querySelector("#play").addEventListener("click", async () => {
        //console.log(array);
        let arrayToSort = [];
        if (customArray.length != 0) {
            arrayToSort = customArray;
            console.log("custom array");
        } else {
            if (resetFlag) {
                arrayToSort = resetArray;
                console.log("reset default array");
            } else {
                console.log("default array");
                console.log(array);
                arrayToSort = array;
            }
        }
        console.log(arrayToSort);
        if (!play) {
            await recurSelectionSort(arrayToSort, arrayToSort.length, start);
            document.querySelector("#play").innerHTML = "Pause";
            play = true;
        } else {
            if (timeoutId) {
                console.log(timeoutId+"cleared");
                clearTimeout(timeoutId);
            }
            console.log("i cleared it");
            document.querySelector("#play").innerHTML = "Play";
            play = false;
        }
    });
    //Reset the Selection Sort array
    document.querySelector("#reset").addEventListener("click", () => {
        resetFlag = true;
        if (customArray.length != 0) {
            console.log("custom array");
            console.log(resetCustomArray);
            customArray = resetCustomArray.slice(0);
            chart = new CanvasJS.Chart("chartContainer", renderChart(customArray));
            chart.render();
        } else {
            console.log("default array");
            chart = new CanvasJS.Chart("chartContainer", renderChart(resetArray));
            chart.render();
        }
        start = 0;
    });

    //to create a custom chart when submit button is clicked
    document.querySelector("#submit").addEventListener("click", () => {
        let string = document.querySelector("#create").value;
        console.log(string);
        customArray = string.split(',');
        customArray = customArray.map((elem) => {
            // console.log(elem);
            return parseInt(elem);
        });
        resetCustomArray = customArray.slice(0);
        console.log(customArray);
        console.log(resetCustomArray);
        chart = new CanvasJS.Chart("chartContainer", renderChart(customArray));
        // console.log(chart);
        chart.render();
        start = 0;
    });

}
