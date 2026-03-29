// Custom Cursor & Antigravity Interactions

document.addEventListener('DOMContentLoaded', () => {

    // Sticky Navbar Scroll State
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // 0. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // 1. Custom Cursor Creation
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice) {
        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');
        document.body.appendChild(cursorDot);

        const cursorOutline = document.createElement('div');
        cursorOutline.classList.add('cursor-outline');
        document.body.appendChild(cursorOutline);

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Animate outline with delay for smooth trailing effect
        const animateCursor = () => {
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;

            outlineX += distX * 0.15;
            outlineY += distY * 0.15;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover state for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, .tilt-card, .calendar-day');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // 2. 3D Tilt Effect for specific cards
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (isTouchDevice) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. Dynamic Pricing Logic (if on plans page)
    const discountToggle = document.getElementById('discountToggle');
    if (discountToggle) {
        const prices = document.querySelectorAll('.dynamic-price');

        // Base prices setup
        const perWeekBase = 230;
        const per15DaysBase = 550;
        const perMonthBase = 1000;

        discountToggle.addEventListener('change', (e) => {
            const isDiscounted = e.target.checked;
            const multiplier = isDiscounted ? 0.8 : 1; // 20% off

            document.getElementById('price-week').innerText = Math.round(perWeekBase * multiplier);
            document.getElementById('price-15days').innerText = Math.round(per15DaysBase * multiplier);
            document.getElementById('price-month').innerText = Math.round(perMonthBase * multiplier);

            // Add a little pop animation when price changes
            prices.forEach(price => {
                price.parentElement.parentElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    price.parentElement.parentElement.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    // 4. Calorie Calculator Logic (Fitness Planner)
    const calorieForm = document.getElementById('calorieForm');
    if (calorieForm) {
        calorieForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const gender = document.getElementById('calc-gender').value;
            const age = parseInt(document.getElementById('calc-age').value);
            const weight = parseFloat(document.getElementById('calc-weight').value);
            const height = parseFloat(document.getElementById('calc-height').value);
            const activity = parseFloat(document.getElementById('calc-activity').value);
            const goal = document.getElementById('calc-goal').value;

            // Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }

            // Total Daily Energy Expenditure
            let tdee = bmr * activity;
            let targetCalories = tdee;

            // Apply Goal Adjustments
            if (goal === 'lose') {
                targetCalories = tdee - 500; // standard deficit
            } else if (goal === 'gain') {
                targetCalories = tdee + 500; // standard surplus
            }

            // Display Results
            const resultDiv = document.getElementById('plannerResults');
            const resultCalories = document.getElementById('result-calories');
            const resultMsg = document.getElementById('result-message');

            resultCalories.innerText = Math.round(targetCalories);

            if (goal === 'lose') {
                resultMsg.innerText = "This target puts you in a 500 kcal deficit. Stick to this to responsibly lose around 0.5kg/week.";
            } else if (goal === 'gain') {
                resultMsg.innerText = "This target puts you in a 500 kcal surplus. Combine with heavy lifting to build muscle effectively.";
            } else {
                resultMsg.innerText = "This is your maintenance caloric intake. Consume this amount daily to keep your current weight.";
            }

            // Animate display
            resultDiv.style.display = 'block';

        });
    }

    // 5. Free Trial Form
    const freeTrialForm = document.getElementById('freeTrialForm');
    if (freeTrialForm) {
        freeTrialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = freeTrialForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'PASS SECURED! 🤘';
            btn.style.background = '#FFD700';
            btn.style.color = '#000';
            btn.style.boxShadow = '0 10px 20px rgba(255, 215, 0, 0.4)';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.boxShadow = '';
                freeTrialForm.reset();
            }, 3000);
        });
    }

    // 6. Plan Enrollment Modal Logic
    const signupTriggers = document.querySelectorAll('.signup-trigger');
    const enrollmentModal = document.getElementById('enrollmentModal');

    if (enrollmentModal && signupTriggers.length > 0) {
        const closeModal = document.getElementById('closeModal');
        const modalPlanName = document.getElementById('modalPlanName');
        const modalPlanPrice = document.getElementById('modalPlanPrice');
        const hiddenPlanName = document.getElementById('hiddenPlanName');
        const hiddenPlanPrice = document.getElementById('hiddenPlanPrice');

        // Open Modal and Populate Data
        signupTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const planName = btn.getAttribute('data-plan');

                // Traverse DOM to find the specific price element within the same card
                const card = btn.closest('.plan-card');
                const priceElement = card.querySelector('.price');
                const priceValue = priceElement.innerText.trim();

                // Update UI
                modalPlanName.innerText = planName;
                modalPlanPrice.innerText = priceValue;

                // Update Hidden Inputs for Formspree
                hiddenPlanName.value = planName;
                hiddenPlanPrice.value = priceValue;

                // Show Modal
                enrollmentModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close Modal via X button
        closeModal.addEventListener('click', () => {
            enrollmentModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close Modal via clicking outside
        enrollmentModal.addEventListener('click', (e) => {
            if (e.target === enrollmentModal) {
                enrollmentModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });


        // Handle Form Submission smoothly via AJAX to prevent redirect
        const enrollmentForm = document.getElementById('enrollmentForm');
        if (enrollmentForm) {
            enrollmentForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const btn = enrollmentForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = 'PROCESSING...';

                const data = new FormData(enrollmentForm);

                try {
                    const response = await fetch(enrollmentForm.action, {
                        method: enrollmentForm.method,
                        body: data,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        btn.innerText = 'ENROLLMENT SECURED! 🤘';
                        btn.style.background = '#FFD700';
                        btn.style.color = '#000';
                        btn.style.boxShadow = '0 10px 20px rgba(255, 215, 0, 0.4)';

                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.style.background = '';
                            btn.style.color = '';
                            btn.style.boxShadow = '';
                            enrollmentForm.reset();
                            const modalToClose = document.getElementById('enrollmentModal');
                            if (modalToClose) {
                                modalToClose.classList.remove('active');
                            }
                            document.body.style.overflow = '';
                        }, 1500);
                    } else {
                        btn.innerText = 'ERROR. TRY AGAIN.';
                        setTimeout(() => btn.innerText = originalText, 2000);
                    }
                } catch (error) {
                    btn.innerText = 'NETWORK ERROR.';
                    setTimeout(() => btn.innerText = originalText, 2000);
                }
            });
        }
    }

    // 7. Smooth Scrolling
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for fixed navbar
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 8. Coach Modal Logic
    const coachModalTrigger = document.getElementById('coachModalTrigger');
    const coachModal = document.getElementById('coachModal');
    if (coachModalTrigger && coachModal) {
        const closeCoachModal = document.getElementById('closeCoachModal');

        coachModalTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            coachModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeCoachModal.addEventListener('click', () => {
            coachModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        coachModal.addEventListener('click', (e) => {
            if (e.target === coachModal) {
                coachModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        //test
    }

    // 9. Global Loading Screen Logic
    const loader = document.getElementById('global-loader');
    if (loader) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling during load
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';

            // Remove completely from DOM after fade to prevent interaction blocking
            setTimeout(() => {
                const l = document.getElementById('global-loader');
                if (l) l.remove();
            }, 600);
        }, 1200);
    }

});
