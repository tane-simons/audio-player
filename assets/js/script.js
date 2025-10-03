// CONSTS & LETS

const slider = document.getElementById("slider");
const sliderValue = document.getElementById("slider-value");
const titleContainer = document.getElementById("title-container");
const artistContainer = document.getElementById("artist-container");
const audioContainer = document.getElementById("audio-container");
const pauseButton = document.getElementById("pause-button");
const pauseIcon = document.getElementById("pause-icon");
const linkContainer = document.getElementById("link-container");
const record = document.getElementById("record");
const infoButton = document.getElementById("info");
const fullScreenInfo = document.getElementById("full-screen-info");
const exitInfo = document.getElementById("x");
const recordArm = document.getElementById("record-arm");

let nowPlaying;
let isPlaying = false; //start stopped
let songs = []; //full array of songs
let currentIndex = 0; //current song index
let genre = "Jazz"; //preset to jazz
document.getElementById("Jazz").checked = true; //show the radio jazz
//stuff for record spinnning
let angle = 0; //record spin angle
let spinning = false //start stopped
let speed = 0; //used for animation frame, as degrees/frame
let targetSpeed = 0 //record spin speed

//overlay
infoButton.addEventListener("click", () => {
    fullScreenInfo.style.display = "flex";
})

exitInfo.addEventListener("click", () => {
    fullScreenInfo.style.display = "none";
})

