import EChartsReact from "echarts-for-react";
import { useState, useRef, useEffect } from "react";
import { getAnalytics } from "api/analytics";
import styles from "../../styles/revenue.module.scss";
import { handleRefresh } from "lib/auth";

function getOption(revenue, label, data) {
  return {
    width: "100%",
    title: {
      triggerEvent: true,
      // text: data.length + '\n $' + totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      text: "$" + revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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
            value: data.length,
            name: label,
          },
        ],
      },
    ],
  };
}

const TopAndBottom = () => {
  const [state, setState] = useState("All");
  const [topBottom, setTopBottom] = useState("");
  const [data, setData] = useState([]);
  const [allTop30, setAllTop30] = useState([]);
  const [top10, setTop10] = useState([]);
  const [top20, setTop20] = useState([]);
  const [top30, setTop30] = useState([]);
  const [allBottom30, setAllBottom30] = useState([]);
  const [bottom10, setBottom10] = useState([]);
  const [bottom20, setBottom20] = useState([]);
  const [bottom30, setBottom30] = useState([]);
  const [YTDRevenue, setYTDRevenue] = useState([]);
  const [allTop30Revenue, setAllTop30Revenue] = useState(0);
  const [top10Revenue, setTop10Revenue] = useState(0);
  const [top20Revenue, setTop20Revenue] = useState(0);
  const [top30Revenue, setTop30Revenue] = useState(0);
  const [allBottom30Revenue, setAllBottom30Revenue] = useState(0);
  const [bottom10Revenue, setBottom10Revenue] = useState(0);
  const [bottom20Revenue, setBottom20Revenue] = useState(0);
  const [bottom30Revenue, setBottom30Revenue] = useState(0);

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;
        data.sort((a, b) => {
          return b.revenue - a.revenue;
        });
        const YTDRevenue = data.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);
        setData(data);
        setYTDRevenue(YTDRevenue);


        const allTop30 = data.slice(0, 30);
        const top10 = allTop30.slice(0, 10);
   
        const top10Revenue = top10.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);
        const top20 = allTop30.slice(10, 20);
        const top20Revenue = top20.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);
        const top30 = allTop30.slice(-10);
        const top30Revenue = top30.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);

        setAllTop30(allTop30);
        setTop10(top10);

        setTop20(top20);
        setTop30(top30);

        setTop10Revenue(top10Revenue);
        setTop20Revenue(top20Revenue);
        setTop30Revenue(top30Revenue);
        setAllTop30Revenue(top10Revenue + top20Revenue + top30Revenue);

        const allBottom30 = data.slice(-30);
        const bottom10 = allBottom30.slice(0, 10);
        const bottom10Revenue = bottom10.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);
        const bottom20 = allBottom30.slice(10, 20);
        const bottom20Revenue = bottom20.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);
        const bottom30 = allBottom30.slice(-10);
        const bottom30Revenue = bottom30.reduce((accumulator, data) => {
          return accumulator + data.revenue;
        }, 0);

        setAllBottom30(allBottom30);
        setBottom10(bottom10);
        setBottom20(bottom20);
        setBottom30(bottom30);

        setBottom10Revenue(bottom10Revenue);
        setBottom20Revenue(bottom20Revenue);
        setBottom30Revenue(bottom30Revenue);
        setAllBottom30Revenue(
          bottom10Revenue + bottom20Revenue + bottom30Revenue
        );
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }

  useEffect(() => {
    getJobAnalytics();
  }, []);

  let topChart = {
    width: "100%",
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        itemStyle: {
          borderWidth: 3,
          borderType: "solid",
          borderColor: "#FFFFFF",
        },
        label: {
          show: true,
          position: "inside",
          formatter: "{b}\n {c}%",
        },
        data: [
          {
            value: ((top10Revenue / YTDRevenue) * 100).toFixed(0),
            name: "first top 10",
          },
          {
            value: ((top20Revenue / YTDRevenue) * 100).toFixed(0),
            name: "second top 10",
          },
          {
            value: ((top30Revenue / YTDRevenue) * 100).toFixed(0),
            name: "third top 10",
          },
        ],
      },
    ],
  };

  let bottomChart = {
    width: "100%",
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        itemStyle: {
          borderWidth: 3,
          borderType: "solid",
          borderColor: "#FFFFFF",
        },
        label: {
          show: true,
          position: "inside",
          formatter: "{b}\n {c}%",
        },
        data: [
          {
            value: ((bottom10Revenue / YTDRevenue) * 100).toFixed(0),
            name: "first bottom 10",
          },
          {
            value: ((bottom20Revenue / YTDRevenue) * 100).toFixed(0),
            name: "second bottom 10",
          },
          {
            value: ((bottom30Revenue / YTDRevenue) * 100).toFixed(0),
            name: "third bottom 10",
          },
        ],
      },
    ],
  };

  const chartevents = {
    click: (params) => {
      if (params.componentType === "title") {
        setState("All");
      }

      if (params.data) {
        switch (params.data.name) {
          case "first bottom 10":
            setState("Bottom 10");
            setTopBottom("bottom");
            break;
          case "second bottom 10":
            setState("Bottom 20");
            setTopBottom("bottom");
            break;
          case "third bottom 10":
            setState("Bottom 30");
            setTopBottom("bottom");
            break;
          case "first top 10":
            setState("Top 10");
            setTopBottom("top");
            break;
          case "second top 10":
            setState("Top 20");
            setTopBottom("top");
            break;
          case "third top 10":
            setState("Top 30");
            setTopBottom("top");
            break;
          default:
            setState("All");
        }
      }
    },
  };

  return (
    <>
      <div className={styles.pieCharts}>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(top10Revenue, "1st top 10", top10)}
            className={styles.chart}
          />{" "}
        </div>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(top20Revenue, "2nd top 10", top20)}
            className={styles.chart}
          />
        </div>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(top30Revenue, "3st top 10", top30)}
            className={styles.chart}
          />
        </div>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(allTop30Revenue, "top 30", allTop30)}
            className={styles.chart}
          />
        </div>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(YTDRevenue, "YTD Total", data)}
            className={styles.chart}
          />
        </div>
      </div>
      <EChartsReact
        option={topChart}
        onEvents={chartevents}
        className={styles.topBottomPie}
      />
      {state != "All" && topBottom === "top" && (
        <>
          <h4 className={styles.tableTitle}>{state} Jobs</h4>
          <div className={styles.tableDiv}>
            <table className={styles.tableStyle}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>Status</th>
                  <th>Job#</th>
                  <th>Client Name</th>
                  <th>Actual Cost</th>
                  <th>Revenue</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {state === "Top 10"
                  ? top10.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>{item.status}</td>
                        <td className={styles.fileRef}>{item.fileReference}</td>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : state === "Top 20"
                  ? top20.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>{item.status}</td>
                        <td className={styles.fileRef}>{item.fileReference}</td>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))
                  : top30.map((item, index) => (
                      <tr key={index}>
                        <td className={styles.companyName}>{item.status}</td>
                        <td className={styles.fileRef}>{item.fileReference}</td>
                        <td className={styles.companyName}>
                          {item.clientName}
                        </td>
                        <td className={styles.numData}>
                          {item.actualCost
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>
                          {item.revenue
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className={styles.numData}>{item.ROI + "%"}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className={styles.pieCharts}>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(bottom10Revenue, "1st bottom 10", bottom10)}
            className={styles.chart}
          />{" "}
        </div>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(bottom20Revenue, "2nd bottom 10", bottom20)}
            className={styles.chart}
          />
        </div>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(bottom30Revenue, "3st bottom 10", bottom30)}
            className={styles.chart}
          />
        </div>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(allBottom30Revenue, "bottom 30", allBottom30)}
            className={styles.chart}
          />
        </div>
        <div className={styles.chartDiv}>
          <EChartsReact
            option={getOption(YTDRevenue, "YTD Total", data)}
            className={styles.chart}
          />
        </div>
      </div>
      <EChartsReact
        option={bottomChart}
        onEvents={chartevents}
        className={styles.topBottomPie}
      />
      {state != "All" && topBottom === "bottom" && (
        <>
          <h4 className={styles.tableTitle}>{state} Jobs</h4>
          <div className={styles.tableDiv}>
            <table className={styles.tableStyle}>
              <thead>
                <tr className={styles.tableHeader}>
                <th>Status</th>
                  <th>Job#</th>
                  <th>Client Name</th>
                  <th>Actual Cost</th>
                  <th>Revenue</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {state === "Bottom 10"
                  ? bottom10.map((item, index) => {
                      return (
                        <tr key={index}>
                                 <td className={styles.companyName}>{item.status}</td>
                          <td className={styles.fileRef}>
                            {item.fileReference}
                          </td>
                          <td className={styles.companyName}>
                            {item.clientName}
                          </td>
                          <td className={styles.numData}>
                            {item.actualCost
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className={styles.numData}>
                            {item.revenue
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className={styles.numData}>{item.ROI + "%"}</td>
                        </tr>
                      );
                    })
                  : state === "Bottom 20"
                  ? bottom20.map((item, index) => {
               
                      return (
                        <tr key={index}>
                                 <td className={styles.companyName}>{item.status}</td>
                          <td className={styles.fileRef}>
                            {item.fileReference}
                          </td>
                          <td className={styles.companyName}>
                            {item.clientName}
                          </td>
                          <td className={styles.numData}>
                            {item.actualCost
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className={styles.numData}>
                            {item.revenue
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className={styles.numData}>{item.ROI + "%"}</td>
                        </tr>
                      );
                    })
                  : bottom30.map((item, index) => {
               
                      return (
                        <tr key={index}>
                                 <td className={styles.companyName}>{item.status}</td>
                          <td className={styles.fileRef}>
                            {item.fileReference}
                          </td>
                          <td className={styles.companyName}>
                            {item.clientName}
                          </td>
                          <td className={styles.numData}>
                            {item.actualCost
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className={styles.numData}>
                            {item.revenue
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className={styles.numData}>{item.ROI + "%"}</td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default TopAndBottom;
