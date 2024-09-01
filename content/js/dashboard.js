/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.30100965272385, "KoPercent": 0.6989903472761566};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04443581493398425, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2131979695431472, 500, 1500, "8_3_View Notifications"], "isController": false}, {"data": [0.007142857142857143, 500, 1500, "5_6_Enter OTP -> Continue"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "5_4_Click Add Beneficiary"], "isController": false}, {"data": [0.08079268292682927, 500, 1500, "2_3_Open My Transactions"], "isController": false}, {"data": [0.1323529411764706, 500, 1500, "7_5_Enter Purpose and Source -> Next -> Account Transfer -> Upload Bill -> Pay Now"], "isController": false}, {"data": [0.0259222333000997, 500, 1500, "0_3_Enter Username and Password > Sign In"], "isController": false}, {"data": [0.006944444444444444, 500, 1500, "5_5_Enter Bank Transfer Details -> Submit"], "isController": false}, {"data": [0.011494252873563218, 500, 1500, "4_6_Enter OTP -> Continue"], "isController": false}, {"data": [0.019087136929460582, 500, 1500, "0_1_Launch"], "isController": false}, {"data": [0.0, 500, 1500, "7_6_Enter OTP -> Continue"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "7_3_Click Send Money"], "isController": false}, {"data": [0.033950617283950615, 500, 1500, "9_3_Enter Username and Password > Sign In - InActive"], "isController": false}, {"data": [0.1588447653429603, 500, 1500, "6_5_Enter Purpose and Source -> Next -> Cash Counter -> Pay Now"], "isController": false}, {"data": [0.10810810810810811, 500, 1500, "5_3_Open My Beneficiaries"], "isController": false}, {"data": [0.08183856502242152, 500, 1500, "1_3_Open Forex Rates"], "isController": false}, {"data": [0.03932584269662921, 500, 1500, "4_5_Enter Cash Pickup Details > Submit"], "isController": false}, {"data": [0.06643356643356643, 500, 1500, "6_3_Click Send Money"], "isController": false}, {"data": [0.1875, 500, 1500, "3_4_Cancel One Transaction"], "isController": false}, {"data": [0.04746835443037975, 500, 1500, "9_2_Click Login with Mpin -> Enter Mpin > Sign In - InActive"], "isController": false}, {"data": [0.05, 500, 1500, "3_3_Open My Transactions"], "isController": false}, {"data": [0.005681818181818182, 500, 1500, "7_4_Select Beneficiery and Enter Amount -> Click Next"], "isController": false}, {"data": [0.02754677754677755, 500, 1500, "0_2_Click Login with Mpin -> Enter Mpin > Sign In"], "isController": false}, {"data": [0.005319148936170213, 500, 1500, "6_4_Select Beneficiery and Enter Amount -> Click Next"], "isController": false}, {"data": [0.14673913043478262, 500, 1500, "4_3_Open My Beneficiaries"], "isController": false}, {"data": [0.0, 500, 1500, "6_6_Enter OTP->Continue"], "isController": false}, {"data": [0.02197802197802198, 500, 1500, "4_4_Click Add Beneficiary"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9013, 63, 0.6989903472761566, 19815.52268944859, 57, 182161, 17414.0, 38543.8, 62795.99999999997, 84825.02000000006, 6.52566934629634, 141.2856003990936, 407.23737909062555], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["8_3_View Notifications", 197, 0, 0.0, 2685.670050761422, 57, 23258, 2430.0, 3679.6000000000004, 6582.2999999999965, 21627.280000000017, 0.15192001449795065, 0.542646682099658, 0.04925531720050743], "isController": false}, {"data": ["5_6_Enter OTP -> Continue", 70, 3, 4.285714285714286, 12194.657142857146, 918, 71012, 10304.0, 13807.3, 52006.15, 71012.0, 0.06183062824334768, 0.4233646971955394, 0.1199633225681793], "isController": false}, {"data": ["5_4_Click Add Beneficiary", 72, 0, 0.0, 12541.430555555555, 526, 52806, 11948.5, 17780.9, 37733.89999999993, 52806.0, 0.06237887019736847, 0.9796345713661925, 0.09259363544921882], "isController": false}, {"data": ["2_3_Open My Transactions", 328, 2, 0.6097560975609756, 9166.317073170732, 351, 69356, 7119.5, 12027.200000000003, 34021.70000000006, 67684.23999999995, 0.25155747052827837, 2.970441859402766, 0.1815439167191384], "isController": false}, {"data": ["7_5_Enter Purpose and Source -> Next -> Account Transfer -> Upload Bill -> Pay Now", 340, 0, 0.0, 3617.0882352941176, 84, 24969, 3174.0, 4745.200000000001, 12480.949999999997, 20436.769999999957, 0.26869951017659877, 0.1177497500205476, 0.1125704002595321], "isController": false}, {"data": ["0_3_Enter Username and Password > Sign In", 1003, 0, 0.0, 24274.533399800584, 773, 74478, 24615.0, 47631.00000000003, 64164.79999999999, 71536.8, 0.7468076393283943, 13.44296941895313, 1.8436813595919737], "isController": false}, {"data": ["5_5_Enter Bank Transfer Details -> Submit", 72, 0, 0.0, 20116.68055555555, 1280, 75848, 16516.5, 40002.100000000006, 67432.6, 75848.0, 0.06104498846080148, 0.39803687239181046, 0.13514549691468453], "isController": false}, {"data": ["4_6_Enter OTP -> Continue", 87, 3, 3.4482758620689653, 12375.632183908048, 712, 67193, 10099.0, 18390.40000000001, 47779.39999999997, 67193.0, 0.07171726580809284, 0.41822191465315633, 0.13684869568344493], "isController": false}, {"data": ["0_1_Launch", 2410, 9, 0.37344398340248963, 24850.76514522823, 941, 93464, 24758.0, 40096.80000000001, 70794.64999999994, 83714.59999999995, 1.7772245357277439, 62.39841293411106, 4.0017049556541915], "isController": false}, {"data": ["7_6_Enter OTP -> Continue", 338, 21, 6.21301775147929, 51687.16863905325, 5288, 182161, 46754.0, 102856.3, 120262.25000000003, 174467.38000000003, 0.25654025860472457, 5.654153614722451, 414.5960452122795], "isController": false}, {"data": ["7_3_Click Send Money", 361, 2, 0.554016620498615, 10137.180055401659, 351, 68205, 7121.0, 13808.4, 52511.69999999998, 65412.97999999999, 0.28223565034990183, 3.4299025177804547, 0.2036837359458764], "isController": false}, {"data": ["9_3_Enter Username and Password > Sign In - InActive", 162, 0, 0.0, 21636.7037037037, 1002, 73240, 23894.5, 33031.000000000015, 52639.6, 69800.20000000003, 0.12568827910246155, 2.2623193182497054, 0.31029293903420196], "isController": false}, {"data": ["6_5_Enter Purpose and Source -> Next -> Cash Counter -> Pay Now", 277, 0, 0.0, 3496.642599277978, 89, 23879, 3251.0, 4670.6, 9778.79999999999, 22068.839999999956, 0.21991789202746037, 0.09637379362730349, 0.09213356999978564], "isController": false}, {"data": ["5_3_Open My Beneficiaries", 74, 0, 0.0, 3364.7027027027025, 144, 15588, 3100.5, 5615.5, 7634.25, 15588.0, 0.06277304152351869, 0.3227282878971031, 0.020474800653178946], "isController": false}, {"data": ["1_3_Open Forex Rates", 446, 4, 0.8968609865470852, 8869.325112107617, 372, 68237, 7237.5, 11334.7, 27635.14999999998, 66045.82999999999, 0.34287647221624284, 6.472488619633906, 0.21035929235600725], "isController": false}, {"data": ["4_5_Enter Cash Pickup Details > Submit", 89, 0, 0.0, 15103.314606741575, 425, 54341, 14827.0, 23720.0, 40232.0, 54341.0, 0.0730603503120662, 0.18335714079755633, 0.13927129278237618], "isController": false}, {"data": ["6_3_Click Send Money", 286, 2, 0.6993006993006993, 9656.377622377624, 346, 69230, 7002.5, 12674.5, 50425.74999999996, 67550.39, 0.22275791433166783, 2.6916928664406634, 0.16075986200302983], "isController": false}, {"data": ["3_4_Cancel One Transaction", 96, 0, 0.0, 2713.8541666666665, 83, 10865, 2780.0, 4841.8, 6241.5499999999965, 10865.0, 0.0762178783324481, 0.04136531824536917, 0.029177156549140285], "isController": false}, {"data": ["9_2_Click Login with Mpin -> Enter Mpin > Sign In - InActive", 158, 0, 0.0, 21162.71518987341, 746, 74957, 22739.0, 36101.29999999999, 54821.44999999981, 71625.26999999997, 0.1186265448667366, 9.935193093795306, 0.2988832868712699], "isController": false}, {"data": ["3_3_Open My Transactions", 100, 1, 1.0, 11283.429999999997, 437, 65562, 7122.5, 31190.90000000006, 53252.74999999996, 65551.39, 0.07858490588278748, 0.9615999032226884, 0.05671313031970697], "isController": false}, {"data": ["7_4_Select Beneficiery and Enter Amount -> Click Next", 352, 3, 0.8522727272727273, 23113.74147727271, 1161, 87971, 22037.0, 30199.3, 70024.74999999996, 84436.13999999997, 0.27095660768485286, 1.4836364183289057, 0.6302442816705552], "isController": false}, {"data": ["0_2_Click Login with Mpin -> Enter Mpin > Sign In", 962, 0, 0.0, 22573.817047817054, 777, 81062, 23810.5, 35685.8, 52981.849999999984, 72899.16, 0.7199962877530278, 24.083026817242192, 1.8140531468777459], "isController": false}, {"data": ["6_4_Select Beneficiery and Enter Amount -> Click Next", 282, 0, 0.0, 21554.999999999985, 1164, 86631, 22002.0, 28632.3, 39375.39999999995, 82140.66000000002, 0.21888411017787826, 1.2132253349819497, 0.5103505939365997], "isController": false}, {"data": ["4_3_Open My Beneficiaries", 92, 0, 0.0, 2874.0978260869565, 104, 17405, 2954.5, 4041.8, 5438.549999999998, 17405.0, 0.0750239546594361, 0.3080594687162341, 0.024470703961183258], "isController": false}, {"data": ["6_6_Enter OTP->Continue", 268, 13, 4.850746268656716, 34525.2089552239, 2937, 145063, 30595.0, 70121.7, 94482.34999999998, 139984.1, 0.20856307048420095, 4.528700932959814, 0.9965720363615705], "isController": false}, {"data": ["4_4_Click Add Beneficiary", 91, 0, 0.0, 13385.000000000002, 523, 57672, 11872.0, 27574.799999999996, 42868.59999999996, 57672.0, 0.07404767368248032, 1.1629618482075579, 0.10991451562243172], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 62, 98.41269841269842, 0.6878952623987573], "isController": false}, {"data": ["Assertion failed", 1, 1.5873015873015872, 0.011095084877399313], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9013, 63, "400", 62, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["5_6_Enter OTP -> Continue", 70, 3, "400", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["2_3_Open My Transactions", 328, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["4_6_Enter OTP -> Continue", 87, 3, "400", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["0_1_Launch", 2410, 9, "400", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["7_6_Enter OTP -> Continue", 338, 21, "400", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["7_3_Click Send Money", 361, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["1_3_Open Forex Rates", 446, 4, "400", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["6_3_Click Send Money", 286, 2, "400", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["3_3_Open My Transactions", 100, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["7_4_Select Beneficiery and Enter Amount -> Click Next", 352, 3, "400", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["6_6_Enter OTP->Continue", 268, 13, "400", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
