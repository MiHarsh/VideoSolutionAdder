console.log("LeetCode Video Solutions -> Background Script Running!");
const API_URL = "http://youtube-scrape.herokuapp.com/api/search?q=";

chrome.runtime.onMessage.addListener((msg, sender, resp) => {
  if (msg.command == "fetch") {
    const { problemId, problemTitle, platform } = msg.data;
    let fetchurl = "";
    if (platform === "leetcode") {
      fetchurl = `${API_URL}leetcode ${problemId} ${problemTitle} solution`;
    } else if (platform === "gfg") {
      fetchurl = `${API_URL}geeks for geeks ${problemTitle} solution`;
    } else if (platform === "codeforces") {
      fetchurl = `${API_URL}codeforces ${problemId} ${problemTitle} solution`;
    }

    fetch(fetchurl)
      .then((response) => response.json())
      .then((data) => {
        resp({
          type: "result",
          status: "success",
          data: data,
          request: msg,
        });
      })
      .catch((e) => {
        resp({
          type: "result",
          status: "error",
          data: e,
          request: msg,
        });
      });
  }

  return true;
});
