console.log("Codeforces Video Solutions -> Content Script Running!");

console.log("loaded");
const videoSolutionsTabElement = document.querySelector("#videosolutions-tab");
// we are in a problem page and there is no existing video solutions tab
if (location.href.trim().includes("/problem/") && !videoSolutionsTabElement) {
  // 'this' refers to the newly created element
  console.log("title arrived");

  // create tab
  const tabSubmissionDiv = document.getElementsByClassName(
    "second-level-menu-list"
  )[0];

  var videoSolutionsTabDiv = document.createElement("li");
  videoSolutionsTabDiv.id = "videosolutions-tab";
  videoSolutionsTabDiv.innerHTML = `<a name="vs" style="cursor: pointer;">Video Solution</a>`;

  // to switch back to problem statement
  var problemStatementTabDiv = document.createElement("li");
  problemStatementTabDiv.id = "problemStatement-tab";
  problemStatementTabDiv.innerHTML = `<a name="ps" style="cursor: pointer;">Problem Statement</a>`;
  problemStatementTabDiv.style.display = "none";
  //

  console.log("Create element ran");

  tabSubmissionDiv.appendChild(videoSolutionsTabDiv);
  tabSubmissionDiv.appendChild(problemStatementTabDiv);

  // create div to store video contents

  const problemStatementDiv = document.querySelector(".problem-statement");

  const videoSolutionsDiv = document.createElement("div");
  videoSolutionsDiv.id = "videosolutions";
  videoSolutionsDiv.className = `video-solutions-geekysrm`;
  videoSolutionsDiv.style.overflowY = "scroll";
  videoSolutionsDiv.style.height = "550px";
  videoSolutionsDiv.style.margin = "0.5em";
  videoSolutionsDiv.style.display = "none";

  problemStatementDiv.parentNode.appendChild(videoSolutionsDiv);

  videoSolutionsTabDiv.addEventListener("click", (event) => {
    // we do below stuff only if video solutions tab is currently not selected
    // in solution tab
    console.log("in solution tab");

    // hide the pbm statement
    const problemStatementDiv = document.querySelector(".problem-statement");
    problemStatementDiv.style.display = "none";

    // view the solutionDiv
    const videoSolutionsDiv = document.getElementById("videosolutions");
    videoSolutionsDiv.style.display = "block";
    //

    const problemStatementTabDiv = document.getElementById(
      "problemStatement-tab"
    );
    problemStatementTabDiv.style.display = "block";

    const solutionContentDiv = document.getElementById("videosolutions");

    const idWithTitle = document.querySelector(".title").innerText;
    const idWithTitleArray = idWithTitle.split(".");
    const problemId = idWithTitleArray[0].trim();
    const problemTitle = idWithTitleArray[1].trim();

    const platform = "codeforces";
    chrome.runtime.sendMessage(
      {
        command: "fetch",
        data: {
          problemId,
          problemTitle,
          platform,
        },
      },
      (response) => {
        solutionContentDiv.innerHTML = getVideosHTML(response.data);
      }
    );
  });
  problemStatementTabDiv.addEventListener("click", (event) => {
    // hide the added video pane and problemStatementTab as well
    const videoSolutionsDiv = document.getElementById("videosolutions");
    videoSolutionsDiv.style.display = "none";

    event.target.parentNode.style.display = "none";
    const problemStatementDiv = document.querySelector(".problem-statement");
    problemStatementDiv.style.display = "block";
  });
}

function getVideosHTML(data) {
  const results = data.results;
  const onlyVideoResults = results.filter((result) => !!result.video);
  const firstEightResults = onlyVideoResults.slice(0, 10);
  const firstEightVideos = firstEightResults.map((v) => {
    return {
      id: v.video.id,
      title: v.video.title,
      duration: v.video.duration,
      uploadDate: v.video.upload_date,
      views: v.video.views,
      uploader: v.uploader,
    };
  });
  let videosListHTML = "";
  firstEightVideos.forEach((video) => {
    const videoURL = `https://www.youtube.com/watch?v=${video.id}`;
    videosListHTML += `
      <div style="margin-bottom:55px;display: flex;flex-direction: column;justify-content: center;">
        <div style="display:flex;">
          <div style="width:370px; height:100%; margin-bottom:11px;">
            <lite-youtube videoid=${video.id} playlabel=${video.title} params="modestbranding=1&rel=0"></lite-youtube>
          </div>
          <div style="display: flex; flex-direction: column; margin-left:20px;">
            <span style="margin-bottom: 5px;"><svg style="width:12px; margin-right:5px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>${video.duration}</span></span>
            
            <span style="margin-bottom: 5px;"><svg style="width:12px; margin-right:5px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg><span>${video.views}</span></span>
            <span style="margin-bottom: 5px;"><svg style="width:12px; margin-right:5px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span>${video.uploadDate}</span></span>
            <span style="margin-bottom: 5px;">by <a href=${video.uploader.url} target="_blank">${video.uploader.username}</a></span>
            <a href=${videoURL} target="_blank" style="max-width:140px;">
              <div class="youtube-watch">
                
                  <span>Watch on </span>
                  <span class="yt">YouTube </span>
                  <div class="new-tab-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="rgba(0, 0, 0, 0.65)" width="24" height="24" viewBox="0 0 172 172"><g fill="none" stroke-miterlimit="10" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode:normal"><path d="M0 172V0h172v172z"/><path d="M148.603 17.868a5.377 5.377 0 00-.58.049H98.541a5.376 5.376 0 100 10.75h37.19L80.409 83.99a5.376 5.376 0 107.6 7.601l55.325-55.325v37.191a5.376 5.376 0 1010.75 0V23.971a5.376 5.376 0 00-5.48-6.103zM44.792 28.667c-14.78 0-26.875 12.095-26.875 26.875v71.666c0 14.78 12.095 26.875 26.875 26.875h71.666c14.78 0 26.875-12.095 26.875-26.875V91.375a5.376 5.376 0 10-10.75 0v35.833c0 8.971-7.154 16.125-16.125 16.125H44.792c-8.971 0-16.125-7.154-16.125-16.125V55.542c0-8.971 7.154-16.125 16.125-16.125h35.833a5.376 5.376 0 100-10.75z" fill="rgba(0, 0, 0, 0.65)"/></g></svg>
                  </div>
          
              </div>
            </a>
          </div>
        </div>
        <h5>${video.title}</h5>
      </div>
    `;
  });

  return `
        <div class="video-solutions-content-geekysrm">
        <div style="display:flex; justify-content: space-between;">
        <h2>Video Solutions</h2>
        </div>
        <hr>
        <div class="disclaimer">
        Please note: The videos are fetched from YouTube. Some videos may be irrelevant to the problem.
        </div>
        <div style="position: absolute;">
        ${videosListHTML}
        </div>
    </div>
    `;
}
