// reduces an array to maxPoints number of points by grouping points
//   together and averaging them for a new point
export const reducePoints = (arr: any[], maxPoints: number, average=true) => {
  const groupSize = Math.floor(arr.length / maxPoints);
  let ret: any[] = [];
  for (let i = 0;  i < maxPoints; i++) {
    if (average) {
      let sum = 0;
      for (let j = i * groupSize; j < (i + 1) * groupSize; j++) {
        sum += arr[j];
      }
      ret.push(sum / groupSize);
    }
    else {
      ret.push(arr[i * groupSize]);
    }
  }
  return ret;
}
