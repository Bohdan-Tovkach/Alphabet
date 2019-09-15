<template>
<div>
    <v-card width="350" class="mx-auto mt-5">
        <v-card-title>
            <h3 class="display-1">Login</h3>
            <v-alert v-show="success" type="success">Success</v-alert>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field 
                    label="email" 
                    prepend-icon="mdi-email"
                    v-model="email"
                />
                <v-text-field 
                    label="Password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                />
            </v-form>
            <v-alert 
                v-show="error.message" 
                type="error"
                dense
                text
                >{{error.message}}</v-alert>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn color="error" @click="cancelRegister">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="signIn" color="info">Login</v-btn>
        </v-card-actions>
    </v-card>
</div>
</template>

<script>
import {firebaseApp} from '../firebaseApp.js'
export default {
    data() {
        return {
            showPassword: false,
            email: '',
            password: '',
            error: {},
            success: false,
        }
    },
    methods: {
        signIn() {
            this.error = {}
            firebaseApp.auth().signInWithEmailAndPassword(this.email, this.password)
            .catch(err => {this.error = err; console.log(err)})
            this.$forceUpdate()
            setTimeout(set => {
                if(!this.error.message){
                    this.$store.dispatch('signInForm', false)
                    this.email = ''
                    this.password = ''
                    this.error = ''
                }
            }, 5000)
        },
        cancelRegister() {
            this.$store.dispatch('signInForm', false)
        },
    },
    mounted() {
        window.addEventListener('keyup', event => {
            if (event.keyCode === 13) { 
                this.signIn()
            } else if (event.keyCode === 27) {
                this.cancelRegister()
            }
        })
    }
}
</script>

<style> 
/* Component sign in over Alphabet letter */
</style>