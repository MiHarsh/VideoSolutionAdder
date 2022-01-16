console.log("LeetCode Video Solutions -> Content Script Running!");
// waiting for question title to appear
document.arrive("div[data-cy='question-title']", function () {
  const videoSolutionsTabElement = document.querySelector(
    ".video-solutions-geekysrm"
  );
  // we are in a problem page and there is no existing video solutions tab
  if (
    location.href.trim().includes("/problems/") &&
    !videoSolutionsTabElement
  ) {
    //remove the Question Fast Picker section at the bottom (it is causing the extension to not work and crashes)
    const questionFastPicker = document.querySelector(
      "[class^=question-fast-picker-wrapper]"
    );
    questionFastPicker.style.display = "none";
    // 'this' refers to the newly created element
    console.log("title arrived");
    const textSolutionDiv = document.querySelector("div[data-cy='solution']");
    const textSolutionDivClass = textSolutionDiv.getAttribute("class");
    var videoSolutionsTabDiv = document.createElement("div");
    console.log("Create element ran");
    videoSolutionsTabDiv.innerHTML = `
  <span><div type="default" style="display: flex;-webkit-box-pack: center;
 justify-content: center; position: relative; color: inherit; -webkit-box-flex: 1; flex-grow: 1; width: 100%; line-height: 16px; padding: 12px;"><span><div style="display: flex; justify-content: center;" ><svg style="width: 14px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span style="margin-left:4px;">Video Solutions</span></div></span></div></span>
  `;
    videoSolutionsTabDiv.setAttribute("data-key", "videoSolutions");
    videoSolutionsTabDiv.setAttribute("data-cy", "videoSolutions");
    videoSolutionsTabDiv.setAttribute("data-disabled", "false");
    videoSolutionsTabDiv.setAttribute("type", "default");
    videoSolutionsTabDiv.className = `video-solutions-geekysrm ${textSolutionDivClass}`;
    videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
    videoSolutionsTabDiv.style.cursor = "pointer";
    textSolutionDiv.parentNode.insertBefore(
      videoSolutionsTabDiv,
      textSolutionDiv.nextSibling
    );
    videoSolutionsTabDiv.addEventListener("click", (event) => {
      // we do below stuff only if video solutions tab is currently not selected
      if (videoSolutionsTabDiv.style.backgroundColor === "rgb(250, 250, 250)") {
        console.log("Video Solutions Tab clicked");
        videoSolutionsTabDiv.style.backgroundColor = "#ffffff";
        //check which tab we are on (by checking the URL) and replace the content with video solutions on clicking video solutions tab. On clicking the original tab again, restore the content
        let currentURL = location.href.trim();
        if (currentURL.includes("/solution")) {
          // in solution tab
          console.log("in solution tab");
          const solutionContentDiv = getDivElement("solution-content");
          const solutionTabDiv = getDivElement("solution");
          solutionTabDiv.style.backgroundColor = "#fafafa";
          const originalSolutionContentHTML = solutionContentDiv.innerHTML;
          const idWithTitle = this.innerText;
          const idWithTitleArray = idWithTitle.split(".");
          const problemId = Number(idWithTitleArray[0].trim());
          const problemTitle = idWithTitleArray[1].trim();
          const platform = "leetcode";
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
          // solutionContentDiv.innerHTML = videoSolutionsContentHTML;
          solutionTabDiv.addEventListener("click", (event) => {
            solutionContentDiv.innerHTML = originalSolutionContentHTML;
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            solutionTabDiv.style.backgroundColor = "#ffffff";
          });
          const submissionsTabDiv = getDivElement("submissions");
          submissionsTabDiv.addEventListener("click", (event) => {
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            submissionsTabDiv.style.backgroundColor = "#ffffff";
          });
          const descriptionTabDiv = getDivElement("description");
          descriptionTabDiv.addEventListener("click", (event) => {
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            descriptionTabDiv.style.backgroundColor = "#ffffff";
          });
        } else if (currentURL.includes("/discuss")) {
          // in discuss tab
          console.log("in discuss tab");
          const discussContentDiv = getDivElement("discuss-content");
        } else if (currentURL.includes("/submissions")) {
          // in submissions tab
          console.log("in submissions tab");
          const submissionsContentDiv = getDivElement("submissions-content");
          const submissionsTabDiv = getDivElement("submissions");
          submissionsTabDiv.style.backgroundColor = "#fafafa";
          const originalSubmissionsContentHTML =
            submissionsContentDiv.innerHTML;
          const idWithTitle = this.innerText;
          const idWithTitleArray = idWithTitle.split(".");
          const problemId = Number(idWithTitleArray[0].trim());
          const problemTitle = idWithTitleArray[1].trim();
          // submissionsContentDiv.innerHTML = `<div>Loading...</div>`
          chrome.runtime.sendMessage(
            {
              command: "fetch",
              data: {
                problemId,
                problemTitle,
              },
            },
            (response) => {
              submissionsContentDiv.innerHTML = getVideosHTML(response.data);
            }
          );
          // submissionsContentDiv.innerHTML = videoSolutionsContentHTML;
          submissionsTabDiv.addEventListener("click", (event) => {
            submissionsContentDiv.innerHTML = originalSubmissionsContentHTML;
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            submissionsTabDiv.style.backgroundColor = "#ffffff";
          });
          const solutionTabDiv = getDivElement("solution");
          solutionTabDiv.addEventListener("click", (event) => {
            // solutionContentDiv.innerHTML = originalSolutionContentHTML;
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            solutionTabDiv.style.backgroundColor = "#ffffff";
          });
          const descriptionTabDiv = getDivElement("description");
          descriptionTabDiv.addEventListener("click", (event) => {
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            descriptionTabDiv.style.backgroundColor = "#ffffff";
          });
        } else {
          // in description tab
          console.log("in description tab");
          const descriptionContentDiv = getDivElement("description-content");
          const descriptionTabDiv = getDivElement("description");
          descriptionTabDiv.style.backgroundColor = "#fafafa";
          const originalDescriptionContentHTML =
            descriptionContentDiv.innerHTML;
          const idWithTitle = this.innerText;
          const idWithTitleArray = idWithTitle.split(".");
          const problemId = Number(idWithTitleArray[0].trim());
          const problemTitle = idWithTitleArray[1].trim();
          const platform = "leetcode";
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
              descriptionContentDiv.innerHTML = getVideosHTML(response.data);
            }
          );
          // descriptionContentDiv.innerHTML = videoSolutionsContentHTML;
          descriptionTabDiv.addEventListener("click", (event) => {
            descriptionContentDiv.innerHTML = originalDescriptionContentHTML;
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            descriptionTabDiv.style.backgroundColor = "#ffffff";
          });
          const solutionTabDiv = getDivElement("solution");
          solutionTabDiv.addEventListener("click", (event) => {
            // solutionContentDiv.innerHTML = originalSolutionContentHTML;
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            solutionTabDiv.style.backgroundColor = "#ffffff";
          });
          const submissionsTabDiv = getDivElement("submissions");
          submissionsTabDiv.addEventListener("click", (event) => {
            videoSolutionsTabDiv.style.backgroundColor = "#fafafa";
            submissionsTabDiv.style.backgroundColor = "#ffffff";
          });
        }
      }
    });
  }
});
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
  const htmlToReturn = `
    <div class="video-solutions-content-geekysrm">
    <div style="display:flex; justify-content: space-between;">
      <h2>Video Solutions</h2>
    <div style="display:flex; flex-direction:column;">
      <a style="text-align:right;" href="https://coffee.soumya.dev/" target="_blank"><img height='30' style='border:0px;height:30px;border-radius:5px;' src='https://cdn.buymeacoffee.com/buttons/default-orange.png' border='0' alt='Buy Me a Coffee' /></a>
      <span class="made-by">Made by <a href="https://soumya.dev" target="_blank">Soumya (geekysrm)</a></span>
    </div>
    </div>
    <hr>
    <div class="disclaimer">
      Please note: The videos are fetched from YouTube. Some videos may be irrelevant to the problem.
    </div>
    <div style="position: absolute;">
      ${videosListHTML}
    <div class="feedback">
      Please give your valuable feedback about the extension <a href="https://link.soumya.dev/lvs-feedback-chrome" target="_blank">here</a>.
      <p>If you found this extension helpful, please consider sharing this in social media:</p>
    </div>
    
    <div class="share">
      <a href="https://twitter.com/intent/tweet?url=https://chrome.google.com/webstore/detail/leetcode-video-solutions/ilnmgkahgjdpkoliooildngldmilhelm&text=LeetCode Video Solutions by @geekysrm is a really helpful extension which provides FREE video solutions ▶ to each problem on the problem page itself! I am using it and loving it!  Give it a try - &via=geekysrm" target="_blank" class="twitter-share share-button">
        <span class="share-icon">
          <svg style="width:24px;height:24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><path opacity=".15" fill="none" d="M0 0h400v400H0z"/><path d="M153.6 301.6c94.3 0 145.9-78.2 145.9-145.9 0-2.2 0-4.4-.1-6.6 10-7.2 18.7-16.3 25.6-26.6-9.2 4.1-19.1 6.8-29.5 8.1 10.6-6.3 18.7-16.4 22.6-28.4-9.9 5.9-20.9 10.1-32.6 12.4-9.4-10-22.7-16.2-37.4-16.2-28.3 0-51.3 23-51.3 51.3 0 4 .5 7.9 1.3 11.7-42.6-2.1-80.4-22.6-105.7-53.6-4.4 7.6-6.9 16.4-6.9 25.8 0 17.8 9.1 33.5 22.8 42.7-8.4-.3-16.3-2.6-23.2-6.4v.7c0 24.8 17.7 45.6 41.1 50.3-4.3 1.2-8.8 1.8-13.5 1.8-3.3 0-6.5-.3-9.6-.9 6.5 20.4 25.5 35.2 47.9 35.6-17.6 13.8-39.7 22-63.7 22-4.1 0-8.2-.2-12.2-.7 22.6 14.4 49.6 22.9 78.5 22.9" fill="#fff"/></svg>
        </span>
        <span class="share-text">Tweet</span>
      </a>
      <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://chrome.google.com/webstore/detail/leetcode-video-solutions/ilnmgkahgjdpkoliooildngldmilhelm&title=&summary=LeetCode Video Solutions by @geekysrm is a really helpful extension which provides FREE video solutions to each problem on the problem page itself! I am using it and loving it!  Give it a try:&source=geekysrm" target="_blank" class="linkedin-share share-button">
        <span class="share-icon">
          <svg style="width:24px;height:24px" xmlns="http://www.w3.org/2000/svg" viewBox="-11.494 -16.312 99.612 97.871"><path fill="#fff" d="M72.865 61.11a1.2 1.2 0 001.21-1.27c0-.9-.543-1.33-1.657-1.33h-1.8v4.712h.677v-2.054h.832l.019.025 1.291 2.03h.724l-1.389-2.1zm-.783-.473h-.785v-1.593h.995c.514 0 1.1.084 1.1.757 0 .774-.593.836-1.314.836m-16.873-5.433h-9.6V40.17c0-3.585-.064-8.2-4.993-8.2-5 0-5.765 3.906-5.765 7.94v15.293h-9.6V24.287h9.216v4.225h.129a10.1 10.1 0 019.093-4.994c9.73 0 11.524 6.4 11.524 14.726zm-40.79-35.143a5.571 5.571 0 115.57-5.572 5.571 5.571 0 01-5.57 5.572m4.8 35.143h-9.61V24.287h9.61zM59.991.004H4.781A4.728 4.728 0 000 4.674v55.44a4.731 4.731 0 004.781 4.674h55.21a4.741 4.741 0 004.8-4.675V4.67a4.738 4.738 0 00-4.8-4.67"/><path fill="#fff" d="M72.164 56.411a4.418 4.418 0 10.085 0h-.085m0 8.33a3.874 3.874 0 113.809-3.938v.065a3.791 3.791 0 01-3.708 3.871h-.1"/></svg>
        </span>
        <span class="share-text">Share</span>
      </a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=https://chrome.google.com/webstore/detail/leetcode-video-solutions/ilnmgkahgjdpkoliooildngldmilhelm" target="_blank" class="facebook-share share-button">
        <span class="share-icon">
          <svg style="width:24px;height:24px" xmlns="http://www.w3.org/2000/svg" viewBox="-204.8 -341.333 1774.933 2047.999"><path d="M1365.333 682.667C1365.333 305.64 1059.693 0 682.667 0 305.64 0 0 305.64 0 682.667c0 340.738 249.641 623.16 576 674.373V880H402.667V682.667H576v-150.4c0-171.094 101.917-265.6 257.853-265.6 74.69 0 152.814 13.333 152.814 13.333v168h-86.083c-84.804 0-111.25 52.623-111.25 106.61v128.057h189.333L948.4 880H789.333v477.04c326.359-51.213 576-333.635 576-674.373" fill="#3b5998"/><path d="M948.4 880l30.267-197.333H789.333V554.609C789.333 500.623 815.78 448 900.584 448h86.083V280s-78.124-13.333-152.814-13.333c-155.936 0-257.853 94.506-257.853 265.6v150.4H402.667V880H576v477.04a687.805 687.805 0 00106.667 8.293c36.288 0 71.91-2.84 106.666-8.293V880H948.4" fill="#fff"/></svg>
        </span>
        <span class="share-text">Share</span>
      </a>
      <a href="http://reddit.com/submit?url=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fleetcode-video-solutions%2Filnmgkahgjdpkoliooildngldmilhelm&title=LeetCode%20Video%20Solutions%3A%20Get%20Free%20LeetCode%20solution%20videos%20on%20the%20problem%20page%20itself" target="_blank" class="reddit-share share-button">
        <span class="share-icon">
          <svg xmlns="http://www.w3.org/2000/svg" style="width:24px;height:24px" viewBox="-25.65 -42.75 222.3 256.5"><g transform="translate(-85.4 -85.4)"><circle r="85.5" cy="170.9" cx="170.9" fill="#ff4500"/><path d="M227.9 170.9c0-6.9-5.6-12.5-12.5-12.5-3.4 0-6.4 1.3-8.6 3.5-8.5-6.1-20.3-10.1-33.3-10.6l5.7-26.7 18.5 3.9c.2 4.7 4.1 8.5 8.9 8.5 4.9 0 8.9-4 8.9-8.9s-4-8.9-8.9-8.9c-3.5 0-6.5 2-7.9 5l-20.7-4.4c-.6-.1-1.2 0-1.7.3s-.8.8-1 1.4l-6.3 29.8c-13.3.4-25.2 4.3-33.8 10.6-2.2-2.1-5.3-3.5-8.6-3.5-6.9 0-12.5 5.6-12.5 12.5 0 5.1 3 9.4 7.4 11.4-.2 1.2-.3 2.5-.3 3.8 0 19.2 22.3 34.7 49.9 34.7 27.6 0 49.9-15.5 49.9-34.7 0-1.3-.1-2.5-.3-3.7 4.1-2 7.2-6.4 7.2-11.5zm-85.5 8.9c0-4.9 4-8.9 8.9-8.9s8.9 4 8.9 8.9-4 8.9-8.9 8.9-8.9-4-8.9-8.9zm49.7 23.5c-6.1 6.1-17.7 6.5-21.1 6.5-3.4 0-15.1-.5-21.1-6.5-.9-.9-.9-2.4 0-3.3.9-.9 2.4-.9 3.3 0 3.8 3.8 12 5.2 17.9 5.2 5.9 0 14-1.4 17.9-5.2.9-.9 2.4-.9 3.3 0 .7 1 .7 2.4-.2 3.3zm-1.6-14.6c-4.9 0-8.9-4-8.9-8.9s4-8.9 8.9-8.9 8.9 4 8.9 8.9-4 8.9-8.9 8.9z" fill="#fff"/></g></svg>
        </span>
        <span class="share-text">Share</span>
      </a>
    </div>
    </div>
  </div>
`;
  return htmlToReturn;
}
function getDivElement(selectorValue) {
  const divElement = document.querySelector(`div[data-cy='${selectorValue}']`);
  return divElement;
}
