export function oneDecimal(data) {
  let fixData;
  if (data === 0) fixData = 0;
  else fixData = Number(data % 1 === 0 ? data : parseFloat(data).toFixed(1));
  return fixData;
}
