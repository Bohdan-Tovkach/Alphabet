<template>
    <v-container>
        <h1 class="text-center">Learn Alphabet for children</h1>
            <v-row class="letter-box">
                <Letter
                    v-for="(value, index) in letter"
                    @click.native="onResizePage()"
                    padding="10px"
                    margin="10px"
                    v-if="letter"
                    :value="value"
                    :key="index"
                ></Letter>
            </v-row>
        <v-overlay v-if="$store.state.loading">
            <v-progress-circular indeterminate size="33"></v-progress-circular>
        </v-overlay>
        <div v-if="error" >
            <v-row justify="center">
                <v-col class="col-md-10">
                    <v-alert
                        color="primary"
                        dark
                        icon="mdi-vuetify"
                        border="left"
                        prominent
                        >{{error}}
                    </v-alert>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import firebase from 'firebase'
import Letter from './Letter.vue'
    export default {
        data: () => ({
            item: {},
            letter: [],
            error: null,
        }),
        methods: {
            getLetters () {
                this.$store.dispatch('enable_loading')
                firebase.database().ref('alphabet/').once('value').then(snap => {
                    if(snap.val() !== null){
                        this.item = snap.val()
                        for(let x in this.item) {
                            this.letter.push(x)
                        }
                    } else {
                        this.error = `No items! Please add in "Add Letter" page`
                        this.$store.dispatch('disable_loading')
                    }
                    this.letterSort('rus', this.letter)
                    //console.log(this.letter)
                    //console.log(this.item)

                })
                .catch(err => {this.error = err; this.$store.dispatch('disable_loading')})
            },
            letterSort(lang, letters) {
                letters.sort(new Intl.Collator(lang).compare);
                return letters;
            },
            onResizePage() {
                    let scrollWidth = document.querySelector('body').scrollWidth
                    let scrollHeight = document.querySelector('body').scrollHeight
                    let height = window.innerHeight
                    let width = window.innerWidth
                    this.$store.dispatch('widht_on_scroll', scrollWidth)
                    this.$store.dispatch('height_on_scroll', scrollHeight)
                    this.$store.dispatch('height', height)
                    this.$store.dispatch('width', width)
                    console.log('* width: ' + this.$store.state.widthOnScroll + ' | ' + 'height: ' + this.$store.state.heightOnScroll + ' *')
            },
        },
        /*
        beforeRouteEnter (to, from, next) {
            firebase.database().ref('alphabet/').once('value').then(snap => {
                next(vm => {
                    vm.item = snap.val()
                    console.log(vm.item)
                    next()
                    // access to component instance via `vm`
                })
            })
        },
        */
        components: {
            Letter
        },
        created () {
            this.getLetters()
        },
        mounted() {
            this.onResizePage()
            window.addEventListener('resize', this.onResizePage, { passive: true })
        },
        beforeDestroy(){
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', this.onResizePage, { passive: true })
            }
        }
    }
</script>

<style scoped>
    .text-center{
        margin-top: 25px;
    }

</style>