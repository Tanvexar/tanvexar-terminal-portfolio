/* ================= MENU TOGGLE ================= */
function toggleMenu() {
    let menu = document.getElementById("menu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

/* ================= TIME API ================= */

async function getTime() {

    try {

        let response =
            await fetch(
                "https://worldtimeapi.org/api/ip"
            );

        let data =
            await response.json();

        document.getElementById("time").innerText =
            data.datetime;

    }

    catch (err) {

        console.log(
            "Time API failed"
        );

    }

}

/* AUTO REFRESH */
setInterval(getTime, 10000);

/* FIRST LOAD */
getTime();

/* ================= HERO TYPING ================= */
function getGreeting() {
    let hour = new Date().getHours();

    if (hour < 12) return "Good Morning.... I'm Tanvexar.";
    else if (hour < 18) return "Good Afternoon.... I'm Tanvexar.";
    else return "Good Evening.... I'm Tanvexar.";
}

let i = 0;
let text = getGreeting();
let aiMode = false;

function typingEffect() {

    let terminal = document.getElementById("typing");

    if (i === 0) terminal.textContent = "root@Tanvexar:~$ ";

    if (i < text.length) {

        terminal.textContent += text.charAt(i);
        i++;

        setTimeout(typingEffect, 40);

    } else {

        setTimeout(() => {

            i = 0;
            text = getGreeting();
            terminal.textContent = "";

            typingEffect();

        }, 1500);
    }
}

typingEffect();

/* ================= INITIAL STATE ================= */
function setInitialReconState() {

    document.getElementById("ip").textContent = "Scanning...";
    document.getElementById("browser").textContent = "Detecting...";
    document.getElementById("os").textContent = "Detecting...";
    document.getElementById("device").textContent = "Detecting...";
    document.getElementById("resolution").textContent = "Detecting...";
    document.getElementById("battery").textContent = "Checking...";
    document.getElementById("ram").textContent = "Detecting...";
    document.getElementById("timezone").textContent = "Detecting...";
    document.getElementById("touch").textContent = "Detecting...";
    document.getElementById("connection").textContent = "Detecting...";
}

setInitialReconState();

/* ================= TERMINAL ================= */
const output = document.getElementById("terminal-output");
const sound = document.getElementById("typeSound");
const welcomeSound = document.getElementById("welcomeSound");
/* let audioUnlocked = sessionStorage.getItem("audioUnlocked") === "true"; */
let hintShown = !sessionStorage.getItem("hintShown");


let audioUnlocked = false;

document.addEventListener("click", () => {

    if (audioUnlocked) return;
    if (!welcomeSound) return;

    welcomeSound.play()
        .then(() => {
            welcomeSound.pause();
            welcomeSound.currentTime = 0;
            audioUnlocked = true;
         sessionStorage.setItem("audioUnlocked", "true");   
        })
        .catch(() => {});

}, { once: true });

function unlockAudio() {
    if (!welcomeSound) return;

    welcomeSound.play().then(() => {
        welcomeSound.pause();
        welcomeSound.currentTime = 0;
    }).catch(() => {});
}

document.addEventListener("click", () => {
    let hint = document.getElementById("audio-hint");
    if (hint) hint.style.display = "none";
}, { once: true });

document.addEventListener("click", (e) => {

    // 1. unlock audio
    unlockAudio();

    // 2. hide hint
    let hint = document.getElementById("audio-hint");
    if (hint) hint.style.display = "none";

    // 3. save state (so next time no hint)
    sessionStorage.setItem("hintShown", "true");

}, { once: true });


/* LOCK SCREEN */
let lockScreen = `
<div style="color:#00ff00;">[ SYSTEM LOCKED ]</div>
<div style="color:red;">Click inside terminal to initialize...</div>
`;

output.innerHTML = lockScreen;

/* SOUND */
function startTypingSound() {

    if (!sound) return;

    sound.volume = 0.2;
    sound.loop = true;
    sound.currentTime = 0;

    sound.play().catch(() => {});
}

function stopTypingSound() {

    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
}

/* ================= TYPE LINE ================= */
function typeLine(text, speed = 3) {

    return new Promise(resolve => {

        let i = 0;

        let line = document.createElement("div");
        output.appendChild(line);

        function typing() {

            if (i < text.length) {

                line.innerHTML += text[i++];
                output.scrollTop = output.scrollHeight;

                setTimeout(typing, speed);

            } else {

                resolve();
            }
        }

        typing();
    });
}

/* ================= GLITCH ================= */
function glitchText(text) {

    let chars = "!@#$%^&*";

    return text.split("").map(c =>
        Math.random() < 0.1
            ? chars[Math.floor(Math.random() * chars.length)]
            : c
    ).join("");
}

function triggerGlitch() {

    let glitch = document.getElementById("glitch");

    glitch.classList.add("active");

    setTimeout(() => {
        glitch.classList.remove("active");
    }, 100);
}

/* ================= RECON ================= */
async function startRecon() {

    await typeLine("[+] Initializing Recon...");
    await typeLine(glitchText("[+] Bypassing Firewall..."), 2);

    triggerGlitch();

    await typeLine("[+] Scanning Device...");
    await typeLine("[+] Fetching IP...");
    await typeLine("[✔] System Access Ready");
    await typeLine("[+] Finalizing...");
    await typeLine("[✔] Access Granted");

    loadReconData();

    stopTypingSound();

    let screen = document.getElementById("access-screen");

    screen.classList.add("show");

    setTimeout(() => {
        screen.classList.remove("show");
    }, 2000);
}

/* ================= CLICK START ================= */
const terminalElement = document.querySelector(".terminal");

if (terminalElement) {

    terminalElement.addEventListener("click", () => {

        startTypingSound();

        output.innerHTML = "";

        startRecon();
        loadReconData();

    }, { once: true });

}

/* ================= LOAD DATA ================= */
function loadReconData() {

    document.getElementById("browser").textContent =
        navigator.userAgent.includes("Chrome") ? "Chrome" : "Unknown";

    document.getElementById("os").textContent =
        navigator.userAgent.includes("Win") ? "Windows" : "Unknown";

    document.getElementById("device").textContent =
        /Mobi|Android/i.test(navigator.userAgent)
            ? "Mobile"
            : "Desktop";

    document.getElementById("resolution").textContent =
        `${window.screen.width} x ${window.screen.height}`;

    fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => {
            document.getElementById("ip").textContent = data.ip;
        });

    document.getElementById("ram").textContent =
        navigator.deviceMemory
            ? navigator.deviceMemory + " GB"
            : "Unknown";

    document.getElementById("timezone").textContent =
        Intl.DateTimeFormat().resolvedOptions().timeZone;

    document.getElementById("touch").textContent =
        ('ontouchstart' in window || navigator.maxTouchPoints > 0)
            ? "Yes"
            : "No";

    document.getElementById("connection").textContent =
        navigator.connection
            ? navigator.connection.effectiveType.toUpperCase()
            : "Unknown";

    if (navigator.getBattery) {

        navigator.getBattery().then(battery => {

            function updateBattery() {

                let level = Math.floor(battery.level * 100);

                let status = battery.charging
                    ? "Charging ⚡"
                    : "Not Charging";

                document.getElementById("battery").textContent =
                    `${level}% (${status})`;
            }

            updateBattery();

            battery.addEventListener("levelchange", updateBattery);
            battery.addEventListener("chargingchange", updateBattery);

        }).catch(() => {

            document.getElementById("battery").textContent =
                "Not Supported";
        });

    } else {

        document.getElementById("battery").textContent =
            "No Battery (Desktop)";
    }
}

/* ================= MATRIX ================= */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01";
const fontSize = 14;

const columns = canvas.width / fontSize;

const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {

    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {

        let text = letters[Math.floor(Math.random() * letters.length)];

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (
            drops[i] * fontSize > canvas.height &&
            Math.random() > 0.975
        ) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

/* ================= BOOT SYSTEM ================= */
const bootScreen = document.getElementById("boot-screen");
const bootText = document.getElementById("boot-text");

if (!sessionStorage.getItem("hintShown")) {
    document.addEventListener("DOMContentLoaded", () => {
        let hint = document.getElementById("audio-hint");
        if (hint) hint.style.display = "block";
    });
} else {
    document.addEventListener("DOMContentLoaded", () => {
        let hint = document.getElementById("audio-hint");
        if (hint) hint.style.display = "none";
    });
}

bootText.style.whiteSpace = "pre";
bootText.style.fontFamily = "monospace";

const bootLines = [
    /*"[ SYSTEM ] Awaiting user interaction...",
    "[ ACTION REQUIRED ] Click anywhere to initialize audio subsystem", */
    "[ OK ] Initializing BIOS...",
    "[ OK ] Checking Hardware...",
    "[ OK ] Loading Kernel...",
    "[ OK ] Mounting File System...",
    "[ OK ] Starting Network...",
    "[ OK ] Accessing Memory...",
    "[ OK ] Booting Tanvexar OS...",
    "",
    "SYSTEM READY",
    "Entering Interface..."
];

const banner = `
████████╗ █████╗ ███╗   ██╗██╗   ██╗███████╗██╗  ██╗ █████╗ ██████╗
╚══██╔══╝██╔══██╗████╗  ██║██║   ██║██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗
   ██║   ███████║██╔██╗ ██║██║   ██║█████╗   ╚███╔╝ ███████║██████╔╝
   ██║   ██╔══██║██║╚██╗██║╚██╗ ██╔╝██╔══╝   ██╔██╗ ██╔══██║██╔══██╗
   ██║   ██║  ██║██║ ╚████║ ╚████╔╝ ███████╗██╔╝ ██╗██║  ██║██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝

> Welcome to Tanvexar World
> VAPT | Security Researcher | Red Team Aspirant 
`;

function typeBootLine(text, speed = 15) {

    return new Promise(resolve => {

        let line = document.createElement("div");

        bootText.appendChild(line);

        let i = 0;

        function typing() {

            if (i < text.length) {

                line.textContent += text[i++];

                setTimeout(typing, speed);

            } else {

                resolve();
            }
        }

        typing();
    });
}

async function showBannerBoot() {

    let lines = banner.split("\n");

    for (let line of lines) {

        await typeBootLine(line, 10);

        await new Promise(r => setTimeout(r, 80));
    }
}

async function startBoot() {

    for (let line of bootLines) {

        await typeBootLine(line);

if (line.includes("Entering Interface...")) {

    if (welcomeSound) {

        welcomeSound.currentTime = 0;
        welcomeSound.volume = 1;

       try {
    welcomeSound.currentTime = 0;
    welcomeSound.volume = 1;

    const playPromise = welcomeSound.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {});
    }
} catch (e) {}
    }
}
        await new Promise(r => setTimeout(r, 150));
    }

    await showBannerBoot();

    setTimeout(() => {

        bootScreen.classList.add("hide");

        setTimeout(() => {
            bootScreen.style.display = "none";
        }, 1000);

    }, 1200);
}

window.addEventListener("load", () => {

    const alreadyLoaded = sessionStorage.getItem("bootShown");

    if (alreadyLoaded) {

        bootScreen.style.display = "none";
        return;
    }

    sessionStorage.setItem("bootShown", "true");

    startBoot();
});

/* ================= COMMAND SYSTEM ================= */
const input = document.getElementById("terminal-input");

if (terminalElement) {

    terminalElement.addEventListener("click", () => {
        input.focus();
    });
}

input.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {

        let command = input.value.trim().toLowerCase();

        printCommand(command);

        if (aiMode && command.startsWith("ai")) {

            aiResponse(command);

        } else if (
            aiMode &&
            (command === "1" || command === "2" || command === "3")
        ) {

            aiResponse(command);

        } else {

            handleCommand(command);
        }

        input.value = "";
    }
});

