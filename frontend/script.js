const paletteStrip = document.getElementById("paletteStrip");
const savedPalettes = document.getElementById("savedPalettes");
const statusMessage = document.getElementById("statusMessage");
const paletteNameInput = document.getElementById("paletteNameInput");
const colorCountInput = document.getElementById("colorCountInput");
const importPaletteInput = document.getElementById("importPaletteInput");
const swatchTemplate = document.getElementById("swatchTemplate");
const savedPaletteTemplate = document.getElementById("savedPaletteTemplate");
const savedSearchInput = document.getElementById("savedSearchInput");
const favoritesOnlyInput = document.getElementById("favoritesOnlyInput");
const formatSelect = document.getElementById("formatSelect");
const themeButtons = Array.from(document.querySelectorAll(".theme-chip"));

const generatePaletteButton = document.getElementById("generatePaletteButton");
const savePaletteButton = document.getElementById("savePaletteButton");
const refreshSavedButton = document.getElementById("refreshSavedButton");
const copyPaletteButton = document.getElementById("copyPaletteButton");
const suggestNameButton = document.getElementById("suggestNameButton");
const resetPaletteButton = document.getElementById("resetPaletteButton");
const downloadPaletteButton = document.getElementById("downloadPaletteButton");
const importPaletteButton = document.getElementById("importPaletteButton");
const undoPaletteButton = document.getElementById("undoPaletteButton");
const sortPaletteButton = document.getElementById("sortPaletteButton");
const shufflePaletteButton = document.getElementById("shufflePaletteButton");
const reversePaletteButton = document.getElementById("reversePaletteButton");
const clearLocksButton = document.getElementById("clearLocksButton");
const copyCssVarsButton = document.getElementById("copyCssVarsButton");
const copyGradientButton = document.getElementById("copyGradientButton");
const copyTailwindButton = document.getElementById("copyTailwindButton");
const copyCsvButton = document.getElementById("copyCsvButton");
const toastStack = document.getElementById("toastStack");
const welcomeBanner = document.getElementById("welcomeBanner");
const dismissWelcomeButton = document.getElementById("dismissWelcomeButton");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");
const signupNameInput = document.getElementById("signupName");
const signupEmailInput = document.getElementById("signupEmail");
const signupPasswordInput = document.getElementById("signupPassword");
const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const authStatus = document.getElementById("authStatus");
const userGreeting = document.getElementById("userGreeting");
const logoutButtons = Array.from(document.querySelectorAll(".logout-button"));

const API_BASE_URL =
  window.location.origin === "http://localhost:5000" ? "" : "http://localhost:5000";
const ONBOARDING_STORAGE_KEY = "palette-studio-welcome-dismissed";
const WORKSPACE_STORAGE_KEY = "palette-studio-workspace";
const AUTH_STORAGE_KEY = "palette-studio-auth-user";
const isAuthPage = window.location.pathname === "/" || window.location.pathname.endsWith("/index.html");
const isProtectedPage = document.body.dataset.protectedPage === "true";

const roleLabels = ["Hero", "Base", "Accent", "Contrast", "Detail", "Soft", "Bold", "Glow"];
const themeProfiles = {
  warm: { hueStart: 18, hueEnd: 34, satStart: 58, satEnd: 38, lightStart: 84, lightEnd: 38 },
  earthy: { hueStart: 24, hueEnd: 46, satStart: 42, satEnd: 34, lightStart: 76, lightEnd: 30 },
  muted: { hueStart: 14, hueEnd: 28, satStart: 24, satEnd: 18, lightStart: 88, lightEnd: 52 },
  luxury: { hueStart: 22, hueEnd: 38, satStart: 48, satEnd: 32, lightStart: 80, lightEnd: 22 },
  cool: { hueStart: 180, hueEnd: 240, satStart: 58, satEnd: 38, lightStart: 84, lightEnd: 36 },
  vibrant: { hueStart: 0, hueEnd: 320, satStart: 78, satEnd: 62, lightStart: 82, lightEnd: 42 },
  ocean: { hueStart: 185, hueEnd: 220, satStart: 68, satEnd: 44, lightStart: 86, lightEnd: 30 },
  forest: { hueStart: 88, hueEnd: 145, satStart: 52, satEnd: 38, lightStart: 82, lightEnd: 26 },
  sunset: { hueStart: 8, hueEnd: 338, satStart: 76, satEnd: 52, lightStart: 84, lightEnd: 42 },
  random: { hueStart: 0, hueEnd: 360, satStart: 80, satEnd: 32, lightStart: 86, lightEnd: 24 },
};

let currentPalette = [];
let lockedColors = [];
let allSavedPalettes = [];
let currentTheme = "warm";
let displayFormat = "hex";
let paletteHistory = [];
let initialPalette = [];

