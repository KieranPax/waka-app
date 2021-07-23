<template>
  <c-view>
    <c-header>
      Homepage
      <span class="sub-header">{{ user ? user.username : '' }}</span>
      <span class="sub-sub-header">{{
        user && user.subscription.type === 'free' ? 'Free trial' : ''
      }}</span>
    </c-header>
    <c-content>
      <c-card v-if="user && user.current_vacation_started_at" class="mode-card">
        <span
          class="card-desc"
        >Looks you're on vacation right now. Click here if you would like to
          update that.</span>
      </c-card>
      <c-card
        v-for="card in cards"
        :key="card.title"
        class="mode-card"
        @click="card.func"
      >
        <template #head>
          <div
            class="mode-head"
            lang="ja"
            :style="{ background: 'var(--c-color-' + card.color + ')' }"
          >
            {{ card.icon }}
          </div>
        </template>
        <span class="card-title">{{ card.title }}</span><br>
        <span class="card-desc">{{ card.desc }}</span>
      </c-card>
    </c-content>
    <div
      class="screen-cover"
      :style="{
        opacity: loginFail ? 1 : 0,
        'pointer-events': loginFail ? 'all' : 'none'
      }"
    >
      <home-welcome-screen @success="resetUser" />
    </div>
  </c-view>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { CView, CHeader, CContent, CCard } from '@/components';
import HomeWelcomeScreen from '@/components/Misc/HomeWelcomeScreen.vue';
import { GetUser } from '@/lib/Local';
import { WKUser } from '@/lib/WKAPI';

export default defineComponent({
  name: 'Home',
  components: { CView, CHeader, CContent, CCard, HomeWelcomeScreen },
  data () {
    const router = useRouter();
    const user: Ref<null | WKUser> = ref(null);
    return {
      router,
      user,
      loginFail: false,
      cards: [
        {
          title: 'Radicals',
          desc: 'Test your Radical naming skills here',
          color: 'radical',
          icon: '部首',
          func: () => router.push('radical')
        },
        {
          title: 'Kanji',
          desc: 'Test your Kanji knowledge here',
          color: 'kanji',
          icon: '漢字',
          func: () => router.push('kanji')
        },
        {
          title: 'Vocabulary',
          desc: 'Test your vocabulary knowledge here',
          color: 'vocab',
          icon: '単語',
          func: () => router.push('vocab')
        }
      ]
    };
  },
  methods: {
    resetUser (user?: WKUser) {
      if (user) {
        localStorage.setItem(
          'user_saved',
          JSON.stringify({ user, date: Date.now() })
        );
        this.user = user;
        this.loginFail = false;
      } else {
        GetUser()
          .then(res => {
            const s = localStorage.getItem('user_saved');
            this.user = res;
            if (s) {
              const u = JSON.parse(s).user as WKUser;
              if(this.user.level !== u.level) alert('level up / down');
              if(this.user.current_vacation_started_at !== u.current_vacation_started_at) alert('vacation update');
              if(this.user.subscription.period_ends_at !== u.subscription.period_ends_at) alert('subscription update');
            }
            console.log(res);
          })
          .catch(rej => {
            this.loginFail = true;
          });
      }
    }
  },
  created () {
    this.resetUser();
  }
});
</script>

<style scoped>
.mode-card {
  margin-bottom: 1rem;
}

.mode-head {
  padding: 20px;
  text-align: center;
  font-size: 4em;
}

.card-title {
  font-size: 1.2em;
  line-height: 2em;
}

.card-desc {
  font-size: 0.8em;
  color: var(--c-text-fade-color);
}

.sub-header {
  padding-left: 1rem;
  font-size: 0.8em;
  color: var(--c-text-fade-color);
}

.sub-sub-header {
  padding-left: 1rem;
  font-size: 0.5em;
  color: var(--c-text-dim-color);
}

.screen-cover {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  transition: opacity 0.4s;
}
</style>
