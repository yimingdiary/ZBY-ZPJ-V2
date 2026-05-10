(function () {
  const DETAIL_VERSION = "1.0.2";
  const STAGE = { width: 1290, height: 2791 };
  const TOP_TEXT_FALLBACK_OFFSET = 140;
  const SELECTION_PADDING = 24;
  const ALPHA_THRESHOLD = 8;
  const TOUCH_SCROLL_RATIO = 1.15;
  const TOUCH_SMOOTHING = 0.55;
  const DESKTOP_SMOOTHING = 0.18;
  const IS_TOUCH_PREVIEW =
    window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches ||
    Math.min(window.innerWidth, window.innerHeight) <= 820;
  const SELECTION_ACCENTS = {
    topText: "#7cead9",
    topBack: "#ff9278",
    bottomText: "#78bfff",
    bottomBack: "#f0cf6c",
    extra: "#8ae7ff",
    background: "#61c7ff",
    backplate: "#c693ff",
    host: "#ffd36a",
    ui: "#9ff8f2",
  };
  const ZIP_ROLES = {
    "顶部挂件-文": { role: "topText", layer: "front", anchor: "top", order: 420, accent: SELECTION_ACCENTS.topText },
    "顶部挂件-背": { role: "topBack", layer: "back", anchor: "top", order: 320, accent: SELECTION_ACCENTS.topBack },
    "底部挂件-文": { role: "bottomText", layer: "front", anchor: "bottom", order: 410, accent: SELECTION_ACCENTS.bottomText },
    "底部挂件-背": { role: "bottomBack", layer: "back", anchor: "bottom", order: 310, accent: SELECTION_ACCENTS.bottomBack },
  };

  const state = {
    targetProgress: 0,
    smoothProgress: 0,
    bgPanCurrent: 50,
    bgPanTarget: 50,
    isPanningBackground: false,
    lastPanClientX: 0,
    backgroundSize: null,
    layerItems: [],
    stickerItems: [],
    optimizedAssets: new Map(),
    pointerCurrent: { shiftX: 0, shiftY: 0, tiltX: 0, tiltY: 0, depthX: 0, depthY: 0, press: 0, stageX: 50, stageY: 50 },
    pointerTarget: { shiftX: 0, shiftY: 0, tiltX: 0, tiltY: 0, depthX: 0, depthY: 0, press: 0, stageX: 50, stageY: 50 },
    cssVars: new Map(),
    layerExpanded: false,
    animationFrame: 0,
    touchStartY: 0,
    touchStartScrollTop: 0,
    mobileScrollbarDragging: false,
    mobileScrollbarStartY: 0,
    mobileScrollbarStartScrollTop: 0,
    mobileScrollbarPointerId: null,
    userActivatedPlayback: false,
    activationTasks: [],
  };

  const dom = {
    root: document.documentElement,
    previewScroll: document.getElementById("previewScroll"),
    deviceStage: document.getElementById("deviceStage"),
    backplateLayer: document.getElementById("backplateLayer"),
    backgroundLayer: document.getElementById("backgroundLayer"),
    backgroundImage: document.getElementById("backgroundImage"),
    hostLayer: document.getElementById("hostLayer"),
    hostImage: document.getElementById("hostImage"),
    stickerBackLayer: document.getElementById("stickerBackLayer"),
    stickerFrontLayer: document.getElementById("stickerFrontLayer"),
    uiLayer: document.getElementById("uiLayer"),
    douyinUiImage: document.getElementById("douyinUiImage"),
    emptyState: document.getElementById("emptyState"),
    mobileScrollbar: document.getElementById("mobileScrollBar"),
    mobileScrollbarTrack: document.getElementById("mobileScrollTrack"),
    mobileScrollbarThumb: document.getElementById("mobileScrollThumb"),
  };

  document.title = `朱宝玉.psd-${DETAIL_VERSION}`;
  dom.root.classList.toggle("is-touch-preview", IS_TOUCH_PREVIEW);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizePreviewDirectory(directory) {
    const value = String(directory || "").trim().replace(/\/$/, "");
    if (!value) return "";
    return value.startsWith("/") ? value : `/${value}`;
  }

  function assetURL(directory, fileName) {
    return encodeURI(`${normalizePreviewDirectory(directory)}/${fileName}`);
  }

  function mediaURL(directory, fileName, asset) {
    return encodeURI(asset?.optimized || `${normalizePreviewDirectory(directory)}/${fileName}`);
  }

  function shouldUseOptimizedAsset(fileName, asset) {
    if (!asset?.optimized) return false;
    const sourceExt = fileExtension(fileName);
    const optimizedExt = fileExtension(asset.optimized);
    const isAlphaCapableBackground = isBackgroundFile(fileName) && ["png", "webp", "gif"].includes(sourceExt);
    if (isAlphaCapableBackground && ["jpg", "jpeg"].includes(optimizedExt)) return false;
    return true;
  }

  function resolvedAsset(fileName) {
    const asset = optimizedAsset(fileName);
    return shouldUseOptimizedAsset(fileName, asset) ? asset : null;
  }

  async function fetchJson(url, fallback) {
    try {
      const response = await fetch(url);
      if (!response.ok) return fallback;
      return await response.json();
    } catch {
      return fallback;
    }
  }

  function previewDirectoryForItem(item) {
    return normalizePreviewDirectory(item?.preview || item?.zip || item?.directory || "");
  }

  function canonicalHotspotId(config, id, image, directory) {
    const cleanDirectory = normalizePreviewDirectory(directory);
    if (!cleanDirectory) return id;

    const hotspots = flattenHotspots(config);
    const directoryMatches = hotspots.filter((item) => previewDirectoryForItem(item) === cleanDirectory);
    if (!directoryMatches.length) return id;

    const imageMatch = directoryMatches.find((item) => image && item.image === image);
    return (imageMatch || directoryMatches[0]).id || id;
  }

  function replaceUrlWithIdOnly(id) {
    if (!id || !window.history?.replaceState) return;
    const params = new URLSearchParams(window.location.search);
    const keys = [...params.keys()];
    if (keys.length <= 1 && params.get("id") === id && !window.location.hash) return;
    const nextUrl = `${window.location.pathname}?${new URLSearchParams({ id }).toString()}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function flattenHotspots(config = {}) {
    const items = [];
    const imageEntries = Array.isArray(config.images) ? config.images : [];
    imageEntries.forEach((entry) => {
      const areas = Array.isArray(entry.areas) ? entry.areas : [entry];
      areas.forEach((area, index) => {
        if (!area) return;
        items.push({
          ...area,
          image: area.image || entry.image || "",
          index,
        });
      });
    });

    const flatEntries = Array.isArray(config.hotspots) ? config.hotspots : [];
    flatEntries.forEach((area, index) => {
      if (!area) return;
      items.push({ ...area, index });
    });
    return items;
  }

  function resolvePreviewTarget(config) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "";
    const image = params.get("image") || "";
    const hotspots = flattenHotspots(config);
    const directDirectory = normalizePreviewDirectory(
      params.get("preview") || params.get("directory") || params.get("path"),
    );
    if (directDirectory) {
      const canonicalId = canonicalHotspotId(config, id, image, directDirectory);
      replaceUrlWithIdOnly(canonicalId);
      const directMatch =
        hotspots.find((item) => item.id === canonicalId && previewDirectoryForItem(item) === directDirectory) ||
        hotspots.find((item) => previewDirectoryForItem(item) === directDirectory);
      return { directory: directDirectory, hotspot: directMatch || null };
    }

    const match =
      hotspots.find((item) => item.id === id && (!image || item.image === image)) ||
      hotspots.find((item) => item.id === id);

    return { directory: previewDirectoryForItem(match), hotspot: match || null };
  }

  function fileBaseName(path) {
    return path.split("/").pop();
  }

  function fileStem(name) {
    return fileBaseName(name).replace(/\.[^.]+$/, "");
  }

  function fileExtension(name) {
    const match = fileBaseName(name).toLowerCase().match(/\.([^.]+)$/);
    return match ? match[1] : "";
  }

  function normalizeAssetEntry(name) {
    const fileName = fileBaseName(name);
    const ext = fileExtension(fileName);
    let stem = fileStem(fileName);
    let isDynamic = ext === "gif";

    ["-动-loop", "-动"].forEach((suffix) => {
      if (stem.endsWith(suffix)) {
        stem = stem.slice(0, -suffix.length);
        isDynamic = true;
      }
    });

    return {
      fileName,
      ext,
      base: stem,
      isDynamic,
      isLoop: fileStem(fileName).endsWith("-动-loop"),
    };
  }

  function isBackgroundFile(fileName) {
    return /^背景\.(png|jpe?g|webp|gif)$/i.test(fileName);
  }

  function isBackplateFile(fileName) {
    return /^背景视频\.(mp4|webm|mov)$/i.test(fileName) || /\.(mp4|webm|mov)$/i.test(fileName);
  }

  function selectBackplateFile(files) {
    const backplates = files.filter(isBackplateFile);
    return backplates.find((fileName) => /-h264\.mp4$/i.test(fileName)) || backplates[0] || "";
  }

  function filteredPreviewFiles(files) {
    const fileSet = new Set(files);
    return files.filter((fileName) => {
      if (/-mobile-still\.png$/i.test(fileName)) return false;
      if (/^顶部挂件-文-动\.(gif|webp)$/i.test(fileName)) {
        const loopFile = fileName.replace(/-动\.(gif|webp)$/i, "-动-loop.$1");
        if (fileSet.has(loopFile)) return false;
      }
      return true;
    });
  }

  function isAnimatedPreviewFile(fileName) {
    return /-动(?:-loop)?\.(gif|webp)$/i.test(fileName);
  }

  function mobileSafePreviewFiles(files) {
    return files;
  }

  function optimizedAsset(fileName) {
    return state.optimizedAssets.get(fileName) || null;
  }

  function assetStageBox(asset) {
    if (!asset || asset.kind !== "positioned") return null;
    const scaleX = STAGE.width / (asset.sourceWidth || STAGE.width);
    const scaleY = STAGE.height / (asset.sourceHeight || STAGE.height);
    return {
      left: asset.left * scaleX,
      top: asset.top * scaleY,
      width: asset.width * scaleX,
      height: asset.height * scaleY,
    };
  }

  function createSelectionFrame(layerElement, accent) {
    const frame = document.createElement("div");
    frame.className = "selection-frame";
    frame.style.setProperty("--selection-accent", accent);
    ["nw", "ne", "sw", "se"].forEach((corner) => {
      const handle = document.createElement("span");
      handle.className = `selection-handle ${corner}`;
      frame.appendChild(handle);
    });
    layerElement.appendChild(frame);
    return frame;
  }

  function naturalSize(element) {
    if (element.tagName === "VIDEO") {
      return { width: element.videoWidth || STAGE.width, height: element.videoHeight || STAGE.height };
    }
    return { width: element.naturalWidth || STAGE.width, height: element.naturalHeight || STAGE.height };
  }

  function displayHeightOnStage(item) {
    if (!item || !item.element) return 0;
    const size = naturalSize(item.element);
    const width = Math.min(STAGE.width, size.width);
    return size.height * (width / size.width);
  }

  function paddedBox(box, padding = SELECTION_PADDING) {
    const left = clamp(box.left - padding, 0, STAGE.width);
    const top = clamp(box.top - padding, 0, STAGE.height);
    const right = clamp(box.left + box.width + padding, 0, STAGE.width);
    const bottom = clamp(box.top + box.height + padding, 0, STAGE.height);

    return {
      left,
      top,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }

  function elementStageBox(item) {
    const element = item.element;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    if (!width || !height) return null;

    let left = 0;
    let top = 0;
    if (item.box === "centered") {
      left = (STAGE.width - width) / 2;
      top = item.anchor === "bottom"
        ? STAGE.height - (parseFloat(element.style.bottom) || 0) - height
        : parseFloat(element.style.top) || 0;
    }

    if (item.box === "absolute") {
      const style = getComputedStyle(element);
      left = parseFloat(element.style.left || style.left) || 0;
      top = parseFloat(element.style.top || style.top) || 0;
    }

    if (item.box === "positioned") {
      const box = assetStageBox(item.asset);
      if (box) return box;
    }

    return { left, top, width, height };
  }

  function renderedImageRect(item, size) {
    const element = item.element;
    const elementBox = elementStageBox(item);
    if (!elementBox) return null;

    if (item.box === "centered") {
      const scale = elementBox.width / size.width || 1;
      return {
        left: elementBox.left,
        top: elementBox.top,
        width: size.width * scale,
        height: size.height * scale,
        scaleX: scale,
        scaleY: scale,
      };
    }

    const fit = item.fit || getComputedStyle(element).objectFit || "fill";
    const scaleX = elementBox.width / size.width;
    const scaleY = elementBox.height / size.height;

    if (fit === "contain" || fit === "cover") {
      const scale = fit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);
      const width = size.width * scale;
      const height = size.height * scale;
      return {
        left: elementBox.left + (elementBox.width - width) / 2,
        top: elementBox.top + (elementBox.height - height) / 2,
        width,
        height,
        scaleX: scale,
        scaleY: scale,
      };
    }

    return {
      ...elementBox,
      scaleX,
      scaleY,
    };
  }

  function alphaContentBounds(image) {
    if (IS_TOUCH_PREVIEW) return null;

    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height) return null;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, width, height);

    let pixels;
    try {
      pixels = context.getImageData(0, 0, width, height).data;
    } catch {
      return null;
    }

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y += 1) {
      let offset = y * width * 4 + 3;
      for (let x = 0; x < width; x += 1, offset += 4) {
        if (pixels[offset] <= ALPHA_THRESHOLD) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    if (maxX < minX || maxY < minY) return null;
    return {
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    };
  }

  function contentBoxForImage(item) {
    if (item.selectionMode !== "content" || item.element.tagName !== "IMG") return null;

    const element = item.element;
    const size = naturalSize(element);
    const alphaBox = alphaContentBounds(element);
    const renderBox = renderedImageRect(item, size);
    if (!alphaBox || !renderBox) return null;

    return paddedBox({
      left: renderBox.left + alphaBox.left * renderBox.scaleX,
      top: renderBox.top + alphaBox.top * renderBox.scaleY,
      width: alphaBox.width * renderBox.scaleX,
      height: alphaBox.height * renderBox.scaleY,
    });
  }

  function prepareSelectionBox(item) {
    item.contentBox = contentBoxForImage(item);
    updateSelectionFrame(item);
  }

  function updateSelectionFrame(item) {
    if (!item || !item.frame || !item.element) return;
    const box = item.contentBox || elementStageBox(item);
    if (!box?.width || !box?.height) return;

    item.frame.style.left = `${box.left}px`;
    item.frame.style.top = `${box.top}px`;
    item.frame.style.width = `${box.width}px`;
    item.frame.style.height = `${box.height}px`;
    item.frame.style.setProperty("--selection-accent", item.accent);
  }

  function updateAllSelectionFrames() {
    state.layerItems.forEach(updateSelectionFrame);
  }

  function setStyleVar(name, value) {
    if (state.cssVars.get(name) === value) return;
    state.cssVars.set(name, value);
    dom.root.style.setProperty(name, value);
  }

  function setLayerExpanded(expanded) {
    if (state.layerExpanded === expanded) return;
    state.layerExpanded = expanded;
    dom.root.classList.toggle("is-layer-expanded", expanded);
  }

  function waitForMediaElement(element) {
    if (element.tagName === "IMG" && element.complete && element.naturalWidth) return Promise.resolve();
    if (element.tagName === "VIDEO" && element.readyState >= 1) return Promise.resolve();
    return new Promise((resolve) => {
      element.addEventListener("load", resolve, { once: true });
      element.addEventListener("loadedmetadata", resolve, { once: true });
      element.addEventListener("error", resolve, { once: true });
    });
  }

  function markVideoReady(video) {
    video.classList.add("is-video-ready");
  }

  function primeVideoFrame(video) {
    if (video.dataset.framePrimed === "true") return;
    video.dataset.framePrimed = "true";

    const loadFrame = () => {
      if (video.readyState >= 2) {
        markVideoReady(video);
        return;
      }
      try {
        const targetTime = Number.isFinite(video.duration) && video.duration > 0
          ? Math.min(0.05, video.duration)
          : 0.05;
        video.currentTime = targetTime;
      } catch {
        video.dataset.framePrimed = "false";
      }
    };

    if (video.readyState >= 1) loadFrame();
    else video.addEventListener("loadedmetadata", loadFrame, { once: true });
  }

  function prepareVideoElement(video) {
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("muted", "");
    video.disablePictureInPicture = true;
    video.addEventListener("loadeddata", () => markVideoReady(video), { once: true });
    video.addEventListener("loadedmetadata", () => primeVideoFrame(video), { once: true });
    video.addEventListener("seeked", () => markVideoReady(video), { once: true });
    video.addEventListener("canplay", () => markVideoReady(video), { once: true });
    video.addEventListener("playing", () => markVideoReady(video), { once: true });
  }

  function playVideos() {
    dom.deviceStage.querySelectorAll("video").forEach((video) => {
      video.play().then(() => markVideoReady(video)).catch(() => primeVideoFrame(video));
    });
  }

  function createMediaElement(directory, fileName, className, asset = null) {
    const ext = fileExtension(fileName);
    const isVideo = ["mp4", "webm", "mov"].includes(ext);
    const element = document.createElement(isVideo ? "video" : "img");
    element.className = className;
    element.dataset.layerMedia = "true";
    if (isVideo) {
      element.classList.add("video-media");
      element.autoplay = true;
      element.loop = true;
      element.muted = true;
      element.defaultMuted = true;
      element.playsInline = true;
      element.setAttribute("muted", "");
      element.setAttribute("playsinline", "");
      element.setAttribute("webkit-playsinline", "");
      element.preload = "auto";
      prepareVideoElement(element);
    } else {
      element.decoding = "async";
      element.loading = "eager";
      element.alt = "";
    }
    if (ext === "gif" || isAnimatedPreviewFile(fileName)) element.classList.add("animated-media");
    element.src = mediaURL(directory, fileName, asset);
    return element;
  }

  function applyPositionedAsset(element, asset) {
    const box = assetStageBox(asset);
    if (!box) return;
    element.classList.add("positioned-media");
    element.style.left = `${box.left}px`;
    element.style.top = `${box.top}px`;
    element.style.width = `${box.width}px`;
    element.style.height = `${box.height}px`;
    element.style.maxWidth = "none";
    element.style.transform = "translate3d(0, 0, 0)";
    element.style.objectFit = "fill";
  }

  function addLayerItem(item) {
    state.layerItems.push(item);
    requestAnimationFrame(() => {
      updateSelectionFrame(item);
      requestMotionFrame();
    });
  }

  function addFillLayer(layerElement, directory, fileName, options) {
    const asset = options.asset || resolvedAsset(fileName);
    const element = createMediaElement(directory, fileName, options.className, asset);
    if (asset?.kind === "positioned") applyPositionedAsset(element, asset);
    layerElement.appendChild(element);
    const item = {
      element,
      layerElement,
      frame: createSelectionFrame(layerElement, options.accent),
      box: asset?.kind === "positioned" ? "positioned" : "fill",
      asset,
      accent: options.accent,
      fit: options.fit,
      selectionMode: asset?.kind === "positioned" ? "box" : options.selectionMode || "box",
    };
    addLayerItem(item);
    return { element, item };
  }

  function createStickerElement(directory, fileName, anchor, asset = null) {
    const element = createMediaElement(directory, fileName, `stage-media sticker-media sticker-piece ${anchor}-piece`, asset);
    if (asset?.kind === "positioned") {
      applyPositionedAsset(element, asset);
      element.style.opacity = "1";
      return element;
    }
    element.style.left = "50%";
    element.style.maxWidth = "100%";
    element.style.transform = "translate3d(-50%, 0, 0)";
    element.style.objectFit = "contain";
    if (anchor === "bottom") element.style.bottom = "0px";
    else element.style.top = "0px";
    return element;
  }

  function addStickerItem(layerElement, directory, entry, roleConfig) {
    const asset = entry.asset || resolvedAsset(entry.fileName);
    const element = createStickerElement(directory, entry.fileName, roleConfig.anchor, asset);
    layerElement.appendChild(element);
    const item = {
      role: roleConfig.role,
      isDynamic: entry.isDynamic,
      element,
      layerElement,
      frame: createSelectionFrame(layerElement, roleConfig.accent),
      box: asset?.kind === "positioned" ? "positioned" : "centered",
      asset,
      anchor: roleConfig.anchor,
      accent: roleConfig.accent,
      selectionMode: asset?.kind === "positioned" ? "box" : "content",
    };
    state.stickerItems.push(item);
    addLayerItem(item);
    return item;
  }

  function primaryRoleItem(role) {
    return state.stickerItems.find((item) => item.role === role);
  }

  function alignStickerTextItems() {
    const topBack = primaryRoleItem("topBack");
    const bottomBack = primaryRoleItem("bottomBack");
    const topBackHeight = displayHeightOnStage(topBack);
    const bottomBackHeight = displayHeightOnStage(bottomBack);

    state.stickerItems.forEach((item) => {
      if (item.box === "positioned") {
        updateSelectionFrame(item);
        return;
      }
      if (item.role === "topText") {
        item.element.style.top = topBack
          ? `${Math.max(0, (topBackHeight - displayHeightOnStage(item)) / 2)}px`
          : `${TOP_TEXT_FALLBACK_OFFSET}px`;
      }
      if (item.role === "bottomText") {
        item.element.style.bottom = `${Math.max(0, (bottomBackHeight - displayHeightOnStage(item)) / 2)}px`;
      }
      updateSelectionFrame(item);
    });
  }

  function selectRoleEntries(files) {
    const grouped = new Map();
    files.forEach((fileName) => {
      const entry = normalizeAssetEntry(fileName);
      if (!ZIP_ROLES[entry.base]) return;
      if (!grouped.has(entry.base)) grouped.set(entry.base, []);
      grouped.get(entry.base).push(entry);
    });

    return [...grouped.entries()].map(([base, entries]) => {
      const sorted = entries.sort((a, b) => Number(b.isLoop) - Number(a.isLoop) || Number(b.isDynamic) - Number(a.isDynamic));
      return {
        entry: sorted[0],
        config: ZIP_ROLES[base],
      };
    });
  }

  function scheduleDeferredPreviewTasks(tasks) {
    if (!tasks.length) return;
    let index = 0;
    const runNext = () => {
      const task = tasks[index];
      index += 1;
      Promise.resolve(task())
        .then(() => {
          alignStickerTextItems();
          updateAllSelectionFrames();
          playVideos();
        })
        .finally(() => {
          if (index < tasks.length) window.setTimeout(runNext, IS_TOUCH_PREVIEW ? 180 : 0);
        });
    };
    const start = () => window.setTimeout(runNext, IS_TOUCH_PREVIEW ? 420 : 0);
    if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 900 });
    else start();
  }

  function enqueueActivationTask(task) {
    if (!IS_TOUCH_PREVIEW || state.userActivatedPlayback) {
      scheduleDeferredPreviewTasks([task]);
      return;
    }
    state.activationTasks.push(task);
  }

  function flushActivationTasks() {
    if (!state.activationTasks.length) return;
    const tasks = state.activationTasks.splice(0);
    scheduleDeferredPreviewTasks(tasks);
  }

  function renderStructuredPreview(directory, files, options = {}) {
    const cleanFiles = mobileSafePreviewFiles(filteredPreviewFiles(files));
    const roleFileNames = new Set();
    cleanFiles.forEach((fileName) => {
      const entry = normalizeAssetEntry(fileName);
      if (ZIP_ROLES[entry.base]) roleFileNames.add(fileName);
    });
    const mediaPromises = [];
    const deferredTasks = [];

    const backplate = selectBackplateFile(cleanFiles);
    if (backplate) {
      const addBackplate = () => {
        const { element } = addFillLayer(dom.backplateLayer, directory, backplate, {
          className: "stage-media media-stage-fill backplate-media",
          accent: SELECTION_ACCENTS.backplate,
          fit: "contain",
        });
        return waitForMediaElement(element);
      };
      mediaPromises.push(addBackplate());
      roleFileNames.add(backplate);
    }

    const background = cleanFiles.find(isBackgroundFile);
    if (background) {
      const backgroundAsset = resolvedAsset(background);
      const backgroundURL = mediaURL(directory, background, backgroundAsset);
      dom.deviceStage.classList.add("has-background");
      dom.backgroundImage.src = backgroundURL;
      dom.backplateLayer.querySelectorAll("video").forEach((video) => {
        video.poster = backgroundURL;
      });
      const backgroundItem = {
        element: dom.backgroundImage,
        layerElement: dom.backgroundLayer,
        frame: createSelectionFrame(dom.backgroundLayer, SELECTION_ACCENTS.background),
        box: "fill",
        accent: SELECTION_ACCENTS.background,
        fit: "cover",
        selectionMode: "box",
      };
      addLayerItem(backgroundItem);
      mediaPromises.push(waitForMediaElement(dom.backgroundImage).then(() => {
        state.backgroundSize = naturalSize(dom.backgroundImage);
      }));
      roleFileNames.add(background);
    }

    selectRoleEntries(cleanFiles).forEach(({ entry, config }) => {
      const layerElement = config.layer === "front" ? dom.stickerFrontLayer : dom.stickerBackLayer;
      const addRoleItem = () => {
        const item = addStickerItem(layerElement, directory, entry, config);
        return waitForMediaElement(item.element).then(() => prepareSelectionBox(item));
      };
      if (IS_TOUCH_PREVIEW && isAnimatedPreviewFile(entry.fileName)) deferredTasks.push(addRoleItem);
      else mediaPromises.push(addRoleItem());
    });

    cleanFiles
      .filter((fileName) => !roleFileNames.has(fileName))
      .filter((fileName) => !isBackgroundFile(fileName) && !isBackplateFile(fileName))
      .forEach((fileName) => {
        const addExtraItem = () => {
          const { element, item } = addFillLayer(dom.stickerFrontLayer, directory, fileName, {
            className: "stage-media media-stage-fill extra-media",
            accent: SELECTION_ACCENTS.extra,
            fit: "contain",
            selectionMode: "content",
          });
          return waitForMediaElement(element).then(() => prepareSelectionBox(item));
        };
        if (IS_TOUCH_PREVIEW) deferredTasks.push(addExtraItem);
        else mediaPromises.push(addExtraItem());
      });

    addHostLayer(options.showHost === true);
    addUiLayer();

    return Promise.all(mediaPromises).then(() => {
      alignStickerTextItems();
      updateAllSelectionFrames();
      playVideos();
      scheduleDeferredPreviewTasks(deferredTasks);
    });
  }

  function addUiLayer() {
    if (!dom.douyinUiImage) return;
    const markLoaded = () => {
      dom.uiLayer.classList.add("has-ui");
      addLayerItem({
        element: dom.douyinUiImage,
        layerElement: dom.uiLayer,
        frame: createSelectionFrame(dom.uiLayer, SELECTION_ACCENTS.ui),
        box: "fill",
        accent: SELECTION_ACCENTS.ui,
      });
    };
    const markMissing = () => {
      dom.uiLayer.classList.remove("has-ui");
      dom.douyinUiImage.removeAttribute("src");
    };
    dom.douyinUiImage.addEventListener("load", markLoaded, { once: true });
    dom.douyinUiImage.addEventListener("error", markMissing, { once: true });
    if (dom.douyinUiImage.complete) {
      if (dom.douyinUiImage.naturalWidth) markLoaded();
      else markMissing();
    }
  }

  function addHostLayer(shouldShow) {
    if (!dom.hostImage || !dom.hostLayer) return;
    dom.hostLayer.hidden = !shouldShow;
    if (!shouldShow) {
      dom.hostLayer.classList.remove("has-host");
      return;
    }

    const markLoaded = () => {
      dom.hostLayer.classList.add("has-host");
      addLayerItem({
        element: dom.hostImage,
        layerElement: dom.hostLayer,
        frame: createSelectionFrame(dom.hostLayer, SELECTION_ACCENTS.host),
        box: "absolute",
        accent: SELECTION_ACCENTS.host,
        selectionMode: "content",
      });
    };
    const markMissing = () => {
      dom.hostLayer.classList.remove("has-host");
      dom.hostImage.removeAttribute("src");
    };
    dom.hostImage.addEventListener("load", markLoaded, { once: true });
    dom.hostImage.addEventListener("error", markMissing, { once: true });
    if (dom.hostImage.complete) {
      if (dom.hostImage.naturalWidth) markLoaded();
      else markMissing();
    }
  }

  function showEmptyState(message) {
    dom.deviceStage.hidden = true;
    dom.emptyState.hidden = false;
    dom.emptyState.textContent = message;
  }

  function updateScale() {
    const rect = dom.previewScroll.getBoundingClientRect();
    const availableWidth = Math.max(260, rect.width * 0.72);
    const availableHeight = Math.max(320, rect.height * 0.86);
    const scale = Math.min(availableWidth / STAGE.width, availableHeight / STAGE.height);
    dom.root.style.setProperty("--stage-scale", scale.toFixed(4));
    updateAllSelectionFrames();
    updateMobileScrollbar();
    requestMotionFrame();
  }

  function scrollMax() {
    return Math.max(0, dom.previewScroll.scrollHeight - dom.previewScroll.clientHeight);
  }

  function setPreviewScrollTop(value) {
    const max = scrollMax();
    if (max <= 0) return;
    dom.previewScroll.scrollTop = clamp(value, 1, Math.max(1, max - 1));
    updateScrollTarget();
  }

  function updateMobileScrollbar() {
    if (!dom.mobileScrollbar || !dom.mobileScrollbarTrack || !dom.mobileScrollbarThumb) return;
    const max = scrollMax();
    dom.mobileScrollbar.hidden = !IS_TOUCH_PREVIEW || max <= 0;
    if (dom.mobileScrollbar.hidden) return;

    const trackHeight = dom.mobileScrollbarTrack.getBoundingClientRect().height;
    if (trackHeight <= 0) return;

    const ratio = dom.previewScroll.clientHeight / Math.max(dom.previewScroll.scrollHeight, 1);
    const thumbHeight = clamp(trackHeight * ratio, 48, trackHeight);
    const travel = Math.max(0, trackHeight - thumbHeight);
    const progress = max > 0 ? dom.previewScroll.scrollTop / max : 0;
    dom.mobileScrollbarThumb.style.height = `${thumbHeight.toFixed(2)}px`;
    dom.mobileScrollbarThumb.style.top = `${(travel * clamp(progress, 0, 1)).toFixed(2)}px`;
  }

  function activatePreviewPlayback() {
    if (state.userActivatedPlayback) return;
    state.userActivatedPlayback = true;
    flushActivationTasks();
    playVideos();
  }

  function updateScrollTarget() {
    const max = scrollMax();
    state.targetProgress = max > 0 ? dom.previewScroll.scrollTop / max : 0;
    updateMobileScrollbar();
    requestMotionFrame();
  }

  function handlePreviewWheel(event) {
    const max = scrollMax();
    if (max <= 0) return;

    const next = dom.previewScroll.scrollTop + event.deltaY;
    if ((event.deltaY < 0 && next < 0) || (event.deltaY > 0 && next > max)) {
      event.preventDefault();
      dom.previewScroll.scrollTop = clamp(next, 0, max);
      updateScrollTarget();
    }
  }

  function handlePreviewTouchStart(event) {
    if (!IS_TOUCH_PREVIEW || event.touches.length !== 1) return;
    nudgeScrollBoundary();
    state.touchStartY = event.touches[0].clientY;
    state.touchStartScrollTop = dom.previewScroll.scrollTop;
    activatePreviewPlayback();
  }

  function handlePreviewTouchMove(event) {
    if (!IS_TOUCH_PREVIEW || event.touches.length !== 1) return;

    const touchY = event.touches[0].clientY;
    const max = scrollMax();
    if (max <= 0) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const dragDelta = state.touchStartY - touchY;
    setPreviewScrollTop(state.touchStartScrollTop + dragDelta * TOUCH_SCROLL_RATIO);
  }

  function nudgeScrollBoundary() {
    const max = scrollMax();
    if (max <= 1) return;
    if (dom.previewScroll.scrollTop <= 0) dom.previewScroll.scrollTop = 1;
    if (dom.previewScroll.scrollTop >= max) dom.previewScroll.scrollTop = max - 1;
  }

  function beginMobileScrollbarDrag(event) {
    if (!IS_TOUCH_PREVIEW || !dom.mobileScrollbarTrack || event.button > 0) return;
    const max = scrollMax();
    if (max <= 0) return;

    event.preventDefault();
    activatePreviewPlayback();
    nudgeScrollBoundary();

    const trackRect = dom.mobileScrollbarTrack.getBoundingClientRect();
    const thumbHeight = dom.mobileScrollbarThumb?.getBoundingClientRect().height || 0;
    if (event.target !== dom.mobileScrollbarThumb && trackRect.height > 0) {
      const progress = clamp((event.clientY - trackRect.top) / trackRect.height, 0, 1);
      setPreviewScrollTop(progress * max);
    }

    state.mobileScrollbarDragging = true;
    state.mobileScrollbarStartY = event.clientY;
    state.mobileScrollbarStartScrollTop = dom.previewScroll.scrollTop;
    state.mobileScrollbarPointerId = event.pointerId;
    dom.mobileScrollbar.classList.add("is-dragging");
    dom.mobileScrollbar.setPointerCapture?.(event.pointerId);
    if (thumbHeight > 0) updateMobileScrollbar();
  }

  function moveMobileScrollbarDrag(event) {
    if (!state.mobileScrollbarDragging || state.mobileScrollbarPointerId !== event.pointerId) return;
    const max = scrollMax();
    const trackHeight = dom.mobileScrollbarTrack?.getBoundingClientRect().height || 0;
    const thumbHeight = dom.mobileScrollbarThumb?.getBoundingClientRect().height || 0;
    const travel = Math.max(1, trackHeight - thumbHeight);

    event.preventDefault();
    const dragProgress = (event.clientY - state.mobileScrollbarStartY) / travel;
    setPreviewScrollTop(state.mobileScrollbarStartScrollTop + dragProgress * max);
  }

  function endMobileScrollbarDrag(event) {
    if (!state.mobileScrollbarDragging || state.mobileScrollbarPointerId !== event.pointerId) return;
    state.mobileScrollbarDragging = false;
    state.mobileScrollbarPointerId = null;
    dom.mobileScrollbar?.classList.remove("is-dragging");
    dom.mobileScrollbar?.releasePointerCapture?.(event.pointerId);
  }

  function setPointerTarget(values = {}) {
    Object.assign(state.pointerTarget, values);
    requestMotionFrame();
  }

  function resetPointerTarget() {
    setPointerTarget({
      shiftX: 0,
      shiftY: 0,
      tiltX: 0,
      tiltY: 0,
      depthX: 0,
      depthY: 0,
      press: 0,
    });
  }

  function updatePointerMotion(event) {
    if (IS_TOUCH_PREVIEW) return;
    if (state.isPanningBackground) return;
    const rect = dom.previewScroll.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    const stageRect = dom.deviceStage.getBoundingClientRect();
    const stageX = clamp(((event.clientX - stageRect.left) / stageRect.width) * 100, 0, 100);
    const stageY = clamp(((event.clientY - stageRect.top) / stageRect.height) * 100, 0, 100);
    const isOverStage =
      event.clientX >= stageRect.left &&
      event.clientX <= stageRect.right &&
      event.clientY >= stageRect.top &&
      event.clientY <= stageRect.bottom;

    if (!isOverStage) {
      resetPointerTarget();
      return;
    }

    setPointerTarget({
      shiftX: x * 2.2,
      shiftY: y * 1.6,
      tiltX: x * 1.25,
      tiltY: -y * 0.8,
      depthX: x * -2.2,
      depthY: y * -2.2,
      stageX,
      stageY,
      press: 0,
    });
  }

  function updateCurrentBackgroundPan(deltaX) {
    if (!state.backgroundSize) return;
    const rect = dom.deviceStage.getBoundingClientRect();
    const displayScale = rect.width / STAGE.width;
    const naturalScale = Math.max(STAGE.width / state.backgroundSize.width, STAGE.height / state.backgroundSize.height);
    const renderedWidth = state.backgroundSize.width * naturalScale;
    const overflowWidth = Math.max(0, renderedWidth - STAGE.width) * displayScale;
    const deltaPercent = overflowWidth > 0.5 ? (-deltaX * 92) / overflowWidth : 0;
    state.bgPanTarget = clamp(state.bgPanTarget + deltaPercent, 0, 100);
    requestMotionFrame();
  }

  function beginBackgroundPan(event) {
    if (IS_TOUCH_PREVIEW || event.pointerType === "touch") return;
    if (event.button !== 0 || !state.backgroundSize) return;
    state.isPanningBackground = true;
    state.lastPanClientX = event.clientX;
    resetPointerTarget();
    dom.backgroundLayer.classList.add("is-panning");
    dom.deviceStage.classList.add("is-panning");
    dom.backgroundLayer.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function moveBackgroundPan(event) {
    if (!state.isPanningBackground) return;
    updateCurrentBackgroundPan(event.clientX - state.lastPanClientX);
    state.lastPanClientX = event.clientX;
    event.preventDefault();
  }

  function endBackgroundPan(event) {
    if (!state.isPanningBackground) return;
    state.isPanningBackground = false;
    dom.backgroundLayer.classList.remove("is-panning");
    dom.deviceStage.classList.remove("is-panning");
    if (dom.backgroundLayer.hasPointerCapture(event.pointerId)) dom.backgroundLayer.releasePointerCapture(event.pointerId);
    requestMotionFrame();
  }

  function valuesSettled(current, target, threshold = 0.01) {
    return Math.abs(current - target) <= threshold;
  }

  function motionSettled() {
    return (
      valuesSettled(state.smoothProgress, state.targetProgress, 0.0005) &&
      valuesSettled(state.bgPanCurrent, state.bgPanTarget, 0.01) &&
      Object.keys(state.pointerCurrent).every((key) =>
        valuesSettled(state.pointerCurrent[key], state.pointerTarget[key], 0.01),
      )
    );
  }

  function requestMotionFrame() {
    if (state.animationFrame) return;
    state.animationFrame = requestAnimationFrame(animateScroll);
  }

  function animateScroll() {
    state.animationFrame = 0;
    const scrollDelta = state.targetProgress - state.smoothProgress;
    state.smoothProgress = Math.abs(scrollDelta) < 0.0005
      ? state.targetProgress
      : state.smoothProgress + scrollDelta * (IS_TOUCH_PREVIEW ? TOUCH_SMOOTHING : DESKTOP_SMOOTHING);
    const scrollValue = state.smoothProgress.toFixed(4);
    setStyleVar("--scroll", scrollValue);
    setLayerExpanded(state.smoothProgress > 0.025);

    state.bgPanCurrent += (state.bgPanTarget - state.bgPanCurrent) * 0.24;
    setStyleVar("--bg-pan", `${state.bgPanCurrent.toFixed(2)}%`);

    state.pointerCurrent.shiftX += (state.pointerTarget.shiftX - state.pointerCurrent.shiftX) * 0.22;
    state.pointerCurrent.shiftY += (state.pointerTarget.shiftY - state.pointerCurrent.shiftY) * 0.22;
    state.pointerCurrent.tiltX += (state.pointerTarget.tiltX - state.pointerCurrent.tiltX) * 0.22;
    state.pointerCurrent.tiltY += (state.pointerTarget.tiltY - state.pointerCurrent.tiltY) * 0.22;
    state.pointerCurrent.depthX += (state.pointerTarget.depthX - state.pointerCurrent.depthX) * 0.22;
    state.pointerCurrent.depthY += (state.pointerTarget.depthY - state.pointerCurrent.depthY) * 0.22;
    state.pointerCurrent.press += (state.pointerTarget.press - state.pointerCurrent.press) * 0.26;
    state.pointerCurrent.stageX += (state.pointerTarget.stageX - state.pointerCurrent.stageX) * 0.24;
    state.pointerCurrent.stageY += (state.pointerTarget.stageY - state.pointerCurrent.stageY) * 0.24;

    setStyleVar("--pointer-shift-x", `${state.pointerCurrent.shiftX.toFixed(2)}px`);
    setStyleVar("--pointer-shift-y", `${state.pointerCurrent.shiftY.toFixed(2)}px`);
    setStyleVar("--pointer-tilt-x", `${state.pointerCurrent.tiltX.toFixed(2)}deg`);
    setStyleVar("--pointer-tilt-y", `${state.pointerCurrent.tiltY.toFixed(2)}deg`);
    setStyleVar("--pointer-depth-x", `${state.pointerCurrent.depthX.toFixed(2)}px`);
    setStyleVar("--pointer-depth-y", `${state.pointerCurrent.depthY.toFixed(2)}px`);
    setStyleVar("--stage-pointer-x", `${state.pointerCurrent.stageX.toFixed(2)}%`);
    setStyleVar("--stage-pointer-y", `${state.pointerCurrent.stageY.toFixed(2)}%`);
    setStyleVar("--pointer-press-opacity", `${state.pointerCurrent.press.toFixed(3)}`);

    if (!motionSettled()) requestMotionFrame();
  }

  function bindEvents() {
    dom.previewScroll.addEventListener("wheel", handlePreviewWheel, { passive: false });
    dom.previewScroll.addEventListener("scroll", updateScrollTarget, { passive: true });
    dom.previewScroll.addEventListener("touchstart", handlePreviewTouchStart, { passive: false });
    dom.previewScroll.addEventListener("touchmove", handlePreviewTouchMove, { passive: false });
    dom.previewScroll.addEventListener("pointermove", updatePointerMotion);
    dom.previewScroll.addEventListener("pointerleave", resetPointerTarget);
    dom.mobileScrollbar?.addEventListener("pointerdown", beginMobileScrollbarDrag);
    dom.mobileScrollbar?.addEventListener("pointermove", moveMobileScrollbarDrag);
    dom.mobileScrollbar?.addEventListener("pointerup", endMobileScrollbarDrag);
    dom.mobileScrollbar?.addEventListener("pointercancel", endMobileScrollbarDrag);
    dom.backgroundLayer.addEventListener("pointerdown", beginBackgroundPan);
    dom.backgroundLayer.addEventListener("pointermove", moveBackgroundPan);
    dom.backgroundLayer.addEventListener("pointerup", endBackgroundPan);
    dom.backgroundLayer.addEventListener("pointercancel", endBackgroundPan);
    window.addEventListener("resize", updateScale);
  }

  async function init() {
    bindEvents();
    updateScale();
    updateScrollTarget();
    requestMotionFrame();

    const [hotspotConfig, manifest, optimizedManifest] = await Promise.all([
      fetchJson("/hotspots.json", {}),
      fetchJson("/preview-manifest.json", {}),
      fetchJson("/preview-optimized-manifest.json", {}),
    ]);
    const target = resolvePreviewTarget(hotspotConfig);
    const directory = target.directory;
    if (!directory) {
      showEmptyState("没有找到这个热区对应的预览目录");
      return;
    }

    const manifestMap = new Map(
      Object.entries(manifest).map(([key, files]) => [normalizePreviewDirectory(key), Array.isArray(files) ? files : []]),
    );
    const files = manifestMap.get(directory) || [];
    if (!files.length) {
      showEmptyState(`预览目录没有可用文件：${directory}`);
      return;
    }

    const optimizedEntry = optimizedManifest[normalizePreviewDirectory(directory)] || {};
    state.optimizedAssets = new Map(Object.entries(optimizedEntry));

    await renderStructuredPreview(directory, files, {
      showHost: target.hotspot?.showHost === true,
    });
    updateScale();
  }

  init().catch(() => {
    showEmptyState("详情页加载失败，请确认已运行 node server.js");
  });
})();