const readAuthenticatedUser = () => {
  try {
    const rawState = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawState ? JSON.parse(rawState) : null;
  } catch (error) {
    return null;
  }
};

const persistAuthenticatedUser = (user) => {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    // Ignore storage failures so auth still works in memory.
  }
};

const clearAuthenticatedUser = () => {
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    // Ignore storage failures so logout still works.
  }
};

const redirectToAuth = () => {
  window.location.href = `${window.location.origin}/`;
};

const redirectToHome = () => {
  window.location.href = `${window.location.origin}/home.html`;
};

const syncAuthUi = () => {
  const currentUser = readAuthenticatedUser();

  if (userGreeting) {
    userGreeting.textContent = currentUser ? `Hi, ${currentUser.name}` : "Welcome";
  }
};

const setAuthMode = (mode) => {
  if (!loginForm || !signupForm || !loginTab || !signupTab) {
    return;
  }

  const isLoginMode = mode === "login";
  loginForm.classList.toggle("is-hidden", !isLoginMode);
  signupForm.classList.toggle("is-hidden", isLoginMode);
  loginTab.classList.toggle("is-active", isLoginMode);
  signupTab.classList.toggle("is-active", !isLoginMode);
};

const setAuthMessage = (message, isError = false) => {
  if (!authStatus) {
    return;
  }

  authStatus.textContent = message;
  authStatus.classList.toggle("is-error", isError);
};

const protectRoute = () => {
  const currentUser = readAuthenticatedUser();

  if (isAuthPage && currentUser) {
    redirectToHome();
    return false;
  }

  if (isProtectedPage && !currentUser) {
    redirectToAuth();
    return false;
  }

  syncAuthUi();
  return true;
};

const readWorkspaceState = () => {
  try {
    const rawState = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    return rawState ? JSON.parse(rawState) : null;
  } catch (error) {
    return null;
  }
};

const persistWorkspaceState = () => {
  try {
    window.localStorage.setItem(
      WORKSPACE_STORAGE_KEY,
      JSON.stringify({
        currentPalette,
        lockedColors,
        currentTheme,
        displayFormat,
        paletteHistory,
        initialPalette,
        paletteName: paletteNameInput ? paletteNameInput.value : "",
        colorCount: colorCountInput ? colorCountInput.value : currentPalette.length || 5,
      })
    );
  } catch (error) {
    // Ignore storage failures so the UI keeps working.
  }
};

const hydrateWorkspaceState = () => {
  const savedState = readWorkspaceState();

  if (!savedState) {
    return;
  }

  currentPalette = Array.isArray(savedState.currentPalette) ? savedState.currentPalette : [];
  lockedColors = Array.isArray(savedState.lockedColors) ? savedState.lockedColors : [];
  currentTheme = typeof savedState.currentTheme === "string" ? savedState.currentTheme : "warm";
  displayFormat = typeof savedState.displayFormat === "string" ? savedState.displayFormat : "hex";
  paletteHistory = Array.isArray(savedState.paletteHistory) ? savedState.paletteHistory : [];
  initialPalette = Array.isArray(savedState.initialPalette) ? savedState.initialPalette : [];

  if (paletteNameInput && typeof savedState.paletteName === "string") {
    paletteNameInput.value = savedState.paletteName;
  }

  if (colorCountInput && savedState.colorCount) {
    colorCountInput.value = savedState.colorCount;
  }

  if (formatSelect) {
    formatSelect.value = displayFormat;
  }
};

const paletteNameWords = {
  warm: ["Dune", "Amber", "Honey", "Blush", "Sunlit"],
  earthy: ["Clay", "Cedar", "Moss", "Canyon", "Terrace"],
  muted: ["Mist", "Velvet", "Drift", "Cloud", "Quiet"],
  luxury: ["Velour", "Satin", "Noir", "Aura", "Reserve"],
  cool: ["Ice", "Frost", "Azure", "Glacier", "Moon"],
  vibrant: ["Pulse", "Candy", "Pop", "Prism", "Bloom"],
  ocean: ["Tide", "Lagoon", "Coral", "Reef", "Harbor"],
  forest: ["Pine", "Fern", "Grove", "Canopy", "Evergreen"],
  sunset: ["Ember", "Coral", "Saffron", "Glow", "Dusk"],
  random: ["Spectrum", "Mix", "Play", "Fusion", "Nova"],
};

const paletteMoodWords = ["Morning", "Studio", "Glow", "Bloom", "Harmony", "Edit"];

const apiFetch = (path, options = {}) => fetch(`${API_BASE_URL}${path}`, options);

const submitLogin = async (event) => {
  event.preventDefault();

  try {
    setButtonLoading(loginButton, true, "Logging In...");
    setAuthMessage("Checking your account...");

    const response = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmailInput.value.trim(),
        password: loginPasswordInput.value,
      }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to log in.");
    }

    persistAuthenticatedUser(result.data);
    setAuthMessage("Login successful. Opening your home page...");
    redirectToHome();
  } catch (error) {
    setAuthMessage(error.message, true);
  } finally {
    setButtonLoading(loginButton, false, "Logging In...");
  }
};

