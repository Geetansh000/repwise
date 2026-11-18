export type MuscleStatus = 'trained' | 'moderate' | 'idle';

export type MuscleDefinition = {
  id: string;
  name: string;
  side: 'front' | 'back';
  path: string;
};

export const muscleDefinitions: MuscleDefinition[] = [
  {
    id: 'chest',
    name: 'Chest',
    side: 'front',
    path: 'M 130 165 C 90 170, 80 205, 95 250 C 110 285, 155 290, 170 260 C 185 220, 180 180, 130 165 Z',
  },
  {
    id: 'front-deltoids',
    name: 'Front deltoids',
    side: 'front',
    path: 'M 85 120 C 95 95, 118 82, 135 98 C 142 112, 136 132, 120 135 C 104 140, 89 135, 85 120 Z',
  },
  {
    id: 'side-deltoids',
    name: 'Side deltoids',
    side: 'front',
    path: 'M 64 132 C 69 111, 84 100, 96 107 C 101 120, 98 137, 88 148 C 76 151, 66 145, 64 132 Z',
  },
  {
    id: 'biceps',
    name: 'Biceps',
    side: 'front',
    path: 'M 70 250 C 58 260, 52 286, 60 315 C 70 338, 86 328, 96 310 C 103 296, 108 282, 100 260 Z',
  },
  {
    id: 'abs',
    name: 'Abs',
    side: 'front',
    path: 'M 118 200 C 120 228, 140 242, 168 242 C 174 224, 173 202, 168 184 C 156 182, 138 182, 118 200 Z',
  },
  {
    id: 'obliques',
    name: 'Obliques',
    side: 'front',
    path: 'M 92 220 C 75 226, 78 250, 93 266 C 102 278, 118 286, 124 272 C 130 258, 128 236, 92 220 Z',
  },
  {
    id: 'quadriceps',
    name: 'Quadriceps',
    side: 'front',
    path: 'M 105 350 C 92 390, 86 430, 96 470 C 110 510, 146 515, 165 470 C 178 438, 176 390, 165 350 C 150 348, 120 344, 105 350 Z',
  },
  {
    id: 'calves-front',
    name: 'Calves',
    side: 'front',
    path: 'M 108 512 C 98 528, 96 548, 110 560 C 122 548, 130 538, 136 520 C 142 534, 152 542, 164 562 C 178 548, 176 528, 170 512 Z',
  },
  {
    id: 'upper-back',
    name: 'Upper back',
    side: 'back',
    path: 'M 120 150 C 92 156, 80 186, 88 212 C 100 248, 140 250, 172 240 C 184 208, 182 170, 168 156 C 156 145, 142 145, 120 150 Z',
  },
  {
    id: 'lats',
    name: 'Lats',
    side: 'back',
    path: 'M 96 270 C 100 330, 88 362, 98 392 C 110 422, 146 422, 160 392 C 168 362, 165 330, 168 270 C 146 286, 118 282, 96 270 Z',
  },
  {
    id: 'traps',
    name: 'Traps',
    side: 'back',
    path: 'M 104 100 C 120 70, 170 70, 188 100 C 178 120, 160 128, 138 130 C 124 126, 112 120, 104 100 Z',
  },
  {
    id: 'rear-deltoids',
    name: 'Rear deltoids',
    side: 'back',
    path: 'M 140 112 C 154 98, 176 110, 192 120 C 202 138, 198 156, 178 168 C 162 150, 146 132, 140 112 Z',
  },
  {
    id: 'triceps',
    name: 'Triceps',
    side: 'back',
    path: 'M 86 248 C 68 262, 66 296, 78 312 C 88 328, 102 326, 108 304 C 114 286, 116 270, 86 248 Z',
  },
  {
    id: 'forearms',
    name: 'Forearms',
    side: 'back',
    path: 'M 78 308 C 60 328, 56 354, 64 382 C 70 390, 82 394, 95 386 C 104 378, 104 364, 98 350 C 92 334, 88 324, 78 308 Z',
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    side: 'back',
    path: 'M 102 350 C 86 380, 82 418, 90 452 C 98 486, 122 510, 150 508 C 158 476, 168 456, 170 430 C 170 390, 160 364, 102 350 Z',
  },
  {
    id: 'glutes',
    name: 'Glutes',
    side: 'back',
    path: 'M 94 246 C 108 228, 142 222, 176 246 C 170 284, 160 322, 148 336 C 122 336, 102 318, 94 246 Z',
  },
  {
    id: 'calves-back',
    name: 'Calves',
    side: 'back',
    path: 'M 110 512 C 102 530, 108 544, 122 560 C 132 548, 146 536, 162 510 C 150 502, 126 504, 110 512 Z',
  },
];

export const muscleStatusColors: Record<MuscleStatus, string> = {
  trained: '#A3E635',
  moderate: '#F7D65E',
  idle: '#4F594F',
};
