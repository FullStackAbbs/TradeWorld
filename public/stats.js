let userData;
let avgRatioArr = [];
let avgRiskArr= [];
let avgRewardArr =[];
let averageRatioBox = document.querySelector('#averageRatioEntry');
let averageRiskBox = document.querySelector('#averageRiskEntry');
let averageRewardBox = document.querySelector('#averageRewardEntry');
let winCountBox = document.querySelector('#winCountEntry');
let breakevenCountBox= document.querySelector('#breakevenCountEntry');
let quwiCountBox= document.querySelector('#quwiCountEntry');
let feedback = document.querySelector('#feedback');



fetch('questionBank.json')
  .then(response => response.json())
  .then(data => {
    userData = data.fakeData
    avgRatio();
    avgRisk();
    avgReward();
    winLose();
    feedback();

  })
  .catch(err => console.log('error '))
  //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce GO TO SUM OF VALUES IN OBJECT ARRAY TYPE CUTE

  const avgRatio = () => {
    for(let i = 0; i < userData.length; i++){
    avgRatioArr.push(parseFloat(userData[i].riskReward))
    let sum = avgRatioArr.reduce((a,b) => a + b);
    let actualAvgRatio = sum/(userData.length);
    averageRatioBox.innerHTML = actualAvgRatio.toFixed(2)
    let perfRR =3;
    let difference = 3-actualAvgRatio.toFixed(2);


    if (actualAvgRatio <3){
      feedback.innerHTML = `Chances may be you are over leveraging your account meaning the trades you are taken are not worth it. Consider increasing your R:R by ${difference} `
      console.log(`Chances may be you are over leveraging your account meaning the trades you are taken are not worth it. Consider increasing your R:R by ${difference} `)
    }

    }
    }
  const avgRisk = () => {
    for(let i = 0; i < userData.length; i++){
    avgRiskArr.push(parseFloat(userData[i].risk))
    let sum1 = avgRiskArr.reduce((a,b) => a + b);
    let actualAvgRisk = sum1/(userData.length);
    averageRiskBox.innerHTML = actualAvgRisk.toFixed(2)
      }
      }
  const avgReward = () => {
      for(let i = 0; i < userData.length; i++){
      avgRewardArr.push(parseFloat(userData[i].reward))
      let sum2 = avgRewardArr.reduce((a,b) => a + b);
      let actualAvgReward = sum2/(userData.length);
      averageRewardBox.innerHTML = actualAvgReward.toFixed(2)
            }
            }

const winLose = () => {
  let winCount=0;
  winCountBox.innerHTML = winCount;
  let lossCount=0;
  quwiCountBox.innerHTML = lossCount
  let breakevenCount=0;
  breakevenCountBox.innerHTML = breakevenCount;
  for(let i = 0; i < userData.length; i++){
    if(userData[i].winStatus === "WIN"){
      winCount++
      winCountBox.innerHTML = winCount;
    }if( userData[i].winStatus === "LOSE"){
      lossCount++
      quwiCountBox.innerHTML = lossCount
    }if ( userData[i].winStatus === "BREAKEVEN" ){
      breakevenCount++
      breakevenCountBox.innerHTML = breakevenCount;
    }
  }
}
