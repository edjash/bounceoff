<script lang="ts" setup>
import AuthLayout from './AuthLayout.vue';
import { ref } from 'vue';
import apiClient from '../../components/apiClient';
import router from '../../router';


const required = (val: string) => {
    if (val) {
        return true;
    }
    return 'Field is required';
};

const email = ref('');
const password = ref('');

function onSubmit() {
    //
    apiClient.post('/login', { email: email.value, password: password.value }).then((response) => {
        if (response.data.userInfo) {
            router.push('/');
        }
    });
}
</script>

<template>
    <AuthLayout>
        <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input filled v-model="email" label="Email Address" :rules="[required]" />

            <q-input filled type="password" v-model="password" label="Password" />

            <div>
                <q-btn label="Submit" type="submit" color="primary" />
            </div>
        </q-form>
    </AuthLayout>
</template>>

<style>
</style>