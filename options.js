document.getElementById("save").addEventListener("click", () => {
    const token = document.getElementById("token").value;
    const repo = document.getElementById("repo").value;
  
    browser.storage.local.set({ token, repo }, () => {
      alert("Settings saved!");
    });
  });
  