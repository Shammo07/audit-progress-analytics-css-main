import Analytics from "./analytics";
//import Other from './other'
import React from "react";
import { useState } from "react";
import { getCookie } from "@/lib/cookie";
import { refreshOnServer } from "lib/auth";
import Revenue from "./revenueMain";
import RecoveryRate from "./recoveryRateMain";
import styles from "../styles/analytics.module.scss";
import { useRouter } from "next/router";


import AgreedRevenueOverview from "../components/Revenue";
import UnitsANDCostsPerformance from "../components/Performance";
import {
  Overview,
  TopBottom,
  ROIByGroup,
  Grouped,
  NonGrouped,
} from "../components/ROI";
import CompletedRevenue from "../components/Revenue/completedRevenue";
import GroupRanking from "../components/Revenue/groupRanking";
import RevenueOverview from "../components/Revenue/RevenueOverall";
import TopAndBottom from "../components/Revenue/topAndBottom";
import WIPRevenue from "../components/Revenue/WIPRevenue";
import CompletedRecoveryRate from "../components/RecoveryRate/completedRecoveryRate";
import RecoveryRateTopAndBottom from "../components/RecoveryRate/topAndBottom";
import Performance from "../components/RecoveryRate/Performance";
import GroupAndNonGroup from "@/components/RecoveryRate/GroupAndNonGroup";
import GroupPerformance from "@/components/RecoveryRate/GroupPerformance";
import NonGroupPerformance from "@/components/RecoveryRate/NonGroupPerformance";
import RecoveryRateGroupRanking from "@/components/RecoveryRate/groupRanking";
import NonGroupRanking from "@/components/RecoveryRate/nonGroupRanking";
const Page = ({content}) => {
  switch (content) {
    case "Revenue":
      return <AgreedRevenueOverview />;
    case "Performance":
      return <UnitsANDCostsPerformance />;
    case "ROIOverview":
      return <Overview />;
    case "ROITopAndBottom":
      return <TopBottom />;
    case "ROIByGroup":
      return <ROIByGroup />;
    case "GroupedROI":
      return <Grouped />;
    case "NonGroupedROI":
      return <NonGrouped />;
    case "RevenueOverView":
      return <RevenueOverview />;
    case "CompletedRevenue":
      return <CompletedRevenue />;
    case "WIPRevenue":
      return <WIPRevenue />;
    case "RevenueTopAndBottom":
      return <TopAndBottom />;
    case "RevenueGroupRanking":
      return <GroupRanking />;
    case "CompletedRecoveryRate":
      return <CompletedRecoveryRate />;
    case "RecoveryRatePerformance":
      return <Performance />;
    case "RecoveryRateTopAndBottom":
      return <RecoveryRateTopAndBottom />;
    case "RecoveryRateGroupAndNonGroup":
      return <GroupAndNonGroup />;
    case "RecoveryRateGroupPerformance":
      return <GroupPerformance />;
    case "RecoveryRateNonGroupPerformance":
      return <NonGroupPerformance />;
    case "RecoveryRateGroupRanking":
      return <RecoveryRateGroupRanking />;
    case "RecoveryRateNonGroupRanking":
      return <NonGroupRanking />;
  }
};
export default function Index(props) {
  const router = useRouter();
  const [active, setActive] = useState("analytics");
  const [content, setContent] = useState("Revenue");
  const [subMenu, setSubMenu] = useState(false);
  const [subMenuOfRecoveryRate, setSubMenuOfRecoveryRate] = useState(false);

  //Main Menu
  const setAnalytics = () => {
    setActive("analytics");
  };

  const setROI = () => {
    setActive("ROI");
  };

  const setRevenue = () => {
    setActive("revenue");
  };

  const setRecoveryRate = () => {
    setActive("recoveryRate");
  };

  const backToSystem = () => {
    router.push("/welcome");
  };

  const logout = () => {
    router.push("/logout");
  };
  //Main Menu

  //Sub Menu Of Analytics
  const setContentRevenue = () => {
    setContent("Revenue");
  };

  const setContentPerformance = () => {
    setContent("Performance");
  };
  //Sub Menu Of Analytics

  //Sub Menu Of ROI
  const setContentROIOverview = () => {
    setContent("ROIOverview");
  };

  const setContentROITopAndBottom = () => {
    setContent("ROITopAndBottom");
  };

  //Sub Menu Of ROI

  //Sub Menu Of Group Ranking Of ROI
  const setContentROIByGroup = () => {
    setContent("ROIByGroup");
  };

  const setContentGroupedROI = () => {
    setContent("GroupedROI");
  };

  const setContentNonGroupedROI = () => {
    setContent("NonGroupedROI");
  };

  //Sub Menu Of Group Ranking Of ROI

  //Sub menu OF Revenue
  const setContentRevenueOverView = () => {
    setContent("RevenueOverView");
  };

  const setContentCompletedRevenue = () => {
    setContent("CompletedRevenue");
  };

  const setContentWIPRevenue = () => {
    setContent("WIPRevenue");
  };

  const setContentRevenueTopAndBottom = () => {
    setContent("RevenueTopAndBottom");
  };

  const setContentRevenueGroupRanking = () => {
    setContent("RevenueGroupRanking");
  };
  //Sub menu OF Revenue

  //Sub menu of Recovery Rate
  const setContentCompletedRecoveryRate = () => {
    setContent("CompletedRecoveryRate");
  };

  const setContentRecoveryRatePerformance = () => {
    setContent("RecoveryRatePerformance");
  };

  const setContentRecoveryRateTopAndBottom = () => {
    setContent("RecoveryRateTopAndBottom");
  };

  //Sub menu of Recovery Rate

  //Sub menu of GroupedAndNonGrouped of Recovery Rate
  const setContentRecoveryRateGroupAndNonGroup = () => {
    setContent("RecoveryRateGroupAndNonGroup");
  };

  const setContentRecoveryRateGroupPerformance = () => {
    setContent("RecoveryRateGroupPerformance");
  };

  const setContentRecoveryRateNonGroupPerformance = () => {
    setContent("RecoveryRateNonGroupPerformance");
  };

  const setContentRecoveryRateGroupRanking = () => {
    setContent("RecoveryRateGroupRanking");
  };

  const setContentRecoveryRateNonGroupRanking = () => {
    setContent("RecoveryRateNonGroupRanking");
  };
  //Sub menu of GroupedAndNonGrouped of Recovery Rate



  return (
  
    <div className={styles.analytics}>
      
      <div className={styles.sidenav}>
      <img
            src="/img/favicon.ico"
            width="180"
            height="50"
            alt="company logo"
          />

        <a
          onClick={setAnalytics}
          className={active === "analytics" && styles.activeMain}
        >
          Analytics
        </a>
        {active === "analytics" && (
          <>
            <ul >
              <li>
                <a
                  onClick={setContentRevenue}
                  className={content === "Revenue" && styles.active}
                >
                  Revenue
                </a>
              </li>
              <li>
                <a
                  onClick={setContentPerformance}
                  className={content === "Performance" && styles.active}
                >
                  Performance
                </a>
              </li>
            </ul>
          </>
        )}
        <a onClick={setROI} className={active === "ROI" && styles.activeMain}>
          ROI
        </a>
        {active === "ROI" && (
          <>
            <ul>
              <li>
                <a
                  onClick={setContentROIOverview}
                  className={content === "ROIOverview" && styles.active}
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  onClick={setContentROITopAndBottom}
                  className={content === "ROITopAndBottom" && styles.active}
                >
                  Top and Bottom
                </a>
              </li>
              <li>
                <a onClick={()=> setSubMenu((subMenu)=>!subMenu)} className={""}>
                  Grouped And Non Grouped
                </a>
              </li>
              {subMenu === true && (
                <>
                  <ul>
                    <li>
                      <a
                        onClick={setContentROIByGroup}
                        className={content === "ROIByGroup" && styles.active}
                      >
                        Grouped vs Non-Grouped
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={setContentGroupedROI}
                        className={content === "GroupedROI" && styles.active}
                      >
                        Grouped
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={setContentNonGroupedROI}
                        className={content === "NonGroupedROI" && styles.active}
                      >
                        Non Grouped
                      </a>
                    </li>
                  </ul>
                </>
              )}
            </ul>
          </>
        )}
        <a
          onClick={setRevenue}
          className={active === "revenue" && styles.activeMain}
        >
          Revenue
        </a>
        {active === "revenue" && (
          <>
            <ul>
              <li>
                <a
                  onClick={setContentRevenueOverView}
                  className={content === "RevenueOverView" && styles.active}
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  onClick={setContentCompletedRevenue}
                  className={content === "CompletedRevenue" && styles.active}
                >
                  Completed Jobs
                </a>
              </li>
              <li>
                <a
                  onClick={setContentWIPRevenue}
                  className={content === "WIPRevenue" && styles.active}
                >
                  WIP Jobs
                </a>
              </li>
              <li>
                <a
                  onClick={setContentRevenueTopAndBottom}
                  className={content === "RevenueTopAndBottom" && styles.active}
                >
                  Top and Bottom
                </a>
              </li>
              <li>
                <a
                  onClick={setContentRevenueGroupRanking}
                  className={content === "RevenueGroupRanking" && styles.active}
                >
                  Group Ranking
                </a>
              </li>
            </ul>
          </>
        )}
        <a
          onClick={setRecoveryRate}
          className={active === "recoveryRate" && styles.activeMain}
        >
          Recovery Rate
        </a>
        {active === "recoveryRate" && (
          <>
            <ul>
              <li>
                <a
                  onClick={setContentCompletedRecoveryRate}
                  className={
                    content === "CompletedRecoveryRate" && styles.active
                  }
                >
                  Completed Jobs
                </a>
              </li>
              <li>
                <a
                  onClick={setContentRecoveryRatePerformance}
                  className={
                    content === "RecoveryRatePerformance" && styles.active
                  }
                >
                  Performance
                </a>
              </li>
              <li>
                <a
                  onClick={setContentRecoveryRateTopAndBottom}
                  className={
                    content === "RecoveryRateTopAndBottom" && styles.active
                  }
                >
                  Top and Bottom
                </a>
              </li>
              <li>
                <a onClick={()=>setSubMenuOfRecoveryRate((subMenuOfRecoveryRate)=>!subMenuOfRecoveryRate)} className={""}>
                  Grouped And Non Grouped
                </a>
              </li>
              {subMenuOfRecoveryRate === true && (
                <>
                  <ul>
                    <li>
                      <a
                        onClick={setContentRecoveryRateGroupAndNonGroup}
                        className={
                          content === "RecoveryRateGroupAndNonGroup" &&
                          styles.active
                        }
                      >
                        Grouped vs Non-Grouped
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={setContentRecoveryRateGroupPerformance}
                        className={
                          content === "RecoveryRateGroupPerformance" &&
                          styles.active
                        }
                      >
                        Grouped Performance
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={setContentRecoveryRateNonGroupPerformance}
                        className={
                          content === "RecoveryRateNonGroupPerformance" &&
                          styles.active
                        }
                      >
                        Non Grouped Performance
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={setContentRecoveryRateGroupRanking}
                        className={
                          content === "RecoveryRateGroupRanking" &&
                          styles.active
                        }
                      >
                        Group Ranking
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={setContentRecoveryRateNonGroupRanking}
                        className={
                          content === "RecoveryRateNonGroupRanking" &&
                          styles.active
                        }
                      >
                        Non Group Ranking
                      </a>
                    </li>
                  </ul>
                </>
              )}
            </ul>
          </>
        )}
        <a onClick={backToSystem}>Back to System</a>
        <a onClick={logout}>Logout</a>
        
      </div>

      

      {/*   {active === "analytics" ? <Analytics /> :null} */}
      {/*      {active === "revenue" ? <Revenue />  :null } */}
      {/*             {active === "recoveryRate" ? <RecoveryRate />  :null } */}

      <Page content={content}/>
      
      <footer className={"footer"}> © {new Date().getFullYear()} PerformVE Limited. All rights reserved. | Room 18, Unit 109B-113, 1/F, Enterprise Place (5W), No. 5 Science Park West Avenue, Hong Kong Science Park</footer>
      
    </div>
    
  );
}


