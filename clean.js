// 1. descriptive Name
// 2. Dry => limOperator if
// 3. var -> let
// 4. limOperator -> arrow function and ternary
// 5. check refractor loop
// 6. guard clause return

let budget = [
  { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
  { value: -45, description: 'Groceries 🥑', user: 'jonas' },
  { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
  { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
  { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
  { value: -20, description: 'Candy 🍭', user: 'matilda' },
  { value: -125, description: 'Toys 🚂', user: 'matilda' },
  { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
];

let maxAmount = {
  jonas: 1500,
  matilda: 100,
};

let limOperator = ((maxAmount, user) => maxAmount[user] ? maxAmount[user] : 0);


let addToBudget = function (value, description, user = 'jonas') {
  user = user.toLowerCase();
  let lim = limOperator(maxAmount, user)

  console.log(lim);
  if (value <= lim) budget.push({ value: -value, description, user });
  
};
addToBudget(90, 'Pizza', 'matilda')


let check = function () {
  budget.forEach(function(el){
      let lim = limOperator(maxAmount, el.user)
      if (el.value < -lim) {
            el.flag = 'limit';
      }
  })
};
check();


let bigExpenses = function (limit) {
  // let output = '';
  // for (let el of budget) {
  //   if (el.value <= -limit) {
  //     output += el.description.slice(-2) + ' / '; // Emojis are 2 chars
  //   }
  // }
  // output = output.slice(0, -2); // Remove last '/ '
  // console.log(output);
  let output =''
  budget.forEach(function(el){
    if(el.value > -limit) return;      
    output += el.description.slice(-2) + ' /' 
  })
    console.log(output.slice(0, -2));
};

bigExpenses(100)