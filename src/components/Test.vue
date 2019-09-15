<template>
    <div class="container">
        <h3> Its your test component</h3>
        <ul>
            <li v-if="size">{{'Height: ' + size.height}}</li>
            <li v-if="size">{{'Size: ' + size.name}}</li>
        </ul>

          <v-container class="grey lighten-5">
            <v-row no-gutters>
                <v-col
                    v-for="n in 3"
                    :key="n"
                    sm="4"
                    align="center"
                    justify="space-around"
                >
                    <v-card
                        class="pa-2"
                        outlined
                        tile
                    >
                        One of three columns
                    </v-card>
                </v-col>
            </v-row>
            
            <v-row
                class="mb-6"
                no-gutters
                >
                <v-col
                    v-for="n in 2"
                    :key="n"
                    :lg="cols[n - 1]"
                    :md="6"
                    :sm="cols[n - 1]"
                >
                    <v-card
                        class="pa-2"
                        outlined
                        tile
                        >
                            col-{{ cols[n - 1] }}
                    </v-card>
                </v-col>
            </v-row>
            
            <v-icon>
                {{$vuetify.icons.values.cancel}}
            </v-icon>

        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
        size: {}
    }),
    methods: {
        onResize() {
            this.size = {}
            this.size = this.$vuetify.breakpoint
        }
    },
    mounted () {
        this.size = this.$vuetify.breakpoint
        window.addEventListener('resize', this.onResize)
        console.log(this.size)
    },
    computed: {
        cols () {
            const { lg, sm } = this.$vuetify.breakpoint
            return lg ? [3, 9] : sm ? [9, 3] : [6, 6]
        },
    },
}
</script>

<style scoped>
    .container{
        text-align: left;
    }
    ul{
        list-style-type: none;
    }
</style>