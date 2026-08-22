<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NameGenerator, CandidateFilter, Scorer, Ranker, CandidateName } from '@dittogen/core';
import defaultRoots from '../../../config/roots.json';
import defaultSuffixes from '../../../config/suffixes.json';

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
    count: 200 // overgenerate to allow filtering
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
      <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Dittogen</h1>
      <p class="text-sm text-slate-500 mb-4">Brand Name Generator</p>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold">Roots (comma separated)</label>
        <textarea v-model="roots" rows="3" class="border rounded-md p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-semibold">Suffixes (comma separated)</label>
        <textarea v-model="suffixes" rows="3" class="border rounded-md p-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold">Min Length</label>
          <input type="number" v-model="minLength" class="border rounded-md p-2 text-sm bg-slate-50" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold">Max Length</label>
          <input type="number" v-model="maxLength" class="border rounded-md p-2 text-sm bg-slate-50" />
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold">Count (Top N)</label>
          <input type="number" v-model="count" class="border rounded-md p-2 text-sm bg-slate-50" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-semibold">Seed</label>
          <input type="number" v-model="seed" class="border rounded-md p-2 text-sm bg-slate-50" />
        </div>
      </div>

      <button @click="generate" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all active:scale-95">
        Generate Brands
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-y-auto">
      <div v-if="results.length === 0" class="h-full flex items-center justify-center text-slate-400">
        Adjust settings and click generate to see results
      </div>

      <div v-else>
        <h2 class="text-xl font-bold mb-6 text-slate-700">Top {{ results.length }} Candidates</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="c in results" :key="c.normalized" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
            <button @click="toggleFavorite(c)" class="absolute top-4 right-4 text-slate-300 hover:text-yellow-500 transition-colors" :class="{ 'text-yellow-500': isFavorite(c) }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :fill="isFavorite(c) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <h3 class="text-2xl font-bold text-slate-800 tracking-tight">{{ c.value }}</h3>
            <div class="mt-4 flex items-center justify-between text-sm">
              <span class="text-slate-500 font-medium">Score:</span>
              <span class="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{{ c.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
