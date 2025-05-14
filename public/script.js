// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("mobile-menu")
  const navMenu = document.querySelector(".nav-menu")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }

  // Close menu when clicking on a nav link
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Testimonial Slider
  const testimonials = document.querySelectorAll(".testimonial")
  const prevBtn = document.getElementById("prev-testimonial")
  const nextBtn = document.getElementById("next-testimonial")

  if (testimonials.length > 0 && prevBtn && nextBtn) {
    let currentTestimonial = 0

    // Show the first testimonial
    testimonials[currentTestimonial].classList.add("active")

    // Function to show a specific testimonial
    function showTestimonial(index) {
      testimonials.forEach((testimonial) => {
        testimonial.classList.remove("active")
      })
      testimonials[index].classList.add("active")
    }

    // Previous button click
    prevBtn.addEventListener("click", () => {
      currentTestimonial--
      if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1
      }
      showTestimonial(currentTestimonial)
    })

    // Next button click
    nextBtn.addEventListener("click", () => {
      currentTestimonial++
      if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0
      }
      showTestimonial(currentTestimonial)
    })

    // Auto slide every 5 seconds
    setInterval(() => {
      currentTestimonial++
      if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0
      }
      showTestimonial(currentTestimonial)
    }, 5000)
  }

  // Region Filter for Destinations Page
  const regionsList = document.getElementById("regions-list")
  const destinationsGrid = document.getElementById("destinations-grid")

  if (regionsList && destinationsGrid) {
    const regionItems = document.querySelectorAll(".regions-list li")
    const destinationCards = document.querySelectorAll(".destination-card")

    regionItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Remove active class from all items
        regionItems.forEach((i) => i.classList.remove("active"))

        // Add active class to clicked item
        item.classList.add("active")

        // Get the region data attribute
        const region = item.getAttribute("data-region")

        // Filter destinations
        destinationCards.forEach((card) => {
          if (region === "all" || card.getAttribute("data-region") === region) {
            card.style.display = "block"
          } else {
            card.style.display = "none"
          }
        })
      })
    })
  }

  // FAQ Accordion
  const accordionItems = document.querySelectorAll(".accordion-item")

  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header")

      header.addEventListener("click", () => {
        // Toggle active class on the clicked item
        item.classList.toggle("active")

        // Close other accordion items
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active")
          }
        })
      })
    })
  }

  // Form Validation
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Simple validation
      let valid = true
      const inputs = contactForm.querySelectorAll("input, textarea")

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          valid = false
          input.style.borderColor = "var(--danger)"
        } else {
          input.style.borderColor = "var(--gray-dark)"
        }
      })

      if (valid) {
        // Show success message (in a real app, you would send the form data to a server)
        alert("Thank you for your message! We will get back to you soon.")
        contactForm.reset()
      } else {
        alert("Please fill in all required fields.")
      }
    })
  }

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const emailInput = document.getElementById("email")
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (emailPattern.test(emailInput.value)) {
        alert("Thank you for subscribing to our newsletter!")
        newsletterForm.reset()
      } else {
        alert("Please enter a valid email address.")
        emailInput.style.borderColor = "var(--danger)"
      }
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      if (href !== "#") {
        e.preventDefault()

        const targetElement = document.querySelector(href)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Add active class to current page nav link
  const currentLocation = window.location.pathname
  const navLinksCurrentPage = document.querySelectorAll(".nav-menu a")

  navLinksCurrentPage.forEach((link) => {
    if (link.getAttribute("href") === currentLocation) {
      link.classList.add("active")
    }
  })
})

// search bar function
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const query = input.value.trim();
      if (!query) return;

      // Redirect to details.html with name in URL
      window.location.href = `details.html?name=${encodeURIComponent(query)}`;
    });
  }
});



