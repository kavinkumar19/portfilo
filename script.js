// =========================================================
// Kavin Kumar | Portfolio Interactive JavaScript
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------
    // 1. Mobile Navigation Menu Toggle
    // -----------------------------------------------------
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("show");
            const icon = menuBtn.querySelector("i");
            if (navMenu.classList.contains("show")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("show");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    // -----------------------------------------------------
    // 2. Navbar Background Scroll Effect & Active Section Tracker
    // -----------------------------------------------------
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
        // Navbar Scrolled Effect
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Active Section Scroll Spy
        let currentSection = "";
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });

    // -----------------------------------------------------
    // 3. Contact Form Submission Handling
    // -----------------------------------------------------
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const subject = document.getElementById("subject").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !subject || !message) {
                formStatus.textContent = "Please fill in all required fields.";
                formStatus.className = "form-status error";
                return;
            }

            // Simulate form submission
            formStatus.textContent = "Sending message...";
            formStatus.className = "form-status";

            setTimeout(() => {
                formStatus.textContent = "✨ Thank you! Your message has been sent successfully.";
                formStatus.className = "form-status success";
                contactForm.reset();

                setTimeout(() => {
                    formStatus.textContent = "";
                    formStatus.className = "form-status";
                }, 5000);
            }, 1200);
        });
    }

    // -----------------------------------------------------
    // 4. Download Resume Action Handler
    // -----------------------------------------------------
    const downloadBtn = document.getElementById("downloadResumeBtn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", (e) => {
            e.preventDefault();
            alert("📄 Resume download initiated for Kavin Kumar. (You can link your actual PDF resume file in index.html)");
        });
    }

    // -----------------------------------------------------
    // 5. Interactive Mouse Hover Subtle Tilt Effect on Cards
    // -----------------------------------------------------
    const cards = document.querySelectorAll(".project-card, .skill-category-card, .info-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
});

// =========================================================
// Certificate Modal Functions
// =========================================================

function openCertModal(pdfPath, title) {
    const modal = document.getElementById("certModal");
    const titleEl = document.getElementById("certModalTitle");
    const downloadBtn = document.getElementById("certDownloadBtn");
    const body = document.querySelector(".cert-modal-body");

    // URL-encode each path segment to handle spaces & special characters in filenames
    const encodedPath = pdfPath.split('/').map(seg => encodeURIComponent(seg)).join('/');

    titleEl.textContent = title;
    downloadBtn.href = encodedPath;

    // Use <object> tag – better PDF support than iframe across all browsers
    body.innerHTML = `
        <object data="${encodedPath}" type="application/pdf" width="100%" height="100%">
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:1.5rem;padding:2rem;text-align:center;">
                <div style="font-size:4rem;">📄</div>
                <h3 style="color:#1e293b;font-family:'Inter',sans-serif;font-weight:600;">${title}</h3>
                <p style="color:#64748b;font-family:'Inter',sans-serif;max-width:360px;">Your browser doesn't support inline PDF preview. Click below to open it.</p>
                <a href="${encodedPath}" target="_blank" style="background:linear-gradient(135deg,#2563eb,#4f46e5);color:#fff;padding:0.75rem 2rem;border-radius:10px;text-decoration:none;font-family:'Inter',sans-serif;font-weight:600;font-size:1rem;display:inline-flex;align-items:center;gap:0.5rem;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Certificate
                </a>
                <a href="${encodedPath}" download style="color:#2563eb;font-family:'Inter',sans-serif;font-size:0.9rem;">
                    <i class="fa-solid fa-download"></i> Download Certificate
                </a>
            </div>
        </object>`;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCertModal(event) {
    // If called from overlay click, only close if clicking the overlay itself
    if (event && event.target !== document.getElementById("certModal")) return;

    const modal = document.getElementById("certModal");
    clearTimeout(window._certFallbackTimer);
    modal.classList.remove("active");
    document.body.style.overflow = "";

    // Reset modal body after animation ends
    setTimeout(() => {
        document.querySelector(".cert-modal-body").innerHTML =
            '<iframe id="certIframe" src="" frameborder="0"></iframe>';
    }, 350);
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const modal = document.getElementById("certModal");
        if (modal && modal.classList.contains("active")) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
            setTimeout(() => { document.getElementById("certIframe").src = ""; }, 300);
        }
    }
});