function printCommand(cmd) {

    let line = document.createElement("div");

    line.innerHTML =
        `<span style="color:#00ff00;">root@tanvexar:~$</span> ${cmd}`;

    output.appendChild(line);
}

/* ================= COMMANDS ================= */
function handleCommand(cmd) {

    switch(cmd) {

        case "help":

            printOutput(`
help
whoami
clear
projects
ip
restart
ps
top
ai boot
snake
            `);

        break;

        case "ai boot":
        case "ai":

            aiMode = true;

            startAIBoot();

        break;

        case "whoami":

            printOutput(
                "Tanvexar \n VAPT | Security Researcher | Red Team Aspirant"
            );

        break;

        case "projects":

            printOutput(`
[1] Port Scanner
[2] Privilege Escalation Lab
[3] LazyAdmin Exploit
            `);

        break;

        case "ip":

            printOutput(
                "Your IP: " +
                document.getElementById("ip").textContent
            );

        break;

        case "clear":

            output.innerHTML = "";

            return;

        case "ps":
        case "top":

            showProcesses();

        break;

        case "restart":

            printOutput("[ RESTARTING SYSTEM... ]");

            setTimeout(() => {

                sessionStorage.removeItem("bootShown");

                location.reload();

            }, 1000);

        break;

        case "snake":
            startSnakeGame();
            break;

        case "":

            return;

        default:

            printOutput("Command not found ❌");
    }
}

