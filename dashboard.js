(() => {
  const endpoint = APP_CONFIG.GAS_WEB_APP_URL;
  const loginCard = document.getElementById("loginCard");
  const analytics = document.getElementById("analytics");
  const keyInput = document.getElementById("adminKey");
  const loginBtn = document.getElementById("loginBtn");
  const refreshBtn = document.getElementById("refreshBtn");
  const loginMessage = document.getElementById("loginMessage");

  let key = sessionStorage.getItem("lifeflow_admin_key") || "";

  function setMessage(text, type="") {
    loginMessage.textContent = text;
    loginMessage.className = `form-message ${type}`;
  }

  function pct(value, total) {
    return total ? Math.round((value / total) * 100) : 0;
  }

  function drawBars(id, items) {
    const el = document.getElementById(id);
    if (!items || !items.length) {
      el.innerHTML = `<div class="empty-state">No data yet.</div>`;
      return;
    }
    const max = Math.max(...items.map(x => x.count), 1);
    el.innerHTML = items.map(x => `
      <div class="bar-row">
        <div class="bar-label"><span>${escapeHtml(x.label)}</span><b>${x.count}</b></div>
        <div class="bar-track"><i style="width:${Math.round((x.count/max)*100)}%"></i></div>
      </div>`).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  function render(data) {
    document.getElementById("mTotal").textContent = data.total;
    document.getElementById("mWilling").textContent = `${data.willingYes} (${pct(data.willingYes,data.total)}%)`;
    document.getElementById("mEmergency").textContent = `${data.emergencyYes} (${pct(data.emergencyYes,data.total)}%)`;
    document.getElementById("mImportance").textContent = data.averageRegistryImportance ?? "—";
    drawBars("bloodChart", data.bloodGroups);
    drawBars("ageChart", data.ageGroups);
    drawBars("historyChart", data.donationCounts);
    drawBars("usefulChart", data.directoryUseful);
  }

  async function load() {
    if (!endpoint || endpoint.includes("PASTE_YOUR")) {
      setMessage("Add the Apps Script Web App URL to config.js first.", "error");
      return;
    }
    if (!key) {
      loginCard.classList.remove("hidden");
      analytics.classList.add("hidden");
      return;
    }

    try {
      refreshBtn.disabled = true;
      const url = `${endpoint}?action=stats&key=${encodeURIComponent(key)}&callback=lifeflowStats`;
      const data = await new Promise((resolve, reject) => {
        const callbackName = "lifeflowStats";
        const old = window[callbackName];
        const script = document.createElement("script");
        const timer = setTimeout(() => {
          cleanup();
          reject(new Error("Request timed out."));
        }, 10000);
        function cleanup() {
          clearTimeout(timer);
          if (script.parentNode) script.parentNode.removeChild(script);
          if (old) window[callbackName] = old; else delete window[callbackName];
        }
        window[callbackName] = payload => { cleanup(); resolve(payload); };
        script.onerror = () => { cleanup(); reject(new Error("Could not reach backend.")); };
        script.src = url;
        document.body.appendChild(script);
      });

      if (!data.ok) throw new Error(data.error || "Invalid dashboard key.");
      render(data);
      loginCard.classList.add("hidden");
      analytics.classList.remove("hidden");
      sessionStorage.setItem("lifeflow_admin_key", key);
      setMessage("");
    } catch (err) {
      sessionStorage.removeItem("lifeflow_admin_key");
      loginCard.classList.remove("hidden");
      analytics.classList.add("hidden");
      setMessage(err.message, "error");
    } finally {
      refreshBtn.disabled = false;
    }
  }

  loginBtn.addEventListener("click", () => {
    key = keyInput.value.trim();
    load();
  });
  keyInput.addEventListener("keydown", e => { if (e.key === "Enter") loginBtn.click(); });
  refreshBtn.addEventListener("click", load);
  load();
})();