const submitSignup = async (event) => {
  event.preventDefault();

  try {
    setButtonLoading(signupButton, true, "Creating...");
    setAuthMessage("Creating your account...");

    const response = await apiFetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signupNameInput.value.trim(),
        email: signupEmailInput.value.trim(),
        password: signupPasswordInput.value,
      }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to create account.");
    }

    persistAuthenticatedUser(result.data);
    setAuthMessage("Account created successfully. Opening your home page...");
    redirectToHome();
  } catch (error) {
    setAuthMessage(error.message, true);
  } finally {
    setButtonLoading(signupButton, false, "Creating...");
  }
};

const logOut = () => {
  clearAuthenticatedUser();
  redirectToAuth();
};

const showToast = (message, isError = false) => {
  if (!toastStack) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = `toast${isError ? " is-error" : ""}`;
  toast.textContent = message;
  toastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-6px)";
  }, 2600);

  window.setTimeout(() => {
    toast.remove();
  }, 3000);
};

const setStatus = (message, isError = false, options = {}) => {
  const { toast = false } = options;
  if (statusMessage) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#9a3f35" : "#866c5f";
  }

  if (toast) {
    showToast(message, isError);
  }
};

const setButtonLoading = (button, isLoading, loadingLabel) => {
  if (!button) {
    return;
  }

  if (!button.dataset.defaultLabel) {
    button.dataset.defaultLabel = button.textContent.trim();
  }

  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  button.textContent = isLoading ? loadingLabel : button.dataset.defaultLabel;
};

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const interpolate = (start, end, ratio) => start + (end - start) * ratio;

const seedFromHex = (hex) =>
  hex
    .replace("#", "")
    .split("")
    .reduce((sum, char) => sum + Number.parseInt(char, 16), 0);

const hslToHex = (h, s, l) => {
  const normalizedHue = ((h % 360) + 360) % 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = normalizedHue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const match = lightness - chroma / 2;
  const toHex = (value) =>
    Math.round((value + match) * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
};

const hexToRgb = (hex) => {
  const value = hex.replace("#", "");

  return {
    red: Number.parseInt(value.slice(0, 2), 16),
    green: Number.parseInt(value.slice(2, 4), 16),
    blue: Number.parseInt(value.slice(4, 6), 16),
  };
};

const hexToHsl = (hex) => {
  const { red, green, blue } = hexToRgb(hex);
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    if (max === r) {
      hue = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      hue = 60 * ((b - r) / delta + 2);
    } else {
      hue = 60 * ((r - g) / delta + 4);
    }
  }

  return {
    hue: Math.round((hue + 360) % 360),
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100),
  };
};

const formatColor = (hex, format = displayFormat) => {
  if (format === "rgb") {
    const { red, green, blue } = hexToRgb(hex);
    return `rgb(${red}, ${green}, ${blue})`;
  }

  if (format === "hsl") {
    const { hue, saturation, lightness } = hexToHsl(hex);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  return hex;
};

const getBrightness = (hex) => {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return red * 0.299 + green * 0.587 + blue * 0.114;
};

const getRelativeLuminance = (hex) => {
  const { red, green, blue } = hexToRgb(hex);
  const convertChannel = (channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  const r = convertChannel(red);
  const g = convertChannel(green);
  const b = convertChannel(blue);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (backgroundHex, textHex) => {
  const first = getRelativeLuminance(backgroundHex);
  const second = getRelativeLuminance(textHex);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
};

const getBestTextColor = (backgroundHex) => {
  const whiteRatio = getContrastRatio(backgroundHex, "#FFFFFF");
  const blackRatio = getContrastRatio(backgroundHex, "#111111");

  return whiteRatio >= blackRatio
    ? { label: "Use white text", color: "#FFFFFF", ratio: whiteRatio }
    : { label: "Use dark text", color: "#111111", ratio: blackRatio };
};

const isValidHexColor = (value) => /^#[0-9A-F]{6}$/i.test(value);

const createReplacementColor = (index, total) => {
  const seedColor = hslToHex(
    Math.floor(Math.random() * 360),
    50 + Math.floor(Math.random() * 40),
    35 + Math.floor(Math.random() * 50)
  );

  return applyThemeToPalette(Array.from({ length: total }, () => seedColor), currentTheme)[index];
};

const syncLockedColors = (length) => {
  lockedColors = Array.from({ length }, (_, index) => lockedColors[index] || false);
};

const applyThemeToPalette = (palette, themeName) => {
  const theme = themeProfiles[themeName] || themeProfiles.warm;

  return palette.map((color, index, colors) => {
    const ratio = colors.length === 1 ? 0 : index / (colors.length - 1);
    const seed = seedFromHex(color);
    const hue = interpolate(theme.hueStart, theme.hueEnd, ratio) + (seed % 9) - 4;
    const saturation = interpolate(theme.satStart, theme.satEnd, ratio) + (seed % 7) - 3;
    const lightness = interpolate(theme.lightStart, theme.lightEnd, ratio) + (seed % 5) - 2;

    return hslToHex(hue, saturation, lightness);
  });
};

const setActiveTheme = (themeName) => {
  currentTheme = themeName;
  themeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.theme === themeName);
  });
  persistWorkspaceState();
};