function printOutput(text) {

    let line = document.createElement("div");

    line.innerHTML = text.replace(/\n/g, "<br>");

    output.appendChild(line);

    output.scrollTop = output.scrollHeight;
}

/* ================= FAKE PROCESSES ================= */
let fakeProcesses = [
    { name: "chrome.exe", cpu: 12 },
    { name: "matrix.js", cpu: 3 },
    { name: "recon.service", cpu: 41 },
    { name: "ui.renderer", cpu: 18 },
    { name: "system.idle", cpu: 8 }
];

function updateFakeProcesses() {

    fakeProcesses = fakeProcesses.map(p => {

        return {
            name: p.name,
            cpu: Math.floor(Math.random() * 60) + 1
        };
    });
}

function showProcesses() {

    updateFakeProcesses();

    let out = "\n[ SYSTEM PROCESS LIST ]\n\n";

    fakeProcesses.forEach(p => {

        out += `[SYS] ${p.name.padEnd(18)} CPU: ${p.cpu}%\n`;
    });

    printOutput(out);
}

/* ================= AI BOOT ================= */
function startAIBoot() {

    printOutput(`
[ AI SYSTEM INITIALIZING... ]
[ OK ] AI MODE ACTIVE

Choose:
1. whoami
2. system
3. hacking

Type: ai 1 / ai 2 / ai 3
    `);
}

