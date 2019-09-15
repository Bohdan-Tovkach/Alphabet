<template>
    <div id="parent">
        <div v-if="$store.state.loading">
            <v-overlay>
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
        </div>

        <div class="btn-wrapper">
            <v-btn class="edit-pencil" v-if="$store.state.verification && item" text><v-icon>far fa-edit</v-icon></v-btn>
        </div>

        <div class="card">
            <v-card 
                class="letter-card"
                ref="letterCard"
                @click="playSound(sound); showDetailCard(word);"
                outlined
                color="green"
                hover
                v-if="item"
                >
                <v-card-title class="display-4"><b>{{item.letter.toUpperCase()}}</b></v-card-title>
            </v-card>
        </div>

        <v-card class="display-1" v-if="word === $store.state.currentCard" style="display: none">
            <span @click="$store.dispatch('clearCard')" class="x"><v-icon>fas fa-times</v-icon></span>
            <v-card-title id="title-word">
                <p>&nbsp;{{word}} {{$vuetify.breakpoint.name}} <v-btn color="grey lighten-1" style="float: left" @click="playSound(detailSound)"><v-icon>fas fa-volume-up</v-icon></v-btn></p>
            </v-card-title>
            <v-card-text class="titleimage" >
                <img :style="imgSize" @load="imageOnload" :src="image">
            </v-card-text>
        </v-card>

        <div v-if="error">
            {{error.message}}
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    props: ['value'],
    data: () => ({
        item: null,
        itemObject: null,
        word: null,
        sound: null,
        detailSound: null,
        error: null,
        image: null,
        getCardAbsolutePosition: null,
    }),
    methods: {
        getLetters (value) {
            firebase.database().ref('alphabet/').child(value + '/').once('value').then(snap => {
                this.item = snap.val()
                this.itemObject = this.item.words
                this.sound = new Audio(this.item.sound)
                this.detailSound = new Audio(this.item.words.sound)
                this.word = this.item.words.word
                this.image = this.item.words.image
                this.$store.dispatch('disable_loading')
            })
            .catch(err => {console.log(err)})
        },
        playSound(audio) {
                audio.play()
        },
        showDetailCard(value) {
            this.$store.dispatch('showCard', value)
        },
        imageOnload() {
            setTimeout(() => {
                document.querySelector('.display-1').style="display: block"

                let height = this.$store.state.heightOnScroll
                let width = this.$store.state.widthOnScroll
                let innerHeight = this.$store.state.height

                let getAdditionalCard = document.querySelector('.display-1')
                let getAdditionalCardPosition = getAdditionalCard.getBoundingClientRect()
                let getCardAbsolutePosition = this.$refs.letterCard.$el.getBoundingClientRect()
                let heightAfterEmerge = document.querySelector('body').scrollHeight

                window.scrollBy({ 
                    top: Math.floor(getCardAbsolutePosition.y - getCardAbsolutePosition.height), 
                    left: 0, 
                    behavior: 'smooth' 
                });

                if (getAdditionalCardPosition.right > width) {
                    getAdditionalCard.style.right = `${Math.floor(width - getCardAbsolutePosition.right)}.px`
                }
                if (getAdditionalCardPosition.bottom >= height || heightAfterEmerge > height){
                    getAdditionalCard.style.bottom = `${Math.floor(innerHeight - getCardAbsolutePosition.top + 20)}.px`
                }
            }, 200)
                
        },
    },
    computed: {
        imgSize () {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': return 'max-height: 180px; max-width: 180px' // '220px'
                case 'sm': return 'max-height: 200px; max-width: 200px' // '400px'
                case 'md': return 'max-height: 250px; max-width: 250px' // '500px'
                case 'lg': return 'max-height: 300px; max-width: 300px' // '600px'
                case 'xl': return 'max-height: 330px; max-width: 330px' // '800px'
            }
        },
    },
    created() {
        this.getLetters(this.value)
    }
}
</script>

<style scoped>
    div#parent:hover > .btn-wrapper{
        display: block;
    }
    #title-word > p::first-letter{
        color: red;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 30px;
    }
    .btn-wrapper{
        position: relative;
        top: 20px;
        right: 20px;
        width: auto;
        height: auto;
        background: black;
        display: none;
    }
    .edit-pencil{
        z-index: 2;
        background:  #738d6ccb;
        float: right;

    }
    .letter-card{
        padding: 10px;
    }
    .card{
        margin: 20px;
    }

    .display-1{
        position: absolute;
        z-index:3;
        box-shadow: 0 6px 12px 0 black;
    }
    .display-4{
        color: white;
        text-shadow: 2px 2px 18px black;
    }
    .x{
        display: inline-block;
        position: absolute;
        right: 9px;
        top: 2px;
        color: #333333;
        cursor: pointer;
    }
    .v-card-text, img {;
        max-width: auto !important;
        height: auto;
        width: auto;
    }
</style>