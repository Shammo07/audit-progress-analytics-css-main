export function getRR(revenue,actualCost){
   return ((revenue /actualCost)*100).toFixed(0)
}

/* export function groupBy(array, property) {
   var hash = [];
   for (var i = 0; i < array.length; i++) {
     if (!hash[array[i][property]]) {
       hash[array[i][property]] = [];
       groupedCompanies.push(array[i][property]);
     }
     hash[array[i][property]].push(array[i]);
   }
   return hash;
 } */