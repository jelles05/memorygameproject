'use strict'

// eslint-disable-next-line no-unused-vars
const Game = (function () {
    class MemoryGame {
        constructor (imagesAnimaux, imagesFleurs, valueSelect, imageFront, imagesContainer, divImageContainersList, boutonStartOrStop, timer, counter, matchedImages, endGameMessage, triesMade, tempsPris, meilleurTemps) {
            this.imagesAnimaux = imagesAnimaux
            this.imagesFleurs = imagesFleurs
            this.valueSelect = valueSelect
            this.imageFront = imageFront
            this.imagesContainer = imagesContainer
            this.divImageContainersList = divImageContainersList
            this.nbPairesTrouvees = 0
            this.imagesOuvertes = []
            this.imagesTrouvees = []
            this.boutonStartOrStop = boutonStartOrStop
            this.tries = 0
            this.timer = timer
            this.counter = counter
            this.matchedImages = matchedImages
            this.second = 0
            this.minute = 0
            this.interval = ''
            this.tempsDeJeux = 0
            this.endGameMessageBox = endGameMessage
            this.triesMadeBox = triesMade
            this.tempsPrisBox = tempsPris
            this.meilleurTempsBox = meilleurTemps
        }

        // melanger les images
        shuffleImages (arrayImages) {
            let indexActuel = arrayImages.length
            let indexRandom
            while (indexActuel !== 0) {
                indexRandom = Math.floor(Math.random() * indexActuel)
                indexActuel--
                [arrayImages[indexActuel], arrayImages[indexRandom]] = [arrayImages[indexRandom], arrayImages[indexActuel]]
            }
        }

        // creer les containers des images et les ajouter
        createImageContainers (imgBack, id) {
            const idImg = imgBack
            // creation des containers
            const divImageContainer = document.createElement('div')
            divImageContainer.classList.add('divImageContainer')
            divImageContainer.setAttribute('id', idImg.replace('.jpg', '') + id)
            const divImageFlipper = document.createElement('div')
            divImageFlipper.classList.add('divImageFlipper')
            const divImageFront = document.createElement('div')
            divImageFront.classList.add('divImageFront')
            const divImageBack = document.createElement('div')
            divImageBack.classList.add('divImageBack')
            // ajout
            divImageFlipper.appendChild(divImageFront)
            divImageFlipper.appendChild(divImageBack)
            divImageContainer.appendChild(divImageFlipper)
            // creation des images
            const imageFront = document.createElement('img')
            imageFront.setAttribute('src', 'images/' + this.imageFront)
            const imageBack = document.createElement('img')
            imageBack.setAttribute('src', 'images/' + imgBack)
            // ajout
            divImageFront.appendChild(imageFront)
            divImageBack.appendChild(imageBack)
            // retour
            return divImageContainer
        }

        // afficher les images dans le document
        displayImages () {
            let images = []
            if (this.valueSelect.value === 'animaux') {
                this.shuffleImages(this.imagesAnimaux)
                images = this.imagesAnimaux
            } else {
                this.shuffleImages(this.imagesFleurs)
                images = this.imagesFleurs
            }

            this.imagesContainer.innerHTML = ''
            for (let counter = 0; counter < images.length; counter++) {
                const divImageContainer = this.createImageContainers(images[counter], counter + 1)
                this.imagesContainer.appendChild(divImageContainer)
            }
        }

        // ouvrir un image
        flipImageOpen (divImageContainer) {
            if (this.imagesOuvertes.length < 2) {
                divImageContainer.classList.toggle('flipped')
                this.disableMatchedImage(divImageContainer)
                this.openImage(divImageContainer)
            }
        }

        // fermer une image
        flipImageClosed (divImageContainer) {
            divImageContainer.classList.toggle('flipped')
            this.enableMatchedImage(divImageContainer)
        }

        // ajouter un image a la liste des images ouvertes, max lenght = 2
        openImage (divImageContainer) {
            this.imagesOuvertes.push(divImageContainer)
        }

        // retirer images de la liste des images ouvertes
        closeImages () {
            this.imagesOuvertes = []
        }

        // rendre une image non clickable
        disableMatchedImage (divImageContainer) {
            divImageContainer.style.pointerEvents = 'none'
        }

        // rendre une image clickable
        enableMatchedImage (divImageContainer) {
            divImageContainer.style.pointerEvents = 'auto'
        }

        // verifier si les deux images ouvertes font du match else tourner les images a nouveau
        checkImagesMatch () {
            let match = false
            if (this.imagesOuvertes.length === 2) {
                const img1 = this.imagesOuvertes[0]
                const img2 = this.imagesOuvertes[1]
                this.tryCounter()
                if (img1.id.charAt(3) === img2.id.charAt(3)) {
                    match = true
                    this.nbPairesTrouvees++
                    this.matchedImages.textContent = this.nbPairesTrouvees + '/8'
                    img1.classList.toggle('matched')
                    img2.classList.toggle('matched')
                    this.imagesTrouvees.push(img1)
                    this.imagesTrouvees.push(img2)
                }
            }
            return match
        }

        startTimer () {
            this.interval = setInterval(() => {
                this.timer.innerHTML = `${this.minute} mins ${this.second} secs`
                this.second++
                if (this.second === 60) {
                    this.minute++
                    this.second = 0
                }
                if (this.minute === 60) {
                    this.minute = 0
                }
            }, 1000)
        }

        // fonction qui increment le nombre d'essaie
        tryCounter () {
            this.tries++
            this.counter.innerHTML = this.tries
        }

        stopTimer () {
            clearInterval(this.interval)
            this.tempsDeJeux = this.timer.innerHTML
        }

        // rendre tout les images pas cliquable
        disableAllImage (divImages) {
            for (let i = 0; i < divImages.length; i++) {
                this.disableMatchedImage(divImages[i])
            }
        }

        // rendre tout les images cliquable
        enableAllImage (divImages) {
            for (let i = 0; i < divImages.length; i++) {
                this.enableMatchedImage(divImages[i])
            }
        }

        // afficher tous les images pendant un certain temps
        showAllImages () {
            for (let i = 0; i < this.divImageContainersList.length; i++) {
                this.divImageContainersList[i].classList.toggle('flipped')
            }
            setTimeout(() => {
                for (let i = 0; i < this.divImageContainersList.length; i++) {
                    this.divImageContainersList[i].classList.toggle('flipped')
                }
                this.enableAllImage(this.divImageContainersList)
            }, 2000)
        }

        // reset les elements du jeu
        gameStart () {
            this.boutonStartOrStop.textContent = 'Nouvelle Partie'
            this.displayImages()
            this.disableAllImage(this.divImageContainersList)
            this.nbPairesTrouvees = 0
            this.tries = 0
            this.second = 0
            this.minute = 0
            this.imagesOuvertes = []
            this.imagesTrouvees = []
            this.counter.innerHTML = '0'
            this.timer.innerHTML = '0 mins 0 secs'
            this.matchedImages.innerHTML = '0/8'
        }

        // ajouter la logique du jeu a tous les container des images
        playGame (divImageContainer) {
            // ouvrir l'image s'il y a moins de 2 ouvertes
            this.flipImageOpen(divImageContainer)
            if (this.imagesOuvertes.length === 2) {
                // recuperer les 2 images ouvertes
                const image1 = this.imagesOuvertes[0]
                const image2 = this.imagesOuvertes[1]
                // verifier si les 2 images font du match
                const imageMatch = this.checkImagesMatch()
                if (imageMatch) {
                    this.disableMatchedImage(image1)
                    this.disableMatchedImage(image2)
                } else {
                    this.disableAllImage(this.divImageContainersList)
                    setTimeout(() => {
                        this.flipImageClosed(image1)
                        this.flipImageClosed(image2)
                        if (this.imagesTrouvees.length > 0) {
                            this.enableAllImage(this.divImageContainersList)
                            this.disableAllImage(this.imagesTrouvees)
                        } else {
                            this.enableAllImage(this.divImageContainersList)
                        }
                    }, 800)
                }
                this.closeImages()
            }
            if (this.imagesTrouvees.length === this.imagesAnimaux.length) {
                setTimeout(() => {
                    this.endGame()
                }, 800)
            }
        }

        checkBestTime () {
            let newBestTime = false
            const bestTime = window.localStorage.getItem('bestTimeMemoryGame21')
            if (bestTime === null) {
                window.localStorage.setItem('bestTimeMemoryGame21', this.tempsDeJeux)
                newBestTime = true
            } else {
                const bestMinutes = parseInt(bestTime.substring(0, bestTime.indexOf('m')))
                const bestSeconds = parseInt(bestTime.split('mins')[1].split('s')[0])
                const currentMinutes = parseInt(this.tempsDeJeux.substring(0, this.tempsDeJeux.indexOf('m')))
                const currentSeconds = parseInt(this.tempsDeJeux.split('mins')[1].split('s')[0])
                const best = bestSeconds + (bestMinutes * 60)
                const current = currentSeconds + (currentMinutes * 60)
                if (current < best) {
                    window.localStorage.setItem('bestTimeMemoryGame21', this.tempsDeJeux)
                    newBestTime = true
                }
            }
            return newBestTime
        }

        // affiche le meilleure temps
        newBestTime (isBestTime) {
            if (isBestTime) {
                alert('Nouveau meilleur temps! ' + window.localStorage.getItem('bestTimeMemoryGame21'))
            }
        }

        // permet de lancer une nouvelle partie du jeu
        newGame () {
            this.endGameMessageBox.classList.add('hidden')
            this.gameStart()
            this.showAllImages()
            this.startTimer()
            // changment le nom du button
            this.boutonStartOrStop.textContent = 'Arreter la partie'
        }

        // afficher message quand le jeu est termine
        endGame () {
            this.stopTimer()
            this.triesMadeBox.textContent = this.tries
            this.tempsPrisBox.textContent = this.tempsDeJeux
            const isBestTime = this.checkBestTime()
            this.meilleurTempsBox.textContent = window.localStorage.getItem('bestTimeMemoryGame21')
            this.gameStart()
            this.endGameMessageBox.classList.remove('hidden')
            this.newBestTime(isBestTime)
        }
    }
    /**
*
* fonction qui ressoit les elements html et qui encapsule la logique du code
*/
    function gameControler (imagesContainer, divImageContainers, boutonsStartOrStop, counter, timer, matchedImages, endGameMessage, triesMade, tempsPris, meilleurTemps, quitButtons, valueSelect) {
        // images du document
        const imagesAnimaux = ['spr1.jpg', 'spr2.jpg', 'spr3.jpg', 'spr4.jpg', 'spr5.jpg', 'spr6.jpg', 'spr7.jpg', 'spr8.jpg', 'spr1.jpg', 'spr2.jpg', 'spr3.jpg', 'spr4.jpg', 'spr5.jpg', 'spr6.jpg', 'spr7.jpg', 'spr8.jpg']
        const imagesFleurs = ['spf1.jpg', 'spf2.jpg', 'spf3.jpg', 'spf4.jpg', 'spf5.jpg', 'spf6.jpg', 'spf7.jpg', 'spf8.jpg', 'spf1.jpg', 'spf2.jpg', 'spf3.jpg', 'spf4.jpg', 'spf5.jpg', 'spf6.jpg', 'spf7.jpg', 'spf8.jpg']
        const premiereImage = 'spr0.jpg'
        // instance de la classe
        const memoryGame = new MemoryGame(imagesAnimaux, imagesFleurs, valueSelect, premiereImage, imagesContainer, divImageContainers, boutonsStartOrStop[0], counter, timer, matchedImages, endGameMessage, triesMade, tempsPris, meilleurTemps)
        // reset le jeu pour la premiere fois
        memoryGame.gameStart()
        // ajouter event listener sur bouton nouvelle partie
        for (let i = 0; i < boutonsStartOrStop.length; i++) {
            boutonsStartOrStop[i].addEventListener('click', function (event) {
                // verifier si on va a commencer un nouveau jeu ou arreter la partie
                if (boutonsStartOrStop[i].textContent === 'Nouvelle Partie' || boutonsStartOrStop[i].textContent === 'Jouer à nouveau') {
                    memoryGame.newGame()
                    // ajout d'ecouteurs pour les conteneurs des images
                    for (let j = 0; j < divImageContainers.length; j++) {
                        divImageContainers[j].addEventListener('click', function (event) {
                            memoryGame.playGame(divImageContainers[j])
                        })
                    }
                } else {
                    document.location.reload()
                }
            })
        }
        // ajout event listeners pour les boutons quitter
        for (let i = 0; i < quitButtons.length; i++) {
            quitButtons[i].addEventListener('click', function () {
                window.close()
            })
        }
    }
    return {
        gameControler: gameControler
    }
})()
