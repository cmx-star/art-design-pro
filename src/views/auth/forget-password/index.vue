<template>
  <div class="flex w-full h-screen">
    <LoginLeftView />

    <div class="relative flex-1">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
          <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>
          <div class="mt-5">
            <span class="input-label" v-if="showInputLabel">账号</span>
            <ElInput
              class="custom-height"
              :placeholder="$t('forgetPassword.placeholder')"
              v-model.trim="username"
            />
          </div>

          <div style="margin-top: 15px">
            <ElButton
              class="w-full custom-height"
              type="primary"
              @click="register"
              :loading="loading"
            >
              {{ $t('forgetPassword.submitBtnText') }}
            </ElButton>
          </div>

          <div style="margin-top: 15px">
            <ElButton class="w-full custom-height" plain @click="toLogin">
              {{ $t('forgetPassword.backBtnText') }}
            </ElButton>
          </div>
        </div>
      </div>

      <!-- 备案号 -->
      <div class="icp-number">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          鲁ICP备2025181732号-1
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ForgetPassword' })

  const router = useRouter()
  const showInputLabel = ref(false)

  const username = ref('')
  const loading = ref(false)

  const register = async () => {}

  const toLogin = () => {
    router.push({ name: 'Login' })
  }
</script>

<style scoped>
  @import '../login/style.css';
</style>
