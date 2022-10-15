console.log("loaded cses-ui");
// we are in a problem page
if (location.href.trim().includes("/problemset/")) {
  let allh2 = document.querySelectorAll("h2");
  for (let i = 1; i < allh2.length; i++) {
    let cur = allh2[i];
    let cur_ul = cur.nextElementSibling.children;
    let done = Array.from(cur_ul).filter((ele) =>
      ele.children[2].classList.contains("full")
    ).length;

    cur.innerHTML += ": " + done + "/" + cur_ul.length;

  }
}
