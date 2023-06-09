import ReactEcharts from "echarts-for-react";
import { useState, useRef, useEffect } from "react";
import { getAnalytics } from "api/analytics";
import styles from "../../styles/revenue.module.scss";
import { handleRefresh } from "lib/auth";
import { getRR } from "lib/recoveryRate";

const GroupRanking = () => {
  const [dataArr, setDataArr] = useState([]);
  const [axisArr, setAxisArr] = useState([]);
 // const [groupCompanyArr, setGroupedCompanyArr] = useState([]);

  function getJobAnalytics() {
    getAnalytics()
      .then((res) => {
        const data = res.data;
        
        let completedJobArr = data.filter(
          (data) => data.status === "completed"
        );

        const groupedCompanyArr = completedJobArr.filter(
          (data) => data.groupCompany != ""
        );
     

        groupedCompanyArr.sort((a, b) => {
          return a.groupCompany.localeCompare(b.groupCompany);
        });


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
        console.log("🚀 ~ file: groupRanking.js ~ line 39 ~ .then ~ groupedCompanyArr", groupedCompanyArr)
        //setGroupedCompanyArr(groupedCompanyArr);

        let groupedData = [];
        let sumRevenue = 0;
        let sumActualCost = 0;
        let sumActualRR = 0;

        for (let i = 0; i < groupedCompanies.length; +i++) {
          for (
            let j = 0;
            j < groupedCompanyArr[groupedCompanies[i]].length;
            j++
          ) {
            sumRevenue += groupedCompanyArr[groupedCompanies[i]][j].revenue;
            sumActualCost +=
              groupedCompanyArr[groupedCompanies[i]][j].actualCost;
          }
          sumActualRR = (sumRevenue/sumActualCost)*100
          groupedData.push({
            client: groupedCompanies[i],
            recoveryRate: sumActualRR,
          });
          sumActualRR = sumActualCost = sumRevenue= 0
        }

        groupedData.sort((a, b) => {
          return b.recoveryRate - a.recoveryRate;
        });
        console.log("🚀 ~ file: groupRanking.js ~ line 72 ~ groupedData.sort ~ groupedData", groupedData)

        let dataArr = [];
        let axisArr = [];

        dataArr = dataArr.concat(groupedData.map((item) => item.recoveryRate.toFixed(0)));
        axisArr = axisArr.concat(groupedData.map((item) => item.client));
        dataArr.reverse();
        axisArr.reverse();

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
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name:"Recovery Rate",
      nameLocation: "middle",
      nameTextStyle: {
        verticalAlign: "top",
        lineHeight:15
      }
      //boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: "category",
      data: axisArr,
      name:"Group Company",
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
  return <ReactEcharts option={option} />;
};

export default GroupRanking;
