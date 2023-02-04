<template>
<div>
    <v-card id="login-bg" :height="screenHeight" flat tile>
        <v-layout style="height:95vh" justify-center align-center>
            <v-card outlined width="600" height="300" flat>
                <v-card-title style="background: #aec785;color: white;margin-bottom: -40px;">
                    <v-layout justify-center align-center>
                        <h3>ADMIN - LOGIN</h3>
                    </v-layout>
                </v-card-title>
                <v-layout fill-height>
                    <v-flex xs6>
                        <v-layout fill-height justify-center align-center>
                            <v-form @keyup.enter.native="login()" ref="form">
                                <v-container>
                                    <v-row>
                                        <v-col style="height: 45px;" cols="12" md="12">
                                            <v-text-field :rules="[rules.required ,rules.regex]" v-model="user" autocomplete="new-user" hide-details persistent-placeholder placeholder=" " outlined dense prepend-inner-icon="mdi-account-circle-outline" label="Account"></v-text-field>
                                        </v-col>
                                        <v-col style="height: 45px;" cols="12" md="12">
                                            <v-text-field :rules="[rules.required]" v-model="password" autocomplete="new-password" hide-details persistent-placeholder placeholder=" " @click:append="showpass = !showpass" :append-icon="showpass ? 'mdi-eye-off' : 'mdi-eye'" :type="showpass ? 'text' : 'password'" outlined dense prepend-inner-icon="mdi-lock" label="Password"></v-text-field>
                                        </v-col>

                                        <v-col cols="12" md="12">
                                            <v-btn style="margin-top:15px" :disabled="loading" :loading="loading" small width="100%" @click="login()" color="success">Login</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-form>
                        </v-layout>
                    </v-flex>
                    <v-flex xs6>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-layout>
        <v-footer id="footerl" style="padding:0px;background: white;height: 5vh;" height="20">
            <v-layout wrap>
                <h3 style="color: blue;"></h3>
            </v-layout>
        </v-footer>
    </v-card>
</div>
</template>

<script>
import {
    screenHeight
} from "../Mixins/screenheight";
import axios from "axios";
// import md5 from "js-md5";
export default {
    mixins: [screenHeight],
    data: () => ({
        showpass: false,
        user: '',
        password: '',
        loading: false,
        rvcdata: [],
        loadingrvc: false,
        rules: {
            required: value => !!value || "",
            regex: v => /^[a-z0-9]+([-_\s]{1}[a-z0-9]+)*$/i.test(v) || ""
        },
    }),
    mounted() {
    },
    created() {
      this.RedirectLogin();
    },
    methods: {
        login() {
            if (this.$refs.form.validate()) {
                this.loading = true;
                let datatosend = {
                  userName: this.user,
                  password: this.password,
                };
                let config = {};
                axios
                    .post(this.$store.state.api + 'auth/login', datatosend, config)
                    .then(resp => {
                        this.loading = false;
                        console.log(resp);
                        if (resp.data.status == 200) {
                            this.$store.state.token = resp.data.token;
                            this.$cookies.set(
                                "token", resp.data.token
                            );
                            this.$router.push("/home");
                        } else {

                            this.$store.state.Snack.msg = resp.data.message;
                            this.$store.state.Snack.color = "error";
                            this.$store.state.Snack.show = true;
                        }
                    })
                    .catch(err => {
                        this.$store.state.Snack.msg = err.message;
                        this.$store.state.Snack.color = "error";
                        this.$store.state.Snack.show = true;
                        this.loading = false;
                        console.log(err.message)
                    });
            }
        },
        RedirectLogin() {

            var token = this.$route.query.token || '';
            if (token != '') {
                this.loading = true;
                let datatosend = {};
                let config = {
                    headers: {
                        Authorization: token
                    }
                };
                axios
                    .post(this.$store.state.api + 'auth/ping', datatosend, config)
                    .then(resp => {
                        this.loading = false;
                        console.log('on');
                        console.log(resp);
                        if (resp.data.status == 200) {
                          this.$router.push("/home");
                        }
                    })
                    .catch(err => {
                        this.$store.state.Snack.msg = err.message;
                        this.$store.state.Snack.color = "error";
                        this.$store.state.Snack.show = true;
                        this.loading = false;
                        console.log(err.message)
                    });
            }
        }
    }
}
</script>

<style scoped>
#login-bg {
    background: linear-gradient(90deg, #feedd1 33%, #FFFFFF 33%)
}

#footerl {
    background: linear-gradient(90deg, #feedd1 33%, #FFFFFF 33%) !important
}
</style>
