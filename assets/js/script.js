const slider = document.getElementById("slider");
const sliderValue = document.getElementById("slider-value");
const titleContainer = document.getElementById("title-container");
const title2Container = document.getElementById("title-2-container");
const artistContainer = document.getElementById("artist-container");
const audioContainer = document.getElementById("audio-container");
const pauseButton = document.getElementById("pause-button");
const linkContainer = document.getElementById("link-container");
const record = document.getElementById("record");
let nowPlaying;
let isPlaying = false;
let genre = "Jazz"; //preset to jazz
document.getElementById("Jazz").checked = true; //show the radio jazz

//decade selection
sliderValue.textContent = slider.value;
slider.addEventListener("input", () => { //decade slider input
    sliderValue.textContent = slider.value; //updates html
    audio(slider.value, genre); //calls audio
});

//genre selection
document.querySelectorAll("input[name='genre']").forEach(radio => {
    radio.addEventListener("change", (event) => { //changin genres
        genre = event.target.id; //storing genre
        //updating background colours
        if (genre === "Classical") {
            document.body.style.backgroundColor = "var(--classical-color)";
        }
        else if (genre === "Jazz") {
            document.body.style.backgroundColor = "var(--jazz-color)";
        }
        else if (genre === "Popular") {
            document.body.style.backgroundColor = "var(--pop-color)";
        };
        audio(slider.value, genre); //calls audio
    });
});

//player func
async function audio(year, genre) {
    try {
        //the api stuff
        const api = `https://api.collection.nfsa.gov.au/search?query=&hasMedia=yes&mediaFileTypes=Audio&forms=Music&parentTitle.genres=${genre}%20music&year=${year}-${Number(year)+9}`;
        const response = await fetch(api);
        const data = await response.json();
        const songs = data.results;

        //get first matching song
        const song1 = songs[0];
        const song2 = songs[1];
        const audioPath = song1.preview[0].filePath;
        const audioUrl = `https://media.nfsacollection.net/${audioPath}`;
        
        //display current song and info
        const title = song1.title;
        const artist = song1.credits[0].name;
        const id = song1.id;
        titleContainer.innerHTML = `<p>${title}</p>`;
        artistContainer.innerHTML = `<p>${artist}</p>`;
        linkContainer.href = `https://www.collection.nfsa.gov.au/title/${id}}`;//link to nfsa page
        audioContainer.innerHTML = `<audio controls id="now-playing"><source src="${audioUrl}" type="audio/mpeg"></audio>`;
        nowPlaying = document.getElementById("now-playing");
        
        //if playing before resume
        if (isPlaying) {
            nowPlaying.play();
            pauseButton.textContent = "PAUSE";
            record.src = "assets/images/record.gif"
        } else {
            pauseButton.textContent = "PLAY";
            record.src = "assets/images/record.png";
        }
        
        const title2 = song2.title; //up next
        title2Container.innerHTML = `<p>${title2}</p>`;
        
        //audio states
        if (isPlaying) {
            nowPlaying.play();
            pauseButton.innerHTML = "PAUSE";
            record.src = "assets/images/record.gif";
        } else {
            pauseButton.innerHTML = "PLAY";
            record.src = "assets/images/record.png";
        }

        
    } catch (error) { //when no matching
        titleContainer.innerHTML = "<p>No matches</p>";
        audioContainer.innerHTML = "";
        artistContainer.innerHTML = "";
        title2Container.innerHTML = "";
    }
}

//pause func
pauseButton.addEventListener("click", () => {
    const nowPlaying = document.getElementById("now-playing");
    if (!nowPlaying) return; //no audio yet
    if (!nowPlaying.paused) { //audio is playing
        nowPlaying.pause();
        pauseButton.innerHTML = "PLAY";
        record.src = "assets/images/record.png";
        isPlaying = false;
    } else { //audio isnt playing
        nowPlaying.play();
        pauseButton.innerHTML = "PAUSE";
        record.src = "assets/images/record.gif";
        isPlaying = true;
    }
});

audio(slider.value, genre);
