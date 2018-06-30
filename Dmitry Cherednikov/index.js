// Character

function Character(type, name) {
  this.name = name || 'Wanderer';
  this.type = type.name;
  this.health = type.health;
  this.damage = type.damage;
  this.maxHealth = type.health;
  this.counter = 2;
  this.potion = false;
}

Character.prototype.setHealth = function(damage) {
  if (this.shouldUseSkill() && (this.alignment === 'hero' && !this.potion || this.alignment === 'monster' && this.potion)) {
    this.counter--;
  } else {
    this.health -= damage;
  }
}

Character.prototype.getDamage = function() {
  if (this.shouldUseSkill() && (this.alignment === 'hero' && this.potion || this.alignment === 'monster' && !this.potion)) {
    this.counter--;
    return this.damage * 2;
  }
  return this.damage;
}

Character.prototype.attack = function(obj) {
  obj.setHealth(this.getDamage());
}

Character.prototype.isAlive = function() {
  return this.health > 0;
}

Character.prototype.getHealth = function() {
  return this.health;
}

Character.prototype.shouldUseSkill = function() {
  return (this.health < this.maxHealth / 2 && this.counter > 0); 
}

Character.prototype.refreshStats = function() {
  this.health = this.maxHealth;
  this.counter = 2;
  this.potion = false;
}

Character.prototype.usePotion = function() {
  this.potion = true;
}

// Hero

function Hero() {
  Character.apply(this, arguments);
  this.alignment = 'hero';
}

Hero.WARRIOR = {
  'name': 'warrior',
  'health': 130,
  'damage': 25,
}

Hero.MAGE = {
  'name': 'mage',
  'health': 110 ,
  'damage': 30,
}

Hero.THIEF = {
  'name': 'thief',
  'health': 125,
  'damage': 20,
}

Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

// Monster

function Monster() {
  Character.apply(this, arguments);
  this.alignment = 'monster';
}

Monster.VAMPIRE = {
  'name': 'vampire',
  'health': 125,
  'damage': 20,
}

Monster.ORC = {
  'name': 'orc',
  'health': 130,
  'damage': 25,
}

Monster.GOBLINS = {
  'name': 'goblins',
  'health': 140,
  'damage': 15,
}

Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

// Tournament

function Tournament(amount) {
  this.limit = amount;
  this.participants = [];
  this.isOpen = true;
  this.winner = null;
}

Tournament.GLOSSARY = {
  'hero': ['Geralt', 'Kerillian', 'Kruber', 'Tyrion', 'Teclis', 'Hound', 'Wanderer'],
  'monster': ['Thanquil', 'Tzeentch', 'Vlad von Carstein', 'Settra', 'Grimgor', 'Wanderer'],
}

Tournament.prototype.add = function(participant) {

  if (!participant instanceof Character || this.participants.indexOf(participant) !== -1) return;

  if (this.participants.length === this.limit) {
    throw new Error('Tournament has maximum amount of players');
  };

  if (Tournament.GLOSSARY[participant.alignment].indexOf(participant.name) === -1) {
    throw new Error('Inappropriate name');
  };

  if (!this.isOpen) {
    throw new Error('Tournament is over');
  }

  this.participants.push(participant);
}

Tournament.prototype.remove = function(participant) {
  var index = this.participants.indexOf(participant);
  this.participants.splice(index, 1);
}

Tournament.prototype.start = function() {

  if (!this.isOpen) {
    throw new Error('Tournament is over');
  }

  if (this.participants.length < 2) {
    throw new Error('Not enough players');
  }

  while (this.participants.length > 1) {
    var fighters = this.participants
      .sort(function() { 
        return .5 - Math.random(); 
      })
      .slice(0, 2);

    this.fight(fighters[0], fighters[1]);
  }

  this.winner = this.participants.shift();

  console.log(this.winner.name + ' have won the tournament!');

  this.isOpen = false; // or Object.freeze
}


Tournament.prototype.fight = function(fighter_one, fighter_two) {
  while (fighter_one.isAlive() && fighter_two.isAlive()) {

    fighter_one.attack(fighter_two);

    console.log(fighter_two.name + ' hp: ' + fighter_two.getHealth());

    if (!fighter_two.isAlive()) {
      console.log(fighter_one.name + ' have won the fight!');

      fighter_one.refreshStats();
      this.remove(fighter_two);

      break;
    }

    fighter_two.attack(fighter_one);

    console.log(fighter_one.name + ' hp: ' + fighter_one.getHealth());

    if (!fighter_one.isAlive()) {
      console.log(fighter_two.name + ' have won the fight!');

      fighter_two.refreshStats();
      this.remove(fighter_one);
    }
  }
}

// Factories 

function warriorFactory() {
  return new Hero(Hero.WARRIOR);
}

function mageFactory() {
  return new Hero(Hero.MAGE);
}

function thiefFactory() {
  return new Hero(Hero.THIEF);
}

function vampireFactory() {
  return new Monster(Monster.VAMPIRE);
}

function orcFactory() {
  return new Monster(Monster.ORC);
}

function goblinsFactory() {
  return new Monster(Monster.GOBLINS);
}

