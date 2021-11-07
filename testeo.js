const cathegoryInput = document.querySelector(".food");
const choosePlate = document.getElementById("testIn");
const suggestedPanel = document.querySelector(".suggest");
const secondPanel = document.querySelector(".suggestMe");
const amountPanel = document.querySelector(".amount");
const submitData = document.getElementById("send");
const resultsButton = document.getElementById("results");
const tableBody = document
  .getElementById("tata")
  .getElementsByTagName("tbody")[0];
const backBox = document.getElementById("sign");

const cathegories = [
  { name: "Alcoholic Drinks & Beverages" },
  { name: "Baking Ingredients" },
  { name: "Beef & Veal" },
  { name: "Beer" },
  { name: "Cakes & Pies" },
  { name: "Candy & Sweets" },
  { name: "Canned Fruit" },
  { name: "Cereal Products" },
  { name: "Cheese" },
  { name: "Cold Cuts & Lunch Meat" },
  { name: "Cream Cheese" },
  { name: "Dishes & Meals" },
  { name: "Fast Food" },
  { name: "Fish & Seafood" },
  { name: "Fruits" },
  { name: "Herbs & Spices" },
  { name: "Ice Cream" },
  { name: "Juices" },
  { name: "Legumes" },
  { name: "Meat" },
  { name: "Milk & Dairy Products" },
  { name: "Non-Alcoholic Drinks & Beverages" },
  { name: "Nuts & Seeds" },
  { name: "Oatmeal, Muesli & Cereals" },
  { name: "Offal & Giblets" },
  { name: "Oils & Fats" },
  { name: "Pasta & Noodles" },
  { name: "Pastries, Breads & Rolls" },
  { name: "Pizza" },
  { name: "Pork" },
  { name: "Potato Products" },
  { name: "Poultry & Fowl" },
  { name: "Sauces & Dressings" },
  { name: "Sausage" },
  { name: "Sliced Cheese" },
  { name: "Soda & Soft Drinks" },
  { name: "Soups" },
  { name: "Spreads" },
  { name: "Tropical & Exotic Fruits" },
  { name: "Vegetable Oils" },
  { name: "Vegetables" },
  { name: "Venison & Game" },
  { name: "Wine" },
  { name: "Yogurt" },
];

let infoArrayOfPlate = [];
let amountsPerPlate = [];
let ultimateRow = [];
let acumulateTest = 0;
let wholeCalories = 0;

function platesToChoose(infoSource) {
  let getPlates = infoSource.split("}, {");
  return getPlates;
}

