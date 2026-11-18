import type { ImageSourcePropType } from 'react-native';

export type ExerciseImageReference = {
  image: ImageSourcePropType;
  sourceExerciseName: string;
  sourceUrl: string;
};

const licenseUrl = `https://github.com/yuhonas/free-exercise-db/blob/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/LICENSE.md`;
const exerciseImageReferences: Record<string, ExerciseImageReference | undefined> = {
  "bench-press": {
    image: require('../assets/exercises/images/barbellbenchpressmediumgrip.jpg'),
    sourceExerciseName: "Barbell Bench Press - Medium Grip",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Bench_Press_-_Medium_Grip",
  },
  "incline-dumbbell-press": {
    image: require('../assets/exercises/images/inclinedumbbellpress.jpg'),
    sourceExerciseName: "Incline Dumbbell Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Incline_Dumbbell_Press",
  },
  "cable-fly": {
    image: require('../assets/exercises/images/flatbenchcableflyes.jpg'),
    sourceExerciseName: "Flat Bench Cable Flyes",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Flat_Bench_Cable_Flyes",
  },
  "chest-dips": {
    image: require('../assets/exercises/images/dipschestversion.jpg'),
    sourceExerciseName: "Dips - Chest Version",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dips_-_Chest_Version",
  },
  "lat-pulldown": {
    image: require('../assets/exercises/images/onearmlatpulldown.jpg'),
    sourceExerciseName: "One Arm Lat Pulldown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One_Arm_Lat_Pulldown",
  },
  "pull-ups": {
    image: require('../assets/exercises/images/pullups.jpg'),
    sourceExerciseName: "Pullups",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Pullups",
  },
  "barbell-row": {
    image: require('../assets/exercises/images/bentoverbarbellrow.jpg'),
    sourceExerciseName: "Bent Over Barbell Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Bent_Over_Barbell_Row",
  },
  "seated-cable-row": {
    image: require('../assets/exercises/images/seatedcablerows.jpg'),
    sourceExerciseName: "Seated Cable Rows",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Seated_Cable_Rows",
  },
  "shoulder-press": {
    image: require('../assets/exercises/images/barbellshoulderpress.jpg'),
    sourceExerciseName: "Barbell Shoulder Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Shoulder_Press",
  },
  "military-press": {
    image: require('../assets/exercises/images/barbellshoulderpress.jpg'),
    sourceExerciseName: "Barbell Shoulder Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Shoulder_Press",
  },
  "lateral-raises": {
    image: require('../assets/exercises/images/sidelateralraise.jpg'),
    sourceExerciseName: "Side Lateral Raise",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Side_Lateral_Raise",
  },
  "reverse-fly": {
    image: require('../assets/exercises/images/reverseflyes.jpg'),
    sourceExerciseName: "Reverse Flyes",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Reverse_Flyes",
  },
  "bicep-curl": {
    image: require('../assets/exercises/images/barbellcurl.jpg'),
    sourceExerciseName: "Barbell Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Curl",
  },
  "hammer-curl": {
    image: require('../assets/exercises/images/hammercurls.jpg'),
    sourceExerciseName: "Hammer Curls",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Hammer_Curls",
  },
  "triceps-pushdown": {
    image: require('../assets/exercises/images/tricepspushdown.jpg'),
    sourceExerciseName: "Triceps Pushdown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Triceps_Pushdown",
  },
  "skull-crushers": {
    image: require('../assets/exercises/images/ezbarskullcrusher.jpg'),
    sourceExerciseName: "EZ-Bar Skullcrusher",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/EZ-Bar_Skullcrusher",
  },
  "squats": {
    image: require('../assets/exercises/images/barbellfullsquat.jpg'),
    sourceExerciseName: "Barbell Full Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Full_Squat",
  },
  "leg-press": {
    image: require('../assets/exercises/images/legpress.jpg'),
    sourceExerciseName: "Leg Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Leg_Press",
  },
  "leg-extension": {
    image: require('../assets/exercises/images/legextensions.jpg'),
    sourceExerciseName: "Leg Extensions",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Leg_Extensions",
  },
  "romanian-deadlift": {
    image: require('../assets/exercises/images/romaniandeadlift.jpg'),
    sourceExerciseName: "Romanian Deadlift",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Romanian_Deadlift",
  },
  "leg-curl": {
    image: require('../assets/exercises/images/seatedlegcurl.jpg'),
    sourceExerciseName: "Seated Leg Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Seated_Leg_Curl",
  },
  "calf-raises": {
    image: require('../assets/exercises/images/donkeycalfraises.jpg'),
    sourceExerciseName: "Donkey Calf Raises",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Donkey_Calf_Raises",
  },
  "plank": {
    image: require('../assets/exercises/images/plank.jpg'),
    sourceExerciseName: "Plank",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Plank",
  },
  "treadmill-run": {
    image: require('../assets/exercises/images/runningtreadmill.jpg'),
    sourceExerciseName: "Running, Treadmill",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Running_Treadmill",
  },
  "stationary-cycling": {
    image: require('../assets/exercises/images/bicyclingstationary.jpg'),
    sourceExerciseName: "Bicycling, Stationary",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Bicycling_Stationary",
  },
  "jump-rope": {
    image: require('../assets/exercises/images/ropejumping.jpg'),
    sourceExerciseName: "Rope Jumping",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Rope_Jumping",
  },
  "incline-bench-press": {
    image: require('../assets/exercises/images/barbellinclinebenchpressmediumgrip.jpg'),
    sourceExerciseName: "Barbell Incline Bench Press - Medium Grip",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Incline_Bench_Press_-_Medium_Grip",
  },
  "decline-bench-press": {
    image: require('../assets/exercises/images/declinebarbellbenchpress.jpg'),
    sourceExerciseName: "Decline Barbell Bench Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Decline_Barbell_Bench_Press",
  },
  "push-ups": {
    image: require('../assets/exercises/images/pushups.jpg'),
    sourceExerciseName: "Pushups",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Pushups",
  },
  "decline-dumbbell-press": {
    image: require('../assets/exercises/images/declinedumbbellbenchpress.jpg'),
    sourceExerciseName: "Decline Dumbbell Bench Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Decline_Dumbbell_Bench_Press",
  },
  "pec-deck-fly": {
    image: require('../assets/exercises/images/butterfly.jpg'),
    sourceExerciseName: "Butterfly",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Butterfly",
  },
  "chest-supported-row": {
    image: require('../assets/exercises/images/dumbbellinclinerow.jpg'),
    sourceExerciseName: "Dumbbell Incline Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Incline_Row",
  },
  "single-arm-dumbbell-row": {
    image: require('../assets/exercises/images/onearmdumbbellrow.jpg'),
    sourceExerciseName: "One-Arm Dumbbell Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One-Arm_Dumbbell_Row",
  },
  "face-pull": {
    image: require('../assets/exercises/images/facepull.jpg'),
    sourceExerciseName: "Face Pull",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Face_Pull",
  },
  "preacher-curl": {
    image: require('../assets/exercises/images/preachercurl.jpg'),
    sourceExerciseName: "Preacher Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Preacher_Curl",
  },
  "incline-dumbbell-curl": {
    image: require('../assets/exercises/images/inclinedumbbellcurl.jpg'),
    sourceExerciseName: "Incline Dumbbell Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Incline_Dumbbell_Curl",
  },
  "cable-biceps-curl": {
    image: require('../assets/exercises/images/standingbicepscablecurl.jpg'),
    sourceExerciseName: "Standing Biceps Cable Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_Biceps_Cable_Curl",
  },
  "overhead-triceps-extension": {
    image: require('../assets/exercises/images/cableropeoverheadtricepsextension.jpg'),
    sourceExerciseName: "Cable Rope Overhead Triceps Extension",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Rope_Overhead_Triceps_Extension",
  },
  "close-grip-bench-press": {
    image: require('../assets/exercises/images/closegripbarbellbenchpress.jpg'),
    sourceExerciseName: "Close-Grip Barbell Bench Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Close-Grip_Barbell_Bench_Press",
  },
  "triceps-kickback": {
    image: require('../assets/exercises/images/tricepdumbbellkickback.jpg'),
    sourceExerciseName: "Tricep Dumbbell Kickback",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Tricep_Dumbbell_Kickback",
  },
  "arnold-press": {
    image: require('../assets/exercises/images/arnolddumbbellpress.jpg'),
    sourceExerciseName: "Arnold Dumbbell Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Arnold_Dumbbell_Press",
  },
  "cable-lateral-raise": {
    image: require('../assets/exercises/images/cableseatedlateralraise.jpg'),
    sourceExerciseName: "Cable Seated Lateral Raise",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Seated_Lateral_Raise",
  },
  "dumbbell-shrugs": {
    image: require('../assets/exercises/images/dumbbellshrug.jpg'),
    sourceExerciseName: "Dumbbell Shrug",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Shrug",
  },
  "bulgarian-split-squat": {
    image: require('../assets/exercises/images/barbellsidesplitsquat.jpg'),
    sourceExerciseName: "Barbell Side Split Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Side_Split_Squat",
  },
  "hip-thrust": {
    image: require('../assets/exercises/images/barbellhipthrust.jpg'),
    sourceExerciseName: "Barbell Hip Thrust",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Hip_Thrust",
  },
  "seated-calf-raise": {
    image: require('../assets/exercises/images/seatedcalfraise.jpg'),
    sourceExerciseName: "Seated Calf Raise",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Seated_Calf_Raise",
  },
  "goblet-squat": {
    image: require('../assets/exercises/images/gobletsquat.jpg'),
    sourceExerciseName: "Goblet Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Goblet_Squat",
  },
  "elliptical": {
    image: require('../assets/exercises/images/ellipticaltrainer.jpg'),
    sourceExerciseName: "Elliptical Trainer",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Elliptical_Trainer",
  },
  "rowing-machine": {
    image: require('../assets/exercises/images/rowingstationary.jpg'),
    sourceExerciseName: "Rowing, Stationary",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Rowing_Stationary",
  },
  "incline-walk": {
    image: require('../assets/exercises/images/walkingtreadmill.jpg'),
    sourceExerciseName: "Walking, Treadmill",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Walking_Treadmill",
  },
  "dead-bug": {
    image: require('../assets/exercises/images/deadbug.jpg'),
    sourceExerciseName: "Dead Bug",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dead_Bug",
  },
  "cable-woodchop": {
    image: require('../assets/exercises/images/standingcablewoodchop.jpg'),
    sourceExerciseName: "Standing Cable Wood Chop",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_Cable_Wood_Chop",
  },
  "hanging-knee-raise": {
    image: require('../assets/exercises/images/hanginglegraise.jpg'),
    sourceExerciseName: "Hanging Leg Raise",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Hanging_Leg_Raise",
  },
  "wide-grip-lat-pulldown": {
    image: require('../assets/exercises/images/widegriplatpulldown.jpg'),
    sourceExerciseName: "Wide-Grip Lat Pulldown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Wide-Grip_Lat_Pulldown",
  },
  "close-grip-lat-pulldown": {
    image: require('../assets/exercises/images/closegripfrontlatpulldown.jpg'),
    sourceExerciseName: "Close-Grip Front Lat Pulldown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Close-Grip_Front_Lat_Pulldown",
  },
  "neutral-grip-lat-pulldown": {
    image: require('../assets/exercises/images/widegriplatpulldown.jpg'),
    sourceExerciseName: "Wide-Grip Lat Pulldown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Wide-Grip_Lat_Pulldown",
  },
  "reverse-grip-lat-pulldown": {
    image: require('../assets/exercises/images/widegriplatpulldown.jpg'),
    sourceExerciseName: "Wide-Grip Lat Pulldown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Wide-Grip_Lat_Pulldown",
  },
  "single-arm-lat-pulldown": {
    image: require('../assets/exercises/images/onearmlatpulldown.jpg'),
    sourceExerciseName: "One Arm Lat Pulldown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One_Arm_Lat_Pulldown",
  },
  "v-bar-seated-cable-row": {
    image: require('../assets/exercises/images/dumbbellinclinerow.jpg'),
    sourceExerciseName: "Dumbbell Incline Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Incline_Row",
  },
  "wide-grip-seated-cable-row": {
    image: require('../assets/exercises/images/onearmdumbbellrow.jpg'),
    sourceExerciseName: "One-Arm Dumbbell Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One-Arm_Dumbbell_Row",
  },
  "rope-triceps-pushdown": {
    image: require('../assets/exercises/images/tricepspushdown.jpg'),
    sourceExerciseName: "Triceps Pushdown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Triceps_Pushdown",
  },
  "straight-bar-triceps-pushdown": {
    image: require('../assets/exercises/images/tricepspushdown.jpg'),
    sourceExerciseName: "Triceps Pushdown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Triceps_Pushdown",
  },
  "v-bar-triceps-pushdown": {
    image: require('../assets/exercises/images/tricepspushdown.jpg'),
    sourceExerciseName: "Triceps Pushdown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Triceps_Pushdown",
  },
  "reverse-grip-triceps-pushdown": {
    image: require('../assets/exercises/images/reversegriptricepspushdown.jpg'),
    sourceExerciseName: "Reverse Grip Triceps Pushdown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Reverse_Grip_Triceps_Pushdown",
  },
  "single-arm-rope-triceps-pushdown": {
    image: require('../assets/exercises/images/tricepspushdown.jpg'),
    sourceExerciseName: "Triceps Pushdown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Triceps_Pushdown",
  },
  "rope-overhead-triceps-extension": {
    image: require('../assets/exercises/images/cableropeoverheadtricepsextension.jpg'),
    sourceExerciseName: "Cable Rope Overhead Triceps Extension",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Rope_Overhead_Triceps_Extension",
  },
  "ez-bar-cable-curl": {
    image: require('../assets/exercises/images/ezbarcurl.jpg'),
    sourceExerciseName: "EZ-Bar Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/EZ-Bar_Curl",
  },
  "rope-cable-hammer-curl": {
    image: require('../assets/exercises/images/crossbodyhammercurl.jpg'),
    sourceExerciseName: "Cross Body Hammer Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cross_Body_Hammer_Curl",
  },
  "single-arm-cable-curl": {
    image: require('../assets/exercises/images/standingonearmcablecurl.jpg'),
    sourceExerciseName: "Standing One-Arm Cable Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_One-Arm_Cable_Curl",
  },
  "low-to-high-cable-fly": {
    image: require('../assets/exercises/images/flatbenchcableflyes.jpg'),
    sourceExerciseName: "Flat Bench Cable Flyes",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Flat_Bench_Cable_Flyes",
  },
  "high-to-low-cable-fly": {
    image: require('../assets/exercises/images/inclinecableflye.jpg'),
    sourceExerciseName: "Incline Cable Flye",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Incline_Cable_Flye",
  },
  "rope-face-pull": {
    image: require('../assets/exercises/images/facepull.jpg'),
    sourceExerciseName: "Face Pull",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Face_Pull",
  },
  "single-arm-cable-lateral-raise": {
    image: require('../assets/exercises/images/onearminclinelateralraise.jpg'),
    sourceExerciseName: "One-Arm Incline Lateral Raise",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One-Arm_Incline_Lateral_Raise",
  },
  "bent-over-dumbbell-row": {
    image: require('../assets/exercises/images/bentoverbarbellrow.jpg'),
    sourceExerciseName: "Bent Over Barbell Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Bent_Over_Barbell_Row",
  },
  "t-bar-row": {
    image: require('../assets/exercises/images/lyingtbarrow.jpg'),
    sourceExerciseName: "Lying T-Bar Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Lying_T-Bar_Row",
  },
  "pendlay-row": {
    image: require('../assets/exercises/images/onearmdumbbellrow.jpg'),
    sourceExerciseName: "One-Arm Dumbbell Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One-Arm_Dumbbell_Row",
  },
  "landmine-row": {
    image: require('../assets/exercises/images/dumbbellinclinerow.jpg'),
    sourceExerciseName: "Dumbbell Incline Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Incline_Row",
  },
  "inverted-row": {
    image: require('../assets/exercises/images/invertedrow.jpg'),
    sourceExerciseName: "Inverted Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Inverted_Row",
  },
  "machine-row": {
    image: require('../assets/exercises/images/dumbbellinclinerow.jpg'),
    sourceExerciseName: "Dumbbell Incline Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Incline_Row",
  },
  "single-arm-cable-row": {
    image: require('../assets/exercises/images/onearmdumbbellrow.jpg'),
    sourceExerciseName: "One-Arm Dumbbell Row",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One-Arm_Dumbbell_Row",
  },
  "straight-arm-cable-pulldown": {
    image: require('../assets/exercises/images/straightarmpulldown.jpg'),
    sourceExerciseName: "Straight-Arm Pulldown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Straight-Arm_Pulldown",
  },
  "rope-straight-arm-pulldown": {
    image: require('../assets/exercises/images/ropestraightarmpulldown.jpg'),
    sourceExerciseName: "Rope Straight-Arm Pulldown",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Rope_Straight-Arm_Pulldown",
  },
  "dumbbell-pullover": {
    image: require('../assets/exercises/images/bentarmbarbellpullover.jpg'),
    sourceExerciseName: "Bent-Arm Barbell Pullover",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Bent-Arm_Barbell_Pullover",
  },
  "back-extension": {
    image: require('../assets/exercises/images/hyperextensionsbackextensions.jpg'),
    sourceExerciseName: "Hyperextensions (Back Extensions)",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Hyperextensions_Back_Extensions",
  },
  "straight-bar-cable-curl": {
    image: require('../assets/exercises/images/standingonearmcablecurl.jpg'),
    sourceExerciseName: "Standing One-Arm Cable Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_One-Arm_Cable_Curl",
  },
  "rope-cable-biceps-curl": {
    image: require('../assets/exercises/images/standingbicepscablecurl.jpg'),
    sourceExerciseName: "Standing Biceps Cable Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_Biceps_Cable_Curl",
  },
  "high-cable-curl": {
    image: require('../assets/exercises/images/lyingcablecurl.jpg'),
    sourceExerciseName: "Lying Cable Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Lying_Cable_Curl",
  },
  "bayesian-cable-curl": {
    image: require('../assets/exercises/images/lyingcablecurl.jpg'),
    sourceExerciseName: "Lying Cable Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Lying_Cable_Curl",
  },
  "cable-preacher-curl": {
    image: require('../assets/exercises/images/cablepreachercurl.jpg'),
    sourceExerciseName: "Cable Preacher Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Preacher_Curl",
  },
  "dumbbell-preacher-curl": {
    image: require('../assets/exercises/images/onearmdumbbellpreachercurl.jpg'),
    sourceExerciseName: "One Arm Dumbbell Preacher Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One_Arm_Dumbbell_Preacher_Curl",
  },
  "dumbbell-skull-crusher": {
    image: require('../assets/exercises/images/bandskullcrusher.jpg'),
    sourceExerciseName: "Band Skull Crusher",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Band_Skull_Crusher",
  },
  "straight-bar-overhead-cable-triceps-extension": {
    image: require('../assets/exercises/images/standingoverheadbarbelltricepsextension.jpg'),
    sourceExerciseName: "Standing Overhead Barbell Triceps Extension",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_Overhead_Barbell_Triceps_Extension",
  },
  "cable-reverse-curl": {
    image: require('../assets/exercises/images/cablepreachercurl.jpg'),
    sourceExerciseName: "Cable Preacher Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Preacher_Curl",
  },
  "ez-bar-curl": {
    image: require('../assets/exercises/images/ezbarcurl.jpg'),
    sourceExerciseName: "EZ-Bar Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/EZ-Bar_Curl",
  },
  "alternating-dumbbell-curl": {
    image: require('../assets/exercises/images/seateddumbbellcurl.jpg'),
    sourceExerciseName: "Seated Dumbbell Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Seated_Dumbbell_Curl",
  },
  "cross-body-hammer-curl": {
    image: require('../assets/exercises/images/crossbodyhammercurl.jpg'),
    sourceExerciseName: "Cross Body Hammer Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cross_Body_Hammer_Curl",
  },
  "concentration-curl": {
    image: require('../assets/exercises/images/standingconcentrationcurl.jpg'),
    sourceExerciseName: "Standing Concentration Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_Concentration_Curl",
  },
  "spider-curl": {
    image: require('../assets/exercises/images/spidercurl.jpg'),
    sourceExerciseName: "Spider Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Spider_Curl",
  },
  "zottman-curl": {
    image: require('../assets/exercises/images/zottmancurl.jpg'),
    sourceExerciseName: "Zottman Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Zottman_Curl",
  },
  "conventional-deadlift": {
    image: require('../assets/exercises/images/onearmsidedeadlift.jpg'),
    sourceExerciseName: "One-Arm Side Deadlift",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/One-Arm_Side_Deadlift",
  },
  "sumo-deadlift": {
    image: require('../assets/exercises/images/sumodeadlift.jpg'),
    sourceExerciseName: "Sumo Deadlift",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Sumo_Deadlift",
  },
  "trap-bar-deadlift": {
    image: require('../assets/exercises/images/trapbardeadlift.jpg'),
    sourceExerciseName: "Trap Bar Deadlift",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Trap_Bar_Deadlift",
  },
  "dumbbell-romanian-deadlift": {
    image: require('../assets/exercises/images/romaniandeadlift.jpg'),
    sourceExerciseName: "Romanian Deadlift",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Romanian_Deadlift",
  },
  "single-leg-romanian-deadlift": {
    image: require('../assets/exercises/images/romaniandeadlift.jpg'),
    sourceExerciseName: "Romanian Deadlift",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Romanian_Deadlift",
  },
  "stiff-leg-deadlift": {
    image: require('../assets/exercises/images/stiffleggedbarbelldeadlift.jpg'),
    sourceExerciseName: "Stiff-Legged Barbell Deadlift",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Stiff-Legged_Barbell_Deadlift",
  },
  "rack-pull": {
    image: require('../assets/exercises/images/snatchpull.jpg'),
    sourceExerciseName: "Snatch Pull",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Snatch_Pull",
  },
  "machine-chest-press": {
    image: require('../assets/exercises/images/cablechestpress.jpg'),
    sourceExerciseName: "Cable Chest Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Chest_Press",
  },
  "smith-machine-bench-press": {
    image: require('../assets/exercises/images/smithmachinebenchpress.jpg'),
    sourceExerciseName: "Smith Machine Bench Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Smith_Machine_Bench_Press",
  },
  "incline-cable-fly": {
    image: require('../assets/exercises/images/inclinecableflye.jpg'),
    sourceExerciseName: "Incline Cable Flye",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Incline_Cable_Flye",
  },
  "decline-cable-fly": {
    image: require('../assets/exercises/images/inclinecableflye.jpg'),
    sourceExerciseName: "Incline Cable Flye",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Incline_Cable_Flye",
  },
  "seated-dumbbell-shoulder-press": {
    image: require('../assets/exercises/images/dumbbellshoulderpress.jpg'),
    sourceExerciseName: "Dumbbell Shoulder Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Shoulder_Press",
  },
  "machine-shoulder-press": {
    image: require('../assets/exercises/images/cableshoulderpress.jpg'),
    sourceExerciseName: "Cable Shoulder Press",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Shoulder_Press",
  },
  "cable-rear-delt-fly": {
    image: require('../assets/exercises/images/cablereardeltfly.jpg'),
    sourceExerciseName: "Cable Rear Delt Fly",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Rear_Delt_Fly",
  },
  "reverse-pec-deck": {
    image: require('../assets/exercises/images/reverseflyes.jpg'),
    sourceExerciseName: "Reverse Flyes",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Reverse_Flyes",
  },
  "dumbbell-front-raise": {
    image: require('../assets/exercises/images/dumbbellraise.jpg'),
    sourceExerciseName: "Dumbbell Raise",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Raise",
  },
  "assisted-triceps-dip": {
    image: require('../assets/exercises/images/overheadtriceps.jpg'),
    sourceExerciseName: "Overhead Triceps",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Overhead_Triceps",
  },
  "single-arm-overhead-cable-extension": {
    image: require('../assets/exercises/images/standingoverheadbarbelltricepsextension.jpg'),
    sourceExerciseName: "Standing Overhead Barbell Triceps Extension",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_Overhead_Barbell_Triceps_Extension",
  },
  "dumbbell-overhead-triceps-extension": {
    image: require('../assets/exercises/images/dumbbellonearmtricepsextension.jpg'),
    sourceExerciseName: "Dumbbell One-Arm Triceps Extension",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_One-Arm_Triceps_Extension",
  },
  "dumbbell-squat": {
    image: require('../assets/exercises/images/dumbbellsquat.jpg'),
    sourceExerciseName: "Dumbbell Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Squat",
  },
  "sumo-squat": {
    image: require('../assets/exercises/images/boxsquat.jpg'),
    sourceExerciseName: "Box Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Box_Squat",
  },
  "smith-machine-squat": {
    image: require('../assets/exercises/images/smithmachinesquat.jpg'),
    sourceExerciseName: "Smith Machine Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Smith_Machine_Squat",
  },
  "box-squat": {
    image: require('../assets/exercises/images/boxsquat.jpg'),
    sourceExerciseName: "Box Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Box_Squat",
  },
  "pause-squat": {
    image: require('../assets/exercises/images/barbellsquat.jpg'),
    sourceExerciseName: "Barbell Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Squat",
  },
  "safety-bar-squat": {
    image: require('../assets/exercises/images/frontbarbellsquat.jpg'),
    sourceExerciseName: "Front Barbell Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Front_Barbell_Squat",
  },
  "front-squat": {
    image: require('../assets/exercises/images/frontbarbellsquat.jpg'),
    sourceExerciseName: "Front Barbell Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Front_Barbell_Squat",
  },
  "hack-squat": {
    image: require('../assets/exercises/images/hacksquat.jpg'),
    sourceExerciseName: "Hack Squat",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Hack_Squat",
  },
  "lying-leg-curl": {
    image: require('../assets/exercises/images/standinglegcurl.jpg'),
    sourceExerciseName: "Standing Leg Curl",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Standing_Leg_Curl",
  },
  "seated-leg-extension": {
    image: require('../assets/exercises/images/singleleglegextension.jpg'),
    sourceExerciseName: "Single-Leg Leg Extension",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Single-Leg_Leg_Extension",
  },
  "dumbbell-step-up": {
    image: require('../assets/exercises/images/dumbbellstepups.jpg'),
    sourceExerciseName: "Dumbbell Step Ups",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Dumbbell_Step_Ups",
  },
  "walking-lunge": {
    image: require('../assets/exercises/images/barbellwalkinglunge.jpg'),
    sourceExerciseName: "Barbell Walking Lunge",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Walking_Lunge",
  },
  "cable-glute-kickback": {
    image: require('../assets/exercises/images/glutekickback.jpg'),
    sourceExerciseName: "Glute Kickback",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Glute_Kickback",
  },
  "hip-adduction-machine": {
    image: require('../assets/exercises/images/cablehipadduction.jpg'),
    sourceExerciseName: "Cable Hip Adduction",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Hip_Adduction",
  },
  "hip-abduction-machine": {
    image: require('../assets/exercises/images/thighabductor.jpg'),
    sourceExerciseName: "Thigh Abductor",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Thigh_Abductor",
  },
  "cable-crunch": {
    image: require('../assets/exercises/images/cablecrunch.jpg'),
    sourceExerciseName: "Cable Crunch",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Cable_Crunch",
  },
  "ab-wheel-rollout": {
    image: require('../assets/exercises/images/barbellabrollout.jpg'),
    sourceExerciseName: "Barbell Ab Rollout",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Barbell_Ab_Rollout",
  },
  "reverse-crunch": {
    image: require('../assets/exercises/images/reversecrunch.jpg'),
    sourceExerciseName: "Reverse Crunch",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Reverse_Crunch",
  },
  "side-plank": {
    image: require('../assets/exercises/images/plank.jpg'),
    sourceExerciseName: "Plank",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Plank",
  },
  "stair-climber": {
    image: require('../assets/exercises/images/stairmaster.jpg'),
    sourceExerciseName: "Stairmaster",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Stairmaster",
  },
  "burpees": {
    image: require('../assets/exercises/images/mountainclimbers.jpg'),
    sourceExerciseName: "Mountain Climbers",
    sourceUrl: "https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/Mountain_Climbers",
  },
};

export { exerciseImageReferences, licenseUrl };
