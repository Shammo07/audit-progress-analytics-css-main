import ReactEcharts from "echarts-for-react";
import { useState, useRef, useEffect } from "react";
import { getAnalytics } from "api/analytics";
import styles from "../../styles/revenue.module.scss";
import { handleRefresh } from "lib/auth";
import { getRR } from "lib/recoveryRate";

const NonGroupRanking = () => {
  const [dataArr, setDataArr] = useState([]);
  const [axisArr, setAxisArr] = useState([]);

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;

        let completedJobArr = data.filter(
          (data) => data.status === "completed"
        );

        const nonGroupedCompanyArr = completedJobArr.filter(
          (data) => data.groupCompany === ""
        );

        nonGroupedCompanyArr = nonGroupedCompanyArr.map((item) => {
          return {
            ...item,
            recoveryRate: (item.revenue / item.actualCost) * 100,
          };
        });

        nonGroupedCompanyArr.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });

        dataArr = dataArr.concat(
          nonGroupedCompanyArr.map((item) => item.recoveryRate.toFixed(0))
        );
        axisArr = axisArr.concat(
          nonGroupedCompanyArr.map((item) => item.clientName)
        );
        dataArr.reverse();
        console.log("🚀 ~ file: nonGroupRanking.js ~ line 43 ~ .then ~ dataArr", dataArr)
        axisArr.reverse();
        console.log("🚀 ~ file: nonGroupRanking.js ~ line 44 ~ .then ~ axisArr", axisArr)
        setDataArr(dataArr);
        setAxisArr(axisArr);
      })
      .catch(async (err) => {
        if (err.response.status === 401) handleRefresh(getJobAnalytics);
      });
  }
  useEffect(() => getJobAnalytics(), []);

  let option = {
    // tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //         type: 'shadow'
    //     }
    // },
    legend: {},
    grid: {
      left: "5%",
      right: "4%",
      bottom:"5%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      //boundaryGap: [0, 0.01]
      name:"Recovery Rate",
      nameLocation: "middle",
      nameTextStyle: {
        verticalAlign: "top",
        lineHeight:15
      }
    },
    yAxis: {
      type: "category",
      data: axisArr,
      name:"Companies",
      nameLocation: "middle",
      nameTextStyle: {
        verticalAlign: "top",
        lineHeight:-250
      }
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
  return (
    <div style={{ height: "1200px"}}>
      <ReactEcharts
        option={option}
        style={{
          height: "90%",
          width: "100%",
        }}
      />
    </div>
  );
};

export default NonGroupRanking;
