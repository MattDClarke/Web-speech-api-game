export function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// utility fn... can be used multiple times
export async function asyncMap(array, callback) {
  // make an array to store our results
  const results = [];
  // loop over array
  for (const item of array) {
    results.push(await callback(item));
  }
  return results;
}
