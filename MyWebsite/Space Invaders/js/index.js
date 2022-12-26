const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

console.log(scoreEl)

canvas.width = 1024
canvas.height = 576

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    space: {
        pressed: false
    },
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: true
}

let score = 0

console.log(randomInterval)

//creates random stars
for (let i = 0; i < 100; i++){
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.3
        },
        radius: Math.random() * 2,
        color: 'white',
        opacity: 0.5
    })
)
}

//creates invader and player hit particles
function createParticles({object, color, fades}) {
    for (let i = 0; i < 15; i++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#BAA0DE',
            opacity: 1,
            fades
        })
    )
}
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, i) => {

        //makes stars appear at top again
        if (particle.position.y - particle.radius >= 
            canvas.height) {
                particle.position.x = Math.random() * canvas.width
                particle.position.y = -particle.radius
            }

        //particles are deleted if they dissapear
        if (particle.opacity <= 0) {
            setTimeout(() =>{
                particles.splice(i, 1)
            }, 0)
        } else {
        particle.update()
        }
    })

//    console.log(particles)

    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() =>{
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else {
            invaderProjectile.update()
        }
        //invader hitting player
        if (invaderProjectile.position.y + invaderProjectile.height >= 
            player.position.y &&
            invaderProjectile.position.y <= 
            player.position.y + player.height && 
            invaderProjectile.position.x + invaderProjectile.width >= 
            player.position.x && 
            invaderProjectile.position.x <= 
            player.position.x + player.width) {

                setTimeout(() =>{
                    invaderProjectiles.splice(index, 1)

                    player.health -= 20

                    gsap.to('#current_player_health', {
                        width: player.health + '%'
                    })
                    console.log('enemy attack succesful');

                       if (player.health <= 0) {
                            player.opacity = 0
                            game.over = true

                            console.log('you lose')

                            setTimeout(() => {
                                game.active = false
                            }, 1700)
                    }
                }, 0)

                createParticles({
                    object: player,
                    color: 'white',
                    fades: true
                })
            }
    })

    //clearing out projectiles that are out of bounds
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= -200) {
            setTimeout(() =>{
                projectiles.splice(index, 1)
            }, 0)
        } else {
        projectile.update()
        }
    })
        //console.log(invaderProjectiles)
    //grup of invaders
    grids.forEach((grid, gridIndex) => {
        grid.update()

            //spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.
            length)].shoot(
            invaderProjectiles)
    }

        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})

            //projectiles hit enemies
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= 
                    invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= 
                    invader.position.x && 
                    projectile.position.x - projectile.radius <= 
                    invader.position.x + invader.width && 
                    projectile.position.y + projectile.radius >= 
                    invader.position.y
                    ) {

                        setTimeout(() => {
                            const invaderFound = grid.invaders.find(
                                (invader2) => invader2 === invader)
                            const projectileFound = projectiles.find(
                                (projectile2) => projectile2 === projectile)

                                //remove invader and projectile
                            if (invaderFound && projectileFound) {
                                score += 100
                                console.log(score)
                                scoreEl.innerHTML = score

                                createParticles({
                                    object: invader,
                                    fades: true
                                })

                                grid.invaders.splice(i, 1)
                                projectiles.splice(j, 1)

                                if (grid.invaders.length > 0) {
                                    const firstInvader = grid.invaders[0]
                                    const lastInvader = grid.invaders[grid.
                                        invaders.length - 1]

                                    grid.width = 
                                        lastInvader.position.x - 
                                        firstInvader.position.x + 
                                        lastInvader.width
                                    grid.position.x = firstInvader.position.x
                                } else
                                grids.splice(gridIndex, 1)
                            }
                        }, 0)
                    }
            })
        })
    })

    //player moving on velocity x
    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -0.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
    //player moving on velocity y
    if (keys.w.pressed && player.position.y >= 0) {
        player.velocity.y = -7
    } else if (keys.s.pressed && player.position.y + player.height <= canvas.height) {
        player.velocity.y = 7
    } else {
        player.velocity.y = 0
    }
//    console.log(frames)
    //spawning enemies
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
        console.log(randomInterval)
    }

    frames++
}

animate()

addEventListener('keydown', ({key}) => {
    if (game.over) return

    switch (key) {
        case 'a':
//            console.log('left')
            keys.a.pressed = true
            break
        case 'd':
//            console.log('right')
            keys.d.pressed = true
            break
        case 'w':
//            console.log('up')
            keys.w.pressed = true
            break
        case 's':
//            console.log('down')
            keys.s.pressed = true
            break
        case ' ':
//            console.log('shoot')
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'a':
//            console.log('left')
            keys.a.pressed = false
            break
        case 'd':
//            console.log('right')
            keys.d.pressed = false
            break
        case 'w':
//            console.log('up')
            keys.w.pressed = false
            break
        case 's':
//            console.log('down')
            keys.s.pressed = false
            break
        case ' ':
//            console.log('shoot')
            keys.space.pressed = false
            break
    }
})