function aiResponse(cmd) {

    switch(cmd) {

        case "ai 1":
        case "1":

            printOutput(`
[QUERY] whoami

[AI RESPONSE]
You are interacting with Tanvexar Terminal Simulation Engine.
            `);

        break;

        case "ai 2":
        case "2":

            printOutput(`
[QUERY] system

[AI RESPONSE]
This is a browser-based OS simulation environment.
            `);

        break;

        case "ai 3":
        case "3":

            printOutput(`
[QUERY] hacking

[AI RESPONSE]
No real hacking. This is a visual simulation.
            `);

        break;

        default:

            printOutput("[AI] Query not recognized.");
    }
}

/* ================= LIVE CLOCK ================= */
function updateLiveClock() {

    let now = new Date();

    let time = now.toLocaleTimeString();

    document.getElementById("liveClock").textContent =
        "SYSTEM TIME :: " + time;
}

setInterval(updateLiveClock, 1000);

updateLiveClock();

/* ================= SNAKE GAME ================= */

/* ================= SNAKE GAME ================= */

const snakeContainer = document.getElementById("snake-container");
const snakeCanvas = document.getElementById("snakeGame");
const snakeCtx = snakeCanvas.getContext("2d");

const snakeScore = document.getElementById("snake-score");
const closeSnake = document.getElementById("closeSnake");