const buildSwatch = (color, index) => {
  const swatch = swatchTemplate.content.firstElementChild.cloneNode(true);
  const colorBlock = swatch.querySelector(".swatch-color");
  const swatchInfo = swatch.querySelector(".swatch-info");
  const copyButton = swatch.querySelector(".swatch-copy");
  const lockButton = swatch.querySelector(".swatch-lock");
  const editButton = swatch.querySelector(".swatch-edit");
  const refreshButton = swatch.querySelector(".swatch-refresh");
  const colorInput = swatch.querySelector(".swatch-color-input");
  const textHelp = getBestTextColor(color);

  colorBlock.style.background = color;
  colorInput.value = color;
  lockButton.textContent = lockedColors[index] ? "Locked" : "Lock";
  lockButton.classList.toggle("is-locked", lockedColors[index]);
  swatchInfo.innerHTML = `
    <div class="swatch-meta">
      <strong class="swatch-hex">${formatColor(color)}</strong>
      <span class="swatch-role">${roleLabels[index] || `Tone ${index + 1}`}</span>
    </div>
    <div class="swatch-helper">
      <span class="swatch-text-badge">${textHelp.label}</span>
      <span class="swatch-role">${textHelp.ratio.toFixed(2)}:1</span>
    </div>
  `;

  copyButton.addEventListener("click", async () => {
    try {
      await copyText(formatColor(color));
      setStatus(`${formatColor(color)} copied to clipboard.`, false, { toast: true });
    } catch (error) {
      setStatus("Copy failed. Please try again.", true, { toast: true });
    }
  });

  editButton.addEventListener("click", () => {
    colorInput.click();
  });

  colorInput.addEventListener("input", (event) => {
    if (!currentPalette.length) {
      setStatus("Generate a palette first before editing a color.", true);
      return;
    }

    const nextPalette = [...currentPalette];
    nextPalette[index] = event.target.value.toUpperCase();
    renderCurrentPalette(nextPalette);
    setStatus(`Swatch ${index + 1} updated to ${nextPalette[index]}.`, false, { toast: true });
  });

  refreshButton.addEventListener("click", () => {
    if (!currentPalette.length) {
      setStatus("Generate a palette first before refreshing a color.", true);
      return;
    }

    const nextPalette = [...currentPalette];
    nextPalette[index] = createReplacementColor(index, nextPalette.length);
    renderCurrentPalette(nextPalette);
    setStatus(`Swatch ${index + 1} refreshed.`, false, { toast: true });
  });

  lockButton.addEventListener("click", () => {
    lockedColors[index] = !lockedColors[index];
    renderCurrentPalette(currentPalette);
    setStatus(
      lockedColors[index]
        ? `${color} locked. Create a new palette to keep this color and refresh the others.`
        : `${color} unlocked. It can change the next time you create a palette.`,
      false,
      { toast: true }
    );
  });

  return swatch;
};

const renderCurrentPalette = (palette) => {
  currentPalette = palette;
  syncLockedColors(palette.length);
  persistWorkspaceState();

  if (!paletteStrip || !swatchTemplate) {
    return;
  }

  paletteStrip.innerHTML = "";

  palette.forEach((color, index) => {
    paletteStrip.appendChild(buildSwatch(color, index));
  });
};