function checkSingleLeftKeyAndFix(portion) {
  let wholePortion = "{" + portion.replace(/'/g, '"');
  if (wholePortion.includes("}}") === true) {
    wholePortion = wholePortion.replace("}}", "}");
  } else if (wholePortion.includes("}") == false) {
    wholePortion = wholePortion + "}";
  }
  return wholePortion;
}

function checkDoubleLeftKeyAndFix(portion) {
  let wholePortion = portion.replace("{", "").replace(/'/g, '"');
  if (wholePortion.includes("}}") === true) {
    wholePortion = wholePortion.replace("}}", "}");
  } else if (wholePortion.includes("}") == false) {
    wholePortion = wholePortion + "}";
  }
  return wholePortion;
}

function arrayStringToJSON(arrayString) {
  let JSONarray = [];
  for (val = 0; val < arrayString.length; val++) {
    let toJSON = JSON.parse(arrayString[val]);
    JSONarray.push(toJSON);
  }
  return JSONarray;
}

function parseAndFixText(candidate) {
  let container = [];
  for (can = 0; can < candidate.length; can++) {
    let newCan;
    if (candidate[can].includes("{") == false) {
      newCan = checkSingleLeftKeyAndFix(candidate[can]);
      container.push(newCan);
    } else if (candidate[can].includes("{{")) {
      newCan = checkDoubleLeftKeyAndFix(candidate[can]);
      container.push(newCan);
    }
  }
  return arrayStringToJSON(container);
}

function getTheNames(platesJSON) {
  namesArray = [];
  for (plate = 0; plate < platesJSON.length; plate++) {
    plateName = { name: platesJSON[plate].name };
    namesArray.push(plateName);
  }
  return namesArray;
}

function choosenPlateInfo(plates, userChoice) {
  //Analise this

  //TO BE implemented
  for (optPlate = 0; optPlate < plates.length; optPlate++) {
    if (plates[optPlate].name === userChoice) {
      return plates[optPlate];
    }
  }
}

function createArrayPlatesChoosen(arrayInfoOfPlate, amountOfPortions) {
  let additionalInfo = calcCaloriesPerPlate(amountOfPortions, arrayInfoOfPlate); //caloriesTOTAL
  let secondArray = { amount: amountOfPortions, total: additionalInfo };
  let finalArray = Object.assign(arrayInfoOfPlate, secondArray);
  return finalArray;
}

function calcCaloriesPerPlate(amount, plateInfo) {
  //to be implemented
  let calPerPlate = amount * parseInt(plateInfo.calories.split(" ")[0]);
  return calPerPlate;
}

function chooseOption(fromTag, panelDiv, optNames, storeMyData) {
  var xmlworks;
  const URL = "http://localhost:4000//connectWithBack"; //TEST SENDING/POST DATA
  const xhr = new XMLHttpRequest();

  fromTag.addEventListener("keyup", function () {
    const input = fromTag.value;
    panelDiv.innerHTML = "";

    const options = optNames.filter(function (cathe) {
      return cathe.name.toLowerCase().startsWith(input);
    });

    options.forEach(function (opt) {
      const div = document.createElement("div");
      div.style.borderBottom = "1px solid grey";
      div.style.fontFamily = "Sans-serif";
      div.style.fontSize = "1em";
      div.innerHTML = opt.name;

      panelDiv.appendChild(div);

      div.onclick = function () {
        fromTag.value = opt.name;
        panelDiv.innerHTML = "";

        choosePlate.style.visibility = "visible";
        sendNameAPI = JSON.stringify({ name: fromTag.value });

        xhr.open("POST", URL, true);
        xhr.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        sender = sendNameAPI;
        xhr.send(sender);
        console.log("SENT");

        fetch(URL)
          .then((res) => {
            return res.text();
          })
          .then((text) => {
            //This goes very well
            let platesRes = parseAndFixText(platesToChoose(text));
            console.log("Plates are", typeof platesRes); //Array became JSON
            //console.log(plates);
            //var infoArrayP = chooseOptionMeal(choosePlate, secondPanel, plates);

            choosePlate.addEventListener("keyup", function () {
              let input = choosePlate.value;
              secondPanel.innerHTML = "";

              let plates = getTheNames(platesRes).filter(function (cathe) {
                return cathe.name.toLowerCase().startsWith(input);
              });

              plates.forEach(function (opt) {
                let div = document.createElement("div");
                div.style.borderBottom = "1px solid grey";
                div.style.fontFamily = "Sans-serif";
                div.style.fontSize = "1em";
                div.innerHTML = opt.name;
                secondPanel.appendChild(div);

                div.onclick = function () {
                  choosePlate.value = opt.name;
                  secondPanel.innerHTML = "";
                  infoArrayOfPlate.push(choosenPlateInfo(platesRes, opt.name));
                  amountPanel.style.visibility = "visible";
                };
              });
              if (input === "") {
                secondPanel.innerHTML = "";
              }
            });
          });
      };
    });
    if (input === "") {
      panelDiv.innerHTML = "";
    }
  });

  submitData.addEventListener("click", function () {
    amountsPerPlate.push(amountPanel.value);
    console.log("GRAN VALUE ", amountPanel.value);

    ultimateRow.push(
      createArrayPlatesChoosen(
        infoArrayOfPlate[acumulateTest],
        amountPanel.value
      )
    );
    wholeCalories =
      wholeCalories +
      createArrayPlatesChoosen(
        infoArrayOfPlate[acumulateTest],
        amountPanel.value
      ).total;
    console.log("ULTIMATE ROW ", ultimateRow); //THIS WORKS GREAT!!!! NOW PLEASE PRETTIFY CODE CAREFULLY...

    acumulateTest++;
    amountPanel.value = "";
  });

  resultsButton.addEventListener("click", function () {
    for (line = 0; line < ultimateRow.length; line++) {
      var row = tableBody.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      cell1.innerHTML = ultimateRow[line].name;
      cell2.innerHTML = ultimateRow[line].portion;
      cell3.innerHTML = ultimateRow[line].calories;
      cell4.innerHTML = ultimateRow[line].amount;
      cell5.innerHTML = ultimateRow[line].total;
    }
    var lastRow = tableBody.insertRow(ultimateRow.length);
    var cell1 = lastRow.insertCell(0);
    var cell2 = lastRow.insertCell(1);
    var cell3 = lastRow.insertCell(2);
    var cell4 = lastRow.insertCell(3);
    var cell5 = lastRow.insertCell(4);
    cell1.innerHTML = "Total calories";
    cell2.innerHTML = "";
    cell3.innerHTML = "";
    cell4.innerHTML = "";
    cell5.innerHTML = wholeCalories;
    document.getElementById("tata").style.visibility = "visible";
    document
      .getElementById("showResults")
      .scrollIntoView({ block: "end", behavior: "smooth" });
  });
}

let dataStored = [];

chooseOption(cathegoryInput, suggestedPanel, cathegories, dataStored);
