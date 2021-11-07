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
  for (val = 1; val < arrayString.length; val++) {
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
  for (optPlate = 0; optPlate < plates.length; optPlate++) {
    if (plates[optPlate].name === userChoice) {
      return plates[optPlate];
    }
  }
}

function createArrayPlatesChoosen(arrayInfoOfPlate, amountOfPortions) {
  let additionalInfo = calcCaloriesPerPlate(amountOfPortions, arrayInfoOfPlate);
  let secondArray = { amount: amountOfPortions, total: additionalInfo };
  let finalArray = Object.assign(arrayInfoOfPlate, secondArray);
  return finalArray;
}

function calcCaloriesPerPlate(amount, plateInfo) {
  let calPerPlate = amount * parseInt(plateInfo.calories.split(" ")[0]);
  return calPerPlate;
}

function cathegoriesPredictions(names, inputSource) {
  let resultNames = [];
  names.filter(function (cathe) {
    if (cathe.name.toLowerCase().startsWith(inputSource) == true) {
      resultNames.push(cathe.name);
    }
  });
  return resultNames;
}

function createPredictionsDiv(divOptions) {
  divTag = document.createElement("div");
  divTag.style.borderBottom = "1px solid grey";
  divTag.style.fontFamily = "Sans-serif";
  divTag.style.fontSize = "1em";
  divTag.innerHTML = divOptions;
  return divTag;
}

function sendPostRequest(senderObject, urlAdress, message) {
  senderObject.open("POST", urlAdress, true);
  senderObject.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  senderObject.send(message);
}

function chooseOption(fromTag, panelDiv, optNames) {
  //const URL = "http://localhost:4000//connectWithBack";
  const URL = "http://localhost:80//connectWithBack";
  const xhr = new XMLHttpRequest();

  fromTag.addEventListener("keydown", function () {
    const input = fromTag.value;
    panelDiv.innerHTML = "";

    const options = cathegoriesPredictions(optNames, input);
    options.forEach(function (opt) {
      const div = createPredictionsDiv(opt);
      panelDiv.appendChild(div);
      div.onclick = function () {
        fromTag.value = opt;
        panelDiv.innerHTML = "";

        choosePlate.style.visibility = "visible";
        sendNameAPI = JSON.stringify({ name: fromTag.value });

        sendPostRequest(xhr, URL, sendNameAPI);
        fetch(URL)
          .then((res) => {
            return res.text();
          })
          .then((text) => {
            let platesRes = parseAndFixText(platesToChoose(text));

            choosePlate.addEventListener("keydown", function () {
              let input = choosePlate.value;
              secondPanel.innerHTML = "";

              let plates = getTheNames(platesRes).filter(function (cathe) {
                return cathe.name.toLowerCase().startsWith(input);
              });

              plates.forEach(function (opt) {
                const divCont = createPredictionsDiv(opt);
                divCont.innerHTML = opt.name;

                secondPanel.appendChild(divCont);
                divCont.onclick = function () {
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

chooseOption(cathegoryInput, suggestedPanel, cathegories);
