

export function verticalSum(matrix){
  const sum = (r, a) => r.map((b, i) => a[i] + b);
  return matrix.reduce(sum);
}

export function horizontalSum(matrix){
  return  matrix.map((b)=> b.reduce((total,num)=>total+num))
}
