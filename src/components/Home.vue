<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list >
        <v-list-item @click="changeComponent('Home'); drawer = !drawer">
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="changeComponent('Alphabet'); drawer = !drawer">
          <v-list-item-action>
            <v-icon>school</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Alphabet</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="$store.state.user !== ''" @click="addForm = true">
          <v-list-item-action>
            <v-icon>add_box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title @click="changeComponent('AddLetter'); drawer = !drawer ">Add letter</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-app-bar
      app
      color="teal darken-4"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{vnodeTag}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="$store.state.user === '' ? toSignIn() : toSignOut()"><v-icon v-if="sign">fas fa-door-open</v-icon><v-icon v-if="!sign">far fa-address-book</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <v-overlay v-if="$store.state.signInForm && $store.state.user === ''">
        <SignIn></SignIn>
      </v-overlay>
      <About v-if="vnodeTag === 'Home'"></About>
      <v-row
        v-if="vnodeTag === 'Alphabet'" 
        justify="center">
        <v-col class="col-md-11">
          <Alphabet></Alphabet>
        </v-col>
      </v-row>
      <v-row 
          v-if="vnodeTag === 'AddLetter'"
          justify="center">
          <v-col class="col-md-4">
              <Additem></Additem>
          </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import About from './About.vue'
import Alphabet from './Alphabet.vue'
import Additem from './AddItem.vue'
import {firebaseApp} from '../firebaseApp'
import SignIn from './Signin.vue'
export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: false,
      addForm: false,
      AuthStateValue: false,
      sign: '',
      vnodeTag: 'Alphabet',
    }),
    components: {
        Additem,
        SignIn,
        Alphabet,
        About,
    },
    methods: {
        changeComponent(tag){
          this.vnodeTag = tag
          console.log(tag)
        },
        /*
        toHome(tag) {
            this.$router.push('/')
            console.log(tag)
        }
        
        toAlphabet() {
            this.$router.push('/alphabet')
        },
        */
        toSignIn() {
            setTimeout(() => {
              this.$store.dispatch('signInForm', true)
            }, 285);
            //console.log(this.$store.state.user)
        },
        toSignOut() {
            console.log('handle method To toSignOut')
            this.$store.dispatch('signOut') // Resolve problem with Authentication (in this time, if you enter ivalid password SignOut emerge)
            firebaseApp.auth().signOut()
            .catch(err => console.log(err))
            this.$store.dispatch('signInForm', false)
            this.$forceUpdate()
            this.vnodeTag = 'Home'
            
        }
    },
    mounted() {
      firebaseApp.auth().onAuthStateChanged(user => {
            if(user) {
              this.sign = true
            } else {
              this.sign = false
            }
          })
    },
}
</script>
