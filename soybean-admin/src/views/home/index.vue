<script setup lang="tsx">
import { computed, nextTick, onActivated, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { NCard, NGrid } from 'naive-ui';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';

const themeStore = useThemeStore();

const barChartEl = ref<HTMLDivElement | null>(null);
const lineChartEl = ref<HTMLDivElement | null>(null);
const pieChartEl = ref<HTMLDivElement | null>(null);

let barChart: echarts.ECharts | undefined;
let lineChart: echarts.ECharts | undefined;
let pieChart: echarts.ECharts | undefined;

const { width: barWidth, height: barHeight } = useElementSize(barChartEl);
const { width: lineWidth, height: lineHeight } = useElementSize(lineChartEl);
const { width: pieWidth, height: pieHeight } = useElementSize(pieChartEl);

watch([barWidth, barHeight], () => barChart?.resize());
watch([lineWidth, lineHeight], () => lineChart?.resize());
watch([pieWidth, pieHeight], () => pieChart?.resize());

function disposeCharts() {
  barChart?.dispose();
  lineChart?.dispose();
  pieChart?.dispose();
  barChart = undefined;
  lineChart = undefined;
  pieChart = undefined;
}

function setChartOptions() {
  const googlePalette = [
    '#4285F4',
    '#DB4437',
    '#F4B400',
    '#0F9D58',
    '#AB47BC',
    '#00ACC1',
    '#FF7043',
    '#9E9D24',
    '#5C6BC0',
    '#F06292'
  ];

  const isDark = themeStore.darkMode;

  const axisLabelColor = isDark ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.72)';
  const axisLineColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)';
  const splitLineColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tooltipBg = isDark ? 'rgba(29,29,31,0.92)' : 'rgba(255,255,255,0.96)';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';
  const tooltipText = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.82)';
  const cardBg = isDark ? '#1f1f23' : '#ffffff';

  const days = Array.from({ length: 7 }).map((_, index) =>
    dayjs()
      .subtract(6 - index, 'day')
      .format('MM-DD')
  );
  const visitData = [820, 932, 901, 934, 1290, 1330, 1520];
  const turnoverData = [1200, 1820, 1910, 2340, 2900, 3300, 3100, 4200, 3980, 4500, 5200, 6100];
  const turnoverMonths = Array.from({ length: 12 }).map((_, index) => dayjs().month(index).format('MMM'));

  barChart?.setOption(
    {
      backgroundColor: 'transparent',
      color: googlePalette,
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        textStyle: { color: tooltipText },
        axisPointer: { type: 'shadow' }
      },
      grid: { left: 10, right: 12, top: 36, bottom: 10, containLabel: true },
      xAxis: {
        type: 'category',
        data: days,
        axisTick: { alignWithLabel: true, lineStyle: { color: axisLineColor } },
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: { color: axisLabelColor }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: axisLabelColor },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } }
      },
      series: [
        {
          name: $t('page.home.visitCount'),
          type: 'bar',
          barMaxWidth: 28,
          itemStyle: {
            borderRadius: [8, 8, 2, 2],
            shadowBlur: 12,
            shadowColor: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(66,133,244,0.25)',
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#4285F4' },
              { offset: 1, color: isDark ? 'rgba(66,133,244,0.62)' : 'rgba(66,133,244,0.30)' }
            ])
          },
          emphasis: { focus: 'series' },
          data: visitData
        }
      ]
    },
    true
  );

  lineChart?.setOption(
    {
      backgroundColor: 'transparent',
      color: googlePalette,
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        textStyle: { color: tooltipText },
        axisPointer: { type: 'line', lineStyle: { color: axisLineColor } }
      },
      grid: { left: 10, right: 12, top: 44, bottom: 10, containLabel: true },
      legend: { data: [$t('page.home.turnover')], textStyle: { color: axisLabelColor } },
      xAxis: {
        type: 'category',
        data: turnoverMonths,
        boundaryGap: false,
        axisLine: { lineStyle: { color: axisLineColor } },
        axisTick: { show: false },
        axisLabel: { color: axisLabelColor }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: axisLabelColor },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } }
      },
      series: [
        {
          name: $t('page.home.turnover'),
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { width: 3 },
          itemStyle: { borderWidth: 2, borderColor: cardBg },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: isDark ? 'rgba(66,133,244,0.35)' : 'rgba(66,133,244,0.26)' },
              { offset: 1, color: 'rgba(66,133,244,0.00)' }
            ])
          },
          emphasis: { focus: 'series' },
          data: turnoverData
        }
      ]
    },
    true
  );

  pieChart?.setOption(
    {
      backgroundColor: 'transparent',
      color: googlePalette,
      tooltip: {
        trigger: 'item',
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        textStyle: { color: tooltipText }
      },
      legend: { bottom: 0, left: 'center', textStyle: { color: axisLabelColor } },
      series: [
        {
          name: $t('page.home.schedule'),
          type: 'pie',
          radius: ['40%', '68%'],
          center: ['50%', '42%'],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 10, borderColor: cardBg, borderWidth: 2 },
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            scale: true,
            scaleSize: 8,
            label: { show: true, fontSize: 14, fontWeight: 600, color: axisLabelColor, formatter: '{b}\n{d}%' }
          },
          data: [
            { value: 25, name: $t('page.home.study') },
            { value: 35, name: $t('page.home.work') },
            { value: 20, name: $t('page.home.rest') },
            { value: 20, name: $t('page.home.entertainment') }
          ]
        }
      ]
    },
    true
  );
}

