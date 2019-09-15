<template>
    <v-form >
        <h2>Add item</h2>
        <v-text-field
            v-model="letter"
            :error-messages="itemErrors"
            :counter="10"
            label="Letter"
            @input="$v.word.$touch()"
            @blur="$v.word.$touch()"
        ></v-text-field>

        <v-file-input  
            v-show="letter !== null"
            accept="audio/*"
            v-model="sound" 
            type="file" 
            label="Sound file"
            @input="$v.sound.$touch()"
            @blur="$v.sound.$touch()"
            ></v-file-input>
        <v-alert
            text
            dense
            v-model="alert"
            color="teal"
            icon="mdi-clock-fast"
            border="left"
            >
                Information uploaded. You can add else additional information or add new Item
        </v-alert>
        <v-btn 
            v-if="typeof sound.name === 'string'" 
            class="d-block mb-4" @click="addWord = !addWord"
        >
            {{ !addWord ? 'Add additional info' : 'Cancel'}}
        </v-btn>

        <v-text-field v-show="addWord"
            v-model="word"
            :error-messages="wordErrors"
            :counter="10"
            label="Word"
            @input="$v.word.$touch()"
            @blur="$v.word.$touch()"
        ></v-text-field>

        <v-file-input v-show="addWord"
            show-size
            accept="audio/*"
            v-model="detailSound" 
            :error-messages="soundDetailErrors"
            placeholder="Upload your sound"
            label="Sound for your ditail (card)"
            @input="$v.detailSound.$touch()"
            @blur="$v.detailSound.$touch()"
        >
        </v-file-input>

        <v-file-input v-show="addWord"
            show-size
            accept="image/*"
            v-model="detailImage" 
            :error-messages="imageErrors"
            placeholder="Upload your image"
            label="Image for your ditail (card)"
            @input="$v.detailImage.$touch()"
            @blur="$v.detailImage.$touch()"

        >
        </v-file-input>
        <div v-show="letter">
            <v-btn
                @click="wordExistVerify(letter); uploadLoader = !uploadLoader" 
                color="blue-grey"
                class="mr-4 white--text"
            >Upload
            </v-btn>
            <v-btn style="float: right" @click="clear" color="error">Clear</v-btn>
        </div>
    </v-form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import firebase from 'firebase'

