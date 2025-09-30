const cursor = document.createElement("div");
const carousels = document.querySelectorAll(".game-carousel");
let prevX = 0, prevY = 0;

cursor.classList.add("cursor");
document.body.appendChild(cursor);
document.addEventListener("mouseleave", () => cursor.style.display = "none");
document.addEventListener("mouseenter", () => cursor.style.display = "block");
document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    cursor.style.display = "block";
    prevX = e.clientX;
    prevY = e.clientY;
});

window.addEventListener("resize", (e) => cursor.style.display = "none");

document.addEventListener("mousedown", (e) => {
    const ripple = document.createElement("div");
    ripple.classList.add("ripple");
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
        ripple.remove();
    });
});

const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
        if (!entry.isIntersecting || entry.target.classList.contains('show'))
            continue;
        entry.target.classList.add("show");
    }
});

document.querySelectorAll('.game-card').forEach(card => {
    observer.observe(card);
});

for (const carousel of carousels) {
    const leftBtn = carousel.querySelector(".scroll-button.left");
    const rightBtn = carousel.querySelector(".scroll-button.right");

    if (!leftBtn || !rightBtn)
        continue;

    carousel.scrollLeft <= 0 ? leftBtn.disabled = true : leftBtn.disabled = false;
    carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth ? rightBtn.disabled = true : rightBtn.disabled = false

    leftBtn.addEventListener("click", () => {
        carousel.scrollBy({ left: -(50 / 100) * window.innerWidth, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
        carousel.scrollBy({ left: (50 / 100) * window.innerWidth, behavior: "smooth" });
    });

    carousel.addEventListener("scroll", () => {
        carousel.scrollLeft <= 0 ? leftBtn.disabled = true : leftBtn.disabled = false;
        carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth ? rightBtn.disabled = true : rightBtn.disabled = false
    });

    window.addEventListener("resize", () => {
        carousel.scrollLeft <= 0 ? leftBtn.disabled = true : leftBtn.disabled = false;
        carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth ? rightBtn.disabled = true : rightBtn.disabled = false
    });
}

if (navigator.getBattery) 
    navigator.getBattery().then((battery) => {
        const batteryElem = document.getElementById("battery-level");
        batteryElem.textContent = Math.round(battery.level * 100) + "%";
        batteryElem.addEventListener("levelchange", () => batteryElem.textContent = Math.round(battery.level * 100) + "%");
    });