import { computed, effectScope, onScopeDispose, reactive, shallowRef, watch } from 'vue';
import type { Ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { useBoolean, useTable } from '@sa/hooks';
import type { PaginationData, TableColumnCheck, UseTableOptions } from '@sa/hooks';
import type { FlatResponseData } from '@sa/axios';
import { jsonClone } from '@sa/utils';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

type Awaited<T> = T extends Promise<infer R> ? R : T;
type ExtractFlatData<T> = T extends { data: infer D } ? D : never;
type RecordsItemFromData<D> = D extends { records: (infer R)[] } ? R : never;
type ExtractRecordsItem<T> = RecordsItemFromData<ExtractFlatData<T>>;

export type UseNaiveTableOptions<ResponseData, ApiData, Pagination extends boolean> = Omit<
  UseTableOptions<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, Pagination>,
  'pagination' | 'getColumnChecks' | 'getColumns'
> & {
  /**
   * get column visible
   *
   * @param column
   *
   * @default true
   *
   * @returns true if the column is visible, false otherwise
   */
  getColumnVisible?: (column: NaiveUI.TableColumn<ApiData>) => boolean;
};

const SELECTION_KEY = '__selection__';

const EXPAND_KEY = '__expand__';

type LegacyNaiveTableOptions<ApiFn extends (params?: any) => Promise<any>> = {
  apiFn: ApiFn;
  apiParams?: Parameters<ApiFn>[0];
  transform?: (response: Awaited<ReturnType<ApiFn>>) => ExtractRecordsItem<Awaited<ReturnType<ApiFn>>>[];
  columns: () => NaiveUI.TableColumn<ExtractRecordsItem<Awaited<ReturnType<ApiFn>>>>[];
  getColumnVisible?: (column: NaiveUI.TableColumn<ExtractRecordsItem<Awaited<ReturnType<ApiFn>>>>) => boolean;
};

export function useNaiveTable<ResponseData, ApiData>(
  options: UseNaiveTableOptions<ResponseData, ApiData, false>
): ReturnType<typeof useNaiveTableCore<ResponseData, ApiData>>;
export function useNaiveTable<ApiFn extends (params?: any) => Promise<any>>(
  options: LegacyNaiveTableOptions<ApiFn>
): ReturnType<typeof useNaiveTableCore<any, ExtractRecordsItem<Awaited<ReturnType<ApiFn>>>>>;
export function useNaiveTable(options: any): any {
  if ('apiFn' in options) {
    const legacy = options as LegacyNaiveTableOptions<(params?: any) => Promise<any>>;
    const api = () => legacy.apiFn(legacy.apiParams);
    const transform = legacy.transform ?? defaultRecordsTransform;

    return useNaiveTableCore({
      api,
      transform,
      columns: legacy.columns,
      getColumnVisible: legacy.getColumnVisible
    });
  }

  return useNaiveTableCore(options);
}

function useNaiveTableCore<ResponseData, ApiData>(options: UseNaiveTableOptions<ResponseData, ApiData, false>) {
  const scope = effectScope();
  const appStore = useAppStore();

  const result = useTable<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, false>({
    ...options,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns
  });

  // calculate the total width of the table this is used for horizontal scrolling
  const scrollX = computed(() => {
    return result.columns.value.reduce((acc, column) => {
      return acc + Number(column.width ?? column.minWidth ?? 120);
    }, 0);
  });

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        result.reloadColumns();
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...result,
    scrollX
  };
}

type PaginationParams = Pick<PaginationProps, 'page' | 'pageSize'>;

type UseNaivePaginatedTableOptions<ResponseData, ApiData> = UseNaiveTableOptions<ResponseData, ApiData, true> & {
  paginationProps?: Omit<PaginationProps, 'page' | 'pageSize' | 'itemCount'>;
  /**
   * whether to show the total count of the table
   *
   * @default true
   */
  showTotal?: boolean;
  onPaginationParamsChange?: (params: PaginationParams) => void | Promise<void>;
};

