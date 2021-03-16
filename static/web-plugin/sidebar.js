
let lastSelectedWidgetId
let widgetName = document.querySelector('#widget-name')
let widgetInfo = document.querySelector('.widget-info')
let placeholder = document.querySelector('.no-selected-widget')

let form = document.querySelector('#formLauncher')
let diceLaunchButton = document.querySelector('#diceLaunch')
let pseudoInput = document.querySelector('#pseudo')
let attributInput = document.querySelector('#attribut')
let competenceInput = document.querySelector('#competence')
let bonusInput = document.querySelector('#bonus')
let tendanceInput = document.querySelector('#tendance')
let result = document.querySelector('#result')
let lastRolls = [];


const randomizer = new Randomizer();
const prophecy = new ProphecyTest(randomizer);

miro.onReady(() => {
    reinitData();
})

form.addEventListener('change', formChange);
form.addEventListener('submit', launchDice);


function formChange() {
    const formData = new FormData(form);
    const data = {
        pseudo: formData.get('pseudo'),
        attribut: formData.get('attribut'),
        competence: formData.get('competence'),
        bonus: formData.get('bonus'),
        rolls: lastRolls ? lastRolls : []
    }
    localStorage.setItem('PROPHECY_ROLLER', JSON.stringify(data));
}

function reinitData() {
    const data = localStorage.getItem('PROPHECY_ROLLER');
    const parseData = data ? JSON.parse(data) : null;
    if(parseData) {
        pseudoInput.value = parseData.pseudo;
        competenceInput.value = parseData.competence;
        attributInput.value = parseData.attribut;
        bonusInput.value = parseData.bonus;
    }
}

/**
 * Orchestration du lancement de dé.
 */
async function launchDice(e) {
    e.preventDefault()
    const results = prophecy.evaluate(attributInput.valueAsNumber || 0, competenceInput.valueAsNumber || 0, bonus.valueAsNumber || 0, tendanceInput.checked);
    printResult(results)
    lastRolls = results
    formChange()
    return false
}

async function printResult(rolls) {
    await printResultInSticker(rolls);
    printResultInSidebar(rolls);
}

async function printResultInSticker(rolls) {
    const stickersToUpdate = await searchSticker();
    const results = rolls.map(r => `${r.toString()}`).join('<br>');
    const textToPrint = `<p>${pseudoInput.value}</p><br> ${results}`

    if(stickersToUpdate) {
        miro.board.widgets.update(stickersToUpdate.map((s) => ({
            ...s,
            text: textToPrint
        })))
    } else {
        miro.board.widgets.create({type: 'sticker', text: textToPrint, capabilities: {
            editable: false
        }})
    }
}

async function searchSticker() {
    const stickers = await miro.board.widgets.get({type: "sticker"});
    const userStickers = stickers.filter((w) => {
        return w.text.indexOf(`${pseudoInput.value}`) >= 0;
    });
    return userStickers.length ? userStickers : null;
}

function printResultInSidebar(rolls, raises) {
    const results = rolls.map(r => `${r.toString()}`).join('<br>');
    result.innerHTML = `${results}`;
}

const LS_KEY = 'rtb-plugin-widget-info'


/**
 * Manipulation du local storage
  */
function saveData(widgetId, text) {
  let data = JSON.parse(localStorage.getItem(LS_KEY)) || {}
  data[widgetId] = text
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

function getData(widgetId) {
  let data = JSON.parse(localStorage.getItem(LS_KEY)) || {}
  return data[widgetId] || ''
}
