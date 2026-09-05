// Floppy Player - integração com SugoiAPI
(() => {
  const cfg = window.FLOPPY_CONFIG || {};
  const API_URL = String(cfg.API_URL || "").replace(/\/+$/, "");

  const params = new URLSearchParams(location.search);
  const anime = params.get("id") || params.get("anime") || "";
  const season = params.get("season") || "1";
  const episode = Number(params.get("episode") || "1");

  const $ = (s) => document.querySelector(s);
  const video = $("#videoPlayer");
  const title = $("#playerTitle");
  const status = $("#playerStatus");
  const servers = $("#servers");
  const prevBtn = $("#prevEpisode");
  const nextBtn = $("#nextEpisode");

  let sources = [];
  let currentIndex = 0;

  function setStatus(text, type = "") {
    if (!status) return;
    status.textContent = text;
    status.className = `player-status ${type}`.trim();
  }

  function normalizeSources(result) {
    const list = [];
    for (const provider of (result?.data || [])) {
      for (const item of (provider?.episodes || [])) {
        if (item?.error || !item?.episode) continue;
        list.push({
          name: provider.name || "Servidor",
          slug: provider.slug || "",
          url: item.episode,
          hasAds: !!provider.has_ads,
          isEmbed: !!provider.is_embed
        });
      }
    }
    return list;
  }

  function renderServers() {
    if (!servers) return;
    servers.innerHTML = "";
    if (!sources.length) {
      servers.innerHTML = '<div class="empty-server">Nenhum servidor disponível.</div>';
      return;
    }

    sources.forEach((source, i) => {
      const button = document.createElement("button");
      button.className = `server-button ${i === currentIndex ? "active" : ""}`;
      button.type = "button";
      button.innerHTML = `<span>${source.name}</span><small>${source.isEmbed ? "Embed" : "MP4"}${source.hasAds ? " • anúncios" : ""}</small>`;
      button.addEventListener("click", () => playSource(i));
      servers.appendChild(button);
    });
  }

  async function playSource(index) {
    const source = sources[index];
    if (!source || !video) return;

    currentIndex = index;
    renderServers();

    try {
      setStatus(`Carregando ${source.name}...`);
      video.pause();

      // A SugoiAPI pode retornar MP4 direto ou um embed.
      // Para MP4, usamos o elemento <video>.
      // Para embeds, o HTML pode ter um iframe com id="embedPlayer".
      if (!source.isEmbed) {
        video.hidden = false;
        const iframe = $("#embedPlayer");
        if (iframe) iframe.hidden = true;

        video.src = source.url;
        video.load();
        await video.play().catch(() => {});
        setStatus(`Servidor: ${source.name}`, "ok");
      } else {
        video.hidden = true;
        const iframe = $("#embedPlayer");
        if (!iframe) {
          setStatus("Este servidor usa embed e o player não possui iframe.", "error");
          return;
        }
        iframe.hidden = false;
        iframe.src = source.url;
        setStatus(`Servidor: ${source.name}`, "ok");
      }
    } catch (err) {
      console.error(err);
      setStatus("Não foi possível iniciar este servidor. Tente outro.", "error");
    }
  }

  async function loadEpisode() {
    if (!API_URL) {
      setStatus("Configure a API em js/config.js.", "error");
      return;
    }
    if (!anime) {
      setStatus("Anime não informado na URL.", "error");
      return;
    }

    if (title) title.textContent = `${anime} • Episódio ${episode}`;

    const endpoint = `${API_URL}/episode/${encodeURIComponent(anime)}/${encodeURIComponent(season)}/${encodeURIComponent(episode)}`;

    setStatus("Consultando servidores...");

    try {
      const response = await fetch(endpoint, {
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      sources = normalizeSources(result);

      if (result?.error || !sources.length) {
        throw new Error(result?.message || "Nenhum vídeo disponível.");
      }

      renderServers();
      await playSource(0);
    } catch (err) {
      console.error("Floppy/SugoiAPI:", err);
      setStatus(`Não foi possível carregar o episódio. ${err.message}`, "error");
      if (servers) {
        servers.innerHTML = `
          <div class="empty-server">
            Verifique se a SugoiAPI está ligada e se o endereço em
            <strong>js/config.js</strong> está correto.
          </div>`;
      }
    }
  }

  function goToEpisode(n) {
    const url = new URL(location.href);
    url.searchParams.set("id", anime);
    url.searchParams.set("season", season);
    url.searchParams.set("episode", String(Math.max(1, n)));
    location.href = url.toString();
  }

  prevBtn?.addEventListener("click", () => goToEpisode(episode - 1));
  nextBtn?.addEventListener("click", () => goToEpisode(episode + 1));

  // Se o vídeo acabar, tenta avançar.
  video?.addEventListener("ended", () => {
    if (episode > 0) goToEpisode(episode + 1);
  });

  loadEpisode();
})();
