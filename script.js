// Page Loader & Image Load Handling
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        ScrollTrigger.refresh();
    }
}

// Refresh ScrollTrigger when images load to prevent height-shifting glitches
window.addEventListener('load', () => {
    hideLoader();
    setTimeout(() => ScrollTrigger.refresh(), 500);
});

// Watch for any late-loading images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => ScrollTrigger.refresh());
});

// Fallback for loader
setTimeout(hideLoader, 4000);

// Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.1, // Slightly snappier
    touchMultiplier: 1.5,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

gsap.ticker.lagSmoothing(0);

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor (Ultra Smooth Implementation using gsap.quickSetter)
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveEls = document.querySelectorAll('a, button, .menu-toggle, input, textarea, .magnetic-btn');

gsap.set(cursor, {xPercent: -50, yPercent: -50});
gsap.set(follower, {xPercent: -50, yPercent: -50});

let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let pos = { x: mouseX, y: mouseY };

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor movement
    gsap.set(cursor, { x: mouseX, y: mouseY });
});

// Smooth follower using ticker
gsap.ticker.add(() => {
    // Delta ratio ensures consistent speed across different refresh rates
    const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
    
    pos.x += (mouseX - pos.x) * dt;
    pos.y += (mouseY - pos.y) * dt;
    
    gsap.set(follower, { x: pos.x, y: pos.y });
});

interactiveEls.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        follower.classList.add('hovered');
    });
    link.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered');
    });
});

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    
    // Update Particles JS color
    if (window.pJSDom && window.pJSDom.length > 0) {
        const pJS = window.pJSDom[0].pJS;
        if(newTheme === 'light') {
            pJS.particles.color.value = "#0071e3";
            pJS.particles.line_linked.color = "#5e5ce6";
        } else {
            pJS.particles.color.value = "#00f0ff";
            pJS.particles.line_linked.color = "#8a2be2";
        }
        pJS.fn.particlesRefresh();
    }
});

// Magnetic Buttons
const magneticEls = document.querySelectorAll('.magnetic-btn');

magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const h = rect.width / 2;
        
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - h;

        gsap.to(el, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.5,
            ease: "power3.out",
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Particles.js Initialization
particlesJS('particles-js', {
    particles: {
        number: { value: 50, density: { enable: true, value_area: 1000 } },
        color: { value: '#00f0ff' }, 
        shape: { type: 'circle' },
        opacity: { value: 0.4, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 130,
            color: '#8a2be2',
            opacity: 0.3,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            grab: { distance: 150, line_linked: { opacity: 0.7 } },
            push: { particles_nb: 2 }
        }
    },
    retina_detect: true
});

// Three.js Floating Shapes Background
const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Premium Geometries
const geometries = [
    new THREE.IcosahedronGeometry(1.2, 1),
    new THREE.TorusKnotGeometry(0.8, 0.2, 64, 16),
    new THREE.OctahedronGeometry(1.5, 0),
    new THREE.TetrahedronGeometry(1.2, 0)
];

const shapes = [];

// Sleek Metallic Materials
const mat1 = new THREE.MeshPhysicalMaterial({
    color: 0x8a2be2, 
    emissive: 0x1a0030,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.85,
    wireframe: true
});

const mat2 = new THREE.MeshPhysicalMaterial({
    color: 0x00f0ff, 
    emissive: 0x002030,
    roughness: 0.2,
    metalness: 0.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.6
});

const mat3 = new THREE.MeshPhysicalMaterial({
    color: 0xff3366, 
    emissive: 0x300010,
    roughness: 0.3,
    metalness: 0.8,
    transparent: true,
    opacity: 0.7,
    wireframe: true
});

const materials = [mat1, mat2, mat3];

for (let i = 0; i < 20; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const mat = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geo, mat);
    
    // Spread widely for fullscreen feel
    mesh.position.x = (Math.random() - 0.5) * 30;
    mesh.position.y = (Math.random() - 0.5) * 30;
    mesh.position.z = (Math.random() - 0.5) * 20 - 10;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    const scale = Math.random() * 0.8 + 0.3;
    mesh.scale.set(scale, scale, scale);
    
    mesh.userData = {
        rotSpeed: {
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.005
        },
        floatSpeed: Math.random() * 0.008 + 0.002,
        floatOffset: Math.random() * Math.PI * 2
    };
    
    scene.add(mesh);
    shapes.push(mesh);
}

// Cinematic Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