// capitalize only first letter function from all caps
function capitalize(str) {
    return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

//decade selection
sliderValue.textContent = slider.value;
slider.addEventListener("input", () => { //decade slider input
    sliderValue.textContent = slider.value; //updates html
    audio(slider.value, genre); //calls audio
});

function sliderValuePosition() {
    const value = slider.value;
    sliderValue.textContent = value + "s" //decade text
    const percent = (value - slider.min)/(slider.max - slider.min); //percentage
    const sliderWidth = slider.offsetWidth;
    const valueWidth = sliderValue.offsetWidth;
    const thumbWidth = 80;
    const left = percent * (sliderWidth-thumbWidth)+(thumbWidth/2); //for purposes of having it always centred, track width is slightly shorter
    sliderValue.style.left = `${left-valueWidth/2}px`;
}

slider.addEventListener("input", sliderValuePosition);
window.addEventListener("resize", sliderValuePosition);
sliderValuePosition();

//genre selection
document.querySelectorAll("input[name='genre']").forEach(radio => {
    radio.addEventListener("change", (event) => { //changin genres
        genre = event.target.id; //storing genre
        
        //updating label text colours
        document.querySelectorAll("label").forEach(label => {
            label.classList.remove("current-genre");
            label.style.color = "";
        });

        const selectedGenre = document.querySelector(`label[for='${genre}']`);
        if (selectedGenre) {
            selectedGenre.classList.add("current-genre");
        }

        //updating background colours
        if (genre === "Classical") {
            document.body.style.backgroundColor = "var(--classical-color)";
            sliderValue.style.color = "var(--classical-color)";
        }
        else if (genre === "Jazz") {
            document.body.style.backgroundColor = "var(--jazz-color)";
            sliderValue.style.color = "var(--jazz-color)";
        }
        else if (genre === "Popular") {
            document.body.style.backgroundColor = "var(--pop-color)";
            sliderValue.style.color = "var(--pop-color)";
        };
        audio(slider.value, genre); //calls audio
    });
});

async function audio(year, genre) {
    try {
        const api = `https://api.collection.nfsa.gov.au/search?query=&hasMedia=yes&mediaFileTypes=Audio&forms=Music&parentTitle.genres=${genre}%20music&year=${year}-${Number(year)+9}`; //API with ability to change the decade and genre
        const response = await fetch(api);
        const data = await response.json();
        songs = data.results; //results from query

        currentIndex = 0; // start from the first song
        loadSong(currentIndex); //see function
        UpNext(); //see function
    } catch (error) { //no songs error handling
        titleContainer.innerHTML = "<p>Collection Incomplete</p>";
        audioContainer.innerHTML = "";
        artistContainer.innerHTML = "";
        document.getElementById("up-next-songs").innerHTML = "";
    }
}

//playing the song
function loadSong(index) { //takes index from array as will be needed in up next skipping
    const song = songs[index];
    if (!song) return; //return if no songs

    const audioPath = song.preview[0].filePath; //path for api segment
    const audioUrl = `https://media.nfsacollection.net/${audioPath}`;

    const title = song.title;
    const artist = song.credits[0]?.name ?? "Unknown Artist";
    const id = song.id;

    //set details
    titleContainer.innerHTML = `<p>${capitalize(title)}</p>`;
    artistContainer.innerHTML = `<p>${artist}</p>`;
    linkContainer.href = `https://www.collection.nfsa.gov.au/title/${id}`;

    audioContainer.innerHTML = `<audio controls id="now-playing"><source src="${audioUrl}" type="audio/mpeg"></audio>`; //actual audio player
    nowPlaying = document.getElementById("now-playing"); //nowplaying element

    //play/pause button
    if (isPlaying) {
        nowPlaying.play();
        pauseIcon.src = "assets/symbols/pause.svg";
        recordArm.style.transform = "rotate(230deg)"
        if (window.innerWidth < 580) {
            pauseIcon.style.width = "5vw";
        } else {
            pauseIcon.style.width = "2vw";
        }
    } else {
        pauseIcon.src = "assets/symbols/play.fill.svg";
        recordArm.style.transform = "rotate(210deg)"
        if (window.innerWidth < 580) {
            pauseIcon.style.width = "8vw";
        } else {
            pauseIcon.style.width = "3vw";
        }
    }
}

// next three songs
function UpNext() {
    const upNextContainer = document.getElementById("up-next-songs");
    upNextContainer.innerHTML = ""; // clear all

    const nextSongs = songs.slice(currentIndex + 1, currentIndex + 4); //only next three songs
    nextSongs.forEach((song, i) => { //current song, i from array of 3
        const div = document.createElement("div");
        div.classList.add("up-next-song"); //for each up next song
        div.innerHTML = `<p id="up-next-title">${capitalize(song.title)}</p><p id="up-next-artist">${song.credits[0]?.name}</p>`; //details of up next songs

        div.addEventListener("click", () => { //ability to click on a song and it will start playng from there in the array
            currentIndex = currentIndex + 1 + i; //updates main array to the clicked songs position (eg on song 5, clikced on 2nd from up next array where i is 1, then 5+1+1 updates main array to 7)
            loadSong(currentIndex);
            UpNext();
        });

        upNextContainer.appendChild(div); //puts the info in the div
    });
}

// record spinning func
function spin() {
    angle = (angle+speed); //changes angle by current speed
    record.style.transform = `rotate(${angle}deg)`; //css rotate animation

    if (Math.abs(speed-targetSpeed)>0.01) { //check for current speed relative to target speed (above 0)
        speed += (targetSpeed-speed)*0.02; //used to ease speed in so it doesnt start fast spinning immediately with 5% accel
        requestAnimationFrame(spin); //looping every frame
    } else { //when target speed is reached speed is set to the constant
        speed = targetSpeed;
        if (speed !== 0) {
            requestAnimationFrame(spin); //keep spinning if moving
        }
    }
}
//set start and stop speeds
function startSpinning() {
    targetSpeed = 2;
    requestAnimationFrame(spin);
}

function stopSpinning() {
    targetSpeed = 0;
}

//pause func
pauseButton.addEventListener("click", () => {
    const nowPlaying = document.getElementById("now-playing");
    if (!nowPlaying) return; //no audio yet
    if (!nowPlaying.paused) { //audio is playing
        nowPlaying.pause();
        pauseIcon.src = "assets/symbols/play.fill.svg"; //pause symbols
        recordArm.style.transform = "rotate(210deg)"
        if (window.innerWidth < 580) {
            pauseIcon.style.width = "8vw";
        } else {
            pauseIcon.style.width = "3vw";
        }
        isPlaying = false;
        stopSpinning();
    } else { //audio isnt playing
        nowPlaying.play();
        pauseIcon.src = "assets/symbols/pause.svg"; //pause symbols
        recordArm.style.transform = "rotate(230deg)"
        if (window.innerWidth < 580) {
            pauseIcon.style.width = "5vw";
        } else {
            pauseIcon.style.width = "2vw";
        }
        isPlaying = true;
        startSpinning();
    }
});

audio(slider.value, genre); //calls main audio
