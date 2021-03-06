const colorType = {
    'Standard': '#a6a6a8',
    'Dragon': '#c90e27',
    'Humanisme': '#0e1ac9',
    'Fatalité': '#040405'
};

class Randomizer {
    constructor() {}

    randomValue(maxValue = 10) {
        return Math.ceil(Math.random() * 10);
    }
}

class ProphecyResult {
    constructor(type, dice, finalResult, reussiteCritique, echecCritique) {
        this.type = type;
        this.dice = dice;
        this.finalResult = finalResult;
        this.reussiteCritique = reussiteCritique;
        this.echecCritique = echecCritique;
    }

    toString() {
        const iconColor = colorType[this.type];
        const iconType = `<p style="color: ${iconColor}">⯀`;
        const critique = this.reussiteCritique ? `( Réussite critique )` : 
            this.echecCritique ? `( Echec critique)` : '';
        return `${iconType} ${this.dice} => ${this.finalResult} ${critique}</p>`;
    }
}

class InitiativeResult {
    constructor(dices) {
        this.dices = dices;
    }

    toString() {
        return this.dices.join('<br>');
    }
}

class DommageResult {
    constructor(dices, result) {
        this.dices = dices;
        this.result = result;
    }

    toString() {
        return `${this.dices.join(', ')} => ${this.result}`;
    }
}

class ProphecyDice {
    constructor(randomizer) {
        this.randomizer = randomizer;
    }

    launch(type, attribut, competence, bonus) {
        const dice = this.randomizer.randomValue(10);
        return new ProphecyResult(
            type,
            dice,
            attribut + competence + bonus + dice,
            dice === 10 && this.randomizer.randomValue(10) <= competence,
            dice === 1 && this.randomizer.randomValue(10) >= competence
        );
    }

    launchInitiative(nbDices) {
        const dices = new Array(nbDices).fill(0).map(() => this.randomizer.randomValue(10));
        return new InitiativeResult(dices);
    }

    launchDommages(nbDices, bonus) {
        const dices = new Array(nbDices).fill(0).map(() => this.randomizer.randomValue(10));
        const results = dices.reduce((prev, curr) => prev + curr, 0) + bonus;
        return new DommageResult(dices, results);
    }
}

class ProphecyTest {
    constructor(randomizer) {
        this.dicer = new ProphecyDice(randomizer);
    }

    evaluate(attribut, competence, bonus, isTendance = false) {
        if(!isTendance) {
            return [this.dicer.launch('Standard', attribut, competence, bonus)];
        }
        return [
            this.dicer.launch('Dragon', attribut, competence, bonus),
            this.dicer.launch('Humanisme', attribut, competence, bonus),
            this.dicer.launch('Fatalité', attribut, competence, bonus)
        ];
    }

    initiative(nbDices) {
        return [this.dicer.launchInitiative(nbDices)];
    }

    dommage(nbDices, bonus) {
        return [this.dicer.launchDommages(nbDices, bonus)];
    }
}