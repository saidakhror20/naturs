// 1. var => let
// 2. tushunarli nom berish (func)
// 3. default parametr 
// 4. ternary operator
// 5. if{}
// 6. DRY 

let budget = [
  { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
  { value: -45, description: 'Groceries 🥑', user: 'jonas' },
  { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
  { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
  { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
  { value: -20, description: 'Candy 🍭', user: 'matilda' },
  { value: -125, description: 'Toys 🚂', user: 'matilda' },
  { value: -1800, description: 'New Laptop 💻', user: 'jonas'},
];

let limits = {
  jonas: 1500,
  matilda: 100,
};

let limChecker = function(user){
  return limits[user] ? limits[user] : 0;
}

let addToBudget = function (value, description, user = 'jonas') {
  user = user.toLowerCase();
  let lim = limChecker(user)
  if (value <= lim) budget.push({ value: -value, description: description, user: user });
};
addToBudget(100, 'Go Home 🍿', )

let checkLimit = function () {
  budget.forEach(function(el){
    let lim = limChecker(el.user)
    if (el.value < -lim) el.flag = 'limit';
  }) 
};
checkLimit();

let bigExpenses = function (limit) {
  let output =''
  budget.forEach(function(el){
    if(el.value > -limit) return;
    output += el.description.slice(-2) + ' / ';
  })
  console.log(output.slice(0, -2));
};

bigExpenses(100)