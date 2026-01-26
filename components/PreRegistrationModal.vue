<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const { t, currentLanguage } = useI18n()

// Form state
const formData = ref({
  teamName: '',
  contactName: '',
  email: '',
  phonePrefix: '+34',
  phone: '',
  country: '',
  players: ''
})

const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

// European countries list
const countries = [
  'Spain',
  'France',
  'Italy',
  'Germany',
  'United Kingdom',
  'Portugal',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Croatia',
  'Serbia',
  'Slovenia',
  'Slovakia',
  'Romania',
  'Bulgaria',
  'Greece',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'Montenegro',
  'North Macedonia',
  'Bosnia and Herzegovina',
  'Albania',
  'Lithuania',
  'Latvia',
  'Estonia',
  'Malta',
  'Cyprus',
  'Luxembourg',
  'Other'
]

// Reset form when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      formData.value = {
        teamName: '',
        contactName: '',
        email: '',
        phonePrefix: '+34',
        phone: '',
        country: '',
        players: ''
      }
      submitStatus.value = 'idle'
    }, 300)
  }
})

// n8n Webhook URL
const N8N_WEBHOOK_URL = 'https://n8n.maistik.studio/webhook-test/waterpolo-preregister'

const submitForm = async () => {
  isSubmitting.value = true
  submitStatus.value = 'idle'

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        teamName: formData.value.teamName,
        contactName: formData.value.contactName,
        email: formData.value.email,
        phone: formData.value.phonePrefix + formData.value.phone,
        country: formData.value.country,
        players: formData.value.players,
        language: currentLanguage.value
      })
    })

    if (response.ok) {
      submitStatus.value = 'success'
    } else {
      submitStatus.value = 'error'
    }
  } catch {
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-deep-navy/80 backdrop-blur-sm"
          @click="closeModal"
        />

        <!-- Modal -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="show"
            class="relative w-full max-w-lg glass-card p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            <!-- Close button -->
            <button
              class="absolute top-4 right-4 text-deep-navy/60 hover:text-deep-navy transition-colors"
              @click="closeModal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Success State -->
            <div v-if="submitStatus === 'success'" class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-ocean-blue/15 text-ocean-blue">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p class="text-xl font-display tracking-wide text-deep-navy mb-2">
                {{ t.modal.success }}
              </p>

              <!-- WhatsApp Community -->
              <div class="mt-6 p-4 bg-[#25D366]/10 rounded-lg">
                <p class="font-semibold text-deep-navy mb-1">{{ t.modal.whatsappTitle }}</p>
                <p class="text-sm text-deep-navy/60 mb-3">{{ t.modal.whatsappText }}</p>
                <a
                  href="https://chat.whatsapp.com/Kqun0y0zVaUEbvPNtb3pMr"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {{ t.modal.whatsappButton }}
                </a>
              </div>

              <button
                class="mt-6 btn-outline"
                @click="closeModal"
              >
                OK
              </button>
            </div>

            <!-- Error State -->
            <div v-else-if="submitStatus === 'error'" class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-neon-coral/15 text-neon-coral">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p class="text-xl font-display tracking-wide text-deep-navy mb-2">
                {{ t.modal.error }}
              </p>
              <button
                class="mt-6 btn-primary"
                @click="submitStatus = 'idle'"
              >
                {{ t.modal.submit }}
              </button>
            </div>

            <!-- Form State -->
            <template v-else>
              <!-- Header -->
              <div class="text-center mb-6">
                <h3 class="font-display text-2xl md:text-3xl tracking-wide text-gradient">
                  {{ t.modal.title }}
                </h3>
                <p class="text-deep-navy/60 mt-2">
                  {{ t.modal.subtitle }}
                </p>
              </div>

              <!-- Form -->
              <form @submit.prevent="submitForm" class="space-y-4">
                <!-- Team Name -->
                <div>
                  <label class="block text-sm font-medium text-deep-navy/80 mb-1">
                    {{ t.modal.fields.teamName }} *
                  </label>
                  <input
                    v-model="formData.teamName"
                    type="text"
                    required
                    class="form-input"
                    :placeholder="t.modal.fields.teamName"
                  />
                </div>

                <!-- Contact Name -->
                <div>
                  <label class="block text-sm font-medium text-deep-navy/80 mb-1">
                    {{ t.modal.fields.contactName }} *
                  </label>
                  <input
                    v-model="formData.contactName"
                    type="text"
                    required
                    class="form-input"
                    :placeholder="t.modal.fields.contactName"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-deep-navy/80 mb-1">
                    {{ t.modal.fields.email }} *
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    class="form-input"
                    :placeholder="t.modal.fields.email"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-deep-navy/80 mb-1">
                    {{ t.modal.fields.phone }} *
                  </label>
                  <div class="flex gap-2">
                    <input
                      v-model="formData.phonePrefix"
                      type="text"
                      required
                      class="form-input w-20 text-center"
                      placeholder="+34"
                    />
                    <input
                      v-model="formData.phone"
                      type="tel"
                      required
                      class="form-input flex-1"
                      :placeholder="t.modal.fields.phone"
                    />
                  </div>
                  <p class="text-xs text-deep-navy/50 mt-1">
                    {{ t.modal.fields.phoneHelper }}
                  </p>
                </div>

                <!-- Country -->
                <div>
                  <label class="block text-sm font-medium text-deep-navy/80 mb-1">
                    {{ t.modal.fields.country }} *
                  </label>
                  <select
                    v-model="formData.country"
                    required
                    class="form-input"
                  >
                    <option value="" disabled>{{ t.modal.fields.country }}</option>
                    <option v-for="country in countries" :key="country" :value="country">
                      {{ country }}
                    </option>
                  </select>
                </div>

                <!-- Number of Players -->
                <div>
                  <label class="block text-sm font-medium text-deep-navy/80 mb-1">
                    {{ t.modal.fields.players }} *
                  </label>
                  <input
                    v-model="formData.players"
                    type="number"
                    min="1"
                    max="30"
                    required
                    class="form-input"
                    placeholder="10-16"
                  />
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                  <span v-else>{{ t.modal.submit }}</span>
                </button>
              </form>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
