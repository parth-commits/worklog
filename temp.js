let workLogObjSync = {
    '202110': [
      {
      '03': ['Wed', '1100', '1500', 4],
      '02': ['Tue', '1000', '1400', 14],
      '01': ['Mon', '0900', '1300', 5],
      '07': ['Thu', '0930', '2000', 10.5],
      },
      139],
    '202109': [
      {
        '03': ['Wed', '1100', '1500', 8],
        '02': ['Tue', '1000', '1400', 9],
        '01': ['Mon', '0900', '1300', 4],
      },
      280],
    '202108': [
      {
        '03': ['Wed', '1100', '1500', 1],
        '02': ['Tue', '1000', '1400', 3],
        '01': ['Mon', '0900', '1300', 11],
      },
      67],
    '202112': [
    {
        '03': ['Wed', '1100', '1500', 12],
        '02': ['Tue', '1000', '1400', 3],
        '01': ['Mon', '0900', '1300', 6],
    },
    67],
  }
  let keys = Object.keys(workLogObjSync['202110'][0]).sort(function(a, b){return b-a});
  console.log(keys);
  for (let i = 0; i < keys.length; i++) {
    console.log(keys[i]);
    
  }
  console.log(typeof keys);
let temp = JSON.stringify(workLogObjSync);
let temp2 = JSON.parse(temp);
//console.log(temp);
//console.log(temp2);