type LegacyNaivePaginatedTableOptions<ApiFn extends (params?: any) => Promise<any>> = {
  apiFn: ApiFn;
  apiParams: NonNullable<Parameters<ApiFn>[0]>;
  transform?: (response: Awaited<ReturnType<ApiFn>>) => PaginationData<ExtractRecordsItem<Awaited<ReturnType<ApiFn>>>>;
  columns: () => NaiveUI.TableColumn<ExtractRecordsItem<Awaited<ReturnType<ApiFn>>>>[];
  getColumnVisible?: (column: NaiveUI.TableColumn<ExtractRecordsItem<Awaited<ReturnType<ApiFn>>>>) => boolean;
  paginationProps?: Omit<PaginationProps, 'page' | 'pageSize' | 'itemCount'>;
  showTotal?: boolean;
};

export function useNaivePaginatedTable<ResponseData, ApiData>(
  options: UseNaivePaginatedTableOptions<ResponseData, ApiData>
): ReturnType<typeof useNaivePaginatedTableCore<ResponseData, ApiData>>;
export function useNaivePaginatedTable<ApiFn extends (params?: any) => Promise<any>>(
  options: LegacyNaivePaginatedTableOptions<ApiFn>
): ReturnType<typeof useNaivePaginatedTableLegacy<ApiFn>>;
export function useNaivePaginatedTable(options: any): any {
  if ('apiFn' in options) {
    return useNaivePaginatedTableLegacy(options);
  }

  return useNaivePaginatedTableCore(options);
}

function useNaivePaginatedTableLegacy<ApiFn extends (params?: any) => Promise<any>>(
  options: LegacyNaivePaginatedTableOptions<ApiFn>
) {
  const initialParams = jsonClone(options.apiParams) as NonNullable<Parameters<ApiFn>[0]>;
  const searchParams = reactive(jsonClone(options.apiParams)) as NonNullable<Parameters<ApiFn>[0]>;

  const core = useNaivePaginatedTableCore({
    api: () => options.apiFn(searchParams),
    transform: (options.transform ?? defaultTransform) as any,
    columns: options.columns,
    getColumnVisible: options.getColumnVisible,
    paginationProps: options.paginationProps,
    showTotal: options.showTotal,
    onPaginationParamsChange: async ({ page, pageSize }) => {
      if (typeof searchParams === 'object' && searchParams) {
        (searchParams as any).page = page;
        (searchParams as any).pageSize = pageSize;
      }
    }
  });

  async function getData() {
    await core.getDataByPage(1);
  }

  async function resetSearchParams() {
    Object.assign(searchParams, jsonClone(initialParams));
    await core.getDataByPage(1);
  }

  return {
    ...core,
    getData,
    searchParams,
    resetSearchParams
  };
}

function useNaivePaginatedTableCore<ResponseData, ApiData>(
  options: UseNaivePaginatedTableOptions<ResponseData, ApiData>
) {
  const scope = effectScope();
  const appStore = useAppStore();

  const isMobile = computed(() => appStore.isMobile);

  const showTotal = computed(() => options.showTotal ?? true);

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    prefix: showTotal.value ? page => $t('datatable.itemCount', { total: page.itemCount }) : undefined,
    onUpdatePage(page) {
      pagination.page = page;
    },
    onUpdatePageSize(pageSize) {
      pagination.pageSize = pageSize;
      pagination.page = 1;
    },
    ...options.paginationProps
  }) as PaginationProps;

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p: PaginationProps = {
      ...pagination,
      pageSlot: isMobile.value ? 3 : 9,
      prefix: !isMobile.value && showTotal.value ? pagination.prefix : undefined
    };

    return p;
  });

  const paginationParams = computed(() => {
    const { page, pageSize } = pagination;

    return {
      page,
      pageSize
    };
  });

  const result = useTable<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, true>({
    ...options,
    pagination: true,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns,
    onFetched: data => {
      pagination.itemCount = data.total;
      pagination.pageSize = data.pageSize;
    }
  });

  async function getDataByPage(page: number = 1) {
    if (page !== pagination.page) {
      pagination.page = page;

      return;
    }

    await result.getData();
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        result.reloadColumns();
      }
    );

    watch(paginationParams, async newVal => {
      await options.onPaginationParamsChange?.(newVal);

      await result.getData();
    });
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...result,
    getDataByPage,
    pagination,
    mobilePagination
  };
}

