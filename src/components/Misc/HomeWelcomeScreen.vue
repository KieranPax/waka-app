<template>
  <c-card class="home-welcome-screen">
    <template #head>
      <div class="card-head">
        Welcome
      </div>
    </template>
    <div v-if="screen === 1">
      Welcome to WaKa - the unofficial WaniKani mobile app<br>
      In order to use this app you need to login to WaniKani.com and
      <a
        href="https://www.wanikani.com/settings/personal_access_tokens"
        target="_blank"
      >generate a personal access token.</a>
      This is required to synchronize this app with your account. Specific
      permissions are not necessary, though some optional app functionality will
      require them. Your privacy is important to us and your data is
      <u>never</u> sent to any third parties. We will not have access to your
      email, password or any other private details through this code.
      <form @submit.prevent="submitToken">
        <span v-if="errorText" class="error-text">{{ errorText }}</span>
        <input
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          class="token-input"
          v-model="tokenVal"
          autocomplete="false"
          spellcheck="false"
        >
        <input class="submit-button" type="submit">
      </form>
    </div>
    <div v-else-if="screen === 2">
      Hello {{ user.username }}! <br><br>
      You are now logged in and able to use the app freely.<br>
      <span v-if="user.subscription.type === 'free'">
        You are currently using the free version of WaniKani. You may view the
        content of all 60 levels, but you will only be able to test yourself on
        the first {{ user.subscription.max_level_granted }} levels.
      </span>
      <button class="next-button" @click="screen++">
        Next
      </button>
    </div>
    <div v-else-if="screen === 3">
      This app uses a caching system to reduce the number of api requests.
      Please select how much data you wish to store in your local storage:<br>
      <form>
        <label class="radio-input">
          <input
            type="radio" value="none"
            v-model="cacheLevel"
          >
          <span />
          None
        </label>
        <br>
        <label class="radio-input">
          <input
            v-if="user.subscription.type === 'free'"
            type="radio"
            value="limited"
            v-model="cacheLevel"
          >
          <span />
          Up to level {{ user.subscription.max_level_granted }} (~{{
            (user.subscription.max_level_granted * 0.16).toFixed(1)
          }}Mb)
        </label>
        <br>
        <label class="radio-input">
          <input
            type="radio" value="all"
            v-model="cacheLevel"
          >
          <span />
          All 60 levels (~10Mb)
        </label>
      </form>
      <button class="next-button" @click="downloadCache">
        Next
      </button>
    </div>
    <div v-else-if="screen === 4">
      Loading... Please wait
    </div>
    <div v-else-if="screen === 5">
      Setup is now finished and your good to use WaKa!
      <button class="next-button" @click="() => $emit('success', user)">
        Close
      </button>
    </div>
  </c-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CCard from '../CCard.vue';
import { CreateSubjectCache, SetAPIToken } from '@/lib/Local';
import { WKUser } from '@/lib/WKAPI';

export default defineComponent({
  name: 'RDetails',
  components: { CCard },
  emits: ['success'],
  data () {
    return {
      tokenVal: '',
      errorText: '',
      screen: 1,
      user: null as null | WKUser,
      cacheLevel: 'all'
    };
  },
  methods: {
    submitToken () {
      SetAPIToken(this.tokenVal).then(res => {
        if (res.errorText) this.errorText = res.errorText;
        else {
          this.user = res.user as WKUser;
          this.screen++;
        } // this.$emit('success', res.user);
      });
    },
    downloadCache () {
      console.log(this.cacheLevel);
      switch (this.cacheLevel) {
        case 'all':
          {
            this.screen++;
            CreateSubjectCache(60).then(() => this.screen++);
          }
          break;
        case 'limited':
          {
            this.screen++;
            CreateSubjectCache(
              this.user?.subscription.max_level_granted || 3
            ).then(() => this.screen++);
          }
          break;
        default:
          {
            this.screen += 2;
          }
          break;
      }
    }
  }
});
</script>

<style scoped>
c-card {
  position: absolute;
  width: 24em;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7em;
}

.card-head {
  padding: 20px;
  text-align: center;
  font-size: 1.5em;
  background: var(--c-color-radical);
}

form {
  margin-top: 2em;
}

.error-text {
  display: inline-block;
  background: var(--c-color-bad);
  border: 1px solid var(--c-tine-bad);
  border-radius: 0.4rem;
  padding: 0.4em;
  margin-bottom: 0.5em;
}

.token-input {
  font-size: 1.15em;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 1em;
}

.submit-button {
  font-size: 1.15em;
  width: 100%;
  background: var(--c-color-radical);
  border: 1px solid var(--c-tint-radical);
  color: var(--c-text-color);
  padding: 0.5em;
  border-radius: 5px;
}

.next-button {
  font-size: 1.15em;
  width: 100%;
  background: var(--c-color-radical);
  border: 1px solid var(--c-tint-radical);
  color: var(--c-text-color);
  padding: 0.5em;
  border-radius: 5px;
  margin-top: 1.5em;
}

a {
  color: var(--c-color-radical);
}

.radio-input {
  display: inline-block;
  position: relative;
  padding-left: 3.5ch;
  padding-bottom: 0.5em;
  cursor: pointer;
  user-select: none;
}

.radio-input input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-input span {
  position: absolute;
  top: 0.15em;
  left: 0;
  height: 1em;
  width: 1em;
  background: var(--c-text-fade-color);
  border: 1px solid var(--c-text-dim-color);
  border-radius: 50%;
}

.radio-input input:checked ~ span {
  background: var(--c-color-radical);
  border: 1px solid var(--c-tint-radical);
}
</style>
