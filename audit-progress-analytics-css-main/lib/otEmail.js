export function genTable(dates, units, jobReference, client, teamLeader, approvedUnits, comments) {
        const total=[];
        for(let i=0; i<dates.length; i++){
          total.push(units[i].reduce((partial,e)=>partial+e,0));
        }

        const OtUnits=[];
        for(let i=0; i<dates.length; i++){
          OtUnits.push(Math.max(0,total[i]-8));
        }


        const rejectedUnits=[];
        if(teamLeader)
            for(let i=0; i<dates.length; i++){
                if(approvedUnits[i]) rejectedUnits.push(OtUnits[i]-approvedUnits[i])
                else rejectedUnits.push(0)
            }
        else{
            teamLeader = "TBC";
            approvedUnits = [];
            comments = [];
            for(let i=0; i<dates.length; i++){
                rejectedUnits.push("TBC");
                approvedUnits.push("TBC");
                comments.push("TBC");
            }
        }

        let rows =`
              <style>
                th, td { 
                border: 1px solid #ddd;
               }
              </style>
              <table style='padding: 5px'>
                <thead>
                  <th>Date</th>
                  <th>Job Ref.</th>
                  <th>Client</th>
                  <th>Units</th>
                  <th>Daily Total</th>
                  <th>OT Units</th>
                  <th>Approve Units</th>
                  <th>Team Leader</th>
                  <th>Reject Units</th>
                  <th>Comments</th>
                </thead>
                <tbody>
        ` ;

        for(let i=0; i<dates.length; i++){
          for(let j=0; j<jobReference[i].length; j++){
            rows+=(`<tr><td>${new Date(dates[i]).toLocaleDateString()}</td>
                        <td>${jobReference[i][j]}</td><td>${client[i][j]}</td>
                        <td>${units[i][j]}</td><td>${total[i]}</td>
                        <td>${OtUnits[i]}</td><td>${approvedUnits[i]}</td>
                        <td>${teamLeader[i]}</td><td>${rejectedUnits[i]}</td>
                        <td>${comments[i]}</td></tr>`);
          }
        }

        rows+=`</tbody>
              </table>
              `

        return rows;
}

/* module.exports={
    genTable
} */
