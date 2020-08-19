function onSubmitFormData() {
  var json = document.forms["birthdayCalForm"]["json"].value;
  var year = document.forms["birthdayCalForm"]["year"].value;
  var parsedJson = validateJson(json);
  if (parsedJson) {
    console.log("users", parsedJson);
    let days = getDaysForYear(parsedJson, year);
    console.log("days", days);
    updateBirthdayCal(days);
  } else {
    alert("Please input a valid json array");
  }
}

function validateJson(jsonString) {
  try {
    var o = JSON.parse(jsonString);

    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}

  return false;
}

function getSortedUsersList(users) {
  let sortedList = [...users];
  sortedList.sort((a, b) => {
    return new Date(b.birthday) - new Date(a.birthday);
  });
  return sortedList;
}

function getDaysForYear(users, year) {
  let days = [];
  if (Array.isArray(users)) {
    let sortedUsers = getSortedUsersList(users);
    sortedUsers.map((user, index, users) => {
      if (user.hasOwnProperty("birthday")) {
        generateUserCardDetails(user, year, days);
      } else {
        alert(
          "Please input a valid json array with properties 'name' and 'birthday(mm/dd/yyyy)'"
        );
      }
    });
  } else {
    alert("Please input a valid json array");
  }
  return days;
}

function generateUserCardDetails(user, year, days) {
  let birthday = user["birthday"].split("/"); // mm/dd/yyyy
  let day = dayofweek(birthday[1], birthday[0], year);
  if (isNaN(day)) {
    alert(
      `Please input the birthday for ${user.name} in correct format of mm/dd/yyyy`
    );
  } else {
    let initials = user["name"]
      .split(" ")
      .map((n) => n[0].toUpperCase())
      .join("");
    user["initials"] = initials;
    // calc age to sort the users or else manipulate already sorted users array
    // let age = getAge()
    // user['age'] = age;
    // add background color for card
    day = (day + 6) % 7; // to move sunday at last index
    days[day] ? days[day].push(user) : (days[day] = [user]);
  }
}

function dayofweek(d, m, y) {
  let date = new Date(`${m}/${d}/${y}`);
  let day = date.getDay();
  return day;
  //   let t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  //   y -= m < 3;
  //   return Math.floor((y + y / 4 - y / 100 + y / 400 + t[m - 1] + d) % 7);
}

function getColor(index) {
  let color = [
    "#adff2f",
    "#0000ff",
    "#ffc0cb",
    "#00BFFF",
    "#FFA500",
    "#2F4F4F",
    "#008B8B",
    "#FF0000",
    "#C0C0C0",
    "#FFA500",
  ];
  return color[index % color.length];
}

function getCardDimension(cards) {
  let matrixSize = Math.ceil(Math.sqrt(cards.length));
  let dimension = 100 / matrixSize + "%";
  return dimension;
}

function updateBirthdayCal(days) {
  let dayNodes = document.querySelectorAll(".user-list");
  dayNodes.forEach((dayNode, index, dayNodes) => {
    console.log("HTMLnode", dayNode, index);
    let content = "";
    if (days[index]) {
      let dimension = getCardDimension(days[index]);
      days[index].map((user, index, users) => {
        content += `<li class="user-card" style="background-color: ${getColor(
          index
        )};height:${dimension};width:${dimension};">${user.initials}</li>`;
      });
    } else {
      content += `<li class=user-card style="background-color: grey; height:100%; width: 100%;">No Birthdays</li>`;
    }
    dayNode.innerHTML = content;
  });
}