const pointLight = new THREE.PointLight(0x00f0ff, 3, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x8a2be2, 3, 50);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

camera.position.z = 12;

// Smooth Parallax
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Track for Three.js effect independent of cursor smoothing
document.addEventListener('mousemove', (event) => {
    targetX = (event.clientX - windowHalfX) * 0.0015;
    targetY = (event.clientY - windowHalfY) * 0.0015;
});

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    shapes.forEach(shape => {
        shape.rotation.x += shape.userData.rotSpeed.x;
        shape.rotation.y += shape.userData.rotSpeed.y;
        shape.rotation.z += shape.userData.rotSpeed.z;
        
        // Gentle float
        shape.position.y += Math.sin(time * shape.userData.floatSpeed * 50 + shape.userData.floatOffset) * 0.005;
    });

    // Smooth camera lerp
    currentX += (targetX - currentX) * 0.02;
    currentY += (-targetY - currentY) * 0.02;

    camera.position.x = currentX * 10;
    camera.position.y = currentY * 10;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    ScrollTrigger.refresh();
});

// Typing Effect
const roles = [
    "Web Developer",
    "AI Enthusiast",
    "Robotics Builder",
    "Open Source Contributor",
    "Tech Innovator"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingText = document.getElementById("typing-text");

function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = 2500; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500; // Pause before next word
    }

    setTimeout(type, speed);
}
setTimeout(type, 3000); // Start typing after loader finishes

// Navbar Scroll & Mobile Menu
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Scroll Progress Bar
gsap.to('.scroll-progress-bar', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1
    }
});

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Split Hero Title into letters
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const titleText = heroTitle.textContent;
    heroTitle.textContent = '';
    for (let char of titleText) {
        const span = document.createElement('span');
        span.textContent = char;
        if (char === ' ') span.innerHTML = '&nbsp;';
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(20px)';
        heroTitle.appendChild(span);
    }
    // Remove gs-hero from hero-title to animate separately
    heroTitle.classList.remove('gs-hero');
}

// Hero Animation Timeline
const tl = gsap.timeline({delay: 2.2});

// Slide up the title container
tl.to('.hero-title', {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "expo.out"
}, 0);

// Stagger the letters to appear one by one with a cinematic fade
tl.to('.hero-title span', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
}, 0.2);

// Animate the remaining hero elements
tl.to('.gs-hero', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.15,
    ease: "expo.out"
}, 1.2);

// Scroll Reveal Animations - Global
const revealElements = document.querySelectorAll('.gs-reveal');
revealElements.forEach((element) => {
    gsap.fromTo(element, 
        { y: 80, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" } }
    );
});

// About Section Side-by-Side Transitions
const revealLefts = document.querySelectorAll('.gs-reveal-left');
revealLefts.forEach((el) => {
    gsap.fromTo(el, 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" } }
    );
});

const revealRights = document.querySelectorAll('.gs-reveal-right');
revealRights.forEach((el) => {
    gsap.fromTo(el, 
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" } }
    );
});

// Skills Fill Automation
const skillBars = document.querySelectorAll('.skill-progress-fill');

skillBars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    gsap.to(bar, {
        width: width,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: bar,
            start: "top 90%",
            once: true
        }
    });
});

// Counter Animation
const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    
    ScrollTrigger.create({
        trigger: counter,
        start: "top 85%",
        once: true,
        onEnter: () => {
            gsap.to(counter, {
                innerHTML: target,
                duration: 2.5,
                snap: { innerHTML: 1 },
                ease: "power2.out"
            });
        }
    });
});

// Initialize Vanilla Tilt explicitly for precision
VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.1,
    scale: 1.02,
    easing: "cubic-bezier(.03,.98,.52,.99)"
});

// Footer Year and Back to Top
document.getElementById('year').textContent = new Date().getFullYear();

const backToTopBtn = document.getElementById('backToTop');
backToTopBtn.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 800) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
        
        // Ensure cursor styling resets if clicking backToTop
        backToTopBtn.classList.remove('hovered');
        cursor.classList.remove('hovered');
        follower.classList.remove('hovered'); 
    }
});

// Form Sub (Demo)
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-submit');
    const originalContent = btn.innerHTML;
    
    btn.innerHTML = '<span style="position:relative; z-index: 2;">Message Sent! <i class="fas fa-check"></i></span>';
    
    e.target.reset();
    
    setTimeout(() => {
        btn.innerHTML = originalContent;
    }, 4000);
});
