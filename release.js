(() => {
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  };

  const setReleaseLink = (selector, value) => {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.hostname !== "github.com") return;
      document.querySelectorAll(selector).forEach((node) => {
        node.href = url.href;
      });
    } catch (_) {
      // 静态页面中的稳定下载地址仍然可用。
    }
  };

  const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  fetch("./release.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((release) => {
      setText("[data-release-version]", release.version);
      setText("[data-release-notes]", release.notes);
      setText("[data-universal-sha]", release.androidSha256);
      setText("[data-arm64-sha]", release.androidArm64Sha256);
      if (Number.isFinite(release.androidSize)) {
        setText("[data-universal-size]", formatSize(release.androidSize));
      }
      if (Number.isFinite(release.androidArm64Size)) {
        setText("[data-arm64-size]", formatSize(release.androidArm64Size));
      }
      setReleaseLink('[data-download="universal"]', release.androidDownloadUrl);
      setReleaseLink('[data-download="arm64"]', release.androidArm64DownloadUrl);
    })
    .catch(() => {
      // GitHub Pages 或清单暂时不可用时保留页面内置的已验证版本。
    });
})();