export function useTableOperate<TableData>(
  data: Ref<TableData[]>,
  idKey: keyof TableData,
  getData: () => Promise<void>
) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();

  const operateType = shallowRef<NaiveUI.TableOperateType>('add');

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData = shallowRef<TableData | null>(null);

  function handleEdit(id: TableData[keyof TableData]) {
    operateType.value = 'edit';
    function findItemDeep(list: any[]): any | null {
      for (const item of list) {
        if (item?.[idKey] === id) return item;

        const children = item?.children;
        if (Array.isArray(children)) {
          const found = findItemDeep(children);
          if (found) return found;
        }
      }
      return null;
    }

    const findItem = findItemDeep(data.value as any) || null;
    editingData.value = findItem ? jsonClone(findItem) : ({ [idKey]: id } as any);

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys = shallowRef<string[]>([]);

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    await getData();
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted
  };
}

export function defaultTransform<ApiData>(
  response: FlatResponseData<any, Api.Common.PaginatingQueryRecord<ApiData>>
): PaginationData<ApiData> {
  const { data, error } = response;

  if (!error && data) {
    const { records, total, current, size } = extractPaginationData<ApiData>(data as any);

    return {
      data: records,
      pageNum: current,
      pageSize: size,
      total
    };
  }

  return {
    data: [],
    pageNum: 1,
    pageSize: 10,
    total: 0
  };
}

type ExtractedPaginationData<ApiData> = {
  records: ApiData[];
  total: number;
  current: number;
  size: number;
};

function extractPaginationData<ApiData>(raw: any): ExtractedPaginationData<ApiData> {
  const candidates: Array<(value: any) => ExtractedPaginationData<ApiData> | null> = [
    value =>
      Array.isArray(value)
        ? {
            records: value,
            total: value.length,
            current: 1,
            size: 10
          }
        : null,
    value =>
      Array.isArray(value?.records)
        ? {
            records: value.records,
            total: value.total || 0,
            current: value.current || 1,
            size: value.size || 10
          }
        : null,
    value =>
      Array.isArray(value?.rows)
        ? {
            records: value.rows,
            total: value.total || 0,
            current: value.current || 1,
            size: value.size || 10
          }
        : null,
    value =>
      Array.isArray(value?.list)
        ? {
            records: value.list,
            total: value.total || 0,
            current: value.current || 1,
            size: value.size || 10
          }
        : null
  ];

  for (const pick of candidates) {
    const res = pick(raw);
    if (res) return res;
  }

  return {
    records: [],
    total: 0,
    current: 1,
    size: 10
  };
}

export function defaultRecordsTransform<ApiData>(response: FlatResponseData<any, { records: ApiData[] }>) {
  const { data, error } = response;

  if (!error && data) {
    return data.records;
  }

  return [] as ApiData[];
}

function getColumnChecks<Column extends NaiveUI.TableColumn<any>>(
  cols: Column[],
  getColumnVisible?: (column: Column) => boolean
) {
  const checks: TableColumnCheck[] = [];

  cols.forEach(column => {
    if (isTableColumnHasKey(column)) {
      checks.push({
        key: column.key as string,
        title: column.title!,
        checked: true,
        visible: getColumnVisible?.(column) ?? true
      });
    } else if (column.type === 'selection') {
      checks.push({
        key: SELECTION_KEY,
        title: $t('common.check'),
        checked: true,
        visible: getColumnVisible?.(column) ?? false
      });
    } else if (column.type === 'expand') {
      checks.push({
        key: EXPAND_KEY,
        title: $t('common.expandColumn'),
        checked: true,
        visible: getColumnVisible?.(column) ?? false
      });
    }
  });

  return checks;
}

function getColumns<Column extends NaiveUI.TableColumn<any>>(cols: Column[], checks: TableColumnCheck[]) {
  const columnMap = new Map<string, Column>();

  cols.forEach(column => {
    if (isTableColumnHasKey(column)) {
      columnMap.set(column.key as string, column);
    } else if (column.type === 'selection') {
      columnMap.set(SELECTION_KEY, column);
    } else if (column.type === 'expand') {
      columnMap.set(EXPAND_KEY, column);
    }
  });

  const filteredColumns = checks.filter(item => item.checked).map(check => columnMap.get(check.key) as Column);

  return filteredColumns;
}

export function isTableColumnHasKey<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}
