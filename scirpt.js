/**
 * script.js — MGX Site Logic
 * Gom toàn bộ chức năng từ các trang: index, features, gallery, contact, blog
 */

const App = {
  // 🔹 Khởi tạo toàn bộ ứng dụng
  init: function () {
    this.pageFadeIn();
    this.toggleMenu();
    this.initLightbox();
    this.scrollReveal();
    this.initContactForm();
    this.initReviewGenerator(); // 👈 ĐÃ THÊM: Kích hoạt chức năng Review
    this.initBackToTop();
  },

  /**
   * 🌀 pageFadeIn() — Hiệu ứng mở trang
   */
  pageFadeIn: function () {
    document.body.classList.add("page-loaded");
  },

  /**
   * 📱 toggleMenu() — Đóng/mở menu di động
   */
  toggleMenu: function () {
    const menuToggle = document.getElementById("menu-toggle");
    const mainMenu = document.getElementById("main-menu");

    if (menuToggle && mainMenu) {
      menuToggle.addEventListener("click", () => {
        const isExpanded =
          menuToggle.getAttribute("aria-expanded") === "true" || false;
        mainMenu.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", !isExpanded);
      });

      // Đóng menu khi click vào link (mobile)
      mainMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          if (mainMenu.classList.contains("is-open")) {
            mainMenu.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
          }
        });
      });
    }
  },

  /**
   * 💡 initLightbox() — Hiển thị ảnh lớn trong Gallery
   */
  initLightbox: function () {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxClose = document.querySelector(".lightbox-close");

    if (!lightbox || !galleryItems.length) return;

    // Mở Lightbox
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const imgSrc = item.getAttribute("data-img");
        if (imgSrc) {
          lightboxImage.src = imgSrc;
          lightbox.classList.add("is-open");
          lightbox.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
        }
      });
    });

    // Đóng Lightbox
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open"))
        closeLightbox();
    });
  },

  /**
   * 🎞 scrollReveal() — Hiệu ứng cuộn mượt fade-in
   */
  scrollReveal: function () {
    const revealElements = document.querySelectorAll(".reveal");

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach((el) => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop < windowHeight * 0.8) {
          el.classList.add("is-visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
  },

  /**
   * ✉️ initContactForm() — Gửi email thật qua backend Node.js
   */
  initContactForm: function () {
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-contact-form");

    if (contactForm && submitBtn) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang gửi...";

        // 📩 Gửi dữ liệu tới backend (Node.js server)
        // Dùng đường dẫn tương đối (chỉ cần "/send-mail") nếu frontend
        // và backend chạy trên cùng một domain/port (được serve từ server.js)
        fetch("/send-mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert("✅ Gửi email thành công!");
              contactForm.reset();
            } else {
              alert("❌ Lỗi khi gửi email, thử lại sau.");
            }
            submitBtn.disabled = false;
            submitBtn.textContent = "Gửi Tin Nhắn";
          })
          .catch(() => {
            alert("⚠️ Kết nối server thất bại.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Gửi Tin Nhắn";
          });
      });
    }
  },

  /**
   * 🔍 initReviewGenerator() — Chức năng Tạo Review TỨC THÌ (KHÔNG MÔ PHỎNG)
   */
  initReviewGenerator: function () {
    const btn = document.getElementById("generate-review-btn");
    const reviewOutput = document.getElementById("review-output");
    const productInput = document.getElementById("product");

    if (btn) {
      btn.addEventListener("click", async () => {
        const product = productInput.value.trim();
        if (!product) {
          reviewOutput.textContent = "Vui lòng nhập tên hoặc mô tả sản phẩm!";
          return;
        }

        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = "Đang tạo Review...";
        reviewOutput.innerHTML = "Đang gửi yêu cầu tới server...";

        try {
          // GỌI FETCH THẬT (TỨC THÌ) ĐẾN ENDPOINT "/generate-review"
          const response = await fetch("/generate-review", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product: product }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            // Hiển thị review từ server (tức thì)
            reviewOutput.innerHTML = result.review.replace(/\n/g, "<br>");
          } else {
            reviewOutput.innerHTML = `❌ Lỗi Server: ${
              result.review || "Không thể tạo review."
            }`;
          }
        } catch (error) {
          console.error("Lỗi Fetch/Network:", error);
          reviewOutput.innerHTML =
            "❌ **Lỗi kết nối!** Vui lòng đảm bảo `server.js` đang chạy.";
        } finally {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      });
    }
  },

  /**
   * ⬆️ initBackToTop() — Nút quay lại đầu trang
   */
  initBackToTop: function () {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;

    const scrollFunction = () => {
      if (
        document.body.scrollTop > 300 ||
        document.documentElement.scrollTop > 300
      ) {
        backToTopButton.style.display = "block";
      } else {
        backToTopButton.style.display = "none";
      }
    };

    window.addEventListener("scroll", scrollFunction);
    backToTopButton.addEventListener("click", () => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
  },
};

// 🚀 Chạy App khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => App.init());