const resetCurrentPalette = () => {
  if (!initialPalette.length) {
    setStatus("Generate a palette first before resetting it.", true, { toast: true });
    return;
  }

  colorCountInput.value = initialPalette.length;
  lockedColors = Array.from({ length: initialPalette.length }, () => false);
  paletteNameInput.value = "";
  renderCurrentPalette([...initialPalette]);
  setStatus("Palette reset to the last freshly generated set.", false, { toast: true });
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const renderSavedPalettes = (palettes) => {
  if (!savedPalettes || !savedPaletteTemplate) {
    return;
  }

  savedPalettes.innerHTML = "";

  if (!palettes.length) {
    savedPalettes.innerHTML = '<div class="empty-state">No matching palettes yet. Save one or adjust your search.</div>';
    return;
  }

  palettes.forEach((palette) => {
    const card = savedPaletteTemplate.content.firstElementChild.cloneNode(true);
    const title = card.querySelector(".saved-title");
    const date = card.querySelector(".saved-date");
    const strip = card.querySelector(".saved-strip");
    const loadButton = card.querySelector(".saved-load");
    const renameButton = card.querySelector(".saved-rename");
    const favoriteButton = card.querySelector(".saved-favorite");
    const deleteButton = card.querySelector(".saved-delete");

    title.textContent = palette.name || "Untitled Palette";
    date.textContent = `Saved on ${formatDate(palette.createdAt)}`;
    favoriteButton.textContent = palette.isFavorite ? "Favorited" : "Favorite";
    favoriteButton.classList.toggle("is-favorite", Boolean(palette.isFavorite));

    loadButton.addEventListener("click", () => {
      if (colorCountInput) {
        colorCountInput.value = palette.colors.length;
      }
      if (paletteNameInput) {
        paletteNameInput.value = palette.name || "";
      }
      lockedColors = Array.from({ length: palette.colors.length }, () => false);
      renderCurrentPalette(palette.colors);
      setStatus(`Loaded "${palette.name || "Untitled Palette"}" into the main palette editor.`);
    });

    renameButton.addEventListener("click", async () => {
      const nextName = window.prompt("Enter a new palette name:", palette.name || "Untitled Palette");

      if (nextName === null) {
        return;
      }

      await renameSavedPalette(palette._id, nextName);
    });

    favoriteButton.addEventListener("click", async () => {
      await toggleFavoriteSavedPalette(palette._id);
    });

    deleteButton.addEventListener("click", async () => {
      const shouldDelete = window.confirm(`Delete "${palette.name || "Untitled Palette"}"?`);

      if (!shouldDelete) {
        return;
      }

      await deleteSavedPalette(palette._id);
    });

    palette.colors.forEach((color, colorIndex) => {
      const swatchCard = document.createElement("div");
      const swatch = document.createElement("button");
      const editButton = document.createElement("button");
      const colorInput = document.createElement("input");

      swatchCard.className = "saved-swatch-card";
      swatch.type = "button";
      swatch.className = "saved-swatch";
      swatch.style.background = color;
      swatch.title = `Copy ${color}`;
      swatch.setAttribute("aria-label", `Copy ${color}`);
      swatch.addEventListener("click", async () => {
        try {
          await copyText(color);
          setStatus(`${color} copied from saved palettes.`, false, { toast: true });
        } catch (error) {
          setStatus("Copy failed. Please try again.", true, { toast: true });
        }
      });

      editButton.type = "button";
      editButton.className = "saved-swatch-edit";
      editButton.textContent = "Edit";
      editButton.setAttribute("aria-label", `Edit saved color ${color}`);
      editButton.addEventListener("click", () => {
        colorInput.click();
      });

      colorInput.className = "saved-swatch-input";
      colorInput.type = "color";
      colorInput.value = color;
      colorInput.addEventListener("input", async (event) => {
        const nextColors = [...palette.colors];
        nextColors[colorIndex] = event.target.value.toUpperCase();
        await updateSavedPaletteColors(palette._id, nextColors);
      });

      swatchCard.appendChild(swatch);
      swatchCard.appendChild(editButton);
      swatchCard.appendChild(colorInput);
      strip.appendChild(swatchCard);
    });

    savedPalettes.appendChild(card);
  });
};

const renderFilteredSavedPalettes = () => {
  const query = savedSearchInput ? savedSearchInput.value.trim().toLowerCase() : "";
  const filteredPalettes = allSavedPalettes
    .filter((palette) => (palette.name || "Untitled Palette").toLowerCase().includes(query))
    .filter((palette) => (favoritesOnlyInput ? (favoritesOnlyInput.checked ? Boolean(palette.isFavorite) : true) : true))
    .sort((left, right) => {
      if (Boolean(left.isFavorite) !== Boolean(right.isFavorite)) {
        return left.isFavorite ? -1 : 1;
      }

      return new Date(right.createdAt) - new Date(left.createdAt);
    });

  renderSavedPalettes(filteredPalettes);
};

const renameSavedPalette = async (paletteId, name) => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    setStatus("Palette name cannot be empty.", true);
    return;
  }

  try {
    setStatus("Updating palette name...");
    const response = await apiFetch(`/api/palette/${paletteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: trimmedName,
      }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update palette name.");
    }

    setStatus("Palette name updated successfully.");
    await fetchSavedPalettes();
  } catch (error) {
    setStatus(error.message, true, { toast: true });
  }
};

const updateSavedPaletteColors = async (paletteId, colors) => {
  const invalidColor = colors.find((color) => !isValidHexColor(color));

  if (invalidColor) {
    setStatus(`Invalid color selected: ${invalidColor}`, true, { toast: true });
    return;
  }

  try {
    setStatus("Updating saved palette colors...");
    const response = await apiFetch(`/api/palette/${paletteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        colors,
      }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update palette colors.");
    }

    setStatus("Saved palette colors updated successfully.", false, { toast: true });
    await fetchSavedPalettes();
  } catch (error) {
    setStatus(error.message, true, { toast: true });
  }
};