const box = 20;

let snake = [];
let food = {};

let score = 0;
let direction = "RIGHT";

let gameLoop = null;

/* ================= START GAME ================= */
function startSnakeGame() {

    clearInterval(gameLoop);

    snakeContainer.style.display = "block";

    snake = [
        { x: 10 * box, y: 10 * box }
    ];

    direction = "RIGHT";

    score = 0;

    snakeScore.textContent = "SCORE: 0";

    food = {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box
    };

    gameLoop = setInterval(drawSnakeGame, 120);
}

/* ================= DRAW GAME ================= */
function drawSnakeGame() {

    snakeCtx.clearRect(
        0,
        0,
        snakeCanvas.width,
        snakeCanvas.height
    );

    snakeCtx.fillStyle = "black";

    snakeCtx.fillRect(
        0,
        0,
        snakeCanvas.width,
        snakeCanvas.height
    );

    /* FOOD */
    snakeCtx.fillStyle = "red";

    snakeCtx.fillRect(
        food.x,
        food.y,
        box,
        box
    );

    /* DRAW SNAKE */
    for (let i = 0; i < snake.length; i++) {

        snakeCtx.fillStyle =
            i === 0 ? "#00ff00" : "#008000";

        snakeCtx.fillRect(
            snake[i].x,
            snake[i].y,
            box,
            box
        );
    }

    /* HEAD POSITION */
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    /* MOVE */
    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    /* GAME OVER WALL */
    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= snakeCanvas.width ||
        snakeY >= snakeCanvas.height
    ) {

        clearInterval(gameLoop);

        snakeContainer.style.display = "none";

        printOutput(
            "[ GAME OVER ] SCORE: " + score
        );

        return;
    }

    /* NEW HEAD */
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    /* SELF COLLISION */
    for (let i = 0; i < snake.length; i++) {

        if (
            newHead.x === snake[i].x &&
            newHead.y === snake[i].y
        ) {

            clearInterval(gameLoop);

            snakeContainer.style.display = "none";

            printOutput(
                "[ GAME OVER ] SCORE: " + score
            );

            return;
        }
    }

    /* FOOD CHECK */
    if (
        snakeX === food.x &&
        snakeY === food.y
    ) {

        score++;

        snakeScore.textContent =
            "SCORE: " + score;

        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };

    } else {

        snake.pop();
    }

    /* ADD HEAD */
    snake.unshift(newHead);
}

/* ================= KEYBOARD CONTROLS ================= */
document.addEventListener("keydown", e => {

    if (
        e.key === "ArrowLeft" &&
        direction !== "RIGHT"
    ) {
        direction = "LEFT";
    }

    else if (
        e.key === "ArrowUp" &&
        direction !== "DOWN"
    ) {
        direction = "UP";
    }

    else if (
        e.key === "ArrowRight" &&
        direction !== "LEFT"
    ) {
        direction = "RIGHT";
    }

    else if (
        e.key === "ArrowDown" &&
        direction !== "UP"
    ) {
        direction = "DOWN";
    }
});

/* ================= MOBILE SWIPE ================= */
let touchStartX = 0;
let touchStartY = 0;

