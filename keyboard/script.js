/**
 * HTML piano keyboard
 * Charles Matthews (Blurring the Boundaries Arts) 2022
 * Additional colour features in collaboration with Joel Daze
 */

/**
 * Array of note names. We could modify this to include flats depending on a user determined key signature.
 */

const measurements = {
    white:30,
    black:20
}

const isBlackKey = (x) => [1, 3, 6, 8, 10].includes(x % 12);

const noteColours = {
    newton_12:[
       'Red',
       'OrangeRed',
       'Orange',
       'Gold',
       'Yellow',
       'YellowGreen',
       'Green',
       'LightSeaGreen',
       'Blue',
       'BlueViolet',
       'Indigo',
       'Purple'
   ]
}



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

const playElement =function(element) {
    Tone.start();
    synth.triggerAttackRelease(
        Tone.Frequency(parseFloat(element.dataset.note), "midi").toFrequency(),
        0.3
    );
}


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

const keyMap = {
    A: 0,   // C
    W: 1,
    S: 2,
    E: 3,
    D: 4,
    F: 5,
    T: 6,
    G: 7,    // G
    Y: 8,    // G#
    H: 9,
    U: 10,
    J: 11,
    K: 12
}

const Keyboard = function(numKeys = 12){
    this.element=cm.create('div',{
        className:  "keyboard",
        id: "keyboard"
    })
    this.underlay = cm.create('div',{
        id:'underlay'
    })
    this.whiteKeys = cm.create('div',{
        id:'whiteKeys'
    })
    this.blackKeys = cm.create('div',{
        id:'blackKeys'
    })
    this.keys = this.populate(numKeys);
    this.keys.forEach(key=> this.underlay.appendChild(key) )
    this.element.appendChild(this.underlay)
    this.element.appendChild(this.whiteKeys)
    this.element.appendChild(this.blackKeys)
    // console.log(this.element.querySelectorAll('.pianoNote'))
    this.elementSetup();
    let width = this.whiteKeys.children.length*measurements.white;
    this.element.style.width = `${width}px`;
    return this;
}

Keyboard.constructor = Keyboard;
Keyboard.prototype.populate = function(number=12){
    let outputArray = []
    for(let i=0;i<number;i++){
        outputArray[i] = cm.create('div',{
            className:'pianoNote',
            id:noteNames[i%12].replace(' ','')
        })
    }
    return outputArray;
}

Keyboard.prototype.elementSetup = function(){
    /**
     * Set the screen reader accessible layer first.
     * I'm making two separate layers so that we can control where the black notes sit while enabling a linear path through the keyboard.
     */
    this.element.querySelectorAll(".pianoNote").forEach((note, i, array) => {
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
        note.setAttribute("aria-label", `${noteNames[i%12].replace(' sharp','-sharp')}-${parseInt(i/12) + 4}, ${noteColours['newton_12'][i%12]}`);
        Object.assign(note.style, {
            "border-style": "solid",
            "border-width": "1px",
            position: "absolute",
            left: `${offset}px`,
            width: `${isBlack ? 20 : 30}px`,
            height: `${isBlack ? 70 : 130}px`,
            "background-color": isBlack ? "black" : "pink"
        });
        note.addEventListener("click", playNote);
    });


    /**
     * Set the pointer layer..
     * Separate divs so that black notes can sit on top.
     */
    this.element.querySelectorAll(".pianoNote").forEach((note, i) => {
        // console.log(note.id)
        let cloneNote = note.cloneNode(true);
        cloneNote.setAttribute('class', 'visual')
        cloneNote.setAttribute('aria-hidden',true);
        cloneNote.style.borderWidth="2px";
        cloneNote.addEventListener("click", playNote);
        cloneNote.style.backgroundColor = noteColours['newton_12'][i%12];
        let targetId = note.id.includes("sharp") ? "blackKeys" : "whiteKeys"
        // console.log('targetId', targetId)
        let target = this.element.querySelector('#' + targetId)
        // console.log(target, cloneNote)
        target.appendChild(cloneNote);
    });
}



let test = new Keyboard(24);
document.body.appendChild(test.element);
// console.log(test.element);


// TODO: add octave shift button

const playKey = function(e){
    
    let thisCode = e.code.replace('Key','');
    console.log(keyMap[thisCode])
    if(Object.keys(keyMap).includes(thisCode)){
        playElement(document.querySelectorAll('.pianoNote')[keyMap[thisCode]]);        
    }

}

window.addEventListener('keydown',playKey)


/**
 * Check if a MIDI note number is a black key
 * @param {number} x MIDI note number
 * @returns {boolean}
 */