import {controls} from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    const uniquePressedKeys = new Set();

    firstFighter['firstFighterHealth'] = firstFighter.health;
    secondFighter['secondFighterHealth'] = secondFighter.health;
    firstFighter['isPlayerOneCriticalHitSkipped'] = false;
    secondFighter['isPlayerTwoCriticalHitSkipped'] = false;

    return new Promise((resolve) => {
        // resolve the promise with the winner when fight is over
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        function handleKeyDown(event) {
            event.preventDefault();
            uniquePressedKeys.add(event.code);

            fighting(uniquePressedKeys, firstFighter, secondFighter);
            updateHealthIndicators(firstFighter, secondFighter);

            const winner = defineWinner(firstFighter, secondFighter);
            winner && resolve(winner);
        }

        function handleKeyUp(event) {
            event.preventDefault();
            uniquePressedKeys.delete(event.code);
        }
    });
}

function fighting(uniquePressedKeys, firstFighter, secondFighter) {
    const {
        PlayerOneAttack,
        PlayerOneBlock,
        PlayerTwoAttack,
        PlayerTwoBlock,
        PlayerOneCriticalHitCombination,
        PlayerTwoCriticalHitCombination
    } = controls;

    let isPlayerOneCriticalHit = PlayerOneCriticalHitCombination.every(key => uniquePressedKeys.has(key));
    let isPlayerTwoCriticalHit = PlayerTwoCriticalHitCombination.every(key => uniquePressedKeys.has(key));

    if (!firstFighter.isPlayerOneCriticalHitSkipped && isPlayerOneCriticalHit) {
        console.log('isPlayerOneCriticalHit: ', new Date);
        secondFighter.secondFighterHealth -= 2 * firstFighter.attack;
        firstFighter.isPlayerOneCriticalHitSkipped = true;
        setTimeout(() => {
            console.log('isSkippedPlayerOne: ', new Date);
            firstFighter.isPlayerOneCriticalHitSkipped = false;
        }, 10000);
    }

    if (!secondFighter.isPlayerTwoCriticalHitSkipped && isPlayerTwoCriticalHit) {
        console.log('isPlayerTwoCriticalHit: ', new Date);
        firstFighter.firstFighterHealth -= 2 * secondFighter.attack;
        secondFighter.isPlayerTwoCriticalHitSkipped = true;
        setTimeout(() => {
            console.log('isSkippedPlayerTwo: ', new Date);
            secondFighter.isPlayerTwoCriticalHitSkipped = false;
        }, 10000);
    }

    if (!isPlayerOneCriticalHit && uniquePressedKeys.has(PlayerOneAttack) && !uniquePressedKeys.has(PlayerTwoBlock)) {
        const damage = getDamage(firstFighter, secondFighter);
        secondFighter.secondFighterHealth -= damage;
        console.log('damage', damage);
        console.log('secondFighterHealth', secondFighter.secondFighterHealth);
    }

    if (!isPlayerTwoCriticalHit && uniquePressedKeys.has(PlayerTwoAttack) && !uniquePressedKeys.has(PlayerOneBlock)) {
        const damage = getDamage(secondFighter, firstFighter);
        firstFighter.firstFighterHealth -= damage;
        console.log('damage', damage);
        console.log('firstFighterHealth', firstFighter.firstFighterHealth);
    }
}

function updateHealthIndicators(firstFighter, secondFighter) {
    const firstFighterHealthIndicator = document.getElementById('left-fighter-indicator');
    const secondFighterHealthIndicator = document.getElementById('right-fighter-indicator');
    secondFighterHealthIndicator.style.width = (secondFighter.secondFighterHealth / secondFighter.health) * 100 + '%';
    firstFighterHealthIndicator.style.width = (firstFighter.firstFighterHealth / firstFighter.health) * 100 + '%';
}

function defineWinner(firstFighter, secondFighter) {
    // return firstFighter if win
    if (firstFighter.firstFighterHealth > 0 && secondFighter.secondFighterHealth <= 0) {
        return firstFighter;
    }
    // return secondFighter if win
    if (firstFighter.firstFighterHealth <= 0 && secondFighter.secondFighterHealth > 0) {
        return secondFighter;
    }
}

export function getDamage(attacker, defender) {
    // return damage
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage < 0 ? 0 : damage;
}

export function getHitPower(fighter) {
    // return hit power
    // random float value between 1 and 2
    const criticalHitChance = Math.random() + 1;
    const power = fighter.attack * criticalHitChance;

    return power;
}

export function getBlockPower(fighter) {
    // return block power
    // random float value between 1 and 2
    const dodgeChance = Math.random() + 1;
    const power = fighter.defense * dodgeChance;

    return power;
}
