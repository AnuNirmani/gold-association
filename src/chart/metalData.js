export const metals = [
  { id: '24k',   name: '24K Gold',  unit: 'per 10g', price: 6245, change: 1.2, up: true  },
  { id: '22k',   name: '22K Gold',  unit: 'per 10g', price: 5725, change: 0.8, up: true  },
  { id: '18k',   name: '18K Gold',  unit: 'per 10g', price: 4684, change: 0.5, up: true  },
  { id: 'silver',name: 'Silver',    unit: 'per 1g',  price: 782,  change: 0.3, up: false },
  { id: 'used',  name: 'Used Gold', unit: 'per 1g',  price: 5450, change: 0.6, up: true  },
];

export const metalStats = {
  '24k':   { open: 6257, close: 6276, high: 6286, low: 6249, change: 0.30, up: true  },
  '22k':   { open: 5710, close: 5725, high: 5738, low: 5705, change: 0.26, up: true  },
  '18k':   { open: 4668, close: 4684, high: 4695, low: 4662, change: 0.34, up: true  },
  'silver':{ open: 784,  close: 782,  high: 790,  low: 778,  change: 0.25, up: false },
  'used':  { open: 5437, close: 5450, high: 5465, low: 5430, change: 0.24, up: true  },
};

// 30-day (1M) demo price data per metal
export const chartData = {
  '24k': [
    6265,6268,6262,6258,6260,6268,6275,6280,6286,6282,
    6278,6272,6265,6260,6258,6262,6268,6275,6280,6278,
    6272,6268,6265,6262,6265,6268,6272,6275,6278,6276,
  ],
  '22k': [
    5712,5718,5714,5710,5712,5718,5722,5725,5728,5722,
    5718,5715,5712,5710,5712,5716,5720,5725,5730,5728,
    5722,5718,5715,5713,5715,5718,5722,5725,5728,5725,
  ],
  '18k': [
    4668,4672,4668,4664,4666,4670,4675,4680,4690,4686,
    4682,4678,4672,4668,4664,4668,4672,4678,4684,4682,
    4678,4674,4670,4668,4670,4672,4676,4680,4684,4684,
  ],
  'silver': [
    784,786,783,780,782,785,788,790,789,786,
    782,780,778,780,782,784,786,789,792,789,
    786,782,780,778,780,782,784,786,788,782,
  ],
  'used': [
    5437,5442,5438,5435,5437,5440,5445,5450,5456,5452,
    5448,5444,5440,5435,5432,5435,5440,5445,5452,5450,
    5446,5442,5438,5436,5438,5440,5444,5448,5452,5450,
  ],
};

// Period configuration: { points (indices into chartData), xLabels }
export const periods = {
  '1D': {
    slice: [0, 24],
    xLabels: Array.from({ length: 24 }, (_, i) => i % 4 === 0 ? `${i}h` : ''),
  },
  '1W': {
    slice: [0, 7],
    xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  '1M': {
    slice: [0, 30],
    xLabels: Array.from({ length: 30 }, (_, i) => String(i + 1)),
  },
  '3M': {
    // repeat the 30-day data 3× and label with month names
    repeat: 3,
    xLabels: Array.from({ length: 90 }, (_, i) =>
      i === 0 ? 'May' : i === 30 ? 'Jun' : i === 60 ? 'Jul' : i === 89 ? 'Jul' : ''
    ),
  },
  '1Y': {
    // subsample to 12 points
    slice: null,
    xLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  },
};

export function getPeriodData(metalId, period) {
  const base = chartData[metalId] || chartData['24k'];
  const cfg = periods[period] || periods['1M'];

  if (period === '3M') {
    return [...base, ...base, ...base];
  }
  if (period === '1Y') {
    // pick every 2.5th point to get 12 values
    return Array.from({ length: 12 }, (_, i) =>
      base[Math.round((i / 11) * (base.length - 1))]
    );
  }
  const [start, end] = cfg.slice;
  return base.slice(start, end);
}