snakeCanvas.addEventListener("touchstart", e => {

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

snakeCanvas.addEventListener("touchmove", e => {

    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {

        if (
            dx > 0 &&
            direction !== "LEFT"
        ) {
            direction = "RIGHT";
        }

        else if (
            dx < 0 &&
            direction !== "RIGHT"
        ) {
            direction = "LEFT";
        }

    } else {

        if (
            dy > 0 &&
            direction !== "UP"
        ) {
            direction = "DOWN";
        }

        else if (
            dy < 0 &&
            direction !== "DOWN"
        ) {
            direction = "UP";
        }
    }
});

/* ================= CLOSE BUTTON ================= */
closeSnake.addEventListener("click", () => {

    clearInterval(gameLoop);

    snakeContainer.style.display = "none";

    printOutput(
        "[ SNAKE GAME TERMINATED ]"
    );
});

/* ================= GITHUB PROJECT SLIDER ================= */

/* ================= PROJECT SLIDER ================= */

/* ================= PROJECT SLIDER ================= */

const projectsContainer =
    document.getElementById("projects-container");

const dotsContainer =
    document.getElementById("project-dots");

const prevBtn =
    document.getElementById("prevProject");

const nextBtn =
    document.getElementById("nextProject");

let currentSlide = 0;

/* ================= LOAD PROJECTS ================= */

async function loadGitHubProjects() {

    try {

        const response =
            await fetch(
                "https://api.github.com/users/Tanvexar/repos"
            );

        const repos = await response.json();

        projectsContainer.innerHTML = "";

        repos.reverse().forEach((repo) => {

            const card =
                document.createElement("div");

            card.classList.add("project-card");

            card.innerHTML = `
                <h3>${repo.name}</h3>

                <p>
                    ${repo.description || "No description available."}
                </p>

                <a href="${repo.html_url}"
                   target="_blank"
                   rel="noopener noreferrer">

                    ACCESS REPO
                </a>
            `;

            projectsContainer.appendChild(card);
        });

        createDots();

        currentSlide = 0;

        updateSlider();

    } catch (err) {

        console.log(
            "GitHub fetch error:",
            err
        );
    }
}

/* ================= CREATE DOTS ================= */

function createDots() {

    dotsContainer.innerHTML = "";

    const cards =
        document.querySelectorAll(".project-card");

    cards.forEach((_, index) => {

        const dot =
            document.createElement("span");

        dot.classList.add("project-dot");

        if (index === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {

            currentSlide = index;

            updateSlider();
        });

        dotsContainer.appendChild(dot);
    });
}

/* ================= UPDATE SLIDER ================= */

function updateSlider() {

    const cards =
        document.querySelectorAll(".project-card");

    if (!cards.length) return;

    const cardStyle =
        window.getComputedStyle(cards[0]);

    const cardWidth =
        cards[0].offsetWidth;

    const gap =
        parseInt(cardStyle.marginRight || 20);

    const moveAmount =
        cardWidth + 20;

    projectsContainer.style.transform =
        `translateX(-${currentSlide * moveAmount}px)`;

    /* UPDATE DOTS */

    document
        .querySelectorAll(".project-dot")
        .forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );
        });

    /* BUTTON STATES */

    prevBtn.disabled =
        currentSlide === 0;

    nextBtn.disabled =
        currentSlide === cards.length - 1;

    prevBtn.style.opacity =
        currentSlide === 0 ? "0.4" : "1";

    nextBtn.style.opacity =
        currentSlide === cards.length - 1 ? "0.4" : "1";
}

/* ================= NEXT ================= */

nextBtn.addEventListener("click", () => {

    const total =
        document.querySelectorAll(".project-card").length;

    if (currentSlide < total - 1) {

        currentSlide++;

        updateSlider();
    }
});

/* ================= PREV ================= */

prevBtn.addEventListener("click", () => {

    if (currentSlide > 0) {

        currentSlide--;

        updateSlider();
    }
});

/* ================= RESIZE FIX ================= */

window.addEventListener("resize", () => {

    updateSlider();
});

/* ================= INIT ================= */

loadGitHubProjects();




/* ================= PROGRAMMING LANGUAGE SKILLS ================= */

document.querySelectorAll(".circle-skill")
.forEach(skill => {

    const circle =
        skill.querySelector(".skill-progress");

    const percent =
        skill.dataset.percent;

    skill.addEventListener("mouseenter", () => {

        const offset =
            345.5 - (345.5 * percent / 100);

        circle.style.strokeDashoffset =
            offset;
    });

    skill.addEventListener("mouseleave", () => {

        circle.style.strokeDashoffset =
            345.5;
    });

});

