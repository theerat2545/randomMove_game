import * as PIXI from 'pixi.js';
import { Spine } from 'pixi-spine';
import gsap from 'gsap';

const app = new PIXI.Application({
    width: 1200,
    height: 960,
});
document.body.appendChild(app.view);

// Container สำหรับเก็บ objects
const container = new PIXI.Container();
app.stage.addChild(container);

let background; 
let snowTexture; 
let ufo;
let objects = []; 

window.addEventListener('resize', resize);

// โหลด Spine assets
PIXI.Assets.load('/images/coin-pro.json')
  .then(({ spineData }) => {
    const spineCoinGold = new Spine(spineData);
    spineCoinGold.width = 70;
    spineCoinGold.height = 70;
    spineCoinGold.x = app.screen.width / 5; 
    spineCoinGold.y = app.screen.height / 4;
    container.addChild(spineCoinGold);
    spineCoinGold.state.setAnimation(0, 'animation', true);
    
  })
  .catch(error => {
    console.error('Failed to load Spine data:', error);
  });

// โหลด texture และสร้าง sprite
PIXI.Assets.load('/images/bgsky.png')
    .then(texture => {
        // Background
        background = new PIXI.Sprite(texture);
        background.width = app.screen.width;
        background.height = app.screen.height;
        background.x = 0;
        background.y = 0;
        container.addChild(background);

        // โหลด texture snowflake
        return PIXI.Assets.load('/images/snowflake.png');
    })
    .then(texture => {
        snowTexture = texture;
        start();

        // โหลด texture UFO
        return PIXI.Assets.load('/images/0.png');
    })
    .then(texture => {
        // create sprite ufo
        ufo = new PIXI.Sprite(texture);
        ufo.width = 400; 
        ufo.height = 400; 
        ufo.anchor.set(0.5);
        ufo.x = app.screen.width / 2;
        ufo.y = app.screen.height / 2;
        container.addChild(ufo);

        // create button
        const button = new PIXI.Graphics();
        button.lineStyle(2, 0xffffff, 1);
        button.beginFill(0x0000ff, 0.5); 
        button.drawRoundedRect(0, 0, 200, 100, 20); 
        button.endFill();
        
        button.pivot.set(button.width / 2, button.height / 2);
        button.x = app.screen.width / 2;
        button.y = app.screen.height - button.height / 2 - 20;
        
        button.eventMode = 'dynamic';
        button.buttonMode = true;

        // event click
        button.on('pointerdown', () => {
            button.visible = false;
            moveRandomly(button);
        });

        // text button
        const buttonText = new PIXI.Text('Random', {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
            align: 'center',
        });

        buttonText.anchor.set(0.5);
        buttonText.x = button.width / 2;
        buttonText.y = button.height / 2;

        button.addChild(buttonText);
        container.addChild(button);
    })
    .catch(error => {
        console.error('Failed to load texture:', error);
    });

// สร้าง object snowflake
function createObjects(numObjects) {
    for (let i = 0; i < numObjects; i++) {
        const object = new PIXI.Sprite(snowTexture);
        object.width = 5;
        object.height = 5;
        
        // กำหนดตำแหน่งเริ่มต้นของ object
        object.x = Math.random() * app.screen.width;
        object.y = 0; 

        container.addChild(object);
        objects.push(object);

        // run function moveObject(data) 
        moveObject(object);
    }
}

// function move down snowflake
function moveObject(object) {
    const speed = 2 + Math.random() * 3;
    console.log('Moving object with speed:', speed);

    gsap.to(object, {
        y: app.screen.height + 5, 
        duration: 5 / speed, 
        ease: "none",
        onComplete: () => {
            object.y = 0;
            object.x = Math.random() * app.screen.width;
            moveObject(object);
        }
    });
}

// ฟังก์ชันให้ทำการสร้าง object 200 snowflake
function start() {
    createObjects(200);
}

// function resize bg = app
function resize() {
    if (background) {
        background.width = app.screen.width;
        background.height = app.screen.height;
    }
}

// function random move ufo left or right
function moveRandomly(button) {
    if (ufo) {
        const startX = ufo.x;
        const endX = Math.random() > 0.5 ? app.screen.width - ufo.width / 2 : ufo.width / 2;
        gsap.to(ufo, {
            x: endX,
            duration: 3,
            ease: "power1.inOut",
            onComplete: () => {
                gsap.to(ufo, {
                    x: startX,
                    duration: 0, 
                    ease: "power1.inOut",
                });
                button.visible = true;
            }
        });
    }
}
