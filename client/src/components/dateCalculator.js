
function diff( startDate) {


  var unitmapping = {
    "year": 12 * 30 * 24 * 60 * 60 * 1000,
    "month": 30 * 24 * 60 * 60 * 1000,
    "day": 24 * 60 * 60 * 1000,
    "hour": 60 * 60 * 1000,
    "minute": 60 * 1000,
    "second": 1000
  };

  function floor(value) {
    return Math.floor(value)
  }

  function getHumanizedDiff(diff) {
    return [floor(diff / unitmapping.year),
      floor((diff % unitmapping.year) / unitmapping.month),
      floor((diff % unitmapping.month) / unitmapping.day),
      floor((diff % unitmapping.day) / unitmapping.hour),
      floor((diff % unitmapping.hour) / unitmapping.minute),
      floor((diff % unitmapping.minute) / unitmapping.second)];
  }


 

  const difference = (getHumanizedDiff(new Date() - new Date(startDate)));
   
    const nonZero = (element) => element > 0;
    const index = difference.findIndex(nonZero)
    if(index===-1)
    {
      return "just now"
    }

    var time;

    switch (index) {
      case 0:
        time = "y";
        break;
      case 1:
        time = "mo";
        break;
      case 2:
        time = "d";
        break;
      case 3:
        time = "h";
        break;
      case 4:
        time = "m";
        break;
      case 5:
        time = "s";
        break;
        default:
          time = "N/A"
    }
    return difference[index] + time

}

export default diff