const suggestPaletteName = () => {
  const themeWords = paletteNameWords[currentTheme] || paletteNameWords.warm;
  const toneWord = themeWords[Math.floor(Math.random() * themeWords.length)];
  const moodWord = paletteMoodWords[Math.floor(Math.random() * paletteMoodWords.length)];
  if (paletteNameInput) {
    paletteNameInput.value = `${toneWord} ${moodWord}`;
  }
  persistWorkspaceState();
  setStatus(`Suggested name added: ${paletteNameInput.value}`, false, { toast: true });
};

const downloadCurrentPalette = () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before downloading it.", true);
    return;
  }

  const payload = {
    name: paletteNameInput.value.trim() || "Untitled Palette",
    theme: currentTheme,
    colors: currentPalette,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  link.href = downloadUrl;
  link.download = `${safeName || "palette"}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);

  setStatus("Palette JSON downloaded successfully.", false, { toast: true });
};

const copyCssVariables = async () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before exporting CSS variables.", true);
    return;
  }

  const css = [":root {"]
    .concat(currentPalette.map((color, index) => `  --color-${index + 1}: ${color};`))
    .concat(["}"])
    .join("\n");

  try {
    await copyText(css);
    setStatus("CSS variables copied to clipboard.", false, { toast: true });
  } catch (error) {
    setStatus("Copy failed. Please try again.", true, { toast: true });
  }
};

const copyGradientCss = async () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before copying a gradient.", true);
    return;
  }

  const gradientCss = `background: linear-gradient(135deg, ${currentPalette.join(", ")});`;

  try {
    await copyText(gradientCss);
    setStatus("Gradient CSS copied to clipboard.", false, { toast: true });
  } catch (error) {
    setStatus("Copy failed. Please try again.", true, { toast: true });
  }
};

const copyTailwindObject = async () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before exporting Tailwind colors.", true);
    return;
  }

  const tailwindObject = `colors: {\n${currentPalette
    .map((color, index) => `  ${index + 1}: "${color}",`)
    .join("\n")}\n}`;

  try {
    await copyText(tailwindObject);
    setStatus("Tailwind-style color object copied to clipboard.", false, { toast: true });
  } catch (error) {
    setStatus("Copy failed. Please try again.", true, { toast: true });
  }
};

const copyCsvPalette = async () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before exporting CSV.", true);
    return;
  }

  const csv = ["index,color"]
    .concat(currentPalette.map((color, index) => `${index + 1},${color}`))
    .join("\n");

  try {
    await copyText(csv);
    setStatus("Palette CSV copied to clipboard.", false, { toast: true });
  } catch (error) {
    setStatus("Copy failed. Please try again.", true, { toast: true });
  }
};

const importPaletteFromFile = async (event) => {
  const [file] = event.target.files || [];

  if (!file) {
    return;
  }

  try {
    const content = await file.text();
    const parsed = JSON.parse(content);
    const colors = Array.isArray(parsed.colors) ? parsed.colors : [];

    if (!colors.length) {
      throw new Error("Imported file does not contain a valid colors array.");
    }

    colorCountInput.value = Math.min(Math.max(colors.length, 3), 8);
    if (paletteNameInput) {
      paletteNameInput.value = typeof parsed.name === "string" ? parsed.name : "";
    }
    lockedColors = Array.from({ length: colors.length }, () => false);
    renderCurrentPalette(colors);
    setStatus("Palette imported successfully.", false, { toast: true });
  } catch (error) {
    setStatus(error.message || "Unable to import palette file.", true, { toast: true });
  } finally {
    importPaletteInput.value = "";
  }
};

const undoPalette = () => {
  if (!paletteHistory.length) {
    setStatus("No previous palette available to undo.", true);
    return;
  }

  const previousState = paletteHistory.pop();
  colorCountInput.value = previousState.colors.length;
  lockedColors = previousState.locks;
  renderCurrentPalette(previousState.colors);
  setStatus("Reverted to the previous palette.", false, { toast: true });
};

const toggleFavoriteSavedPalette = async (paletteId) => {
  try {
    setStatus("Updating favorite status...");
    const response = await apiFetch(`/api/palette/${paletteId}/favorite`, {
      method: "PATCH",
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update favorite status.");
    }

    setStatus(result.message, false, { toast: true });
    await fetchSavedPalettes();
  } catch (error) {
    setStatus(error.message, true, { toast: true });
  }
};

const deleteSavedPalette = async (paletteId) => {
  try {
    setStatus("Deleting palette...");
    const response = await apiFetch(`/api/palette/${paletteId}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete palette.");
    }

    setStatus("Palette deleted successfully.", false, { toast: true });
    await fetchSavedPalettes();
  } catch (error) {
    setStatus(error.message, true, { toast: true });
  }
};