/* ================= SECURE CONTACT ================= */

const form =
    document.getElementById("secureContactForm");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const messageInput =
    document.getElementById("message");

const transmitBtn =
    document.getElementById("payloadBtn");

/* ERRORS */

const nameError =
    document.getElementById("nameError");

const emailError =
    document.getElementById("emailError");

const messageError =
    document.getElementById("messageError");

/* BLOCKED WORDS */

const blockedWords = [

    "admin",
    "administrator",
    "root",
    "sql",
    "drop",
    "select",
    "insert",
    "delete",
    "script",
    "<script>",
    "alert(",
    "' or '1'='1",
    "\" or \"1\"=\"1",
    "--",
    ";",
    "union",
    "xp_cmdshell"
];

/* NAME */

function validateName(){

    const value =
        nameInput.value.trim();

    const regex =
        /^[A-Za-z ]+$/;

    if(value.length < 3){

        nameError.textContent =
            "Identity too short";

        return false;
    }

    if(!regex.test(value)){

        nameError.textContent =
            "Only valid alphabet characters allowed";

        return false;
    }

    if(
        blockedWords.some(word =>
            value.toLowerCase().includes(word)
        )
    ){

        nameError.textContent =
            "Restricted identity detected";

        return false;
    }

    nameError.textContent = "";

    return true;
}

/* EMAIL */

function validateEmail(){

    const value =
        emailInput.value.trim().toLowerCase();

    const regex =
       /^(?!.*admin)(?!.*root)(?!.*test)(?!.*fake)(?!.*temp)(?!.*spam)[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|proton\.me|icloud\.com|hotmail\.com|edu|gov|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})$/i;
       
const blockedEmails = [

    "admin@gmail.com",
    "admin123@gmail.com",
    "test@gmail.com",
    "root@gmail.com",
    "fake@gmail.com"
];

if(blockedEmails.includes(value)){

    emailError.textContent =
        "Restricted communication channel";

    return false;
}
       
       if(!regex.test(value)){

        emailError.textContent =
            "Enter valid communication channel";

        return false;
    }

    if(
        value.includes("admin") ||
        value.includes("root")
    ){

        emailError.textContent =
            "Restricted email detected";

        return false;
    }

    nameError.textContent = "";

    emailError.textContent = "";

    return true;
}

/* MESSAGE */

function validateMessage(){

    const value =
        messageInput.value.trim();

    const regex =
        /^[A-Za-z0-9().,\-_\n ]+$/;

    if(value.length < 10){

        messageError.textContent =
            "Payload too short";

        return false;
    }

    if(!regex.test(value)){

        messageError.textContent =
            "Invalid payload characters detected";

        return false;
    }

    if(
        blockedWords.some(word =>
            value.toLowerCase().includes(word)
        )
    ){

        messageError.textContent =
            "Malicious payload blocked";

        return false;
    }

    messageError.textContent = "";

    return true;
}

/* BUTTON BREAK EFFECT */

function checkForm(){

    const valid =
        validateName() &&
        validateEmail() &&
        validateMessage();

    if(!valid){

        transmitBtn.classList.add("broken");

    } else {

        transmitBtn.classList.remove("broken");
    }

    return valid;
}

/* LIVE CHECK */

nameInput.addEventListener("input", checkForm);

emailInput.addEventListener("input", checkForm);

messageInput.addEventListener("input", checkForm);


