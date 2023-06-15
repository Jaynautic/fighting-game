const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/forestbackground.png",
});

const fire1 = new Sprite({
  position: {
    x: 850,
    y: 345,
  },
  imageSrc: "./img/burning_loop_1.png",
  scale: 5,
  framesMax: 8,
});

const fire2 = new Sprite({
  position: {
    x: 50,
    y: 345,
  },
  imageSrc: "./img/burning_loop_1.png",
  scale: 5,
  framesMax: 8,
});

const player = new Fighter({
  position: {
    x: 250,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/knight/Idle.png",
  scale: 3,
  framesMax: 10,
  offset: {
    x: 140,
    y: 95,
  },
  sprites: {
    idle: {
      imageSrc: "./img/knight/Idle.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "./img/knight/Run.png",
      framesMax: 10,
    },
    jump: {
      imageSrc: "./img/knight/Jump.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./img/knight/Fall.png",
      framesMax: 3,
    },
    attack: {
      imageSrc: "./img/knight/Attack.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/knight/TurnAround.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/knight/Death.png",
      framesMax: 10,
    },
  },
  attackBox: {
    offset: {
      x: 60,
      y: 25,
    },
    width: 150,
    height: 100,
  },
});

const enemy = new Fighter({
  position: {
    x: 700,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/king/Idle.png",
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 165,
    y: 115,
  },
  sprites: {
    idle: {
      imageSrc: "./img/king/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/king/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/king/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/king/Fall.png",
      framesMax: 2,
    },
    attack: {
      imageSrc: "./img/king/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/king/Take Hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/king/Death2.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: -145,
      y: 20,
    },
    width: 140,
    height: 100,
  },
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  //fire1.update()
  //fire2.update()
  c.fillStyle = "rgba(255,255,255,0.05)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // player jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy movement
  if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // player attack collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 2
  ) {
    player.isAttacking = false;
    enemy.takeHit();
    // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  // player misses
  if (player.isAttacking && player.framesCurrent === 2) {
    player.isAttacking = false;
  }

  // enemy attack collision
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    player.takeHit();
    // document.querySelector('#playerHealth').style.width = player.health + '%'
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  // enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // determine winner
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

window.addEventListener("load", function () {
  animate();
});

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.position.y > 350) {
          player.velocity.y = -15;
        }
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.position.y > 350) {
          enemy.velocity.y = -15;
        }
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