function initCharts() {
  disposeCharts();

  const theme = themeStore.darkMode ? 'dark' : undefined;

  if (barChartEl.value) barChart = echarts.init(barChartEl.value, theme);
  if (lineChartEl.value) lineChart = echarts.init(lineChartEl.value, theme);
  if (pieChartEl.value) pieChart = echarts.init(pieChartEl.value, theme);

  setChartOptions();

  nextTick(() => {
    barChart?.resize();
    lineChart?.resize();
    pieChart?.resize();
  });
}

onMounted(() => {
  initCharts();
});

onActivated(() => {
  nextTick(() => {
    barChart?.resize();
    lineChart?.resize();
    pieChart?.resize();
  });
});

watch(
  () => [
    themeStore.darkMode,
    themeStore.themeColors.primary,
    themeStore.themeColors.info,
    themeStore.themeColors.success,
    themeStore.themeColors.warning,
    themeStore.themeColors.error
  ],
  () => {
    nextTick(() => {
      initCharts();
    });
  }
);

onBeforeUnmount(() => {
  disposeCharts();
});

const metrics = computed(() => [
  {
    key: 'projectCount',
    label: $t('page.home.projectCount'),
    value: 128,
    icon: 'google-dashboard',
    color: 'text-primary'
  },
  {
    key: 'todo',
    label: $t('page.home.todo'),
    value: 32,
    icon: 'google-list',
    color: 'text-warning'
  },
  {
    key: 'message',
    label: $t('page.home.message'),
    value: 14,
    icon: 'google-notifications',
    color: 'text-info'
  },
  {
    key: 'downloadCount',
    label: $t('page.home.downloadCount'),
    value: 86420,
    icon: 'google-table',
    color: 'text-success'
  }
]);
</script>

<template>
  <div class="h-full flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NGrid :cols="24" :x-gap="16" :y-gap="16">
      <NGi v-for="item in metrics" :key="item.key" :span="6" lt-sm:span="24">
        <NCard size="small" :bordered="false" class="h-110px">
          <div class="h-full flex items-center justify-between">
            <div class="flex-col-stretch gap-10px">
              <div class="text-14px text-#606266 dark:text-#ffffffa6">{{ item.label }}</div>
              <div class="text-26px font-600">{{ item.value.toLocaleString() }}</div>
            </div>
            <div class="size-44px flex-center rounded-10px bg-#f3f4f6 dark:bg-#ffffff14">
              <SvgIcon :local-icon="item.icon" class="text-24px" :class="[item.color]" />
            </div>
          </div>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid :cols="24" :x-gap="16" :y-gap="16">
      <NGi :span="16" lt-sm:span="24">
        <NCard :title="$t('page.home.visitCount')" :bordered="false" size="small" class="overflow-hidden card-wrapper">
          <div ref="barChartEl" class="h-320px w-full"></div>
        </NCard>
      </NGi>
      <NGi :span="8" lt-sm:span="24">
        <NCard :title="$t('page.home.schedule')" :bordered="false" size="small" class="overflow-hidden card-wrapper">
          <div ref="pieChartEl" class="h-320px w-full"></div>
        </NCard>
      </NGi>
      <NGi :span="24">
        <NCard :title="$t('page.home.turnover')" :bordered="false" size="small" class="overflow-hidden card-wrapper">
          <div ref="lineChartEl" class="h-360px w-full"></div>
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>
