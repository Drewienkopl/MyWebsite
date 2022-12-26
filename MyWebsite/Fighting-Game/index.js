const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 693,
        y: 219,
    },
    imageSrc: './img/shop.png',
    scale: 2.3,
    framesMax: 6
})

//new player
const player = new Fighter ({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 150,
        y: 10
    },
    offset: {
        x: 0,
        y: 0,
    },
    //player animations
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 156
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - red silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6,
        },
    },
    //player attackBox
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 140,
        height: 50
    }
})

const enemy = new Fighter ({
    position: {
        x: 800,
        y: 150
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: -50,
        y: 0,
    },
    //enemy animations
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/takeHit - red silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
        },
    },
    //enemy attackBox
    attackBox: {
        offset: {
            x: -190,
            y: 50,
        },
        width: 150,
        height: 50
    }
})

console.log(player)

const keys = {
    //player keys
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    w: {
        pressed: false
    },

    //enemy keys
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement

    if (keys.a.pressed && player.lastKey === 'a' && player.position.x >= 0) {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x <= 970) {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    
    //player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movement

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x >= 0) {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x <= 970) {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect for collision

        //player attacks & enemy gets hit
    if (RectangularCollision({
        rectangle1: player,
        rectangle2: enemy,
    }) &&
        player.isAttacking && 
        player.frameCurrent === 4
        ) {
        enemy.takeHit()
        player.isAttacking = false

        //sztywne zmiejszenie sie zycia
//        document.querySelector('#current_enemy_health').style.width = enemy.health + '%'

        //animacja zmiejszenia sie zycia
        gsap.to('#current_enemy_health', {
            width: enemy.health + '%'
        })
        console.log('player attack succesful');
    }

        //if player misses
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

        //enemy attacks & player gets hit
    if (RectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
    }) &&
        enemy.isAttacking && 
        enemy.frameCurrent === 2
        ) {
        player.takeHit()
        enemy.isAttacking = false

        //sztywne zmiejszenie sie zycia
//        document.querySelector('#current_player_health').style.width = player.health + '%'

        //animacja zmiejszenia sie zycia
        gsap.to('#current_player_health', {
            width: player.health + '%'
        })
        console.log('enemy attack succesful');
    }

        //if enemy misses
    if (enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
///    console.log(event.key)   //pokazuje klikniete klawisze na konsoli
    if (!player.dead) {
 
    switch (event.key) {
        //player keys
        
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            if (player.velocity.y === 0)
            {player.velocity.y = -20}
            break
        case ' ':
            player.attack()
            break  
        }
    }

    if (!enemy.dead) {

    switch (event.key) {
        //player keys
        
        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (enemy.velocity.y === 0)
            {enemy.velocity.y = -20}
            break
        case 'ArrowDown':
            enemy.attack()
            break
        }
    }
///    console.log(event.key)   //pokazuje klikniete klawisze na konsoli
})

window.addEventListener('keyup', (event) => {
    //player keys
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }

    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
///    console.log(event.key)   //pokazuje klikniete klawisze na konsoli
})

