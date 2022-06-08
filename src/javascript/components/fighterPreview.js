import { createElement } from '../helpers/domHelper';
import {showModal} from "./modal/modal";

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)
  if (fighter) {
    fighterElement.append(createFighterImage(fighter), createFighterInfo(fighter));
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };

  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}

function createFighterInfo(fighter) {
  const {name, attack, defense, health } = fighter;
  const fighterElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___info',
  });

  fighterElement.innerText = `Name: ${name} \n\t Health: ${health} \n\t Defense: ${defense} \n\t Attack: ${attack}`;

  return fighterElement;
}