export default {
    mixins: [validationMixin],

    validations: {
        letter: {required, maxLength: maxLength(1)},
        sound: {required},
        word: {required, maxLength: maxLength(1)},
        detailSound: {required},
        detailImage: {required}
    },

    data: () => ({
        letter: null,
        sound: [],
        word: null,
        detailSound: [],
        detailImage: [],
        addWord: false,
        count: 0,
        alert: false,
        uploadLoader: false,
    }),

    computed: {
        itemErrors () {
            const errors = []
            if (!this.$v.letter.$dirty) return errors
                // 67 string means push 'Name must be at most 10 characters long' in $v.item.maxLenght and errors []
                !this.$v.letter.required && errors.push('Letter is required.')
                return errors
        },
        soundErrors () {
            const errors = []
            if (!this.$v.sound.$dirty) return errors
                !this.$v.sound.required && errors.push('Sound is required')
                return errors
        },
        wordErrors () {
            const errors = []
            if (!this.$v.word.$dirty) return errors
                !this.$v.word.required && errors.push('One word required')
                return errors
        },
        imageErrors () {
            const errors = []
            if (!this.$v.detailImage.$dirty) return errors
                !this.$v.detailImage.required && errors.push('Image is requeired')
                return errors
        },
        soundDetailErrors () {
            const errors = []
            if (!this.$v.detailSound.$dirty) return errors
                !this.$v.detailSound.required && errors.push('Sound is required')
                return errors
        },
    },

    methods: {
        submit () {
            this.$v.$touch()
        },
        clear () {
            this.$v.$reset()
            this.letter = null
            this.sound = []
            this.word = null
            this.detailSound = []
            this.detailImage = []
        },
        clearAddInfo () {
            setTimeout(() => {
                this.word = null
                this.detailSound = []
                this.detailImage = []
                this.sound = []
                this.addWord = false
                this.uploadLoader = false
                this.alert = true
            }, 3000)
        },
        wordExistVerify (value) {
            firebase.database().ref('alphabet/').child(value + '/').once('value', snap => {
                if(snap.exists()){
                    console.log('************')
                    console.log('letter exist')
                    let obj = snap.val()
                    let count = []
                    for(let iter in obj) {
                        let word = (iter.split("_"))
                        let n = word.splice(0, 1);
                        let num = Number(word[0])
                        if(typeof num === 'number'){
                            count.push(num)
                        }
                    }
                    if(count[count.length -1] !== null && !Number.isNaN(count[count.length -1])){ // In this way (2 condition) we check if value !== NaN (ECMA 6). Method 2: (ECMA 5) count[count.length -1] === count[count.length -1];
                        this.count = count[count.length -1]
                        this.count++
                        this.handleAll()
                        this.clearAddInfo()
                        console.log('Additional word exist last count in words: ' + this.count + ' Work Method to add additional info. Count ++')
                    } else {
                        this.count = 1
                        this.handleAll()
                        this.clearAddInfo()
                        console.log('Letter exist but Additional info is empty. Work Method to add additional info')
                    }
                } else {
                    this.count = 1
                    this.handleAll()
                    this.clearAddInfo()
                    console.log('Letter not exist, so add info. Count = ' + this.count + ' Work Method to add info')
                }
            })
        },

        async handleAll () {
            this.uploadLoader = true
            if(this.letter !== null){this.upLetter(this.letter)}
            if(typeof this.sound.name === 'string'){this.upSound(this.sound)}
            if(this.word !== null){this.upWord(this.word)}
            if(typeof this.detailSound.name === 'string'){this.upDetailSound(this.detailSound)}
            if(typeof this.detailImage.name === 'string'){this.upDetailImage(this.detailImage)}
        },
        upLetter (item) {
            firebase.database().ref('alphabet/').child(this.letter + '/').update({letter:item})
            .catch(err => console.log(err))
        },
        upSound (item) {
            firebase.storage().ref(this.letter + '/' + item.name).put(item)
            .then(response => {
                response.ref.getDownloadURL().then((downloadURL) => {
                    firebase.database().ref('alphabet/').child(this.letter + '/').update({sound:downloadURL})
                    .catch(err => console.log(err))
                })
            })
        },
        upWord (item) {
            firebase.database().ref('alphabet/').child(this.letter + '/').child(`word_${this.count}/`).update({word:item})
            .catch(err => console.log(err))
        },
        upDetailSound (item) {
            firebase.storage().ref(this.letter + '/' + this.word + '/' + item.name).put(item)
            .then(response => {
                response.ref.getDownloadURL().then((downloadURL) => {
                    firebase.database().ref('alphabet/').child(this.letter + '/').child(`word_${this.count}/`).update({sound:downloadURL})
                    .catch(err => console.log(err))
                })
            })
        },
        upDetailImage (item) {
            firebase.storage().ref(this.letter + '/' + this.word + '/'  + item.name).put(item)
            .then(response => {
                response.ref.getDownloadURL().then((downloadURL) => {
                    firebase.database().ref('alphabet/').child(this.letter + '/').child(`word_${this.count}/`).update({image:downloadURL})
                    .catch(err => console.log(err))
                })
            })
        }
        /*
                We may upload file in few ways: 

                1. <input type="file" @change="uploadTitleSound" />
                    uploadTitleSound(event) {
                        const files = event.target.files[0];
                    }
                2. <input type="file" @change="uploadTitleSound" />
                    in 'data' we add property "files:[]", or "file:''"
                    uploadTitleSound(){
                        this.files = this.$refs.myFiles.files
                    }
                3. Use <v-file-input @change="uploadTitleSound" v-model="files">
                    of course we should create in data property files: [] (because we use v-model - directive)
                    Then we just use this.files to retrieve our data
            */
        
    }
}
</script>