/* submit   */
async function showTransmitState() {

    transmitBtn.classList.remove(
        "broken"
    );

    transmitBtn.classList.add(
        "rebuild"
    );

    /* TRANSMITTING */

    const letters =
        document.querySelectorAll(
            ".shatter-letter"
        );

    letters.forEach(letter => {

        letter.textContent = "";

    });

    shatterText.innerHTML =
        "<span class='transmit-live'>TRANSMITTING...</span>";

    transmitBtn.disabled = true;

    await new Promise(r =>
        setTimeout(r, 1800)
    );

    /* DELIVERED */

    shatterText.innerHTML =
        "<span class='transmit-live'>PAYLOAD DELIVERED</span>";

    await new Promise(r =>
        setTimeout(r, 1800)
    );

    /* REBUILD ORIGINAL */

    buildButtonText();

    transmitBtn.disabled = false;
}

/* SUBMIT */

form.addEventListener("submit", async function(e){

    e.preventDefault();

    if(!checkForm()) return;

    await showTransmitState();
    try {

        const res = await fetch("https://restless-field-d668.tanvexar.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            })
        });

        const data = await res.text();

        console.log("Email sent:", data);

    } catch (err) {

        console.log("Send failed:", err);
        printOutput("[ ERROR ] Message failed to send");
    }

    // RESET AFTER TRANSMISSION
    form.reset();

    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";

    buildButtonText();
    breakButton();

});


/* ================= SHATTER SYSTEM ================= */

const shatterText =
    document.querySelector(".shatter-text");

const buttonWord =
    "TRANSMIT PAYLOAD";

/* CREATE LETTERS */

function buildButtonText(){

    shatterText.innerHTML = "";

    buttonWord.split("").forEach(letter => {

        const span =
            document.createElement("span");

        span.classList.add(
            "shatter-letter"
        );

        span.style.setProperty(
            "--r",
            Math.random() * 360 - 180
        );

        span.innerHTML =
            letter === " "
                ? "&nbsp;"
                : letter;

        shatterText.appendChild(span);
    });
}

buildButtonText();

/* BREAK BUTTON */

function breakButton(){

    transmitBtn.classList.remove(
        "rebuild"
    );

    transmitBtn.classList.add(
        "broken"
    );
}

/* REBUILD BUTTON */

function rebuildButton(){

    transmitBtn.classList.remove(
        "broken"
    );

    transmitBtn.classList.add(
        "rebuild"
    );
}

/* CHECK */

function validateFields(){

    const nameValid =
        nameInput.value.trim().length >= 3;

    const emailValid =
        emailInput.value.trim().length >= 5;

    const messageValid =
        messageInput.value.trim().length >= 10;

    if(
        nameValid &&
        emailValid &&
        messageValid
    ){

        rebuildButton();

    } else {

        breakButton();
    }
}

/* INPUT EVENTS */

nameInput.addEventListener(
    "input",
    validateFields
);

emailInput.addEventListener(
    "input",
    validateFields
);

messageInput.addEventListener(
    "input",
    validateFields
);

/* SCROLL FIX */

window.addEventListener("scroll", () => {

    if(
        !nameInput.value &&
        !emailInput.value &&
        !messageInput.value
    ){

        rebuildButton();
    }
});

/* INITIAL STATE */

breakButton();

/* signature */
const footerLines = [
    "root@system:~$ exit",
    "",
    "[✔] SESSION TERMINATED",
    "[✔] TRACE CLEARED",
    "",
    ">>> DEVELOPED BY TANVEXAR <<<"
];

const footerEl = document.getElementById("footerText");

let lineIndex = 0;
let charIndex = 0;

function typeFooter() {

    if (!footerEl) return;

    if (lineIndex >= footerLines.length) return;

    let line = footerLines[lineIndex];

    if (charIndex < line.length) {

        let span = document.createElement("span");
        span.textContent = line.charAt(charIndex);

        // green + red hacker blink
        span.style.color = Math.random() > 0.5 ? "#ff0000" : "#ff0033";

        footerEl.appendChild(span);

        charIndex++;

        setTimeout(typeFooter, 40);

    } else {

        footerEl.appendChild(document.createElement("br"));
        lineIndex++;
        charIndex = 0;

        setTimeout(typeFooter, 300);
    }
}

window.addEventListener("load", () => {

    setTimeout(() => {
        typeFooter();
    }, 800);

});
