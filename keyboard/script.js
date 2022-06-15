/**
 * HTML piano keyboard
 * Charles Matthews (Blurring the Boundaries Arts) 2022
 */

/**
 * Check if a MIDI note number is a black key
 * @param {number} x MIDI note number
 * @returns {boolean}
 */

const isBlackKey = (x) => [1, 3, 6, 8, 10].includes(x % 12);

/**
 * Array of note names. We could modify this to include flats depending on a user determined key signature.
 */

const noteNames = [
    'C',
    'C sharp',
    'D',
    'D sharp',
    'E',
    'F',
    'F sharp',
    'G',
    'G sharp',
    'A',
    'A sharp',
    'B'
];

/**
 * Basic synth for testing purposes..
 */

const synth = new Tone.PolySynth().toDestination();
const playNote =function() {
    Tone.start();
    synth.triggerAttackRelease(
        Tone.Frequency(parseFloat(this.dataset.note), "midi").toFrequency(),
        0.3
    );
}


/**
 * Set the screen reader accessible layer first.
 * I'm making two separate layers so that we can control where the black notes sit while enabling a linear path through the keyboard.
 * Next up: consider grouping these elements into octaves, etc.
 */
document.querySelectorAll(".pianoNote").forEach((note, i, array) => {
    let offset = 0;
    let isBlack = isBlackKey(i);
    let previousWidth = i > 0 ? parseInt(array[i - 1].style.width) : 0;
    let previousOffset = i > 0 ? parseInt(array[i - 1].style.left) : 0;
    offset = previousOffset + previousWidth;
    offset -= isBlack ? 10 : 0;
    let previousBlackKey = false;
    if (i > 0) {
        previousBlackKey = array[i - 1].getAttribute("data-colour") == "black";
        offset -= previousBlackKey ? 10 : 0;
    }

    note.setAttribute("data-colour", isBlack ? "black" : "white");
    note.setAttribute("data-note", i + 60);
    note.setAttribute("data-noteName", noteNames[i%12])
    note.setAttribute("role", "button");
    note.setAttribute("aria-label", `${noteNames[i%12].replace(' sharp','-sharp')}-${parseInt(i/12) + 4}`);
    Object.assign(note.style, {
        "border-style": "solid",
        "border-width": "1px",
        position: "absolute",
        left: `${offset}px`,
        width: `${isBlack ? 20 : 30}px`,
        height: `${isBlack ? 70 : 130}px`,
        "background-color": isBlack ? "black" : "pink"
    });
    note.innerHTML = "";
    note.addEventListener("click", playNote);
});


/**
 * Set the clickable/touchable layer..
 * Separate divs so that black notes can sit on top.
 */
document.querySelectorAll(".pianoNote").forEach((note, i) => {
    let cloneNote = note.cloneNode(true);
    cloneNote.setAttribute('aria-hidden',true);
    cloneNote.style.borderWidth="2px";
    cloneNote.addEventListener("click", playNote);
    document.getElementById(note.id.includes("sharp") ? "blackKeys" : "whiteKeys")
        .appendChild(cloneNote);
});