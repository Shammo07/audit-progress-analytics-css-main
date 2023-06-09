import ReactEcharts from "echarts-for-react";
import { useState, useRef, useEffect } from "react";
import { getAnalytics } from "api/analytics";
import { handleRefresh } from "lib/auth";

import styles from "../../styles/revenue.module.scss";

//return horizontal bar chart(? option
function getHoriBar(axisArr, dataArr) {
  return {
    // tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //         type: 'shadow'
    //     }
    // },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      //boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: "category",
      data: axisArr,
    },
    series: [
      {
        type: "bar",
        label: {
          show: true,
        },
        data: dataArr,
      },
    ],
  };
}

//structure same as completedRevnue
const WIPRevenue = () => {
  //const [data, getData] = useState([]);
  const [state, setState] = useState("All");
  const [chosen, setChosen] = useState([]);
  const [WIPJobArr, setWIPJobArr] = useState([]);
  const [WIPRevenue, setWIPRevenue] = useState(0);
  const [groupedCompanyArr, setGroupedCompanyArr] = useState([]);
  const [nonGroupedCompanyArr, setNonGroupedCompanyArr] = useState([]);
  const [groupedCompanies, setGroupedCompanies] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [nonGroupedData, setNonGroupedData] = useState([]);

  const [totalGroupedRevenue, setTotalGroupedRevenue] = useState(0);
  const [totalNonGroupedRevenue, setTotalNonGroupedRevenue] = useState(0);

  const [groupedRange1, setGroupedRange1] = useState([]);
  const [groupedRange2, setGroupedRange2] = useState([]);
  const [groupedRange3, setGroupedRange3] = useState([]);
  const [groupedRange4, setGroupedRange4] = useState([]);
  const [groupedRange5, setGroupedRange5] = useState([]);
  const [groupedRange6, setGroupedRange6] = useState([]);
  const [groupedRange7, setGroupedRange7] = useState([]);

  const [nonGroupedRange1, setNonGroupedRange1] = useState([]);
  const [nonGroupedRange2, setNonGroupedRange2] = useState([]);
  const [nonGroupedRange3, setNonGroupedRange3] = useState([]);
  const [nonGroupedRange4, setNonGroupedRange4] = useState([]);
  const [nonGroupedRange5, setNonGroupedRange5] = useState([]);
  const [nonGroupedRange6, setNonGroupedRange6] = useState([]);
  const [nonGroupedRange7, setNonGroupedRange7] = useState([]);

  const [horiBarChart, setHoriBarChart] = useState({});

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;
        const WIPJobArr = data.filter((data) => data.status === "WIP");

        WIPJobArr.sort((a, b) => {
          return b.revenue - a.revenue;
        });

        setWIPJobArr(WIPJobArr);
        setChosen(data);
        //getData(data);

        let WIPRevenue = WIPJobArr.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);
        setWIPRevenue(WIPRevenue);

        const groupedCompanyArr = WIPJobArr.filter(
          (data) => data.groupCompany != ""
        );
        groupedCompanyArr.sort((a, b) => {
          return a.groupCompany.localeCompare(b.groupCompany);
        });

        const nonGroupedCompanyArr = WIPJobArr.filter(
          (data) => data.groupCompany === ""
        );

        setGroupedCompanyArr(groupedCompanyArr);
        setNonGroupedCompanyArr(nonGroupedCompanyArr);

        //split array into subarray of objects by groupCompany
        let groupedCompanies = [];
        function groupBy(array, property) {
          var hash = [];
          for (var i = 0; i < array.length; i++) {
            if (!hash[array[i][property]]) {
              hash[array[i][property]] = [];
              groupedCompanies.push(array[i][property]);
            }
            hash[array[i][property]].push(array[i]);
          }
          return hash;
        }

        groupedCompanyArr = groupBy(groupedCompanyArr, "groupCompany");

        let groupedData = [];
        let sumRevenue, totalGroupedRevenue;
        sumRevenue = totalGroupedRevenue = 0;

        //find grouped ROI and reveune
        for (let i = 0; i < groupedCompanies.length; i++) {
          //console.log(sumRevenue, sumActualCost, "starting");
          for (
            let j = 0;
            j < groupedCompanyArr[groupedCompanies[i]].length;
            j++
          ) {
            totalGroupedRevenue +=
              groupedCompanyArr[groupedCompanies[i]][j].revenue;
            sumRevenue += groupedCompanyArr[groupedCompanies[i]][j].revenue;
          }
          //calculate ROI
          groupedData.push({
            clientName: groupedCompanies[i],
            revenue: sumRevenue,
          });
          sumRevenue = 0;
        }
        console.log(groupedData);
        groupedData.sort(function (a, b) {
          return b[2] - a[2];
        });
        setGroupedCompanies(groupedCompanies);
        setGroupedData(groupedData);
        setTotalGroupedRevenue(totalGroupedRevenue);

        // return ([groupedCompanies, groupedData, totalGroupedROI])

        let totalNonGroupedRevenue = 0;

        let nonGroupedData = [];

        nonGroupedCompanyArr.map((data) => {
          totalNonGroupedRevenue += data.revenue;
          nonGroupedData.push({
            clientName: data.clientName,
            revenue: data.revenue,
          });
        });
        nonGroupedData.sort(function (a, b) {
          return b[2] - a[2];
        });
        setNonGroupedData(nonGroupedData);
        setTotalNonGroupedRevenue(totalNonGroupedRevenue);

        let Range1 = groupedData.filter((data) => data.revenue <= 50000);
        let Range2 = groupedData.filter(
          (data) => data.revenue >= 50001 && data.revenue <= 100000
        );
        let Range3 = groupedData.filter(
          (data) => data.revenue >= 100001 && data.revenue <= 200000
        );
        let Range4 = groupedData.filter(
          (data) => data.revenue >= 200001 && data.revenue <= 300000
        );
        let Range5 = groupedData.filter(
          (data) => data.revenue >= 300001 && data.revenue <= 400000
        );
        let Range6 = groupedData.filter(
          (data) => data.revenue >= 400001 && data.revenue <= 500000
        );
        let Range7 = groupedData.filter((data) => data.revenue > 500000);

        Range1.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range2.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range3.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range4.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range5.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range6.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range7.sort((a, b) => {
          return b.revenue - a.revenue;
        });

        setGroupedRange1(Range1);
        setGroupedRange2(Range2);
        setGroupedRange3(Range3);
        setGroupedRange4(Range4);
        setGroupedRange5(Range5);
        setGroupedRange6(Range6);
        setGroupedRange7(Range7);

        Range1 = nonGroupedData.filter((data) => data.revenue <= 50000);
        Range2 = nonGroupedData.filter(
          (data) => data.revenue >= 50001 && data.revenue <= 100000
        );
        Range3 = nonGroupedData.filter(
          (data) => data.revenue >= 100001 && data.revenue <= 200000
        );
        Range4 = nonGroupedData.filter(
          (data) => data.revenue >= 200001 && data.revenue <= 300000
        );
        Range5 = nonGroupedData.filter(
          (data) => data.revenue >= 300001 && data.revenue <= 400000
        );
        Range6 = nonGroupedData.filter(
          (data) => data.revenue >= 400001 && data.revenue <= 500000
        );
        Range7 = nonGroupedData.filter((data) => data.revenue > 500000);

        Range1.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range2.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range3.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range4.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range5.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range6.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        Range7.sort((a, b) => {
          return b.revenue - a.revenue;
        });

        setNonGroupedRange1(Range1);
        setNonGroupedRange2(Range2);
        setNonGroupedRange3(Range3);
        setNonGroupedRange4(Range4);
        setNonGroupedRange5(Range5);
        setNonGroupedRange6(Range6);
        setNonGroupedRange7(Range7);
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }

  useEffect(() => {
    getJobAnalytics();
  }, []);

  //chart option
  let groupedChart = {
    width: "100%",
    title: {
      triggerEvent: true,
      // text: data.length + '\n $' + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      text:
        "$" +
        totalGroupedRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      x: "center",
      name: "title",
      top: "70",
      textStyle: {
        fontWeight: "400",
        fontSize: "12",
      },
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["25%", "45%"],
        center: ["50%", "55%"],
        itemStyle: {
          borderWidth: 3,
          borderType: "solid",
          borderColor: "#FFFFFF",
        },
        label: {
          show: true,
          position: "center",
          //overflow: "break"
        },
        color: "green",
        data: [
          {
            value: groupedData.length,
            name: "grouped",
            selected: true,
          },
          {
            value: nonGroupedData.length,
            itemStyle: { color: "white" },
            selected: false,
          },
        ],
      },
    ],
  };

  //chart option
  let nonGroupedChart = {
    width: "100%",
    title: {
      triggerEvent: true,
      // text: data.length + '\n $' + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      text:
        "$" +
        totalNonGroupedRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      x: "center",
      name: "title",
      top: "70",
      textStyle: {
        fontWeight: "400",
        fontSize: "12",
      },
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["25%", "45%"],
        center: ["50%", "55%"],
        itemStyle: {
          borderWidth: 3,
          borderType: "solid",
          borderColor: "#FFFFFF",
        },
        label: {
          show: true,
          position: "center",
          //overflow: "break"
        },
        color: "green",
        data: [
          {
            value: groupedData.length,
            itemStyle: { color: "white" },
            selected: false,
          },
          {
            value: nonGroupedData.length,
            name: "nonGrouped",
            selected: true,
          },
        ],
      },
    ],
  };

  let YTDchart = {
    width: "100%",
    title: {
      triggerEvent: true,
      // text: data.length + '\n $' + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      text: "$" + WIPRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      x: "center",
      name: "title",
      top: "70",
      textStyle: {
        fontWeight: "400",
        fontSize: "12",
      },
    },
    tooltip: {
      trigger: "item",
    },
    color: "orange",
    series: [
      {
        type: "pie",
        radius: ["25%", "45%"],
        center: ["50%", "55%"],
        itemStyle: {
          borderWidth: 3,
          borderType: "solid",
          borderColor: "#FFFFFF",
        },
        label: {
          show: true,
          position: "center",
          //overflow: "break"
        },
        data: [
          {
            value: WIPJobArr.length,
            name: "YTD",
          },
        ],
      },
    ],
  };

  var colors = ['#5793f3',"#d14a61"]
  let barChart = {
    color:colors,
    width: "90%",
    height: "50%",
    // tooltip: {
    //     trigger: 'item',
    // },
    xAxis: {
      type: "category",
      data: [
        "<50,000",
        "51,000 - 100,000",
        "100,001 - 200,000",
        "200,001 - 300,000",
        "300,001 - 400,000",
        "400,001 - 500,000",
        ">500,000",
      ],
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: "value",
      //     // data: [20, 40, 60, 80, 100, 120]
    },
    legend:{
      data:['Grouped','Non-Grouped']
    },
    series: [
      {
        type: "bar",
        name:'Grouped',
        label: {
          show: true,
        },
        data: [
          groupedRange1.length,
          groupedRange2.length,
          groupedRange3.length,
          groupedRange4.length,
          groupedRange5.length,
          groupedRange6.length,
          groupedRange7.length,
        ],
      },
      {
        type: "bar",
        name:'Non-Grouped',
        label: {
          show: true,
        },
        data: [
          nonGroupedRange1.length,
          nonGroupedRange2.length,
          nonGroupedRange3.length,
          nonGroupedRange4.length,
          nonGroupedRange5.length,
          nonGroupedRange6.length,
          nonGroupedRange7.length,
        ],
      },
    ],
  };

  const barEvents = {
    click: (params) => {
      if (params.data) {
        if (params.seriesIndex === 0) {
          setState("grouped");
          switch (params.dataIndex) {
            case 0:
              setChosen(groupedRange1);
              break;
            case 1:
              setChosen(groupedRange2);
              break;
            case 2:
              setChosen(groupedRange3);
              break;
            case 3:
              setChosen(groupedRange4);
              break;
            case 4:
              setChosen(groupedRange5);
              break;
            case 5:
              setChosen(groupedRange6);
              break;
            case 6:
              setChosen(groupedRange7);
              break;
          }
        } else {
          setState("nonGrouped");
          switch (params.dataIndex) {
            case 0:
              setChosen(nonGroupedRange1);
              break;
            case 1:
              setChosen(nonGroupedRange2);
              break;
            case 2:
              setChosen(nonGroupedRange3);
              break;
            case 3:
              setChosen(nonGroupedRange4);
              break;
            case 4:
              setChosen(nonGroupedRange5);
              break;
            case 5:
              setChosen(nonGroupedRange6);
              break;
            case 6:
              setChosen(nonGroupedRange7);
              break;
          }
        }
      }
      //output arr
      // setDisplayArr(state === "WIP" ? WIPJobArr : WIPJobArr);
    },
  };

  useEffect(() => {
    // console.log(chosen)
    let dataArr = [];
    let axisArr = ["Total Group"];

    dataArr.push(
      chosen.reduce((accumulator, data) => {
        return accumulator + data.revenue;
      }, 0)
    );

    dataArr = dataArr.concat(chosen.map((item) => item.revenue));
    axisArr = axisArr.concat(chosen.map((item) => item.clientName));
    dataArr.reverse();
    axisArr.reverse();
    console.log(axisArr);

    setHoriBarChart(getHoriBar(axisArr, dataArr));
  }, [chosen]);

  return (
    <>
      <div className={styles.pieCharts}>
        <h3 className={styles.title}>Revenue of WIP Jobs</h3>
        <div className={styles.chartDiv}>
          <ReactEcharts option={groupedChart} className={styles.chart} />
        </div>
        <div className={styles.chartDiv}>
          <ReactEcharts option={nonGroupedChart} className={styles.chart} />
        </div>
        <div className={styles.chartDiv}>
          <ReactEcharts option={YTDchart} className={styles.chart} />
        </div>
      </div>

      <ReactEcharts
        option={barChart}
        className={styles.completeBar}
        onEvents={barEvents}
      />
      <div style={{ height: "1000px" }}>
        {state != "All" && (
          <ReactEcharts
            option={horiBarChart}
            className={styles.completeHoriBar}
            style={{
              height: "90%"
            }}
          />
        )}
      </div>
    </>
  );
};

export default WIPRevenue;
