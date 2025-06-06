function insertButton() {
  if (document.getElementById("push-to-github-btn")) return;

  const rawTitle = document.title.split(" - ")[0];
  if (!rawTitle) {
    console.log("Could not extract problem title from <title>");
    return;
  }

  const formattedTitle = rawTitle.replace(/\s+/g, "_");

  const nav = document.querySelector(".z-nav-1");
  if (!nav) {
    console.log("Could not find .z-nav-1");
    return;
  }

  const button = document.createElement("button");
  button.id = "push-to-github-btn";
  button.textContent = "Push to GitHub";
  button.style.cssText = "margin-left: 10px; background: #2ea44f; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;";

  button.onclick = async () => {
    const codeEl = document.querySelector("pre code");
    if (!codeEl) return alert("⚠️ Code area not found");
  
    const code = codeEl.innerText;
    const { token, repo } = await browser.storage.local.get(["token", "repo"]);
    if (!token || !repo) return alert("⚠️ Missing GitHub token or repo in settings");
  
    const match = window.location.href.match(/\/submissions\/(\d+)/);
    if (!match) return alert("Failed to push, no submission found.");
  
    const submissionId = match[1];
  
    const now = new Date();
    const folder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  
    const path = `leetcode/${folder}/${submissionId}_${formattedTitle}.py`;
    const content = btoa(code);
    const body = {
      message: `Add solution ${rawTitle} (Submission ID: ${submissionId})`,
      content
    };
  
    fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          alert("Pushed to GitHub!");
        } else {
          alert("Failed: " + JSON.stringify(data));
        }
      });
  };
  

  nav.appendChild(button);
}

setInterval(insertButton, 1500);
console.log("LeetCode to GitHub script loaded");
