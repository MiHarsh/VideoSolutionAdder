console.log("LeetCode Premium -> Content Script Running!");

window.onload = () => {
  console.log("document loaded");
  // load the questionList.
  fetch(chrome.extension.getURL("./quesLists.json"))
    .then((response) => {
      return response.json();
    })
    .then((jsondata) => {
      let list = jsondata["questionList"];
      console.log(list);
      let allQues = document.getElementsByClassName(
        "inline-block min-w-full"
      )[0].children[1].children;

      setTimeout(() => {
        Array.from(allQues).forEach((element) => {
          console.log(element);
          let quesNo = element.childNodes[1].innerText.split(".")[0];

          if (list[quesNo]) {
            console.log(list[quesNo], list[quesNo]["companyTags"].length);
            element.childNodes[5].children[0].replaceChild(
              document.createTextNode(list[quesNo]["companyTags"].length),
              element.childNodes[5].children[0].childNodes[1]
            );
            element.childNodes[5].children[0].innerText =
              list[quesNo]["companyTags"].length;
          } else {
            element.childNodes[5].children[0].innerText = "-";
          }
        });
      }, 3000);
    });
};

// waiting for problemset to appear
document.arrive("div.mx-2", function () {});
