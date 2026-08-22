<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { NameGenerator, CandidateFilter, Scorer, Ranker, CandidateName } from '@dittogen/core';
import defaultRoots from '../../../config/roots.json';
import defaultSuffixes from '../../../config/suffixes.json';

const { locale } = useI18n();

const contextText = ref<string>('');

const extractContext = () => {
  if (!contextText.value) return;
  // Clean up and keep words >= 4 chars
  const words = contextText.value
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4);
    
  if (words.length === 0) return;

  const extractedRoots = new Set<string>();
  const extractedSuffixes = new Set<string>();

  words.forEach(word => {
    // Take whole word as root, and first half
    extractedRoots.add(word);
    extractedRoots.add(word.substring(0, Math.ceil(word.length / 2) + 1));
    
    // Take second half as suffix, and last 2 letters
    extractedSuffixes.add(word.substring(Math.ceil(word.length / 2) - 1));
    extractedSuffixes.add(word.substring(word.length - 2));
  });

  // Common tech/brand suffixes
  const genericSuffixes = ['ify', 'io', 'ia', 'ly', 'us', 'ex'];
  genericSuffixes.forEach(s => extractedSuffixes.add(s));

  roots.value = Array.from(extractedRoots).filter(r => r.length >= 2).join(', ');
  suffixes.value = Array.from(extractedSuffixes).filter(s => s.length >= 2).join(', ');
};

const roots = ref<string>(defaultRoots.join(', '));
const suffixes = ref<string>(defaultSuffixes.join(', '));
const minLength = ref<number>(4);
const maxLength = ref<number>(8);
const seed = ref<number>(Math.floor(Math.random() * 1000000));
const count = ref<number>(50);

const results = ref<CandidateName[]>([]);
const favorites = ref<CandidateName[]>([]);

onMounted(() => {
  const saved = localStorage.getItem('dittogen_favorites');
  if (saved) favorites.value = JSON.parse(saved);
});

const toggleFavorite = (candidate: CandidateName) => {
  const index = favorites.value.findIndex(f => f.normalized === candidate.normalized);
  if (index >= 0) {
    favorites.value.splice(index, 1);
  } else {
    favorites.value.push(candidate);
  }
  localStorage.setItem('dittogen_favorites', JSON.stringify(favorites.value));
};

const isFavorite = (candidate: CandidateName) => {
  return favorites.value.some(f => f.normalized === candidate.normalized);
};

const generate = () => {
  const rList = roots.value.split(',').map(s => s.trim()).filter(s => s);
  const sList = suffixes.value.split(',').map(s => s.trim()).filter(s => s);

  const generator = new NameGenerator({
    roots: rList,
    suffixes: sList,
    seed: seed.value,
    count: 200
  });

  const candidates = generator.generate();

  const filter = new CandidateFilter({
    minLength: minLength.value,
    maxLength: maxLength.value,
  });

  const valid = filter.filterList(candidates);

  const scorer = new Scorer();
  const scored = scorer.scoreList(valid);

  const ranker = new Ranker();
  results.value = ranker.rankAndSelect(scored, count.value, true);
};
</script>

<template>
  <div class="flex h-screen w-full bg-slate-50 text-slate-800">
    <!-- Sidebar -->
    <div class="w-80 bg-white shadow-xl p-6 flex flex-col gap-4 overflow-y-auto z-10">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{{ $t('title') }}</h1>
        <select v-model="locale" class="text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded px-2 py-1 cursor-pointer outline-none hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-colors">
          <option value="en">🇺🇸 EN</option>
          <option value="pt">🇧🇷 PT</option>
        </select>
      </div>
      <p class="text-sm text-slate-500 mb-4">{{ $t('subtitle') }}</p>

      <div class="flex flex-col gap-1 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
        <label class="text-sm font-semibold flex items-center justify-between text-indigo-900">
          <span class="flex items-center gap-1">
            {{ $t('labels.context') }}
            <span :title="$t('tooltips.context')" class="cursor-help flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-indigo-400"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg></span>
          </span>
          <button @click="extractContext" class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded font-bold transition-colors">
            {{ $t('buttons.extract') }}
          </button>
        </label>
        <textarea v-model="contextText" rows="2" class="border border-indigo-200 rounded-md p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-indigo-200" placeholder="e.g. padaria artesanal paulista"></textarea>
      </div>

      <div class="flex flex-col gap-1 mt-2">
        <label class="text-sm font-semibold flex items-center gap-1">
          {{ $t('labels.roots') }}
          <span :title="$t('tooltips.roots')" class="cursor-help flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-slate-400 cursor-help"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg></span>
        </label>
        <textarea v-model="roots" rows="3" class="border rounded-md p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold flex items-center gap-1">
          {{ $t('labels.suffixes') }}
          <span :title="$t('tooltips.suffixes')" class="cursor-help flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-slate-400 cursor-help"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg></span>
        </label>
        <textarea v-model="suffixes" rows="3" class="border rounded-md p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold flex items-center gap-1">
            {{ $t('labels.minLength') }}
            <span :title="$t('tooltips.minLength')" class="cursor-help flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-slate-400 cursor-help"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg></span>
          </label>
          <input type="number" v-model="minLength" class="border rounded-md p-2 text-sm bg-slate-50" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold flex items-center gap-1">
            {{ $t('labels.maxLength') }}
            <span :title="$t('tooltips.maxLength')" class="cursor-help flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-slate-400 cursor-help"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg></span>
          </label>
          <input type="number" v-model="maxLength" class="border rounded-md p-2 text-sm bg-slate-50" />
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold flex items-center gap-1">
            {{ $t('labels.count') }}
            <span :title="$t('tooltips.count')" class="cursor-help flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-slate-400 cursor-help"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg></span>
          </label>
          <input type="number" v-model="count" class="border rounded-md p-2 text-sm bg-slate-50" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold flex items-center gap-1">
            {{ $t('labels.seed') }}
            <span :title="$t('tooltips.seed')" class="cursor-help flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-slate-400 cursor-help"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg></span>
          </label>
          <input type="number" v-model="seed" class="border rounded-md p-2 text-sm bg-slate-50" />
        </div>
      </div>

      <button @click="generate" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all active:scale-95">
        {{ $t('buttons.generate') }}
      </button>

      <!-- How it works -->
      <div class="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs text-blue-900 flex flex-col gap-2">
        <h3 class="font-bold mb-1 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
          {{ $t('howItWorks.title') }}
        </h3>
        <p>{{ $t('howItWorks.step1') }}</p>
        <p>{{ $t('howItWorks.step2') }}</p>
        <p>{{ $t('howItWorks.step3') }}</p>
        <p>{{ $t('howItWorks.step4') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-y-auto">
      <div v-if="results.length === 0" class="h-full flex items-center justify-center text-slate-400">
        {{ $t('messages.emptyState') }}
      </div>

      <div v-else>
        <h2 class="text-xl font-bold mb-6 text-slate-700">{{ $t('messages.topCandidates', { count: results.length }) }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="c in results" :key="c.normalized" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
            <button @click="toggleFavorite(c)" class="absolute top-4 right-4 text-slate-300 hover:text-yellow-500 transition-colors" :class="{ 'text-yellow-500': isFavorite(c) }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :fill="isFavorite(c) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <h3 class="text-2xl font-bold text-slate-800 tracking-tight">{{ c.value }}</h3>
            <div class="mt-4 flex items-center justify-between text-sm">
              <span class="text-slate-500 font-medium">{{ $t('messages.score') }}</span>
              <span class="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{{ c.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
