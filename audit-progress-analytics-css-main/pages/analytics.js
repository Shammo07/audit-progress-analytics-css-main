import AgreedRevenueOverview from '../components/Revenue';
import UnitsANDCostsPerformance from '../components/Performance';
import { Overview, TopBottom, ROIByGroup, Grouped, NonGrouped } from '../components/ROI';
import React from 'react';
import { useState } from 'react';

import styles from "../styles/analytics.module.scss"

export default function Analytics() {
    const [active, setActive] = useState("Revenue");

    //this.id not workinggggggg
    const setPerformance = () => {
        setActive("Performance");
    }

    const setRevenue = () => {
        setActive("Revenue");
    }

    const setOverview = () => {
        setActive("Overview");
    }

    const setTopBottom = () => {
        setActive("TopBottom");
    }

    const setROIByGroup = () => {
        setActive("ROIByGroup");
    }

    const setGrouped = () => {
        setActive("Grouped");
    }

    const setNonGrouped = () => {
        setActive("NonGrouped");
    }

/*     const Page = () => {
        switch (active) {
            case "Revenue": return <AgreedRevenueOverview />;
            case "Performance": return <UnitsANDCostsPerformance />;
            case "Overview": return <Overview />;
            case "TopBottom": return <TopBottom />;
            case "ROIByGroup": return <ROIByGroup />;
            case "Grouped": return <Grouped />;
            case "NonGrouped": return <NonGrouped />;
        }
    } */

    return (
        <>
            <div className={styles.analytics}>
               {/*  <ul className={styles.navbar}>
                    <li><a onClick={setRevenue} className={active === "Revenue" && styles.active}>Revenue</a></li>
                    <li><a onClick={setPerformance} className={active === "Performance" && styles.active}>Performance</a></li>
                    <li><div className={styles.dropdown}>
                        <button className={styles.dropbtn} id={styles.ROI}>ROI</button>
                        <div className={styles.dropdownContent}>
                            <a onClick={setOverview} className={active === "Overview" && styles.active}>Overview</a>
                            <a onClick={setTopBottom} className={active === "TopBottom" && styles.active}>Top and Bottom</a>
                            
                            <div className={styles.dropdown} id={styles.groupdrop}>
                            <button className={styles.dropbtn} id={styles.group}>Grouped Companies Ranking</button>
                            <div className={styles.dropdownContentGroup}>
                                <a onClick={setROIByGroup} className={active === "ROIByGroup" && styles.active}>ROI by Group</a>
                                <a onClick={setGrouped} className={active === "Grouped" && styles.active}>Grouped Companies</a>
                                <a onClick={setNonGrouped} className={active === "NonGrouped" && styles.active}>Non-Grouped Companies</a>
                            </div>
                            </div>
                        </div>
                    </div></li>
                </ul> */}

                {/* <Page /> */}

            </div>

        </>
    )

}

    
