const modeTabs = document.querySelectorAll(".auth-tab");
const rolePills = document.querySelectorAll(".role-pill");
const form = document.querySelector("#authForm");
const hint = document.querySelector("#authHint");

function updateFormVisibility() {
  const mode = form.mode.value;
  const role = form.role.value;
  const registerFields = document.querySelectorAll(".register-only");
  const pengelolaOnly = document.querySelectorAll(".pengelola-only");

  registerFields.forEach((el) => {
    el.classList.toggle("hidden", mode !== "register");
  });

  pengelolaOnly.forEach((el) => {
    el.classList.toggle("hidden", role !== "pengelola" || mode !== "register");
  });

  if (mode === "login") {
    hint.innerHTML =
      'Belum punya akun? Pilih tab <strong>Daftar</strong> di atas.';
  } else {
    hint.textContent =
      "Isi data singkat di atas, lalu tim kami dapat menghubungkan akunmu dengan backend nanti.";
  }
}

modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    modeTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    form.mode.value = tab.dataset.mode;
    updateFormVisibility();
  });
});

rolePills.forEach((pill) => {
  pill.addEventListener("click", () => {
    rolePills.forEach((p) => {
      p.classList.remove("active");
      p.setAttribute("aria-pressed", "false");
    });
    pill.classList.add("active");
    pill.setAttribute("aria-pressed", "true");
    form.role.value = pill.dataset.role;
    console.log("Role changed to:", form.role.value);
    updateFormVisibility();
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  console.log("Form submitted with data:", data);
  console.log("Mode:", data.mode, "Role:", data.role);
  
  // Redirect ke dashboard pengelola jika login sebagai pengelola
  if (data.mode === "login" && data.role === "pengelola") {
    console.log("Redirecting to dashboard pengelola...");
    // Langsung redirect tanpa alert
    window.location.href = "./dashboard-pengelola.html";
    return;
  }
  
  // Untuk registrasi sebagai pengelola, juga redirect ke dashboard
  if (data.mode === "register" && data.role === "pengelola") {
    console.log("Redirecting to dashboard pengelola (register)...");
    window.location.href = "./dashboard-pengelola.html";
    return;
  }
  
  // Untuk role lain (wisatawan) atau registrasi wisatawan, tampilkan alert
  console.log("Showing alert for wisatawan");
  alert(
    `Simulasi ${data.mode === "login" ? "login" : "registrasi"} sebagai ${
      data.role
    }.\n\nDi versi produksi, data ini akan dikirim ke backend.`
  );
});

updateFormVisibility();