const fetchGeneratedPalette = async () => {
  const count = Number.parseInt(colorCountInput ? colorCountInput.value : "5", 10);
  const safeCount = Number.isNaN(count) ? 5 : Math.min(Math.max(count, 3), 8);
  if (colorCountInput) {
    colorCountInput.value = safeCount;
  }

  try {
    setButtonLoading(generatePaletteButton, true, "Generating...");
    setStatus("Generating palette...");
    const response = await apiFetch(`/api/palette/generate?count=${safeCount}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to generate palette.");
    }

    if (currentPalette.length) {
      paletteHistory.push({
        colors: [...currentPalette],
        locks: [...lockedColors],
      });

      if (paletteHistory.length > 20) {
        paletteHistory.shift();
      }
    }

    const themedPalette = applyThemeToPalette(result.data.palette, currentTheme);
    initialPalette = [...themedPalette];
    const nextPalette = themedPalette.map(
      (color, index) => (lockedColors[index] ? currentPalette[index] : color)
    );

    if (nextPalette.length !== safeCount) {
      lockedColors = Array.from({ length: safeCount }, () => false);
    }

    renderCurrentPalette(nextPalette);
    setStatus(
      lockedColors.some(Boolean)
        ? `New ${currentTheme} palette created. Locked colors were preserved and the other colors were refreshed.`
        : `New ${currentTheme} palette created. Click any swatch to copy one color, lock favorites, or save the full palette below.`,
      false,
      { toast: true }
    );
  } catch (error) {
    setStatus(error.message, true, { toast: true });
  } finally {
    setButtonLoading(generatePaletteButton, false, "Generating...");
  }
};

const fetchSavedPalettes = async () => {
  try {
    setButtonLoading(refreshSavedButton, true, "Loading...");
    setStatus("Loading saved palettes...");
    const response = await apiFetch("/api/palette");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load saved palettes.");
    }

    allSavedPalettes = result.data;
    renderFilteredSavedPalettes();
    setStatus(
      result.data.length
        ? "Saved palettes loaded. Click any saved color to copy it."
        : "No saved palettes yet. Create one above and save it to build your library."
    );
  } catch (error) {
    savedPalettes.innerHTML = `<div class="empty-state">${error.message}</div>`;
    setStatus(error.message, true);
  } finally {
    setButtonLoading(refreshSavedButton, false, "Loading...");
  }
};

const saveCurrentPalette = async () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before saving.", true);
    return;
  }

  const name = paletteNameInput.value.trim();

  if (!name) {
    setStatus("Palette name is required before saving.", true, { toast: true });
    return;
  }

  try {
    setButtonLoading(savePaletteButton, true, "Saving...");
    setStatus("Saving palette...");
    const response = await apiFetch("/api/palette", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        colors: currentPalette,
      }),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to save palette.");
    }

    if (paletteNameInput) {
      paletteNameInput.value = "";
    }
    persistWorkspaceState();
    setStatus("Palette saved successfully. Your library has been updated below.", false, {
      toast: true,
    });
    await fetchSavedPalettes();
  } catch (error) {
    setStatus(error.message, true, { toast: true });
  } finally {
    setButtonLoading(savePaletteButton, false, "Saving...");
  }
};

const copyCurrentPalette = async () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before copying.", true);
    return;
  }

  try {
    await copyText(currentPalette.map((color) => formatColor(color)).join(", "));
    setStatus(`All current ${displayFormat.toUpperCase()} colors copied to clipboard.`, false, {
      toast: true,
    });
  } catch (error) {
    setStatus("Copy failed. Please try again.", true, { toast: true });
  }
};

const reorderCurrentPalette = (entries) => {
  currentPalette = entries.map((entry) => entry.color);
  lockedColors = entries.map((entry) => entry.locked);
  renderCurrentPalette(currentPalette);
};

const sortPaletteLightToDark = () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before sorting.", true);
    return;
  }

  const sortedEntries = currentPalette
    .map((color, index) => ({ color, locked: lockedColors[index] }))
    .sort((left, right) => getBrightness(right.color) - getBrightness(left.color));

  reorderCurrentPalette(sortedEntries);
  setStatus("Palette sorted from lightest to darkest.", false, { toast: true });
};

const shufflePaletteOrder = () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before shuffling.", true);
    return;
  }

  const entries = currentPalette.map((color, index) => ({ color, locked: lockedColors[index] }));

  for (let index = entries.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [entries[index], entries[swapIndex]] = [entries[swapIndex], entries[index]];
  }

  reorderCurrentPalette(entries);
  setStatus("Palette order shuffled.", false, { toast: true });
};

const reversePaletteOrder = () => {
  if (!currentPalette.length) {
    setStatus("Generate a palette first before reversing it.", true);
    return;
  }

  const reversedEntries = currentPalette
    .map((color, index) => ({ color, locked: lockedColors[index] }))
    .reverse();

  reorderCurrentPalette(reversedEntries);
  setStatus("Palette order reversed.", false, { toast: true });
};

const clearAllLocks = () => {
  lockedColors = Array.from({ length: currentPalette.length }, () => false);
  renderCurrentPalette(currentPalette);
  setStatus("All swatch locks cleared.", false, { toast: true });
};

const showWelcomeBanner = () => {
  if (!welcomeBanner) {
    return;
  }

  if (window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true") {
    return;
  }

  welcomeBanner.classList.remove("is-hidden");
};

if (dismissWelcomeButton) {
  dismissWelcomeButton.addEventListener("click", () => {
    welcomeBanner.classList.add("is-hidden");
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    setStatus("Quick start tips hidden. You can still use Edit, Lock, and Save anytime.", false, {
      toast: true,
    });
  });
}

if (generatePaletteButton) {
  generatePaletteButton.addEventListener("click", fetchGeneratedPalette);
}

if (refreshSavedButton) {
  refreshSavedButton.addEventListener("click", fetchSavedPalettes);
}

if (savePaletteButton) {
  savePaletteButton.addEventListener("click", saveCurrentPalette);
}

if (copyPaletteButton) {
  copyPaletteButton.addEventListener("click", copyCurrentPalette);
}

if (suggestNameButton) {
  suggestNameButton.addEventListener("click", suggestPaletteName);
}

if (resetPaletteButton) {
  resetPaletteButton.addEventListener("click", resetCurrentPalette);
}

if (downloadPaletteButton) {
  downloadPaletteButton.addEventListener("click", downloadCurrentPalette);
}

if (importPaletteButton && importPaletteInput) {
  importPaletteButton.addEventListener("click", () => importPaletteInput.click());
}

if (sortPaletteButton) {
  sortPaletteButton.addEventListener("click", sortPaletteLightToDark);
}

if (shufflePaletteButton) {
  shufflePaletteButton.addEventListener("click", shufflePaletteOrder);
}

if (reversePaletteButton) {
  reversePaletteButton.addEventListener("click", reversePaletteOrder);
}

if (clearLocksButton) {
  clearLocksButton.addEventListener("click", clearAllLocks);
}

if (undoPaletteButton) {
  undoPaletteButton.addEventListener("click", undoPalette);
}

if (copyCssVarsButton) {
  copyCssVarsButton.addEventListener("click", copyCssVariables);
}

if (copyGradientButton) {
  copyGradientButton.addEventListener("click", copyGradientCss);
}

if (copyTailwindButton) {
  copyTailwindButton.addEventListener("click", copyTailwindObject);
}

if (copyCsvButton) {
  copyCsvButton.addEventListener("click", copyCsvPalette);
}

if (savedSearchInput) {
  savedSearchInput.addEventListener("input", renderFilteredSavedPalettes);
}

if (favoritesOnlyInput) {
  favoritesOnlyInput.addEventListener("change", renderFilteredSavedPalettes);
}

if (importPaletteInput) {
  importPaletteInput.addEventListener("change", importPaletteFromFile);
}

if (formatSelect) {
  formatSelect.addEventListener("change", () => {
    displayFormat = formatSelect.value;
    persistWorkspaceState();
    renderCurrentPalette(currentPalette);
    setStatus(`${displayFormat.toUpperCase()} format selected for display and copy actions.`, false, {
      toast: true,
    });
  });
}

if (paletteNameInput) {
  paletteNameInput.addEventListener("input", persistWorkspaceState);
}

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTheme(button.dataset.theme);
    setStatus(`${button.textContent} theme selected for your next palette.`, false, {
      toast: true,
    });
  });
});

if (protectRoute()) {
  hydrateWorkspaceState();
  setActiveTheme(currentTheme);
  showWelcomeBanner();

  if (currentPalette.length) {
    renderCurrentPalette(currentPalette);
  }

  if (!currentPalette.length && generatePaletteButton) {
    fetchGeneratedPalette();
  }

  if (savedPalettes || refreshSavedButton) {
    fetchSavedPalettes();
  }
}

if (loginTab) {
  loginTab.addEventListener("click", () => {
    setAuthMode("login");
    setAuthMessage("Log in to continue to your palette pages.");
  });
}

if (signupTab) {
  signupTab.addEventListener("click", () => {
    setAuthMode("signup");
    setAuthMessage("Create your account to start using the project.");
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", submitLogin);
}

if (signupForm) {
  signupForm.addEventListener("submit", submitSignup);
}

logoutButtons.forEach((button) => {
  button.addEventListener("click", logOut);
});
